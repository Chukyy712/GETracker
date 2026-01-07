import express from "express";
import { getPrice } from "../services/geService.ts";
import { PriceRequestSchema, validateInput } from "../schemas/input.schema.ts";

export const getItemPrice = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    // Validação de input
    const validation = validateInput(PriceRequestSchema, { item: req.params.item });
    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }

    const { item: itemName } = validation.data;
    const price = await getPrice(itemName);

    if (price === null) {
      return res.status(404).json({ error: "Item não encontrado" });
    }

    res.json({ item: itemName, price });
  } catch (error) {
    console.error(`Error fetching price for ${req.params.item}:`, error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};