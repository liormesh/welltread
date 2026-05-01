# Welltread - Brand Kit

> Living document. Update as the brand evolves.

## Positioning

**One-line:** Personalized movement programs for the body you have today.

**Full positioning:** Welltread is a multi-niche mobility platform delivered through a quiz-funnel app. A single backend serves multiple body niches (Senior Mobility, Posture & Back 40+; expanding to postpartum, pelvic floor, GLP-1 companion) via dynamic onboarding that adapts to the acquisition channel and user profile.

**Tonality:** Hinge Health credibility crossed with Noom warmth. PT-backed but accessible. Not aesthetics-driven, not bro-fitness, not woo-woo wellness.

## Voice

| | Yes | No |
|---|---|---|
| **Register** | Calm, grounded, knowing | Hype, peppy, clinical-cold |
| **Length** | Short sentences. Concrete nouns. | Marketing run-ons |
| **Authority** | Earned ("we know what works") | Borrowed ("studies show") |
| **Promise shape** | Realistic ranges, honest tradeoffs | Guaranteed transformations |
| **Reader address** | "You" - direct, respectful | "Folks," "ya'll," "buddy" |

**Three voice samples:**
1. *"You used to move. Let&rsquo;s start there."*
2. *"Welltread builds personalized movement programs for the body you have today - not the one you used to have."*
3. *"Small movements, sustainable progress. We adapt as you do."*

## Visual

### Palette
| Token | Hex | Use |
|---|---|---|
| `--color-paper` | `#FAF7F2` | Default background - warm off-white, paper-like |
| `--color-paper-warm` | `#F2EAD3` | Section accent backgrounds |
| `--color-paper-deep` | `#EBE2C9` | Tertiary surface |
| `--color-sage` | `#2D4F4A` | Primary brand. Buttons, headlines accent, links |
| `--color-sage-deep` | `#1F3A36` | Hover states, depth |
| `--color-sage-soft` | `#4A6B66` | De-emphasized brand text |
| `--color-clay` | `#C18C5D` | Eyebrow accents, numerical labels |
| `--color-clay-soft` | `#D9B18D` | Tertiary warmth |
| `--color-ink` | `#1A1A1A` | Body copy |
| `--color-ink-soft` | `#4B5152` | Secondary copy |
| `--color-line` | `#E6DFCF` | Borders, dividers |

### Typography
**System fonts only** - no custom fonts (project rule).

```css
--font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI",
             Roboto, Helvetica, Arial, sans-serif;
--font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
```

#### Type scale (use Tailwind utilities)

| Use | Class | Computed | Example |
|---|---|---|---|
| Display (hero) | `text-7xl` (md+) / `text-6xl` (sm+) / `text-5xl` (mobile) | 4.5/3.75/3rem | "Every step considered." |
| H1 page title | `text-5xl` / `text-6xl` (sm+) | 3/3.75rem | Niche LP heros |
| H2 section | `text-3xl sm:text-4xl` | 1.875/2.25rem | "A program that adjusts to you." |
| H3 card title | `text-2xl` | 1.5rem | NicheCard titles |
| H4 sub-section | `text-lg font-semibold` | 1.125rem | Pain-point headers |
| Body large (lead paragraph) | `text-xl` | 1.25rem | First-paragraph subheads |
| Body | `text-base` | 1rem | Card descriptions |
| Body small | `text-sm` | 0.875rem | Footer, captions |
| Eyebrow | `text-xs uppercase tracking-[0.2em]` | 0.75rem | "Personalized Movement" |

#### Weights & rhythm

- Headlines: `font-semibold` (600), `tracking-tight`, `leading-[1.05]`
- Italic accent phrasings ("considered", "confidence", "move") in `text-sage italic font-normal` - emphasis through *style* not weight
- Body: `font-normal` (400), `leading-relaxed` (1.625)
- Eyebrows: `tracking-[0.2em]`, `text-sage/80` or `text-clay`

### Spacing

| Token | Value | Use |
|---|---|---|
| Section padding | `py-20` to `py-24` | Hero, large content blocks |
| Card padding | `p-8` | NicheCards, feature blocks |
| Form field height | `h-12` | Inputs, buttons |
| Container | `max-w-6xl mx-auto px-6` | Default page wrapper |
| Hero text width | `max-w-2xl` to `max-w-4xl` | Body copy lines stay readable |
| Vertical rhythm | 8px grid (Tailwind default) | All gaps |

### Layout
- Generous whitespace. No dense sections.
- Max content width: 1152px (`max-w-6xl`). Hero text often narrower (`max-w-4xl`).
- Border radius: 1rem (`rounded-2xl`) for inputs and buttons; 1.5rem (`rounded-3xl`) for cards.
- Shadow used sparingly - hover reveal only.

### Component primitives

