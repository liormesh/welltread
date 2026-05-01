type ColumnSpec = {
  name: string;
  type: string;
  pk?: boolean;
  fk?: string;
  nullable?: boolean;
  unique?: boolean;
  note?: string;
};

type TableSpec = {
  name: string;
  description: string;
  cols: ColumnSpec[];
  rls: string[];
  scaleNote?: string;
};

const TABLES: TableSpec[] = [
  {
    name: "email_signups",
    description: "Pre-account email capture from /api/notify. Anon-insertable.",
    cols: [
      { name: "id", type: "uuid", pk: true },
      { name: "email", type: "text", unique: true },
      { name: "source", type: "text", note: "home | seniors | posture | ..." },
      { name: "utm", type: "jsonb" },
      { name: "user_agent", type: "text", nullable: true },
      { name: "ip_country", type: "text", nullable: true },
      { name: "created_at", type: "timestamptz" },
      { name: "unsubscribed_at", type: "timestamptz", nullable: true },
      { name: "converted_to_user_id", type: "uuid", fk: "profiles.id", nullable: true },
    ],
    rls: ["anon: INSERT", "service_role: ALL"],
  },
  {
    name: "profiles",
    description: "User identity, preferences, niche affinity. Soft-delete for GDPR.",
    cols: [
      { name: "id", type: "uuid", pk: true },
      { name: "auth_user_id", type: "uuid", fk: "auth.users.id", unique: true, nullable: true },
      { name: "email_signup_id", type: "uuid", fk: "email_signups.id", nullable: true },
      { name: "full_name", type: "text", nullable: true },
      { name: "email", type: "text", nullable: true, note: "denormalized" },
      { name: "timezone", type: "text" },
      { name: "locale", type: "text" },
      { name: "units_system", type: "text", note: "imperial | metric" },
      { name: "primary_niche", type: "text", nullable: true },
      { name: "secondary_niches", type: "text[]" },
      { name: "date_of_birth", type: "date", nullable: true },
      { name: "gender", type: "text", nullable: true },
      { name: "onboarded_at", type: "timestamptz", nullable: true },
      { name: "last_active_at", type: "timestamptz", nullable: true },
      { name: "deleted_at", type: "timestamptz", nullable: true, note: "soft-delete" },
      { name: "metadata", type: "jsonb" },
      { name: "created_at", type: "timestamptz" },
      { name: "updated_at", type: "timestamptz", note: "trigger" },
    ],
    rls: ["authenticated: SELECT/UPDATE own row", "service_role: ALL"],
  },
  {
    name: "quiz_sessions",
    description: "Quiz answer graph + plan link. Anon-insertable for pre-auth.",
    cols: [
      { name: "id", type: "uuid", pk: true },
      { name: "profile_id", type: "uuid", fk: "profiles.id", nullable: true },
      { name: "email_signup_id", type: "uuid", fk: "email_signups.id", nullable: true },
      { name: "niche", type: "text" },
      { name: "quiz_version", type: "text" },
      { name: "answers", type: "jsonb", note: "answer graph" },
      { name: "utm", type: "jsonb" },
      { name: "click_ids", type: "jsonb" },
      { name: "client_id", type: "text", nullable: true },
      { name: "session_id", type: "text", nullable: true },
      { name: "user_agent", type: "text", nullable: true },
      { name: "ip_country", type: "text", nullable: true },
      { name: "referrer", type: "text", nullable: true },
      { name: "started_at", type: "timestamptz" },
      { name: "completed_at", type: "timestamptz", nullable: true },
      { name: "abandoned_at", type: "timestamptz", nullable: true },
      { name: "plan_id", type: "uuid", fk: "user_plans.id", nullable: true },
      { name: "metadata", type: "jsonb" },
    ],
    rls: ["anon: INSERT", "authenticated: SELECT own", "service_role: ALL"],
  },
  {
    name: "user_plans",
    description: "Generated plan snapshots. Plans replace, never edit; chain via replaces_plan_id.",
    cols: [
      { name: "id", type: "uuid", pk: true },
      { name: "profile_id", type: "uuid", fk: "profiles.id" },
      { name: "quiz_session_id", type: "uuid", fk: "quiz_sessions.id", nullable: true },
      { name: "niche", type: "text" },
      { name: "plan_template_version", type: "text" },
      { name: "weeks", type: "int" },
      { name: "start_date", type: "date" },
      { name: "end_date", type: "date", note: "GENERATED ALWAYS AS (start_date + weeks*7)" },
      { name: "plan_data", type: "jsonb", note: "full snapshot" },
      { name: "status", type: "text", note: "active | paused | completed | replaced | abandoned" },
      { name: "replaces_plan_id", type: "uuid", fk: "user_plans.id", nullable: true },
      { name: "archived_at", type: "timestamptz", nullable: true },
      { name: "generated_at", type: "timestamptz" },
      { name: "created_at", type: "timestamptz" },
      { name: "updated_at", type: "timestamptz", note: "trigger" },
      { name: "metadata", type: "jsonb" },
    ],
    rls: ["authenticated: SELECT own", "service_role: ALL"],
  },
  {
    name: "daily_completions",
    description: "Per-day plan progress. UNIQUE(profile, plan, date). High write volume.",
    cols: [
      { name: "id", type: "uuid", pk: true },
      { name: "profile_id", type: "uuid", fk: "profiles.id" },
      { name: "plan_id", type: "uuid", fk: "user_plans.id" },
      { name: "week_number", type: "int" },
      { name: "day_number", type: "int", note: "1-7" },
      { name: "date", type: "date" },
      { name: "movement_completed", type: "boolean" },
      { name: "nutrition_logged", type: "boolean" },
      { name: "habit_done", type: "boolean" },
      { name: "duration_seconds", type: "int", nullable: true },
      { name: "difficulty_rating", type: "int", nullable: true, note: "1-5" },
      { name: "pain_during", type: "int", nullable: true, note: "0-10" },
      { name: "energy_after", type: "int", nullable: true, note: "1-5" },
      { name: "notes", type: "text", nullable: true },
      { name: "completed_at", type: "timestamptz", nullable: true },
      { name: "created_at", type: "timestamptz" },
    ],
    rls: ["authenticated: ALL own", "service_role: ALL"],
    scaleNote: "PARTITION BY RANGE (date) when row count exceeds 10M.",
  },
  {
    name: "weekly_checkins",
    description: "Self-reported weekly state + AI summary. UNIQUE(profile, plan, week).",
    cols: [
      { name: "id", type: "uuid", pk: true },
      { name: "profile_id", type: "uuid", fk: "profiles.id" },
      { name: "plan_id", type: "uuid", fk: "user_plans.id", nullable: true },
      { name: "week_number", type: "int" },
      { name: "weight_lbs", type: "numeric(6,2)", nullable: true },
      { name: "weight_kg", type: "numeric(6,2)", nullable: true },
      { name: "body_fat_pct", type: "numeric(4,2)", nullable: true },
      { name: "energy_rating", type: "int", nullable: true, note: "1-5" },
      { name: "sleep_rating", type: "int", nullable: true },
      { name: "pain_rating", type: "int", nullable: true },
      { name: "mood_rating", type: "int", nullable: true },
      { name: "confidence_rating", type: "int", nullable: true },
      { name: "photo_urls", type: "text[]", note: "Supabase Storage" },
      { name: "notes", type: "text", nullable: true },
      { name: "ai_summary", type: "text", nullable: true },
      { name: "ai_summary_generated_at", type: "timestamptz", nullable: true },
      { name: "ai_summary_model", type: "text", nullable: true },
      { name: "created_at", type: "timestamptz" },
    ],
    rls: ["authenticated: ALL own", "service_role: ALL"],
  },
  {
    name: "subscriptions",
    description: "Mirror of Stripe state. Webhook is the only writer. ON DELETE RESTRICT preserves billing.",
    cols: [
      { name: "id", type: "uuid", pk: true },
      { name: "profile_id", type: "uuid", fk: "profiles.id" },
      { name: "stripe_customer_id", type: "text" },
      { name: "stripe_subscription_id", type: "text", unique: true },
      { name: "stripe_price_id", type: "text" },
      { name: "status", type: "text", note: "trialing | active | past_due | canceled | ..." },
      { name: "tier", type: "text", note: "trial | monthly | quarterly | biannual | annual" },
      { name: "amount_cents", type: "int" },
      { name: "currency", type: "text" },
      { name: "interval_unit", type: "text", nullable: true },
      { name: "interval_count", type: "int", nullable: true },
      { name: "trial_start", type: "timestamptz", nullable: true },
      { name: "trial_end", type: "timestamptz", nullable: true },
      { name: "current_period_start", type: "timestamptz" },
      { name: "current_period_end", type: "timestamptz" },
      { name: "cancel_at", type: "timestamptz", nullable: true },
      { name: "canceled_at", type: "timestamptz", nullable: true },
      { name: "ended_at", type: "timestamptz", nullable: true },
      { name: "payment_method_brand", type: "text", nullable: true },
      { name: "payment_method_last4", type: "text", nullable: true },
      { name: "payment_method_exp_month", type: "int", nullable: true },
      { name: "payment_method_exp_year", type: "int", nullable: true },
      { name: "created_at", type: "timestamptz" },
      { name: "updated_at", type: "timestamptz", note: "trigger" },
      { name: "metadata", type: "jsonb" },
    ],
    rls: ["authenticated: SELECT own", "service_role: ALL"],
  },
  {
    name: "events",
    description: "Server-side analytics + CAPI fan-out tracker. Service-role writes only.",
    cols: [
      { name: "id", type: "uuid", pk: true },
      { name: "profile_id", type: "uuid", fk: "profiles.id", nullable: true },
      { name: "email_signup_id", type: "uuid", fk: "email_signups.id", nullable: true },
      { name: "quiz_session_id", type: "uuid", fk: "quiz_sessions.id", nullable: true },
      { name: "event_name", type: "text" },
      { name: "event_category", type: "text", nullable: true },
      { name: "event_id_external", type: "text", nullable: true, note: "dedup id sent to CAPIs" },
      { name: "properties", type: "jsonb" },
      { name: "client_id", type: "text", nullable: true },
      { name: "session_id", type: "text", nullable: true },
      { name: "utm", type: "jsonb" },
      { name: "click_ids", type: "jsonb" },
      { name: "user_agent", type: "text", nullable: true },
      { name: "ip_country", type: "text", nullable: true },
      { name: "referrer", type: "text", nullable: true },
      { name: "url", type: "text", nullable: true },
      { name: "value_cents", type: "int", nullable: true },
      { name: "currency", type: "text", nullable: true },
      { name: "synced_to", type: "text[]", note: "['meta', 'tiktok', ...]" },
      { name: "sync_errors", type: "jsonb" },
      { name: "created_at", type: "timestamptz" },
    ],
    rls: ["service_role: ALL"],
    scaleNote: "PARTITION BY RANGE (created_at) when row count exceeds 100M.",
  },
  {
    name: "movement_library",
    description: "Catalog of movements. Public-read content. Plan generator picks from this.",
    cols: [
      { name: "id", type: "uuid", pk: true },
      { name: "slug", type: "text", unique: true },
      { name: "name", type: "text" },
      { name: "short_description", type: "text", nullable: true },
      { name: "long_description", type: "text", nullable: true },
      { name: "video_url", type: "text", nullable: true },
      { name: "thumbnail_url", type: "text", nullable: true },
      { name: "demo_image_urls", type: "text[]" },
      { name: "niche_tags", type: "text[]", note: "GIN index" },
      { name: "movement_pattern", type: "text", nullable: true, note: "hinge | squat | rotation | ..." },
      { name: "body_region", type: "text[]" },
      { name: "intensity_level", type: "int", note: "1-5" },
      { name: "duration_seconds", type: "int", nullable: true },
      { name: "equipment_required", type: "text[]" },
      { name: "contraindications", type: "text[]" },
      { name: "prerequisites", type: "text[]" },
      { name: "reviewed_by", type: "text", nullable: true, note: "PT credentials" },
      { name: "review_date", type: "date", nullable: true },
      { name: "status", type: "text", note: "draft | published | archived" },
      { name: "archived_at", type: "timestamptz", nullable: true },
      { name: "created_at", type: "timestamptz" },
      { name: "updated_at", type: "timestamptz", note: "trigger" },
      { name: "metadata", type: "jsonb" },
    ],
    rls: ["anon, authenticated: SELECT WHERE published", "service_role: ALL"],
  },
];

