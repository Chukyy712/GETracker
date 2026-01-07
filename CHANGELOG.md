# Changelog

## [1.3.0] - 2026-01-07

### Novas Funcionalidades

#### API de Busca com Autocomplete
- Novo endpoint `GET /api/search?q=<query>&limit=<n>`
- Pesquisa itens por prefixo (prioridade) e depois por substring
- Limite configurável de resultados (máximo 20)
- Rate limiting aplicado
- **Ficheiros:** `backend/routes/search.ts`, `backend/services/geService.ts:305-347`

### Redesign do Frontend

#### Novo Sistema de Layout
- Componente `Layout` com Header e Footer reutilizáveis
- Navegação consistente entre páginas
- Design responsivo com tema dark profissional
- **Ficheiros:** `frontend/components/Layout.tsx`, `frontend/components/Header.tsx`, `frontend/components/Footer.tsx`

#### Componente de Busca com Autocomplete
- `SearchAutocomplete` com sugestões em tempo real
- Debounce de 300ms para otimização de requests
- Navegação por teclado (↑↓ e Enter)
- Destaque do texto pesquisado nos resultados
- **Ficheiro:** `frontend/components/SearchAutocomplete.tsx`

#### Página Principal Redesenhada
- Nova hero section com gradiente
- Card de resultado estilizado
- Integração com autocomplete
- Visual moderno e profissional
- **Ficheiro:** `frontend/pages/index.tsx`

#### Novas Páginas (Estrutura)
- `/favorites` - Página de favoritos (preparada para implementação)
- `/history` - Página de histórico de preços (preparada para implementação)
- **Ficheiros:** `frontend/pages/favorites.tsx`, `frontend/pages/history.tsx`

#### Sistema de Estilos
- CSS Variables para tema consistente
- Classes utilitárias `.btn`, `.btn-primary`, `.btn-secondary`
- Variáveis de cor, espaçamento e border-radius
- **Ficheiro:** `frontend/styles/globals.css`

### Estrutura de Ficheiros Adicionados

```
backend/
└── routes/
    └── search.ts              # Endpoint de busca

frontend/
├── components/
│   ├── Layout.tsx             # Layout principal
│   ├── Header.tsx             # Navegação
│   ├── Footer.tsx             # Rodapé
│   └── SearchAutocomplete.tsx # Componente de autocomplete
└── pages/
    ├── favorites.tsx          # Página de favoritos
    └── history.tsx            # Página de histórico
```

### Notas Técnicas

- Autocomplete usa cache em memória (mesmo do geService)
- Debounce no frontend reduz carga no servidor
- Layout wrapper em `_app.tsx` para consistência

---

## [1.2.0] - 2026-01-07

### Correções de Bugs Críticos

#### Verificação de Array Vazio
- **Problema:** `if (!history)` não detetava arrays vazios `[]`
- **Impacto:** Items com histórico vazio retornavam 404 em vez de 200
- **Correção:** Alterado para `if (history === null)`
- **Ficheiro:** `backend/routes/price.ts:25`

#### Return Após Erro 500
- **Problema:** Faltava `return` após enviar resposta de erro
- **Impacto:** Código continuava a executar após erro
- **Correção:** Adicionado `return res.status(500)...`
- **Ficheiro:** `backend/controllers/price.controller.ts:26`

#### Prisma Client em Production
- **Problema:** `@prisma/client` estava em `devDependencies`
- **Impacto:** Não seria instalado em builds de produção
- **Correção:** Movido para `dependencies`
- **Ficheiro:** `package.json`

### Melhorias de Código

#### Cache com TTL (Time-To-Live)
- Cache de items agora expira após 1 hora
- Novos items adicionados à DB aparecem sem restart
- Adicionadas funções: `isItemCacheExpired()`, `invalidateItemCaches()`
- **Ficheiro:** `backend/services/geService.ts`

#### Error Typing Melhorado
- **Antes:** `catch((err: { code?: string }) => {...})`
- **Depois:** `catch((err: unknown) => {...})` com type guard
- Mais seguro e compatível com TypeScript strict
- **Ficheiro:** `backend/services/geService.ts:150`

