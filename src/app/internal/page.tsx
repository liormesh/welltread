import Link from "next/link";

export default function InternalIndex() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">Internal reference</p>
      <h1 className="text-5xl font-semibold tracking-tight text-ink leading-[1.05]">
        Welltread, behind the scenes.
      </h1>
      <p className="mt-6 text-lg text-ink-soft max-w-2xl">
        Living references for the brand, the system architecture, and the data model.
        Update these as the project evolves.
      </p>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          href="/internal/brand"
          eyebrow="01"
          title="Brand"
          body="Palette, type scale, components, voice. The whole visual language."
        />
        <Card
          href="/internal/architecture"
          eyebrow="02"
          title="Architecture"
          body="Acquisition → product → backend layers. Domain split. Quiz logic graph."
        />
        <Card
          href="/internal/data-model"
          eyebrow="03"
          title="Data model"
          body="9 tables, relationships, RLS strategy, scale-ready notes."
        />
      </div>
    </div>
  );
}

function Card({
  href,
  eyebrow,
  title,
  body,
}: {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-line bg-paper p-6 hover:border-sage/40 hover:shadow-sm transition-all"
    >
      <p className="text-xs text-clay font-medium tracking-wider mb-2">{eyebrow}</p>
      <h3 className="text-lg font-semibold text-ink group-hover:text-sage transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-sm text-ink-soft leading-relaxed">{body}</p>
    </Link>
  );
}
