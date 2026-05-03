import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { leadCastFor } from "@/lib/visual/cast";

export const metadata = {
  title: "Senior Mobility - Welltread",
  description:
    "Personalized movement programs for adults 60+. Balance, fall prevention, gentle strength. Built for confidence, not aesthetics.",
};

export default function Seniors() {
  const lead = leadCastFor("seniors");
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 pt-12 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-sage/80 mb-6">
                For 60 and beyond
              </p>
              <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-ink leading-[1.05]">
                Move with{" "}
                <span className="text-sage italic font-normal">confidence</span>{" "}
                again.
              </h1>
              <p className="mt-8 text-xl text-ink-soft max-w-xl leading-relaxed">
                Welltread&rsquo;s senior program is built around the things
                that matter most: balance you can trust, strength that
                protects you, and movements that fit your day - not someone
                else&rsquo;s.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  href="/quiz?source=seniors"
                  className="inline-flex items-center justify-center px-7 h-14 rounded-2xl bg-sage text-paper text-base font-medium hover:bg-sage-deep transition-colors"
                >
                  Take the assessment &rarr;
                </Link>
                <span className="text-sm text-ink-soft/70">
                  60 seconds. No credit card.
                </span>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden border border-line bg-paper-warm/30">
              <Image
                src={lead.canonicalImage}
                alt={`${lead.name}, ${lead.age} - Welltread senior member`}
                width={420}
                height={525}
                priority
                unoptimized
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* Built for */}
        <section className="mx-auto max-w-5xl px-6 pb-16">
          <h2 className="text-3xl font-semibold tracking-tight text-ink mb-10">
            Built for what 60+ actually needs.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
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

        {/* Group hero - regression vs progression story */}
        <section className="bg-paper-warm/40 border-y border-line/60">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 items-center">
              <div className="rounded-3xl overflow-hidden border border-line bg-paper">
                <Image
                  src="/cast/group_balance_with_chairs.png"
                  alt="Welltread members performing balance drills with appropriate support"
                  width={1280}
                  height={720}
                  unoptimized
                  className="w-full h-auto object-cover"
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-clay mb-3">
                  Built around your body
                </p>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink leading-tight">
                  Same drill, your level.
                </h2>
                <p className="mt-6 text-lg text-ink-soft leading-relaxed">
                  Every Welltread movement has a regression and a progression.
                  Use a chair when you need it. Drop it when you don&rsquo;t.
                  The program meets you where you are - and moves with you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="mx-auto max-w-3xl px-6 py-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
              See your 12-week path.
            </h2>
            <p className="mt-4 text-lg text-ink-soft max-w-lg mx-auto">
              A few quick questions and we&rsquo;ll show you a plan built
              around what your body is asking for.
            </p>
            <Link
              href="/quiz?source=seniors"
              className="mt-10 inline-flex items-center justify-center px-8 h-14 rounded-2xl bg-sage text-paper text-base font-medium hover:bg-sage-deep transition-colors"
            >
              Take the 60-second assessment &rarr;
            </Link>
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
