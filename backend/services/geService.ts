export async function getPrice(itemName: string) {
  const prices: Record<string, number> = {
    "Dragon Scimitar": 150000,
    "Rune Platebody": 100000,
    "Magic Logs": 1200,
  };

  return prices[itemName] || null;
}
