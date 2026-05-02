import { CreativesReview } from "@/components/CreativesReview";
import { CAST } from "@/lib/visual/cast";
import { SHAPES } from "@/lib/visual/shapes";

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

const SAMPLES: Creative[] = [
  {
    id: "sample_01_woman_55_stretch",
    src: "/samples/welltread_sample_01_woman_55_stretch.png",
    title: "Editorial portrait - 55, stretch",
    intent: "First-pass LP hero candidate. One-off (not in cast yet).",
    prompt:
      "55yo woman, silver-grey hair, mid-stretch in a sun-lit minimalist home. Sage tank top, paper-warm wall, Kinfolk/Gentlewoman aesthetic.",
    aspect: "4:5",
    source: "nano-banana",
  },
  {
    id: "sample_02_man_70_balance",
    src: "/samples/welltread_sample_02_man_70_balance.png",
    title: "Editorial portrait - 70, balance hold",
    intent: "First-pass senior LP hero candidate. One-off (not in cast yet).",
    prompt:
      "70yo man, full grey hair, one-leg balance hold by a wooden chair. Sage henley, NYT Well section feel.",
    aspect: "4:5",
    source: "nano-banana",
  },
  {
    id: "sample_03_exercise_lineart",
    src: "/samples/welltread_sample_03_exercise_lineart.png",
    title: "Exercise line illustration - seated cat-cow",
    intent: "Exercise instruction visual primitive. Tests the line-art language.",
    prompt:
      "Single-weight sage line illustration on paper, seated cat-cow stretch. Mid-century editorial style.",
    aspect: "1:1",
    source: "nano-banana",
  },
  {
    id: "sample_04_backdrop",
    src: "/samples/welltread_sample_04_backdrop.png",
    title: "Abstract backdrop",
    intent:
      "Section backgrounds, stat cards, cinematic loader. Tests the palette as pure mood.",
    prompt: "Soft sage / paper-cream / clay gradient with paper grain texture.",
    aspect: "16:9",
    source: "nano-banana",
  },
];

const CAST_CREATIVES: Creative[] = Object.values(CAST).map((c) => ({
  id: `cast_${c.id}`,
  src: c.canonicalImage,
  title: `${c.name}, ${c.age} - ${c.tagline}`,
  intent: `Canonical reference for ${c.name}. Reused across LPs, quiz interstitials, plan reveal, and ad creative. Future generations cite this image + ${c.name}'s description for consistency.`,
  prompt: c.description,
  aspect: "4:5",
  source: "nano-banana",
}));

const SHAPE_CREATIVES: Creative[] = Object.values(SHAPES).map((s) => ({
  id: `shape_${s.id}`,
  src: s.image,
  title: `${s.name} - drill archetype`,
  intent: `${s.meaning} Used for: ${s.uses.join("; ")}.`,
  prompt: "See drill-shape vocabulary in src/lib/visual/shapes.ts.",
  aspect: "16:9",
  source: "nano-banana",
}));

export default function Creatives() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 space-y-16">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
          08 - Creatives review
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-ink leading-[1.05]">
          The visual{" "}
          <span className="text-sage italic font-normal">language</span>.
        </h1>
        <p className="mt-6 text-lg text-ink-soft max-w-2xl leading-relaxed">
          First samples, the recurring cast, and the abstract drill vocabulary.
          Approve, reject, leave notes per image. Decisions persist in your
          browser.
        </p>
      </header>

      <section>
        <SectionHeader
          eyebrow="A"
          title="The cast"
          body="Four recurring characters with stable visual descriptors. Reused across LPs, quiz interstitials, plan reveal, and ad creative. New scenes prepend the character's description for consistency."
        />
        <CreativesReview creatives={CAST_CREATIVES} />
      </section>

      <section>
        <SectionHeader
          eyebrow="B"
          title="Drill archetypes"
          body="Abstract shapes for slots without a clear demographic or specific exercise to illustrate. Each shape carries a movement-archetype meaning. Used in cinematic loaders, stat cards, recovery interstitials, and plan-reveal week markers."
        />
        <CreativesReview creatives={SHAPE_CREATIVES} />
      </section>

      <section>
        <SectionHeader
          eyebrow="C"
          title="First-pass samples"
          body="The original four sample images that established the look. One-offs (not in the cast). Kept for reference and tonal benchmark."
        />
        <CreativesReview creatives={SAMPLES} />
      </section>

      <section className="border-t border-line pt-10">
        <h2 className="text-lg font-semibold text-ink">How the cast scales</h2>
        <p className="mt-4 text-sm text-ink-soft leading-relaxed max-w-3xl">
          Each cast member has a stable description in{" "}
          <code className="text-xs bg-paper-warm/40 px-2 py-1 rounded">
            src/lib/visual/cast.ts
          </code>
          . When we generate a new scene (e.g., &ldquo;Eleanor doing a balance
          hold by a wooden chair&rdquo;), we prepend her description and cite
          her canonical image. This keeps her looking like Eleanor across the
          site.
        </p>
        <p className="mt-3 text-sm text-ink-soft leading-relaxed max-w-3xl">
          Drill shapes work the same way: each has a typed entry in{" "}
          <code className="text-xs bg-paper-warm/40 px-2 py-1 rounded">
            src/lib/visual/shapes.ts
          </code>{" "}
          with a meaning and a usage map, so we can call{" "}
          <code className="text-xs bg-paper-warm/40 px-2 py-1 rounded">
            shapeForGoal(&apos;posture&apos;)
          </code>{" "}
          and get the right backdrop programmatically.
        </p>
      </section>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="mb-8 border-t border-line pt-8">
      <p className="text-xs uppercase tracking-[0.2em] text-clay mb-2">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-ink">{title}</h2>
      <p className="mt-3 text-ink-soft max-w-3xl leading-relaxed">{body}</p>
    </div>
  );
}
