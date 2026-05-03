"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { Question, AnswerValue } from "@/lib/quiz/definition";

type Props = {
  question: Question;
  promptText: string;
  value: AnswerValue | undefined;
  onSingle: (value: string) => void;
  onMulti: (value: string[]) => void;
  onSlider: (value: number) => void;
  onText: (value: string) => void;
  onContinue: () => void;
};

export function QuestionRenderer({
  question,
  promptText,
  value,
  onSingle,
  onMulti,
  onSlider,
  onText,
  onContinue,
}: Props) {
  const v = question.visual;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink leading-tight">
          {promptText}
        </h2>
        {question.helper && (
          <p className="mt-3 text-ink-soft leading-relaxed">{question.helper}</p>
        )}
      </div>

      {v.kind === "chips" && (
        <ChipsRender
          options={question.options ?? []}
          isMulti={question.type === "multi"}
          value={value}
          onSingle={onSingle}
          onMulti={onMulti}
        />
      )}

      {v.kind === "single-radio" && (
        <RadioRender
          options={question.options ?? []}
          value={value as string | undefined}
          onSingle={onSingle}
        />
      )}

      {v.kind === "photo-cards" && (
        <PhotoCards
          cards={v.cards}
          value={value as string | undefined}
          onSingle={onSingle}
        />
      )}

      {v.kind === "icon-cards" && (
        <IconCards
          cards={v.cards}
          value={value as string | undefined}
          onSingle={onSingle}
        />
      )}

      {v.kind === "slider-1-10" && (
        <Slider1to10
          left={v.left}
          right={v.right}
          value={typeof value === "number" ? value : null}
          onChange={onSlider}
        />
      )}

      {v.kind === "statement-slider" && (
        <StatementSlider
          left={v.left}
          right={v.right}
          value={typeof value === "number" ? value : null}
          onChange={onSlider}
        />
      )}

      {v.kind === "freetext-with-chips" && (
        <FreetextWithChips
          chips={v.chips}
          placeholder={v.placeholder}
          value={typeof value === "string" ? value : ""}
          onChange={onText}
        />
      )}

      {v.kind === "yes-no" && (
        <YesNo
          value={value as string | undefined}
          onSingle={onSingle}
        />
      )}

      {v.kind === "checkbox" && (
        <CheckboxRender
          label={v.label}
          checked={value === "yes"}
          onChange={(checked) => onSingle(checked ? "yes" : "")}
        />
      )}

      {v.kind === "email" && (
        <EmailInput
          value={typeof value === "string" ? value : ""}
          onChange={onText}
        />
      )}

      {needsContinue(question) && (
        <button
          type="button"
          onClick={onContinue}
          disabled={!isReady(question, value)}
          className="w-full h-14 rounded-2xl bg-sage text-paper font-medium hover:bg-sage-deep disabled:opacity-50 transition-colors"
        >
          Continue
        </button>
      )}
    </div>
  );
}

function needsContinue(q: Question): boolean {
  return (
    q.type === "multi" ||
    q.type === "slider" ||
    q.type === "statement" ||
    q.type === "freetext" ||
    q.type === "checkbox" ||
    q.type === "email"
  );
}

function isReady(q: Question, value: AnswerValue | undefined): boolean {
  if (q.type === "multi") return Array.isArray(value) && value.length > 0;
  if (q.type === "slider") return typeof value === "number";
  if (q.type === "statement") return typeof value === "number";
  if (q.type === "freetext") return typeof value === "string" && value.trim().length > 0;
  if (q.type === "checkbox") return value === "yes";
  if (q.type === "email") {
    return typeof value === "string" && value.includes("@") && value.length > 4;
  }
  return true;
}

/* -------------------- PRIMITIVES -------------------- */

