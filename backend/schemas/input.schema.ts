import { z } from "zod";

// Schema para nome de item
export const ItemNameSchema = z
  .string()
  .min(1, "Nome do item não pode estar vazio")
  .max(100, "Nome do item muito longo (máx 100 caracteres)")
  .regex(
    /^[a-zA-Z0-9\s\-'()]+$/,
    "Nome do item contém caracteres inválidos"
  );

// Schema para parâmetro hours do histórico
export const HoursSchema = z
  .string()
  .optional()
  .transform((val) => {
    if (!val) return 24; // Default
    const num = parseInt(val, 10);
    if (isNaN(num)) return 24;
    return Math.min(Math.max(num, 1), 168); // Entre 1h e 168h (1 semana)
  });

// Schema completo para request de preço
export const PriceRequestSchema = z.object({
  item: ItemNameSchema,
});

// Schema completo para request de histórico
export const HistoryRequestSchema = z.object({
  item: ItemNameSchema,
  hours: HoursSchema,
});

// Tipos inferidos
export type PriceRequest = z.infer<typeof PriceRequestSchema>;
export type HistoryRequest = z.infer<typeof HistoryRequestSchema>;

// Helper para validar e retornar erro formatado
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errorMessage = result.error.issues
      .map((issue) => issue.message)
      .join(", ");
    return { success: false, error: errorMessage };
  }

  return { success: true, data: result.data };
}
