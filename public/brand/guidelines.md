# Welltread — Brand Mini-Guideline

Version 1.0 — 2026-05-03

## The Mark

Welltread's logo is a **combination mark**: a symbol of three rounded ascending dashes paired with the lowercase wordmark "welltread." The dashes represent footsteps along an ascending path — the brand's promise of progress through deliberate movement.

## Lockups

| Variant | File | Use |
|---|---|---|
| Primary | [`logo/primary/welltread-logo.svg`](logo/primary/welltread-logo.svg) | Default — web headers, marketing, presentations |
| Symbol only | [`logo/symbol/welltread-symbol.svg`](logo/symbol/welltread-symbol.svg) | Favicon, app icon, social avatars, narrow contexts |
| Wordmark only | [`logo/wordmark/welltread-wordmark.svg`](logo/wordmark/welltread-wordmark.svg) | When the symbol is too small to read, or in long horizontal strips |
| Mono | [`logo/mono/welltread-symbol-mono.svg`](logo/mono/welltread-symbol-mono.svg) | Single-color print, embossing, etching |
| Reverse | [`logo/reverse/welltread-symbol-reverse.svg`](logo/reverse/welltread-symbol-reverse.svg) | On dark backgrounds — paper on sage |

## Clear-Space

Minimum clear space on all sides equals the height of one dash unit (about 1/10 of the symbol height). Don't crowd.

## Minimum Size

| Surface | Primary lockup | Symbol only |
|---|---|---|
| Print | 24mm wide | 8mm wide |
| Digital | 96px wide | 24px wide |
| Favicon floor | — | 16px (hand-tune required, see notes) |

## Color Palette

| Color | Use | HEX | RGB |
|---|---|---|---|
| Sage | Primary brand color | `#2d4f4a` | 45 79 74 |
| Sage Deep | Hover, depth | `#1f3a36` | 31 58 54 |
| Sage Soft | Subtle accents | `#4a6b66` | 74 107 102 |
| Paper | Background | `#faf7f2` | 250 247 242 |
| Paper Warm | Card surfaces | `#f2ead3` | 242 234 211 |
| Clay | Accent / warmth | `#c18c5d` | 193 140 93 |
| Ink | Body text | `#1a1a1a` | 26 26 26 |
| Line | Borders | `#e6dfcf` | 230 223 207 |

## Typography

The wordmark uses the **system-font stack** — SF Pro on macOS/iOS, Segoe UI on Windows, Roboto on Android. This is consistent with the product's UI typography (per `feedback_no_custom_fonts.md`).

```
font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI',
             Roboto, Helvetica, Arial, sans-serif;
font-weight: 500;
letter-spacing: -0.3px;
case: lowercase
```

The wordmark renders natively per platform — no font file to ship.

## Do / Don't

| ✓ Do | ✗ Don't |
|---|---|
| Use sage on cream paper as default | Place on busy photographic backgrounds |
| Maintain clear-space of one dash height | Crowd with adjacent text or images |
| Use reverse variant on sage backgrounds | Recolor the symbol with non-brand colors |
| Scale uniformly | Stretch horizontally or vertically |
| Use symbol-only at favicon size | Squeeze the full lockup below 96px wide |
| Use mono variant for single-color print | Apply gradients, shadows, or effects |

## Implementation in Next.js

Drop these files into `app/` for Next.js App Router auto-wiring:

```
app/icon.svg               (copy from public/brand/favicon/icon.svg)
app/apple-icon.svg         (copy from public/brand/favicon/apple-icon.svg)
app/manifest.webmanifest   (copy from public/brand/favicon/manifest.webmanifest)
```

Or reference directly via `<Head>` if you prefer explicit control.

## Notes & Caveats

- **The 16×16 favicon needs hand-tuning.** The current SVG renders three dashes ascending — at 16px, the strokes may visually merge. If you observe this in production, hand-craft a separate 16×16 ICO with bumped stroke weights.
- **For commercial print, signage, or embroidery** at scale (≥10cm wide), redraw the symbol from the SVG master in Illustrator or Figma to ensure pixel-perfect Bezier curves and proper Pantone color values.
- **The wordmark** uses a system font intentionally — consistent with the rest of the product. If a future custom typeface is licensed for the brand (e.g., Inter, Söhne), update this file and re-export the wordmark/primary lockup SVGs.
- **Trademark:** wordmark "Welltread" registration recommended before significant marketing investment. Symbol alone is harder to defend; the combination mark together is the strongest claim.