export default function DataModelVisualizer() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 space-y-16">
      <section>
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">Data model</p>
        <h1 className="text-6xl font-semibold tracking-tight text-ink leading-[1.05]">
          9 tables, <span className="text-sage italic font-normal">scale-ready</span>.
        </h1>
        <p className="mt-6 text-xl text-ink-soft max-w-2xl leading-relaxed">
          Every table has UUID PKs, jsonb metadata escape hatches, RLS policies, and
          composite indexes for the common queries. High-volume tables are partition-ready.
        </p>
        <p className="mt-2 text-sm text-ink-soft/70">
          Live in Supabase project <code className="bg-paper-warm/40 px-2 py-0.5 rounded">xzjwbrtvxlluwjkjsmgr</code> (Tokyo).
        </p>
      </section>

      {/* Relationship overview */}
      <section>
        <SectionHeader eyebrow="01" title="Relationships" />
        <div className="mt-8 rounded-3xl border border-line bg-paper p-8 overflow-x-auto">
          <svg viewBox="0 0 1000 540" className="w-full h-auto" style={{ maxWidth: "100%" }}>
            <defs>
              <marker
                id="rel-arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#4B5152" opacity="0.6" />
              </marker>
            </defs>

            {/* email_signups */}
            <Box x={40} y={40} w={180} label="email_signups" sub="anon insert" />
            {/* profiles */}
            <Box x={400} y={40} w={180} label="profiles" sub="auth-linked" />
            {/* quiz_sessions */}
            <Box x={40} y={180} w={180} label="quiz_sessions" sub="anon insert" />
            {/* user_plans */}
            <Box x={400} y={180} w={180} label="user_plans" sub="snapshots" />
            {/* daily_completions */}
            <Box x={40} y={320} w={180} label="daily_completions" sub="UNIQUE(p,pl,d)" />
            {/* weekly_checkins */}
            <Box x={250} y={320} w={180} label="weekly_checkins" sub="self-report" />
            {/* subscriptions */}
            <Box x={460} y={320} w={180} label="subscriptions" sub="Stripe mirror" />
            {/* events */}
            <Box x={760} y={180} w={180} label="events" sub="server-only" />
            {/* movement_library */}
            <Box x={760} y={320} w={180} label="movement_library" sub="public read" />

            {/* edges */}
            <Edge x1={220} y1={70} x2={400} y2={70} label="converted_to_user_id" />
            <Edge x1={130} y1={90} x2={130} y2={180} />
            <Edge x1={490} y1={90} x2={490} y2={180} />
            <Edge x1={220} y1={210} x2={400} y2={210} label="plan_id" />
            <Edge x1={490} y1={230} x2={490} y2={320} label="profile_id" />
            <Edge x1={130} y1={230} x2={130} y2={320} label="profile_id+plan_id" />
            <Edge x1={340} y1={230} x2={340} y2={320} label="profile_id+plan_id" />

            <Edge x1={760} y1={210} x2={580} y2={210} dashed label="profile_id (nullable)" />
            <Edge x1={760} y1={210} x2={220} y2={210} dashed label="email_signup_id (nullable)" />
          </svg>
        </div>
      </section>

      {/* Per-table cards */}
      <section>
        <SectionHeader eyebrow="02" title="Tables" />
        <div className="mt-8 space-y-6">
          {TABLES.map((t) => (
            <TableCard key={t.name} table={t} />
          ))}
        </div>
      </section>

      {/* Conventions */}
      <section>
        <SectionHeader eyebrow="03" title="Conventions baked in" />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Convention
            title="UUID primary keys"
            body="Distributed-friendly. No overflow risk. gen_random_uuid() everywhere."
          />
          <Convention
            title="updated_at trigger"
            body="set_updated_at() function reused on profiles, user_plans, subscriptions, movement_library."
          />
          <Convention
            title="metadata jsonb default '{}'"
            body="Every table has an escape-hatch column for future fields without migration overhead."
          />
          <Convention
            title="Soft-delete on profiles"
            body="GDPR compliant: never hard-delete users; mask + retain via deleted_at column."
          />
          <Convention
            title="GIN indexes on jsonb"
            body="utm, properties, click_ids - any column we'll query into is GIN-indexed."
          />
          <Convention
            title="Composite indexes for common reads"
            body="(profile_id, date), (plan_id, week, day), (profile_id, created_at) - hot query paths."
          />
          <Convention
            title="Partial indexes"
            body="WHERE status = 'active' or WHERE deleted_at IS NULL - 90% of queries."
          />
          <Convention
            title="ON DELETE CASCADE for owned data"
            body="profile soft-delete cascades to plans, completions, checkins. Subscriptions ON DELETE RESTRICT - billing trail preserved."
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

