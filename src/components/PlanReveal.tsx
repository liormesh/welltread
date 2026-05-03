"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  previewPlan,
  resolveNiche,
  resolveAgeBand,
  type Source,
  type Answers,
  type PlanPreview,
} from "@/lib/quiz/definition";
import { castFor } from "@/lib/visual/cast";
import { QUIZ_STORAGE_KEY } from "@/components/QuizRunner";

type Persisted = {
  id: string;
  source: Source;
  answers: Answers;
};

export function PlanReveal() {
  const [plan, setPlan] = useState<PlanPreview | null>(null);
  const [niche, setNiche] = useState<string>("general");
  const [castImage, setCastImage] = useState<string>("/cast/maria.png");
  const [castName, setCastName] = useState<string>("Maria");
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
      const ageBand = resolveAgeBand(parsed.answers);
      const cast = castFor(resolvedNiche, ageBand);
      setCastImage(cast.canonicalImage);
      setCastName(cast.name);
    } catch {
      /* fall through to no-plan state */
    }
  }, []);

  if (hydrated && !plan) {
    return (
      <section className="mx-auto max-w-2xl px-6 pt-16 pb-24 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">Hmm</p>
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
      {/* Hero with cast portrait */}
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
              Built for you
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-ink leading-[1.1]">
              {plan.title}
            </h1>
            <p className="mt-6 text-xl text-ink-soft leading-relaxed">
              By week 12, you&rsquo;ll be ready to{" "}
              <span className="text-sage italic font-normal">{plan.activity}</span>.
            </p>
            <p className="mt-6 text-base text-ink-soft leading-relaxed">
              {plan.weeks} weeks. {plan.sessionsPerWeek} sessions per week.
              Adjusts as your body responds.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden border border-line bg-paper-warm/30 max-w-sm w-full mx-auto">
            <Image
              src={castImage}
              alt={`${castName}, your program guide`}
              width={400}
              height={500}
              className="w-full h-auto object-cover"
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* Focus */}
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

      {/* Week timeline */}
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <h2 className="text-xl font-semibold text-ink mb-6">Your 12-week path</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Milestone
            week="Week 3"
            title="Less stiff"
            body="Mobility blocks compound. Daily ranges return."
            shape="mobility"
          />
          <Milestone
            week="Week 6"
            title="Stronger"
            body="Functional strength shows up in real life."
            shape="strength"
          />
          <Milestone
            week="Week 12"
            title={plan.activity}
            body="The thing you came here for. We meet you there."
            shape="alignment"
          />
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
            <Tier term="1 month" price="$24" perDay="$0.80 / day" />
            <Tier
              term="3 months"
              price="$59"
              perDay="$0.66 / day"
              highlight="Most popular"
            />
            <Tier
              term="12 months"
              price="$99"
              perDay="$0.27 / day"
              note="Best value"
            />
          </div>

          <button
            type="button"
            disabled
            title="Stripe wiring next phase"
            className="mt-8 w-full h-14 rounded-2xl bg-sage text-paper font-medium hover:bg-sage-deep transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Start your $1 trial
          </button>
          <p className="mt-3 text-xs text-ink-soft/70 text-center">
            Niche: {niche}. Stripe checkout opens next phase. Your plan is saved.
          </p>
        </div>
      </section>
    </>
  );
}

function Milestone({
  week,
  title,
  body,
  shape,
}: {
  week: string;
  title: string;
  body: string;
  shape: "mobility" | "strength" | "alignment";
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `url(/shapes/${shape}.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative">
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-2">
          {week}
        </p>
        <p className="text-ink font-semibold text-lg">{title}</p>
        <p className="mt-2 text-sm text-ink-soft leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

function Tier({
  term,
  price,
  perDay,
  highlight,
  note,
}: {
  term: string;
  price: string;
  perDay: string;
  highlight?: string;
  note?: string;
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
      {note && !highlight && (
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-3">
          {note}
        </p>
      )}
      <p className="text-sm text-ink-soft">{term}</p>
      <p className="mt-2 text-3xl font-semibold text-ink">{price}</p>
      <p className="mt-1 text-sm text-ink-soft">{perDay}</p>
    </div>
  );
}
