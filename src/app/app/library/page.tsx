import { AppHeader } from "@/components/app/AppHeader";

export default function Library() {
  return (
    <>
      <AppHeader title="Library" />

      <div className="flex-1 overflow-y-auto pb-32 max-w-md mx-auto w-full px-6 py-12">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-clay mb-3">
            Coming soon
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-ink leading-tight">
            On-demand sessions
          </h1>
          <p className="mt-3 text-sm text-ink-soft leading-relaxed max-w-xs mx-auto">
            Standalone movement, breathwork, and recovery for off-program
            days. Lands in Phase 2 - after the program proves out.
          </p>
        </div>
      </div>
    </>
  );
}
