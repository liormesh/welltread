import { TEMPLATES, TEMPLATE_GROUPS, type TemplateId } from "@/lib/email/templates";

export const metadata = {
  title: "Email sequences - Welltread Vault",
  robots: { index: false, follow: false, nocache: true },
};

const PREVIEW_CTX = {
  firstName: "Eleanor",
  resumeUrl: "https://welltread.co/plan?resume=eyJxc2lkIjoiMmNhZjZl...",
  checkoutUrl: "https://welltread.co/checkout?resume=...",
  activity: "garden without your back hurting",
  niche: "seniors" as const,
  tierName: "3-month plan",
  tierPrice: "$59",
  perDay: "$0.66/day",
  trialEndDate: "May 11, 2026",
  effectiveDate: "June 3, 2026",
  loginUrl: "https://welltread.app/today",
  billingUrl: "https://welltread.app/billing",
  supportEmail: "hello@welltread.co",
  // Niche-lead avatar in the email header (senior + female → Eleanor)
  castImageUrl: "https://welltread.co/cast/eleanor.png",
  castName: "Eleanor",
};

const TEMPLATE_META: Record<
  TemplateId,
  {
    label: string;
    trigger: string;
    timing: string;
    group: "acquisition" | "payment";
    wired: boolean;
  }
> = {
  "quiz-incomplete-6h": { label: "Quiz incomplete (6h)", trigger: "quiz_session.started_at without completed_at", timing: "+6h after start", group: "acquisition", wired: true },
  "quiz-incomplete-24h": { label: "Quiz incomplete (24h)", trigger: "quiz_session.started_at without completed_at", timing: "+24h after start", group: "acquisition", wired: true },
  "quiz-incomplete-7d": { label: "Quiz incomplete (7d)", trigger: "quiz_session.started_at without completed_at", timing: "+7d after start", group: "acquisition", wired: true },
  "plan-ready-2h": { label: "Plan ready (2h)", trigger: "completed quiz, no checkout", timing: "+2h after completion", group: "acquisition", wired: true },
  "plan-ready-24h": { label: "Plan ready (24h, personal)", trigger: "completed quiz, no checkout", timing: "+24h after completion", group: "acquisition", wired: true },
  "plan-ready-72h": { label: "Plan ready (72h, trust)", trigger: "completed quiz, no checkout", timing: "+72h after completion", group: "acquisition", wired: true },
  "plan-soft-checkin-14d": { label: "Soft check-in (14d)", trigger: "completed quiz, no checkout", timing: "+14d after completion", group: "acquisition", wired: true },
  "win-back-30d": { label: "Win-back free week (30d)", trigger: "completed quiz, no checkout", timing: "+30d after completion", group: "acquisition", wired: true },
  "trial-welcome": { label: "Trial welcome", trigger: "checkout.session.completed (Stripe webhook)", timing: "immediate", group: "payment", wired: false },
  "trial-day-3": { label: "Trial day 3 nudge", trigger: "scheduled (3 days after trial start)", timing: "day 3", group: "payment", wired: false },
  "trial-ending-soon": { label: "Trial ending soon", trigger: "customer.subscription.trial_will_end (Stripe webhook)", timing: "day 6 of trial", group: "payment", wired: false },
  "paid-month-1": { label: "Welcome to month 1", trigger: "first invoice.paid (Stripe webhook)", timing: "day 8", group: "payment", wired: false },
  "payment-failed": { label: "Payment failed", trigger: "invoice.payment_failed (Stripe webhook)", timing: "immediate", group: "payment", wired: false },
  "cancellation-confirmed": { label: "Cancellation confirmed", trigger: "customer.subscription.deleted (Stripe webhook)", timing: "immediate", group: "payment", wired: false },
  "refund-processed": { label: "Refund processed", trigger: "charge.refunded (Stripe webhook)", timing: "immediate", group: "payment", wired: false },
  "win-back-cancel": { label: "Win-back free week (post-cancel)", trigger: "scheduled (30d after cancellation)", timing: "+30d after cancel", group: "payment", wired: false },
};

