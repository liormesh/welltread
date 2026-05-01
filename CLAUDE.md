@AGENTS.md

# Welltread

Personalized movement programs. Multi-niche mobility platform delivered via quiz-funnel app. Single backend serves multiple body niches (Senior Mobility, Posture & Back 40+; planned: postpartum, pelvic floor, GLP-1 companion).

## Stack

- **Next.js 16** (App Router, React 19, TypeScript) - heed AGENTS.md re: breaking changes
- **Tailwind v4** (CSS-first via `@theme` in `globals.css`)
- **Cloudflare Workers** deploy via `@opennextjs/cloudflare`
- **Supabase** (project `xzjwbrtvxlluwjkjsmgr`, Tokyo) for data, auth, email capture
- **Stripe** for paywall (test mode until we go live)
- **GitHub Actions** auto-deploy on push to main

## Repo conventions

- `src/app/` - App Router routes
- `src/app/<niche>/page.tsx` - niche-specific LP (current: `seniors`, `posture`)
- `src/app/api/<endpoint>/route.ts` - API routes (Edge runtime)
- `src/components/` - shared UI
- `.kb/` - brand kit, copy bible, design tokens reference (read this first when working on UI/copy)
- `wrangler.jsonc` - CF Workers deploy config; routes both `welltread.co` and `welltread.app`
- `.github/workflows/deploy.yml` - push to main → build → wrangler deploy

## Project rules (inherited from user globals)

- **No custom fonts** - system-font stack only. Don't add `next/font/google` imports.
- **Deploy via GitHub** - never `wrangler deploy` from local. Push to main.
- **Brand kit is canonical** - see `.kb/brand.md` before writing UI copy or styling.
- **Tone:** clinical-warm. Calm, grounded, no hype. See voice samples in brand kit.
- **No medical claims** - lifestyle positioning only. Read the relevant niche sections of brand kit before writing copy.

## Brand tokens (Tailwind v4 `@theme`)

Defined in `src/app/globals.css`. Use the semantic class names:
- `bg-paper`, `bg-paper-warm`, `bg-paper-deep`
- `bg-sage`, `bg-sage-deep`, `bg-sage-soft`
- `text-ink`, `text-ink-soft`, `text-sage`, `text-clay`
- `border-line`

## Domains

- **welltread.co** - primary marketing + LP + quiz + paywall
- **welltread.app** - future authenticated app subdomain (currently mirrors `.co` via same Worker)

## Active niches

| Path | Niche | Status |
|---|---|---|
| `/` | Brand home | Live (placeholder) |
| `/seniors` | Senior Mobility 60+ | Live (placeholder LP) |
| `/posture` | Posture & Back 40+ | Live (placeholder LP) |
| `/api/notify` | Email capture | Live - writes to `email_signups` in Supabase |

## Next steps queue

1. ~~Wire `/api/notify` → Supabase `welltread.email_signups` table~~ Done
2. Build dynamic quiz at `/quiz` with branching by `?source=` UTM
3. Plan-reveal mockup pages per niche
4. Stripe Checkout integration with 5-tier paywall
5. Add `/postpartum` and `/pelvic-floor` niche LPs (when product is real)
6. Set up Meta Pixel + GA4 via env-driven IDs

## Linked KB

- Brand kit: [.kb/brand.md](.kb/brand.md)
- Market intel for the broader online-courses project: `~/Documents/knowledge-base/projects/online-courses/`
