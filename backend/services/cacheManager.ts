import { prisma } from "./database.ts";

// Configuração de TTL
export const CACHE_CONFIG = {
  PRICE_INTERVAL_MS: 60 * 1000,      // 1 minuto para preços
  ITEM_TTL_MS: 60 * 60 * 1000,       // 1 hora para items
} as const;

// Estado interno do cache
interface CacheState {
  lastPriceUpdate: number;
  lastItemCacheUpdate: number;
  itemIds: Set<number> | null;
  itemsByName: Map<string, { id: number; name: string }> | null;
  ongoingPriceFetch: Promise<void> | null;
}

const state: CacheState = {
  lastPriceUpdate: 0,
  lastItemCacheUpdate: 0,
  itemIds: null,
  itemsByName: null,
  ongoingPriceFetch: null,
};

// Getters para estado (read-only)
export function getLastPriceUpdate(): number {
  return state.lastPriceUpdate;
}

export function setLastPriceUpdate(timestamp: number): void {
  state.lastPriceUpdate = timestamp;
}

export function getOngoingPriceFetch(): Promise<void> | null {
  return state.ongoingPriceFetch;
}

export function setOngoingPriceFetch(promise: Promise<void> | null): void {
  state.ongoingPriceFetch = promise;
}

// Verifica se o cache de items expirou
export function isItemCacheExpired(): boolean {
  return Date.now() - state.lastItemCacheUpdate > CACHE_CONFIG.ITEM_TTL_MS;
}

// Invalida caches de items
export function invalidateItemCaches(): void {
  state.itemIds = null;
  state.itemsByName = null;
  console.log("🔄 Cache de items invalidado");
}

// Garante que o cache de items está carregado
async function ensureItemCacheLoaded(): Promise<void> {
  if (state.itemsByName && !isItemCacheExpired()) {
    return;
  }

  console.log("🔄 Carregando cache de items em memória...");
  const items = await prisma.item.findMany({
    select: { id: true, name: true },
  });

  state.itemsByName = new Map();
  state.itemIds = new Set();

  items.forEach((item) => {
    state.itemsByName!.set(item.name.toLowerCase(), item);
    state.itemIds!.add(item.id);
  });

  state.lastItemCacheUpdate = Date.now();
  console.log(`✅ Cache de items criado: ${state.itemsByName.size} items em memória`);
}

// Obtém IDs válidos de items (com cache)
export async function getExistingItemIds(): Promise<Set<number>> {
  await ensureItemCacheLoaded();
  return state.itemIds!;
}

// Obtém item por nome (com cache)
export async function getItemByName(
  itemName: string
): Promise<{ id: number; name: string } | null> {
  await ensureItemCacheLoaded();
  return state.itemsByName!.get(itemName.toLowerCase()) ?? null;
}

// Pesquisa items por query (para autocomplete)
export async function searchItemsInCache(
  query: string,
  limit: number = 10
): Promise<Array<{ id: number; name: string }>> {
  await ensureItemCacheLoaded();

  const queryLower = query.toLowerCase();
  const results: Array<{ id: number; name: string }> = [];

  // Prioridade 1: Items que começam com a query
  for (const [nameLower, item] of state.itemsByName!) {
    if (nameLower.startsWith(queryLower)) {
      results.push(item);
      if (results.length >= limit) return results;
    }
  }

  // Prioridade 2: Items que contêm a query
  for (const [nameLower, item] of state.itemsByName!) {
    if (!nameLower.startsWith(queryLower) && nameLower.includes(queryLower)) {
      results.push(item);
      if (results.length >= limit) return results;
    }
  }

  return results;
}

// Estatísticas do cache (para status endpoint)
export function getCacheStats() {
  return {
    cachedItemIdsSize: state.itemIds?.size ?? 0,
    cachedItemsSize: state.itemsByName?.size ?? 0,
    isFetching: state.ongoingPriceFetch !== null,
    lastPriceUpdate: state.lastPriceUpdate,
    cacheAge: state.lastPriceUpdate
      ? Math.floor((Date.now() - state.lastPriceUpdate) / 1000)
      : -1,
  };
}
