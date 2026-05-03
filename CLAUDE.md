@AGENTS.md

# Welltread

Personalized movement programs for adults 40+. Multi-niche mobility platform delivered via quiz-funnel app. Single backend serves Senior Mobility 60+, Posture & Back 40+, and (planned) postpartum / pelvic floor / GLP-1 companion.

**State (2026-05-03 end-of-session):**
- **Acquisition layer complete.** welltread.co live with home + niche LPs, 28-question quiz v2, AI-normalized plan reveal with cast-matched hero, Stripe-stubbed paywall.
- **Product app (welltread.app) functional in demo mode.** `/app/today`, `/app/session/[id]` with 5-second transition + countdown ring + "this hurts" Phase 1 swap, `/app/done` check-in writing to `daily_completions`, `/app/week`, `/app/profile`, `/app/library` stub. Magic-link + password auth via Supabase. Demo user: `info@welltread.co` / `123abc`.
- **Email pipeline live.** Resend domain `welltread.co` verified (DKIM + SPF + DMARC on Cloudflare). 16 templates with niche-lead cast headers. 8 acquisition emails wired to GH Actions cron (15-min tick).
- **Vault complete.** 17 stakeholder-facing pages at welltread.co/vault.
- **Blocked on Lior:** Stripe verification for US LLC, real movement videos (Veo thread), ElevenLabs voice IDs.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript, Turbopack) - heed [AGENTS.md](AGENTS.md) re: breaking changes
- **Tailwind v4** (CSS-first via `@theme` in `src/app/globals.css`)
- **Cloudflare Workers** deploy via `@opennextjs/cloudflare`. Single Worker serves both welltread.co and welltread.app
- **Supabase** (project `xzjwbrtvxlluwjkjsmgr`, Tokyo) - 9 tables, RLS, scale-ready
- **Anthropic SDK** (Haiku 4.5) - Q19 free-text normalization at quiz completion
- **Stripe** - queued; spec at `/vault/trial-flow`
- **GitHub Actions** auto-deploy on push to main

## Repo conventions

- `src/app/` - App Router routes
- `src/app/<niche>/page.tsx` - public niche LPs (`seniors`, `posture`)
- `src/app/quiz/` + `src/components/QuizRunner.tsx` + `src/components/quiz/*` - quiz v2
- `src/app/plan/` + `src/components/PlanReveal.tsx` - plan reveal with Q19 plug-in
- `src/app/vault/*` - password-gated internal vault (12 pages)
- `src/app/api/*/route.ts` - API routes
- `src/lib/quiz/definition.ts` - 28-question slot graph + plan preview
- `src/lib/visual/cast.ts` + `src/lib/visual/shapes.ts` - typed cast + drill shape catalogs
- `src/lib/ai/activity.ts` - Claude Haiku Q19 normalizer
- `src/middleware.ts` - vault password gate (matcher `/vault/:path*`)
- `public/cast/` + `public/scenes/` + `public/shapes/` + `public/samples/` - locked Nano Banana visuals
- `wrangler.jsonc` - CF Workers deploy config; routes welltread.co + welltread.app
- `.github/workflows/deploy.yml` - push to main → build → wrangler deploy

## Project rules (inherited from user globals)

