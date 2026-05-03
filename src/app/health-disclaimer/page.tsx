import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Health Disclaimer - Welltread",
  description:
    "Welltread provides general wellness content and is not medical advice. Read this disclaimer before using the service.",
};

const LAST_UPDATED = "May 3, 2026";

export default function HealthDisclaimerPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold text-sage tracking-tight mb-2">
          Health Disclaimer
        </h1>
        <p className="text-sm text-ink-soft mb-12">Last updated: {LAST_UPDATED}</p>

        <div className="bg-paper-warm border border-line rounded-2xl p-6 mb-10">
          <p className="text-ink font-medium mb-2">In short</p>
          <p className="text-ink-soft text-sm leading-relaxed">
            Welltread provides general wellness and movement content. It is{" "}
            <strong>not medical advice</strong>, not a diagnosis, and not a
            substitute for care from a qualified healthcare provider. Consult
            a doctor before starting any new exercise program. Stop and seek
            help if you experience pain, dizziness, or any concerning
            symptoms.
          </p>
        </div>

        <Section title="Welltread is general wellness, not medicine">
          <p>
            Welltread offers personalized movement programs based on your
            self-reported goals, age, and mobility profile. The content -
            including videos, written cues, voiceovers, and plan
            recommendations - is informational and educational. It does not
            constitute medical advice, diagnosis, treatment, or
            recommendation. We are not your healthcare provider, and using
            Welltread does not create a doctor-patient or other professional
            relationship.
          </p>
          <p>
            Welltread is not approved or cleared by the U.S. Food and Drug
            Administration or any equivalent regulator outside the United
            States. We make no claim that the Service can prevent, treat,
            cure, or mitigate any disease, injury, or medical condition.
          </p>
        </Section>

        <Section title="Consult your healthcare provider before starting">
          <p>
            Before starting any new exercise program, including Welltread,
            consult a qualified healthcare provider, especially if you:
          </p>
          <ul>
            <li>Are pregnant, postpartum, or trying to become pregnant</li>
            <li>
              Have a current or past heart condition, high blood pressure, or
              cardiovascular disease
            </li>
            <li>
              Have a musculoskeletal injury, recent surgery, joint replacement,
              or chronic pain
            </li>
            <li>Have neurological conditions, balance disorders, or vertigo</li>
            <li>Have diabetes, osteoporosis, or other chronic conditions</li>
            <li>Are taking medications that affect heart rate or balance</li>
            <li>Have not exercised regularly in the last 12 months</li>
            <li>Are over 65 and starting a new program for the first time</li>
          </ul>
          <p>
            Your healthcare provider knows your medical history and can advise
            whether the type and intensity of movement Welltread offers is
            appropriate for you.
          </p>
        </Section>

        <Section title="Exercise involves risk">
          <p>
            All physical activity carries inherent risk, including muscle
            strain, joint sprain, falls, and in rare cases serious injury or
            cardiovascular events. By using Welltread, you acknowledge and
            accept these risks. You are solely responsible for your safety.
          </p>
          <p>
            Welltread, its officers, employees, contractors, and affiliates
            are not liable for any injury, loss, or damage arising from your
            use of the Service, except as required by applicable law.
          </p>
        </Section>

        <Section title="Stop and seek help if you experience">
          <ul>
            <li>Chest pain, pressure, or unusual shortness of breath</li>
            <li>Sudden dizziness, faintness, or vision changes</li>
            <li>Sharp or unexpected joint or muscle pain</li>
            <li>Numbness, tingling, or weakness on one side of the body</li>
            <li>Any symptom that feels alarming or out of the ordinary</li>
          </ul>
          <p>
            If symptoms are severe, call your local emergency number
            immediately. In the United States, call 911. In the EU, call 112.
          </p>
        </Section>

        <Section title="Our movement methodology">
          <p>
            Welltread plans are sequenced by trained movement professionals
            and are designed to be safe and accessible for healthy adults.
            However, we cannot evaluate your specific condition through a
            quiz, a video, or any other means available within the Service.
            Listen to your body. Modify or skip any movement that causes
            pain. Welltread is not a replacement for individualized
            assessment by a physical therapist or qualified trainer.
          </p>
        </Section>

        <Section title="The 'this hurts' feature">
          <p>
            If a movement causes pain, use the &ldquo;this hurts&rdquo; control
            in the Welltread app. Phase 1 of the experience offers a softer
            cue and modification within the same movement. If pain continues,
            stop and consult a professional. The feature is for self-reported
            comfort and is not a clinical assessment tool.
          </p>
        </Section>

        <Section title="Pregnancy, postpartum, and pelvic floor">
          <p>
            We may offer niches related to postpartum recovery, pelvic floor,
            or pregnancy-adjacent content. These are general wellness
            programs, not medical care. Pregnant and postpartum users must
            consult their obstetric provider, midwife, or pelvic-floor
            physical therapist before participating. Symptoms of diastasis
            recti, prolapse, or pelvic-floor dysfunction warrant
            individualized professional care that this Service cannot
            replace.
          </p>
        </Section>

        <Section title="No reliance">
          <p>
            You agree that you will not rely on the Service for medical
            decisions. Any decisions about your health, exercise routine, or
            medical care should be made in consultation with a qualified
            professional who has examined you in person.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Welltread, Inc.
            <br />
            Email:{" "}
            <a href="mailto:hello@welltread.co" className="text-sage underline">
              hello@welltread.co
            </a>
          </p>
        </Section>

        <hr className="my-12 border-line/60" />
        <p className="text-sm text-ink-soft">
          See also:{" "}
          <Link href="/terms" className="text-sage underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-sage underline">
            Privacy Policy
          </Link>
          .
        </p>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-ink mb-3">{title}</h2>
      <div className="text-ink-soft space-y-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_a]:text-sage">
        {children}
      </div>
    </section>
  );
}
