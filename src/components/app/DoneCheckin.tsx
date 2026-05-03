"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const FEEL_CHIPS = ["Too easy", "Just right", "Too hard", "Hurt me"];

export function DoneCheckin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sid = searchParams.get("sid") ?? "";

  const [body, setBody] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [feel, setFeel] = useState<string | null>("Just right");
  const [flag, setFlag] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/app/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sid,
          body,
          energy,
          feel,
          flag: flag.trim() || undefined,
        }),
      });
      if (!res.ok) {
        // Even if the API call fails, don't strand the user. Log + continue.
        console.error("[done] checkin failed", await res.text().catch(() => ""));
      }
    } catch (err) {
      console.error("[done] checkin failed", err);
    }
    router.push("/app/today");
  }

  return (
    <div className="flex-1 overflow-y-auto pb-32 max-w-md mx-auto w-full">
      <div className="px-6 pt-6">
        <p className="text-xs uppercase tracking-[0.2em] text-clay">Done</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
          Day complete.
        </h1>
        <p className="mt-3 text-sm text-ink-soft leading-relaxed">
          Two quick taps and you&rsquo;re out. We use these to shape tomorrow.
        </p>
      </div>

      <div className="px-6 mt-8 space-y-7">
        <SliderRow
          label="How does your body feel?"
          left="Tense"
          right="Easy"
          value={body}
          onChange={setBody}
        />
        <SliderRow
          label="Energy?"
          left="Drained"
          right="Steady"
          value={energy}
          onChange={setEnergy}
        />
      </div>

      <div className="px-6 mt-8">
        <p className="text-sm font-medium text-ink mb-3">How did this feel?</p>
        <div className="flex flex-wrap gap-2">
          {FEEL_CHIPS.map((label) => {
            const sel = feel === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setFeel(label)}
                className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                  sel
                    ? "border-sage bg-sage text-paper"
                    : "border-line bg-paper text-ink hover:border-sage/50"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <details className="px-6 mt-7 group">
        <summary className="text-sm text-sage underline-offset-4 hover:underline cursor-pointer list-none">
          Anything to flag? (optional)
        </summary>
        <textarea
          value={flag}
          onChange={(e) => setFlag(e.target.value)}
          rows={3}
          placeholder="Soreness? Confusion? A win?"
          className="mt-3 w-full px-4 py-3 rounded-2xl border border-line bg-paper-warm/30 text-ink text-sm placeholder:text-ink-soft/50 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition resize-y"
        />
      </details>

      <div className="px-6 mt-8">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || !feel}
          className="w-full h-13 py-3.5 rounded-2xl bg-sage text-paper text-base font-medium hover:bg-sage-deep disabled:opacity-50 transition-colors"
        >
          {submitting ? "Saving..." : "Save and finish"}
        </button>
        {sid && (
          <p className="mt-3 text-xs text-ink-soft/60 text-center">
            Session: {sid}
          </p>
        )}
      </div>
    </div>
  );
}

function SliderRow({
  label,
  left,
  right,
  value,
  onChange,
}: {
  label: string;
  left: string;
  right: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const min = 1;
  const max = 5;

  return (
    <div>
      <p className="text-sm font-medium text-ink mb-4">{label}</p>

      {/* Header row: left label + value with +/- buttons + right label */}
      <div className="flex items-baseline justify-between text-sm text-ink-soft">
        <span>{left}</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChange(Math.max(min, value - 1))}
            disabled={value <= min}
            aria-label="Decrease"
            className="w-9 h-9 rounded-full border border-line bg-paper text-ink hover:border-sage hover:text-sage disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-lg leading-none"
          >
            −
          </button>
          <span className="text-3xl font-semibold text-sage tabular-nums w-8 text-center">
            {value}
          </span>
          <button
            type="button"
            onClick={() => onChange(Math.min(max, value + 1))}
            disabled={value >= max}
            aria-label="Increase"
            className="w-9 h-9 rounded-full border border-line bg-paper text-ink hover:border-sage hover:text-sage disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-lg leading-none"
          >
            +
          </button>
        </div>
        <span>{right}</span>
      </div>

      {/* Range slider */}
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-4 w-full accent-sage h-2"
      />

      {/* Tick marks */}
      <div className="mt-1 flex justify-between text-xs text-ink-soft/60">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>
    </div>
  );
}
