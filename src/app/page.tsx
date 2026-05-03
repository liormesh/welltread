import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 pt-16 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-sage/80 mb-6">
                Personalized Movement
              </p>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-ink leading-[1.05]">
                The body{" "}
                <span className="text-sage italic font-normal">you have</span>{" "}
                today.
              </h1>
              <p className="mt-8 text-xl text-ink-soft max-w-xl leading-relaxed">
                Welltread builds personalized movement programs around your
                age, your injuries, and what you actually want to do again.
                PT-designed. 12 minutes a day. No bro-fitness, no shame.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  href="/quiz"
                  className="inline-flex items-center justify-center px-7 h-14 rounded-2xl bg-sage text-paper text-base font-medium hover:bg-sage-deep transition-colors"
                >
                  Take the assessment
                </Link>
                <span className="text-sm text-ink-soft/70">
                  60 seconds. No credit card.
                </span>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden border border-line bg-paper-warm/30">
              <Image
                src="/cast/group_hero.png"
                alt="Welltread members - Maria, David, James, Eleanor"
                width={1280}
                height={720}
                priority
                unoptimized
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* Niche teasers */}
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NicheCard
              href="/quiz?source=seniors"
              eyebrow="60+"
              title="Senior Mobility"
              body="Balance, fall prevention, gentle strength. Built for confidence."
              image="/cast/eleanor.png"
            />
            <NicheCard
              href="/quiz?source=posture"
              eyebrow="40+"
              title="Posture & Back"
              body="Undo years of desk-job stiffness. Energy, posture, strength."
              image="/cast/david.png"
            />
          </div>
        </section>

        {/* How it works */}
        <section className="bg-paper-warm/50 border-y border-line/60">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink max-w-3xl">
              A program that adjusts to you.
            </h2>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
              <Step
                n="01"
                title="Quick assessment"
                body="28 questions about your goals, schedule, and what your body is asking for. About 5 minutes."
              />
              <Step
                n="02"
                title="Your personalized plan"
                body="A 12-week program built around your contraindications, your time, and the activity you want back."
              />
              <Step
                n="03"
                title="Daily steps, weekly check-ins"
                body="Small movements, sustainable progress. We adapt as you do."
              />
            </div>
          </div>
        </section>

        {/* Why */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
            Why Welltread
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink max-w-3xl leading-tight">
            Most apps are built for 25-year-olds. Yours isn&rsquo;t.
          </h2>
          <p className="mt-6 text-lg text-ink-soft max-w-3xl leading-relaxed">
            We don&rsquo;t do hype, six-pack promises, or before-and-after
            shaming. We do real movement, designed by physical therapists,
            for the body you have today. No medical claims. No bro-fitness.
            No shame.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Pillar
              title="PT-designed"
              body="Every movement reviewed for safety. Every program contraindication-aware."
            />
            <Pillar
              title="Built for 40+"
              body="Pace, intensity, and progression calibrated for adult bodies. Not gym-rat onboarding."
            />
            <Pillar
              title="12 min a day"
              body="The science says 15. We start at 12. Sustainable beats heroic."
            />
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-line/60 bg-paper">
          <div className="mx-auto max-w-3xl px-6 py-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
              Ready to start where you are?
            </h2>
            <p className="mt-4 text-lg text-ink-soft max-w-xl mx-auto">
              Take the assessment. We&rsquo;ll show you your 12-week path -
              built around the body you have today, not the one you used to.
            </p>
            <Link
              href="/quiz"
              className="mt-10 inline-flex items-center justify-center px-8 h-14 rounded-2xl bg-sage text-paper text-base font-medium hover:bg-sage-deep transition-colors"
            >
              Take the assessment &rarr;
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function NicheCard({
  href,
  eyebrow,
  title,
  body,
  image,
}: {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
  image: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-line bg-paper overflow-hidden hover:border-sage/40 hover:shadow-sm transition-all"
    >
      <div className="grid grid-cols-[1fr_180px] sm:grid-cols-[1fr_220px] gap-0">
        <div className="p-7 sm:p-8 flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-clay mb-3">
              {eyebrow}
            </p>
            <h3 className="text-2xl font-semibold text-ink group-hover:text-sage transition-colors">
              {title}
            </h3>
            <p className="mt-3 text-ink-soft leading-relaxed">{body}</p>
          </div>
          <p className="mt-6 text-sm text-sage font-medium">
            Take the assessment &rarr;
          </p>
        </div>
        <div className="bg-paper-warm/30 overflow-hidden">
          <Image
            src={image}
            alt={title}
            width={400}
            height={500}
            unoptimized
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </Link>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div>
      <p className="text-clay text-sm font-medium tracking-wider">{n}</p>
      <h3 className="mt-3 text-xl font-semibold text-ink">{title}</h3>
      <p className="mt-3 text-ink-soft leading-relaxed">{body}</p>
    </div>
  );
}

function Pillar({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-line bg-paper p-6">
      <h3 className="text-lg font-semibold text-sage">{title}</h3>
      <p className="mt-2 text-ink-soft leading-relaxed text-sm">{body}</p>
    </div>
  );
}
