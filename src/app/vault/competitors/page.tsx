export const metadata = {
  title: "Competitor analysis - Welltread Vault",
  robots: { index: false, follow: false, nocache: true },
};

type Comp = {
  brand: string;
  type: string;
  trial: string;
  best: string;
  perDay: string;
  qLen: string;
  bodyMap: string;
  tone: string;
  notes: string;
};

const COMPS: Comp[] = [
  {
    brand: "Reverse Health",
    type: "Closest analog",
    trial: "None",
    best: "$26.77 / 12wk",
    perDay: "$0.31",
    qLen: "~25-35",
    bodyMap: "No",
    tone: "Warm, age-affirming",
    notes: "Women 40+. Menopause-aware. 30-day money-back. Tightest demographic match.",
  },
  {
    brand: "BetterMe Pilates",
    type: "Closest analog",
    trial: "$1.97-$13.99 / 7d",
    best: "3-mo (~$15-20/mo)",
    perDay: "~$0.50",
    qLen: "~30-40",
    bodyMap: "No",
    tone: "High-energy, pushy",
    notes: "Hundreds of vertical sub-domains. Dark-pattern auto-renew.",
  },
  {
    brand: "Noom",
    type: "Gold standard",
    trial: "$0.50-$18.37 / 14d (PWYW)",
    best: "12-mo $209",
    perDay: "$0.57",
    qLen: "~96 screens",
    bodyMap: "No",
    tone: "Psychology-led",
    notes: "Web-to-app pioneer. ~$750M ARR off this funnel.",
  },
  {
    brand: "Sunnyside",
    type: "Gold standard",
    trial: "15-day free",
    best: "$99/yr",
    perDay: "$0.27",
    qLen: "~15-20",
    bodyMap: "No",
    tone: "Anti-shame, calm",
    notes: "Shorter funnel works because no-card trial = low friction.",
  },
  {
    brand: "Reframe",
    type: "Gold standard",
    trial: "7-day free",
    best: "$99.99/yr",
    perDay: "$0.27",
    qLen: "~25-35",
    bodyMap: "No",
    tone: "Neuroscience framing",
    notes: "Loss-frame + gain-frame pair worth stealing.",
  },
  {
    brand: "Simple",
    type: "Gold standard",
    trial: "7-day",
    best: "6-mo (cited $0.42/d)",
    perDay: "$0.42",
    qLen: "~30-40",
    bodyMap: "No",
    tone: "Cinematic",
    notes: "Best calculating loader in the genre. Icon-only first questions.",
  },
  {
    brand: "SilverSneakers",
    type: "Senior - insurance",
    trial: "n/a",
    best: "$0 (Medicare)",
    perDay: "$0",
    qLen: "~5",
    bodyMap: "No",
    tone: "Institutional",
    notes: "Eligibility lookup, not a quiz. Zero clinical content.",
  },
  {
    brand: "Bold (agebold.com)",
    type: "Senior - insurance + self-pay",
    trial: "via plan",
    best: "$0 if covered, self-pay opaque",
    perDay: "var",
    qLen: "~15",
    bodyMap: "No (text checkbox)",
    tone: "Warm-clinical",
    notes: "Closest tone match for our 60+ niche. UnitedHealth Renew Active distribution.",
  },
  {
    brand: "Hinge Health",
    type: "Clinical-grade",
    trial: "n/a (employer-paid)",
    best: "$0 (employer)",
    perDay: "$0",
    qLen: "~20-30",
    bodyMap: "Yes - clickable",
    tone: "Clinical",
    notes: "Body diagram + NRS pain scale + red-flag screen. Our credibility benchmark.",
  },
  {
    brand: "Future",
    type: "Premium 1:1",
    trial: "$50 first month",
    best: "$199/mo",
    perDay: "$6.63",
    qLen: "5-7",
    bodyMap: "No",
    tone: "Premium-aspirational",
    notes: "Different category. Quiz is short; real depth is the human onboarding call.",
  },
  {
    brand: "Caliber",
    type: "Men 40+ strength",
    trial: "7-day free (Pro)",
    best: "$19/mo (Pro) or $199/mo (Premium 1:1)",
    perDay: "$0.63",
    qLen: "31",
    bodyMap: "No",
    tone: "Data-driven masculine",
    notes: "Has 'testosterone deficiency' as health risk - consumer cosplay of clinical.",
  },
  {
    brand: "Mighty Health",
    type: "50+ wellness",
    trial: "7-day free",
    best: "$29/mo",
    perDay: "~$0.50",
    qLen: "~10",
    bodyMap: "No",
    tone: "Coaching-warm",
    notes: "Heavy affiliate marketing. Influencer coupon codes (e.g. 60% off).",
  },
  {
    brand: "Sweat (Itsines)",
    type: "Catalog",
    trial: "7-day free",
    best: "$134.99/yr",
    perDay: "$0.37",
    qLen: "5-7",
    bodyMap: "No",
    tone: "Athletic, motivational",
    notes: "Program catalog, not a personalized plan. Different model.",
  },
  {
    brand: "FitOn",
    type: "Freemium",
    trial: "n/a",
    best: "$30/yr Pro",
    perDay: "$0.08",
    qLen: "~10-15",
    bodyMap: "No",
    tone: "Mass-market friendly",
    notes: "Free base app. Different econ - LTV via meal plans + ads.",
  },
];

