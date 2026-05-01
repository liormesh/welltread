# Welltread - Paid Acquisition Channels

> Living strategy doc + integration spec. Last revision: 2026-05-01.

## Channel ranking for Welltread

Scored on: ICP fit (does our demo live there?), creative fit (does our format work?), CPM viability, policy risk for movement/wellness creative, scaling headroom.

| # | Channel | ICP fit | Creative fit | CPM (US) | Policy risk | Scale ceiling | Verdict |
|---|---|---|---|---|---|---|---|
| 1 | **Meta (FB+IG)** | Excellent for 40+ posture, seniors, postpartum | Excellent (UGC+static+video) | $25-50 | Med (auto-classify risk) | Massive | **Primary** |
| 2 | **TikTok** | Strong for 35-55, growing 60+ | Native UGC, vertical video | $15-30 | Low-med | Massive | **Primary** |
| 3 | **YouTube (Demand Gen + In-Stream)** | Excellent for seniors, posture (Huberman/Williamson audience) | High-quality video, story-driven | $20-40 | Low | Large | **Primary** |
| 4 | **Google Ads (Search + PMax)** | Strong for high-intent ("hip mobility exercises 60+") | Search ad copy + landing page | $40-80 (high-intent terms) | Low | Medium | **Secondary** |
| 5 | **Reddit Ads** | Niche-strong (r/loseit, r/fitness30plus, r/Mommit) | Conversational, native | $5-15 | Low | Medium | **Secondary** |
| 6 | **Pinterest** | Strong for postpartum, seniors (women), wellness | Static image, infographic | $10-25 | Low | Medium | **Secondary** |
| 7 | **LinkedIn** | Weak for our demos | Long-form, B2B-feeling | $80-150 | Low | Small | Skip |
| 8 | **Snapchat** | Weak fit (younger demo) | Vertical video | $20-40 | Med | Small | Skip |
| 9 | **X / Twitter** | Weak fit, low conversion | Text + image | $15-30 | Low | Small | Skip |
| 10 | **Spotify Audio Ads** | Possible for posture/Huberman audience | Audio + companion banner | $15-25 CPM | Low | Small | Tertiary |

## Recommended channel mix by phase

### Phase 1: Validation ($3-8K, weeks 1-2)
- **Meta** (60% of spend) - primary CRO test, highest creative volume
- **TikTok** (40%) - secondary signal, lower CPM cushion

### Phase 2: Scale ($30-80K/month, weeks 3-12)
- **Meta** (45%) - scale winning creative, broad + lookalike audiences
- **TikTok** (25%) - viral creative spend, Spark Ads with influencer UGC
- **YouTube Demand Gen** (15%) - awareness-to-conversion funnel
- **Google Ads PMax** (10%) - capture high-intent demand
- **Reddit/Pinterest** (5% combined) - niche lift testing

## Per-channel integration spec

Each channel needs three integrations: **pixel** (browser-side), **conversions API** (server-side), and **catalog/audience exchange** (for retargeting and lookalikes). Server-side is non-negotiable in 2026 - iOS ATT + ad blockers + Privacy Sandbox kill 30-50% of pixel-only events.

---

### 1. Meta (Facebook + Instagram)

**What we need:**
- Meta Business Manager + Ad Account (under welltread LLC)
- Meta Pixel (browser-side) for client events
- Conversions API (CAPI) for server-side events
- Domain verification (welltread.co)
- Aggregated Event Measurement (iOS 14+ priority list)

**Tracking events:**
| Event | Trigger | Pixel + CAPI |
|---|---|---|
| `PageView` | Every page load | Pixel auto |
| `ViewContent` | LP view (`/seniors`, `/posture`) | Both |
| `Lead` | Email signup (`/api/notify` success) | Both, server-side primary |
| `InitiateCheckout` | Quiz complete + paywall view | Both |
| `AddPaymentInfo` | Trial started | Both, server-side primary |
| `Purchase` | First paid renewal post-trial | Both, server-side primary |
| `Subscribe` (custom) | Status change to active | Server-side only |

