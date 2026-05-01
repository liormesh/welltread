import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { QuizRunner } from "@/components/QuizRunner";

export const metadata = {
  title: "Find your program - Welltread",
  description:
    "A few quick questions and we'll show you the program built for the body you have today.",
  robots: { index: false, follow: false, nocache: true },
};

export default function QuizPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-2xl px-6 pt-12 pb-24">
          <Suspense
            fallback={
              <p className="text-ink-soft text-sm">Loading your assessment...</p>
            }
          >
            <QuizRunner />
          </Suspense>
        </section>
      </main>
      <Footer />
    </>
  );
}
