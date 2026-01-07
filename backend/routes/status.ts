import { Router } from "express";
import { getSystemStatus } from "../services/geService.ts";
import { statusLimiter } from "../middleware/rateLimiter.ts";

const router = Router();

router.get("/", statusLimiter, async (req, res) => {
  try {
    const status = await getSystemStatus();
    res.json(status);
  } catch (error) {
    console.error("Erro ao obter status:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
