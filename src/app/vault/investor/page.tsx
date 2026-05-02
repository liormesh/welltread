export const metadata = {
  title: "Investor overview - Welltread Vault",
  robots: { index: false, follow: false, nocache: true },
};

export default function Investor() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 space-y-20">
      {/* HERO */}
      <section>
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
          01 - Investor overview
        </p>
        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-ink leading-[1.05]">
          Welltread builds movement programs for the body{" "}
          <span className="text-sage italic font-normal">you have today</span>.
        </h1>
        <p className="mt-8 text-xl text-ink-soft max-w-2xl leading-relaxed">
          A multi-niche, PT-backed mobility platform delivered through a
          quiz-funnel app. Single backend, multiple body niches. Built for
          performance marketing scale.
        </p>
      </section>

      {/* PROBLEM */}
      <Section eyebrow="The problem">
        <Headline>
          Movement after 40 is broken at both ends.
        </Headline>
        <Body>
          Medical-grade rehab is gated behind insurance, employer benefits, or
          $200/month coaching. Consumer fitness apps are vanity-coded for
          25-year-olds, optimize for weight loss, and ignore contraindications.
          The 40+ adult who wants to move better - to keep gardening, lifting
          grandkids, walking pain-free - is left choosing between a $2,500
          physical therapist or a $14.99/month app that asks if they want to
          look good in a swimsuit.
        </Body>
        <Stats>
          <Stat
            big="80%"
            small="of US adults experience low back pain in their lifetime"
            source="NIH"
          />
          <Stat
            big="1 in 4"
            small="adults 65+ falls every year - 14M+ Americans"
            source="CDC"
          />
          <Stat
            big="26.4%"
            small="of US adults meet activity guidelines (15.5% of 65+)"
            source="CDC NCHS 2024"
          />
          <Stat
            big="75%"
            small="of adults 50+ want to age in place"
            source="AARP 2024"
          />
        </Stats>
      </Section>

      {/* SOLUTION */}
      <Section eyebrow="The solution">
        <Headline>
          A 12-week program that adjusts to you, not your demographics.
        </Headline>
        <Body>
          Welltread serves a quiz-driven, PT-designed mobility program through
          welltread.co (acquisition) and welltread.app (product). The same
          backend serves Senior Mobility 60+ today and will serve Posture & Back
          40+, Postpartum, Pelvic Floor, and GLP-1 Companion as the audience
          expands. One movement library, one assignment engine, many niches.
        </Body>
        <FeatureGrid>
          <Feature
            title="Quiz funnel acquisition"
            body="28 questions, niche-aware branching by paid keyword. Drives 4-6× higher LTV than generic onboarding."
          />
          <Feature
            title="PT-designed content"
            body="Every movement contraindication-aware. Every program clinically reviewed. Insurance-grade rigor at consumer pricing."
          />
          <Feature
            title="Composable backend"
            body="Movement → block → session → week → archetype. New niches add ~30-60 movements, not new programs."
          />
          <Feature
            title="Per-day pricing"
            body="$0.27-$0.66 per day. Anchored against coffee, not against gym memberships."
          />
        </FeatureGrid>
      </Section>

      {/* MARKET */}
      <Section eyebrow="The market">
        <Headline>
          47M US adults 60+. 60M US adults 40-55. Empty in the middle.
        </Headline>
        <Body>
          The 60+ self-pay digital wellness category is essentially uncontested.
          SilverSneakers, Bold, Hinge Health are insurance-distributed.
          Eldergym, Ageless Grace, GoldenWalkz are PDF-and-DVD legacy. The 40+
          posture/back niche is contested by BetterMe and Caliber but on
          aesthetic-fitness tonality, not clinical. We position between them.
        </Body>
        <p className="mt-6 text-sm text-ink-soft">
          Detailed sizing in <a className="text-sage hover:underline" href="/vault/market">/vault/market</a>.
        </p>
      </Section>

      {/* MODEL */}
      <Section eyebrow="Business model">
        <Headline>
          Subscription. $1 trial → 7 days → auto-bill.
        </Headline>
        <table className="mt-8 w-full text-sm">
          <thead>
            <tr className="text-left border-b border-line">
              <th className="py-3 font-semibold text-sage">Tier</th>
              <th className="py-3 font-semibold text-sage">Price</th>
              <th className="py-3 font-semibold text-sage">Per day</th>
              <th className="py-3 font-semibold text-sage">Position</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            <tr><td className="py-3 text-ink">7-day trial</td><td className="py-3 text-ink">$1</td><td className="py-3 text-ink-soft">-</td><td className="py-3 text-ink-soft">Foot in door</td></tr>
            <tr><td className="py-3 text-ink">Month 1 (auto-bill)</td><td className="py-3 text-ink">$24</td><td className="py-3 text-ink-soft">$0.80</td><td className="py-3 text-ink-soft">Conversion baseline</td></tr>
            <tr><td className="py-3 text-ink">3-month (default)</td><td className="py-3 text-ink font-semibold">$59</td><td className="py-3 text-ink-soft">$0.66</td><td className="py-3 text-ink-soft">Under BetterMe & Simple</td></tr>
            <tr><td className="py-3 text-ink">12-month (best value)</td><td className="py-3 text-ink">$99</td><td className="py-3 text-ink-soft">$0.27</td><td className="py-3 text-ink-soft">Sub-coffee anchor</td></tr>
          </tbody>
        </table>
        <p className="mt-6 text-sm text-ink-soft leading-relaxed">
          LTV math (target): ~45% trial-to-paid conversion, ~70% month-1
          retention, blended LTV $79-95. Target LTV/CAC ratio 3:1+. Margin
          structure favors cheap content production (assignment engine) and
          cheap acquisition (quiz funnel optimized over time).
        </p>
      </Section>

      {/* COMPETITION */}
      <Section eyebrow="The competition">
        <Headline>
          Mid-tier consumer wellness apps cluster at $0.27-$0.50/day. Premium
          coaching at $200/month. We position between.
        </Headline>
        <p className="mt-6 text-sm text-ink-soft">
          Detailed competitor matrix in <a className="text-sage hover:underline" href="/vault/competitors">/vault/competitors</a>.
        </p>
      </Section>

      {/* TRACTION / STATE */}
      <Section eyebrow="State of the build">
        <Headline>Functional from day 1.</Headline>
        <ChecklistGrid>
          <Check done>welltread.co + welltread.app live on Cloudflare Workers</Check>
          <Check done>Supabase backend - 9 tables, scale-ready, RLS-secured</Check>
          <Check done>Email capture pipeline + quiz session telemetry live</Check>
          <Check done>Quiz v1 with niche-aware branching shipped (28-question v2 spec'd)</Check>
          <Check done>Plan reveal + paywall scaffolding in place</Check>
          <Check>Stripe Checkout (keys arriving)</Check>
          <Check>Meta Pixel + CAPI + GA4 integration</Check>
          <Check>2-week Meta classification kill-test</Check>
        </ChecklistGrid>
      </Section>

      {/* TEAM */}
      <Section eyebrow="The team">
        <Headline>Solo operator with the right toolkit.</Headline>
        <Body>
          Lior Meshullam - Head of Product, Moonshot Marketing. Decade of
          performance-marketing-led product work. US LLC + paid acquisition
          budget committed. PT and clinical content via consultants.
        </Body>
      </Section>

      {/* ASK */}
      <Section eyebrow="The ask">
        <Headline>Watch the funnel work first.</Headline>
        <Body>
          No raise this round. The vault is for clarity, not capital.
          Post-launch, after we&rsquo;ve proven CPA/LTV economics on $5K of
          real spend, we&rsquo;ll consider strategic partnerships,
          credentialing partners (PT associations, payers), and growth capital.
          Until then we run the operation lean and let the data make the case.
        </Body>
      </Section>
    </div>
  );
}

function Section({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line pt-10">
      <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
        {eyebrow}
      </p>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Headline({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink leading-[1.15]">
      {children}
    </h2>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-lg text-ink-soft leading-relaxed max-w-3xl">
      {children}
    </p>
  );
}

function Stats({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">{children}</div>
  );
}

function Stat({ big, small, source }: { big: string; small: string; source: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-3xl font-semibold text-sage">{big}</p>
      <p className="mt-2 text-sm text-ink-soft leading-snug">{small}</p>
      <p className="mt-3 text-xs text-ink-soft/60">{source}</p>
    </div>
  );
}

function FeatureGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
      {children}
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-6">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-ink-soft leading-relaxed">{body}</p>
    </div>
  );
}

function ChecklistGrid({ children }: { children: React.ReactNode }) {
  return <ul className="mt-6 space-y-3">{children}</ul>;
}

function Check({ done, children }: { done?: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={`mt-1 inline-block h-4 w-4 rounded-full shrink-0 ${
          done ? "bg-sage" : "border border-line bg-paper"
        }`}
      />
      <span className={done ? "text-ink" : "text-ink-soft"}>{children}</span>
    </li>
  );
}
