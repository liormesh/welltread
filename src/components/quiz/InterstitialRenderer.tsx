"use client";

import Image from "next/image";
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
      const t = setTimeout(onDone, 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep(step + 1), 1300);
    return () => clearTimeout(t);
  }, [step, messages.length, onDone]);

  const progress = Math.min(100, ((step + 1) / messages.length) * 100);

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="mx-auto w-32 h-32 mb-8 relative">
          <Image
            src="/shapes/breath.png"
            alt=""
            fill
            unoptimized
            className="object-contain animate-pulse"
          />
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
