import { AppHeader } from "@/components/app/AppHeader";
import { SAMPLE_WEEK, SAMPLE_USER } from "@/lib/app/sample-plan";

export default function Week() {
  return (
    <>
      <AppHeader title={`Week ${SAMPLE_USER.weekNumber}`} />

      <div className="flex-1 overflow-y-auto pb-32 max-w-md mx-auto w-full">
        <div className="px-6 pt-5 mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-clay mb-1">
            Theme
          </p>
          <h1 className="text-xl font-semibold text-ink leading-tight">
            {SAMPLE_USER.weekTheme}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {SAMPLE_USER.weekThemeBody}
          </p>
        </div>

        <div className="px-6 grid grid-cols-1 gap-2.5">
          {SAMPLE_WEEK.map((d, i) => (
            <DayRow
              key={i}
              day={d.day}
              name={d.label}
              status={
                d.kind === "rest"
                  ? "rest"
                  : d.kind === "checkin"
                    ? "future-checkin"
                    : d.status === "today"
                      ? "today"
                      : d.status === "done"
                        ? "done"
                        : d.status === "skipped"
                          ? "skipped"
                          : "future"
              }
            />
          ))}
        </div>

        <div className="px-6 mt-7">
          <div className="rounded-2xl border border-line bg-paper-warm/30 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-clay mb-2">
              Coming up
            </p>
            <p className="text-sm text-ink leading-relaxed">
              Week 3 starts the &ldquo;less stiff&rdquo; phase. Mobility blocks
              start compounding.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function DayRow({
  day,
  name,
  status,
}: {
  day: string;
  name: string;
  status: "done" | "today" | "future" | "future-checkin" | "rest" | "skipped";
}) {
  const blur = status === "future" ? "blur-[1px] opacity-65" : "";
  const ring = status === "today" ? "ring-2 ring-sage" : "border border-line";
  const bg =
    status === "rest"
      ? "bg-paper-warm/40"
      : status === "done"
        ? "bg-sage/5"
        : "bg-paper";

  return (
    <div
      className={`flex items-center gap-4 rounded-2xl px-4 py-3 ${bg} ${ring} ${blur}`}
    >
      <span className="w-9 text-xs uppercase tracking-wider text-ink-soft/70 shrink-0">
        {day}
      </span>
      <div className="flex-1">
        <p
          className={`text-sm ${
            status === "today" ? "font-semibold text-ink" : "text-ink"
          }`}
        >
          {name}
        </p>
      </div>
      {status === "done" && <span className="text-sage text-sm shrink-0">✓</span>}
      {status === "today" && (
        <span className="text-xs uppercase tracking-wider text-sage font-semibold shrink-0">
          Today
        </span>
      )}
      {status === "rest" && (
        <span className="text-xs text-ink-soft/60 shrink-0">rest</span>
      )}
      {status === "future-checkin" && (
        <span className="text-xs text-clay shrink-0">check-in</span>
      )}
    </div>
  );
}
