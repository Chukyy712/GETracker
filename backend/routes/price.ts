import { Router } from "express";
import { getItemPrice } from "../controllers/price.controller.ts";
import { getPriceHistory } from "../services/geService.ts";
import { priceLimiter, historyLimiter } from "../middleware/rateLimiter.ts";
import { HistoryRequestSchema, validateInput } from "../schemas/input.schema.ts";

const router = Router();

// IMPORTANTE: Rota mais específica PRIMEIRO!
// Se colocar /:item primeiro, ela captura tudo e /history nunca é chamado
router.get("/:item/history", historyLimiter, async (req, res) => {
  // Validação de input
  const validation = validateInput(HistoryRequestSchema, {
    item: req.params.item,
    hours: req.query.hours,
  });

  if (!validation.success) {
    return res.status(400).json({ error: validation.error });
  }

  const { item: itemName, hours } = validation.data;

  try {
    const history = await getPriceHistory(itemName, hours);

    if (history === null) {
      return res.status(404).json({ error: "Item não encontrado" });
    }

    res.json({ item: itemName, history });
  } catch (error) {
    console.error("Erro ao obter histórico:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Rota genérica por último (captura qualquer /:item que não seja /history)
router.get("/:item", priceLimiter, getItemPrice);

export default router;
