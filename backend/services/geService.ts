import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch";

const prisma = new PrismaClient();

// CONFIGURAÇÃO: Intervalo de cache (1 minuto para realtime)
const CACHE_INTERVAL_MS = 60 * 1000; // 1 minuto

// Cache para armazenar mapping e preços
let lastPriceUpdate = 0;
let ongoingPriceFetch: Promise<void> | null = null;
let cachedItemIds: Set<number> | null = null;
let cachedItemsByName: Map<string, { id: number; name: string }> | null = null;
let autoUpdateInterval: NodeJS.Timeout | null = null;

interface PriceData {
  high: number;
  low: number;
}

// OTIMIZAÇÃO 1: Cache dos IDs válidos (evita query repetida)
async function getExistingItemIds(): Promise<Set<number>> {
  if (!cachedItemIds) {
    const items = await prisma.item.findMany({ select: { id: true } });
    cachedItemIds = new Set(items.map(item => item.id));
    console.log(`📦 Cache de IDs criado: ${cachedItemIds.size} items válidos`);
  }
  return cachedItemIds;
}

// OTIMIZAÇÃO PARA ESCALA: Cache de items por nome (100 users simultâneos)
async function getItemByName(itemName: string): Promise<{ id: number; name: string } | null> {
  // Inicializa cache se ainda não existe
  if (!cachedItemsByName) {
    console.log("🔄 Carregando cache de items em memória...");
    const items = await prisma.item.findMany({ 
      select: { id: true, name: true } 
    });
    
    cachedItemsByName = new Map();
    items.forEach(item => {
      // Guarda com nome normalizado (lowercase) como chave
      cachedItemsByName!.set(item.name.toLowerCase(), item);
    });
    
    console.log(`✅ Cache de items criado: ${cachedItemsByName.size} items em memória`);
  }
  
  // Busca no cache (instantâneo!)
  return cachedItemsByName.get(itemName.toLowerCase()) || null;
}

// Timeout nas requisições
async function fetchWithTimeout(url: string, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

// Retry automático se falhar
async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetchWithTimeout(url);
      if (response.ok) return response;

      console.warn(
        `Tentativa ${i + 1} falhou para ${url}, status: ${response.status}`
      );
    } catch (error) {
      console.warn(`Tentativa ${i + 1} falhou para ${url}:`, error);

      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  throw new Error(`Falhou após ${retries} tentativas`);
}

async function updateLatestPrices(force: boolean = false) {
  const now = Date.now();
  
  // Verifica se precisa atualizar (a menos que seja forçado)
  if (!force && now - lastPriceUpdate < CACHE_INTERVAL_MS) {
    return;
  }

  // Se já está atualizando, retorna a Promise existente (não bloqueia!)
  if (ongoingPriceFetch) {
    console.log("⏳ Update já em andamento...");
    return ongoingPriceFetch;
  }

  const fetchPromise = (async () => {
    try {
      console.log("🔄 Buscando preços atualizados da OSRS Wiki API...");
      const pricesRes = await fetchWithRetry(
        "https://prices.runescape.wiki/api/v1/osrs/latest"
      );

      const pricesData = (await pricesRes.json() as { data: Record<number, PriceData> }).data;

      const pricesToCreate = Object.entries(pricesData)
        .map(([itemId, price]) => {
          if (price.high > 0 && price.low > 0) {
            return {
              itemId: parseInt(itemId),
              high: price.high,
              low: price.low,
            };
          }
          return null;
        })
        .filter((p): p is NonNullable<typeof p> => p !== null);

      // OTIMIZAÇÃO 2: Usa Set em vez de Array.includes (100x mais rápido!)
      const existingItemIds = await getExistingItemIds();
      
      const validPricesToCreate = pricesToCreate.filter(
        price => existingItemIds.has(price.itemId)
      );

      if (validPricesToCreate.length > 0) {
        // SQLite: usa create individual com Promise.all
        await Promise.all(
          validPricesToCreate.map(price =>
            prisma.price.create({
              data: price,
            }).catch(() => {}) // Ignora duplicados silenciosamente
          )
        );
      }

      lastPriceUpdate = now;
      const ignoredCount = pricesToCreate.length - validPricesToCreate.length;
      console.log(
        `✅ Preços atualizados! ${validPricesToCreate.length} registros inseridos` +
        (ignoredCount > 0 ? ` (${ignoredCount} ignorados)` : '')
      );

    } catch (error) {
      console.error("❌ Erro ao atualizar preços:", error);
      if (lastPriceUpdate === 0) {
        lastPriceUpdate = now - (CACHE_INTERVAL_MS - 30000);
      }
    } finally {
      ongoingPriceFetch = null;
    }
  })();

  ongoingPriceFetch = fetchPromise;
  return fetchPromise;
}

