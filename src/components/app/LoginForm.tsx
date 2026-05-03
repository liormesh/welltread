"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Mode = "password" | "magic";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/app/today";

  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);

  async function handlePassword(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setError(error.message);
        setSubmitting(false);
        return;
      }
      router.push(redirect);
      router.refresh();
    } catch {
      setError("Sign-in failed. Please try again.");
      setSubmitting(false);
    }
  }

  async function handleMagicLink(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${origin}/app/auth/callback?redirect=${encodeURIComponent(redirect)}`,
          shouldCreateUser: false,
        },
      });
      if (error) {
        setError(error.message);
        setSubmitting(false);
        return;
      }
      setMagicSent(true);
      setSubmitting(false);
    } catch {
      setError("Couldn't send the magic link. Please try again.");
      setSubmitting(false);
    }
  }

  if (magicSent) {
    return (
      <div className="rounded-2xl border border-sage/40 bg-sage/5 p-5">
        <p className="text-sm font-medium text-sage mb-2">Check your email.</p>
        <p className="text-sm text-ink-soft leading-relaxed">
          We sent a sign-in link to <strong>{email}</strong>. Click it on this
          device and you&rsquo;ll land on your plan.
        </p>
        <button
          type="button"
          onClick={() => {
            setMagicSent(false);
            setMode("password");
          }}
          className="mt-4 text-sm text-sage underline-offset-4 hover:underline"
        >
          Use password instead
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex border border-line rounded-xl overflow-hidden text-sm">
        <button
          type="button"
          onClick={() => {
            setMode("password");
            setError(null);
          }}
          className={`flex-1 py-2 transition-colors ${
            mode === "password"
              ? "bg-sage text-paper font-medium"
              : "bg-paper text-ink-soft hover:bg-paper-warm/30"
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("magic");
            setError(null);
          }}
          className={`flex-1 py-2 transition-colors ${
            mode === "magic"
              ? "bg-sage text-paper font-medium"
              : "bg-paper text-ink-soft hover:bg-paper-warm/30"
          }`}
        >
          Magic link
        </button>
      </div>

      {mode === "password" && (
        <form onSubmit={handlePassword} className="space-y-4">
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 h-13 py-3.5 rounded-2xl border border-line bg-paper-warm/30 text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition"
          />
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 h-13 py-3.5 rounded-2xl border border-line bg-paper-warm/30 text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition"
          />
          {error && <p className="text-sm text-clay">{error}</p>}
          <button
            type="submit"
            disabled={submitting || !email || !password}
            className="w-full h-13 py-3.5 rounded-2xl bg-sage text-paper font-medium hover:bg-sage-deep disabled:opacity-50 transition-colors"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      )}

      {mode === "magic" && (
        <form onSubmit={handleMagicLink} className="space-y-4">
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 h-13 py-3.5 rounded-2xl border border-line bg-paper-warm/30 text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition"
          />
          <p className="text-xs text-ink-soft leading-relaxed">
            We&rsquo;ll email you a one-click sign-in link. No password needed.
          </p>
          {error && <p className="text-sm text-clay">{error}</p>}
          <button
            type="submit"
            disabled={submitting || !email}
            className="w-full h-13 py-3.5 rounded-2xl bg-sage text-paper font-medium hover:bg-sage-deep disabled:opacity-50 transition-colors"
          >
            {submitting ? "Sending..." : "Email me a link"}
          </button>
        </form>
      )}
    </div>
  );
}