#### Buttons
```tsx
// Primary
<button className="px-6 h-12 rounded-2xl bg-sage text-paper font-medium hover:bg-sage-deep transition-colors">

// Secondary (outline)
<button className="px-6 h-12 rounded-2xl border border-sage text-sage hover:bg-sage hover:text-paper transition-colors">

// Tertiary (ghost / link-style)
<button className="text-sm text-sage font-medium hover:text-sage-deep">
```

#### Inputs
```tsx
<input className="flex-1 px-4 h-12 rounded-2xl border border-line bg-paper-warm/30 text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition" />
```

#### Cards
```tsx
// Niche card (clickable, hover-active)
<Link className="group rounded-3xl border border-line bg-paper p-8 hover:border-sage/40 hover:shadow-sm transition-all">

// Static card (information-only)
<div className="rounded-3xl border border-line bg-paper p-8">

// Highlighted card (paywall best-value, etc.)
<div className="rounded-3xl border-2 border-sage bg-paper-warm/30 p-8">
```

#### Section dividers
- Section accent backgrounds: `bg-paper-warm/50` with `border-y border-line/60`
- Section labels (eyebrows): centered or left-aligned, paired with H2

#### Forms (multi-step quiz preview)
- One question per screen
- Large tap targets (min 56px height)
- Progress indicator at top: thin sage bar fills 0-100%
- Single CTA per screen, sage filled
- Back link top-left, ghost style

### Motion
- Default `transition-colors` and `transition-all` ease, 150-200ms
- Hover lifts: `hover:shadow-sm` + `hover:border-sage/40`
- Focus rings: 2px `ring-sage/20` for inputs and interactive elements
- No bounce, no parallax - we are *calm*, not energetic
- Scroll: respect `prefers-reduced-motion` for any larger animation we add later

### Accessibility floor
- WCAG AA contrast minimum on all text
- All interactive elements: `min-h-[44px]` tap target
- Visible focus state on every interactive element
- Senior LP: extra-large body text (consider `text-lg` as default), high contrast palette, no thin sage on warm sand
- Form labels always associated with inputs (use `<label htmlFor>` or `aria-label`)

### Content tone (concrete examples)

| Avoid | Use |
|---|---|
| "Transform your body in 12 weeks!" | "A 12-week program that adjusts to you." |
| "Crush your fitness goals!" | "Move with confidence again." |
| "AI-powered personalization" | "Built around what your body's asking for." |
| "Blast belly fat" | "Functional strength to keep you independent." |
| "Get the body you've always dreamed of" | "You used to move. Let's start there." |
| "Revolutionary new method" | "Built around the things that matter most." |
| Headers ending in exclamation | Headers ending in period - or no punctuation |

### Photography (when added)
- Real people, not models. Real environments, not studios.
- Natural light. Composition leans documentary, not commercial.
- Across age range (40s, 60s, 70s, postpartum bodies) - match niche.
- Avoid: gym aesthetics, athleisure-product placement, transformation-photo grids.

## Niches

### Senior Mobility (60+)
- **Tagline:** *Move with confidence again.*
- **Pain points:** balance, fall prevention, gentle strength, joint sensitivity
- **Tone:** respectful, no condescension. They&rsquo;re competent adults who want to stay independent.
- **Avoid:** "active aging" cliches, walker imagery, "young at heart" tropes

### Posture & Back, 40+
- **Tagline:** *You used to move. Let&rsquo;s start there.*
- **Pain points:** desk-job back, forward shoulders, energy fade, "I used to be in shape"
- **Tone:** masculine but not bro. Dad-aware. Science-cited but not preachy.
- **Avoid:** "transform your body" hype, before/after physiques, six-pack imagery

### Future niches (planned)
- Postpartum recovery (0–18mo): pelvic floor, diastasis recti, sleep-aware programming
- Pelvic floor (mixed): post-prostate, post-childbirth, age-related
- GLP-1 companion: muscle preservation, sustained mobility while on the drug

## Domain ecosystem

| Domain | Role |
|---|---|
| **welltread.co** | Primary brand. Marketing site, all LPs, quiz, paywall. Use everywhere external |
| **welltread.app** | Future authenticated product subdomain. Currently mirrors `.co` via shared Workers deploy |
| _welltreadapp.com_ | Not registered. Considered but skipped |

## Brand "no"s

- No custom fonts (use system stack)
- No before/after weight photos
- No "lose X pounds in Y weeks" framing
- No clinical/medical claims (lifestyle positioning only)
- No bro-fitness language
- No "AI-powered" hero copy (it&rsquo;s table stakes)
- No founder face on hero (faceless brand for paid acq)

## Source of truth links

- Market intel: [knowledge-base/projects/online-courses](../../knowledge-base/projects/online-courses/)
- Sober-curious case (related research): [knowledge-base/projects/online-courses/research/sober-curious-2026.md](../../knowledge-base/projects/online-courses/research/sober-curious-2026.md)
