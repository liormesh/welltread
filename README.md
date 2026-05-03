# Welltread

Personalized movement programs for adults 40+. Multi-niche mobility platform delivered through a quiz-funnel app.

> *The body you have today.*

## Status (2026-05-03)

Acquisition funnel complete and live. 28-question quiz with niche-aware branching, AI-normalized plan reveal, password-gated stakeholder vault, recurring cast (Eleanor / James / Maria / David), drill-archetype shape vocabulary. Stripe + paywall queued. Workout course (12 sessions) in production planning.

## Live

- [welltread.co](https://welltread.co) - public marketing + LP + quiz + plan reveal + paywall (Stripe stubbed)
- [welltread.app](https://welltread.app) - currently mirrors `.co`; reserved for the authenticated product subdomain
- [welltread.co/vault](https://welltread.co/vault) - password-gated internal vault (12 pages)

## Stack

- Next.js 16 + React 19 + TypeScript + Turbopack
- Tailwind v4 (CSS-first via `@theme` in globals.css)
- Cloudflare Workers via `@opennextjs/cloudflare`
- Supabase (Postgres + Auth + RLS + Storage) - 9 tables, scale-ready
- Anthropic SDK (Claude Haiku 4.5) for Q19 free-text normalization
- Stripe (queued; design at `/vault/trial-flow`)

## Local dev

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deploy

Auto-deploys to Cloudflare Workers on push to `main` via GitHub Actions. Never `wrangler deploy` from local.

```bash
# preview build (does not deploy)
npm run build:cloudflare
npm run preview:cloudflare
```

## Repo guide

- [`CLAUDE.md`](./CLAUDE.md) - agent guidance for working in this repo (read first)
- [`AGENTS.md`](./AGENTS.md) - Next.js 16 breaking-changes warning
- `src/app/` - App Router routes (public + vault)
- `src/components/` - shared UI
- `src/components/quiz/` - quiz primitives (renderer, interstitials)
- `src/lib/quiz/` - 28-question slot graph
- `src/lib/visual/` - cast + drill-shape catalogs (typed)
- `src/lib/ai/` - Claude Haiku normalizer
- `src/middleware.ts` - vault password gate
- `public/cast/`, `public/scenes/`, `public/shapes/`, `public/samples/` - locked Nano Banana visuals
- `supabase/migrations/` - schema migrations
- `wrangler.jsonc` - CF Workers deploy config (routes welltread.co + welltread.app)
- `.github/workflows/deploy.yml` - CI/CD
- `.kb/` - early-draft brand/system docs (canonical versions live in the vault)

## KB

Project knowledge base lives in [`~/Documents/knowledge-base/projects/welltread/`](https://github.com/liormesh/knowledge-base/tree/main/projects/welltread):
- `overview.md` - status, what's live, decisions locked, file index
- `characters.md` - cast spec for video production
- `course-v1-niche-lock.md` - v1 workout course decisions
- `training-plan-architecture.md` - earlier composable architecture draft
- `research/` - competitor matrices, US stats library, synthesis
