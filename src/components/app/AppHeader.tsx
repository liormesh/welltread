/**
 * Reused header for /app/* screens.
 *
 * Centered uppercase title; sage wordmark on left; soft "more" target on right
 * (will become a settings/notification dropdown post-Phase-1).
 */

export function AppHeader({
  title,
  subdued,
}: {
  title: string;
  subdued?: boolean;
}) {
  return (
    <header className="sticky top-0 z-20 px-6 py-3 flex items-center justify-between border-b border-line/60 bg-paper/85 backdrop-blur-sm">
      <span
        className={`text-sm font-semibold ${
          subdued ? "text-ink-soft/70" : "text-sage"
        }`}
      >
        welltread
      </span>
      <span className="text-xs uppercase tracking-[0.2em] text-ink-soft/70">
        {title}
      </span>
      <span className="text-ink-soft/40 text-lg leading-none">⋯</span>
    </header>
  );
}
