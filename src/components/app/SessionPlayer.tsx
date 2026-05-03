"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@/lib/app/sample-plan";

type Phase = "preroll" | "movement" | "transition" | "done" | "hurts";

const PREROLL_MS = 3000;

/**
 * Transition between movements. 5 seconds is the sweet spot per category research:
 *   - Peloton: 5s with countdown
 *   - BetterMe: 3s with progress bar
 *   - Sweat: 5-8s with description
 *   - Apple Fitness+: 3-5s no countdown (auto-flows)
 *   - Down Dog / Glo: 5-10s for next-pose explanation
 *
 * Our audience (40+, learning new movements) benefits from longer reads.
 * 5s gives time to read the movement name, see the next cast member, and prepare
 * mentally. Countdown ring offers visual reassurance the app didn't freeze.
 */
const TRANSITION_MS = 5000;

export function SessionPlayer({ session }: { session: Session }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("preroll");
  const [movementIndex, setMovementIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    session.movements[0]?.durationSeconds ?? 0,
  );
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const movement = session.movements[movementIndex];
  const isLast = movementIndex === session.movements.length - 1;

  // Pre-roll auto-advance
  useEffect(() => {
    if (phase !== "preroll") return;
    const t = setTimeout(() => {
      setPhase("movement");
      setSecondsRemaining(session.movements[0].durationSeconds);
    }, PREROLL_MS);
    return () => clearTimeout(t);
  }, [phase, session.movements]);

  // Transition auto-advance
  useEffect(() => {
    if (phase !== "transition") return;
    const t = setTimeout(() => {
      const next = movementIndex + 1;
      if (next >= session.movements.length) {
        setPhase("done");
        return;
      }
      setMovementIndex(next);
      setSecondsRemaining(session.movements[next].durationSeconds);
      setPhase("movement");
    }, TRANSITION_MS);
    return () => clearTimeout(t);
  }, [phase, movementIndex, session.movements]);

  // Movement countdown
  useEffect(() => {
    if (phase !== "movement" || paused) return;
    if (secondsRemaining <= 0) {
      // movement complete
      if (isLast) {
        setPhase("done");
      } else {
        setPhase("transition");
      }
      return;
    }
    const t = setTimeout(() => setSecondsRemaining((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, paused, secondsRemaining, isLast]);

  // Done auto-advance.
  // If the user is repeating an already-completed session (?repeat=1), skip
  // the check-in - they already logged it once today. Send them straight back
  // to /app/today.
  useEffect(() => {
    if (phase !== "done") return;
    const t = setTimeout(() => {
      const isRepeat =
        typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("repeat") === "1";
      if (isRepeat) {
        router.push("/app/today");
      } else {
        router.push(`/app/done?sid=${session.id}`);
      }
    }, 2200);
    return () => clearTimeout(t);
  }, [phase, router, session.id]);

  // Manage video play/pause on phase + paused changes
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (phase === "movement" && !paused) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [phase, paused, movementIndex]);

  function handleSkip() {
    if (phase !== "movement") return;
    if (isLast) setPhase("done");
    else setPhase("transition");
  }

  const [hurtsCueOverride, setHurtsCueOverride] = useState<string | null>(null);

  function handleHurts() {
    setPaused(true);
    setPhase("hurts");
  }

  async function handleHurtsContinue(regions: string[]) {
    if (!movement || regions.length === 0) {
      handleHurtsCancel();
      return;
    }

    // Phase 1: log + receive a cue override. The video stays the same; the
    // cue text changes to a softer instruction.
    try {
      const res = await fetch("/api/app/movement/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          movementId: movement.id,
          movementName: movement.name,
          regions,
        }),
      });
      if (res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { cueOverlay?: string; durationSeconds?: number }
          | null;
        if (data?.cueOverlay) {
          setHurtsCueOverride(data.cueOverlay);
          // If the swap returns a new duration, reset the countdown.
          if (data.durationSeconds && data.durationSeconds > 0) {
            setSecondsRemaining(data.durationSeconds);
          }
        }
      }
    } catch (err) {
      console.error("[swap] failed", err);
    }

    setPaused(false);
    setPhase("movement");
  }

  function handleHurtsCancel() {
    setPaused(false);
    setHurtsCueOverride(null);
    setPhase("movement");
  }

  return (
    <div className="fixed inset-0 bg-ink overflow-hidden">
      {/* Always-mounted video element so phase changes don't reload */}
      <video
        ref={videoRef}
        src={movement?.videoUrl}
        poster={movement?.poster}
        muted
        playsInline
        loop
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          phase === "movement" ? "opacity-90" : "opacity-30"
        }`}
      />

      {/* PRE-ROLL */}
      {phase === "preroll" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink/85 text-center px-8">
          <p className="text-xs uppercase tracking-[0.2em] text-clay mb-3">
            Welltread
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-paper leading-tight">
            Day {session.number}
          </h1>
          <p className="mt-2 text-paper/80">{session.title}</p>
        </div>
      )}

      {/* MOVEMENT */}
      {phase === "movement" && movement && (
        <>
          {/* Top gradient: progress + brand */}
          <div className="absolute top-0 left-0 right-0 p-5 bg-gradient-to-b from-ink/80 to-transparent">
            <div className="flex items-center justify-between text-paper">
              <button
                type="button"
                onClick={() => router.push("/app/today")}
                className="text-xs uppercase tracking-[0.2em] opacity-80 hover:opacity-100"
              >
                ← Exit
              </button>
              <ProgressDots
                total={session.movements.length}
                active={movementIndex}
              />
            </div>
          </div>

          {/* Bottom gradient: cue + timer + controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 pb-10 bg-gradient-to-t from-ink/95 via-ink/50 to-transparent">
            <p className="text-paper/60 text-xs uppercase tracking-[0.2em]">
              {movement.name}
            </p>
            <p className="mt-2 text-paper text-2xl font-semibold leading-snug max-w-[80%]">
              {hurtsCueOverride ?? movement.cue}
            </p>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-paper/60 text-xs">
                Movement {movementIndex + 1} of {session.movements.length}
              </span>
              <span className="text-paper text-3xl font-semibold tabular-nums">
                {formatTime(secondsRemaining)}
              </span>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                className="w-12 h-12 rounded-full border border-paper/40 text-paper flex items-center justify-center hover:bg-paper/10 transition-colors"
                aria-label={paused ? "Play" : "Pause"}
              >
                {paused ? "▶" : "▌▌"}
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="w-12 h-12 rounded-full border border-paper/40 text-paper flex items-center justify-center hover:bg-paper/10 transition-colors"
                aria-label="Skip movement"
              >
                ▶▶
              </button>
              <span className="flex-1" />
              <button
                type="button"
                onClick={handleHurts}
                className="text-paper/60 text-xs underline-offset-4 underline hover:text-paper transition-colors"
              >
                this hurts
              </button>
            </div>
          </div>
        </>
      )}

      {/* TRANSITION */}
      {phase === "transition" && (
        <TransitionCard
          nextName={session.movements[movementIndex + 1]?.name ?? "Cooldown"}
          nextCue={session.movements[movementIndex + 1]?.cue}
          durationMs={TRANSITION_MS}
          onSkip={() => {
            const next = movementIndex + 1;
            if (next >= session.movements.length) {
              setPhase("done");
            } else {
              setMovementIndex(next);
              setSecondsRemaining(session.movements[next].durationSeconds);
              setPhase("movement");
            }
          }}
        />
      )}

      {/* DONE */}
      {phase === "done" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 bg-paper-warm">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: "url(/shapes/breath.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.2em] text-clay mb-3">
              Done
            </p>
            <h2 className="text-4xl font-semibold tracking-tight text-ink leading-tight">
              You&rsquo;re done.
            </h2>
            <p className="mt-3 text-sm text-ink-soft">
              One more thing - quick check-in.
            </p>
          </div>
        </div>
      )}

      {/* HURTS MODAL */}
      {phase === "hurts" && (
        <HurtsModal
          onContinue={handleHurtsContinue}
          onCancel={handleHurtsCancel}
        />
      )}
    </div>
  );
}

function TransitionCard({
  nextName,
  nextCue,
  durationMs,
  onSkip,
}: {
  nextName: string;
  nextCue?: string;
  durationMs: number;
  onSkip: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(durationMs / 1000));

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  // Visual countdown via SVG circle stroke
  const circumference = 2 * Math.PI * 36;
  const total = Math.ceil(durationMs / 1000);
  const progress = (total - secondsLeft) / total;
  const strokeOffset = circumference * (1 - progress);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 bg-paper-warm">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: "url(/shapes/balance.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative w-full max-w-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-3">
          Next
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-ink leading-tight">
          {nextName}
        </h2>
        {nextCue && (
          <p className="mt-3 text-sm text-ink-soft leading-relaxed max-w-xs mx-auto">
            {nextCue}
          </p>
        )}

        {/* Countdown ring */}
        <div className="mt-8 flex items-center justify-center">
          <div className="relative w-20 h-20">
            <svg
              viewBox="0 0 80 80"
              className="w-20 h-20 -rotate-90"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="#E6DFCF"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="#2D4F4A"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-semibold text-sage tabular-nums">
                {secondsLeft}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onSkip}
          className="mt-6 text-sm text-ink-soft underline-offset-4 underline hover:text-sage transition-colors"
        >
          Start now
        </button>
      </div>
    </div>
  );
}

function ProgressDots({
  total,
  active,
}: {
  total: number;
  active: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`block h-1 rounded-full transition-all ${
            i === active
              ? "w-6 bg-paper"
              : i < active
                ? "w-2 bg-paper/70"
                : "w-2 bg-paper/25"
          }`}
        />
      ))}
    </div>
  );
}

/**
 * Hurts modal - mirrors the quiz Q5 ("Where do you feel stiffness or pain?")
 * chip pattern. Multi-select chips, "None" toggle, sage-on-paper styling.
 *
 * Same vocabulary as the quiz so the user feels familiar.
 */
function HurtsModal({
  onContinue,
  onCancel,
}: {
  onContinue: (regions: string[]) => void;
  onCancel: () => void;
}) {
  const regions = [
    { value: "neck", label: "Neck" },
    { value: "shoulders", label: "Shoulders" },
    { value: "upper-back", label: "Upper back" },
    { value: "lower-back", label: "Lower back" },
    { value: "hips", label: "Hips" },
    { value: "knees", label: "Knees" },
    { value: "ankles", label: "Feet or ankles" },
    { value: "wrists", label: "Wrists or hands" },
  ];

  const [selected, setSelected] = useState<string[]>([]);

  function toggle(value: string) {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value],
    );
  }

  return (
    <div className="absolute inset-0 bg-ink/60 flex items-end">
      <div className="w-full bg-paper rounded-t-3xl p-6 pb-10 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs uppercase tracking-[0.2em] text-clay">Paused</p>
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-ink-soft underline-offset-4 hover:text-ink transition-colors"
          >
            Cancel
          </button>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          Where does it hurt?
        </h2>
        <p className="mt-2 text-sm text-ink-soft leading-relaxed">
          Select all that apply. We&rsquo;ll soften this movement around it.
        </p>

        {/* Chip pattern matches quiz Q5 */}
        <div className="mt-5 flex flex-wrap gap-2.5">
          {regions.map((opt) => {
            const isSel = selected.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggle(opt.value)}
                className={`px-4 py-2.5 rounded-2xl border text-sm font-medium transition-all ${
                  isSel
                    ? "border-sage bg-sage text-paper"
                    : "border-line bg-paper text-ink hover:border-sage/50 hover:bg-paper-warm/30"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onContinue(selected)}
          disabled={selected.length === 0}
          className="mt-7 w-full h-13 py-3.5 rounded-2xl bg-sage text-paper text-base font-medium hover:bg-sage-deep disabled:opacity-50 transition-colors"
        >
          Soften and continue
        </button>

        <p className="mt-4 text-xs text-ink-soft/70 text-center leading-relaxed">
          We&rsquo;ll log this for your check-in. No swap to a different video
          yet — Phase 2 will return a regression. For now: same movement, gentler cue.
        </p>
      </div>
    </div>
  );
}

function formatTime(s: number): string {
  if (s < 0) s = 0;
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${m}:${ss.toString().padStart(2, "0")}`;
}
