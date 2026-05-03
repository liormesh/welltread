export const metadata = {
  title: "UI rules - Welltread Vault",
  robots: { index: false, follow: false, nocache: true },
};

export default function UIRules() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 space-y-16">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
          10 - UI rules
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-ink leading-[1.05]">
          One language,{" "}
          <span className="text-sage italic font-normal">applied consistently</span>.
        </h1>
        <p className="mt-6 text-lg text-ink-soft max-w-3xl leading-relaxed">
          Selector style rules, icon vocabulary, and the imagery axiom -
          documented so every component renders the same way every time.
        </p>
      </header>

      <Section eyebrow="A" title="Selector style rules">
        <p className="text-ink-soft mb-8 max-w-3xl leading-relaxed">
          Welltread uses a single visual language for all selection inputs.
          The <em>shape</em> of the control depends on content type. The{" "}
          <em>border, fill, and ring</em> always behave the same way.
        </p>

        <table className="w-full text-sm rounded-2xl overflow-hidden border border-line">
          <thead className="bg-paper-warm/40 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-sage">Control</th>
              <th className="px-4 py-3 font-semibold text-sage">When</th>
              <th className="px-4 py-3 font-semibold text-sage">Default state</th>
              <th className="px-4 py-3 font-semibold text-sage">Selected state</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60 bg-paper">
            <Row
              control="Chip"
              when="Multi-select with 3-8 short text values"
              dflt="border-line, bg-paper, text-ink"
              sel="border-sage, bg-sage, text-paper"
            />
            <Row
              control="Radio row (full-width)"
              when="Single-select with 3-7 textual options that need readable rows"
              dflt="border-line, bg-paper"
              sel="border-sage, bg-sage/5, text-ink"
            />
            <Row
              control="Photo card"
              when="Single-select with demographic / persona match (Q2 age band)"
              dflt="border-line, bg-paper"
              sel="border-sage, bg-sage/5, ring-2 ring-sage/20"
            />
            <Row
              control="Icon card"
              when="Single-select with 3-5 visual archetypes (Q3 activity)"
              dflt="border-line, bg-paper"
              sel="border-sage, bg-sage/5, ring-2 ring-sage/20"
            />
            <Row
              control="Yes/No"
              when="Binary single-select (Q22)"
              dflt="border-line, bg-paper"
              sel="border-sage, bg-sage/5, ring-2 ring-sage/20"
            />
            <Row
              control="Checkbox card"
              when="Single commitment / consent (Q25)"
              dflt="border-line, bg-paper"
              sel="border-sage, bg-sage/5, ring-2 ring-sage/20"
            />
            <Row
              control="Slider 1-10"
              when="Numeric self-rating (Q8 energy, Q9 sleep, Q24 commitment)"
              dflt="default value 5, +/- buttons + range input"
              sel="value updates, sage accent on track"
            />
            <Row
              control="Statement slider (4-point)"
              when="Behavioral profile, Q11-Q18"
              dflt="border-line, text-ink-soft"
              sel="border-sage, bg-sage, text-paper"
            />
          </tbody>
        </table>

        <div className="mt-10 rounded-2xl border border-line bg-paper-warm/40 p-6">
          <h3 className="text-base font-semibold text-sage mb-3">Universal rules</h3>
          <ul className="space-y-2 text-sm text-ink-soft leading-relaxed">
            <li>- All selectors use 1px border (not 2px). Visual emphasis comes from <code className="text-xs bg-paper px-1.5 py-0.5 rounded">ring-2 ring-sage/20</code> on cards, not heavier borders.</li>
            <li>- Selected state always uses <code className="text-xs bg-paper px-1.5 py-0.5 rounded">border-sage</code>. Default uses <code className="text-xs bg-paper px-1.5 py-0.5 rounded">border-line</code>. Never <code className="text-xs bg-paper px-1.5 py-0.5 rounded">border-transparent</code> — that creates the &ldquo;blends with background&rdquo; problem.</li>
            <li>- Hover on default: <code className="text-xs bg-paper px-1.5 py-0.5 rounded">hover:border-sage/40</code> + <code className="text-xs bg-paper px-1.5 py-0.5 rounded">hover:bg-paper-warm/30</code> on cards.</li>
            <li>- Chips fill on selection (sage bg, paper text). Cards stay paper-bg with sage ring.</li>
            <li>- Continue button is enabled the moment a default value exists (e.g. slider auto-defaults to 5).</li>
          </ul>
        </div>
      </Section>

      <Section eyebrow="B" title="Activity icon vocabulary">
        <p className="text-ink-soft mb-8 max-w-3xl leading-relaxed">
          Question-specific icon sets. Each icon is single-stroke sage on
          paper background. Designed to read at 48px with no labels needed
          (though we always pair with a label for accessibility).
        </p>

        <h3 className="text-lg font-semibold text-ink mt-10 mb-4">
          Q3 - How active are you most weeks?
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <IconCard
            icon="chair"
            label="Mostly sedentary"
            meaning="Person seated in profile - desk life, low daily activity"
          />
          <IconCard
            icon="walk"
            label="Some movement"
            meaning="Walking figure, mid-stride - light daily activity"
          />
          <IconCard
            icon="run"
            label="Active most days"
            meaning="Runner, leaning forward - regular movement habit"
          />
          <IconCard
            icon="mountain"
            label="Athletic"
            meaning="Mountain peak with sun - sustained outdoor / intentional fitness"
          />
        </div>

        <div className="mt-10 rounded-2xl border border-line bg-paper-warm/40 p-6">
          <h3 className="text-base font-semibold text-sage mb-3">Icon design rules</h3>
          <ul className="space-y-2 text-sm text-ink-soft leading-relaxed">
            <li>- Single stroke weight (1.6px). No fills.</li>
            <li>- Sage on paper (default), or paper-on-sage (when card is selected).</li>
            <li>- 48x48 viewBox, designed to read at any size from 24px up.</li>
            <li>- Always ship with a text label below. Icon alone is never sufficient for accessibility.</li>
            <li>- New icons go in <code className="text-xs bg-paper px-1.5 py-0.5 rounded">QuestionRenderer.tsx :: ActivityIcon</code> and get an entry on this page.</li>
          </ul>
        </div>
      </Section>

      <Section eyebrow="C" title="Imagery axiom">
        <p className="text-ink-soft mb-6 max-w-3xl leading-relaxed">
          <strong>Default: relatable imagery.</strong> Match cast member to
          user&rsquo;s age band + niche. The exception is{" "}
          <em>aspirational activity, never aspirational body</em>.
        </p>
        <table className="w-full text-sm rounded-2xl overflow-hidden border border-line">
          <thead className="bg-paper-warm/40 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-clay">Avoid</th>
              <th className="px-4 py-3 font-semibold text-sage">Use</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60 bg-paper">
            <ImgRow avoid="25-year-old in full split" use="67-year-old hiking confidently" />
            <ImgRow avoid="Thin person doing handstand" use="The user, gardening on their knees" />
            <ImgRow avoid="Before/after weight comparison" use="&ldquo;Maria, week 12 - back to dance class&rdquo;" />
            <ImgRow avoid="Younger version of the user" use="The user doing what they used to do" />
          </tbody>
        </table>
        <p className="mt-6 text-xs text-ink-soft">
          Cross-project rule. Documented in claude memory:{" "}
          <code className="bg-paper-warm/40 px-2 py-1 rounded">
            feedback_aspirational_vs_relatable.md
          </code>
        </p>
      </Section>

      <Section eyebrow="D" title="Pain & stiffness rendering decision">
        <p className="text-ink-soft mb-4 leading-relaxed max-w-3xl">
          <strong>Decision (2026-05-03):</strong> drop the custom interactive
          body diagram in favor of multi-select chips.
        </p>
        <p className="text-ink-soft leading-relaxed max-w-3xl mb-4">
          <strong>Why:</strong> only Hinge Health among competitors uses a
          tappable body map, and theirs runs in a clinical-grade B2B2C
          context. Reverse Health (our closest analog) and BetterMe both use
          chip / checkbox patterns. Our SVG body diagram read as abstract
          rather than anatomical, blended with the page background, and
          duplicated the &ldquo;selected zones&rdquo; affordance.
        </p>
        <p className="text-ink-soft leading-relaxed max-w-3xl">
          <strong>Reversal trigger:</strong> if A/B testing shows chip
          completion rate drops materially below v1 body-map rate, revisit
          with a properly anatomical illustration (cast-rendered body parts,
          or a real-photography clickable model). Until then, chips win on
          legibility + consistency with other multi-selects.
        </p>
      </Section>

      <Section eyebrow="E" title="Question style decision tree">
        <p className="text-ink-soft mb-6 max-w-3xl leading-relaxed">
          When designing a new question, pick the visual primitive by content
          type, not by aesthetic preference. The decision tree:
        </p>
        <div className="rounded-2xl border border-line bg-paper p-6 font-mono text-xs leading-relaxed text-ink overflow-x-auto whitespace-pre">
{`Multi-select?
├─ Yes → Chips (Q1, Q5, Q7, Q20, Q21, Q23)
└─ No (single-select)
    │
    ├─ Demographic / persona match? → Photo cards (Q2)
    │
    ├─ Visual archetype with 3-5 options? → Icon cards (Q3)
    │
    ├─ Binary yes/no? → YesNo two-button (Q22)
    │
    ├─ Numeric self-rating 1-10? → Slider 1-10 (Q8, Q9, Q24)
    │
    ├─ Forced choice between two statements? → Statement slider (Q11-Q18)
    │
    ├─ Free text + suggested values? → Freetext-with-chips (Q19)
    │
    ├─ Single commitment / consent? → Checkbox card (Q25)
    │
    ├─ Email? → Email input (Q28)
    │
    └─ 3-7 textual options needing readable rows? → Radio rows (Q4, Q6, Q10, Q26, Q27)`}
        </div>
      </Section>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line pt-10">
      <p className="text-xs uppercase tracking-[0.2em] text-clay mb-2">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-ink mb-6">{title}</h2>
      {children}
    </section>
  );
}

