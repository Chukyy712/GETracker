import rateLimit from "express-rate-limit";

// Limite geral da API: 100 requests por minuto por IP
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100,
  standardHeaders: true, // Inclui headers RateLimit-*
  legacyHeaders: false,
  message: {
    error: "Demasiadas requisições. Tenta novamente mais tarde.",
    retryAfter: 60,
  },
});

// Limite para consultas de preço: 60 requests por minuto
export const priceLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Demasiadas requisições de preço. Tenta novamente mais tarde.",
    retryAfter: 60,
  },
});

// Limite para histórico (mais pesado): 20 requests por minuto
export const historyLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Demasiadas requisições de histórico. Tenta novamente mais tarde.",
    retryAfter: 60,
  },
});

// Limite para auth (futuro): 5 tentativas por 15 minutos (anti brute-force)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Demasiadas tentativas de login. Tenta novamente em 15 minutos.",
    retryAfter: 15 * 60,
  },
  skipSuccessfulRequests: true, // Não conta logins bem-sucedidos
});

// Limite para status (leve): 30 requests por minuto
export const statusLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Demasiadas requisições de status. Tenta novamente mais tarde.",
    retryAfter: 60,
  },
});
