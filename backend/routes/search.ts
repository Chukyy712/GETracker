import { Router } from "express";
import { searchItems } from "../services/geService.ts";
import { generalLimiter } from "../middleware/rateLimiter.ts";

const router = Router();

router.get("/", generalLimiter, async (req, res) => {
  const query = req.query.q as string;

  if (!query || query.length < 2) {
    return res.json({ items: [] });
  }

  // Limita a 10 resultados (garante número válido)
  const parsedLimit = Number(req.query.limit);
  const limit = Math.min(Number.isNaN(parsedLimit) ? 10 : parsedLimit, 20);

  try {
    const items = await searchItems(query, limit);
    res.json({ items });
  } catch (error) {
    console.error("Erro na pesquisa:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

export default router;
