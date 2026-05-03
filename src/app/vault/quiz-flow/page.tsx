import Link from "next/link";

export const metadata = {
  title: "Quiz flow - Welltread Vault",
  robots: { index: false, follow: false, nocache: true },
};

export default function QuizFlow() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 space-y-16">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
          09 - Quiz flow
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-ink leading-[1.05]">
          The full{" "}
          <span className="text-sage italic font-normal">questionnaire</span>.
        </h1>
        <p className="mt-6 text-lg text-ink-soft max-w-3xl leading-relaxed">
          28 questions. ~10 non-question screens. 5 acts. Niche-aware
          branching, conditional skips, dynamic stat injection. The full map -
          dependencies, dynamics, and what shows when.
        </p>
      </header>

      {/* Visual flow */}
      <Section eyebrow="A" title="Visual flow">
        <FlowDiagram />
      </Section>

      {/* Branching rules */}
      <Section eyebrow="B" title="Branching & conditional logic">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Rule
            id="entry"
            title="Entry branching by source"
            condition="?source= URL param from paid ad"
            outcomes={[
              "source=seniors → enters at Q3 (skips Q1 goal-anchor; niche pre-set to seniors)",
              "source=posture → enters at Q2 (skips Q1; niche pre-set to posture)",
              "source=home or unknown → enters at Q1 (full intake)",
            ]}
          />
          <Rule
            id="q5-q6"
            title="Pain frequency follow-up"
            condition="Q5 (body map) has at least one zone selected"
            outcomes={[
              "If yes → show Q6 (frequency)",
              "If no (only 'none' selected) → skip Q6, jump to Q7",
            ]}
          />
          <Rule
            id="q22-q23"
            title="Past-program reasoning"
            condition="Q22 (have you tried a program before?) = yes"
            outcomes={[
              "If yes → show Q23 (what got in the way?)",
              "If no → skip Q23, jump to Q24",
            ]}
          />
          <Rule
            id="contraindications"
            title="Contraindication-aware plan generation"
            condition="Q7 selections drive plan engine filters"
            outcomes={[
              "recent_surgery → plan defaults to post-op-safe progressions, surfaces caveat on plan reveal",
              "joint_replacement → contraindicated end-ranges removed",
              "osteoporosis → no spinal-flexion-under-load movements",
              "none → full library available",
            ]}
          />
        </div>
      </Section>

      {/* Dynamic content */}
      <Section eyebrow="C" title="Dynamic content & variants">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Dynamic
            slot="S1 (after Q3)"
            title="Brand reassurance + age-cohort solidarity stat"
            variants={[
              "If age=60+ → 'Only 15.5% of US adults 65+ meet activity guidelines. You're in the majority' (CDC)",
              "If age=40-59 → 'Only 26.4% of US adults meet activity guidelines. You're in the majority' (CDC)",
              "If source=seniors → AARP 75% want to age in place",
            ]}
          />
          <Dynamic
            slot="S3 (after Q10)"
            title="Time-investment justification stat"
            variants={[
              "Universal: '15 min/day adds 3 years' (Lancet 2011)",
              "If commitment=low → 'Members who do 12 min/day improve 2.4x faster' (internal placeholder)",
            ]}
          />
          <Dynamic
            slot="S5 (after Q15)"
            title="PT insight card based on slider battery"
            variants={[
              "If user leans 'listen-to-body' + 'on-schedule' → 'This pattern is shared by 64% of our most-improved members'",
              "If user leans 'push-through' + 'when-motivated' → 'You'll get the most lift from our adaptive intensity logic'",
              "Fallback: generic 'Your profile is unusual - we'll build accordingly'",
            ]}
          />
          <Dynamic
            slot="Plan-reveal hero"
            title="Activity-plug-in hero copy ★ the steal ★"
            variants={[
              "Reads Q19 (free text) and renders: 'By week 12, you'll be ready to [their answer]'",
              "If Q19 was a chip selection → use chip text directly",
              "If Q19 free-text fails moderation → fall back to niche-default ('move with confidence again' for seniors)",
            ]}
          />
        </div>
      </Section>

      {/* Per-act detail */}
      <Section eyebrow="D" title="Per-act detail">
        <ActTable />
      </Section>

      {/* Visual treatment */}
      <Section eyebrow="E" title="Visual treatment per slot">
        <p className="text-sm text-ink-soft mb-6 max-w-3xl leading-relaxed">
          Every question has a visual layer. Cast portraits for demographic
          slots, drill shapes for non-character slots, body diagram for the
          pain map, icons for fast-tap selections.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-paper-warm/40 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-sage">Slot</th>
                <th className="px-4 py-3 font-semibold text-sage">Visual primitive</th>
                <th className="px-4 py-3 font-semibold text-sage">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60 bg-paper">
              <Row slot="Q1 goal anchor" primitive="6 sage line-icon chips" why="Speed - icon-only matches Simple's first-screen pattern" />
              <Row slot="Q2 age band" primitive="4 cast portraits matched to band" why="Mirror match - Reverse Health pattern, instant identification" />
              <Row slot="Q3 activity" primitive="4 simple line icons (chair / walk / run / mountain)" why="Speed, no shame in selection" />
              <Row slot="Q5 body map" primitive="Custom interactive SVG body diagram" why="Clinical credibility cue - Hinge Health signature" />
              <Row slot="Q11-Q18 sliders" primitive="Drill-archetype shape backdrop, cycling" why="Visual rhythm during text-heavy battery" />
              <Row slot="S1, S4, S7 reassurance" primitive="Drill-shape backdrop + warm copy" why="Text-led; visual is mood-setter only" />
              <Row slot="S3, S8 stat cards" primitive="Drill shape behind big-stat number" why="Information density, low cognitive load" />
              <Row slot="S5 PT insight" primitive="Cast portrait (matched to user) + small clipboard illustration" why="'A real person is reading your answers'" />
              <Row slot="S6 testimonial" primitive="Cast portrait + quote (placeholder until real members)" why="Honest signal until real testimonials exist" />
              <Row slot="S10 cinematic loader" primitive="Drill shapes morphing through archetypes (animation)" why="Perceived effort - Simple's pattern" />
              <Row slot="Plan reveal hero" primitive="Cast portrait matched to age + niche, doing user's Q19 activity" why="The mirror-of-success - relatable, not aspirational" />
            </tbody>
          </table>
        </div>
      </Section>

      <p className="text-sm text-ink-soft pt-12 border-t border-line">
        Detailed copy + question wording in{" "}
        <code className="text-xs bg-paper-warm/40 px-2 py-1 rounded">
          ~/Documents/knowledge-base/projects/welltread/research/SYNTHESIS.md
        </code>
        . Code source of truth: <Link className="text-sage hover:underline" href="https://github.com/liormesh/welltread/blob/main/src/lib/quiz/definition.ts">src/lib/quiz/definition.ts</Link> (currently v1; v2 refactor pending Lior's go).
      </p>
    </div>
  );
}

