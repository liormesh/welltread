import Link from "next/link";

export default function VaultIndex() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
        Welltread Vault
      </p>
      <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-ink leading-[1.05]">
        Everything,{" "}
        <span className="text-sage italic font-normal">in one place</span>.
      </h1>
      <p className="mt-6 text-lg text-ink-soft max-w-2xl leading-relaxed">
        Investor-facing summary, market intel, competitor analysis, market
        entry strategy, brand kit, system design, data model, and creative
        review queue. Single source of truth.
      </p>

      <section className="mt-16">
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
          The deck
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card
            href="/vault/investor"
            eyebrow="01"
            title="Investor overview"
            body="The pitch. Problem, solution, market, model, traction, ask."
          />
          <Card
            href="/vault/market"
            eyebrow="02"
            title="Market intel"
            body="TAM/SAM/SOM, US adults 40+, key behaviors, sourced stats."
          />
          <Card
            href="/vault/competitors"
            eyebrow="03"
            title="Competitor analysis"
            body="Pricing, funnels, positioning. The matrix."
          />
          <Card
            href="/vault/strategy"
            eyebrow="04"
            title="Market entry strategy"
            body="Niche sequencing, paid acq plan, milestones, risk register."
          />
        </div>
      </section>

      <section className="mt-16">
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
          Funnel
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card
            href="/vault/quiz-flow"
            eyebrow="09"
            title="Quiz flow"
            body="The full questionnaire. 28 Q's, 5 acts, branching, conditional skips, dynamic stat injection."
          />
          <Card
            href="/vault/ui-rules"
            eyebrow="10"
            title="UI rules"
            body="Selector style rules, icon vocabulary, imagery axiom, decision tree."
          />
          <Card
            href="/vault/trial-flow"
            eyebrow="11"
            title="$1 trial flow"
            body="Stripe integration design. User flow, object model, webhooks, edge cases."
          />
          <Card
            href="/vault/product-framework"
            eyebrow="12"
            title="Product framework"
            body="The 12-week course. Content composition, daily delivery, adaptation, build phases."
          />
        </div>
      </section>

      <section className="mt-16">
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
          The build
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card
            href="/vault/brand"
            eyebrow="05"
            title="Brand"
            body="Palette, type, voice, components."
          />
          <Card
            href="/vault/architecture"
            eyebrow="06"
            title="System design"
            body="Layers, quiz logic, paid-channel fan-out."
          />
          <Card
            href="/vault/data-model"
            eyebrow="07"
            title="Data model"
            body="9 tables, relationships, RLS, scale notes."
          />
        </div>
      </section>

      <section className="mt-16">
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
          Review
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card
            href="/vault/creatives"
            eyebrow="08"
            title="Creatives review"
            body="Visual language samples. Approve, reject, comment."
            highlight
          />
        </div>
      </section>
    </div>
  );
}

function Card({
  href,
  eyebrow,
  title,
  body,
  highlight,
}: {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group rounded-3xl p-7 transition-all ${
        highlight
          ? "border-2 border-sage bg-paper-warm/40 hover:bg-paper-warm/60"
          : "border border-line bg-paper hover:border-sage/40 hover:shadow-sm"
      }`}
    >
      <p className="text-xs text-clay font-medium tracking-wider mb-2">
        {eyebrow}
      </p>
      <h3 className="text-xl font-semibold text-ink group-hover:text-sage transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-sm text-ink-soft leading-relaxed">{body}</p>
    </Link>
  );
}
