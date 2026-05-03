export const metadata = {
  title: "Product framework - Welltread Vault",
  robots: { index: false, follow: false, nocache: true },
};

export default function ProductFramework() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 space-y-16">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
          12 - Product framework
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-ink leading-[1.05]">
          The actual{" "}
          <span className="text-sage italic font-normal">workout course</span>.
        </h1>
        <p className="mt-6 text-lg text-ink-soft max-w-3xl leading-relaxed">
          What lives behind the paywall. The 12-week personalized program.
          Composable content, adaptive assignment, daily delivery, weekly
          adjustments. PT-designed, contraindication-aware, mobile-first.
        </p>
      </header>

      {/* THE ASSET LAYER */}
      <Section eyebrow="A" title="Content composition (the asset layer)">
        <p className="text-ink-soft mb-8 max-w-3xl leading-relaxed">
          We build a graph, not a catalog. New niches add atomic content;
          they don&rsquo;t require new bespoke programs.
        </p>

        <div className="space-y-3">
          <Layer
            n="01"
            title="Movement"
            scope="Atomic unit"
            body="One exercise. Has video, cue, body region, contraindications, regression/progression links, niche tags. Library scales: 80 movements at launch, 200-300 by month 6, 500+ by year 1."
            example="'Heel-to-toe walk, 30s, walking 10 steps in a straight line.' Tagged: balance, ankle, hip; senior-niche; difficulty 1; equipment none."
          />
          <Layer
            n="02"
            title="Block"
            scope="Reusable group of 3-6 movements with shared intent"
            body="Warmup blocks, balance blocks, strength blocks, mobility flows, cooldowns. Reused across many sessions - 'Standing balance basics' appears in seniors-week-1 AND posture-week-3."
            example="Block 'Warm Hips & Ankles' = ankle circles 30s + hip openers 45s + standing march 30s. Used in 14 different sessions."
          />
          <Layer
            n="03"
            title="Session"
            scope="One workout (10-30 min)"
            body="Warmup block + 1-3 main blocks + cooldown block. The thing the user starts when they open the app."
            example="'Day 3 - Foundation Strength' = Warm Hips block (3min) + Standing Strength block (8min) + Floor Mobility block (3min) + Recovery block (1min)."
          />
          <Layer
            n="04"
            title="Week template"
            scope="5-7 sessions in a coherent pattern"
            body="The weekly arc. 4-day, 5-day, 6-day variants of each template (matched to user commitment). Theme + key milestone."
            example="'Week 6 - Senior Mobility - Dynamic Balance' = MWF strength sessions, TT mobility, weekend rest. Milestone: hold single-leg balance for 10 seconds."
          />
          <Layer
            n="05"
            title="Program archetype"
            scope="12-week skeleton"
            body="Niche-aware. 6-8 archetypes cover all year-1 niches. Has an intensity curve (week 1 baseline → week 12 peak). Archetypes share blocks; only the assignment changes."
            example="'Senior Balance Reset' (12 weeks) - Week 1-3 foundation, week 4-6 progressive load, week 7-9 dynamic balance, week 10-12 resilience integration."
          />
          <Layer
            n="06"
            title="User plan (the assignment)"
            scope="The user's actual instance"
            body="Created at $1 trial start. Pulls archetype based on niche + Q1 goals + Q2 age + Q24 commitment. Filtered by Q5/Q7 contraindications, Q10 time, equipment availability."
            example="Maria's plan = 'Posture Foundation' archetype, 4 sessions/week, 15-min sessions, no spinal flexion (disc issue from Q7), uses Maria's age-band content."
          />
          <Layer
            n="07"
            title="Assignment engine"
            scope="The rules"
            body="Deterministic, not LLM. Filters → scores → picks. Caches the rendered week so we're not recomputing on every page load."
            example="Pipeline: archetype → week template → for each session slot, filter by niche + contraindications + equipment + difficulty + time → score by novelty + goal-fit → pick top → cache."
          />
        </div>
      </Section>

      {/* DELIVERY */}
      <Section eyebrow="B" title="Delivery & daily flow (the experience layer)">
        <p className="text-ink-soft mb-8 max-w-3xl leading-relaxed">
          PWA-first at <code className="text-xs bg-paper-warm/40 px-2 py-1 rounded">welltread.app</code>.
          Native iOS/Android via Capacitor wrappers in Phase 2.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Screen
            name="/app/today"
            role="The dashboard"
            body="Above-the-fold: today's session, large play button, est. minutes. Below: streak count, weekly progress, gentle nudge if user hasn't moved in 36h."
          />
          <Screen
            name="/app/session/[id]"
            role="The workout"
            body="Full-screen video player, movement-by-movement. Each movement shows: video loop + PT cue + timer / rep count. Skip / pause / 'this hurts' button (logs the swap, surfaces alternative)."
          />
          <Screen
            name="/app/done"
            role="Post-session check-in"
            body="2-question micro-feedback: pain rating 1-5, energy rating 1-5. Optional: 'how did this feel?' with chips (too easy / just right / too hard / hurt me). Drives adaptation."
          />
          <Screen
            name="/app/week"
            role="Week overview"
            body="7-day grid. Past sessions: completed/skipped status. Today: highlighted. Future: blurred until day-of (anti-anxiety design)."
          />
          <Screen
            name="/app/checkin/weekly"
            role="Sunday check-in"
            body="5 questions: how did the week feel? Stiffness change? Sleep change? Energy change? Anything to flag? Drives adaptation + email nudge if missed."
          />
          <Screen
            name="/app/library"
            role="Browse mode (later)"
            body="On-demand single sessions outside the program. Useful when traveling / high-stress / curious. Phase 3."
          />
          <Screen
            name="/app/billing"
            role="Stripe Customer Portal"
            body="Tier change, cancel, payment method, billing history. Embedded Stripe-hosted portal."
          />
          <Screen
            name="/app/profile"
            role="Re-take quiz"
            body="Re-run the assessment to refresh the plan. Triggered manually or by month-3 prompt. Generates a new plan that replaces the old one (history preserved)."
          />
        </div>
      </Section>

      {/* CONTENT PRODUCTION */}
      <Section eyebrow="C" title="Content production (the supply chain)">
        <p className="text-ink-soft mb-6 max-w-3xl leading-relaxed">
          Every published movement is PT-reviewed. Production happens in
          batches; the assignment engine recombines.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Box
            title="Phase 1 batch (~80 movements)"
            body="One studio day with one PT. Sage/paper-warm set, two camera angles (45° + side), no music in source files. ~15 min average per movement (setup + delivery + reset). Edited later for length, captioned, sage-branded."
          />
          <Box
            title="Movement metadata pipeline"
            body="PT records → footage uploaded to CF Stream → admin UI tags movement (regions, tags, difficulty, contraindications, regression/progression FK) → preview on staging → published."
          />
          <Box
            title="Block + session authoring"
            body="Content lead composes blocks + sessions in the admin UI. Each gets PT review before publishing. New sessions inherit the existing movement library; we don't re-record."
          />
          <Box
            title="Niche expansion"
            body="A new niche (e.g. postpartum) = one studio day for 30-60 niche-specific movements + 10-15 niche blocks + 1 archetype with 12 week templates. ~1-2 weeks of focused content work + PT review."
          />
        </div>
      </Section>

      {/* ADAPTATION */}
      <Section eyebrow="D" title="Adaptation (how the plan learns)">
        <p className="text-ink-soft mb-6 max-w-3xl leading-relaxed">
          The plan moves with the user. Not LLM-driven; deterministic rules
          on top of structured feedback.
        </p>

        <table className="w-full text-sm rounded-2xl overflow-hidden border border-line">
          <thead className="bg-paper-warm/40 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-sage">Trigger</th>
              <th className="px-4 py-3 font-semibold text-sage">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60 bg-paper">
            <Trigger
              when="3 sessions in a row marked 'too easy'"
              then="Bump difficulty_tier +1 for next week. Surface notice on /app/today."
            />
            <Trigger
              when="2 sessions skipped in a row"
              then="Swap next session to easier variant + send 'small day?' nudge with 5-min option."
            />
            <Trigger
              when="Pain rating ≥4 on a body region (post-session)"
              then="Reduce intensity in that region for next 3 sessions. Notify PT review queue."
            />
            <Trigger
              when="Weekly check-in flags 'hurt'"
              then="Halt program, surface 'something to flag with your provider' message + provide PT-vetted recovery sessions."
            />
            <Trigger
              when="4-week mark"
              then="Soft re-eval: re-ask the activity-and-energy questions. If goals shifted, propose archetype swap."
            />
            <Trigger
              when="Trial-end (day 7) without conversion"
              then="Fully convert payment. No special handling; trial mechanic is solely a financial gate, not a content gate."
            />
            <Trigger
              when="Plan complete (week 12)"
              then="Graduation flow. Offer: continuation archetype (e.g. 'Senior Balance Maintenance' 12wk) OR niche switch (e.g. user wants to add posture work)."
            />
          </tbody>
        </table>
      </Section>

      {/* DATA MODEL */}
      <Section eyebrow="E" title="Data model (what gets persisted)">
        <p className="text-ink-soft mb-6 max-w-3xl leading-relaxed">
          Builds on the 9 tables already shipped. Adds the content + assignment layer.
        </p>
        <table className="w-full text-sm rounded-2xl overflow-hidden border border-line">
          <thead className="bg-paper-warm/40 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-sage">Table</th>
              <th className="px-4 py-3 font-semibold text-sage">State</th>
              <th className="px-4 py-3 font-semibold text-sage">Purpose</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60 bg-paper">
            <DataRow t="movement_library" state="exists" purpose="Atomic exercises + metadata + video URL" />
            <DataRow t="blocks" state="todo" purpose="Reusable groupings of movements" />
            <DataRow t="block_movements" state="todo" purpose="Junction: which movements in which order, with overrides (duration, reps, rest)" />
            <DataRow t="sessions" state="todo" purpose="One workout (warmup + main + cooldown blocks)" />
            <DataRow t="session_blocks" state="todo" purpose="Junction: which blocks in which order" />
            <DataRow t="week_templates" state="todo" purpose="7-day session schedules per archetype + commitment level" />
            <DataRow t="program_archetypes" state="todo" purpose="12-week skeletons per niche" />
            <DataRow t="user_plans" state="exists" purpose="The assignment - one row per active user plan" />
            <DataRow t="user_plan_weeks" state="todo" purpose="Cached rendered week (computed by assignment engine)" />
            <DataRow t="daily_completions" state="exists" purpose="Each session done, with pain + energy + 'how did this feel'" />
            <DataRow t="weekly_checkins" state="exists" purpose="Sunday check-in answers" />
            <DataRow t="profiles" state="exists" purpose="User identity + auth link" />
          </tbody>
        </table>
      </Section>

      {/* PHASE PLAN */}
      <Section eyebrow="F" title="Build phases (what ships when)">
        <ol className="space-y-4">
          <Phase
            n="P1"
            title="Hardcoded MVP"
            weeks="weeks 1-2"
            body="One archetype per launch niche (Senior Balance Reset, Posture Foundation). 12 week templates each, hand-built. ~80 movements. Hardcoded assignment - everyone in the same niche + commitment gets the same plan. Goal: real product on day 1 of paid acq."
          />
          <Phase
            n="P2"
            title="Personalization v1"
            weeks="weeks 3-6"
            body="Equipment + contraindication filters. Goal-overlap scoring. 200+ movements. User-flagged 'too easy / too hard / hurt me' triggers manual swap rules. /app/library gets 10-20 standalone sessions for off-program days."
          />
          <Phase
            n="P3"
            title="Adaptive engine"
            weeks="months 4-6"
            body="Auto-adaptation on completion data (intensity bump, body-region taper, archetype swap). Re-eval at week 4 + week 8. Cross-niche recommendations ('we noticed you're managing back pain - want to add posture sessions?')."
          />
          <Phase
            n="P4"
            title="Native + creator content"
            weeks="months 7+"
            body="iOS + Android via Capacitor wrappers (PWA core). Curated PT-instructor content (Peloton-instructor model, not open marketplace - per the creator-economy axiom)."
          />
        </ol>
      </Section>

      {/* RISKS */}
      <Section eyebrow="G" title="Product risks">
        <div className="space-y-3">
          <Edge
            title="Low trial-to-paid conversion"
            handle="Mitigated by: plan reveal showing real value (Q19 plug-in, week-1 sample sessions playable), $1 commitment psychology, 30-day money-back. Target: 40-50% trial-to-paid (industry: 35-50%)."
          />
          <Edge
            title="Adherence drops after week 2"
            handle="Mitigated by: 12-min daily sessions (sustainable), weekly check-in nudges, streak mechanics, the activity-from-Q19 reminder ('week 6: getting closer to gardening pain-free'). Target: 60% week-4 active."
          />
          <Edge
            title="Liability on senior content"
            handle="Mitigated by: PT review of every published movement, contraindication filters, red-flag screen at quiz, 'something hurts' flag in app, no medical claims, LLC structure."
          />
          <Edge
            title="Content production bottleneck"
            handle="Mitigated by: composable architecture - new niches reuse 70-80% of existing library. Phase 4 LLM-assisted block authoring (with PT review)."
          />
          <Edge
            title="Refund abuse"
            handle="Mitigated by: 30-day window, requires sign-in (not anonymous), tracked by email + payment method. Real abuse rate in this category: 3-7%. Honor it - bad refund experiences kill brand more than minor abuse."
          />
        </div>
      </Section>

      <p className="text-sm text-ink-soft pt-12 border-t border-line">
        Detailed earlier draft (with deeper architecture notes):{" "}
        <code className="text-xs bg-paper-warm/40 px-2 py-1 rounded">
          ~/Documents/knowledge-base/projects/welltread/training-plan-architecture.md
        </code>
      </p>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line pt-10">
      <p className="text-xs uppercase tracking-[0.2em] text-clay mb-2">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-ink mb-6">{title}</h2>
      {children}
    </section>
  );
}