/* ----------- COMPONENTS ----------- */

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

function Rule({
  title,
  condition,
  outcomes,
}: {
  id: string;
  title: string;
  condition: string;
  outcomes: string[];
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-sage">If: {condition}</p>
      <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
        {outcomes.map((o) => (
          <li key={o} className="flex gap-2">
            <span className="mt-2 inline-block h-1 w-1 rounded-full bg-clay shrink-0" />
            <span>{o}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Dynamic({
  slot,
  title,
  variants,
}: {
  slot: string;
  title: string;
  variants: string[];
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-clay mb-2">{slot}</p>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
        {variants.map((v) => (
          <li key={v} className="flex gap-2">
            <span className="mt-2 inline-block h-1 w-1 rounded-full bg-sage shrink-0" />
            <span>{v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Row({ slot, primitive, why }: { slot: string; primitive: string; why: string }) {
  return (
    <tr>
      <td className="px-4 py-3 align-top text-ink font-medium">{slot}</td>
      <td className="px-4 py-3 align-top text-ink">{primitive}</td>
      <td className="px-4 py-3 align-top text-ink-soft">{why}</td>
    </tr>
  );
}

/* ----------- FLOW DIAGRAM SVG ----------- */

function FlowDiagram() {
  return (
    <div className="rounded-3xl border border-line bg-paper p-6 overflow-x-auto">
      <svg viewBox="0 0 1200 1700" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        {/* Definitions */}
        <defs>
          <marker id="arr" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#4A6B66" />
          </marker>
        </defs>

        {/* SOURCE */}
        <FlowNode x={500} y={20} w={200} h={50} fill="#F2EAD3" label="Paid click — ?source=" sub="seniors / posture / home" />

        {/* Branch lines */}
        <line x1={550} y1={70} x2={250} y2={140} stroke="#4A6B66" strokeWidth="1.5" markerEnd="url(#arr)" />
        <line x1={600} y1={70} x2={600} y2={140} stroke="#4A6B66" strokeWidth="1.5" markerEnd="url(#arr)" />
        <line x1={650} y1={70} x2={950} y2={140} stroke="#4A6B66" strokeWidth="1.5" markerEnd="url(#arr)" />
        <Tag x={350} y={110} label="source=home" />
        <Tag x={620} y={115} label="source=posture" />
        <Tag x={830} y={110} label="source=seniors" />

        {/* ACT 1 entries */}
        <FlowNode x={150} y={140} w={200} h={45} fill="#2D4F4A" textColor="#FAF7F2" label="Q1 — Goal anchor" sub="multi-select chips" />
        <FlowNode x={500} y={140} w={200} h={45} fill="#2D4F4A" textColor="#FAF7F2" label="Q2 — Age band" sub="4 cast cards" />
        <FlowNode x={850} y={140} w={200} h={45} fill="#2D4F4A" textColor="#FAF7F2" label="Q3 — Activity" sub="4 line-icon cards" />

        {/* converge */}
        <line x1={250} y1={185} x2={250} y2={210} stroke="#4A6B66" strokeWidth="1.5" />
        <line x1={250} y1={210} x2={950} y2={210} stroke="#4A6B66" strokeWidth="1.5" />
        <line x1={600} y1={185} x2={600} y2={210} stroke="#4A6B66" strokeWidth="1.5" />
        <line x1={950} y1={185} x2={950} y2={210} stroke="#4A6B66" strokeWidth="1.5" />
        <line x1={600} y1={210} x2={600} y2={235} stroke="#4A6B66" strokeWidth="1.5" markerEnd="url(#arr)" />

        <FlowNode x={500} y={235} w={200} h={45} fill="#2D4F4A" textColor="#FAF7F2" label="Q2/Q3 (if entered earlier)" sub="merge into common spine" />

        <line x1={600} y1={280} x2={600} y2={310} stroke="#4A6B66" strokeWidth="1.5" markerEnd="url(#arr)" />

        {/* S1 */}
        <FlowNode x={500} y={310} w={200} h={40} fill="#F2EAD3" label="S1 — Brand reassurance" sub="dynamic stat by age band" />

        <line x1={600} y1={350} x2={600} y2={380} stroke="#4A6B66" strokeWidth="1.5" markerEnd="url(#arr)" />

        {/* ACT 2 - Body context */}
        <ActLabel x={120} y={395} label="ACT 2 — Body context" />
        <FlowNode x={500} y={380} w={200} h={45} fill="#2D4F4A" textColor="#FAF7F2" label="Q4 — Sex assigned" sub="explainer panel" />
        <line x1={600} y1={425} x2={600} y2={450} stroke="#4A6B66" strokeWidth="1.5" markerEnd="url(#arr)" />
        <FlowNode x={500} y={450} w={200} h={45} fill="#2D4F4A" textColor="#FAF7F2" label="Q5 — Body map" sub="multi-select on diagram" />

        {/* Branch from Q5 */}
        <line x1={600} y1={495} x2={600} y2={520} stroke="#4A6B66" strokeWidth="1.5" />
        <line x1={600} y1={520} x2={400} y2={520} stroke="#4A6B66" strokeWidth="1.5" />
        <line x1={600} y1={520} x2={800} y2={520} stroke="#4A6B66" strokeWidth="1.5" />
        <line x1={400} y1={520} x2={400} y2={555} stroke="#4A6B66" strokeWidth="1.5" markerEnd="url(#arr)" />
        <line x1={800} y1={520} x2={800} y2={555} stroke="#4A6B66" strokeWidth="1.5" markerEnd="url(#arr)" />
        <Tag x={365} y={538} label="if pain selected" />
        <Tag x={770} y={538} label="if 'none' only" />

        <FlowNode x={300} y={555} w={200} h={45} fill="#2D4F4A" textColor="#FAF7F2" label="Q6 — Pain frequency" sub="conditional" />
        <FlowNode x={700} y={555} w={200} h={45} fill="#2D4F4A" textColor="#FAF7F2" label="Q7 — Past injuries" sub="multi-select" />

        {/* converge */}
        <line x1={400} y1={600} x2={400} y2={625} stroke="#4A6B66" strokeWidth="1.5" />
        <line x1={400} y1={625} x2={800} y2={625} stroke="#4A6B66" strokeWidth="1.5" />
        <line x1={800} y1={600} x2={800} y2={625} stroke="#4A6B66" strokeWidth="1.5" />
        <line x1={600} y1={625} x2={600} y2={650} stroke="#4A6B66" strokeWidth="1.5" markerEnd="url(#arr)" />
        <Tag x={500} y={620} label="(if Q6 shown, also asks Q7)" />

        <FlowNode x={500} y={650} w={200} h={40} fill="#F2EAD3" label="S2 — Educational" sub="why we ask" />
        <ConnectDown x1={600} y1={690} y2={715} />

        <FlowNode x={500} y={715} w={200} h={45} fill="#2D4F4A" textColor="#FAF7F2" label="Q8-Q10" sub="energy / sleep / time (sliders)" />
        <ConnectDown x1={600} y1={760} y2={785} />

        <FlowNode x={500} y={785} w={200} h={40} fill="#F2EAD3" label="S3 — Stat (Lancet 15min)" sub="" />
        <ConnectDown x1={600} y1={825} y2={845} />
        <FlowNode x={500} y={845} w={200} h={40} fill="#F2EAD3" label="S4 — Reassurance" sub="anti-shame pivot" />
        <ConnectDown x1={600} y1={885} y2={910} />

        {/* ACT 3 */}
        <ActLabel x={120} y={925} label="ACT 3 — Behavioral profile" />
        <FlowNode x={500} y={910} w={200} h={45} fill="#2D4F4A" textColor="#FAF7F2" label="Q11-Q15 — Slider battery" sub="forced 4-point, no neutral" />
        <ConnectDown x1={600} y1={955} y2={980} />
        <FlowNode x={500} y={980} w={200} h={40} fill="#F2EAD3" label="S5 — PT insight" sub="dynamic by slider answers" />
        <ConnectDown x1={600} y1={1020} y2={1045} />
        <FlowNode x={500} y={1045} w={200} h={45} fill="#2D4F4A" textColor="#FAF7F2" label="Q16-Q18 — Slider battery cont." sub="" />
        <ConnectDown x1={600} y1={1090} y2={1115} />
        <FlowNode x={500} y={1115} w={200} h={40} fill="#F2EAD3" label="S6 — Mid-quiz testimonial" sub="placeholder until real members" />
        <ConnectDown x1={600} y1={1155} y2={1180} />

        {/* ACT 4 */}
        <ActLabel x={120} y={1195} label="ACT 4 — Identity & commitment" />
        <FlowNode x={500} y={1180} w={200} h={45} fill="#2D4F4A" textColor="#FAF7F2" label="Q19 — Activity to get back to" sub="free text + chips ★ THE STEAL ★" />
        <ConnectDown x1={600} y1={1225} y2={1250} />
        <FlowNode x={500} y={1250} w={200} h={45} fill="#2D4F4A" textColor="#FAF7F2" label="Q20-Q21 — Loss / gain pair" sub="reflection" />
        <ConnectDown x1={600} y1={1295} y2={1320} />

        <FlowNode x={500} y={1320} w={200} h={45} fill="#2D4F4A" textColor="#FAF7F2" label="Q22 — Past program?" sub="Y/N" />
        <line x1={600} y1={1365} x2={600} y2={1390} stroke="#4A6B66" strokeWidth="1.5" />
        <line x1={600} y1={1390} x2={400} y2={1390} stroke="#4A6B66" strokeWidth="1.5" />
        <line x1={600} y1={1390} x2={800} y2={1390} stroke="#4A6B66" strokeWidth="1.5" />
        <line x1={400} y1={1390} x2={400} y2={1410} stroke="#4A6B66" strokeWidth="1.5" markerEnd="url(#arr)" />
        <line x1={800} y1={1390} x2={800} y2={1410} stroke="#4A6B66" strokeWidth="1.5" markerEnd="url(#arr)" />
        <Tag x={365} y={1408} label="yes" />
        <Tag x={770} y={1408} label="no" />

        <FlowNode x={300} y={1410} w={200} h={40} fill="#2D4F4A" textColor="#FAF7F2" label="Q23 — What got in the way?" sub="conditional" />
        <FlowNode x={700} y={1410} w={200} h={40} fill="#2D4F4A" textColor="#FAF7F2" label="Q24 — Commitment slider" sub="1-10" />

        {/* converge to Q24 */}
        <line x1={400} y1={1450} x2={400} y2={1475} stroke="#4A6B66" strokeWidth="1.5" />
        <line x1={400} y1={1475} x2={800} y2={1475} stroke="#4A6B66" strokeWidth="1.5" />
        <line x1={800} y1={1450} x2={800} y2={1475} stroke="#4A6B66" strokeWidth="1.5" />
        <line x1={600} y1={1475} x2={600} y2={1495} stroke="#4A6B66" strokeWidth="1.5" markerEnd="url(#arr)" />

        <FlowNode x={500} y={1495} w={200} h={40} fill="#2D4F4A" textColor="#FAF7F2" label="Q25 — I commit (checkbox)" sub="micro-commitment" />
        <ConnectDown x1={600} y1={1535} y2={1555} />

        <FlowNode x={500} y={1555} w={200} h={45} fill="#F2EAD3" label="S8 + S9" sub="stat + 'how Welltread is different'" />
        <ConnectDown x1={600} y1={1600} y2={1625} />

        {/* ACT 5 */}
        <ActLabel x={120} y={1640} label="ACT 5 — Plan & paywall" />
        <FlowNode x={350} y={1625} w={500} h={45} fill="#C18C5D" textColor="#FAF7F2" label="Q26-Q28 — Notif pref / source / EMAIL" sub="email = curiosity gap before plan reveal" />
      </svg>
    </div>
  );
}

function FlowNode({
  x,
  y,
  w,
  h,
  fill,
  textColor,
  label,
  sub,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  textColor?: string;
  label: string;
  sub?: string;
}) {
  const tc = textColor ?? "#1A1A1A";
  const subC = textColor ? "#FAF7F2" : "#4B5152";
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="10" fill={fill} stroke="#E6DFCF" strokeWidth="1" />
      <text x={x + w / 2} y={y + (sub ? 22 : h / 2 + 5)} fontSize="14" fontWeight="600" fill={tc} textAnchor="middle">
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + 38} fontSize="11" fill={subC} textAnchor="middle" opacity="0.85">
          {sub}
        </text>
      )}
    </g>
  );
}

function Tag({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <text x={x} y={y} fontSize="11" fill="#4B5152" fontStyle="italic">
      {label}
    </text>
  );
}

function ActLabel({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <text x={x} y={y} fontSize="13" fontWeight="700" fill="#C18C5D" letterSpacing="2">
      {label.toUpperCase()}
    </text>
  );
}

function ConnectDown({ x1, y1, y2 }: { x1: number; y1: number; y2: number }) {
  return (
    <line x1={x1} y1={y1} x2={x1} y2={y2} stroke="#4A6B66" strokeWidth="1.5" markerEnd="url(#arr)" />
  );
}

/* ----------- ACT TABLE ----------- */

const ACTS: Array<{
  number: string;
  name: string;
  questions: Array<{ id: string; q: string; type: string; depends?: string }>;
}> = [
  {
    number: "1",
    name: "Hook & permission",
    questions: [
      { id: "Q1", q: "What does moving better mean to you?", type: "Multi-select chips (6 options)", depends: "Skipped if source=seniors|posture" },
      { id: "Q2", q: "What life stage are you in?", type: "Single-select photo cards (40-49 / 50-59 / 60-69 / 70+)" },
      { id: "Q3", q: "How active are you most weeks?", type: "Single-select icon cards (sedentary / some / most days / athletic)" },
    ],
  },
  {
    number: "2",
    name: "Body context",
    questions: [
      { id: "Q4", q: "What sex were you assigned at birth?", type: "Single (F / M / Prefer not)" },
      { id: "Q5", q: "Where do you feel stiffness or pain?", type: "Multi-select on body diagram (10 zones + none)" },
      { id: "Q6", q: "How often does it bother you?", type: "Single (4 options)", depends: "Only if Q5 has zones selected" },
      { id: "Q7", q: "Anything we should design around?", type: "Multi-select chips (7 options + none)" },
      { id: "Q8", q: "How's your energy on a typical day?", type: "Slider 1-10" },
      { id: "Q9", q: "How well do you sleep?", type: "Slider 1-10" },
      { id: "Q10", q: "How much time can you give us a day?", type: "Single-select chips (4 buckets)" },
    ],
  },
  {
    number: "3",
    name: "Behavioral profile",
    questions: [
      { id: "Q11", q: "Push through pain ↔ Listen to body's signals", type: "4-point forced slider" },
      { id: "Q12", q: "Move when motivated ↔ Move on schedule", type: "4-point forced slider" },
      { id: "Q13", q: "Hard to count ↔ Consistency matters more", type: "4-point forced slider" },
      { id: "Q14", q: "Train alone ↔ Class or community", type: "4-point forced slider" },
      { id: "Q15", q: "Want clear instructions ↔ Figure it out myself", type: "4-point forced slider" },
      { id: "Q16", q: "Tracking helps me ↔ Tracking stresses me", type: "4-point forced slider" },
      { id: "Q17", q: "Lots of injuries ↔ Body feels resilient", type: "4-point forced slider" },
      { id: "Q18", q: "Skip the week if I miss a day ↔ Bounce back next day", type: "4-point forced slider" },
    ],
  },
  {
    number: "4",
    name: "Identity & commitment",
    questions: [
      { id: "Q19", q: "What's one thing you want to do better — or get back to?", type: "Free text + 8 chip suggestions ★" },
      { id: "Q20", q: "If nothing changes, what worries you?", type: "Multi-select chips (loss frame)" },
      { id: "Q21", q: "And if you do change?", type: "Multi-select chips (gain frame)" },
      { id: "Q22", q: "Have you tried a movement program before?", type: "Single Y/N" },
      { id: "Q23", q: "What got in the way last time?", type: "Multi-select chips (8 options)", depends: "Only if Q22 = yes" },
      { id: "Q24", q: "How committed are you to 15 min/day for 12 weeks?", type: "Slider 1-10" },
      { id: "Q25", q: "I commit to showing up", type: "Single checkbox" },
    ],
  },
  {
    number: "5",
    name: "Plan & paywall",
    questions: [
      { id: "Q26", q: "How would you like us to check in?", type: "Single (3 options)" },
      { id: "Q27", q: "How did you hear about us?", type: "Single (7 options)" },
      { id: "Q28", q: "Where should we send your plan?", type: "Email input" },
    ],
  },
];

function ActTable() {
  return (
    <div className="space-y-10">
      {ACTS.map((act) => (
        <div key={act.number}>
          <p className="text-xs uppercase tracking-[0.2em] text-clay mb-2">
            Act {act.number}
          </p>
          <h3 className="text-2xl font-semibold text-ink mb-4">{act.name}</h3>
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full text-sm">
              <thead className="bg-paper-warm/40 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-sage w-16">ID</th>
                  <th className="px-4 py-3 font-semibold text-sage">Question</th>
                  <th className="px-4 py-3 font-semibold text-sage">Type</th>
                  <th className="px-4 py-3 font-semibold text-sage">Conditional?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60 bg-paper">
                {act.questions.map((q) => (
                  <tr key={q.id}>
                    <td className="px-4 py-3 text-sage font-mono text-xs align-top">{q.id}</td>
                    <td className="px-4 py-3 text-ink align-top">{q.q}</td>
                    <td className="px-4 py-3 text-ink-soft align-top">{q.type}</td>
                    <td className="px-4 py-3 text-ink-soft align-top">{q.depends ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
