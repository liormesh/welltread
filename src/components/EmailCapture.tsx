"use client";

import { useState, FormEvent } from "react";

type Props = {
  source: string;
  ctaLabel?: string;
  className?: string;
};

export function EmailCapture({
  source,
  ctaLabel = "Notify me",
  className = "",
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">(
    "idle",
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("err");
    }
  }

  if (status === "ok") {
    return (
      <div
        className={`rounded-2xl border border-sage/20 bg-sage/5 px-5 py-4 text-sage text-sm ${className}`}
      >
        You&rsquo;re on the list. We&rsquo;ll be in touch when your program
        opens up.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col sm:flex-row gap-2 ${className}`}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="flex-1 px-4 h-12 rounded-2xl border border-line bg-paper-warm/30 text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-6 h-12 rounded-2xl bg-sage text-paper font-medium hover:bg-sage-deep disabled:opacity-60 transition-colors"
      >
        {status === "loading" ? "..." : ctaLabel}
      </button>
    </form>
  );
}
