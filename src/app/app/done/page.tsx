import { Suspense } from "react";
import { AppHeader } from "@/components/app/AppHeader";
import { DoneCheckin } from "@/components/app/DoneCheckin";
import { requireUser } from "@/lib/supabase/auth";

export default async function Done() {
  await requireUser();
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