function Row({
  control,
  when,
  dflt,
  sel,
}: {
  control: string;
  when: string;
  dflt: string;
  sel: string;
}) {
  return (
    <tr>
      <td className="px-4 py-3 font-medium text-ink align-top">{control}</td>
      <td className="px-4 py-3 text-ink-soft align-top">{when}</td>
      <td className="px-4 py-3 text-ink-soft align-top text-xs font-mono">{dflt}</td>
      <td className="px-4 py-3 text-sage align-top text-xs font-mono">{sel}</td>
    </tr>
  );
}

function ImgRow({ avoid, use }: { avoid: string; use: string }) {
  return (
    <tr>
      <td className="px-4 py-3 text-ink-soft line-through decoration-clay/40 align-top">
        {avoid}
      </td>
      <td className="px-4 py-3 text-ink align-top">{use}</td>
    </tr>
  );
}

function IconCard({
  icon,
  label,
  meaning,
}: {
  icon: string;
  label: string;
  meaning: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5 flex flex-col items-center gap-3 text-center">
      <DocsIcon name={icon} />
      <p className="text-sm font-semibold text-ink">{label}</p>
      <p className="text-xs text-ink-soft leading-snug">{meaning}</p>
    </div>
  );
}

function DocsIcon({ name }: { name: string }) {
  const stroke = "#2D4F4A";
  const baseProps = {
    fill: "none" as const,
    stroke,
    strokeWidth: "1.6",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "chair":
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12" {...baseProps}>
          <circle cx="20" cy="12" r="3" />
          <path d="M20 15 L20 26 L28 26" />
          <path d="M28 26 L30 36 L36 36" />
          <path d="M14 28 L32 28" />
          <path d="M14 28 L14 14" />
          <path d="M16 28 L16 40 M30 28 L30 40" />
        </svg>
      );
    case "walk":
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12" {...baseProps}>
          <circle cx="24" cy="9" r="3" />
          <path d="M24 13 L24 27" />
          <path d="M24 17 L18 23 M24 17 L31 22" />
          <path d="M24 27 L18 38 L17 42" />
          <path d="M24 27 L30 35 L33 41" />
        </svg>
      );
    case "run":
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12" {...baseProps}>
          <circle cx="29" cy="9" r="3" />
          <path d="M28 13 L21 25" />
          <path d="M27 15 L34 19 M22 22 L14 24" />
          <path d="M21 25 L29 33 L36 33" />
          <path d="M21 25 L13 32 L10 38" />
        </svg>
      );
    case "mountain":
      return (
        <svg viewBox="0 0 48 48" className="w-12 h-12" {...baseProps}>
          <circle cx="35" cy="14" r="3" />
          <path d="M5 38 L18 18 L26 30 L34 22 L43 38 Z" />
          <path d="M16 22 L18 18 L20 22" />
          <path d="M32 25 L34 22 L36 25" />
        </svg>
      );
    default:
      return null;
  }
}