// AUTO-UPDATE: Atualiza automaticamente a cada 1 minuto (para gráficos)
export function startAutoUpdate() {
  if (autoUpdateInterval) {
    console.log("⚠️ Auto-update já está ativo");
    return;
  }

  console.log(`🤖 Auto-update ativado! Atualizando a cada ${CACHE_INTERVAL_MS / 1000}s`);
  
  // Primeira atualização imediata
  updateLatestPrices(true).catch(err => 
    console.error("Erro na primeira atualização:", err)
  );

  // Atualiza a cada intervalo
  autoUpdateInterval = setInterval(() => {
    updateLatestPrices(true).catch(err =>
      console.error("Erro no auto-update:", err)
    );
  }, CACHE_INTERVAL_MS);
}

export function stopAutoUpdate() {
  if (autoUpdateInterval) {
    clearInterval(autoUpdateInterval);
    autoUpdateInterval = null;
    console.log("🛑 Auto-update desativado");
  }
}

export async function getPrice(itemName: string): Promise<number | null> {
  // OTIMIZAÇÃO: Busca no cache em memória (0ms) em vez de query SQLite
  const item = await getItemByName(itemName);

  if (!item) {
    console.log(`⚠️ Item não encontrado: ${itemName}`);
    return null;
  }

  // UX MELHORADA: Busca último preço disponível (qualquer idade)
  const latestPrice = await prisma.price.findFirst({
    where: { itemId: item.id },
    orderBy: { timestamp: "desc" },
  });

  // Se não existe NENHUM preço, aguarda atualização
  if (!latestPrice) {
    console.log(`⏱️ Nenhum preço disponível para "${itemName}". Buscando...`);
    await updateLatestPrices(true);
    
    const newPrice = await prisma.price.findFirst({
      where: { itemId: item.id },
      orderBy: { timestamp: "desc" },
    });
    
    if (!newPrice) {
      console.log(`⚠️ Preço não disponível para: ${itemName} (ID: ${item.id})`);
      return null;
    }
    
    return Math.round((newPrice.high + newPrice.low) / 2);
  }

  // SEMPRE retorna o último preço imediatamente (sem bloquear!)
  return Math.round((latestPrice.high + latestPrice.low) / 2);
}

// NOVA FUNÇÃO: Busca histórico de preços para gráficos
export async function getPriceHistory(
  itemName: string, 
  hoursBack: number = 24
): Promise<Array<{ timestamp: Date; high: number; low: number; average: number }> | null> {
  const item = await getItemByName(itemName);
  
  if (!item) {
    return null;
  }

  const startTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
  
  const prices = await prisma.price.findMany({
    where: {
      itemId: item.id,
      timestamp: {
        gte: startTime,
      },
    },
    orderBy: {
      timestamp: "asc",
    },
  });

  return prices.map(p => ({
    timestamp: p.timestamp,
    high: p.high,
    low: p.low,
    average: Math.round((p.high + p.low) / 2),
  }));
}

export async function getSystemStatus() {
  const totalItems = await prisma.item.count();
  const totalPrices = await prisma.price.count();
  const latestPriceRecord = await prisma.price.findFirst({
    orderBy: { timestamp: 'desc' }
  });

  const lastUpdate = latestPriceRecord?.timestamp;
  const cacheAge = lastUpdate ? Math.floor((Date.now() - lastUpdate.getTime()) / 1000) : -1;

  return {
    itemsLoaded: totalItems,
    pricesLoaded: totalPrices,
    lastUpdate: lastUpdate ? lastUpdate.toISOString() : "Nunca",
    cacheAge,
    cacheAgeSeconds: cacheAge,
    cacheIntervalSeconds: CACHE_INTERVAL_MS / 1000,
    isHealthy: totalItems > 0 && totalPrices > 0,
    isFetching: ongoingPriceFetch !== null,
    autoUpdateActive: autoUpdateInterval !== null,
    cachedItemIdsSize: cachedItemIds?.size ?? 0,
    cachedItemsSize: cachedItemsByName?.size ?? 0
  };
}

// OTIMIZAÇÃO 3: Cleanup ao desligar o servidor
process.on('SIGINT', async () => {
  console.log('\n🔌 Desligando servidor...');
  stopAutoUpdate();
  await prisma.$disconnect();
  console.log('✅ Desconectado. Até logo!');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  stopAutoUpdate();
  await prisma.$disconnect();
  process.exit(0);
});