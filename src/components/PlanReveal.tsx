"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  previewPlan,
  resolveNiche,
  type Source,
  type Answers,
  type PlanPreview,
} from "@/lib/quiz/definition";
import { QUIZ_STORAGE_KEY } from "@/components/QuizRunner";

type Persisted = {
  id: string;
  source: Source;
  answers: Answers;
};

export function PlanReveal() {
  const [plan, setPlan] = useState<PlanPreview | null>(null);
  const [niche, setNiche] = useState<string>("general");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      const raw = window.localStorage.getItem(QUIZ_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Persisted;
      const resolvedNiche = resolveNiche(parsed.source, parsed.answers);
      setNiche(resolvedNiche);
      setPlan(previewPlan(resolvedNiche, parsed.answers));
    } catch {
      /* fall through to no-plan state */
    }
  }, []);

  if (hydrated && !plan) {
    return (
      <section className="mx-auto max-w-2xl px-6 pt-16 pb-24 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
          Hmm
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">
          We don&rsquo;t have your answers yet.
        </h1>
        <p className="mt-4 text-ink-soft">
          Take the assessment and we&rsquo;ll build your plan.
        </p>
        <Link
          href="/quiz"
          className="mt-8 inline-block px-6 h-12 leading-[3rem] rounded-2xl bg-sage text-paper font-medium hover:bg-sage-deep transition-colors"
        >
          Start the assessment
        </Link>
      </section>
    );
  }

  if (!plan) {
    return (
      <p className="mx-auto max-w-3xl px-6 pt-16 text-ink-soft text-sm">
        Building your plan...
      </p>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-12 pb-12">
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
          Built for you
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-ink leading-[1.1]">
          {plan.title}
        </h1>
        <p className="mt-6 text-lg text-ink-soft leading-relaxed max-w-2xl">
          {plan.weeks} weeks. {plan.sessionsPerWeek} sessions per week.
          Adjusts as your body responds.
        </p>
      </section>

      {/* What's inside */}
      <section className="mx-auto max-w-3xl px-6 pb-12">
        <h2 className="text-xl font-semibold text-ink mb-6">
          What we&rsquo;ll work on
        </h2>
        <ul className="space-y-3">
          {plan.focus.map((f) => (
            <li
              key={f}
              className="flex items-start gap-3 rounded-2xl border border-line bg-paper p-4"
            >
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-sage shrink-0" />
              <span className="text-ink">{f}</span>
            </li>
          ))}
        </ul>

        {plan.caveats.length > 0 && (
          <div className="mt-6 rounded-2xl border border-line bg-paper-warm/40 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-sage mb-3">
              Adjustments we&rsquo;ll make
            </p>
            <ul className="space-y-2 text-sm text-ink-soft">
              {plan.caveats.map((c) => (
                <li key={c}>- {c}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Week preview */}
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <h2 className="text-xl font-semibold text-ink mb-6">
          A peek at week 1
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-line bg-paper p-5"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-clay mb-2">
                Day {i}
              </p>
              <p className="text-ink font-medium">
                {i === 1 && "Foundation - 12 min"}
                {i === 2 && "Mobility flow - 15 min"}
                {i === 3 && "Strength baseline - 18 min"}
              </p>
              <p className="mt-2 text-sm text-ink-soft">
                Short, deliberate, doable on a tired day.
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 opacity-40 select-none">
          {[4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-line bg-paper p-5 blur-[1px]"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-clay mb-2">
                Day {i}
              </p>
              <p className="text-ink font-medium">Locked</p>
              <p className="mt-2 text-sm text-ink-soft">
                Available after you start your trial.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Paywall */}
      <section className="border-t border-line/60 bg-paper-warm/30">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-xs uppercase tracking-[0.2em] text-clay mb-3">
            Pick a plan
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-ink">
            Start for $1.
          </h2>
          <p className="mt-3 text-ink-soft max-w-2xl">
            7-day trial. Pick the term that fits. Cancel anytime from your
            account.
          </p>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Tier
              term="1 month"
              price="$29"
              perWeek="$7.25 / week"
            />
            <Tier
              term="6 months"
              price="$79"
              perWeek="$3.04 / week"
              highlight="Best value"
            />
            <Tier term="12 months" price="$129" perWeek="$2.48 / week" />
          </div>

          <button
            type="button"
            disabled
            title="Stripe wiring next session"
            className="mt-8 w-full h-14 rounded-2xl bg-sage text-paper font-medium hover:bg-sage-deep transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Start your $1 trial
          </button>
          <p className="mt-3 text-xs text-ink-soft/70 text-center">
            Niche: {niche}. Checkout opens next week. Your plan is saved.
          </p>
        </div>
      </section>
    </>
  );
}

function Tier({
  term,
  price,
  perWeek,
  highlight,
}: {
  term: string;
  price: string;
  perWeek: string;
  highlight?: string;
}) {
  return (
    <div
      className={`rounded-3xl p-6 ${
        highlight
          ? "border-2 border-sage bg-paper"
          : "border border-line bg-paper"
      }`}
    >
      {highlight && (
        <p className="text-xs uppercase tracking-[0.2em] text-sage mb-3">
          {highlight}
        </p>
      )}
      <p className="text-sm text-ink-soft">{term}</p>
      <p className="mt-2 text-3xl font-semibold text-ink">{price}</p>
      <p className="mt-1 text-sm text-ink-soft">{perWeek}</p>
    </div>
  );
}
