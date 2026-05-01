# Welltread

Personalized movement programs. Multi-niche mobility platform.

> **One-line:** *Every step considered.*

Currently in pre-launch. Two niche LPs live: Senior Mobility (60+), Posture & Back (40+).

## Live

- [welltread.co](https://welltread.co) — primary brand
- [welltread.app](https://welltread.app) — currently mirrors `.co`; reserved for the future authenticated product subdomain

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind v4 (CSS-first)
- Cloudflare Workers via `@opennextjs/cloudflare`
- Supabase + Stripe (wiring in progress)

## Local dev

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deploy

Auto-deploys to Cloudflare Workers on push to `main` via GitHub Actions. Never deploy from local.

```bash
# preview build (does not deploy)
npm run build:cloudflare
npm run preview:cloudflare
```

## Repo guide

- [`CLAUDE.md`](./CLAUDE.md) — agent guidance for working in this repo
- [`.kb/brand.md`](./.kb/brand.md) — brand kit, voice, palette, niches
- `src/app/` — routes
- `src/components/` — shared UI
- `wrangler.jsonc` — CF deploy config
- `.github/workflows/deploy.yml` — CI/CD
