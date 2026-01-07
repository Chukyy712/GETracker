import { z } from "zod";

// Schema para cada item de preço individual
export const PriceDataSchema = z.object({
  high: z.number().nullable(),
  low: z.number().nullable(),
  highTime: z.number().nullable().optional(),
  lowTime: z.number().nullable().optional(),
});

// Schema para a resposta completa da API de preços
export const WikiPriceResponseSchema = z.object({
  data: z.record(z.string(), PriceDataSchema),
});

// Tipos inferidos automaticamente
export type PriceData = z.infer<typeof PriceDataSchema>;
export type WikiPriceResponse = z.infer<typeof WikiPriceResponseSchema>;

// Função helper para validar resposta da API
export function validateWikiPriceResponse(data: unknown): {
  success: true;
  data: WikiPriceResponse;
} | {
  success: false;
  error: string;
} {
  const result = WikiPriceResponseSchema.safeParse(data);

  if (!result.success) {
    const errorDetails = result.error.issues
      .slice(0, 5) // Limita a 5 erros para não poluir logs
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");

    return {
      success: false,
      error: `Formato inválido da API: ${errorDetails}`,
    };
  }

  return {
    success: true,
    data: result.data,
  };
}
