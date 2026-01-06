import { Router } from "express";
import { getItemPrice } from "../controllers/price.controller.ts";
import { getPriceHistory } from "../services/geService.ts";

const router = Router();

// IMPORTANTE: Rota mais específica PRIMEIRO!
// Se colocar /:item primeiro, ela captura tudo e /history nunca é chamado
router.get("/:item/history", async (req, res) => {
  const itemName = req.params.item;
  const hours = parseInt(req.query.hours as string) || 24;
  
  const history = await getPriceHistory(itemName, hours);
  
  if (!history) {
    return res.status(404).json({ error: "Item não encontrado" });
  }
  
  res.json({ item: itemName, history });
});

// Rota genérica por último (captura qualquer /:item que não seja /history)
router.get("/:item", getItemPrice);

export default router;
