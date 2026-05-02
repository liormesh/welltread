export default function ArchitectureVisualizer() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 space-y-24">
      {/* HERO */}
      <section>
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">System reference</p>
        <h1 className="text-6xl font-semibold tracking-tight text-ink leading-[1.05]">
          One engine, <span className="text-sage italic font-normal">many doorways</span>.
        </h1>
        <p className="mt-6 text-xl text-ink-soft max-w-2xl leading-relaxed">
          Multi-niche mobility platform. Add new niches by writing new LP + quiz-branch
          + plan-template, not by spawning new products.
        </p>
      </section>

      {/* LAYERED ARCHITECTURE */}
      <section>
        <SectionHeader eyebrow="01" title="Layered architecture" />
        <div className="mt-8 space-y-6">
          <Layer
            label="Acquisition"
            domain="welltread.co"
            color="bg-paper-warm"
            border="border-clay/40"
            items={["Niche LPs (/seniors, /posture, ...)", "Dynamic quiz", "Plan reveal", "Paywall (Stripe)", "Trial signup"]}
          />
          <Arrow />
          <Layer
            label="Product"
            domain="welltread.app (PWA Phase 1, native Phase 2)"
            color="bg-sage/10"
            border="border-sage/40"
            items={["Daily plan view", "Workout player", "Tracking (1-2-3)", "Weekly check-in", "Lifecycle nudges"]}
          />
          <Arrow />
          <Layer
            label="Backend"
            domain="Supabase + CF Workers + Stripe"
            color="bg-ink/5"
            border="border-ink/20"
            items={["Quiz logic graph", "Plan generator", "Auth (Supabase)", "Billing (Stripe)", "Conversions API fan-out"]}
          />
        </div>
      </section>

      {/* DOMAIN SPLIT */}
      <section>
        <SectionHeader eyebrow="02" title="Domain split" />
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DomainCard
            domain="welltread.co"
            role="Marketing primary"
            description="Hero brand, niche LPs, quiz, plan reveal, paywall, trial signup. Where every ad click lands."
            routes={["/", "/seniors", "/posture", "/quiz", "/quiz/result", "/checkout", "/trial"]}
            tld=".co"
          />
          <DomainCard
            domain="welltread.app"
            role="Product (Phase 1: PWA)"
            description="Authenticated post-paywall product. Reserved for the daily-use experience. Currently mirrors .co via shared Worker."
            routes={["/app", "/app/today", "/app/checkin", "/app/progress", "/app/settings"]}
            tld=".app"
          />
        </div>
        <p className="mt-6 text-sm text-ink-soft">
          Both domains route to the same Cloudflare Worker initially.
          We split when the app section adds real-time progress tracking, push notifications,
          or when worker bundle exceeds 1MB.
        </p>
      </section>

      {/* QUIZ LOGIC GRAPH */}
      <section>
        <SectionHeader eyebrow="03" title="Quiz logic graph" />
        <p className="mt-4 text-ink-soft max-w-2xl leading-relaxed">
          The quiz is a <em>graph</em>, not a form. UTM params skip irrelevant questions.
          Earlier answers branch to follow-ups. Same backend serves all niches.
        </p>
        <div className="mt-8 rounded-3xl border border-line bg-paper p-8 overflow-x-auto">
          <svg viewBox="0 0 920 480" className="w-full h-auto" style={{ maxWidth: "100%" }}>
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#4B5152" />
              </marker>
            </defs>

            {/* Root */}
            <Node x={400} y={30} w={160} label="Quiz entry" sub="UTM-aware" filled />

            {/* Branch by UTM */}
            <Edge x1={480} y1={64} x2={200} y2={130} />
            <Edge x1={480} y1={64} x2={480} y2={130} />
            <Edge x1={480} y1={64} x2={760} y2={130} />

            <Node x={120} y={130} w={160} label="seniors_*" sub="UTM source" />
            <Node x={400} y={130} w={160} label="posture_*" sub="UTM source" />
            <Node x={680} y={130} w={160} label="(no UTM)" sub="ask niche" />

            {/* Niche-specific intro */}
            <Edge x1={200} y1={164} x2={200} y2={220} />
            <Edge x1={480} y1={164} x2={480} y2={220} />
            <Edge x1={760} y1={164} x2={760} y2={220} />

            <Node x={120} y={220} w={160} label="When did you last feel unsteady?" small />
            <Node x={400} y={220} w={160} label="Where does your back hurt by 4pm?" small />
            <Node x={680} y={220} w={160} label="Pick your primary concern" small />

            {/* Common */}
            <Edge x1={200} y1={266} x2={460} y2={320} />
            <Edge x1={480} y1={266} x2={460} y2={320} />
            <Edge x1={760} y1={266} x2={460} y2={320} />
            <Node x={380} y={320} w={160} label="Time per day, equipment, goals" small />
            <Edge x1={460} y1={366} x2={460} y2={420} />
            <Node x={380} y={420} w={160} label="Generate plan" filled small />
          </svg>
        </div>
        <p className="mt-4 text-xs text-ink-soft/60 font-mono">
          Sample. Full graph definition lives in src/lib/quiz/&lt;niche&gt;.yaml (Phase 1).
        </p>
      </section>

      {/* LIFECYCLE */}
      <section>
        <SectionHeader eyebrow="04" title="User lifecycle" />
        <div className="mt-8 space-y-2">
          {[
            { stage: "Cold", action: "Paid ad click", color: "bg-paper-warm" },
            { stage: "Visit", action: "LP view (niche-specific)", color: "bg-paper-warm" },
            { stage: "Lead", action: "Email signup OR start quiz", color: "bg-clay-soft/40" },
            { stage: "Qualified", action: "Complete quiz (7-10 questions)", color: "bg-clay/30" },
            { stage: "Plan reveal", action: "View personalized plan", color: "bg-clay/40" },
            { stage: "Trial", action: "$1 trial start (card on file)", color: "bg-sage/30" },
            { stage: "Active", action: "First paid renewal", color: "bg-sage/60" },
            { stage: "Engaged", action: "Daily completions + weekly check-in", color: "bg-sage/80" },
            { stage: "Retained", action: "Subscription renewal beyond month 1", color: "bg-sage" },
          ].map((s, i) => (
            <div key={i} className={`${s.color} rounded-2xl px-6 py-4 flex items-center gap-6`}>
              <span className="text-xs font-mono text-ink-soft/70 uppercase w-24 tracking-wider">
                Stage {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-semibold text-ink w-32">{s.stage}</span>
              <span className="text-ink-soft flex-1">{s.action}</span>
            </div>
          ))}
        </div>
      </section>

      {/* TRACKING ARCHITECTURE */}
      <section>
        <SectionHeader eyebrow="05" title="Tracking architecture" />
        <p className="mt-4 text-ink-soft max-w-2xl leading-relaxed">
          One server-side event router fans out to six platforms. Same{" "}
          <code className="text-sm bg-paper-warm/40 px-2 py-0.5 rounded">event_id</code> on
          pixel and CAPI for deduplication. Ad blockers can&rsquo;t break this.
        </p>
        <div className="mt-8 rounded-3xl border border-line bg-paper p-8 overflow-x-auto">
          <svg viewBox="0 0 920 360" className="w-full h-auto" style={{ maxWidth: "100%" }}>
            <defs>
              <marker
                id="arrow2"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#4B5152" />
              </marker>
            </defs>

            <Node x={380} y={20} w={160} label="Conversion event" sub="user action" filled />
            <Edge x1={460} y1={54} x2={460} y2={110} />
            <Node x={300} y={110} w={320} label="/api/track/event (CF Worker)" sub="server-side router" />
            <Edge x1={460} y1={156} x2={120} y2={220} />
            <Edge x1={460} y1={156} x2={300} y2={220} />
            <Edge x1={460} y1={156} x2={460} y2={220} />
            <Edge x1={460} y1={156} x2={620} y2={220} />
            <Edge x1={460} y1={156} x2={780} y2={220} />

            <SmallNode x={40} y={220} w={160} label="Meta CAPI" />
            <SmallNode x={220} y={220} w={160} label="TikTok Events API" />
            <SmallNode x={400} y={220} w={120} label="Google Ads" />
            <SmallNode x={540} y={220} w={160} label="Reddit CAPI" />
            <SmallNode x={720} y={220} w={160} label="Pinterest CAPI" />

            <Edge x1={120} y1={260} x2={460} y2={320} />
            <Edge x1={300} y1={260} x2={460} y2={320} />
            <Edge x1={460} y1={260} x2={460} y2={320} />
            <Edge x1={620} y1={260} x2={460} y2={320} />
            <Edge x1={780} y1={260} x2={460} y2={320} />
            <Node x={380} y={320} w={160} label="events table" sub="audit trail" />
          </svg>
        </div>
      </section>

      {/* PHASE PLAN */}
      <section>
        <SectionHeader eyebrow="06" title="Phase plan" />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <PhaseCard
            phase="Phase 0"
            window="now → Sat"
            status="active"
            done={[
              "Brand + domains",
              "Repo + CI/CD",
              "Two niche LPs",
              "Email capture",
              "Supabase project",
              "Full schema (9 tables)",
            ]}
            todo={[]}
          />
          <PhaseCard
            phase="Phase 1"
            window="week 1-2"
            status="next"
            done={[]}
            todo={[
              "Dynamic quiz at /quiz",
              "Plan-reveal mockup",
              "Stripe Checkout (5 tiers)",
              "CAPIs: Meta + TikTok",
              "Pixels embedded",
              "$500 classification test",
            ]}
          />
          <PhaseCard
            phase="Phase 2"
            window="week 3-4"
            status="planned"
            done={[]}
            todo={[
              "PWA shell at .app",
              "Daily plan + player",
              "Weekly check-in",
              "Stripe Customer Portal",
              "$3-8K CRO test",
            ]}
          />
          <PhaseCard
            phase="Phase 3+"
            window="week 5+"
            status="planned"
            done={[]}
            todo={[
              "Plan engine + library",
              "Lifecycle emails",
              "Postpartum + pelvic-floor",
              "D7 / D30 retention checks",
              "Native apps (gated)",
            ]}
          />
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="border-t border-line pt-8">
      <p className="text-xs uppercase tracking-[0.2em] text-clay mb-2">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-ink">{title}</h2>
    </div>
  );
}

