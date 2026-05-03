import Link from "next/link";
import { WelltreadLogo } from "./brand/WelltreadLogo";

export function Header() {
  return (
    <header className="border-b border-line/60 bg-paper/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-sage hover:text-sage-deep transition-colors"
        >
          <WelltreadLogo variant="full" symbolSize={22} />
        </Link>
        <nav className="hidden sm:flex items-center gap-8 text-sm text-ink-soft">
          <Link href="/seniors" className="hover:text-sage transition-colors">
            Seniors
          </Link>
          <Link href="/posture" className="hover:text-sage transition-colors">
            Posture &amp; Back
          </Link>
          <Link
            href="/#notify"
            className="text-sage font-medium hover:text-sage-deep transition-colors"
          >
            Get notified →
          </Link>
        </nav>
      </div>
    </header>
  );
}
