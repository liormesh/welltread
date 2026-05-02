import { Suspense } from "react";
import { VaultLoginForm } from "@/components/VaultLoginForm";

export const metadata = {
  title: "Vault - Welltread",
  description: "Internal vault. Authorized access only.",
  robots: { index: false, follow: false, nocache: true },
};

export default function VaultLogin() {
  return (
    <main className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
          Welltread Vault
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink leading-tight mb-2">
          Authorized access only.
        </h1>
        <p className="text-ink-soft mb-10 leading-relaxed">
          Operations, market intel, brand, system design, creative review.
        </p>
        <Suspense
          fallback={<p className="text-ink-soft text-sm">Loading...</p>}
        >
          <VaultLoginForm />
        </Suspense>
        <p className="mt-12 text-xs text-ink-soft/70">
          Not for public consumption. Not indexed.
        </p>
      </div>
    </main>
  );
}
