import { CAST } from "@/lib/visual/cast";

export const metadata = {
  title: "Course library - Welltread Vault",
  robots: { index: false, follow: false, nocache: true },
};

const ROOM_REFS = [
  { src: "/scenes/room-refs/01-window-wall.png", label: "Window wall" },
  { src: "/scenes/room-refs/02-opposite-wall.png", label: "Opposite wall" },
  { src: "/scenes/room-refs/03-back-wall.png", label: "Back wall (canonical brand backdrop)" },
  { src: "/scenes/room-refs/04-wide-centre.png", label: "Wide centre POV" },
  { src: "/scenes/room-refs/05-side-wall-like-wall-pushup.png", label: "Side wall (wall-pushup framing)" },
];

type Clip = { id: string; cast: string; angle: "W" | "M" };

const COHORT_A: { slug: string; name: string; clips: Clip[] }[] = [
  {
    slug: "box-breath",
    name: "Box breath (opener)",
    clips: [
      { id: "A-box-breath-MAR-W", cast: "Maria", angle: "W" },
      { id: "A-box-breath-MAR-M", cast: "Maria", angle: "M" },
      { id: "A-box-breath-DAV-W", cast: "David", angle: "W" },
      { id: "A-box-breath-DAV-M", cast: "David", angle: "M" },
      { id: "A-box-breath-ELE-W", cast: "Eleanor", angle: "W" },
      { id: "A-box-breath-ELE-M", cast: "Eleanor", angle: "M" },
      { id: "A-box-breath-JAM-W", cast: "James", angle: "W" },
      { id: "A-box-breath-JAM-M", cast: "James", angle: "M" },
    ],
  },
  {
    slug: "closing-breath",
    name: "Closing breath",
    clips: [
      { id: "A-closing-breath-MAR-M", cast: "Maria", angle: "M" },
      { id: "A-closing-breath-DAV-M", cast: "David", angle: "M" },
      { id: "A-closing-breath-JAM-M", cast: "James", angle: "M" },
    ],
  },
];

const COHORT_C: { slug: string; name: string; clips: Clip[] }[] = [
  {
    slug: "cat-cow-seated",
    name: "Cat-cow (seated)",
    clips: [{ id: "C-cat-cow-seated-MAR-W", cast: "Maria", angle: "W" }],
  },
  {
    slug: "seated-figure-4",
    name: "Seated figure-4",
    clips: [{ id: "C-seated-figure-4-MAR-W", cast: "Maria", angle: "W" }],
  },
  {
    slug: "weight-shifts",
    name: "Weight shifts (standing)",
    clips: [{ id: "C-weight-shifts-DAV-W", cast: "David", angle: "W" }],
  },
];

const COHORT_B: { slug: string; name: string; clips: Clip[] }[] = [
  {
    slug: "body-scan",
    name: "Body scan (supine)",
    clips: [
      { id: "B-body-scan-DAV-W", cast: "David", angle: "W" },
      { id: "B-body-scan-DAV-M", cast: "David", angle: "M" },
      { id: "B-body-scan-JAM-W", cast: "James", angle: "W" },
      { id: "B-body-scan-JAM-M", cast: "James", angle: "M" },
    ],
  },
  {
    slug: "child-pose-supported",
    name: "Child's pose (supported)",
    clips: [
      { id: "B-child-pose-supported-MAR-W", cast: "Maria", angle: "W" },
      { id: "B-child-pose-supported-ELE-W", cast: "Eleanor", angle: "W" },
    ],
  },
  {
    slug: "single-leg-supported",
    name: "Single-leg balance (supported)",
    clips: [
      { id: "B-single-leg-supported-MAR-W", cast: "Maria", angle: "W" },
      { id: "B-single-leg-supported-MAR-M", cast: "Maria", angle: "M" },
      { id: "B-single-leg-supported-DAV-W", cast: "David", angle: "W" },
      { id: "B-single-leg-supported-ELE-W", cast: "Eleanor", angle: "W" },
    ],
  },
  {
    slug: "standing-hip-hinge",
    name: "Standing hip hinge",
    clips: [
      { id: "B-standing-hip-hinge-ELE-W", cast: "Eleanor", angle: "W" },
      { id: "B-standing-hip-hinge-JAM-W", cast: "James", angle: "W" },
      { id: "B-standing-hip-hinge-JAM-M", cast: "James", angle: "M" },
    ],
  },
];

