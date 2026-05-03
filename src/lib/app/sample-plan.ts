/**
 * Hardcoded sample plan for the .app product layer (Phase 1, pre-content-pipeline).
 *
 * This stands in for what the assignment engine will produce once we have
 * the movement library + week templates + archetypes wired through Supabase.
 *
 * Replace with real DB-backed data in Phase 1B (after PT content lands).
 */

export type Movement = {
  id: string;
  name: string;
  cue: string;
  durationSeconds: number;
  videoUrl: string;
  poster?: string;
};

export type Session = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  durationMinutes: number;
  cast: "maria" | "david" | "eleanor" | "james";
  welcomeCopy: string;
  movements: Movement[];
};

export type WeekDay = {
  day: "M" | "T" | "W" | "Th" | "F" | "Sa" | "Su";
  label: string;
  kind: "session" | "rest" | "checkin";
  sessionId?: string;
  status: "done" | "today" | "future" | "skipped";
};

// Stand-in video. Lior's Veo 3.1 test render of Maria doing a cat-cow.
// Used across all 6 sample movements until the full library lands.
// Self-hosted in /public/videos so it works on .app without CORS surprises.
const PLACEHOLDER_VIDEO = "/videos/test/maria_cat_cow_v2.mp4";

export const SAMPLE_SESSIONS: Record<string, Session> = {
  "day-1": {
    id: "day-1",
    number: 1,
    title: "Foundation Movement",
    subtitle: "12 minutes - with Maria",
    durationMinutes: 12,
    cast: "maria",
    welcomeCopy: "Day 1 sets the foundation. Just show up.",
    movements: [
      {
        id: "warm-breath",
        name: "Seated breath",
        cue: "Sit comfortably. Three deep breaths.",
        durationSeconds: 45,
        videoUrl: PLACEHOLDER_VIDEO,
      },
      {
        id: "neck-rolls",
        name: "Gentle neck rolls",
        cue: "Slow circles. Stop if anything pinches.",
        durationSeconds: 60,
        videoUrl: PLACEHOLDER_VIDEO,
      },
      {
        id: "cat-cow",
        name: "Cat-cow",
        cue: "Round your back gently. Soft spine.",
        durationSeconds: 90,
        videoUrl: PLACEHOLDER_VIDEO,
      },
      {
        id: "hip-openers",
        name: "Seated hip openers",
        cue: "Cross one ankle. Hinge forward gently.",
        durationSeconds: 90,
        videoUrl: PLACEHOLDER_VIDEO,
      },
      {
        id: "standing-balance",
        name: "Standing balance basics",
        cue: "Chair within reach. One foot lifted slightly.",
        durationSeconds: 120,
        videoUrl: PLACEHOLDER_VIDEO,
      },
      {
        id: "cooldown-breath",
        name: "Closing breath",
        cue: "Three deep breaths. You're done.",
        durationSeconds: 45,
        videoUrl: PLACEHOLDER_VIDEO,
      },
    ],
  },
};

export const SAMPLE_WEEK: WeekDay[] = [
  { day: "M", label: "Day 7 - Hip openers", kind: "session", sessionId: "day-1", status: "done" },
  { day: "T", label: "Rest day", kind: "rest", status: "done" },
  { day: "W", label: "Day 8 - Foundation Strength", kind: "session", sessionId: "day-1", status: "today" },
  { day: "Th", label: "Day 9 - Ankle mobility flow", kind: "session", sessionId: "day-1", status: "future" },
  { day: "F", label: "Day 10 - Standing balance", kind: "session", sessionId: "day-1", status: "future" },
  { day: "Sa", label: "Rest day", kind: "rest", status: "future" },
  { day: "Su", label: "Weekly check-in", kind: "checkin", status: "future" },
];

export const SAMPLE_USER = {
  firstName: "Eleanor",
  niche: "seniors" as const,
  activity: "garden without your back hurting",
  streakDays: 7,
  weekNumber: 2,
  weekTheme: "Hip and ankle mobility",
  weekThemeBody: "Building range so the strength work has somewhere to go.",
};

/**
 * Cast portrait + display name lookup, for /app screens that show
 * the session's guide.
 */
export const CAST_LOOKUP: Record<
  Session["cast"],
  { name: string; image: string }
> = {
  maria: { name: "Maria", image: "/cast/maria.png" },
  david: { name: "David", image: "/cast/david.png" },
  eleanor: { name: "Eleanor", image: "/cast/eleanor.png" },
  james: { name: "James", image: "/cast/james.png" },
};
