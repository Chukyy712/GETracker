import { Router } from "express";
import { getPrice } from "../services/geService.ts";

const router = Router();

router.get("/:item", async (req, res) => {
  const itemName = req.params.item;
  const price = await getPrice(itemName);

  if (price === null) return res.status(404).json({ error: "Item não encontrado" });

  res.json({ item: itemName, price });
});

export default router;