**Implementation:**
1. **Pixel snippet** in `<head>` of `app/layout.tsx` (env-driven `NEXT_PUBLIC_META_PIXEL_ID`)
2. **CAPI** via Edge route at `/api/track/meta` that proxies to `https://graph.facebook.com/v19.0/<pixel_id>/events`
3. **Click ID capture**: `fbclid` URL param → first-party cookie `_fbc` (90-day TTL)
4. **External ID**: hashed email or our internal user ID, used for cross-device deduplication
5. **iOS ATT**: configure 8 priority events for Aggregated Event Measurement; Purchase = priority 8

**Domain verification:** add Meta TXT record to `welltread.co` zone via Cloudflare. Mandatory for AEM and iOS ATT compatibility.

**Aggregated Event Measurement priority order (iOS):**
1. Purchase, 2. Subscribe, 3. AddPaymentInfo, 4. InitiateCheckout, 5. CompleteRegistration, 6. Lead, 7. ViewContent, 8. PageView

---

### 2. TikTok Ads

**What we need:**
- TikTok For Business account + Ad Account
- TikTok Pixel (browser-side)
- Events API (server-side, equivalent of CAPI)
- Domain verification (welltread.co)

**Tracking events (TikTok-named):**
| Event | Maps to (Meta equiv) |
|---|---|
| `ViewContent` | LP view |
| `Subscribe` | Email signup or paid sub |
| `InitiateCheckout` | Paywall view |
| `AddToCart` | Trial started |
| `CompletePayment` | First paid renewal |
| `Lead` | Email signup |

**Implementation:**
1. **Pixel** via `<script>` snippet, env-driven `NEXT_PUBLIC_TIKTOK_PIXEL_ID`
2. **Events API** at `/api/track/tiktok` posting to `https://business-api.tiktok.com/open_api/v1.3/event/track/`
3. **Click ID** capture: `ttclid` URL param → cookie + forwarded to Events API
4. **Test events**: TikTok provides a Test Events Code for sandbox verification before going live
5. **Match key**: hashed email + advertising ID

---

### 3. Google Ads (Search + PMax + Demand Gen on YouTube)

**What we need:**
- Google Ads Account (under welltread LLC, billing card)
- Google Tag (gtag.js) - browser
- Enhanced Conversions for Web (server-side complement)
- Conversions linked to GA4 (recommended unified setup)
- Google Tag Manager (optional, recommended for multi-tag management)

**Tracking events:**
| Event | Type | Notes |
|---|---|---|
| `email_signup` | Conversion | Goal: Lead |
| `quiz_complete` | Conversion (secondary) | Pre-purchase signal |
| `trial_start` | Conversion | Goal: Sign up |
| `purchase` | Conversion (primary) | Tied to revenue |

**Implementation:**
1. Install **Google Tag** snippet via `<Script>` component in layout
2. Fire conversions via `gtag('event', 'conversion', {...})`
3. **Enhanced Conversions** - hashed email + phone forwarded server-side at conversion time (boosts match rate 5-15%)
4. Auto-tagging on (default) - captures `gclid` automatically
5. **GA4 link**: configure GA4 property as the source of truth; import conversions from GA4 to Ads

**PMax campaign**: requires asset groups with images, videos, headlines, descriptions, sitelinks. Build a creative library of 30-50 assets (mix of static + 15s video).

**Demand Gen on YouTube**: vertical video creative, 15-30s, channel-aware (Huberman audience overlap targeting).

---

### 4. Reddit Ads

**What we need:**
- Reddit Ads account
- Reddit Pixel
- Reddit Conversions API (post-2024 launch)

**Tracking events:**
| Event | Notes |
|---|---|
| `PageVisit` | Every page |
| `Lead` | Email signup |
| `SignUp` | Trial start |
| `Purchase` | Paid sub |

