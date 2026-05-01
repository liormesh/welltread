export default function BrandVisualizer() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 space-y-24">
      {/* HERO */}
      <section>
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">Brand reference</p>
        <h1 className="text-6xl font-semibold tracking-tight text-ink leading-[1.05]">
          Welltread, <span className="text-sage italic font-normal">visualized</span>.
        </h1>
        <p className="mt-6 text-xl text-ink-soft max-w-2xl leading-relaxed">
          Living style guide. What you see is what we ship. Update by editing
          tokens in <code className="text-sm bg-paper-warm/40 px-2 py-0.5 rounded">globals.css</code>{" "}
          and components in <code className="text-sm bg-paper-warm/40 px-2 py-0.5 rounded">.kb/brand.md</code>.
        </p>
      </section>

      {/* PALETTE */}
      <section>
        <SectionHeader eyebrow="01" title="Palette" />
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <Swatch name="Sage" hex="#2D4F4A" cls="bg-sage" usage="Primary brand. Buttons, accents, links." dark />
          <Swatch name="Sage Deep" hex="#1F3A36" cls="bg-sage-deep" usage="Hover states, depth." dark />
          <Swatch name="Sage Soft" hex="#4A6B66" cls="bg-sage-soft" usage="De-emphasized brand." dark />
          <Swatch name="Clay" hex="#C18C5D" cls="bg-clay" usage="Eyebrow accents, numerical labels." dark />
          <Swatch name="Clay Soft" hex="#D9B18D" cls="bg-clay-soft" usage="Tertiary warmth." />
          <Swatch name="Paper" hex="#FAF7F2" cls="bg-paper" usage="Default page background." />
          <Swatch name="Paper Warm" hex="#F2EAD3" cls="bg-paper-warm" usage="Section accent backgrounds." />
          <Swatch name="Paper Deep" hex="#EBE2C9" cls="bg-paper-deep" usage="Tertiary surface." />
          <Swatch name="Ink" hex="#1A1A1A" cls="bg-ink" usage="Body copy." dark />
          <Swatch name="Ink Soft" hex="#4B5152" cls="bg-ink-soft" usage="Secondary copy." dark />
          <Swatch name="Line" hex="#E6DFCF" cls="bg-line" usage="Borders, dividers." />
        </div>
      </section>

      {/* TYPE SCALE */}
      <section>
        <SectionHeader eyebrow="02" title="Type scale" />
        <div className="mt-8 space-y-8">
          <TypeRow cls="text-7xl font-semibold tracking-tight leading-[1.05]" label="text-7xl / display">
            Every step considered.
          </TypeRow>
          <TypeRow cls="text-6xl font-semibold tracking-tight leading-[1.05]" label="text-6xl / hero">
            Move with confidence.
          </TypeRow>
          <TypeRow cls="text-5xl font-semibold tracking-tight" label="text-5xl / page-h1">
            You used to move. Let&rsquo;s start there.
          </TypeRow>
          <TypeRow cls="text-4xl font-semibold tracking-tight" label="text-4xl / section-h2">
            A program that adjusts to you.
          </TypeRow>
          <TypeRow cls="text-3xl font-semibold tracking-tight" label="text-3xl / sub-h2">
            Welltread opens soon.
          </TypeRow>
          <TypeRow cls="text-2xl font-semibold" label="text-2xl / card-h3">
            Senior Mobility
          </TypeRow>
          <TypeRow cls="text-xl text-ink-soft leading-relaxed" label="text-xl / lead-paragraph">
            Personalized movement programs for the body you have today, not the one you used to have.
          </TypeRow>
          <TypeRow cls="text-base text-ink-soft leading-relaxed" label="text-base / body">
            Balance, fall prevention, gentle strength. Built for confidence, not aesthetics.
          </TypeRow>
          <TypeRow cls="text-sm text-ink-soft" label="text-sm / small">
            Daily steps, weekly check-ins.
          </TypeRow>
          <TypeRow cls="text-xs uppercase tracking-[0.2em] text-clay" label="text-xs uppercase / eyebrow">
            Personalized Movement
          </TypeRow>
        </div>
      </section>

      {/* ITALIC ACCENT */}
      <section>
        <SectionHeader eyebrow="03" title="Italic accent" />
        <p className="mt-4 text-ink-soft max-w-2xl leading-relaxed">
          Emphasis through style, not weight. Specific words in the headline get sage italic
          font-normal treatment, signaling intention without shouting.
        </p>
        <div className="mt-8 space-y-6 max-w-3xl">
          <p className="text-5xl font-semibold tracking-tight leading-[1.05] text-ink">
            Every step <span className="text-sage italic font-normal">considered</span>.
          </p>
          <p className="text-5xl font-semibold tracking-tight leading-[1.05] text-ink">
            Move with <span className="text-sage italic font-normal">confidence</span> again.
          </p>
          <p className="text-5xl font-semibold tracking-tight leading-[1.05] text-ink">
            You used to <span className="text-sage italic font-normal">move</span>.
          </p>
        </div>
      </section>

      {/* BUTTONS */}
      <section>
        <SectionHeader eyebrow="04" title="Buttons" />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <ComponentSample label="Primary" code="bg-sage text-paper">
            <button className="px-6 h-12 rounded-2xl bg-sage text-paper font-medium hover:bg-sage-deep transition-colors">
              Take the assessment
            </button>
          </ComponentSample>
          <ComponentSample label="Secondary (outline)" code="border-sage text-sage">
            <button className="px-6 h-12 rounded-2xl border border-sage text-sage font-medium hover:bg-sage hover:text-paper transition-colors">
              Learn more
            </button>
          </ComponentSample>
          <ComponentSample label="Tertiary (ghost)" code="text-sm text-sage">
            <button className="text-sm text-sage font-medium hover:text-sage-deep transition-colors">
              Skip for now &rarr;
            </button>
          </ComponentSample>
        </div>
      </section>

      {/* INPUTS */}
      <section>
        <SectionHeader eyebrow="05" title="Inputs" />
        <div className="mt-8 max-w-md space-y-4">
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 h-12 rounded-2xl border border-line bg-paper-warm/30 text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition"
          />
          <input
            type="text"
            placeholder="Disabled state"
            disabled
            className="w-full px-4 h-12 rounded-2xl border border-line bg-paper text-ink-soft/50 placeholder:text-ink-soft/30 cursor-not-allowed"
          />
        </div>
      </section>

      {/* CARDS */}
      <section>
        <SectionHeader eyebrow="06" title="Cards" />
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Niche card */}
          <div className="group rounded-3xl border border-line bg-paper p-8 hover:border-sage/40 hover:shadow-sm transition-all cursor-pointer">
            <p className="text-xs uppercase tracking-[0.2em] text-clay mb-3">60+</p>
            <h3 className="text-2xl font-semibold text-ink group-hover:text-sage transition-colors">
              Senior Mobility
            </h3>
            <p className="mt-3 text-ink-soft leading-relaxed">
              Balance, fall prevention, gentle strength. Built for confidence.
            </p>
            <p className="mt-6 text-sm text-sage font-medium">Take the assessment &rarr;</p>
          </div>

          {/* Static info card */}
          <div className="rounded-3xl border border-line bg-paper p-8">
            <h3 className="text-lg font-semibold text-sage">Static information card</h3>
            <p className="mt-2 text-ink-soft leading-relaxed">
              Used for content blocks where there&rsquo;s no link target. No hover state.
            </p>
          </div>

          {/* Highlighted */}
          <div className="rounded-3xl border-2 border-sage bg-paper-warm/40 p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-sage mb-3">Best value</p>
            <h3 className="text-2xl font-semibold text-ink">$99 / 6 months</h3>
            <p className="mt-3 text-ink-soft leading-relaxed">
              Default-highlighted tier on the paywall.
            </p>
          </div>
        </div>
      </section>

      {/* TONE TABLE */}
      <section>
        <SectionHeader eyebrow="07" title="Voice — concrete examples" />
        <div className="mt-8 overflow-hidden rounded-3xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-paper-warm/40">
              <tr className="text-left">
                <th className="px-6 py-4 font-semibold text-sage w-1/2">Avoid</th>
                <th className="px-6 py-4 font-semibold text-sage">Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60 bg-paper">
              <ToneRow
                avoid="Transform your body in 12 weeks!"
                use="A 12-week program that adjusts to you."
              />
              <ToneRow avoid="Crush your fitness goals!" use="Move with confidence again." />
              <ToneRow
                avoid="AI-powered personalization"
                use="Built around what your body's asking for."
              />
              <ToneRow
                avoid="Blast belly fat"
                use="Functional strength to keep you independent."
              />
              <ToneRow
                avoid="Get the body you've always dreamed of"
                use="You used to move. Let's start there."
              />
              <ToneRow
                avoid="Revolutionary new method"
                use="Built around the things that matter most."
              />
              <ToneRow
                avoid="Headers ending in exclamation points!"
                use="Headers ending in periods. Or no punctuation"
              />
            </tbody>
          </table>
        </div>
      </section>

      {/* SPACING */}
      <section>
        <SectionHeader eyebrow="08" title="Spacing & rhythm" />
        <div className="mt-8 space-y-3">
          <SpacingRow label="px-6" px={24} />
          <SpacingRow label="px-8" px={32} />
          <SpacingRow label="py-12 (small section)" px={48} />
          <SpacingRow label="py-20 (default section)" px={80} />
          <SpacingRow label="py-24 (hero / large)" px={96} />
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="border-t border-line pt-8">
      <p className="text-xs uppercase tracking-[0.2em] text-clay mb-2">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-ink">{title}</h2>
    </div>
  );
}

