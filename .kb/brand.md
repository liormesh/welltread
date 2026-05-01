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

- Headlines: `font-sans`, weight 600, tracking-tight, leading-[1.05]
- Italic phrasings (e.g., "considered", "confidence") in sage for emphasis-as-accent
- Body: `font-sans`, weight 400, leading-relaxed
- Eyebrows: uppercase, tracking-[0.2em], 0.75rem, sage/80

### Layout
- Generous whitespace. No dense sections.
- Max content width: 1152px (`max-w-6xl`). Hero text often narrower (`max-w-4xl`).
- Border radius: 1rem (`rounded-2xl`) for inputs and buttons; 1.5rem (`rounded-3xl`) for cards.
- Shadow used sparingly - hover reveal only.

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
