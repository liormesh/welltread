import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PlanReveal } from "@/components/PlanReveal";

export const metadata = {
  title: "Your plan - Welltread",
  description: "A program built around the body you have today.",
  robots: { index: false, follow: false, nocache: true },
};

export default function PlanPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Suspense
          fallback={
            <p className="mx-auto max-w-3xl px-6 pt-16 text-ink-soft text-sm">
              Building your plan...
            </p>
          }
        >
          <PlanReveal />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