- **No custom fonts** - system-font stack only. Don't add `next/font/google` imports.
- **No em dashes** - use hyphens (-), never em dashes (—), in any produced content.
- **Deploy via GitHub** - never `wrangler deploy` from local. Push to main.
- **No medical claims** - lifestyle positioning only.
- **Imagery is relatable, not aspirational** - match cast member to user demographic. The activity can be aspirational; the body never can. See [`/vault/ui-rules`](https://welltread.co/vault/ui-rules) §C.
- **Selector consistency** - all selectors use 1px border-line default + border-sage selected + ring-2 ring-sage/20 for cards. Never `border-transparent`. See [`/vault/ui-rules`](https://welltread.co/vault/ui-rules) §A.

## Brand tokens (Tailwind v4 `@theme`)

Defined in `src/app/globals.css`. Use the semantic class names:
- Surfaces: `bg-paper`, `bg-paper-warm`, `bg-paper-deep`
- Brand: `bg-sage`, `bg-sage-deep`, `bg-sage-soft`, `text-sage`, `text-clay`
- Type: `text-ink`, `text-ink-soft`
- Edges: `border-line`

Italic accent pattern: `<span className="text-sage italic font-normal">word</span>` inside a heading.

## Domains

- **welltread.co** - primary marketing + LP + quiz + paywall + vault
- **welltread.app** - future authenticated app subdomain (currently mirrors `.co` via same Worker)

## Live routes

| Path | Status |
|---|---|
| `/` | Live - group hero (`group_mat_catcow`), niche cards, "how it works", primary CTA → `/quiz` |
| `/seniors` | Live - Eleanor hero + group_balance_with_chairs scene, CTA → `/quiz?source=seniors` |
| `/posture` | Live - David hero + Maria side-stretch scene, CTA → `/quiz?source=posture` |
| `/quiz` | Live - 28-question graph with niche branching |
| `/plan` | Live - cast portrait matched to niche/age, Q19 plug-in hero, paywall (Stripe button stubbed) |
| `/vault/*` | Live - password-gated, 12 pages |
| `/api/quiz/start` | Live - creates `quiz_sessions` row, returns id |
| `/api/quiz/save` | Live - upserts answers + niche |
| `/api/quiz/complete` | Live - saves session, calls Claude to normalize Q19 free text, links email signup |
| `/api/notify` | Live - email-only capture (kept for legacy CTAs) |
| `/api/vault/login` + `/logout` | Live - cookie-based vault auth |

## Quiz mechanics

- **Niche entry routing**: `?source=seniors` enters at Q3, `?source=posture` enters at Q2, default enters at Q1
- **Conditional skips**: Q6 only if Q5 has selections; Q23 only if Q22=yes; Q27 skipped if `utm_source` is set
- **Dynamic prompts**: Q24 commitment phrasing pulls from Q10 minutes-per-day choice
- **Step labels** in progress bar (not Q1/S1) - each slot has `stepLabel` in definition.ts
- **Q19 free text** is sent to Claude Haiku at /api/quiz/complete and stored in `quiz_sessions.metadata.normalized_activity`. Plan reveal reads this for the hero copy.
- **localStorage key** is `wt:quiz:v2` - bump if the answer schema changes

## Cast (4 characters, locked)

Definitions in `src/lib/visual/cast.ts`. KB spec: `~/Documents/knowledge-base/projects/welltread/characters.md`.

| Character | Age | Niche | Wardrobe |
|---|---|---|---|
| Eleanor | 67 | Senior 60-69 | sage henley + linen pants |
| James | 70 | Senior 70+ | sage henley + charcoal joggers |
| Maria | 52 | Posture / general 50-59 | sage tank + linen pants |
| David | 47 | Posture 40-49 | sage henley + tan chinos + glasses |

When generating any new visual: prepend the cast member's `description` field to the prompt for character consistency.

## Drill archetype shapes

Definitions in `src/lib/visual/shapes.ts`. PNG files in `public/shapes/`. Six shapes: `balance`, `mobility`, `strength`, `recovery`, `breath`, `alignment`. Used for non-character backgrounds (interstitial cards, plan reveal week markers, cinematic loader).

## Database

- 9 tables (current): `email_signups`, `profiles`, `quiz_sessions`, `user_plans`, `daily_completions`, `weekly_checkins`, `subscriptions`, `events`, `movement_library`
- Migration: `supabase/migrations/20260501120000_initial_schema.sql`
- See [`/vault/data-model`](https://welltread.co/vault/data-model) for relationships, RLS, scale notes
- **Pending tables for Phase 1 product**: `blocks`, `block_movements`, `sessions`, `session_blocks`, `week_templates`, `program_archetypes`, `user_plan_weeks`, `stripe_events`. Spec at [`/vault/product-framework`](https://welltread.co/vault/product-framework) §E.

## Worker secrets (set via CF API, not in repo)

- `VAULT_AUTH_TOKEN` - vault password
- `SUPABASE_SERVICE_ROLE_KEY` - server-side DB writes
- `ANTHROPIC_API_KEY` - Q19 normalization
- `RESEND_API_KEY` - email send
- `EMAIL_TOKEN_SECRET` - HMAC for resume tokens (re-engagement emails)

Future: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_*`.

## Active niches

| Path | Niche | LP | Quiz source param |
|---|---|---|---|
| `/seniors` | Senior Mobility 60+ | Live | `seniors` |
| `/posture` | Posture & Back 40+ | Live | `posture` |
| (planned) | Postpartum | - | `postpartum` |
| (planned) | Pelvic Floor | - | `pelvic-floor` |
| (planned) | GLP-1 Companion | - | `glp1` |

## Next-steps queue (in order)

**Blocked on Lior (external):**
1. **Stripe verification** for the US LLC → unlocks trial flow (subsystems 09-11), welcome email, real account provisioning
2. **Movement videos** from Veo / PT studio → swaps `sample-plan.ts` with real content
3. **ElevenLabs voice IDs** for the 4 cast → unlocks audio narration

**Unblocked, ready to build (recommended order):**
4. **Content schema + assignment engine** (subsystems 01, 12, 13) - 7 new tables, deterministic assignment, admin upload pipeline. Stops `sample-plan.ts` from accumulating debt
5. **Retention loop** - weekly check-in screen, Sunday-mode for /app/today, week 4/8 re-eval, week 12 graduation. Wires to existing `weekly_checkins` table
6. **Marketing readiness** - Meta Pixel + CAPI server-side router, TikTok Events API, PWA install prompt + manifest, performance audit
7. **$500 Meta classification kill-test** - run after Stripe + content land
8. **Magic resume tokens** for cart abandonment recovery (Phase 2 of trial flow)
9. **Phase 2 movement swap** ([Trello card](https://trello.com/c/hWHWjQTN)) - requires content schema + real regression chains

## Linked KB

- **Project entry point:** [`projects/welltread/overview.md`](~/Documents/knowledge-base/projects/welltread/overview.md)
- **Cast spec:** [`projects/welltread/characters.md`](~/Documents/knowledge-base/projects/welltread/characters.md)
- **Course v1 lock:** [`projects/welltread/course-v1-niche-lock.md`](~/Documents/knowledge-base/projects/welltread/course-v1-niche-lock.md)
- **Training plan architecture (older draft):** [`projects/welltread/training-plan-architecture.md`](~/Documents/knowledge-base/projects/welltread/training-plan-architecture.md) - superseded by `/vault/product-framework` for the canonical product design
- **Research:** [`projects/welltread/research/`](~/Documents/knowledge-base/projects/welltread/research/) - SYNTHESIS, competitor matrices, US stats library
- **Vault (live, gated):** [welltread.co/vault](https://welltread.co/vault) - 12 pages of investor / market / strategy / product / UI docs

## In-repo `.kb/`

`brand.md`, `paper-channels.md`, `system-design.md` are early-draft docs. Newer canonical versions live in the vault (`/vault/brand`, `/vault/architecture`, etc.) - the in-repo versions are kept for offline reference but should not be the primary source when documenting decisions. Update vault first.
