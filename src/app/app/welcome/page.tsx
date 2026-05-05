/**
 * Post-checkout success page. The webhook will have already fired
 * checkout.session.completed by the time the user lands here, but we
 * lookup the session for confirmation copy.
 */
import Link from "next/link";
import { getStripe } from "@/lib/stripe/client";

export const dynamic = "force-dynamic";

export default async function Welcome({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  let email: string | null = null;
  let trialEnd: number | null = null;
  if (session_id) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ["subscription"],
      });
      email = session.customer_details?.email ?? null;
      const sub = session.subscription;
      if (sub && typeof sub !== "string") {
        trialEnd = sub.trial_end ?? null;
      }
    } catch {
      // best-effort lookup
    }
  }

  const trialEndDate = trialEnd
    ? new Date(trialEnd * 1000).toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="mx-auto max-w-xl px-6 py-20">
      <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
        You&rsquo;re in
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-ink leading-[1.05]">
        Welcome to{" "}
        <span className="text-sage italic font-normal">Welltread</span>.
      </h1>
      <p className="mt-6 text-base text-ink-soft leading-relaxed">
        Your $1 trial is active. {trialEndDate ? (
          <>You won&rsquo;t be charged again until <span className="text-ink font-medium">{trialEndDate}</span>.</>
        ) : (
          <>You won&rsquo;t be charged again for 7 days.</>
        )}
        {email && (
          <>
            {" "}A receipt is on its way to{" "}
            <span className="text-ink font-medium">{email}</span>.
          </>
        )}
      </p>
      <Link
        href="/app/today"
        className="mt-8 inline-block px-8 h-14 leading-[3.5rem] rounded-2xl bg-sage text-paper text-sm font-medium hover:bg-sage-deep transition-colors"
      >
        Start Day 1 &rarr;
      </Link>
    </main>
  );
}
