"use client";

import { useEffect, useState } from "react";
import type { Interstitial, InterstitialContent } from "@/lib/quiz/definition";

type Props = {
  slot: Interstitial;
  content: InterstitialContent;
  onContinue: () => void;
};

export function InterstitialRenderer({ slot, content, onContinue }: Props) {
  if (slot.type === "loader") {
    return <LoaderScreen content={content} onDone={onContinue} />;
  }

  return (
    <div className="space-y-8">
      <div
        className="rounded-3xl border border-line p-6 sm:p-10 relative overflow-hidden"
        style={{
          backgroundImage: content.shape ? `url(/shapes/${content.shape}.png)` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-paper/75 backdrop-blur-[2px]" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
            {labelFor(slot.type)}
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink leading-tight">
            {content.headline}
          </h2>
          <p className="mt-5 text-lg text-ink-soft leading-relaxed max-w-2xl">
            {content.body}
          </p>
          {content.cite && (
            <p className="mt-4 text-xs text-ink-soft/70">{content.cite}</p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="w-full h-14 rounded-2xl bg-sage text-paper font-medium hover:bg-sage-deep transition-colors"
      >
        Continue
      </button>
    </div>
  );
}

function labelFor(t: Interstitial["type"]): string {
  switch (t) {
    case "stat": return "Did you know";
    case "reassurance": return "Just so you know";
    case "educational": return "Why we ask";
    case "pt-insight": return "PT note";
    case "testimonial": return "From a member";
    case "how-different": return "What sets us apart";
    case "loader": return "Building your plan";
  }
}

/**
 * Cinematic loader - animated breath rings + rotating copy.
 * Auto-advances when copy completes.
 */
function LoaderScreen({
  content,
  onDone,
}: {
  content: InterstitialContent;
  onDone: () => void;
}) {
  const messages = content.body.split(". ").filter(Boolean);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= messages.length) {
      const t = setTimeout(onDone, 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep(step + 1), 1500);
    return () => clearTimeout(t);
  }, [step, messages.length, onDone]);

  const progress = Math.min(100, ((step + 1) / messages.length) * 100);

  return (
    <div className="min-h-[460px] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-10">
          <BreathPulse />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink mb-6">
          {content.headline}
        </h2>
        <div className="space-y-2 min-h-[80px]">
          {messages.slice(0, step + 1).map((m, i) => (
            <p
              key={i}
              className={`text-sm transition-opacity duration-500 ${
                i === step ? "text-sage" : "text-ink-soft/70"
              }`}
            >
              {m.endsWith(".") ? m : `${m}.`}
            </p>
          ))}
        </div>
        <div className="mt-10 max-w-xs mx-auto">
          <div className="h-1 w-full bg-line/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-sage transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Animated breath SVG - concentric rings expanding outward, looping.
 * Transparent background. Pure CSS animation via SVG SMIL.
 */
function BreathPulse() {
  return (
    <svg
      viewBox="0 0 160 160"
      className="w-32 h-32 sm:w-40 sm:h-40"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Breath cycle animation"
    >
      {/* Inner solid dot */}
      <circle cx="80" cy="80" r="4" fill="#2D4F4A" opacity="0.9">
        <animate
          attributeName="r"
          values="3;5;3"
          dur="4s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
          keyTimes="0; 0.5; 1"
        />
      </circle>

      {/* Ring 1 */}
      <circle
        cx="80"
        cy="80"
        r="20"
        fill="none"
        stroke="#2D4F4A"
        strokeWidth="1.2"
        opacity="0.7"
      >
        <animate
          attributeName="r"
          values="14;26;14"
          dur="4s"
          begin="0s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
          keyTimes="0; 0.5; 1"
        />
        <animate
          attributeName="opacity"
          values="0.85;0.55;0.85"
          dur="4s"
          repeatCount="indefinite"
          keyTimes="0; 0.5; 1"
        />
      </circle>

      {/* Ring 2 */}
      <circle
        cx="80"
        cy="80"
        r="36"
        fill="none"
        stroke="#2D4F4A"
        strokeWidth="1.0"
        opacity="0.5"
      >
        <animate
          attributeName="r"
          values="28;46;28"
          dur="4s"
          begin="0s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
          keyTimes="0; 0.5; 1"
        />
        <animate
          attributeName="opacity"
          values="0.6;0.3;0.6"
          dur="4s"
          repeatCount="indefinite"
          keyTimes="0; 0.5; 1"
        />
      </circle>

      {/* Ring 3 */}
      <circle
        cx="80"
        cy="80"
        r="54"
        fill="none"
        stroke="#2D4F4A"
        strokeWidth="0.8"
        opacity="0.3"
        strokeDasharray="2 4"
      >
        <animate
          attributeName="r"
          values="44;66;44"
          dur="4s"
          begin="0s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
          keyTimes="0; 0.5; 1"
        />
        <animate
          attributeName="opacity"
          values="0.4;0.15;0.4"
          dur="4s"
          repeatCount="indefinite"
          keyTimes="0; 0.5; 1"
        />
      </circle>

      {/* Ring 4 - clay accent */}
      <circle
        cx="80"
        cy="80"
        r="72"
        fill="none"
        stroke="#C18C5D"
        strokeWidth="0.6"
        opacity="0.25"
        strokeDasharray="1 5"
      >
        <animate
          attributeName="r"
          values="60;78;60"
          dur="4s"
          begin="0s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
          keyTimes="0; 0.5; 1"
        />
        <animate
          attributeName="opacity"
          values="0.3;0.08;0.3"
          dur="4s"
          repeatCount="indefinite"
          keyTimes="0; 0.5; 1"
        />
      </circle>
    </svg>
  );
}
