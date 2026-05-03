import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { leadCastFor } from "@/lib/visual/cast";

export const metadata = {
  title: "Posture & Back, 40+ - Welltread",
  description:
    "Personalized movement programs for desk-job adults 40+. Undo years of stiffness. Real strength, real energy, real schedule.",
};

export default function Posture() {
  const lead = leadCastFor("posture", "male");
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 pt-12 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-sage/80 mb-6">
                For 40+ desk life
              </p>
              <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-ink leading-[1.05]">
                You used to{" "}
                <span className="text-sage italic font-normal">move</span>.
                <br />
                Let&rsquo;s start there.
              </h1>
              <p className="mt-8 text-xl text-ink-soft max-w-xl leading-relaxed">
                Years at a desk leave a mark - tight hips, locked-up
                shoulders, a back that complains by 4pm. Welltread builds you
                a 12-week program that actually fits a working life.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  href="/quiz?source=posture"
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
                alt={`${lead.name}, ${lead.age} - Welltread posture & back member`}
                width={420}
                height={525}
                priority
                unoptimized
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* What gets fixed */}
        <section className="mx-auto max-w-5xl px-6 pb-16">
          <h2 className="text-3xl font-semibold tracking-tight text-ink mb-10">
            What gets fixed.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
            <Pain
              title="The 4pm back ache"
              body="Mobility work that targets the actual cause - not a generic stretching routine."
            />
            <Pain
              title="Forward-shoulder posture"
              body="Daily five-minute resets that retrain how you sit, stand, and carry yourself."
            />
            <Pain
              title="Energy that fades"
              body="Movement designed to restore baseline energy without crushing your evening."
            />
            <Pain
              title="The body you remember"
              body="Realistic strength work for someone with limited time and a calendar full of other people&rsquo;s priorities."
            />
          </div>
        </section>

        {/* Maria scene - posture cross-sell story */}
        <section className="bg-paper-warm/40 border-y border-line/60">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-clay mb-3">
                  12 minutes a day
                </p>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink leading-tight">
                  The science says 15. We start at 12.
                </h2>
                <p className="mt-6 text-lg text-ink-soft leading-relaxed">
                  A 2011 Lancet study found that 15 minutes a day of moderate
                  movement adds three years of life expectancy. We design for
                  what you&rsquo;ll actually do - 12 minutes, five days a
                  week. Sustainable beats heroic.
                </p>
              </div>
              <div className="rounded-3xl overflow-hidden border border-line bg-paper order-first lg:order-last">
                <Image
                  src="/scenes/maria_side_stretch.png"
                  alt="Maria performing a side stretch"
                  width={800}
                  height={1000}
                  unoptimized
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="mx-auto max-w-3xl px-6 py-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
              See your 12-week plan.
            </h2>
            <p className="mt-4 text-lg text-ink-soft max-w-lg mx-auto">
              A few quick questions and we&rsquo;ll show you exactly what
              we&rsquo;d build for you.
            </p>
            <Link
              href="/quiz?source=posture"
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
