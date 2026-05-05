/**
 * Hardcoded sample plan for the .app product layer.
 *
 * Session 1 ("Foundation Movement") is built dynamically against the user's
 * resolved lead cast, so the intro/outro breath bookends always match the
 * user demographic. The body of the session mixes all four cast members
 * across the available locked clips.
 *
 * Replace with real DB-backed data in Phase 1B (after PT content +
 * sessions schema lands).
 */

import type { CastId } from "@/lib/visual/cast";

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
  cast: CastId;
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

const CAST_TO_TOKEN: Record<CastId, "MAR" | "DAV" | "ELE" | "JAM"> = {
  maria: "MAR",
  david: "DAV",
  eleanor: "ELE",
  james: "JAM",
};

/** Box-breath has all 4 cast × W+M locked. Pick the lead's W angle. */
function leadBoxBreath(lead: CastId): string {
  return `/videos/clips/A-box-breath-${CAST_TO_TOKEN[lead]}-W.mp4`;
}

/** Closing-breath has all 4 cast × M-angle locked. */
function leadClosingBreath(lead: CastId): string {
  return `/videos/clips/A-closing-breath-${CAST_TO_TOKEN[lead]}-M.mp4`;
}

/**
 * Build Session 1 — Foundation Movement, ~12 min.
 * Bookends in the lead cast; body mixes Maria/David across the available
 * locked Cohort B + C clips.
 */
export function buildSessionOne(lead: CastId): Session {
  const movements: Movement[] = [
    {
      id: "intro-breath",
      name: "Box breath - opener",
      cue: "Sit tall. In for 4, hold 4, out for 4. Find center.",
      durationSeconds: 60,
      videoUrl: leadBoxBreath(lead),
    },
    {
      id: "body-scan",
      name: "Body scan",
      cue: "Lie on your back. Notice each part of the body, head to toes.",
      durationSeconds: 90,
      videoUrl: "/videos/clips/B-body-scan-DAV-W.mp4",
    },
    {
      id: "cat-cow-seated",
      name: "Seated cat-cow",
      cue: "Hands on knees. Round and arch with the breath.",
      durationSeconds: 90,
      videoUrl: "/videos/clips/C-cat-cow-seated-MAR-W.mp4",
    },
    {
      id: "seated-figure-4",
      name: "Seated figure-4",
      cue: "Cross one ankle over the opposite knee. Gentle hinge forward.",
      durationSeconds: 90,
      videoUrl: "/videos/clips/C-seated-figure-4-MAR-W.mp4",
    },
    {
      id: "child-pose-supported",
      name: "Supported child's pose",
      cue: "Knees wide. Rest your forehead on hands or chair. Breathe.",
      durationSeconds: 60,
      videoUrl: "/videos/clips/B-child-pose-supported-MAR-W.mp4",
    },
    {
      id: "standing-hip-hinge",
      name: "Standing hip hinge",
      cue: "Soft knees. Hinge from the hips, not the back.",
      durationSeconds: 90,
      videoUrl: "/videos/clips/B-standing-hip-hinge-ELE-W.mp4",
    },
    {
      id: "weight-shifts",
      name: "Standing weight shifts",
      cue: "Feet wide. Shift slowly side to side. Stay tall.",
      durationSeconds: 60,
      videoUrl: "/videos/clips/C-weight-shifts-DAV-W.mp4",
    },
    {
      id: "single-leg-supported",
      name: "Single-leg balance (supported)",
      cue: "Fingertips on a chair or wall. Lift one foot just an inch.",
      durationSeconds: 90,
      videoUrl: "/videos/clips/B-single-leg-supported-MAR-W.mp4",
    },
    {
      id: "closing-breath",
      name: "Closing breath",
      cue: "One more round. Long inhale, longer exhale. You showed up.",
      durationSeconds: 60,
      videoUrl: leadClosingBreath(lead),
    },
  ];

  const totalSeconds = movements.reduce((s, m) => s + m.durationSeconds, 0);

  return {
    id: "day-1",
    number: 1,
    title: "Foundation Movement",
    subtitle: `${Math.round(totalSeconds / 60)} minutes`,
    durationMinutes: Math.round(totalSeconds / 60),
    cast: lead,
    welcomeCopy: "Day 1 sets the foundation. Just show up.",
    movements,
  };
}

/**
 * Static fallback session (Maria as lead) for any code path that doesn't
 * yet thread the user's lead cast through. Keep the day-1 key alive so
 * /app/session/day-1 still resolves to a playable session.
 */
export const SAMPLE_SESSIONS: Record<string, Session> = {
  "day-1": buildSessionOne("maria"),
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

export const CAST_LOOKUP: Record<
  Session["cast"],
  { name: string; image: string }
> = {
  maria: { name: "Maria", image: "/cast/maria.png" },
  david: { name: "David", image: "/cast/david.png" },
  eleanor: { name: "Eleanor", image: "/cast/eleanor.png" },
  james: { name: "James", image: "/cast/james.png" },
};
