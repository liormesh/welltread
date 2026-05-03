export const metadata = {
  title: "Product build scope - Welltread Vault",
  robots: { index: false, follow: false, nocache: true },
};

export default function ProductScope() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 space-y-16">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
          14 - Product build scope
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-ink leading-[1.05]">
          What we&rsquo;re{" "}
          <span className="text-sage italic font-normal">actually building</span>.
        </h1>
        <p className="mt-6 text-lg text-ink-soft max-w-3xl leading-relaxed">
          The product layer that lives behind the paywall. Subsystems,
          phasing, effort estimates, open decisions, blocking dependencies.
          Read{" "}
          <a className="text-sage hover:underline" href="/vault/product-framework">
            /vault/product-framework
          </a>{" "}
          first for the architectural context.
        </p>
      </header>

      <Section eyebrow="A" title="The 14 subsystems">
        <p className="text-ink-soft mb-6 max-w-3xl leading-relaxed">
          Building the product means shipping these. Most are small (1-2
          days). A few are not (session player, content authoring).
        </p>
        <div className="rounded-2xl border border-line bg-paper-warm/30 p-5 mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-clay mb-2">
            Status (2026-05-03)
          </p>
          <p className="text-sm text-ink leading-relaxed">
            Subsystems 02, 03, 04, 05, 06, 07, 11 (stub), 12 (hardcoded), 14 are
            <strong> shipped</strong>. The session player has the full Phase 1
            arc including pre-roll, transition with countdown, "this hurts"
            modal with Phase 1 swap (cue override + flag log). Subsystem 01
            (full content schema) and 13 (admin authoring) are <strong>queued</strong> as
            the next priority. Subsystems 09 + 10 (Stripe checkout + webhooks)
            are <strong>blocked on Stripe verification for the US LLC</strong>.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Sub
            n="01"
            title="Database schema additions"
            desc="7 new tables: blocks, block_movements, sessions, session_blocks, week_templates, program_archetypes, user_plan_weeks. Junctions + indexes + RLS policies."
            effort="1 day"
          />
          <Sub
            n="02"
            title="Magic-link auth"
            desc="Supabase Auth + signInWithOtp. Account provisioned on Stripe checkout success, magic link emailed, /app/* routes auth-gated."
            effort="1 day"
          />
          <Sub
            n="03"
            title="App shell at welltread.app"
            desc="Header (logo, today/week/profile nav), footer, layout wrapper, auth boundary. Mobile-first responsive."
            effort="1 day"
          />
          <Sub
            n="04"
            title="Today screen (/app/today)"
            desc="Read user_plan_weeks, display today's session card with play button + estimated minutes. Streak counter, weekly progress bar, gentle nudge if last completion >36h."
            effort="2 days"
          />
          <Sub
            n="05"
            title="Session player (/app/session/[id])"
            desc="The hard one. Full-screen video sequencing through movements. Per-movement: video loop + cue + timer or rep counter. Skip/pause/swap controls. 'This hurts' button logs + serves regression."
            effort="3-4 days"
            critical
          />
          <Sub
            n="06"
            title="Post-session check-in (/app/done)"
            desc="2-question micro-feedback (pain 1-5, energy 1-5) + chips. Writes to daily_completions. Drives adaptation later."
            effort="1 day"
          />
          <Sub
            n="07"
            title="Week overview (/app/week)"
            desc="7-day grid. Past = completed/skipped status. Today = highlighted. Future = blurred until day-of (anti-anxiety design)."
            effort="1 day"
          />
          <Sub
            n="08"
            title="Weekly check-in (/app/checkin/weekly)"
            desc="Sunday 5-question form. Triggers email nudge if missed by Tuesday."
            effort="1 day"
          />
          <Sub
            n="09"
            title="Stripe Checkout flow"
            desc="/api/checkout/start mints session with trial_period_days=7 OR direct-pay mode. Tier passed from paywall. Idempotent on quiz_session_id."
            effort="2 days"
          />
          <Sub
            n="10"
            title="Stripe webhooks"
            desc="/api/stripe/webhook handles 7 events (per /vault/trial-flow §C). Creates profile + user_plan on checkout.completed, marks past_due on payment_failed, etc. Signature verification + stripe_events idempotency."
            effort="2 days"
            critical
          />
          <Sub
            n="11"
            title="Stripe Customer Portal embed"
            desc="/app/billing - tier change, cancel, payment method update via Stripe-hosted iframe."
            effort="0.5 day"
          />
          <Sub
            n="12"
            title="Assignment engine v1 (hardcoded)"
            desc="Given user_plan inputs, deterministically pick week_template + sessions. No personalization yet - same plan for everyone in same niche+commitment level. Cache rendered weeks in user_plan_weeks."
            effort="2 days"
          />
          <Sub
            n="13"
            title="Content authoring pipeline"
            desc="Admin UI to upload movement video to CF Stream, fill metadata, compose blocks/sessions/weeks. Hand-built for v1 (~25 blocks, ~60 sessions, 12 week templates per niche)."
            effort="3-5 days"
            critical
          />
          <Sub
            n="14"
            title="Profile + retake-quiz (/app/profile)"
            desc="Re-run the assessment to refresh the plan. Old user_plan archived (replaces_plan_id chain), new one assigned."
            effort="1 day"
          />
        </div>
      </Section>

      <Section eyebrow="B" title="Phased rollout">
        <div className="space-y-6">
          <Phase
            n="P1"
            title="Foundation - the bare minimum"
            duration="~3 weeks of focused dev"
            scope="Subsystems 01-12 + 14. Hardcoded assignment, no personalization. One user can sign up, pay, get a plan, complete sessions, do weekly check-ins, cancel."
            criteria={[
              "End-to-end smoke test: ad click → quiz → checkout → magic-link sign-in → day 1 session played → check-in submitted",
              "Stripe webhook receives + records all 7 critical events without losing data",
              "User can cancel and access persists through period_end",
              "Movement video plays smoothly on mobile (iOS Safari, Android Chrome)",
            ]}
            unblocks="$500 Meta classification kill-test on real funnel"
          />
          <Phase
            n="P2"
            title="Personalization v1"
            duration="~2 weeks"
            scope="Equipment + contraindication filters in assignment engine. Goal-overlap scoring. 'Too easy/too hard/hurt me' triggers manual swap rules. Library page (10-20 standalone sessions for off-program days)."
            criteria={[
              "Two users with same niche but different contraindications get visibly different plans",
              "Flagging 'too easy' bumps next session difficulty",
              "Library accessible from app nav, sessions playable off-plan",
            ]}
            unblocks="Content scaling (more niches reuse the engine)"
          />
          <Phase
            n="P3"
            title="Adaptive engine"
            duration="~3 weeks"
            scope="Auto-adaptation rules based on completion + check-in data. Re-eval at week 4 + 8. Cross-niche recommendations. Streak + nudge mechanics."
            criteria={[
              "3 sessions marked 'too easy' auto-bumps difficulty without manual flag",
              "Pain rating ≥4 on a body region tapers that region for 3 sessions",
              "Week-4 prompt offers archetype swap if Q19 changed",
            ]}
            unblocks="Retention math (LTV via adherence)"
          />
          <Phase
            n="P4"
            title="Native + creator content"
            duration="~2-3 weeks"
            scope="iOS + Android via Capacitor wrappers (PWA core stays). ASO. Curated PT-instructor model (Peloton-style, hand-contracted, not open marketplace)."
            criteria={[
              "App store listing live for both stores",
              "Native push notifications wired to weekly check-in nudges",
              "5-10 PT/coach contractors live with their own content thread",
            ]}
            unblocks="Distribution beyond paid acq"
          />
        </div>
      </Section>

      <Section eyebrow="C" title="Open product decisions (need your call)">
        <div className="space-y-4">
          <Decision
            q="PWA-first or native-first?"
            rec="PWA-first."
            why="Faster to iterate, no app-store review cycle blocking us, single codebase. Capacitor wrappers in P4 give us native shell with the same web core. Reverse Health, Mighty Health, BetterMe all started PWA-first - native came later. Reversal trigger: if push notification engagement on native is materially better than PWA's web-push, accelerate native."
          />
          <Decision
            q="Magic link or password auth?"
            rec="Magic link."
            why="40+/60+ audience hates passwords. Magic link via Supabase signInWithOtp matches the trial-flow account-creation timing (account provisioned post-Stripe, magic link arrives in welcome email, click → signed in). Adds zero friction at the moment of first value. Reversal trigger: if support tickets about email delivery exceed 3% of new users, add password fallback."
          />
          <Decision
            q="Video hosting?"
            rec="Cloudflare Stream."
            why="Already on CF (no new vendor), $1/1000 minutes delivered + $5/1000 minutes stored, HLS adaptive bitrate, good edge CDN performance, native React Player support. Alternatives (Mux, Bunny.net, Vimeo) are 2-4x the price. The 60-movement library is ~30-45 min total raw footage; storage cost rounds to nothing."
          />
          <Decision
            q="Offline support for sessions?"
            rec="Cache last 3 sessions, opt-in toggle in /app/profile."
            why="Worth it for travel + spotty-connection use. 60+ users especially benefit. Implementation: PWA service worker + IndexedDB for video chunks. Maybe 2 days of work; defer to P2 if P1 is tight."
          />
          <Decision
            q="Capture first name in the quiz?"
            rec="Yes, as an optional final question before email (Q28.5)."
            why="Improves email opens (24h plan-ready email reads 'Hi Eleanor' vs 'Hi'), improves welcome screen ('Welcome, Eleanor'). Optional placement avoids friction. ~30 min of work to add. CRO data on 'name + email' vs 'email-only' is mixed for older audiences - ours is a unique-enough register that it should test well."
          />
          <Decision
            q="First-time app entry experience?"
            rec="Skip onboarding redux. Land directly on /app/today with day 1 of plan. The quiz already gathered everything we need."
            why="Adding another onboarding flow on top of the quiz is friction. The plan reveal already showed them what to expect. /app/today opens to a clear 'Day 1: Foundation - 12 minutes' card with a Play button. If they want a tour, a single 'How this works' modal accessible from header is enough."
          />
          <Decision
            q="Real-time progress sync vs daily push?"
            rec="Daily push to Supabase, optimistic UI."
            why="Sessions are 12-15 min self-contained. Real-time isn't needed. Optimistic UI on completion writes locally first, syncs to Supabase on next online tick. Handles offline gracefully."
          />
        </div>
      </Section>

      <Section eyebrow="D" title="External dependencies (gating)">
        <table className="w-full text-sm rounded-2xl overflow-hidden border border-line">
          <thead className="bg-paper-warm/40 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-sage">Dependency</th>
              <th className="px-4 py-3 font-semibold text-sage">Phase blocked</th>
              <th className="px-4 py-3 font-semibold text-sage">Status</th>
              <th className="px-4 py-3 font-semibold text-sage">Owner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60 bg-paper">
            <Row
              dep="Stripe verified for the US LLC"
              phase="P1 (subsystems 09-11)"
              status="pending"
              owner="Lior + friends with US LLC"
            />
            <Row
              dep="Resend Pro upgrade + welltread.co domain verified"
              phase="P1 (welcome email, magic link)"
              status="upgrading"
              owner="Lior"
            />
            <Row
              dep="60-80 PT-recorded or Veo-generated movement videos"
              phase="P1 (subsystems 13, content authoring)"
              status="in production (separate thread)"
              owner="Lior + Veo pipeline"
            />
            <Row
              dep="ElevenLabs voice IDs for the 4 cast"
              phase="P1 (session player narration)"
              status="not started"
              owner="Lior"
            />
            <Row
              dep="Cloudflare Stream account / API key"
              phase="P1 (video hosting)"
              status="account exists, need to enable Stream"
              owner="Lior (verify in CF dashboard)"
            />
            <Row
              dep="PT review + sign-off on all 60 movements + 12 weeks"
              phase="P1 (publishing gate)"
              status="not started - need PT contractor"
              owner="Lior"
            />
          </tbody>
        </table>
      </Section>

      <Section eyebrow="E" title="What I can build in parallel today (no deps)">
        <p className="text-ink-soft mb-6 max-w-3xl leading-relaxed">
          While we wait on Stripe verification + content production, I can
          ship the platform layers that don&rsquo;t depend on either:
        </p>
        <ol className="space-y-3 text-ink leading-relaxed">
          <Item><strong>Subsystem 01:</strong> Database schema + migration for all 7 new tables</Item>
          <Item><strong>Subsystem 02:</strong> Magic-link auth (without Stripe trigger - tested manually)</Item>
          <Item><strong>Subsystem 03:</strong> App shell at welltread.app with auth gate</Item>
          <Item><strong>Subsystem 04:</strong> Today screen scaffold (loads sample plan from seed data)</Item>
          <Item><strong>Subsystem 05:</strong> Session player MVP (loads sample movements from seed data, uses placeholder Pexels video for testing)</Item>
          <Item><strong>Subsystem 06-08:</strong> Check-ins + week overview against seed data</Item>
          <Item><strong>Subsystem 12:</strong> Hardcoded assignment engine reading from seed data</Item>
          <Item><strong>Subsystem 14:</strong> Profile + retake-quiz</Item>
        </ol>
        <p className="mt-6 text-sm text-ink-soft leading-relaxed max-w-3xl">
          Result: a fully functional product running on placeholder content. When
          real movement videos land, we replace seed rows with real data and the
          UI doesn&rsquo;t change. When Stripe lands, we wire subsystems 09-11
          and account-creation flips from manual to automatic.
        </p>
      </Section>

      <Section eyebrow="F" title="Recommended sequencing">
        <ol className="space-y-3 text-ink leading-relaxed">
          <Item>
            <strong>Week 1 (now):</strong> Subsystems 01, 02, 03 - schema + auth + app shell. Lior verifies Resend Pro + Stream + decides on the 7 product decisions in §C.
          </Item>
          <Item>
            <strong>Week 2:</strong> Subsystems 04, 05, 06, 12 - today screen + session player + check-in + assignment engine. Wire to seed data.
          </Item>
          <Item>
            <strong>Week 3:</strong> Subsystems 07, 08, 14, 13 - week overview + weekly check-in + profile + content authoring UI. PT contractor + studio booked in parallel.
          </Item>
          <Item>
            <strong>Week 4 (Stripe lands):</strong> Subsystems 09, 10, 11 - checkout + webhooks + customer portal. Real content replaces seed data.
          </Item>
          <Item>
            <strong>Week 5:</strong> End-to-end smoke testing. $500 Meta classification kill-test on the real funnel. Phase 1 complete.
          </Item>
        </ol>
      </Section>

      <Section eyebrow="G" title="Out of scope (for v1, decided not to build)">
        <ul className="space-y-2 text-ink-soft leading-relaxed">
          <Item>Audio voiceover on session videos (Phase 2)</Item>
          <Item>Background music in sessions (intentionally none, ever)</Item>
          <Item>Group / live sessions (Phase 3+)</Item>
          <Item>Social features, leaderboards, group challenges (anti-pattern for our register)</Item>
          <Item>Apple Health / Google Fit integration (Phase 3 - real value once we have data to send back)</Item>
          <Item>Wearable integration (Apple Watch / Fitbit complications) - Phase 3+</Item>
          <Item>Open creator marketplace (per the Spotify-vs-Peloton axiom, never)</Item>
          <Item>Real-time chat / coach DMs (creates support burden we can&rsquo;t scale)</Item>
          <Item>Web-based session player on welltread.co - keeps the app/site separation clean</Item>
        </ul>
      </Section>
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