export default function CourseLibrary() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 space-y-16">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
          Course library
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-ink leading-[1.05]">
          Production{" "}
          <span className="text-sage italic font-normal">assets</span>.
        </h1>
        <p className="mt-6 text-lg text-ink-soft max-w-2xl leading-relaxed">
          The recurring creatives the course leans on. Cast portraits, the
          studio room references, and every locked clip generated to date.
        </p>
      </header>

      <section className="border-t border-line pt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-ink mb-2">
          Cast
        </h2>
        <p className="text-sm text-ink-soft mb-8">
          Four canonical reference portraits used as identity anchors for every
          generated still and video.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(Object.values(CAST) as { id: string; name: string; age: number; canonicalImage: string }[]).map(
            (c) => (
              <figure key={c.id} className="space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.canonicalImage}
                  alt={`${c.name} canonical portrait`}
                  className="w-full rounded-lg border border-line"
                />
                <figcaption className="text-xs text-ink-soft">
                  <span className="font-medium text-ink">{c.name}</span> · {c.age}
                </figcaption>
              </figure>
            ),
          )}
        </div>
      </section>

      <section className="border-t border-line pt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-ink mb-2">
          Studio room references
        </h2>
        <p className="text-sm text-ink-soft mb-8">
          Empty-studio shots locking the geometry: a single residential window,
          paper-cream walls, white skirting at the floor join, mid-tone oak
          plank floor.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {ROOM_REFS.map((r) => (
            <figure key={r.src} className="space-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={r.src}
                alt={r.label}
                className="w-full rounded-lg border border-line"
              />
              <figcaption className="text-xs text-ink-soft">{r.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="border-t border-line pt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-ink mb-2">
          Cohort A — bookend clips
        </h2>
        <p className="text-sm text-ink-soft mb-8">
          The opening and closing breath clips that frame every session.
        </p>
        {COHORT_A.map((mv) => (
          <MovementBlock key={mv.slug} movement={mv} />
        ))}
      </section>

      <section className="border-t border-line pt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-ink mb-2">
          Cohort B — multi-use movements
        </h2>
        <p className="text-sm text-ink-soft mb-8">
          Movements reused across 3+ sessions. Wide (W) and medium (M) angles
          per cast member.
        </p>
        {COHORT_B.map((mv) => (
          <MovementBlock key={mv.slug} movement={mv} />
        ))}
      </section>

      <section className="border-t border-line pt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-ink mb-2">
          Cohort C — twice-used movements
        </h2>
        <p className="text-sm text-ink-soft mb-8">
          Movements reused across exactly 2 sessions. Wide angle only at this
          stage.
        </p>
        {COHORT_C.map((mv) => (
          <MovementBlock key={mv.slug} movement={mv} />
        ))}
      </section>
    </div>
  );
}

function MovementBlock({
  movement,
}: {
  movement: { slug: string; name: string; clips: Clip[] };
}) {
  return (
    <div className="mb-10">
      <h3 className="text-sm uppercase tracking-[0.15em] text-clay mb-3">
        {movement.name}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {movement.clips.map((clip) => (
          <figure key={clip.id} className="space-y-2">
            <video
              src={`/videos/clips/${clip.id}.mp4`}
              className="w-full rounded-lg border border-line bg-paper-warm"
              controls
              preload="metadata"
              muted
              playsInline
            />
            <figcaption className="text-xs text-ink-soft">
              <span className="font-medium text-ink">{clip.cast}</span>
              <span className="mx-1">·</span>
              <span className="uppercase tracking-wider">{clip.angle === "W" ? "wide" : "medium"}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
