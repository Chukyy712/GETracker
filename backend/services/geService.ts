import { prisma, disconnectDatabase } from "./database.ts";
import {
  CACHE_CONFIG,
  getLastPriceUpdate,
  setLastPriceUpdate,
  getOngoingPriceFetch,
  setOngoingPriceFetch,
  getExistingItemIds,
  getItemByName,
  searchItemsInCache,
  getCacheStats,
} from "./cacheManager.ts";
import { fetchLatestPrices } from "./wikiApi.ts";

// Auto-update interval
let autoUpdateInterval: NodeJS.Timeout | null = null;

// Atualiza preços na base de dados
async function updateLatestPrices(force: boolean = false): Promise<void> {
  const now = Date.now();

  // Verifica se precisa atualizar
  if (!force && now - getLastPriceUpdate() < CACHE_CONFIG.PRICE_INTERVAL_MS) {
    return;
  }

  // Se já está a atualizar, aguarda
  const ongoingFetch = getOngoingPriceFetch();
  if (ongoingFetch) {
    console.log("⏳ Update já em andamento...");
    return ongoingFetch;
  }

  const fetchPromise = (async () => {
    try {
      const prices = await fetchLatestPrices();
      const existingItemIds = await getExistingItemIds();

      // Filtra apenas items que existem na DB
      const validPrices = prices.filter((p) => existingItemIds.has(p.itemId));

      if (validPrices.length > 0) {
        let insertedCount = 0;
        let errorCount = 0;

        await Promise.all(
          validPrices.map((price) =>
            prisma.price
              .create({ data: price })
              .then(() => {
                insertedCount++;
              })
              .catch((err: unknown) => {
                // P2002 = Unique constraint (duplicado) - ignorar
                const isPrismaError =
                  err !== null && typeof err === "object" && "code" in err;
                if (!isPrismaError || err.code !== "P2002") {
                  errorCount++;
                  console.error(`❌ Erro item ${price.itemId}:`, err);
                }
              })
          )
        );

        if (errorCount > 0) {
          console.warn(`⚠️ ${errorCount} erros durante inserção`);
        }

        const ignoredCount = prices.length - validPrices.length;
        console.log(
          `✅ ${validPrices.length} preços inseridos` +
            (ignoredCount > 0 ? ` (${ignoredCount} ignorados)` : "")
        );
      }

      setLastPriceUpdate(now);
    } catch (error) {
      console.error("❌ Erro ao atualizar preços:", error);
      // Retry em 30 segundos se primeira vez
      if (getLastPriceUpdate() === 0) {
        setLastPriceUpdate(now - (CACHE_CONFIG.PRICE_INTERVAL_MS - 30000));
      }
    } finally {
      setOngoingPriceFetch(null);
    }
  })();

  setOngoingPriceFetch(fetchPromise);
  return fetchPromise;
}

// Auto-update: atualiza preços automaticamente
export function startAutoUpdate(): void {
  if (autoUpdateInterval) {
    console.log("⚠️ Auto-update já está ativo");
    return;
  }

  const intervalSeconds = CACHE_CONFIG.PRICE_INTERVAL_MS / 1000;
  console.log(`🤖 Auto-update ativado! Intervalo: ${intervalSeconds}s`);

  // Primeira atualização imediata
  updateLatestPrices(true).catch((err) =>
    console.error("Erro na primeira atualização:", err)
  );

  // Atualiza a cada intervalo
  autoUpdateInterval = setInterval(() => {
    updateLatestPrices(true).catch((err) =>
      console.error("Erro no auto-update:", err)
    );
  }, CACHE_CONFIG.PRICE_INTERVAL_MS);
}

export function stopAutoUpdate(): void {
  if (autoUpdateInterval) {
    clearInterval(autoUpdateInterval);
    autoUpdateInterval = null;
    console.log("🛑 Auto-update desativado");
  }
}

// Obtém preço atual de um item
export async function getPrice(itemName: string): Promise<number | null> {
  const item = await getItemByName(itemName);

  if (!item) {
    console.log(`⚠️ Item não encontrado: ${itemName}`);
    return null;
  }

  // Busca último preço
  let latestPrice = await prisma.price.findFirst({
    where: { itemId: item.id },
    orderBy: { timestamp: "desc" },
  });

  // Se não existe preço, força atualização
  if (!latestPrice) {
    console.log(`⏱️ Sem preço para "${itemName}". Buscando...`);
    await updateLatestPrices(true);

    latestPrice = await prisma.price.findFirst({
      where: { itemId: item.id },
      orderBy: { timestamp: "desc" },
    });

    if (!latestPrice) {
      console.log(`⚠️ Preço indisponível: ${itemName} (ID: ${item.id})`);
      return null;
    }
  }

  return Math.round((latestPrice.high + latestPrice.low) / 2);
}

// Obtém histórico de preços para gráficos
export async function getPriceHistory(
  itemName: string,
  hoursBack: number = 24
): Promise<Array<{
  timestamp: Date;
  high: number;
  low: number;
  average: number;
}> | null> {
  const item = await getItemByName(itemName);

  if (!item) {
    return null;
  }

  const startTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000);

  const prices = await prisma.price.findMany({
    where: {
      itemId: item.id,
      timestamp: { gte: startTime },
    },
    orderBy: { timestamp: "asc" },
  });

  return prices.map((p) => ({
    timestamp: p.timestamp,
    high: p.high,
    low: p.low,
    average: Math.round((p.high + p.low) / 2),
  }));
}

// Pesquisa items (para autocomplete)
export async function searchItems(
  query: string,
  limit: number = 10
): Promise<Array<{ id: number; name: string }>> {
  return searchItemsInCache(query, limit);
}

// Status do sistema
export async function getSystemStatus() {
  const totalItems = await prisma.item.count();
  const totalPrices = await prisma.price.count();
  const latestPriceRecord = await prisma.price.findFirst({
    orderBy: { timestamp: "desc" },
  });

  const cacheStats = getCacheStats();
  const lastUpdate = latestPriceRecord?.timestamp;

  return {
    itemsLoaded: totalItems,
    pricesLoaded: totalPrices,
    lastUpdate: lastUpdate ? lastUpdate.toISOString() : "Nunca",
    cacheAge: cacheStats.cacheAge,
    cacheAgeSeconds: cacheStats.cacheAge,
    cacheIntervalSeconds: CACHE_CONFIG.PRICE_INTERVAL_MS / 1000,
    isHealthy: totalItems > 0 && totalPrices > 0,
    isFetching: cacheStats.isFetching,
    autoUpdateActive: autoUpdateInterval !== null,
    cachedItemIdsSize: cacheStats.cachedItemIdsSize,
    cachedItemsSize: cacheStats.cachedItemsSize,
  };
}

// Cleanup para encerramento gracioso
export async function cleanup(): Promise<void> {
  stopAutoUpdate();
  await disconnectDatabase();
}
