import Link from "next/link";
import { WelltreadLogo } from "./brand/WelltreadLogo";

export function Footer() {
  return (
    <footer className="border-t border-line/60 mt-24">
      <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col gap-6 text-sm text-ink-soft sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-2">
            <WelltreadLogo variant="full" symbolSize={18} className="text-sage font-semibold" />
            <span>- every step considered.</span>
          </p>
          <p className="text-ink-soft/70">
            &copy; {new Date().getFullYear()} Welltread, Inc. Built to last.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-soft/80">
          <Link href="/privacy" className="hover:text-sage transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-sage transition-colors">
            Terms
          </Link>
          <Link href="/health-disclaimer" className="hover:text-sage transition-colors">
            Health Disclaimer
          </Link>
          <a href="mailto:hello@welltread.co" className="hover:text-sage transition-colors">
            hello@welltread.co
          </a>
        </nav>
      </div>
    </footer>
  );
}