function Layer({
  n,
  title,
  scope,
  body,
  example,
}: {
  n: string;
  title: string;
  scope: string;
  body: string;
  example: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <div className="flex items-baseline gap-3">
          <span className="text-xs font-mono text-clay">{n}</span>
          <h3 className="text-lg font-semibold text-ink">{title}</h3>
        </div>
        <span className="text-xs text-ink-soft/70 italic">{scope}</span>
      </div>
      <p className="text-sm text-ink-soft leading-relaxed">{body}</p>
      <p className="mt-3 text-xs text-ink-soft/80 italic bg-paper-warm/40 px-3 py-2 rounded-lg">
        {example}
      </p>
    </div>
  );
}

function Screen({
  name,
  role,
  body,
}: {
  name: string;
  role: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <code className="text-xs text-sage font-mono">{name}</code>
        <span className="text-xs text-clay uppercase tracking-wider">{role}</span>
      </div>
      <p className="text-sm text-ink-soft leading-relaxed">{body}</p>
    </div>
  );
}

function Box({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <h3 className="text-base font-semibold text-ink mb-2">{title}</h3>
      <p className="text-sm text-ink-soft leading-relaxed">{body}</p>
    </div>
  );
}

function Trigger({ when, then }: { when: string; then: string }) {
  return (
    <tr>
      <td className="px-4 py-3 align-top text-ink">{when}</td>
      <td className="px-4 py-3 align-top text-ink-soft">{then}</td>
    </tr>
  );
}

