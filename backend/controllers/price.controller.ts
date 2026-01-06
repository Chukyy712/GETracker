import express from "express";
import { getPrice } from "../services/geService.ts";

export const getItemPrice = async (
  req: express.Request, 
  res: express.Response
) => {
  try {
    const itemName = req.params.item;
    const price = await getPrice(itemName);
    
    if (price === null) {
      console.log(`Item not found: ${itemName}`);
      return res.status(404).json({ error: "Item não encontrado" });
    }
    
    res.json({ item: itemName, price });
  } catch (error) {
    console.error(`Error fetching price for ${req.params.item}:`, error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};