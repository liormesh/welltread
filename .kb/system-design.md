# Welltread System Design

> Living architecture document. Update as the system evolves. Last revision: 2026-05-01.

## North star

A single backend that personalizes a 12-week movement program per user, served through a web acquisition funnel and a daily-use app. The key architectural property: **one engine, many doorways**. New niches are added by writing new LP + quiz-branch + plan-template, not by spawning new products.

## Layered architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  ACQUISITION LAYER (welltread.co)                              │
│  Niche LPs → Dynamic quiz → Plan reveal → Paywall → Trial      │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  PRODUCT LAYER (welltread.app — PWA Phase 1, native Phase 2)   │
│  Daily plan → Tracking → Weekly check-in → Lifecycle nudges    │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  BACKEND (Supabase + CF Workers + Stripe)                      │
│  Quiz logic graph → Plan generator → Auth → Billing → Events   │
└─────────────────────────────────────────────────────────────────┘
```

## Domain split

| Domain | Role | Status |
|---|---|---|
| **welltread.co** | Marketing, LPs, quiz, plan reveal, paywall, trial signup | Live (placeholder) |
| **welltread.app** | Authenticated product. PWA in Phase 1, native in Phase 2 | Reserved (currently mirrors `.co` via shared Worker) |

Both domains hosted on the same Cloudflare Worker initially. We split when the app gets heavy enough to justify a separate Worker (likely when we add real-time progress tracking or push notifications).

## Acquisition layer (welltread.co)

### Routes

```
/                           → Brand home, niche selector
/<niche>                    → Niche LP (currently: /seniors, /posture)
/<niche>?utm_source=meta&utm_campaign=mobility_men40_v3
                            → Same LP, UTM captured for quiz prefill
/quiz                       → Dynamic quiz, prefilled by URL params
/quiz/result                → Plan reveal (personalized to quiz answers)
/checkout                   → Paywall with 5-tier pricing
/trial                      → Post-Stripe trial start
```

### Dynamic quiz architecture

The quiz is a **logic graph** with branching, not a static form. Each question may be skipped or modified based on:
1. **UTM source** — `?source=seniors_mobility_balance` skips the niche-routing question
2. **Earlier answers** — answer "back pain" → next question is "where exactly?"
3. **Cohort signals** — pregnancy/postpartum, GLP-1 use, recent injury

```yaml
# pseudo-config
graph:
  root:
    if utm.source includes 'seniors': go senior_intro
    if utm.source includes 'posture': go posture_intro
    else: go niche_picker

  senior_intro:
    question: "When was the last time you felt unsteady?"
    options: [today, this_week, this_month, rarely]
    next: senior_balance_history

  posture_intro:
    question: "Where does your back hurt by 4pm?"
    options: [lower, mid, between_shoulders, neck, no_pain]
    next: posture_movement_baseline

  # ...