function DataRow({ t, state, purpose }: { t: string; state: string; purpose: string }) {
  return (
    <tr>
      <td className="px-4 py-3 align-top">
        <code className="text-xs text-sage font-mono">{t}</code>
      </td>
      <td className="px-4 py-3 align-top">
        <span
          className={`inline-block text-xs uppercase tracking-wider ${
            state === "exists" ? "text-sage" : "text-clay"
          }`}
        >
          {state}
        </span>
      </td>
      <td className="px-4 py-3 align-top text-ink-soft text-xs">{purpose}</td>
    </tr>
  );
}

function Edge({ title, handle }: { title: string; handle: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-ink-soft leading-relaxed">{handle}</p>
    </div>
  );
}

function Phase({
  n,
  title,
  weeks,
  body,
}: {
  n: string;
  title: string;
  weeks: string;
  body: string;
}) {
  return (
    <li className="rounded-2xl border border-line bg-paper p-5">
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <div className="flex items-baseline gap-3">
          <span className="text-xs font-mono text-clay">{n}</span>
          <h3 className="font-semibold text-ink">{title}</h3>
        </div>
        <span className="text-xs text-ink-soft/70 italic">{weeks}</span>
      </div>
      <p className="text-sm text-ink-soft leading-relaxed">{body}</p>
    </li>
  );
}
