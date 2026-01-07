// Configuração centralizada da aplicação

export const config = {
  // API Backend URL
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",

  // Endpoints
  endpoints: {
    price: (item: string) => `/api/price/${encodeURIComponent(item)}`,
    search: (query: string, limit = 8) =>
      `/api/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    status: "/api/status",
  },
} as const;

// Helper para construir URLs completas
export function apiUrl(path: string): string {
  return `${config.apiUrl}${path}`;
}