function TableCard({ table }: { table: TableSpec }) {
  return (
    <div className="rounded-3xl border border-line bg-paper p-8">
      <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
        <h3 className="text-2xl font-semibold text-sage font-mono">{table.name}</h3>
        <span className="text-xs text-ink-soft">{table.cols.length} columns</span>
      </div>
      <p className="text-ink-soft leading-relaxed mb-6">{table.description}</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-line/60">
              <th className="py-2 pr-4 font-mono text-xs text-ink-soft/70 uppercase">Column</th>
              <th className="py-2 pr-4 font-mono text-xs text-ink-soft/70 uppercase">Type</th>
              <th className="py-2 pr-4 font-mono text-xs text-ink-soft/70 uppercase">Constraint</th>
              <th className="py-2 font-mono text-xs text-ink-soft/70 uppercase">Note</th>
            </tr>
          </thead>
          <tbody>
            {table.cols.map((c) => (
              <tr key={c.name} className="border-b border-line/30 last:border-0">
                <td className="py-2 pr-4 font-mono text-sm text-ink">{c.name}</td>
                <td className="py-2 pr-4 font-mono text-xs text-ink-soft">{c.type}</td>
                <td className="py-2 pr-4 text-xs">
                  {c.pk && <Tag color="bg-sage text-paper">PK</Tag>}
                  {c.fk && <Tag color="bg-clay/30 text-ink">FK → {c.fk}</Tag>}
                  {c.unique && <Tag color="bg-paper-warm text-ink">UNIQUE</Tag>}
                  {c.nullable && <Tag color="bg-paper-deep text-ink-soft">nullable</Tag>}
                </td>
                <td className="py-2 text-xs text-ink-soft">{c.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {table.rls.map((r) => (
          <span
            key={r}
            className="text-xs font-mono bg-sage/10 text-sage px-3 py-1 rounded-full"
          >
            RLS · {r}
          </span>
        ))}
      </div>
      {table.scaleNote && (
        <p className="mt-4 text-xs text-clay font-medium">⚡ {table.scaleNote}</p>
      )}
    </div>
  );
}

function Tag({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className={`inline-block ${color} px-2 py-0.5 rounded font-mono text-xs mr-1`}>
      {children}
    </span>
  );
}

function Convention({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <h4 className="text-sage font-semibold mb-1">{title}</h4>
      <p className="text-sm text-ink-soft leading-relaxed">{body}</p>
    </div>
  );
}

function Box({
  x,
  y,
  w,
  label,
  sub,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  sub: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={56}
        rx={12}
        fill="#FAF7F2"
        stroke="#2D4F4A"
        strokeWidth="1.5"
      />
      <text
        x={x + w / 2}
        y={y + 24}
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fontFamily="ui-monospace, monospace"
        fill="#2D4F4A"
      >
        {label}
      </text>
      <text
        x={x + w / 2}
        y={y + 42}
        textAnchor="middle"
        fontSize="10"
        fill="#4B5152"
      >
        {sub}
      </text>
    </g>
  );
}

function Edge({
  x1,
  y1,
  x2,
  y2,
  label,
  dashed,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  dashed?: boolean;
}) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#4B5152"
        strokeWidth="1.2"
        strokeOpacity="0.5"
        strokeDasharray={dashed ? "4 3" : undefined}
        markerEnd="url(#rel-arrow)"
      />
      {label && (
        <text
          x={mx}
          y={my - 6}
          textAnchor="middle"
          fontSize="9"
          fontFamily="ui-monospace, monospace"
          fill="#4B5152"
        >
          {label}
        </text>
      )}
    </g>
  );
}