function Sub({
  n,
  title,
  desc,
  effort,
  critical,
}: {
  n: string;
  title: string;
  desc: string;
  effort: string;
  critical?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 ${
        critical ? "border-2 border-sage bg-paper" : "border border-line bg-paper"
      }`}
    >
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <div className="flex items-baseline gap-3">
          <span className="text-xs font-mono text-clay">{n}</span>
          <h3 className="text-base font-semibold text-ink">{title}</h3>
        </div>
        <span className="text-xs text-ink-soft/70 italic shrink-0">{effort}</span>
      </div>
      <p className="text-sm text-ink-soft leading-relaxed">{desc}</p>
      {critical && (
        <p className="mt-2 text-xs uppercase tracking-wider text-sage">
          Critical path
        </p>
      )}
    </div>
  );
}

function Phase({
  n,
  title,
  duration,
  scope,
  criteria,
  unblocks,
}: {
  n: string;
  title: string;
  duration: string;
  scope: string;
  criteria: string[];
  unblocks: string;
}) {
  return (
    <div className="rounded-3xl border border-line bg-paper p-6">
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <div className="flex items-baseline gap-3">
          <span className="text-xs font-mono text-clay">{n}</span>
          <h3 className="text-xl font-semibold text-ink">{title}</h3>
        </div>
        <span className="text-xs text-ink-soft/70 italic">{duration}</span>
      </div>
      <p className="text-sm text-ink-soft leading-relaxed mb-4">{scope}</p>
      <p className="text-xs uppercase tracking-[0.2em] text-clay mb-2">
        Acceptance criteria
      </p>
      <ul className="space-y-1.5 mb-4">
        {criteria.map((c) => (
          <li key={c} className="flex items-start gap-3 text-sm text-ink">
            <span className="mt-2 inline-block h-1 w-1 rounded-full bg-sage shrink-0" />
            <span>{c}</span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-sage">
        <strong>Unblocks:</strong> {unblocks}
      </p>
    </div>
  );
}

function Decision({
  q,
  rec,
  why,
}: {
  q: string;
  rec: string;
  why: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <h3 className="text-base font-semibold text-ink mb-2">{q}</h3>
      <p className="text-sm text-sage font-medium mb-2">My rec: {rec}</p>
      <p className="text-sm text-ink-soft leading-relaxed">{why}</p>
    </div>
  );
}

function Row({
  dep,
  phase,
  status,
  owner,
}: {
  dep: string;
  phase: string;
  status: string;
  owner: string;
}) {
  return (
    <tr>
      <td className="px-4 py-3 align-top text-ink font-medium">{dep}</td>
      <td className="px-4 py-3 align-top text-ink-soft text-xs">{phase}</td>
      <td className="px-4 py-3 align-top text-ink-soft text-xs">{status}</td>
      <td className="px-4 py-3 align-top text-ink-soft text-xs">{owner}</td>
    </tr>
  );
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-sage shrink-0" />
      <span>{children}</span>
    </li>
  );
}