export default function Competitors() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 space-y-12">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
          03 - Competitor analysis
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-ink leading-[1.05]">
          Where everyone sits.
        </h1>
        <p className="mt-6 text-lg text-ink-soft max-w-3xl leading-relaxed">
          Pricing, funnel length, body diagram, tone. The matrix. Our slot
          is between mid-tier consumer wellness ($0.27-$0.50/day) and premium
          1:1 coaching ($199/mo) - with a clinical-credibility cue (body
          diagram) that no consumer brand has.
        </p>
      </header>

      <section>
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-paper-warm/40">
              <tr className="text-left">
                <th className="px-4 py-4 font-semibold text-sage">Brand</th>
                <th className="px-4 py-4 font-semibold text-sage">Type</th>
                <th className="px-4 py-4 font-semibold text-sage">Trial</th>
                <th className="px-4 py-4 font-semibold text-sage">Best tier</th>
                <th className="px-4 py-4 font-semibold text-sage">$/day</th>
                <th className="px-4 py-4 font-semibold text-sage">Q's</th>
                <th className="px-4 py-4 font-semibold text-sage">Body map</th>
                <th className="px-4 py-4 font-semibold text-sage">Tone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60 bg-paper">
              {COMPS.map((c) => (
                <tr key={c.brand}>
                  <td className="px-4 py-4 align-top">
                    <p className="font-semibold text-ink">{c.brand}</p>
                    <p className="mt-1 text-xs text-ink-soft leading-snug">{c.notes}</p>
                  </td>
                  <td className="px-4 py-4 text-ink-soft align-top">{c.type}</td>
                  <td className="px-4 py-4 text-ink-soft align-top">{c.trial}</td>
                  <td className="px-4 py-4 text-ink-soft align-top">{c.best}</td>
                  <td className="px-4 py-4 text-ink-soft align-top">{c.perDay}</td>
                  <td className="px-4 py-4 text-ink-soft align-top">{c.qLen}</td>
                  <td className="px-4 py-4 text-ink-soft align-top">{c.bodyMap}</td>
                  <td className="px-4 py-4 text-ink-soft align-top">{c.tone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border-t border-line pt-10">
        <h2 className="text-2xl font-semibold text-ink mb-6">
          Where we slot in
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Insight
            title="Below BetterMe and Simple on price"
            body="$0.66/day at default tier vs their $0.42-$0.50. We trade margin for entry."
          />
          <Insight
            title="On par with Sunnyside and Reframe annual"
            body="$0.27/day at the 12-month tier matches their headline anchor."
          />
          <Insight
            title="Above Reverse Health on price (per tier)"
            body="They run $0.31/day on best-tier; we're $0.27. Functionally tied."
          />
          <Insight
            title="Below Hinge Health and Future categorically"
            body="Those are clinical/premium plays at $200+/mo. Different audience."
          />
          <Insight
            title="Body diagram = our differentiator"
            body="No consumer brand has it. Hinge Health is the only one. We adopt it."
          />
          <Insight
            title="60+ self-pay quiz funnel = empty"
            body="SilverSneakers/Bold/Hinge are insurance-distributed. Eldergym/Ageless Grace are PDFs. We're alone in this slot."
          />
        </div>
      </section>

      <p className="text-sm text-ink-soft pt-12 border-t border-line">
        Full mappings:{" "}
        <code className="text-xs bg-paper-warm/40 px-2 py-1 rounded">
          ~/Documents/knowledge-base/projects/welltread/research/competitors-*.md
        </code>
      </p>
    </div>
  );
}

function Insight({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <h3 className="text-base font-semibold text-sage">{title}</h3>
      <p className="mt-2 text-sm text-ink-soft leading-relaxed">{body}</p>
    </div>
  );
}
