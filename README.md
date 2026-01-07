# GE Finance

![GitHub Repo Size](https://img.shields.io/github/repo-size/Chukyy712/GETracker)
![GitHub Last Commit](https://img.shields.io/github/last-commit/Chukyy712/GETracker)
![GitHub License](https://img.shields.io/github/license/Chukyy712/GETracker)

Aplicação web para monitorizar preços do Grand Exchange do OSRS em tempo real.

## Funcionalidades

- Pesquisa de preços com autocomplete
- Atualização automática de preços a cada 60 segundos
- Histórico de preços por item
- Rate limiting para proteção contra abuso
- Validação de input com Zod

## Tecnologias

**Backend:**
- Node.js + Express 5
- TypeScript
- Prisma ORM + SQLite
- Zod (validação)

**Frontend:**
- Next.js 16
- React 19
- TypeScript

## Pré-requisitos

- Node.js 18+
- npm ou yarn

## Instalação

```bash
# Clonar repositório
git clone git@github.com:Chukyy712/GETracker.git
cd GETracker

# Instalar dependências do backend
npm install

# Instalar dependências do frontend
cd frontend && npm install && cd ..

# Gerar cliente Prisma
npx prisma generate --schema=prisma/prisma/schema.prisma

# Popular base de dados (primeira vez)
npm run db:populate
```

## Executar

Abre **dois terminais**:

```bash
# Terminal 1 - Backend (porta 3001)
npm run dev

# Terminal 2 - Frontend (porta 3000)
cd frontend && npm run dev
```

Acede a http://localhost:3000

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia backend com hot-reload |
| `npm run start` | Inicia backend (produção) |
| `npm run db:populate` | Popula DB com items da Wiki |
| `cd frontend && npm run dev` | Inicia frontend |
| `cd frontend && npm run build` | Build do frontend |

## API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/price/:item` | Preço atual de um item |
| GET | `/api/price/:item/history?hours=24` | Histórico de preços |
| GET | `/api/search?q=dragon&limit=10` | Pesquisa items |
| GET | `/api/status` | Estado do sistema |

## Estrutura

```
GETracker/
├── backend/
│   ├── controllers/    # Lógica dos endpoints
│   ├── middleware/     # Rate limiting
│   ├── routes/         # Definição de rotas
│   ├── schemas/        # Validação Zod
│   ├── services/       # Lógica de negócio
│   └── index.ts        # Entry point
├── frontend/
│   ├── components/     # Componentes React
│   ├── pages/          # Páginas Next.js
│   └── styles/         # CSS
├── prisma/
│   └── prisma/
│       └── schema.prisma
└── package.json
```

## Licença

MIT
