import { CreativesReview } from "@/components/CreativesReview";

export const metadata = {
  title: "Creatives review - Welltread Vault",
  robots: { index: false, follow: false, nocache: true },
};

export type Creative = {
  id: string;
  src: string;
  title: string;
  intent: string;
  prompt: string;
  aspect: "1:1" | "4:5" | "16:9" | "9:16" | "3:2" | "2:3";
  source: "nano-banana" | "depositphotos";
};

const CREATIVES: Creative[] = [
  {
    id: "sample_01_woman_55_stretch",
    src: "/samples/welltread_sample_01_woman_55_stretch.png",
    title: "Editorial portrait - 55, stretch",
    intent:
      "LP hero candidate. Tests warm-editorial photography aesthetic for the 50s persona.",
    prompt:
      "55yo woman, silver-grey hair, mid-stretch in a sun-lit minimalist home. Sage tank top, paper-warm wall, Kinfolk/Gentlewoman aesthetic. NOT stock, NOT AI-glossy.",
    aspect: "4:5",
    source: "nano-banana",
  },
  {
    id: "sample_02_man_70_balance",
    src: "/samples/welltread_sample_02_man_70_balance.png",
    title: "Editorial portrait - 70, balance hold",
    intent:
      "Senior LP hero candidate. Tests dignified, focused, age-affirming photography.",
    prompt:
      "70yo man, full grey hair, one-leg balance hold by a wooden chair. Sage henley, NYT Well section feel. Slight grain, candid, NOT smiling-at-camera.",
    aspect: "4:5",
    source: "nano-banana",
  },
  {
    id: "sample_03_exercise_lineart",
    src: "/samples/welltread_sample_03_exercise_lineart.png",
    title: "Exercise line illustration - seated cat-cow",
    intent:
      "Exercise instruction visual. Tests the line-art language for plan-page demos and quiz interstitials.",
    prompt:
      "Single-weight sage line illustration on paper, seated cat-cow stretch. Mid-century editorial style, gender/age-neutral.",
    aspect: "1:1",
    source: "nano-banana",
  },
  {
    id: "sample_04_backdrop",
    src: "/samples/welltread_sample_04_backdrop.png",
    title: "Abstract backdrop",
    intent:
      "Section backgrounds, stat cards, cinematic loader background. Tests the palette as pure mood.",
    prompt:
      "Soft sage / paper-cream / clay gradient with paper grain texture. No subjects. Calm, meditative, wellness-magazine.",
    aspect: "16:9",
    source: "nano-banana",
  },
];

export default function Creatives() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 space-y-10">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
          08 - Creatives review
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-ink leading-[1.05]">
          The visual{" "}
          <span className="text-sage italic font-normal">language</span>.
        </h1>
        <p className="mt-6 text-lg text-ink-soft max-w-2xl leading-relaxed">
          First samples generated via Nano Banana 2. Review each, approve or
          reject, leave a note on what to push toward. Decisions persist in
          your browser.
        </p>
      </header>

      <CreativesReview creatives={CREATIVES} />

      <section className="border-t border-line pt-8">
        <h2 className="text-lg font-semibold text-ink">What I&rsquo;m testing here</h2>
        <ul className="mt-4 space-y-2 text-sm text-ink-soft">
          <li>1. <strong>Portrait register</strong> - editorial vs stock vs clinical. Samples 01-02.</li>
          <li>2. <strong>Illustration register</strong> - line art vs filled vs photographic. Sample 03.</li>
          <li>3. <strong>Color discipline</strong> - sage / paper-warm / clay. All four.</li>
          <li>4. <strong>Age representation</strong> - 55 and 70 - tests both niches.</li>
          <li>5. <strong>AI-uncanny avoidance</strong> - real skin, real grain, candid not smiling-at-camera.</li>
        </ul>
      </section>
    </div>
  );
}