function Swatch({
  name,
  hex,
  cls,
  usage,
  dark = false,
}: {
  name: string;
  hex: string;
  cls: string;
  usage: string;
  dark?: boolean;
}) {
  return (
    <div className="rounded-2xl overflow-hidden border border-line">
      <div
        className={`${cls} h-24 flex items-end p-3 ${
          dark ? "text-paper" : "text-ink"
        }`}
      >
        <span className="text-xs font-mono opacity-80">{hex}</span>
      </div>
      <div className="p-3 bg-paper">
        <p className="text-sm font-semibold text-ink">{name}</p>
        <p className="mt-1 text-xs text-ink-soft leading-snug">{usage}</p>
      </div>
    </div>
  );
}

function TypeRow({
  cls,
  label,
  children,
}: {
  cls: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[140px_1fr] gap-4 lg:gap-8 items-baseline border-b border-line/40 pb-6">
      <p className="text-xs font-mono text-ink-soft/70 uppercase tracking-wider">{label}</p>
      <div className={`${cls} text-ink`}>{children}</div>
    </div>
  );
}

function ComponentSample({
  label,
  code,
  children,
}: {
  label: string;
  code: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-mono text-ink-soft/70 uppercase tracking-wider mb-3">{label}</p>
      <div className="rounded-2xl border border-line bg-paper p-6 flex items-center justify-center">
        {children}
      </div>
      <p className="mt-2 text-xs font-mono text-ink-soft/60">{code}</p>
    </div>
  );
}

function ToneRow({ avoid, use }: { avoid: string; use: string }) {
  return (
    <tr>
      <td className="px-6 py-4 text-ink-soft line-through decoration-clay/40 w-1/2">{avoid}</td>
      <td className="px-6 py-4 text-ink">{use}</td>
    </tr>
  );
}

function SpacingRow({ label, px }: { label: string; px: number }) {
  return (
    <div className="flex items-center gap-4">
      <p className="text-xs font-mono text-ink-soft/70 uppercase tracking-wider w-48">{label}</p>
      <div className="flex-1 bg-paper-warm/30 border border-line rounded-md h-8 relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 bg-sage/20" style={{ width: `${px * 2}px` }} />
        <span className="absolute inset-0 flex items-center justify-center text-xs text-ink-soft">
          {px}px
        </span>
      </div>
    </div>
  );
}