**Implementation:**
1. Pixel snippet via env-driven `NEXT_PUBLIC_REDDIT_PIXEL_ID`
2. CAPI at `/api/track/reddit`
3. Subreddit-targeting goldmine: r/loseit (4.5M), r/fitness30plus, r/postpartum, r/Mommit, r/Stronger_By_Science, r/seniorsdiscount

**Best for:** Conversational creative, problem-aware audiences. Lower CTR than Meta but lower CPM and higher subreddit-aligned intent.

---

### 5. Pinterest

**What we need:**
- Pinterest Business Account
- Pinterest Tag (browser pixel)
- Conversions API (CAPI)

**Tracking events:**
| Event | Notes |
|---|---|
| `pagevisit` | Every page |
| `lead` | Email signup |
| `signup` | Trial start |
| `checkout` | Paid sub |

**Implementation:**
1. Pixel snippet, env-driven
2. CAPI at `/api/track/pinterest`
3. Domain claim via meta tag in `<head>`
4. Catalog feed (later): for Pin shopping ads of the program tiers

**Best for:** Static infographic creative ("5 mobility moves for 60+", "the 4pm back-pain reset"). Long content lifespan - pins surface for months.

---

### 6. YouTube (via Google Ads)

Covered under Google Ads (Demand Gen + Video Action Campaigns). Distinct creative requirements:

- 6s bumper, 15s skippable, 30s skippable, 60s long-form
- Vertical (Shorts placement) variants required
- Companion banners for in-stream ads
- Audio-only ad variant for music streaming placements

**Best for:** Huberman/Williamson/Attia audience overlap targeting. High CPM but high-quality.

---

### 7. Spotify Audio Ads (tertiary)

**What we need:**
- Spotify Ad Studio account (self-serve)
- 15-30s audio creative
- Companion 640x640 image

**Tracking:** Spotify reports impressions/listens/CTR. For attribution to web conversions, use a unique trackable URL (`welltread.co/spotify`) and tie via UTM. No pixel.

**Best for:** Audio-first listeners (Huberman podcast network audience). Tertiary scale.

---

## Cross-channel tracking architecture

### First-party attribution layer

All paid traffic flows through this:

```
Ad click → LP arrival
  ├── Capture URL params: utm_*, fbclid, ttclid, gclid, msclkid
  ├── Set first-party cookie `wt_attr` (30-day TTL): { source, medium, campaign, click_ids, first_seen, last_seen }
  └── Forward to all conversion APIs at every key event
```

### Server-side event router

Single endpoint `/api/track/event` receives a normalized event payload, fans out to enabled platforms:

```ts
POST /api/track/event
{
  event: "lead" | "checkout" | "trial" | "purchase" | "subscribe",
  email?: string,           // hashed before forwarding
  user_id?: string,
  value?: number,           // currency value
  currency?: "USD",
  click_ids: { fbclid, ttclid, gclid },
  utm: { source, medium, campaign, content, term },
  client_id: string,        // first-party random
  user_agent: string,
  ip_country: string
}

→ fan-out to:
  - Meta CAPI (Pixel ID + access token)
  - TikTok Events API
  - Google Ads Enhanced Conversions
  - Reddit CAPI
  - Pinterest CAPI
  - GA4 Measurement Protocol
```

This is the moat: one event source, six platforms get high-quality signal, ad blockers can't break it.

### Deduplication

Each platform expects a `event_id` so it can dedupe pixel-fired and server-fired versions of the same event. We generate `event_id = uuid()` at conversion, fire to pixel with `event_id`, and to server CAPI with same `event_id`.

### What to add to env / secrets