```

**Storage:** quiz definitions live as YAML/JSON in `src/lib/quiz/` (versioned in repo). User responses stored per-session in Supabase `quiz_sessions` table with the answer graph.

**Branching dimensions** (initial, expandable):
- Niche (seniors / posture / postpartum / pelvic_floor / glp1)
- Primary pain location
- Movement baseline (none, casual, regular, athletic)
- Available time per day
- Equipment access (none, mat, bands, full home gym)
- Medical considerations (joint replacement, recent surgery, pregnancy)
- Goals (independence, energy, strength, recovery, body comp)
- Schedule preference (morning, lunch, evening, flex)

### Plan generator

Once quiz completes, server-side function generates the plan template:

```ts
plan = generatePlan({
  niche: 'seniors',
  baseline: 'casual',
  primary_pain: 'balance',
  time_per_day: 15,
  equipment: 'mat',
  weeks: 12,
})
```

**Inputs → outputs:**
- 12 weekly themes (e.g., week 1: gentle activation; week 6: balance challenge)
- ~200 movement library entries tagged by niche, intensity, equipment
- Plan = picker over the library, constrained by inputs
- Daily prompts: 1 movement block (15-30 min) + 1 nutrition note + 1 micro-habit

**Storage:** plan-templates as data, generator as code (versioned). User's actual plan = a snapshot in `user_plans` table at generation time. We can regenerate or adjust plans without losing history.

### Paywall

Five tiers. Best-value emphasis on 6-month.

| SKU | Display | Stripe price ID | Use |
|---|---|---|---|
| `trial-1usd` | $1, 7-day trial | `price_xxx` | Acquisition lead |
| `monthly` | $39 / month | `price_xxx` | Decoy anchor |
| `quarterly` | $69 / 3 months ($23/mo) | `price_xxx` | Volume option |
| `biannual` | **$99 / 6 months ($16.50/mo)** | `price_xxx` | **Default highlight** |
| `annual` | $129 / year ($10.75/mo) | `price_xxx` | LTV maximizer |

Pricing matches the wellness category pattern (validated in market-intel). Trial→paid flips at 7 days. We collect card up front (industry standard); 3-tap cancel UX for refund-rate compliance.

### Tracking

Every transition fires both client-side (Meta Pixel, GA4) and server-side (Conversions API). Server-side is the moat — pixel-only loses ~30-40% of events to ad blockers.

```
quiz_start         → Lead event
quiz_complete      → InitiateCheckout-precursor
plan_view          → ViewContent
checkout_view      → InitiateCheckout
trial_start        → AddPaymentInfo
subscription_paid  → Purchase
churn              → custom event
```

UTMs persist in a first-party cookie (`wt_attr`) for 30 days, attached to every server event. Click IDs (`fbclid`, `ttclid`, `gclid`) captured at first touch and forwarded server-side.

## Product layer (welltread.app)

### Phase 1: PWA on welltread.app

Why PWA first:
- Single Next.js codebase serves both
- Installable on iOS/Android (modern browsers)
- No App Store / Play Store gauntlet
- No 30% IAP fee — Stripe direct
- Push notifications via Web Push (iOS 16.4+, Android always)
- Update instantly on deploy

What it includes:
- Auth (Supabase Auth: email + magic link initially; Apple/Google OAuth Phase 2)
- Today's plan view (the daily 1-2-3 prompts)
- Workout player (video + timer + sets)
- Weekly check-in flow
- Progress dashboard (streaks, completion %)
- Settings, plan switching, billing portal (Stripe customer portal)

### Phase 2: Native apps (when paywall is profitable)

**Trigger criteria for Phase 2:**
- Steady-state CAC < $50
- D7 retention > 35%
- Monthly recurring > $30K
- App-store-only growth lever needed (e.g., featured placement, in-app referrals)

**When triggered, two paths:**
1. **Capacitor wrapper** — wrap PWA in native shell. Fast, ~2 weeks. Limited native UX.
2. **React Native + shared core** — Expo + share business logic with Next.js via packages workspace. ~6-8 weeks. Real native feel.

Recommended: start with Capacitor for App Store presence, migrate to RN once we know what daily-use UX needs to feel like.

## Data model

```
auth.users (Supabase Auth)
├── profile_id (1:1)

profiles
├── id (uuid)
├── auth_user_id (fk → auth.users)
├── full_name (nullable)
├── created_at
├── timezone
├── locale
└── primary_niche (seniors|posture|postpartum|pelvic_floor|glp1|other)

email_signups          ← /api/notify lands here pre-account
├── id (uuid)
├── email (text, unique)
├── source (text)      ← 'home' | 'seniors' | 'posture' | etc.
├── utm (jsonb)        ← {source, medium, campaign, content, term, fbclid, ttclid, gclid}
├── created_at
├── converted_to_user_id (nullable, fk → profiles.id)
└── unsubscribed_at (nullable)

quiz_sessions
├── id (uuid)
├── profile_id (nullable — pre-auth ok)
├── email_signup_id (nullable, fk → email_signups.id)
├── niche
├── started_at
├── completed_at
├── answers (jsonb)    ← full answer graph
├── plan_id (nullable, fk → user_plans.id)
└── utm (jsonb)

