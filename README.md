# CareerOS

AI-powered job search and skill growth platform for software engineers.

**技術決策（請勿自行更換主棧）：** 見 [`MVP-DECISIONS.md`](./MVP-DECISIONS.md) — Auth.js、PostgreSQL + Prisma、Vercel、Neon（正式）、`AI_MODE=mock`。

## Quick start

### Prerequisites

- Node.js 20+
- Docker (for local PostgreSQL) or a PostgreSQL connection string

### Setup

```bash
# Start PostgreSQL (maps to host port **5433** if Windows already uses 5432)
docker compose up -d

# Install dependencies
npm install

# Copy environment
cp .env.example .env

# Push schema and seed
npm run db:push
npm run db:seed

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (redirects to `/en` or `/zh-TW` by browser language)

- **Public demo (no login):** [http://localhost:3000/en/demo](http://localhost:3000/en/demo) · [http://localhost:3000/zh-TW/demo](http://localhost:3000/zh-TW/demo)
- **Signed-in demo:** `demo@careeros.dev` / `demo123456` at `/en/login` or `/zh-TW/login`

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind + **next-intl** (`/en`, `/zh-TW`)
- Auth.js (credentials) + Prisma + PostgreSQL
- AI: mock provider (default) / OpenAI stub

## Documentation

Product specs (Cursor-ready):

1. `01-overview.md` - Product overview and MVP scope
2. `02-frontend.md` - Frontend pages and UI
3. `03-backend.md` - API routes and services
4. `04-database.md` - Prisma schema
5. `05-architecture.md` - Architecture and phases

**Final MVP decisions:** [`MVP-DECISIONS.md`](./MVP-DECISIONS.md)

## MVP features

- Public demo (`/en/demo`, `/zh-TW/demo`) — no login, mock AI only
- Authentication (register / login) + demo account
- Onboarding wizard (resume → role → skills)
- Career profile and Frontend Engineer skills
- Resume analysis, versions, export (PDF / Markdown via `@react-pdf/renderer`)
- Job tracker, job fit, **job risk analysis**, skill gaps
- Tailored resume suggestions
- Learning roadmaps with **per-task notes** (not full knowledge base)
- **Interview prep from JD** (EN / 中文 / Bilingual output)
- Interview feedback loop and weak areas
- Dashboard overview

See [`MVP-DECISIONS.md`](./MVP-DECISIONS.md) for full product rules.

## Environment

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | NextAuth secret (32+ chars) |
| `AUTH_URL` | App URL (e.g. http://localhost:3000) |
| `AI_MODE` | `mock` (default) or `openai` |
| `OPENAI_API_KEY` | Optional, for real AI mode |

## Deploy (Vercel + Neon)

1. Create a [Neon](https://neon.tech) PostgreSQL database
2. Set `DATABASE_URL` (with `?sslmode=require`), `AUTH_SECRET`, `AUTH_URL`, `AI_MODE=mock`
3. Deploy to Vercel — run `prisma db push` and `npm run db:seed` on first deploy
4. Public demo stays at `/en/demo` and `/zh-TW/demo` without authentication
