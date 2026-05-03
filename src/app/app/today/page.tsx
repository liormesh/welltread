import Image from "next/image";
import Link from "next/link";
import { AppHeader } from "@/components/app/AppHeader";
import {
  SAMPLE_SESSIONS,
  SAMPLE_WEEK,
  SAMPLE_USER,
  CAST_LOOKUP,
} from "@/lib/app/sample-plan";
import { getCurrentProfile } from "@/lib/supabase/auth";

export default async function Today() {
  // Confirm session is live (middleware already gates, this is a belt-and-suspenders check
  // and gives us the profile if we want to personalize). Phase 1 still uses sample plan data;
  // assignment engine will swap this for a real plan lookup.
  await getCurrentProfile();
  const session = SAMPLE_SESSIONS["day-1"];
  const cast = CAST_LOOKUP[session.cast];
  const activity = SAMPLE_USER.activity;
  const todayIndex = SAMPLE_WEEK.findIndex((d) => d.status === "today");
  const yesterday =
    todayIndex > 0 ? SAMPLE_WEEK[todayIndex - 1] : null;
  const hasYesterdayDone =
    yesterday && yesterday.kind === "session" && yesterday.status === "done";

  return (
    <>
      <AppHeader title="Today" />

      <div className="flex-1 overflow-y-auto pb-32 max-w-md mx-auto w-full">
        {/* Streak (gentle, muted) */}
        <div className="px-6 pt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-soft">Streak</span>
            <span className="text-sage font-semibold tabular-nums">
              {SAMPLE_USER.streakDays} days
            </span>
          </div>
        </div>

        {/* Yesterday card (collapsed) */}
        {hasYesterdayDone && (
          <div className="px-6 pt-4">
            <details className="rounded-2xl border border-line bg-paper-warm/30 px-4 py-3">
              <summary className="text-sm text-ink cursor-pointer flex items-center justify-between list-none">
                <span>{yesterday?.label} ✓</span>
                <span className="text-ink-soft/70 text-xs">
                  Tap to expand
                </span>
              </summary>
              <p className="mt-3 text-xs text-ink-soft leading-relaxed">
                Energy: 4/5. Body: 4/5. &ldquo;Felt easier than I expected.&rdquo;
              </p>
            </details>
          </div>
        )}

        {/* Today's session - hero */}
        <div className="px-6 mt-6">
          <p className="text-xs uppercase tracking-[0.2em] text-clay mb-2">
            Day {session.number}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-ink leading-tight">
            {session.title}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">{session.subtitle}</p>
        </div>

        <div className="px-6 mt-5">
          <div className="rounded-3xl overflow-hidden bg-paper-warm/40 border border-line">
            <div className="aspect-[4/5] relative bg-paper-warm">
              <Image
                src={cast.image}
                alt={cast.name}
                fill
                priority
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="p-5 bg-paper">
              <p className="text-sm text-ink-soft leading-relaxed">
                {session.welcomeCopy}
              </p>
              <Link
                href={`/app/session/${session.id}`}
                className="mt-5 w-full h-13 py-3.5 rounded-2xl bg-sage text-paper text-base font-medium flex items-center justify-center gap-2 hover:bg-sage-deep transition-colors"
              >
                Start session &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Activity reminder - "what you came here for" */}
        <div className="px-6 mt-7">
          <div className="rounded-2xl border border-line bg-paper-warm/30 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-clay mb-1.5">
              What you came here for
            </p>
            <p className="text-sm text-ink leading-snug">
              <span className="italic text-sage">
                {activity}
              </span>
            </p>
          </div>
        </div>

        {/* This week */}
        <div className="px-6 mt-7">
          <p className="text-xs uppercase tracking-[0.2em] text-clay mb-3">
            This week
          </p>
          <WeekStrip />
        </div>

        {/* Soft 'what to expect' */}
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

function WeekStrip() {
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {SAMPLE_WEEK.map((d, i) => {
        const isToday = d.status === "today";
        const isDone = d.status === "done";
        return (
          <div
            key={i}
            className={`text-center py-2.5 rounded-lg text-xs transition-colors ${
              isToday
                ? "bg-sage text-paper font-semibold"
                : isDone
                  ? "bg-sage/10 text-sage"
                  : d.kind === "rest"
                    ? "bg-paper-warm/40 text-ink-soft/70"
                    : "bg-paper-warm/30 text-ink-soft"
            }`}
          >
            {d.day}
          </div>
        );
      })}
    </div>
  );
}