user_plans
├── id (uuid)
├── profile_id (fk → profiles.id)
├── niche
├── generated_at
├── weeks (int, default 12)
├── plan_data (jsonb)  ← snapshot of generated plan: weekly themes, daily prompts
├── status (active | paused | completed | replaced)
└── replaces_plan_id (nullable, self-fk)

daily_completions
├── id (uuid)
├── profile_id (fk)
├── plan_id (fk)
├── week_number (int)
├── day_number (int)
├── movement_completed (bool)
├── nutrition_logged (bool)
├── habit_done (bool)
├── completed_at
└── notes (text, nullable)

weekly_checkins
├── id (uuid)
├── profile_id (fk)
├── week_number
├── weight_lbs (nullable)
├── energy_rating (1-5)
├── sleep_rating (1-5)
├── pain_rating (1-5)
├── photo_urls (text[], nullable)
├── created_at
└── ai_summary (text, nullable)

subscriptions          ← mirror of Stripe state
├── id (uuid)
├── profile_id (fk, unique)
├── stripe_customer_id
├── stripe_subscription_id
├── status (trialing | active | past_due | canceled)
├── current_tier (monthly | quarterly | biannual | annual)
├── trial_end (timestamptz, nullable)
├── current_period_end (timestamptz)
├── canceled_at (nullable)
└── updated_at

events                 ← server-side analytics events (mirror of pixel events)
├── id (uuid)
├── profile_id (nullable)
├── email_signup_id (nullable)
├── event_name (text)
├── properties (jsonb)
├── client_id (text)
├── utm (jsonb)
├── created_at
└── synced_to (text[])  ← which CAPIs we fired this to: ['meta', 'tiktok', 'google']
```

### RLS strategy (Supabase Row-Level Security)

- `profiles`: user can read/write only their own row
- `quiz_sessions`: user can read their own + insert via anon (pre-auth)
- `user_plans`: user reads own only; service-role inserts
- `daily_completions`, `weekly_checkins`: user reads/writes own only
- `subscriptions`: user reads own; service-role only writes (Stripe webhooks)
- `email_signups`: anon can insert (with rate limit); service-role reads
- `events`: service-role only

## Backend services

### Supabase
- Project: `welltread` (ref: `xzjwbrtvxlluwjkjsmgr`, region: ap-northeast-1 / Tokyo)
- Postgres + Auth + Storage + Realtime
- Email magic-link auth via Supabase
- File storage for: weekly check-in photos, exercise demo videos
- RLS as primary auth-z layer (no separate API guard)

### Cloudflare Workers (via opennextjs)
- Single worker serves both `welltread.co` and `welltread.app`
- All Next.js routes (LP, quiz, app)
- Server actions for: quiz progression, plan generation, checkout creation
- Stripe webhook receiver at `/api/webhooks/stripe`
- Conversion-API forwarder at `/api/track/<platform>`

### Stripe
- Hosted Checkout for paywall
- Customer Portal for self-serve billing changes
- Webhook → Supabase `subscriptions` table sync
- 5 prices configured per the matrix above

### Email (TBD)
- Transactional: Resend or Postmark (low volume, ~$10-20/mo at MVP scale)
- Lifecycle: Klaviyo or Customer.io (Phase 1: skip; use Supabase + scheduled Workers for v0)

## Lifecycle architecture

```
Pre-account:
 email_signup → drip 3 emails over 7 days → invite to take quiz

Quiz-no-paywall:
 quiz_complete (no checkout) → plan reveal email → 3-day reminder → 7-day kill

Trial:
 trial_start → day 3 "you're 1/3 through" → day 5 "lock in your spot" → day 7 paywall

Active sub:
 weekly check-in reminder Sunday → mid-week "you're crushing it" → monthly recap

Pre-churn (status=past_due or skip-pattern):
 day 3 missed → "what got in the way?" → 50% off retention offer

Post-churn:
 cancel → 7-day "we miss you" → 30-day cross-sell ("ready for a different track?")
