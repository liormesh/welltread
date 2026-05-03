export const metadata = {
  title: "Market entry strategy - Welltread Vault",
  robots: { index: false, follow: false, nocache: true },
};

export default function Strategy() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 space-y-16">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
          04 - Market entry strategy
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-ink leading-[1.05]">
          How we win,{" "}
          <span className="text-sage italic font-normal">in order</span>.
        </h1>
        <p className="mt-6 text-lg text-ink-soft max-w-2xl leading-relaxed">
          Niche sequencing, paid acquisition plan, milestones, risk register.
        </p>
      </header>

      <Section eyebrow="Phase 0" title="Acquisition funnel — complete (now → ~2 weeks)">
        <Body>
          Build and ship the entire pre-Stripe acquisition layer: 28-question
          quiz v2, all interstitials, all visuals (cast portraits, drill
          shapes, body diagram), all niche-specific LPs, plan-reveal page with
          activity-plug-in hero, paywall scaffolding (no charge yet), and the
          email pipeline. End state: a user can click an ad, complete the
          full quiz, see a personalized plan reveal, and land on a paywall
          screen. The funnel is clickable end-to-end before any payment is
          processed.
        </Body>
        <ChecklistGrid>
          <Check>28-question quiz v2 live (refactor from current v1)</Check>
          <Check>Custom body-diagram component for Q5</Check>
          <Check>Slider-battery component for Q11-Q18</Check>
          <Check>Free-text + chips component for Q19</Check>
          <Check>Cinematic loader (S10) with shape morphing</Check>
          <Check>Plan reveal v2 with Q19 answer plugged into hero copy</Check>
          <Check>Paywall page with 3-tier layout, per-day pricing, money-back badge</Check>
          <Check>Cast-portrait + drill-shape integration across all question slots</Check>
          <Check>UGC ad creative batch (30-50 variants via Billo)</Check>
        </ChecklistGrid>
      </Section>

      <Section eyebrow="Phase 1" title="Product — training plan + hybrid app (weeks 2-8)">
        <Body>
          Build the actual product the user paid for. Stripe live. Composable
          training plan engine (movement → block → session → week → archetype)
          with PT-recorded movement library and contraindication-aware
          assignment engine. Hybrid app via PWA-first (welltread.app) with
          Capacitor wrappers for iOS/Android stores. This is where we earn
          retention.
        </Body>
        <ChecklistGrid>
          <Check>Stripe Checkout + webhook → user_plans creation</Check>
          <Check>blocks / sessions / week_templates / program_archetypes tables</Check>
          <Check>Assignment engine v1 (niche + contraindications + equipment filter)</Check>
          <Check>First 80-100 PT-recorded movement videos (in-studio batch)</Check>
          <Check>12 week templates per niche, hand-built by PT</Check>
          <Check>welltread.app PWA: dashboard, today's session, weekly check-in</Check>
          <Check>iOS/Android Capacitor wrappers, store listing prep (ASO)</Check>
        </ChecklistGrid>
      </Section>

      <Section eyebrow="Phase 2" title="Paid acquisition + scale (weeks 8-16)">
        <Body>
          Now we spend. Paid social / paid search at scale, with a working
          product behind the funnel. Server-side event router for clean
          attribution. Iterate on creative + funnel based on real CPA/LTV
          data. Add 3rd niche based on the CPA winner direction.
        </Body>
        <ChecklistGrid>
          <Check>Meta + TikTok pixel + CAPI + click-ID matching</Check>
          <Check>$500 Meta classification kill-test → scale on winners</Check>
          <Check>Personalization v1 (manual user-flagged adaptation)</Check>
          <Check>Add 3rd niche (postpartum or GLP-1 based on winner)</Check>
          <Check>Affiliate program via Rewardful (post-CPA validation)</Check>
        </ChecklistGrid>
      </Section>

      <Section eyebrow="Phase 3" title="Adapt + retain (months 5-9)">
        <Body>
          Adaptive assignment engine. Cross-niche recommendations. Native
          performance optimization. Strategic content partnerships with PT
          influencers (curated, not open marketplace).
        </Body>
        <ChecklistGrid>
          <Check>Auto-adaptation on completion data</Check>
          <Check>Re-eval at week 4 and week 8</Check>
          <Check>5-10 hand-picked PT/coach partnerships (Peloton-instructor model)</Check>
        </ChecklistGrid>
      </Section>

      <Section eyebrow="Risks" title="What can kill this">
        <RiskList>
          <Risk
            title="Meta classification flag"
            level="Medium"
            mitigation="Lifestyle-only creative, no medical claims, no before/afters of bodies. Pre-test with $500 kill-test."
          />
          <Risk
            title="Content production debt"
            level="Medium"
            mitigation="Composable architecture (movement → block → session). New niches add ~30-60 movements, not bespoke programs."
          />
          <Risk
            title="Liability on senior content"
            level="Medium-High"
            mitigation="PT review of every published movement. Contraindication-aware assignment engine. Red-flag screening in quiz. LLC structure."
          />
          <Risk
            title="60+ smartphone friction"
            level="Low-Medium"
            mitigation="61% of 65+ have smartphones. Design for accessibility (large touch targets, high contrast, system fonts). Email-friendly secondary channel."
          />
          <Risk
            title="CAC inflation post-iOS17 / privacy changes"
            level="Medium"
            mitigation="Server-side CAPI/Events API for both Meta and TikTok. Quiz funnel = 1st-party data engine. Less reliant on signal degradation."
          />
          <Risk
            title="Competitor undercutting"
            level="Low"
            mitigation="BetterMe and Reverse Health are price-stable. Race to bottom is unlikely. Differentiation on PT credibility, not price."
          />
        </RiskList>
      </Section>

      <Section eyebrow="Milestones" title="What good looks like">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="py-3 font-semibold text-sage">Milestone</th>
              <th className="py-3 font-semibold text-sage">Target</th>
              <th className="py-3 font-semibold text-sage">By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            <tr><td className="py-3 text-ink">Meta classification clean</td><td className="py-3 text-ink-soft">No fragile flags, CPM &lt; $40</td><td className="py-3 text-ink-soft">Week 2</td></tr>
            <tr><td className="py-3 text-ink">Quiz CPL</td><td className="py-3 text-ink-soft">$3-5 per email</td><td className="py-3 text-ink-soft">Week 2</td></tr>
            <tr><td className="py-3 text-ink">Trial start CPA</td><td className="py-3 text-ink-soft">$15-25</td><td className="py-3 text-ink-soft">Week 4</td></tr>
            <tr><td className="py-3 text-ink">Trial-to-paid</td><td className="py-3 text-ink-soft">40-50%</td><td className="py-3 text-ink-soft">Week 6</td></tr>
            <tr><td className="py-3 text-ink">Month-1 retention</td><td className="py-3 text-ink-soft">70%</td><td className="py-3 text-ink-soft">Month 2</td></tr>
            <tr><td className="py-3 text-ink">LTV/CAC</td><td className="py-3 text-ink-soft">3:1+</td><td className="py-3 text-ink-soft">Month 3</td></tr>
            <tr><td className="py-3 text-ink">First $50K MRR</td><td className="py-3 text-ink-soft">~600 active subs</td><td className="py-3 text-ink-soft">Month 6</td></tr>
          </tbody>
        </table>
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
      <p className="text-xs uppercase tracking-[0.2em] text-clay mb-2">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-ink mb-6">
        {title}
      </h2>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-lg text-ink-soft leading-relaxed max-w-3xl">
      {children}
    </p>
  );
}

function ChecklistGrid({ children }: { children: React.ReactNode }) {
  return <ul className="space-y-2">{children}</ul>;
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-ink">
      <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-sage shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function RiskList({ children }: { children: React.ReactNode }) {
  return <div className="space-y-3">{children}</div>;
}

function Risk({
  title,
  level,
  mitigation,
}: {
  title: string;
  level: string;
  mitigation: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        <span className="text-xs uppercase tracking-wider text-clay shrink-0">
          {level}
        </span>
      </div>
      <p className="mt-2 text-sm text-ink-soft leading-relaxed">
        Mitigation: {mitigation}
      </p>
    </div>
  );
}