#### Signal Handlers Reorganizados
- Movidos `SIGINT`/`SIGTERM` de `geService.ts` para `index.ts`
- Criada função `cleanup()` exportada do serviço
- Melhor separação de responsabilidades
- **Ficheiros:** `backend/index.ts`, `backend/services/geService.ts`

### Correções de TypeScript

#### Configuração TSConfig
- Adicionado `allowImportingTsExtensions: true`
- Adicionado `noEmit: true`
- Removido `jsx: "react-jsx"` (não necessário no backend)
- **Ficheiro:** `tsconfig.json`

#### Tipo Zod Corrigido
- Removido cast de tipo explícito incompatível com Zod v4
- **Ficheiro:** `backend/schemas/api.schema.ts:33`

#### Import node-fetch
- Adicionado import do tipo `Response` do node-fetch
- Resolve incompatibilidade com tipo global `Response`
- **Ficheiro:** `backend/services/geService.ts:2`

#### Import Não Usado Removido
- Removido `type PriceData` que não era utilizado
- **Ficheiro:** `backend/services/geService.ts:3`

### Documentação

#### Novos Ficheiros
- `BACKEND.md` - Documentação técnica completa para developers
- `EXPLICACAO_SIMPLES.md` - Explicação para não-programadores

### Resumo de Qualidade

| Verificação | Estado |
|-------------|--------|
| TypeScript compila | ✅ Sem erros |
| Imports não usados | ✅ Limpo |
| Error handling | ✅ Corrigido |
| Cache invalidation | ✅ Implementado |
| Documentação | ✅ Completa |

---

## [1.1.0] - 2026-01-07

### Melhorias de Segurança

#### Rate Limiting
- Adicionado `express-rate-limit` para proteção contra abuso
- Limites configurados por tipo de endpoint:
  - Global: 100 req/min por IP
  - Preços (`/api/price/:item`): 60 req/min
  - Histórico (`/api/price/:item/history`): 20 req/min
  - Status (`/api/status`): 30 req/min
  - Auth (preparado para futuro): 5 req/15min
- Headers `RateLimit-*` incluídos nas respostas

#### Validação de Input
- Adicionado schema Zod para validação de parâmetros
- Nome de item: 1-100 caracteres, apenas `a-zA-Z0-9 -'()`
- Parâmetro `hours`: limitado entre 1-168h (1 semana), default 24h
- Caracteres maliciosos (XSS) são rejeitados com erro 400

#### Validação de API Externa
- Adicionado schema Zod para validar resposta da OSRS Wiki API
- Proteção contra mudanças de formato da API
- Erros detalhados em caso de resposta inválida

### Correções de Bugs

#### Tratamento de Erros
- Corrigido `.catch(() => {})` que suprimia todos os erros silenciosamente
- Agora apenas erros de duplicado (P2002) são ignorados
- Outros erros são logados com contexto (item ID)
- Adicionado contador de erros durante inserção de preços

### Estrutura do Projeto

#### Novos Ficheiros
```
backend/
├── middleware/
│   └── rateLimiter.ts      # Rate limiting configurado
└── schemas/
    ├── api.schema.ts       # Validação da API externa
    └── input.schema.ts     # Validação de input dos endpoints
```

#### Dependências Adicionadas
- `zod` - Validação de schemas type-safe
- `express-rate-limit` - Rate limiting

### Notas Técnicas

- Todas as validações têm impacto negligenciável na performance (~0.01ms)
- Rate limits são por IP (preparado para rate limit por user com auth futura)
- Schemas Zod permitem inferência automática de tipos TypeScript

---

## [1.0.0] - Versão Inicial

- Backend Express com TypeScript
- Integração com OSRS Wiki API
- Cache em memória para items
- Auto-update de preços a cada 60 segundos
- Base de dados SQLite com Prisma
- Endpoints: `/api/price/:item`, `/api/price/:item/history`, `/api/status`