function Layer({
  label,
  domain,
  color,
  border,
  items,
}: {
  label: string;
  domain: string;
  color: string;
  border: string;
  items: string[];
}) {
  return (
    <div className={`${color} ${border} border-2 rounded-3xl p-8`}>
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-xl font-semibold text-ink">{label}</h3>
        <code className="text-xs font-mono text-ink-soft">{domain}</code>
      </div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-xl bg-paper px-3 py-2 text-xs text-ink-soft border border-line/60"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center">
      <svg width="20" height="36" viewBox="0 0 20 36" fill="none">
        <path
          d="M10 0 L10 28 M3 22 L10 30 L17 22"
          stroke="#4B5152"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function DomainCard({
  domain,
  role,
  description,
  routes,
  tld,
}: {
  domain: string;
  role: string;
  description: string;
  routes: string[];
  tld: string;
}) {
  return (
    <div className="rounded-3xl border border-line bg-paper p-8">
      <div className="flex items-baseline justify-between mb-4">
        <code className="text-lg font-mono text-sage font-semibold">{domain}</code>
        <span className="text-xs uppercase tracking-[0.2em] text-clay">{role}</span>
      </div>
      <p className="text-ink-soft leading-relaxed mb-6">{description}</p>
      <div className="space-y-1">
        {routes.map((r) => (
          <div
            key={r}
            className="flex items-center gap-3 text-sm font-mono text-ink-soft/80 px-3 py-1.5 rounded-lg bg-paper-warm/30"
          >
            <span className="text-clay">{tld}</span>
            <span>{r}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Node({
  x,
  y,
  w,
  label,
  sub,
  filled,
  small,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  sub?: string;
  filled?: boolean;
  small?: boolean;
}) {
  const h = small ? 46 : 50;
  const fill = filled ? "#2D4F4A" : "#FAF7F2";
  const stroke = filled ? "#1F3A36" : "#E6DFCF";
  const labelColor = filled ? "#FAF7F2" : "#1A1A1A";
  const subColor = filled ? "#D9B18D" : "#4B5152";
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={12}
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
      />
      <text
        x={x + w / 2}
        y={y + (sub ? 22 : h / 2 + 5)}
        textAnchor="middle"
        fontSize={small ? "11" : "12"}
        fontWeight="600"
        fill={labelColor}
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + 38}
          textAnchor="middle"
          fontSize="10"
          fill={subColor}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

function SmallNode({
  x,
  y,
  w,
  label,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={40} rx={10} fill="#F2EAD3" stroke="#C18C5D" strokeWidth="1.5" />
      <text x={x + w / 2} y={y + 25} textAnchor="middle" fontSize="11" fontWeight="600" fill="#1A1A1A">
        {label}
      </text>
    </g>
  );
}

function Edge({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="#4B5152"
      strokeWidth="1.2"
      strokeOpacity="0.5"
      markerEnd="url(#arrow)"
    />
  );
}

function PhaseCard({
  phase,
  window: w,
  status,
  done,
  todo,
}: {
  phase: string;
  window: string;
  status: "active" | "next" | "planned";
  done: string[];
  todo: string[];
}) {
  const ring =
    status === "active"
      ? "border-sage bg-sage/5"
      : status === "next"
      ? "border-clay/60 bg-clay/5"
      : "border-line bg-paper";
  return (
    <div className={`rounded-3xl border-2 ${ring} p-6`}>
      <p className="text-xs uppercase tracking-[0.2em] text-clay">{w}</p>
      <h3 className="mt-1 text-xl font-semibold text-ink">{phase}</h3>
      <ul className="mt-4 space-y-1.5 text-sm">
        {done.map((d) => (
          <li key={d} className="text-sage flex items-start gap-2">
            <span className="mt-0.5">✓</span>
            <span>{d}</span>
          </li>
        ))}
        {todo.map((t) => (
          <li key={t} className="text-ink-soft flex items-start gap-2">
            <span className="mt-0.5 text-line">○</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
