import Link from "next/link";
import { AppHeader } from "@/components/app/AppHeader";
import { SAMPLE_USER } from "@/lib/app/sample-plan";

export default function Profile() {
  return (
    <>
      <AppHeader title="Profile" />

      <div className="flex-1 overflow-y-auto pb-32 max-w-md mx-auto w-full">
        <div className="px-6 pt-6">
          <p className="text-xs uppercase tracking-[0.2em] text-clay">Hi</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">
            {SAMPLE_USER.firstName}
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            Your plan is built around{" "}
            <span className="italic text-sage">{SAMPLE_USER.activity}</span>.
          </p>
        </div>

        <div className="px-6 mt-7 space-y-2.5">
          <Row label="Plan" value="Mobility Foundation - 12 weeks" />
          <Row label="Niche" value={SAMPLE_USER.niche} />
          <Row label="Streak" value={`${SAMPLE_USER.streakDays} days`} />
          <Row label="Notification cadence" value="Daily nudge - 9am local" />
        </div>

        <div className="px-6 mt-7">
          <p className="text-xs uppercase tracking-[0.2em] text-clay mb-3">
            Manage
          </p>
          <div className="space-y-2.5">
            <ActionRow
              title="Re-take the assessment"
              body="Refresh your plan if your goals or body have shifted."
              href="/quiz"
            />
            <ActionRow
              title="Pause for 2 weeks"
              body="Going on vacation? Plan + billing freeze until you're back."
              href="#"
              disabled
            />
            <ActionRow
              title="Billing"
              body="Update payment, change tier, or cancel."
              href="#"
              disabled
            />
          </div>
        </div>

        <div className="px-6 mt-8">
          <p className="text-xs uppercase tracking-[0.2em] text-clay mb-3">
            Help
          </p>
          <div className="space-y-2.5">
            <ActionRow
              title="Talk to us"
              body="hello@welltread.co - a real person reads it."
              href="mailto:hello@welltread.co"
            />
          </div>
        </div>

        <div className="px-6 mt-10 text-center">
          <p className="text-xs text-ink-soft/60">
            Demo mode - real account features land with Stripe in Phase 1.
          </p>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-line bg-paper px-4 py-3">
      <span className="text-xs uppercase tracking-wider text-ink-soft/70">
        {label}
      </span>
      <span className="text-sm text-ink font-medium">{value}</span>
    </div>
  );
}

function ActionRow({
  title,
  body,
  href,
  disabled,
}: {
  title: string;
  body: string;
  href: string;
  disabled?: boolean;
}) {
  const className = `block rounded-2xl border border-line bg-paper px-4 py-3 transition-colors ${
    disabled
      ? "opacity-60 cursor-not-allowed"
      : "hover:border-sage/40 hover:bg-paper-warm/30"
  }`;
  if (disabled) {
    return (
      <div className={className}>
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="mt-1 text-xs text-ink-soft leading-relaxed">{body}</p>
        <p className="mt-1 text-xs text-clay">Coming with Stripe</p>
      </div>
    );
  }
  return (
    <Link href={href} className={className}>
      <p className="text-sm font-medium text-ink">{title}</p>
      <p className="mt-1 text-xs text-ink-soft leading-relaxed">{body}</p>
    </Link>
  );
}
