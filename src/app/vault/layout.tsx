import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Welltread — Vault",
  description: "Internal vault. Authorized access only.",
  robots: { index: false, follow: false, nocache: true },
};

export default function VaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-line/60 bg-paper/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <Link href="/vault" className="text-sage font-semibold">
              welltread
            </Link>
            <span className="text-ink-soft/60">·</span>
            <span className="text-ink-soft">vault</span>
          </div>
          <nav className="hidden md:flex items-center gap-5 text-ink-soft text-xs">
            <Link href="/vault/investor" className="hover:text-sage transition-colors">
              Investor
            </Link>
            <Link href="/vault/market" className="hover:text-sage transition-colors">
              Market
            </Link>
            <Link href="/vault/competitors" className="hover:text-sage transition-colors">
              Competitors
            </Link>
            <Link href="/vault/strategy" className="hover:text-sage transition-colors">
              Strategy
            </Link>
            <Link href="/vault/quiz-flow" className="hover:text-sage transition-colors">
              Quiz flow
            </Link>
            <Link href="/vault/trial-flow" className="hover:text-sage transition-colors">
              Trial flow
            </Link>
            <Link href="/vault/product-framework" className="hover:text-sage transition-colors">
              Product
            </Link>
            <Link href="/vault/product-scope" className="hover:text-sage transition-colors">
              Scope
            </Link>
            <Link href="/vault/email-sequences" className="hover:text-sage transition-colors">
              Emails
            </Link>
            <Link href="/vault/ui-rules" className="hover:text-sage transition-colors">
              UI rules
            </Link>
            <Link href="/vault/brand" className="hover:text-sage transition-colors">
              Brand
            </Link>
            <Link href="/vault/architecture" className="hover:text-sage transition-colors">
              System
            </Link>
            <Link href="/vault/data-model" className="hover:text-sage transition-colors">
              Data
            </Link>
            <Link href="/vault/creatives" className="hover:text-sage transition-colors">
              Creatives
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-line/60 mt-24">
        <div className="mx-auto max-w-7xl px-6 py-8 text-xs text-ink-soft/70 flex items-center justify-between">
          <span>Internal vault. Not indexed. Not linked from public site.</span>
          <form action="/api/vault/logout" method="post">
            <button
              type="submit"
              className="text-ink-soft/70 hover:text-sage transition-colors"
            >
              Log out
            </button>
          </form>
        </div>
      </footer>
    </>
  );
}
