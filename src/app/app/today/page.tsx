import Image from "next/image";
import Link from "next/link";
import { AppHeader } from "@/components/app/AppHeader";
import { CAST_LOOKUP } from "@/lib/app/sample-plan";
import { resolveTodayForUser } from "@/lib/app/plan";
import { requireUser } from "@/lib/supabase/auth";

export default async function Today() {
  // Brand-new visitors to .app with no session land here cold - send them to
  // the acquisition funnel on .co rather than a confusing login page.
  await requireUser({ coldRedirect: "https://welltread.co/quiz?source=home" });

  const ctx = await resolveTodayForUser();
  if (!ctx) {
    // Authed but no active plan (e.g. didn't complete checkout). Send back to
    // the funnel - they need to convert.
    return (
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
            No active plan
          </p>
          <h1 className="text-2xl font-semibold text-ink leading-tight">
            Your plan isn&rsquo;t set up yet.
          </h1>
          <p className="mt-3 text-sm text-ink-soft leading-relaxed">
            Take the assessment and we&rsquo;ll build it.
          </p>
          <a
            href="https://welltread.co/quiz"
            className="mt-6 inline-block px-6 h-12 leading-[3rem] rounded-2xl bg-sage text-paper text-sm font-medium hover:bg-sage-deep transition-colors"
          >
            Start the assessment &rarr;
          </a>
        </div>
      </main>
    );
  }

  const session = ctx.session;
  const cast = CAST_LOOKUP[ctx.cast.id as keyof typeof CAST_LOOKUP];
  const heroImage = cast?.image ?? ctx.cast.canonicalImage;
  const heroName = cast?.name ?? ctx.cast.name;

  return (
    <>
      <AppHeader title="Today" />

      <div className="flex-1 overflow-y-auto pb-32 max-w-md mx-auto w-full">
        {/* Streak (gentle, muted) */}
        <div className="px-6 pt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-soft">Streak</span>
            <span className="text-sage font-semibold tabular-nums">
              {ctx.streakDays} {ctx.streakDays === 1 ? "day" : "days"}
            </span>
          </div>
        </div>

        {/* Yesterday card (collapsed) */}
        {ctx.yesterday && (
          <div className="px-6 pt-4">
            <details className="rounded-2xl border border-line bg-paper-warm/30 px-4 py-3">
              <summary className="text-sm text-ink cursor-pointer flex items-center justify-between list-none">
                <span>
                  {ctx.yesterday.sessionLabel} ✓
                  {ctx.yesterday.durationMinutes > 0 &&
                    ` - ${ctx.yesterday.durationMinutes} min`}
                </span>
                <span className="text-ink-soft/70 text-xs">
                  Tap to expand
                </span>
              </summary>
              {ctx.yesterday.notes && (
                <p className="mt-3 text-xs text-ink-soft leading-relaxed">
                  &ldquo;{ctx.yesterday.notes}&rdquo;
                </p>
              )}
            </details>
          </div>
        )}

        {/* Today's session - hero */}
        <div className="px-6 mt-6">
          <p className="text-xs uppercase tracking-[0.2em] text-clay mb-2">
            Day {ctx.dayNumber}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-ink leading-tight">
            {session.title}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {session.durationMinutes} minutes - with {heroName}
          </p>
        </div>

        <div className="px-6 mt-5">
          <div className="rounded-3xl overflow-hidden bg-paper-warm/40 border border-line">
            <div className="aspect-[4/5] relative bg-paper-warm">
              <Image
                src={heroImage}
                alt={heroName}
                fill
                priority
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="p-5 bg-paper">
              <p className="text-sm text-ink-soft leading-relaxed">
                {ctx.completedToday
                  ? "Done for today. Want to do it again?"
                  : session.welcomeCopy}
              </p>
              <Link
                href={`/app/session/${session.id}${ctx.completedToday ? "?repeat=1" : ""}`}
                className={`mt-5 w-full h-13 py-3.5 rounded-2xl text-base font-medium flex items-center justify-center gap-2 transition-colors ${
                  ctx.completedToday
                    ? "border border-sage text-sage hover:bg-sage hover:text-paper"
                    : "bg-sage text-paper hover:bg-sage-deep"
                }`}
              >
                {ctx.completedToday ? "Take it again" : "Start session"} &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Activity reminder - the thing they came here for */}
        {ctx.activity && (
          <div className="px-6 mt-7">
            <div className="rounded-2xl border border-line bg-paper-warm/30 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-clay mb-1.5">
                What you came here for
              </p>
              <p className="text-sm text-ink leading-snug">
                <span className="italic text-sage">{ctx.activity}</span>
              </p>
            </div>
          </div>
        )}

        {/* Week context */}
        <div className="px-6 mt-7">
          <p className="text-xs uppercase tracking-[0.2em] text-clay mb-1">
            Week {ctx.weekNumber}
          </p>
          <Link
            href="/app/week"
            className="text-sm text-sage hover:underline underline-offset-4"
          >
            See the full week &rarr;
          </Link>
        </div>

        {/* Soft profile link */}
        <div className="px-6 mt-7">
          <Link
            href="/app/profile"
            className="text-sm text-ink-soft hover:text-sage transition-colors underline-offset-4 hover:underline"
          >
            Profile + plan settings &rarr;
          </Link>
        </div>
      </div>
    </>
  );
}
