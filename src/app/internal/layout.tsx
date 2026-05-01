import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Welltread — Internal",
  description: "Internal design + architecture references. Not for public consumption.",
  robots: { index: false, follow: false, nocache: true },
};

export default function InternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-line/60 bg-paper/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sage font-semibold">
              welltread
            </Link>
            <span className="text-ink-soft/60">·</span>
            <span className="text-ink-soft">internal</span>
          </div>
          <nav className="flex items-center gap-6 text-ink-soft">
            <Link href="/internal/brand" className="hover:text-sage transition-colors">
              Brand
            </Link>
            <Link href="/internal/architecture" className="hover:text-sage transition-colors">
              Architecture
            </Link>
            <Link href="/internal/data-model" className="hover:text-sage transition-colors">
              Data model
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-line/60 mt-24">
        <div className="mx-auto max-w-7xl px-6 py-8 text-xs text-ink-soft/70">
          Internal reference. Not indexed. Not linked from public site.
        </div>
      </footer>
    </>
  );
}
