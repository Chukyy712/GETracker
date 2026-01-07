import fetch, { Response } from "node-fetch";
import { validateWikiPriceResponse } from "../schemas/api.schema.ts";

const WIKI_API_URL = "https://prices.runescape.wiki/api/v1/osrs/latest";
const DEFAULT_TIMEOUT_MS = 10000;
const DEFAULT_RETRIES = 3;

// Fetch com timeout
async function fetchWithTimeout(
  url: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
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

// Fetch com retry automático
async function fetchWithRetry(
  url: string,
  retries: number = DEFAULT_RETRIES
): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url);
      if (response.ok) return response;

      console.warn(
        `⚠️ Tentativa ${attempt}/${retries} falhou: status ${response.status}`
      );
    } catch (error) {
      console.warn(`⚠️ Tentativa ${attempt}/${retries} falhou:`, error);
    }

    // Backoff exponencial entre tentativas
    if (attempt < retries) {
      const delay = 1000 * attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error(`Falhou após ${retries} tentativas`);
}

// Tipos para preços processados
export interface ProcessedPrice {
  itemId: number;
  high: number;
  low: number;
}

// Busca e valida preços da Wiki API
export async function fetchLatestPrices(): Promise<ProcessedPrice[]> {
  console.log("🔄 Buscando preços da OSRS Wiki API...");

  const response = await fetchWithRetry(WIKI_API_URL);
  const jsonData = await response.json();

  // Validação com Zod
  const validation = validateWikiPriceResponse(jsonData);
  if (!validation.success) {
    throw new Error(validation.error);
  }

  // Processa e filtra preços válidos
  const prices: ProcessedPrice[] = [];

  for (const [itemId, price] of Object.entries(validation.data.data)) {
    // Filtra preços inválidos (null ou <= 0)
    if (price.high && price.low && price.high > 0 && price.low > 0) {
      prices.push({
        itemId: parseInt(itemId),
        high: price.high,
        low: price.low,
      });
    }
  }

  console.log(`✅ ${prices.length} preços válidos obtidos da API`);
  return prices;
}