```

Cross-sell paths follow the niche graph:
- Seniors churn → recommend Postpartum (for grandkid-active demo) — meh, not strong
- Posture churn → recommend Sleep / Recovery (when those niches exist)
- Postpartum 18mo+ → graduate to Posture or Sleep
- GLP-1 user post-drug → graduate to maintenance (any niche)

## Performance & infra targets

| Metric | Target | Why |
|---|---|---|
| LCP (Largest Contentful Paint) | < 1.8s | Paid-acq landing page CRO |
| TTI on quiz | < 2.5s | Quiz-start CTR |
| Worker P50 latency | < 150ms | CF edge default |
| Supabase query P95 | < 80ms | Tokyo region, US users add ~120ms — accept for now |
| Cost / 100K monthly visitors | < $50 (CF + Supabase free tier limits) | Solo budget reality |

## Security & compliance

- **HTTPS everywhere** (CF enforces, .app TLD has built-in HSTS)
- **PII minimization**: only email + first name pre-trial. Full name + address only at billing.
- **Health-data scope**: we are *not* a HIPAA-covered entity. We collect movement data, self-reported pain, photos. Avoid: any "diagnosis," "treatment," or doctor-replacing language. Privacy Policy explicit.
- **GDPR/CCPA**: user can export + delete data. Cookie consent for EU/UK traffic (geo-detected).
- **Stripe handles PCI** (we never see card numbers).
- **Refund policy**: 7-day no-questions for first-time annual buyers; 14-day for trial-converters. Models 5% refund into LTV.

## Phase plan

### Phase 0 (now → Saturday)
- [x] Brand + domains
- [x] Repo + CI/CD
- [x] Two niche LPs live
- [x] Email capture endpoint
- [ ] Supabase project provisioned
- [ ] Email signups persist

### Phase 1 (week 1-2)
- [ ] Quiz at `/quiz` with full graph for seniors + posture
- [ ] Plan-reveal mockup pages (static personalized output)
- [ ] Stripe Checkout integration with 5 prices
- [ ] Conversions API forwarder for Meta + TikTok
- [ ] Meta + TikTok pixel embedded
- [ ] First $500 ad-policy classification test (Meta + TikTok)

### Phase 2 (week 3-4)
- [ ] Authenticated PWA shell at welltread.app
- [ ] Daily plan view + workout player
- [ ] Weekly check-in
- [ ] Stripe Customer Portal hookup
- [ ] First $3-8K CRO test budget

### Phase 3 (week 5-8)
- [ ] Real plan engine (movement library + generator)
- [ ] Lifecycle email flows
- [ ] Postpartum and pelvic-floor LPs
- [ ] First retention check (D7 / D30)

### Phase 4 (week 9-12, gated by Phase 1-3 numbers)
- [ ] Capacitor wrapper for App Store / Play Store
- [ ] GLP-1 cohort niche
- [ ] Cross-sell flows
- [ ] Push notifications

## Key technical decisions

### Why CF Workers + opennextjs vs Vercel
- Cost: ~$0/mo at MVP scale vs Vercel Pro $20+
- Edge-everywhere by default (no separate edge runtime config)
- Single bill for DNS + CDN + compute + assets
- We control the domain via the same provider — no DNS dance

### Why Supabase vs PlanetScale + Auth0 etc.
- One tool: Postgres + Auth + Storage + Realtime
- Free tier covers MVP scale
- RLS is the auth-z layer — no separate API gateway
- Pgvector available if we want plan-similarity recommendations later

### Why PWA before native
- 6-week build vs 12-week
- No App Store / Play Store review cycle (avg 24-72h per release)
- Web Push works on modern iOS + Android
- Stripe direct (no 30% IAP)
- Native is a Phase 2 lever once economics justify

### Why one Worker for both domains (vs split)
- Shared codebase = single source of truth
- Lower deploy complexity weekend-1
- Splits naturally when the app section grows (Realtime, push notifications, heavier compute)
- Decision rule: split when worker bundle exceeds 1MB or app-section requires durable objects
