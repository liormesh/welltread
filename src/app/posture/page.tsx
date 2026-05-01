import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Posture & Back, 40+ - Welltread",
  description:
    "Personalized movement programs for desk-job men 40+. Undo years of stiffness. Real strength, real energy, real schedule.",
};

export default function Posture() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 pt-20 pb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-sage/80 mb-6">
            For 40+ desk life
          </p>
          <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-ink leading-[1.05]">
            You used to{" "}
            <span className="text-sage italic font-normal">move</span>.
            <br />
            Let&rsquo;s start there.
          </h1>
          <p className="mt-8 text-xl text-ink-soft max-w-2xl leading-relaxed">
            Years at a desk leave a mark - tight hips, locked-up
            shoulders, a back that complains by 4pm. Welltread builds you a
            12-week program that actually fits a working life.
          </p>
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-20">
          <h2 className="text-2xl font-semibold text-ink mb-8">
            What gets fixed.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
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

        <section className="bg-paper-warm/50 border-y border-line/60">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
              See your 12-week plan.
            </h2>
            <p className="mt-4 text-lg text-ink-soft max-w-lg mx-auto">
              A few quick questions and we&rsquo;ll show you exactly what
              we&rsquo;d build for you.
            </p>
            <div className="mt-10">
              <Link
                href="/quiz?source=posture"
                className="inline-block px-7 h-14 leading-[3.5rem] rounded-2xl bg-sage text-paper font-medium hover:bg-sage-deep transition-colors"
              >
                Take the 60-second assessment &rarr;
              </Link>
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
