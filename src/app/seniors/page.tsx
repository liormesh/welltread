import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EmailCapture } from "@/components/EmailCapture";

export const metadata = {
  title: "Senior Mobility - Welltread",
  description:
    "Personalized movement programs for adults 60+. Balance, fall prevention, gentle strength. Built for confidence, not aesthetics.",
};

export default function Seniors() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 pt-20 pb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-sage/80 mb-6">
            For 60 and beyond
          </p>
          <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-ink leading-[1.05]">
            Move with{" "}
            <span className="text-sage italic font-normal">confidence</span>{" "}
            again.
          </h1>
          <p className="mt-8 text-xl text-ink-soft max-w-2xl leading-relaxed">
            Welltread&rsquo;s senior program is built around the things that
            matter most: balance you can trust, strength that protects you,
            and movements that fit your day - not someone else&rsquo;s.
          </p>
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-20">
          <h2 className="text-2xl font-semibold text-ink mb-8">
            Built for what 60+ actually needs.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
            <Pain
              title="Balance you can rely on"
              body="Standing up, turning around, navigating stairs. Small daily wins, professionally sequenced."
            />
            <Pain
              title="Strength that protects"
              body="Functional strength to keep you independent. Not bulk - just what your body needs to keep doing its work."
            />
            <Pain
              title="Gentle on what hurts"
              body="Programs that adjust around old injuries, replacement joints, and the days your body says &lsquo;not today.&rsquo;"
            />
            <Pain
              title="Fits your real schedule"
              body="Ten to twenty minutes, when it works for you. No gym. No equipment required."
            />
          </div>
        </section>

        <section className="bg-paper-warm/50 border-y border-line/60">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
              Programs open soon.
            </h2>
            <p className="mt-4 text-lg text-ink-soft max-w-lg mx-auto">
              Tell us where to send your program when it&rsquo;s ready. No
              spam, no nonsense.
            </p>
            <div className="mt-10 max-w-md mx-auto">
              <EmailCapture source="seniors" ctaLabel="Reserve my spot" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Pain({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-sage">{title}</h3>
      <p className="mt-2 text-ink-soft leading-relaxed">{body}</p>
    </div>
  );
}
