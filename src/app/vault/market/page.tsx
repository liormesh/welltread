export const metadata = {
  title: "Market intel - Welltread Vault",
  robots: { index: false, follow: false, nocache: true },
};

export default function Market() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 space-y-16">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
          02 - Market intel
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-ink leading-[1.05]">
          The 40+ mobility market.
        </h1>
        <p className="mt-6 text-lg text-ink-soft max-w-2xl leading-relaxed">
          Sourced sizing, target audience, behavior. All US data unless flagged.
        </p>
      </header>

      <Section title="Audience size" eyebrow="A">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="py-3 font-semibold text-sage">Cohort</th>
              <th className="py-3 font-semibold text-sage">US population</th>
              <th className="py-3 font-semibold text-sage">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            <tr><td className="py-3 text-ink">Adults 40-55</td><td className="py-3 text-ink">~60M</td><td className="py-3 text-ink-soft">Census ACS 2024</td></tr>
            <tr><td className="py-3 text-ink">Adults 60+</td><td className="py-3 text-ink">~80M (76M actual; 95M projected by 2030)</td><td className="py-3 text-ink-soft">Census + AOA projections</td></tr>
            <tr><td className="py-3 text-ink">Adults 65+ smartphone owners</td><td className="py-3 text-ink">61% (and rising)</td><td className="py-3 text-ink-soft">Pew Research</td></tr>
          </tbody>
        </table>
      </Section>

      <Section title="Pain prevalence" eyebrow="B">
        <ul className="space-y-3 text-ink leading-relaxed">
          <Item>
            <strong>80%</strong> of US adults experience low back pain in their lifetime
            <small className="block text-ink-soft mt-1">NIH</small>
          </Item>
          <Item>
            <strong>1 in 4</strong> US adults 65+ falls every year - <strong>14M+ Americans</strong>
            <small className="block text-ink-soft mt-1">CDC Falls Facts 2024</small>
          </Item>
          <Item>
            <strong>3-8%</strong> muscle mass lost per decade after age 30, accelerating after 60
            <small className="block text-ink-soft mt-1">NIH sarcopenia review</small>
          </Item>
          <Item>
            Smartphone overuse multiplies office-worker neck pain risk by <strong>6x</strong>
            <small className="block text-ink-soft mt-1">Cleveland Clinic / peer-reviewed</small>
          </Item>
        </ul>
      </Section>

      <Section title="Activity gap" eyebrow="C">
        <ul className="space-y-3 text-ink leading-relaxed">
          <Item>
            Only <strong>26.4%</strong> of US adults meet both physical activity guidelines
            <small className="block text-ink-soft mt-1">CDC NCHS Data Brief 443</small>
          </Item>
          <Item>
            Only <strong>15.5%</strong> of adults 65+ meet activity guidelines - the supermajority is undertrained
            <small className="block text-ink-soft mt-1">CDC NCHS</small>
          </Item>
          <Item>
            <strong>75%</strong> of adults 50+ want to age in place
            <small className="block text-ink-soft mt-1">AARP 2024 Home & Community Preferences</small>
          </Item>
        </ul>
      </Section>

      <Section title="Hope" eyebrow="D">
        <ul className="space-y-3 text-ink leading-relaxed">
          <Item>
            Otago balance program reduces fall risk <strong>35-40%</strong>
            <small className="block text-ink-soft mt-1">NIH meta-analysis</small>
          </Item>
          <Item>
            <strong>15 minutes/day</strong> of moderate movement reduces all-cause mortality by <strong>14%</strong>, adds <strong>3 years</strong> of life expectancy
            <small className="block text-ink-soft mt-1">The Lancet, 2011</small>
          </Item>
          <Item>
            Adults 85+ gained <strong>~46% leg strength</strong> after 12 weeks of resistance training, slightly outpacing the 65-75 cohort
            <small className="block text-ink-soft mt-1">Resistance training meta-analysis</small>
          </Item>
        </ul>
      </Section>

      <Section title="TAM / SAM / SOM (illustrative)" eyebrow="E">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="py-3 font-semibold text-sage">Layer</th>
              <th className="py-3 font-semibold text-sage">Size</th>
              <th className="py-3 font-semibold text-sage">Logic</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            <tr><td className="py-3 text-ink">TAM</td><td className="py-3 text-ink">$8-12B</td><td className="py-3 text-ink-soft">140M US adults 40+ × ~$60-80/yr willingness</td></tr>
            <tr><td className="py-3 text-ink">SAM</td><td className="py-3 text-ink">$1.5-2.5B</td><td className="py-3 text-ink-soft">~25M adults 40+ with smartphones, online wellness intent, $79-99 LTV</td></tr>
            <tr><td className="py-3 text-ink">SOM</td><td className="py-3 text-ink">$15-30M</td><td className="py-3 text-ink-soft">~150-300K subscribers in years 1-3 at our LTV target</td></tr>
          </tbody>
        </table>
        <p className="mt-4 text-sm text-ink-soft">Numbers are illustrative starting points - tighten via early CAC/LTV data.</p>
      </Section>

      <p className="text-sm text-ink-soft pt-12 border-t border-line">
        Full sourced library:{" "}
        <code className="text-xs bg-paper-warm/40 px-2 py-1 rounded">
          ~/Documents/knowledge-base/projects/welltread/research/us-stats-library.md
        </code>
      </p>
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
    <section className="border-t border-line pt-8">
      <p className="text-xs uppercase tracking-[0.2em] text-clay mb-2">{eyebrow}</p>
      <h2 className="text-2xl font-semibold text-ink mb-6">{title}</h2>
      <div>{children}</div>
    </section>
  );
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-sage shrink-0" />
      <span>{children}</span>
    </li>
  );
}