function ChipsRender({
  options,
  isMulti,
  value,
  onSingle,
  onMulti,
}: {
  options: { value: string; label: string }[];
  isMulti: boolean;
  value: AnswerValue | undefined;
  onSingle: (v: string) => void;
  onMulti: (v: string[]) => void;
}) {
  const selected = isMulti
    ? ((value as string[]) ?? [])
    : value
      ? [value as string]
      : [];

  function toggle(v: string) {
    if (isMulti) {
      if (v === "none") {
        onMulti(selected.includes("none") ? [] : ["none"]);
        return;
      }
      const without = selected.filter((s) => s !== "none");
      onMulti(
        without.includes(v) ? without.filter((s) => s !== v) : [...without, v],
      );
    } else {
      onSingle(v);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={`px-5 py-3 rounded-2xl border text-base font-medium transition-all ${
              isSelected
                ? "border-sage bg-sage text-paper"
                : "border-line bg-paper text-ink hover:border-sage/50 hover:bg-paper-warm/30"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function RadioRender({
  options,
  value,
  onSingle,
}: {
  options: { value: string; label: string }[];
  value: string | undefined;
  onSingle: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSingle(opt.value)}
            className={`w-full text-left px-5 py-4 rounded-2xl border transition-all ${
              selected
                ? "border-sage bg-sage/5 text-ink"
                : "border-line bg-paper hover:border-sage/40 hover:bg-paper-warm/30 text-ink"
            }`}
          >
            <span className="font-medium">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function PhotoCards({
  cards,
  value,
  onSingle,
}: {
  cards: { value: string; label: string; image: string }[];
  value: string | undefined;
  onSingle: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map((c) => {
        const selected = value === c.value;
        return (
          <button
            key={c.value}
            type="button"
            onClick={() => onSingle(c.value)}
            className={`group rounded-2xl overflow-hidden border transition-all ${
              selected
                ? "border-sage bg-sage/5 ring-2 ring-sage/20"
                : "border-line bg-paper hover:border-sage/40 hover:bg-paper-warm/30"
            }`}
          >
            <div className="aspect-[4/5] bg-paper-warm/30 overflow-hidden">
              <Image
                src={c.image}
                alt={c.label}
                width={400}
                height={500}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <div
              className={`px-3 py-3 text-sm font-medium text-center ${
                selected ? "text-sage" : "text-ink"
              }`}
            >
              {c.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function IconCards({
  cards,
  value,
  onSingle,
}: {
  cards: { value: string; label: string; icon: string }[];
  value: string | undefined;
  onSingle: (v: string) => void;
}) {
  // Each card represents an intensity level 1..N (left to right).
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map((c, idx) => {
        const selected = value === c.value;
        const intensity = idx + 1; // 1, 2, 3, 4
        return (
          <button
            key={c.value}
            type="button"
            onClick={() => onSingle(c.value)}
            className={`rounded-2xl border py-7 px-4 flex flex-col items-center gap-5 transition-all ${
              selected
                ? "border-sage bg-sage/5 ring-2 ring-sage/20"
                : "border-line bg-paper hover:border-sage/40 hover:bg-paper-warm/30"
            }`}
          >
            <IntensityMeter level={intensity} selected={selected} />
            <span
              className={`text-sm font-medium text-center leading-tight ${
                selected ? "text-sage" : "text-ink"
              }`}
            >
              {c.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function IntensityMeter({
  level,
  selected,
}: {
  level: number;
  selected: boolean;
}) {
  // 4 bars, progressively taller. Filled bars use sage; unfilled use line.
  return (
    <div className="flex items-end gap-1.5 h-12">
      {[1, 2, 3, 4].map((n) => {
        const filled = n <= level;
        const heightClass =
          n === 1
            ? "h-3"
            : n === 2
              ? "h-6"
              : n === 3
                ? "h-9"
                : "h-12";
        return (
          <span
            key={n}
            className={`w-2.5 rounded-sm transition-colors ${heightClass} ${
              filled ? (selected ? "bg-sage" : "bg-sage/70") : "bg-line"
            }`}
          />
        );
      })}
    </div>
  );
}

function Slider1to10({
  left,
  right,
  value,
  onChange,
}: {
  left: string;
  right: string;
  value: number | null;
  onChange: (v: number) => void;
}) {
  // Auto-set default of 5 on mount so user can confirm-by-clicking-Continue
  useEffect(() => {
    if (value === null) onChange(5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const v = value ?? 5;

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between text-sm text-ink-soft">
        <span>{left}</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChange(Math.max(1, v - 1))}
            disabled={v <= 1}
            aria-label="Decrease"
            className="w-9 h-9 rounded-full border border-line bg-paper text-ink hover:border-sage hover:text-sage disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-lg leading-none"
          >
            −
          </button>
          <span className="text-3xl font-semibold text-sage tabular-nums w-8 text-center">
            {v}
          </span>
          <button
            type="button"
            onClick={() => onChange(Math.min(10, v + 1))}
            disabled={v >= 10}
            aria-label="Increase"
            className="w-9 h-9 rounded-full border border-line bg-paper text-ink hover:border-sage hover:text-sage disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-lg leading-none"
          >
            +
          </button>
        </div>
        <span>{right}</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={v}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-sage h-2"
      />
      <div className="flex justify-between text-xs text-ink-soft/60">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>
    </div>
  );
}

function StatementSlider({
  left,
  right,
  value,
  onChange,
}: {
  left: string;
  right: string;
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-line bg-paper-warm/30 p-5 text-ink">
          {left}
        </div>
        <div className="rounded-2xl border border-line bg-paper-warm/30 p-5 text-ink">
          {right}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[
          { v: 1, label: "Strongly\nagree" },
          { v: 2, label: "Slightly\nagree" },
          { v: 3, label: "Slightly\nagree" },
          { v: 4, label: "Strongly\nagree" },
        ].map((opt) => {
          const selected = value === opt.v;
          return (
            <button
              key={opt.v}
              type="button"
              onClick={() => onChange(opt.v)}
              className={`px-2 py-3 rounded-xl border text-xs whitespace-pre-line transition-all ${
                selected
                  ? "border-sage bg-sage text-paper"
                  : "border-line bg-paper text-ink-soft hover:border-sage/50"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-ink-soft/70 text-center">
        No neutral. Pick the side that&rsquo;s slightly more you.
      </p>
    </div>
  );
}

function FreetextWithChips({
  chips,
  placeholder,
  value,
  onChange,
}: {
  chips: { value: string; label: string }[];
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-5 h-14 rounded-2xl border border-line bg-paper-warm/30 text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition"
      />
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-3">
          Or pick one of these
        </p>
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => onChange(c.value)}
              className={`px-4 py-2 rounded-full border text-sm transition-all ${
                value === c.value
                  ? "border-sage bg-sage text-paper"
                  : "border-line bg-paper text-ink-soft hover:border-sage/50 hover:text-ink"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function YesNo({
  value,
  onSingle,
}: {
  value: string | undefined;
  onSingle: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { v: "yes", label: "Yes" },
        { v: "no", label: "No" },
      ].map((opt) => (
        <button
          key={opt.v}
          type="button"
          onClick={() => onSingle(opt.v)}
          className={`px-5 py-6 rounded-2xl border text-lg font-medium transition-all ${
            value === opt.v
              ? "border-sage bg-sage/5 text-sage ring-2 ring-sage/20"
              : "border-line bg-paper text-ink hover:border-sage/50"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function CheckboxRender({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-full flex items-center gap-4 p-6 rounded-2xl border text-left transition-all ${
        checked
          ? "border-sage bg-sage/5 ring-2 ring-sage/20"
          : "border-line bg-paper hover:border-sage/40"
      }`}
    >
      <span
        className={`shrink-0 w-7 h-7 rounded-md border-2 flex items-center justify-center transition-all ${
          checked
            ? "border-sage bg-sage"
            : "border-line bg-paper"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 16 16" className="w-4 h-4 text-paper" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8l4 4 6-8" />
          </svg>
        )}
      </span>
      <span className="text-lg font-medium text-ink">{label}</span>
    </button>
  );
}

function EmailInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="email"
      autoFocus
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="you@example.com"
      className="w-full px-5 h-16 rounded-2xl border border-line bg-paper-warm/30 text-ink text-lg placeholder:text-ink-soft/50 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition"
    />
  );
}
