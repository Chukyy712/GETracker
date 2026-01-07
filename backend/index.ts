import express from "express";
import cors from "cors";
import priceRouter from "./routes/price.ts";
import statusRouter from "./routes/status.ts";
import { startAutoUpdate, cleanup } from "./services/geService.ts";
import { generalLimiter } from "./middleware/rateLimiter.ts";

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());
app.use(generalLimiter); // Rate limit global: 100 req/min por IP

app.use("/api/price", priceRouter);
app.use("/api/status", statusRouter);

const PORT = 3001;

app.get("/", (req, res) => {
  res.send("Ja so falta 92% Rebelo.");
});

app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);

  // ATIVA AUTO-UPDATE: Atualiza preços a cada 1 minuto automaticamente
  console.log("🚀 Iniciando auto-update de preços...");
  startAutoUpdate();
});

// Cleanup ao desligar o servidor
process.on('SIGINT', async () => {
  console.log('\n🔌 Desligando servidor...');
  await cleanup();
  console.log('✅ Desconectado. Até logo!');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await cleanup();
  process.exit(0);
});