interface Item {
  id: number;
  name: string;
}

interface PriceData {
  high: number;
  low: number;
}

// Cache para armazenar mapping e preços
let itemMapping: Item[] = [];
// CORREÇÃO: Record com chave number, não string!
let latestPrices: Record<number, PriceData> = {};
let lastFetch = 0;

// CORREÇÃO DO BUG: Promise compartilhada em vez de flag booleana
let ongoingFetch: Promise<void> | null = null;

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
      
      console.warn(`Tentativa ${i + 1} falhou para ${url}, status: ${response.status}`);
    } catch (error) {
      console.warn(`Tentativa ${i + 1} falhou para ${url}:`, error);
      
      // Se não for a última tentativa, espera antes de tentar de novo
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // 1s, 2s, 3s
      }
    }
  }
  
  throw new Error(`Falhou após ${retries} tentativas`);
}

async function updateData() {
  const now = Date.now();
  
  // Cache de 5 minutos
  if (now - lastFetch < 5 * 60 * 1000) {
    return;
  }
  
  // CORREÇÃO REAL: Se já existe um fetch em andamento, ESPERA por ele
  if (ongoingFetch) {
    console.log("⏳ Fetch já em andamento, aguardando conclusão...");
    await ongoingFetch; // Espera terminar!
    return;
  }
  
  // PASSO 1: Cria a Promise e guarda a referência
  const fetchPromise = (async () => {
    try {
      console.log("🔄 Buscando dados atualizados da OSRS Wiki API...");
      
      const [mappingRes, pricesRes] = await Promise.all([
        fetchWithRetry("https://prices.runescape.wiki/api/v1/osrs/mapping"),
        fetchWithRetry("https://prices.runescape.wiki/api/v1/osrs/latest"),
      ]);
      
      // Valida se ambas as respostas são JSON
      const mappingContentType = mappingRes.headers.get("content-type");
      const pricesContentType = pricesRes.headers.get("content-type");
      
      if (!mappingContentType?.includes("application/json") || 
          !pricesContentType?.includes("application/json")) {
        throw new Error("API não retornou JSON válido");
      }
      
      const newMapping = await mappingRes.json();
      const pricesData = await pricesRes.json();
      
      // Valida estrutura dos dados
      if (!Array.isArray(newMapping) || !pricesData.data) {
        throw new Error("Estrutura de dados inválida da API");
      }
      
      // Só atualiza se os dados forem válidos
      itemMapping = newMapping as Item[];
      latestPrices = pricesData.data;
      lastFetch = now;
      
      console.log(`✅ Dados atualizados! ${itemMapping.length} items carregados.`);
      
    } catch (error) {
      console.error("❌ Erro ao atualizar dados:", error);
      
      // Se nunca conseguiu carregar dados, tenta de novo em 30s
      if (itemMapping.length === 0) {
        console.error("⚠️ Cache vazio! Sistema indisponível. Tentando novamente em 30s...");
        lastFetch = now - (4.5 * 60 * 1000); // Tenta de novo em 30s
      } else {
        console.log("📦 Usando cache antigo com", itemMapping.length, "items");
      }
    } finally {
      // PASSO 3: Limpa a Promise quando terminar (no finally garante que sempre executa)
      ongoingFetch = null;
    }
  })();
  
  // PASSO 2: Guarda a referência ANTES de começar a executar
  ongoingFetch = fetchPromise;
  
  // PASSO 4: Espera a Promise terminar
  await fetchPromise;
}

export async function getPrice(itemName: string): Promise<number | null> {
  await updateData();
  
  // Se não tem dados, retorna null com erro claro
  if (itemMapping.length === 0) {
    console.error("❌ Sistema sem dados disponíveis");
    return null;
  }
  
  const item = itemMapping.find(
    (i) => i.name.toLowerCase() === itemName.toLowerCase()
  );
  
  if (!item) {
    console.log(`⚠️ Item não encontrado: ${itemName}`);
    return null;
  }
  
  const priceData = latestPrices[item.id];
  
  if (!priceData) {
    console.log(`⚠️ Preço não disponível para: ${itemName} (ID: ${item.id})`);
    return null;
  }
  
  // Valida que os preços fazem sentido
  if (priceData.high <= 0 || priceData.low <= 0) {
    console.warn(`⚠️ Preços inválidos para ${itemName}: high=${priceData.high}, low=${priceData.low}`);
    return null;
  }
  
  return Math.round((priceData.high + priceData.low) / 2);
}

// Exporta função pra ver status do sistema
export function getSystemStatus() {
  return {
    itemsLoaded: itemMapping.length,
    pricesLoaded: Object.keys(latestPrices).length,
    lastUpdate: lastFetch > 0 ? new Date(lastFetch).toISOString() : "Nunca",
    cacheAge: lastFetch > 0 ? Math.floor((Date.now() - lastFetch) / 1000) : -1,
    isHealthy: itemMapping.length > 0,
    isFetching: ongoingFetch !== null
  };
}
