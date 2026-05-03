"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@/lib/app/sample-plan";

type Phase = "preroll" | "movement" | "transition" | "done" | "hurts";

const PREROLL_MS = 3000;
const TRANSITION_MS = 2000;

export function SessionPlayer({ session }: { session: Session }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("preroll");
  const [movementIndex, setMovementIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    session.movements[0]?.durationSeconds ?? 0,
  );
  const [paused, setPaused] = useState(false);
  const [hurtsRegion, setHurtsRegion] = useState<string | null>(null);
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

  // Done auto-advance to /app/done
  useEffect(() => {
    if (phase !== "done") return;
    const t = setTimeout(() => {
      router.push(`/app/done?sid=${session.id}`);
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

  function handleHurts() {
    setPaused(true);
    setPhase("hurts");
  }

  function handleHurtsContinue() {
    setHurtsRegion(null);
    setPaused(false);
    setPhase("movement");
  }

  function handleHurtsCancel() {
    setHurtsRegion(null);
    setPaused(false);
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
              {movement.cue}
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
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 bg-paper-warm">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: "url(/shapes/balance.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.2em] text-clay mb-3">
              Next
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-ink leading-tight">
              {session.movements[movementIndex + 1]?.name ?? "Cooldown"}
            </h2>
          </div>
        </div>
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
          selected={hurtsRegion}
          onSelect={setHurtsRegion}
          onContinue={handleHurtsContinue}
          onCancel={handleHurtsCancel}
        />
      )}
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

function HurtsModal({
  selected,
  onSelect,
  onContinue,
  onCancel,
}: {
  selected: string | null;
  onSelect: (region: string) => void;
  onContinue: () => void;
  onCancel: () => void;
}) {
  const regions = [
    "Lower back",
    "Knees",
    "Hips",
    "Shoulders",
    "Neck",
    "Wrists",
    "Other",
  ];
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
        <p className="mt-2 text-sm text-ink-soft">
          We&rsquo;ll swap to a gentler version. No skip needed.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {regions.map((label) => {
            const isSel = selected === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => onSelect(label)}
                className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                  isSel
                    ? "border-sage bg-sage text-paper"
                    : "border-line bg-paper text-ink hover:border-sage/50"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onContinue}
          disabled={!selected}
          className="mt-7 w-full h-13 py-3.5 rounded-2xl bg-sage text-paper text-base font-medium hover:bg-sage-deep disabled:opacity-50 transition-colors"
        >
          Swap and continue
        </button>
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
