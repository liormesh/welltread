import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Welltread",
  description: "Your personalized 12-week movement plan.",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Authenticated app shell.
 *
 * For Phase 1 demo (pre-Stripe, pre-magic-link), the auth boundary is a stub.
 * Once the trial-flow ships (see /vault/trial-flow), this layout will:
 *   - check for a valid Supabase session via cookie/JWT
 *   - redirect unauthed users to /login (or quiz, depending on path)
 *   - hydrate user info into a context provider
 *
 * For now: just renders the app shell. Anyone can see the demo content.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <main className="flex-1 flex flex-col">{children}</main>
      <AppNav />
    </div>
  );
}

function AppNav() {
  return (
    <nav className="sticky bottom-0 left-0 right-0 z-30 bg-paper/95 backdrop-blur-sm border-t border-line/60 px-6 py-3 safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <NavItem href="/app/today" label="Today" />
        <NavItem href="/app/week" label="Week" />
        <NavItem href="/app/library" label="Library" muted />
        <NavItem href="/app/profile" label="Profile" />
      </div>
    </nav>
  );
}

function NavItem({
  href,
  label,
  muted,
}: {
  href: string;
  label: string;
  muted?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1.5 text-xs transition-colors ${
        muted ? "text-ink-soft/40" : "text-ink-soft hover:text-sage"
      }`}
    >
      <span className="block h-1 w-1 rounded-full bg-transparent" />
      {label}
    </Link>
  );
}
