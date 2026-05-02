"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Creative } from "@/app/vault/creatives/page";

type Status = "pending" | "approved" | "rejected";

type Decision = {
  status: Status;
  comment: string;
  updatedAt: string;
};

const STORAGE_KEY = "wt:vault:creatives:v1";

function loadDecisions(): Record<string, Decision> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveDecisions(d: Record<string, Decision>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
}

export function CreativesReview({ creatives }: { creatives: Creative[] }) {
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setDecisions(loadDecisions());
  }, []);

  function update(id: string, patch: Partial<Decision>) {
    const next = {
      ...decisions,
      [id]: {
        status: decisions[id]?.status ?? "pending",
        comment: decisions[id]?.comment ?? "",
        ...patch,
        updatedAt: new Date().toISOString(),
      },
    };
    setDecisions(next);
    saveDecisions(next);
  }

  function summary(): { approved: number; rejected: number; pending: number } {
    let approved = 0,
      rejected = 0,
      pending = 0;
    for (const c of creatives) {
      const s = decisions[c.id]?.status ?? "pending";
      if (s === "approved") approved++;
      else if (s === "rejected") rejected++;
      else pending++;
    }
    return { approved, rejected, pending };
  }

  if (!hydrated) {
    return (
      <p className="text-sm text-ink-soft">Loading review state...</p>
    );
  }

  const s = summary();

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-3 text-sm">
        <Pill label={`${s.approved} approved`} tone="sage" />
        <Pill label={`${s.rejected} rejected`} tone="clay" />
        <Pill label={`${s.pending} pending`} tone="ink" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {creatives.map((c) => {
          const d = decisions[c.id];
          const status = d?.status ?? "pending";
          const dims = aspectToBox(c.aspect);
          return (
            <article
              key={c.id}
              className={`rounded-3xl border p-5 transition-colors ${
                status === "approved"
                  ? "border-sage bg-sage/5"
                  : status === "rejected"
                    ? "border-clay bg-clay-soft/10"
                    : "border-line bg-paper"
              }`}
            >
              <div
                className="rounded-2xl overflow-hidden bg-paper-warm/30 mb-4"
                style={{ aspectRatio: dims.aspectRatio }}
              >
                <Image
                  src={c.src}
                  alt={c.title}
                  width={dims.w}
                  height={dims.h}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>

              <div className="flex items-baseline justify-between gap-3 mb-2">
                <h3 className="text-lg font-semibold text-ink">{c.title}</h3>
                <span className="text-xs uppercase tracking-wider text-ink-soft/70 shrink-0">
                  {c.source} · {c.aspect}
                </span>
              </div>

              <p className="text-sm text-ink-soft leading-relaxed mb-3">
                <strong className="text-ink">Intent:</strong> {c.intent}
              </p>

              <details className="text-xs text-ink-soft/80 mb-4">
                <summary className="cursor-pointer hover:text-sage transition-colors">
                  Show generation prompt
                </summary>
                <p className="mt-2 leading-relaxed bg-paper-warm/40 p-3 rounded-xl">
                  {c.prompt}
                </p>
              </details>

              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => update(c.id, { status: "approved" })}
                  className={`px-4 h-10 rounded-xl text-sm font-medium transition-colors ${
                    status === "approved"
                      ? "bg-sage text-paper"
                      : "border border-line bg-paper text-ink hover:border-sage hover:text-sage"
                  }`}
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => update(c.id, { status: "rejected" })}
                  className={`px-4 h-10 rounded-xl text-sm font-medium transition-colors ${
                    status === "rejected"
                      ? "bg-clay text-paper"
                      : "border border-line bg-paper text-ink hover:border-clay hover:text-clay"
                  }`}
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() =>
                    update(c.id, { status: "pending", comment: d?.comment ?? "" })
                  }
                  className="px-4 h-10 rounded-xl text-sm font-medium border border-line bg-paper text-ink-soft hover:text-ink transition-colors"
                >
                  Reset
                </button>
              </div>

              <textarea
                placeholder="Notes - what to push toward, what to avoid, iteration ideas..."
                value={d?.comment ?? ""}
                onChange={(e) =>
                  update(c.id, { comment: e.target.value, status })
                }
                rows={3}
                className="w-full px-4 py-3 rounded-2xl border border-line bg-paper-warm/30 text-ink text-sm placeholder:text-ink-soft/50 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition resize-y"
              />

              {d?.updatedAt && (
                <p className="mt-2 text-xs text-ink-soft/60">
                  Last updated {new Date(d.updatedAt).toLocaleString()}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function aspectToBox(a: Creative["aspect"]): {
  w: number;
  h: number;
  aspectRatio: string;
} {
  switch (a) {
    case "1:1": return { w: 800, h: 800, aspectRatio: "1 / 1" };
    case "4:5": return { w: 800, h: 1000, aspectRatio: "4 / 5" };
    case "16:9": return { w: 1280, h: 720, aspectRatio: "16 / 9" };
    case "9:16": return { w: 720, h: 1280, aspectRatio: "9 / 16" };
    case "3:2": return { w: 900, h: 600, aspectRatio: "3 / 2" };
    case "2:3": return { w: 600, h: 900, aspectRatio: "2 / 3" };
  }
}

function Pill({ label, tone }: { label: string; tone: "sage" | "clay" | "ink" }) {
  const cls =
    tone === "sage"
      ? "border-sage/40 bg-sage/5 text-sage"
      : tone === "clay"
        ? "border-clay/40 bg-clay-soft/10 text-clay"
        : "border-line bg-paper text-ink-soft";
  return (
    <span
      className={`inline-flex items-center px-3 h-7 rounded-full text-xs font-medium border ${cls}`}
    >
      {label}
    </span>
  );
}
