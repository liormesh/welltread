import { Suspense } from "react";
import { AppHeader } from "@/components/app/AppHeader";
import { DoneCheckin } from "@/components/app/DoneCheckin";

export default function Done() {
  return (
    <>
      <AppHeader title="" subdued />
      <Suspense
        fallback={<p className="px-6 py-12 text-ink-soft text-sm">Saving...</p>}
      >
        <DoneCheckin />
      </Suspense>
    </>
  );
}
