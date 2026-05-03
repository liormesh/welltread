export const metadata = {
  title: "$1 trial flow - Welltread Vault",
  robots: { index: false, follow: false, nocache: true },
};

export default function TrialFlow() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 space-y-16">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
          11 - $1 trial flow
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-ink leading-[1.05]">
          From paywall click{" "}
          <span className="text-sage italic font-normal">to first session</span>.
        </h1>
        <p className="mt-6 text-lg text-ink-soft max-w-3xl leading-relaxed">
          Stripe integration design. The mechanic: $1 upfront, 7-day trial,
          auto-bill the chosen plan on day 8 unless cancelled. 30-day
          money-back guarantee on the first month.
        </p>
      </header>

      <Section eyebrow="A" title="The user flow">
        <ol className="space-y-6">
          <Step
            n="01"
            title="User clicks 'Start your $1 trial' on plan reveal"
            body="Selected tier comes from the paywall (default: 3-month plan). Tier choice posts to /api/checkout/start with the user's quiz_session_id."
          />
          <Step
            n="02"
            title="Backend creates a Stripe Checkout Session"
            body="One-time $1 charge today + a Subscription with trial_period_days=7 attached. Customer is created with email + quiz metadata. Subscription start_date is now; the user's first scheduled charge is day 8 at the chosen tier price."
          />
          <Step
            n="03"
            title="User redirected to Stripe-hosted checkout"
            body="Apple Pay / Google Pay / card / PayPal. Email pre-filled from quiz answers. Welltread brand assets on the page."
          />
          <Step
            n="04"
            title="Payment succeeds → webhook fires"
            body="checkout.session.completed → backend creates the user_plans row, profiles row, account auth via Supabase magic link. Sends welcome email with magic-link sign-in. Returns user to /welcome with their plan."
          />
          <Step
            n="05"
            title="Day 8 trial converts"
            body="Stripe auto-charges the chosen tier. invoice.paid webhook fires, subscription remains active, no user action needed."
          />
          <Step
            n="06"
            title="User can cancel anytime in account portal"
            body="Stripe customer portal embedded in /app/billing. Cancellation respects the chosen-tier period (e.g. 3-month plan gives access through end of paid term)."
          />
        </ol>
      </Section>

      <Section eyebrow="B" title="Stripe object model">
        <table className="w-full text-sm rounded-2xl overflow-hidden border border-line">
          <thead className="bg-paper-warm/40 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-sage">Object</th>
              <th className="px-4 py-3 font-semibold text-sage">What we use it for</th>
              <th className="px-4 py-3 font-semibold text-sage">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60 bg-paper">
            <Row
              obj="Customer"
              use="One per user, keyed by email. Holds payment methods, subscriptions, billing history."
              notes="Created at Checkout. metadata.quiz_session_id + niche stored for analytics."
            />
            <Row
              obj="Product"
              use="One product: 'Welltread Personalized Movement Program'."
              notes="All tiers are Prices on this single Product."
            />
            <Row
              obj="Price (recurring)"
              use="Three tiers: $24/mo, $59 every 3mo, $99 every 12mo."
              notes="Each Price has its own ID. Stored as env vars or Stripe metadata."
            />
            <Row
              obj="Price (one-time)"
              use="$1 trial-start fee."
              notes="Charged once at checkout to validate card."
            />
            <Row
              obj="Subscription"
              use="One per active user. Linked to Customer + the chosen recurring Price."
              notes="trial_period_days=7. cancel_at_period_end on user-cancel."
            />
            <Row
              obj="Coupon / Promotion Code"
              use="Affiliate / influencer codes (later phase)."
              notes="Rewardful syncs these via Stripe API."
            />
          </tbody>
        </table>
      </Section>

      <Section eyebrow="C" title="Webhooks we listen to">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Webhook
            event="checkout.session.completed"
            action="Create profile + user_plan + send welcome email"
            critical
          />
          <Webhook
            event="customer.subscription.trial_will_end"
            action="Day 6: send 'your trial ends tomorrow' email"
          />
          <Webhook
            event="invoice.paid"
            action="Mark plan active, log billing event"
            critical
          />
          <Webhook
            event="invoice.payment_failed"
            action="Mark plan past_due, send recovery email, retry per Stripe Smart Retries"
            critical
          />
          <Webhook
            event="customer.subscription.updated"
            action="Sync subscription state to user_plan (tier change, pause, etc.)"
          />
          <Webhook
            event="customer.subscription.deleted"
            action="Mark plan cancelled, retain access until period_end"
            critical
          />
          <Webhook
            event="charge.refunded"
            action="Mark plan refunded, revoke access immediately. Log reason."
          />
        </div>
        <p className="mt-6 text-sm text-ink-soft">
          Endpoint: <code className="bg-paper-warm/40 px-2 py-1 rounded text-xs">POST /api/stripe/webhook</code>. Signature verification via STRIPE_WEBHOOK_SECRET. Idempotent on event.id (we record processed events in a Supabase table).
        </p>
      </Section>

      <Section eyebrow="D" title="Account creation timing">
        <p className="text-ink-soft mb-6 max-w-3xl leading-relaxed">
          We do <strong>not</strong> require account creation before checkout.
          The quiz-funnel principle is to minimize friction at the conversion
          moment. Account is provisioned automatically on{" "}
          <code className="text-xs bg-paper-warm/40 px-2 py-1 rounded">
            checkout.session.completed
          </code>
          , then the user gets a magic-link login email so they can access{" "}
          <code className="text-xs bg-paper-warm/40 px-2 py-1 rounded">
            welltread.app
          </code>
          .
        </p>
        <div className="rounded-2xl border border-line bg-paper-warm/40 p-6">
          <h3 className="text-base font-semibold text-sage mb-3">Sequence</h3>
          <ol className="space-y-2 text-sm text-ink-soft list-decimal list-inside">
            <li>Quiz completes → email captured in quiz_sessions + email_signups</li>
            <li>User clicks "Start your $1 trial" → Checkout Session created</li>
            <li>Stripe Checkout → payment success</li>
            <li>Webhook fires → Supabase auth user created via service role admin API → profiles row → user_plans row</li>
            <li>Magic-link email sent (Supabase Auth signInWithOtp)</li>
            <li>User clicks magic link → authenticated session in welltread.app</li>
          </ol>
        </div>
      </Section>

      <Section eyebrow="E" title="Edge cases & how we handle them">
        <div className="space-y-3">
          <Edge
            title="User abandons checkout"
            handle="Stripe checkout session expires after 24h. We send a 'forget something?' email at hour 6 with the same checkout link. Tracked via checkout.session.expired."
          />
          <Edge
            title="Existing customer takes the quiz again"
            handle="On checkout, we look up Customer by email. If found, attach new subscription to existing customer (no duplicate). Pre-existing active subscription? Block re-checkout, redirect to /app/billing."
          />
          <Edge
            title="Trial declined card mid-trial"
            handle="trial_period_days protects us - card validates at checkout. If on day 8 the bill fails, Stripe Smart Retries handles dunning over 4 days. After 4 failures: subscription pauses, user gets email to update card."
          />
          <Edge
            title="User wants 30-day money-back guarantee refund"
            handle="Within first 30 days: full refund via /api/billing/refund (admin-only initially, self-serve later). charge.refunded webhook revokes access. We don't gate this behind 'why are you leaving?' - friction kills trust."
          />
          <Edge
            title="Affiliate code at checkout"
            handle="Promotion code field on Stripe Checkout. Rewardful syncs codes nightly. Affiliate attribution stored on Subscription metadata for revenue share calc."
          />
          <Edge
            title="Tier switch mid-subscription"
            handle="customer.subscription.update with new Price + proration_behavior=none. User chooses next-cycle vs immediate. UI in /app/billing."
          />
        </div>
      </Section>

      <Section eyebrow="F" title="Build phases">
        <ol className="space-y-4">
          <Phase
            n="P1"
            title="Stripe Checkout MVP"
            body="Single tier ($59 / 3-month default), $1 trial mechanic, basic webhook handling, account provisioning via magic link. Goal: convert one paying user end-to-end."
          />
          <Phase
            n="P2"
            title="Tier selection + portal"
            body="3-tier paywall page ships, tier passes through to Checkout. Stripe Customer Portal embedded for cancellation + payment-method updates."
          />
          <Phase
            n="P3"
            title="Smart Retries + dunning emails"
            body="Failed-payment recovery flow. Day 6 trial-end reminder. Welcome email sequence."
          />
          <Phase
            n="P4"
            title="Refund self-service + affiliate codes"
            body="In-app refund request within 30-day guarantee window. Rewardful integration."
          />
        </ol>
      </Section>

      <Section eyebrow="G" title="What's needed to ship P1">
        <ul className="space-y-3 text-ink leading-relaxed">
          <Item>Stripe account verified + bank linked (the legal entity, US LLC)</Item>
          <Item>Three Prices created in Stripe dashboard (1mo / 3mo / 12mo)</Item>
          <Item>One Price for the $1 trial-start fee</Item>
          <Item>STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET as Worker secrets</Item>
          <Item>STRIPE_PRICE_ID_* env vars per tier</Item>
          <Item>SUPABASE_SERVICE_ROLE_KEY (already set) for auth user creation</Item>
          <Item>Resend API key for transactional emails (welcome, trial-end, failed-payment)</Item>
          <Item><code className="text-xs bg-paper-warm/40 px-2 py-1 rounded">/api/checkout/start</code> + <code className="text-xs bg-paper-warm/40 px-2 py-1 rounded">/api/stripe/webhook</code> route handlers</Item>
          <Item>Database migration: <code className="text-xs bg-paper-warm/40 px-2 py-1 rounded">stripe_events</code> table for webhook idempotency</Item>
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

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="rounded-2xl border border-line bg-paper p-5 flex gap-5">
      <span className="text-xs font-mono text-clay shrink-0 mt-1">{n}</span>
      <div>
        <h3 className="font-semibold text-ink">{title}</h3>
        <p className="mt-1 text-sm text-ink-soft leading-relaxed">{body}</p>
      </div>
    </li>
  );
}

function Phase({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-xs font-mono text-clay mb-1">{n}</p>
      <h3 className="font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-ink-soft leading-relaxed">{body}</p>
    </li>
  );
}

function Webhook({
  event,
  action,
  critical,
}: {
  event: string;
  action: string;
  critical?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 ${
        critical ? "border-2 border-sage bg-paper" : "border border-line bg-paper"
      }`}
    >
      <p className="text-sm font-mono text-sage mb-2">{event}</p>
      <p className="text-sm text-ink leading-relaxed">{action}</p>
      {critical && (
        <span className="mt-3 inline-block text-xs uppercase tracking-wider text-sage">
          Critical
        </span>
      )}
    </div>
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

function Row({ obj, use, notes }: { obj: string; use: string; notes: string }) {
  return (
    <tr>
      <td className="px-4 py-3 font-medium text-sage align-top">{obj}</td>
      <td className="px-4 py-3 text-ink align-top">{use}</td>
      <td className="px-4 py-3 text-ink-soft align-top text-xs">{notes}</td>
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
