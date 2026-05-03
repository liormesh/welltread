"use client";

import Image from "next/image";
import type { Question, AnswerValue } from "@/lib/quiz/definition";
import { BodyMap } from "@/components/quiz/BodyMap";

type Props = {
  question: Question;
  value: AnswerValue | undefined;
  onSingle: (value: string) => void;
  onMulti: (value: string[]) => void;
  onSlider: (value: number) => void;
  onText: (value: string) => void;
  onContinue: () => void;
};

export function QuestionRenderer({
  question,
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
          {question.prompt}
        </h2>
        {question.helper && (
          <p className="mt-3 text-ink-soft leading-relaxed">{question.helper}</p>
        )}
      </div>

      {v.kind === "icon-chips" && (
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

      {v.kind === "body-map" && (
        <BodyMap
          options={question.options ?? []}
          value={(value as string[]) ?? []}
          onChange={onMulti}
        />
      )}

      {v.kind === "slider-1-10" && (
        <Slider1to10
          left={v.left}
          right={v.right}
          value={typeof value === "number" ? value : 5}
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

      {/* Continue button - only for types that don't auto-advance on selection */}
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
            className={`group rounded-2xl overflow-hidden border-2 transition-all ${
              selected
                ? "border-sage shadow-md"
                : "border-transparent hover:border-sage/40"
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
                selected ? "bg-sage text-paper" : "bg-paper text-ink"
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
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map((c) => {
        const selected = value === c.value;
        return (
          <button
            key={c.value}
            type="button"
            onClick={() => onSingle(c.value)}
            className={`rounded-2xl border-2 p-5 flex flex-col items-center gap-3 transition-all ${
              selected
                ? "border-sage bg-sage/5"
                : "border-line bg-paper hover:border-sage/40"
            }`}
          >
            <ActivityIcon
              name={c.icon}
              className={selected ? "text-sage" : "text-ink-soft"}
            />
            <span
              className={`text-sm font-medium text-center ${
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

function ActivityIcon({ name, className }: { name: string; className?: string }) {
  const stroke = "currentColor";
  switch (name) {
    case "chair":
      return (
        <svg viewBox="0 0 48 48" className={`w-12 h-12 ${className}`} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 14v18h20V14" />
          <path d="M14 32v10M34 32v10" />
          <path d="M14 24h20" />
        </svg>
      );
    case "walk":
      return (
        <svg viewBox="0 0 48 48" className={`w-12 h-12 ${className}`} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="28" cy="10" r="3" />
          <path d="M26 14l-4 8 4 6v10" />
          <path d="M22 22l-6 4M30 28l4 6 6-2" />
        </svg>
      );
    case "run":
      return (
        <svg viewBox="0 0 48 48" className={`w-12 h-12 ${className}`} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="30" cy="9" r="3" />
          <path d="M28 14l-6 6 6 6 4 8" />
          <path d="M22 20l-8 2M26 26l8 2" />
        </svg>
      );
    case "mountain":
      return (
        <svg viewBox="0 0 48 48" className={`w-12 h-12 ${className}`} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 38l12-20 8 12 6-8 14 16z" />
          <path d="M16 18l-2-3" />
        </svg>
      );
    default:
      return null;
  }
}

function Slider1to10({
  left,
  right,
  value,
  onChange,
}: {
  left: string;
  right: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between text-sm text-ink-soft">
        <span>{left}</span>
        <span className="text-3xl font-semibold text-sage">{value}</span>
        <span>{right}</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={value}
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
  // 4-point forced choice: 1, 2, 3, 4 (no neutral)
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
          { v: 1, label: "Strongly\nagree", side: "left" },
          { v: 2, label: "Slightly\nagree", side: "left" },
          { v: 3, label: "Slightly\nagree", side: "right" },
          { v: 4, label: "Strongly\nagree", side: "right" },
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
        No neutral. Pick the side that's slightly more you.
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
          className={`px-5 py-6 rounded-2xl border-2 text-lg font-medium transition-all ${
            value === opt.v
              ? "border-sage bg-sage/5 text-sage"
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
      className={`w-full flex items-center gap-4 p-6 rounded-2xl border-2 text-left transition-all ${
        checked
          ? "border-sage bg-sage/5"
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
