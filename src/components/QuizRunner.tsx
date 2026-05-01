"use client";

import { useEffect, useMemo, useState, useCallback, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getQuestion,
  startQuestionId,
  resolveNiche,
  type Answers,
  type Source,
  type Question,
} from "@/lib/quiz/definition";

const SOURCES: Source[] = [
  "home",
  "seniors",
  "posture",
  "postpartum",
  "pelvic-floor",
  "glp1",
];

const STORAGE_KEY = "wt:quiz:v1";

type Persisted = {
  id: string;
  source: Source;
  history: string[];
  current: string;
  answers: Answers;
};

function loadPersisted(): Persisted | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Persisted;
  } catch {
    return null;
  }
}

function savePersisted(p: Persisted) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* quota errors are non-fatal */
  }
}

function clearPersisted() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function collectUtm(params: URLSearchParams): {
  utm: Record<string, string>;
  click_ids: Record<string, string>;
} {
  const utm: Record<string, string> = {};
  const click_ids: Record<string, string> = {};
  for (const [k, v] of params.entries()) {
    if (k.startsWith("utm_")) utm[k] = v;
    if (k === "fbclid" || k === "ttclid" || k === "gclid" || k === "msclkid") {
      click_ids[k] = v;
    }
  }
  return { utm, click_ids };
}

