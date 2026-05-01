export function Footer() {
  return (
    <footer className="border-t border-line/60 mt-24">
      <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-ink-soft">
        <p>
          <span className="text-sage font-semibold">welltread</span> -
          every step considered.
        </p>
        <p className="text-ink-soft/70">
          &copy; {new Date().getFullYear()} Welltread. Built to last.
        </p>
      </div>
    </footer>
  );
}