export default function EmailSequences() {
  const acqIds = TEMPLATE_GROUPS.acquisition;
  const payIds = TEMPLATE_GROUPS.payment;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 space-y-16">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
          13 - Email sequences
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-ink leading-[1.05]">
          Sixteen emails,{" "}
          <span className="text-sage italic font-normal">two phases</span>.
        </h1>
        <p className="mt-6 text-lg text-ink-soft max-w-3xl leading-relaxed">
          Acquisition emails (8) are <strong>built and wired</strong> - cron
          tick runs every 15 min via GitHub Actions, hits{" "}
          <code className="text-xs bg-paper-warm/40 px-2 py-1 rounded">/api/cron/email-tick</code>,
          which scans for due sessions and sends via Resend.
          Trial / payment emails (8) are <strong>built but not wired</strong> -
          waiting on Stripe webhooks to fire them.
        </p>
        <p className="mt-4 text-sm text-ink-soft">
          Previews below use sample context: Eleanor, seniors niche, $59 3-month
          plan, Q19 = "garden without your back hurting".
        </p>
      </header>

      <Section eyebrow="A" title="Acquisition flow (live)">
        <p className="text-sm text-ink-soft mb-6 max-w-3xl leading-relaxed">
          These send automatically. Sender:{" "}
          <code className="bg-paper-warm/40 px-2 py-1 rounded text-xs">
            Welltread &lt;hello@welltread.co&gt;
          </code>
          . Resume tokens (signed, 90-day TTL) are minted per send and embedded
          in every CTA so users on a different device or cleared cache can pick
          up where they left off.
        </p>
        <div className="space-y-12">
          {acqIds.map((id) => (
            <Preview key={id} id={id} />
          ))}
        </div>
      </Section>

      <Section eyebrow="B" title="Trial / payment flow (built, not wired)">
        <p className="text-sm text-ink-soft mb-6 max-w-3xl leading-relaxed">
          Templates ready. Wiring requires Stripe webhooks (see{" "}
          <a className="text-sage hover:underline" href="/vault/trial-flow">
            /vault/trial-flow
          </a>
          ). Each will fire automatically when its trigger event lands.
        </p>
        <div className="space-y-12">
          {payIds.map((id) => (
            <Preview key={id} id={id} />
          ))}
        </div>
      </Section>

      <Section eyebrow="C" title="Operational notes">
        <ul className="space-y-3 text-ink leading-relaxed">
          <Item>
            <strong>Sender domain:</strong> currently configured for{" "}
            <code className="text-xs bg-paper-warm/40 px-1 py-0.5 rounded">
              hello@welltread.co
            </code>{" "}
            but DNS still needs to be verified on Resend. Until verified, sends
            will fail with deliverability errors. Verify SPF + DKIM + DMARC for
            welltread.co in Resend dashboard before going live.
          </Item>
          <Item>
            <strong>Cron:</strong> GitHub Actions cron runs every 15 min and
            calls{" "}
            <code className="text-xs bg-paper-warm/40 px-1 py-0.5 rounded">
              POST /api/cron/email-tick
            </code>
            with{" "}
            <code className="text-xs bg-paper-warm/40 px-1 py-0.5 rounded">
              X-Cron-Auth
            </code>{" "}
            header. Logs are visible in GH Actions runs. Workflow file:{" "}
            <code className="text-xs bg-paper-warm/40 px-1 py-0.5 rounded">
              .github/workflows/email-cron.yml
            </code>
            .
          </Item>
          <Item>
            <strong>Idempotency:</strong> the{" "}
            <code className="text-xs bg-paper-warm/40 px-1 py-0.5 rounded">
              email_sends
            </code>{" "}
            table records every send keyed by{" "}
            <code className="text-xs bg-paper-warm/40 px-1 py-0.5 rounded">
              (template_id, quiz_session_id)
            </code>
            . The scheduler skips any session that has already received a given
            template. Safe to re-run.
          </Item>
          <Item>
            <strong>Resume tokens:</strong> JWT-like signed strings with 90-day
            TTL. Verified server-side at{" "}
            <code className="text-xs bg-paper-warm/40 px-1 py-0.5 rounded">
              /api/quiz/resume
            </code>
            , which fetches the user's session + answers + normalized activity
            from Supabase. Both /quiz and /plan handle the{" "}
            <code className="text-xs bg-paper-warm/40 px-1 py-0.5 rounded">
              ?resume=
            </code>{" "}
            param.
          </Item>
          <Item>
            <strong>Win-back at 30d:</strong> currently lives in the
            acquisition rules. The "free week 1" mechanic is copy-only until
            the product layer ships - the link drops users on the plan reveal
            page, not into a real free week. Real free-week mechanic in Phase
            2.
          </Item>
          <Item>
            <strong>Personalization:</strong> templates pull{" "}
            <code className="text-xs bg-paper-warm/40 px-1 py-0.5 rounded">
              firstName
            </code>{" "}
            from quiz answers (we don't capture it currently - placeholder for
            when we add a "what's your first name?" optional question), and{" "}
            <code className="text-xs bg-paper-warm/40 px-1 py-0.5 rounded">
              activity
            </code>{" "}
            from the Claude-normalized Q19. The 24h plan-ready email has the
            highest personalization weight - it's the one to A/B against
            generic.
          </Item>
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
      <p className="text-xs uppercase tracking-[0.2em] text-clay mb-2">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-ink mb-6">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Preview({ id }: { id: TemplateId }) {
  const meta = TEMPLATE_META[id];
  const renderer = TEMPLATES[id];
  const rendered = renderer(PREVIEW_CTX);

  return (
    <article className="rounded-3xl border border-line bg-paper p-6">
      <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
        <div>
          <p className="text-xs font-mono text-ink-soft/70 mb-1">{id}</p>
          <h3 className="text-xl font-semibold text-ink">{meta.label}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
              meta.wired
                ? "border-sage bg-sage/5 text-sage"
                : "border-clay bg-clay-soft/10 text-clay"
            }`}
          >
            {meta.wired ? "Wired" : "Not wired"}
          </span>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border border-line bg-paper-warm/30 text-ink-soft">
            {meta.timing}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-3 text-sm mb-4">
        <span className="text-ink-soft/70">Trigger</span>
        <span className="text-ink">{meta.trigger}</span>
        <span className="text-ink-soft/70">Subject</span>
        <span className="text-ink font-medium">{rendered.subject}</span>
      </div>

      <details>
        <summary className="cursor-pointer text-sm text-sage hover:underline">
          Show plain-text body
        </summary>
        <pre className="mt-3 p-4 bg-paper-warm/40 border border-line rounded-2xl text-xs text-ink whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
          {rendered.text}
        </pre>
      </details>

      <details className="mt-2">
        <summary className="cursor-pointer text-sm text-sage hover:underline">
          Show HTML render
        </summary>
        <iframe
          title={`${id} preview`}
          srcDoc={rendered.html}
          className="mt-3 w-full h-[600px] border border-line rounded-2xl bg-paper"
        />
      </details>
    </article>
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
