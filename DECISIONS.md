# CareerOS Implementation Notes

**Source of truth:** [`MVP-DECISIONS.md`](./MVP-DECISIONS.md)

## Quick status

| Area | Implementation |
|------|----------------|
| Docker local DB + Neon prod | Documented in `.env.example`, README |
| Auth.js + Email/Password | `src/auth.ts` |
| `AI_MODE=mock` | Default; Public Demo + logged-in flows |
| UI i18n (`/en`, `/zh-TW`) | `next-intl` + `src/messages/*.json` |
| AI output languages | EN / ZH_TW / BILINGUAL via `OutputLanguageSelect` |
| Interview prep from JD | `/api/jobs/[id]/interview-prep`, job detail panel |
| Job risk analysis | `jobRisksJson` on analysis report |
| Knowledge base | Redirect → learning; notes on roadmap tasks |
| Demo account | `demo@careeros.dev` / `demo123456` |
| Public demo | `/en/demo`, `/zh-TW/demo` (no login, no DB writes) |
| Frontend skills seed | `prisma/seed.ts` (updated categories) |