export function QuizRunner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sourceParam = (searchParams.get("source") ?? "home") as string;
  const source: Source = (
    SOURCES.includes(sourceParam as Source) ? sourceParam : "home"
  ) as Source;

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [current, setCurrent] = useState<string>(startQuestionId(source));
  const [answers, setAnswers] = useState<Answers>({});
  const [emailMode, setEmailMode] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Boot: load existing session or start a new one
  useEffect(() => {
    const persisted = loadPersisted();
    if (persisted && persisted.source === source) {
      setSessionId(persisted.id);
      setHistory(persisted.history);
      setCurrent(persisted.current);
      setAnswers(persisted.answers);
      if (persisted.current === "EMAIL") setEmailMode(true);
      return;
    }

    // Brand new session
    const { utm, click_ids } = collectUtm(searchParams);
    const body = {
      source,
      utm,
      click_ids,
      referrer: typeof document !== "undefined" ? document.referrer : "",
    };

    fetch("/api/quiz/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.id) {
          setSessionId(data.id);
          savePersisted({
            id: data.id,
            source,
            history: [],
            current: startQuestionId(source),
            answers: {},
          });
        } else {
          setError("Could not start your assessment. Please refresh.");
        }
      })
      .catch(() => setError("Could not start your assessment. Please refresh."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  const persistAndSave = useCallback(
    (next: Persisted) => {
      savePersisted(next);
      if (!sessionId) return;
      const niche = resolveNiche(source, next.answers);
      void fetch("/api/quiz/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: sessionId,
          answers: next.answers,
          niche,
        }),
      }).catch(() => {
        /* fire-and-forget; final completion is the source of truth */
      });
    },
    [sessionId, source],
  );

  const question: Question | null = useMemo(
    () => (current === "EMAIL" ? null : getQuestion(current)),
    [current],
  );

  const totalSteps = 4; // approximate, used for progress bar
  const progress = Math.min(
    100,
    Math.round(((history.length + (emailMode ? 1 : 0)) / totalSteps) * 100),
  );

  function answerSingle(value: string) {
    if (!question || !sessionId) return;
    const nextAnswers = { ...answers, [question.id]: value };
    const nextStep = question.next(value, nextAnswers);
    const nextHistory = [...history, question.id];
    setAnswers(nextAnswers);
    setHistory(nextHistory);
    setCurrent(nextStep);
    if (nextStep === "EMAIL") setEmailMode(true);

    persistAndSave({
      id: sessionId,
      source,
      history: nextHistory,
      current: nextStep,
      answers: nextAnswers,
    });
  }

  function toggleMulti(value: string) {
    if (!question) return;
    const existing = (answers[question.id] as string[] | undefined) ?? [];

    let nextValues: string[];
    if (value === "none") {
      nextValues = existing.includes("none") ? [] : ["none"];
    } else {
      const without = existing.filter((v) => v !== "none");
      nextValues = without.includes(value)
        ? without.filter((v) => v !== value)
        : [...without, value];
    }

    setAnswers({ ...answers, [question.id]: nextValues });
  }

  function continueMulti() {
    if (!question || !sessionId) return;
    const value = (answers[question.id] as string[] | undefined) ?? [];
    const nextStep = question.next(value, answers);
    const nextHistory = [...history, question.id];
    setHistory(nextHistory);
    setCurrent(nextStep);
    if (nextStep === "EMAIL") setEmailMode(true);

    persistAndSave({
      id: sessionId,
      source,
      history: nextHistory,
      current: nextStep,
      answers,
    });
  }

  function back() {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    const nextHistory = history.slice(0, -1);
    setHistory(nextHistory);
    setCurrent(last);
    setEmailMode(false);
    if (sessionId) {
      savePersisted({
        id: sessionId,
        source,
        history: nextHistory,
        current: last,
        answers,
      });
    }
  }

  async function submitEmail(e: FormEvent) {
    e.preventDefault();
    if (!sessionId) return;
    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const niche = resolveNiche(source, answers);

    try {
      const res = await fetch("/api/quiz/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: sessionId, email, answers, niche }),
      });
      if (!res.ok) throw new Error();
      // Hand off to the plan page; let it pull from localStorage so a refresh works.
      router.push("/plan");
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (error && !sessionId) {
    return <p className="text-clay text-sm">{error}</p>;
  }

  return (
    <div>
      {/* Progress */}
      <div className="mb-10">
        <div className="h-1 w-full bg-line/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-sage transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-ink-soft/70">
          <span>
            {emailMode ? "Last step" : `Step ${history.length + 1}`}
          </span>
          {history.length > 0 && (
            <button
              type="button"
              onClick={back}
              className="hover:text-sage transition-colors"
            >
              &larr; Back
            </button>
          )}
        </div>
      </div>

      {emailMode && (
        <form onSubmit={submitEmail} className="space-y-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink leading-tight">
              Where should we send your{" "}
              <span className="text-sage italic font-normal">plan</span>?
            </h2>
            <p className="mt-4 text-ink-soft leading-relaxed">
              We&rsquo;ll show you a preview now and email a copy you can come
              back to. No spam, ever.
            </p>
          </div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 h-14 rounded-2xl border border-line bg-paper-warm/30 text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition"
          />
          {error && <p className="text-sm text-clay">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-14 rounded-2xl bg-sage text-paper font-medium hover:bg-sage-deep disabled:opacity-60 transition-colors"
          >
            {submitting ? "Building your plan..." : "See my plan"}
          </button>
          <p className="text-xs text-ink-soft/70 text-center">
            By continuing you agree to occasional product emails. You can
            unsubscribe anytime.
          </p>
        </form>
      )}

      {!emailMode && question && (
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink leading-tight">
              {question.prompt}
            </h2>
            {question.helper && (
              <p className="mt-3 text-ink-soft leading-relaxed">
                {question.helper}
              </p>
            )}
          </div>

          <div className="space-y-3">
            {question.options.map((opt) => {
              const selected =
                question.type === "single"
                  ? answers[question.id] === opt.value
                  : (
                      (answers[question.id] as string[] | undefined) ?? []
                    ).includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    question.type === "single"
                      ? answerSingle(opt.value)
                      : toggleMulti(opt.value)
                  }
                  className={`w-full text-left px-5 py-4 rounded-2xl border transition-all ${
                    selected
                      ? "border-sage bg-sage/5 text-ink"
                      : "border-line bg-paper hover:border-sage/40 hover:bg-paper-warm/30 text-ink"
                  }`}
                >
                  <span className="block font-medium">{opt.label}</span>
                  {opt.helper && (
                    <span className="mt-1 block text-sm text-ink-soft">
                      {opt.helper}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {question.type === "multi" && (
            <button
              type="button"
              onClick={continueMulti}
              disabled={
                !((answers[question.id] as string[] | undefined) ?? []).length
              }
              className="w-full h-14 rounded-2xl bg-sage text-paper font-medium hover:bg-sage-deep disabled:opacity-50 transition-colors"
            >
              Continue
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export { clearPersisted as clearQuizState, STORAGE_KEY as QUIZ_STORAGE_KEY };