| Var | Purpose | Where |
|---|---|---|
| `NEXT_PUBLIC_META_PIXEL_ID` | Browser pixel init | wrangler vars |
| `META_CAPI_ACCESS_TOKEN` | Server-side CAPI auth | Workers secret |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | Browser | wrangler vars |
| `TIKTOK_CAPI_ACCESS_TOKEN` | Server | Workers secret |
| `NEXT_PUBLIC_GTAG_ID` | Browser (GA4 + Ads) | wrangler vars |
| `GOOGLE_ADS_DEVELOPER_TOKEN` | Enhanced conversions | Workers secret |
| `NEXT_PUBLIC_REDDIT_PIXEL_ID` | Browser | wrangler vars |
| `REDDIT_CAPI_ACCESS_TOKEN` | Server | Workers secret |
| `NEXT_PUBLIC_PINTEREST_TAG_ID` | Browser | wrangler vars |
| `PINTEREST_CAPI_ACCESS_TOKEN` | Server | Workers secret |

## Privacy & consent architecture

- **EU/UK traffic** (geo-detect via CF `cf-ipcountry`): show consent banner before pixel fire. Server-side events still fire but with consent flag.
- **CCPA / California**: include opt-out link in footer; respect Global Privacy Control header.
- **Pixel consent gating**: GA4 Consent Mode v2 supported; Meta Limited Data Use mode for opt-outs.
- **PII hashing**: emails always SHA-256 hashed before being sent to ad platforms.

## Domain verification + ownership

| Platform | Method | Status |
|---|---|---|
| Meta | TXT record on welltread.co | TODO before first ad |
| TikTok | Meta tag in `<head>` | TODO |
| Google Search Console | DNS or HTML file | TODO |
| Pinterest | Meta tag in `<head>` | TODO |
| Reddit | Domain ownership through tag | TODO |

All can be configured at the same time when you're ready to launch ads. Plan to do them as a batch in week 1 of paid spend.

## Creative spec per channel (high-level)

| Channel | Format priorities | Aspect ratios |
|---|---|---|
| Meta Feed | Static + 15s video + carousel | 1:1, 4:5, 9:16 |
| Meta Stories/Reels | 15s vertical video, native | 9:16 |
| TikTok | UGC-style 15-30s vertical | 9:16 |
| YouTube Pre-roll | 15s + 30s + 60s skippable | 16:9 |
| YouTube Shorts | 15-60s vertical | 9:16 |
| Google Search | Headline + description text | n/a |
| Google PMax | Mixed asset library | All ratios |
| Reddit | Static + short native video | 1.91:1 |
| Pinterest | Static infographic, long-form | 2:3, 1:1 |
| Spotify | 30s audio + 640x640 companion | n/a + 1:1 |

## Phase 1 launch checklist (reordered for execution)

```
Week 1:
[ ] Meta Business Manager set up under welltread LLC
[ ] Domain verify welltread.co on Meta (TXT record)
[ ] Install Meta Pixel via NEXT_PUBLIC_META_PIXEL_ID env
[ ] Set up Meta CAPI endpoint at /api/track/meta
[ ] Create first ad campaign (lifestyle framing for classification test)
[ ] $500 classification test → if approved, scale spend
[ ] TikTok For Business + Pixel installed in parallel

Week 2:
[ ] Add Google Tag + GA4 (NEXT_PUBLIC_GTAG_ID)
[ ] Set up Reddit Ads + pixel (parallel)
[ ] Build first creative set: 5 hooks, 3 formats each = 15 ads per niche
[ ] Launch CRO test budget per niche

Week 3:
[ ] Pinterest tag + first 20 pins
[ ] Spotify Ad Studio (test small)
[ ] Add YouTube Demand Gen via Google Ads
[ ] Conversion API health check across all 5 platforms
```

## What I won't do (and why)

- **LinkedIn Ads** - too expensive, wrong audience for our niches
- **X/Twitter Ads** - poor signal-to-noise, audience volatility
- **Snapchat** - demo too young
- **Programmatic display (DV360, GDN remarketing)** - until $50K+ monthly we can't justify the operational overhead
