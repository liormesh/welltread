import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EmailCapture } from "@/components/EmailCapture";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pt-24 pb-20">
          <p className="text-xs uppercase tracking-[0.2em] text-sage/80 mb-6">
            Personalized Movement
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-ink leading-[1.05] max-w-4xl">
            Every step
            <br />
            <span className="text-sage italic font-normal">
              considered.
            </span>
          </h1>
          <p className="mt-8 text-xl text-ink-soft max-w-2xl leading-relaxed">
            Welltread builds personalized movement programs for the body you
            have today &mdash; not the one you used to have. Pick the path that
            fits.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
            <NicheCard
              href="/seniors"
              eyebrow="60+"
              title="Senior Mobility"
              body="Balance, fall prevention, gentle strength &mdash; built for confidence."
            />
            <NicheCard
              href="/posture"
              eyebrow="40+"
              title="Posture &amp; Back"
              body="Undo years of desk-job stiffness. Energy, posture, movement."
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
                body="Seven to ten questions about your goals, schedule, and what your body is asking for."
              />
              <Step
                n="02"
                title="Your personalized plan"
                body="A 12-week program tailored to where you are &mdash; not a generic routine."
              />
              <Step
                n="03"
                title="Daily steps, weekly check-ins"
                body="Small movements, sustainable progress. We adapt as you do."
              />
            </div>
          </div>
        </section>

        {/* Notify */}
        <section id="notify" className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            Welltread opens soon.
          </h2>
          <p className="mt-4 text-lg text-ink-soft max-w-xl mx-auto">
            Drop your email and we&rsquo;ll let you know when programs are
            ready for you.
          </p>
          <div className="mt-10 max-w-md mx-auto">
            <EmailCapture source="home" />
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
}: {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-line bg-paper p-8 hover:border-sage/40 hover:shadow-sm transition-all"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-clay mb-3">
        {eyebrow}
      </p>
      <h3 className="text-2xl font-semibold text-ink group-hover:text-sage transition-colors">
        {title}
      </h3>
      <p className="mt-3 text-ink-soft leading-relaxed">{body}</p>
      <p className="mt-6 text-sm text-sage font-medium">
        Take the assessment &rarr;
      </p>
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
