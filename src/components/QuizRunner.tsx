"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getSlot,
  startSlotId,
  resolveNiche,
  isQuestion,
  isInterstitial,
  QUIZ_VERSION,
  type Answers,
  type Source,
  type AnswerValue,
} from "@/lib/quiz/definition";
import { QuestionRenderer } from "@/components/quiz/QuestionRenderer";
import { InterstitialRenderer } from "@/components/quiz/InterstitialRenderer";

const SOURCES: Source[] = [
  "home",
  "seniors",
  "posture",
  "postpartum",
  "pelvic-floor",
  "glp1",
];

const STORAGE_KEY = "wt:quiz:v2";

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
    /* quota errors non-fatal */
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

function collectUtm(params: URLSearchParams) {
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
  const [current, setCurrent] = useState<string>(startSlotId(source));
  const [answers, setAnswers] = useState<Answers>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Boot
  useEffect(() => {
    const persisted = loadPersisted();
    if (persisted && persisted.source === source) {
      setSessionId(persisted.id);
      setHistory(persisted.history);
      setCurrent(persisted.current);
      setAnswers(persisted.answers);
      return;
    }

    const { utm, click_ids } = collectUtm(searchParams);
    fetch("/api/quiz/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source,
        utm,
        click_ids,
        referrer: typeof document !== "undefined" ? document.referrer : "",
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.id) {
          setSessionId(data.id);
          savePersisted({
            id: data.id,
            source,
            history: [],
            current: startSlotId(source),
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
      }).catch(() => {});
    },
    [sessionId, source],
  );

  const slot = getSlot(current);
  const totalSteps = 38; // approximate; for progress bar
  const progress = Math.min(
    100,
    Math.round((history.length / totalSteps) * 100),
  );

  function advance(nextId: string, newAnswers: Answers) {
    if (!sessionId) return;
    const nextHistory = [...history, current];
    if (nextId === "DONE") {
      submitFinal(newAnswers, nextHistory);
      return;
    }
    setHistory(nextHistory);
    setCurrent(nextId);
    setAnswers(newAnswers);
    persistAndSave({
      id: sessionId,
      source,
      history: nextHistory,
      current: nextId,
      answers: newAnswers,
    });
  }

  async function submitFinal(finalAnswers: Answers, finalHistory: string[]) {
    if (!sessionId) return;
    setSubmitting(true);
    setError(null);

    const niche = resolveNiche(source, finalAnswers);
    const email = finalAnswers["Q28"] as string | undefined;

    try {
      const res = await fetch("/api/quiz/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: sessionId,
          email,
          answers: finalAnswers,
          niche,
        }),
      });
      if (!res.ok) throw new Error();

      const persisted: Persisted = {
        id: sessionId,
        source,
        history: finalHistory,
        current: "DONE",
        answers: finalAnswers,
      };
      savePersisted(persisted);

      router.push("/plan");
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  function back() {
    if (history.length === 0) return;
    if (!sessionId) return;
    const last = history[history.length - 1];
    const nextHistory = history.slice(0, -1);
    setHistory(nextHistory);
    setCurrent(last);
    persistAndSave({
      id: sessionId,
      source,
      history: nextHistory,
      current: last,
      answers,
    });
  }

  function onSingle(value: string) {
    if (!slot || !isQuestion(slot)) return;
    const newAnswers = { ...answers, [slot.id]: value };
    setAnswers(newAnswers);
    // Single-select questions auto-advance
    if (slot.type === "single" || slot.type === "yesno") {
      const nextId = slot.next(value, newAnswers);
      advance(nextId, newAnswers);
    } else {
      // checkbox / multi - stay on screen, wait for continue
      setAnswers(newAnswers);
      const updated: Persisted = {
        id: sessionId!,
        source,
        history,
        current,
        answers: newAnswers,
      };
      persistAndSave(updated);
    }
  }

  function onMulti(value: string[]) {
    if (!slot || !isQuestion(slot)) return;
    const newAnswers = { ...answers, [slot.id]: value };
    setAnswers(newAnswers);
    if (sessionId) {
      persistAndSave({
        id: sessionId,
        source,
        history,
        current,
        answers: newAnswers,
      });
    }
  }

  function onSlider(value: number) {
    if (!slot || !isQuestion(slot)) return;
    const newAnswers = { ...answers, [slot.id]: value };
    setAnswers(newAnswers);
    if (sessionId) {
      persistAndSave({
        id: sessionId,
        source,
        history,
        current,
        answers: newAnswers,
      });
    }
  }

  function onText(value: string) {
    if (!slot || !isQuestion(slot)) return;
    const newAnswers = { ...answers, [slot.id]: value };
    setAnswers(newAnswers);
    if (sessionId) {
      persistAndSave({
        id: sessionId,
        source,
        history,
        current,
        answers: newAnswers,
      });
    }
  }

  function onContinue() {
    if (!slot || !isQuestion(slot)) return;
    const value = answers[slot.id];
    if (value === undefined) return;
    const nextId = slot.next(value as AnswerValue, answers);
    advance(nextId, answers);
  }

  function onInterstitialContinue() {
    if (!slot || !isInterstitial(slot)) return;
    const nextId = slot.next(answers);
    advance(nextId, answers);
  }

  if (error && !sessionId) {
    return <p className="text-clay text-sm">{error}</p>;
  }

  if (submitting) {
    return (
      <div className="text-center py-16">
        <p className="text-ink-soft">Saving your plan...</p>
      </div>
    );
  }

  if (!slot) {
    return (
      <div className="text-center py-16">
        <p className="text-clay text-sm mb-4">Quiz state lost.</p>
        <button
          type="button"
          onClick={() => {
            clearPersisted();
            window.location.reload();
          }}
          className="px-5 py-2 rounded-2xl bg-sage text-paper text-sm hover:bg-sage-deep transition-colors"
        >
          Restart
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-10">
        <div className="h-1 w-full bg-line/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-sage transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-ink-soft/70">
          <span>{slot.id}</span>
          {history.length > 0 && (
            <button
              type="button"
              onClick={back}
              className="hover:text-sage transition-colors"
            >
              ← Back
            </button>
          )}
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-clay">{error}</p>}

      {isQuestion(slot) && (
        <QuestionRenderer
          question={slot}
          value={answers[slot.id]}
          onSingle={onSingle}
          onMulti={onMulti}
          onSlider={onSlider}
          onText={onText}
          onContinue={onContinue}
        />
      )}

      {isInterstitial(slot) && (
        <InterstitialRenderer
          slot={slot}
          content={slot.render(answers)}
          onContinue={onInterstitialContinue}
        />
      )}
    </div>
  );
}

export { clearPersisted as clearQuizState, STORAGE_KEY as QUIZ_STORAGE_KEY };
