/**
 * Welltread cast - the recurring characters used across the brand.
 *
 * Each cast member has a stable visual description that can be appended
 * to any prompt to keep their look consistent across new generations.
 *
 * Usage: when generating a new image of Eleanor, prepend
 * `CAST.eleanor.description` to the scene-specific prompt. Reference the
 * canonical image in the prompt as well to bias toward facial consistency.
 */

import type { Niche } from "@/lib/quiz/definition";

export type Gender = "female" | "male" | "nonbinary";
export type AgeBand = "40-49" | "50-59" | "60-69" | "70+";

export type CastMember = {
  id: string;
  name: string;
  age: number;
  ageBand: AgeBand;
  gender: Gender;
  ethnicity: string;
  niches: Niche[];
  /** One-line tag for use in UI metadata. */
  tagline: string;
  /** Detailed visual description, prompt-ready. Append scene-specific direction after. */
  description: string;
  canonicalImage: string;
};

export const CAST = {
  eleanor: {
    id: "eleanor",
    name: "Eleanor",
    age: 67,
    ageBand: "60-69",
    gender: "female",
    ethnicity: "white",
    niches: ["seniors"],
    tagline: "Senior Mobility 60+ - the steady-and-curious archetype",
    description:
      "A 67-year-old white woman named Eleanor. Distinctive features: shoulder-length silver-grey hair worn loose with a slight wave, soft smile lines around warm hazel eyes, slim build, narrow shoulders, slightly elongated face, peaceful natural expression with mouth gently closed. Wearing a fitted sage-green long-sleeve henley and natural-color linen wide-leg pants. Real natural skin texture with visible age lines, no makeup, dignified.",
    canonicalImage: "/cast/eleanor.png",
  },

  james: {
    id: "james",
    name: "James",
    age: 70,
    ageBand: "70+",
    gender: "male",
    ethnicity: "Black",
    niches: ["seniors"],
    tagline: "Senior Mobility 70+ - the dignified-and-strong archetype",
    description:
      "A 70-year-old Black man named James. Distinctive features: full short-cropped grey hair, neatly trimmed grey beard along his jawline, tall lean athletic build, broad shoulders, deep brown eyes with gentle smile lines at the corners, calm thoughtful expression with mouth gently closed. Wearing a soft sage-green long-sleeve henley and loose charcoal cotton joggers. Real natural skin texture with visible age lines, dignified.",
    canonicalImage: "/cast/james.png",
  },

  maria: {
    id: "maria",
    name: "Maria",
    age: 52,
    ageBand: "50-59",
    gender: "female",
    ethnicity: "Latina",
    niches: ["posture", "general"],
    tagline: "Posture & General 40-50s - the working-mom-of-grown-kids archetype",
    description:
      "A 52-year-old Latina woman named Maria. Distinctive features: dark brown hair pulled back into a low casual ponytail at the nape of her neck with a few loose strands, warm brown almond-shaped eyes, full eyebrows, athletic-but-real build (toned but not gym-perfect, slight midsection softness, real proportions), warm olive skin with light natural makeup, slight smile lines, peaceful focused expression with mouth gently closed. Wearing a fitted sage-green tank top and natural-color linen wide-leg pants. Real natural skin texture, no airbrushing.",
    canonicalImage: "/cast/maria.png",
  },

  david: {
    id: "david",
    name: "David",
    age: 47,
    ageBand: "40-49",
    gender: "male",
    ethnicity: "white",
    niches: ["posture", "general"],
    tagline: "Posture & Back 40+ men - the desk-job-but-still-fighting archetype",
    description:
      "A 47-year-old white man named David. Distinctive features: salt-and-pepper hair (mostly brown with grey at the temples) worn short and slightly tousled, brown eyes behind subtle round wire-frame glasses, light brown beard stubble of two days, slight desk-job softness around the midsection (real, average build), warm tan skin with mild sun marks, calm focused expression with mouth gently closed (no smile, slightly serious but warm). Wearing a sage-green long-sleeve henley with the top two buttons open and tan cotton chinos rolled at the ankle. Real natural skin texture, dignified, professional.",
    canonicalImage: "/cast/david.png",
  },
} satisfies Record<string, CastMember>;

export type CastId = keyof typeof CAST;

/** Pick the cast member best matched to a niche + age band, with sensible fallbacks. */
export function castFor(niche: Niche, ageBand?: AgeBand): CastMember {
  const candidates: CastMember[] = (Object.values(CAST) as CastMember[]).filter(
    (c) => (c.niches as Niche[]).includes(niche),
  );
  if (ageBand) {
    const exact = candidates.find((c) => c.ageBand === ageBand);
    if (exact) return exact;
  }
  return candidates[0] ?? CAST.maria;
}

/**
 * Cast rotation across the 12-session arc, niche-aware.
 *
 * Rules:
 * - Each character demonstrates 3 sessions (per `course-v1-niche-lock.md`).
 * - Rotation pattern depends on niche:
 *     - seniors: Eleanor + James anchor (chair-supported, dignified strength).
 *       Order: Eleanor, James, Maria, David — repeat. Senior anchors land first
 *       in each cycle so the user sees themselves represented immediately.
 *     - posture: David + Maria anchor (desk-job, peer-of-the-cohort).
 *       Order: David, Maria, James, Eleanor — repeat.
 *     - general (default): balanced.
 *       Order: Maria, David, Eleanor, James — repeat.
 *
 * Brand emotional moments (per /vault/user-journey §H):
 * - For senior niche: Eleanor's session 7 + James's session 12 are explicit
 *   beats. The default rotation lands Eleanor on day 1 and 5; we shift the
 *   senior rotation by +2 so she appears on day 3, 7, 11 (which matches the
 *   locked distribution: M/D/E/J = sessions 1/2/3/4 → 5/6/7/8 → 9/10/11/12).
 *   Senior order: Eleanor, James, Maria, David — Eleanor lands on session 1, 5, 9.
 *   That doesn't match. Let me redo:
 *
 *   Locked: Maria 1/5/9, David 2/6/10, Eleanor 3/7/11, James 4/8/12.
 *   So the order MDEJ (Maria, David, Eleanor, James) is the canonical one.
 *   For senior niche, we keep this ordering — Eleanor still anchors sessions 7
 *   and 11 (the brand moments) — but we LEAD the funnel + onboarding messaging
 *   with Eleanor's portrait, not Maria's. The session rotation itself stays.
 */
export function castForSession(niche: Niche, sessionNumber: number): CastMember {
  // Locked distribution per course-v1-niche-lock.md: M/D/E/J across sessions
  // 1/2/3/4 → cycle. This is the canonical order, niche-independent.
  const cycle = ["maria", "david", "eleanor", "james"] as const;
  const idx = ((sessionNumber - 1) % cycle.length + cycle.length) % cycle.length;
  return CAST[cycle[idx]];
}

/**
 * Lead character for top-of-funnel hero, plan-reveal portrait, welcome
 * email, and re-engagement email voice. Niche + gender adjusted.
 *
 * The relatable-imagery axiom (per `feedback_aspirational_vs_relatable.md`)
 * says match the user's demographic. So:
 *
 *   - Senior + female  → Eleanor
 *   - Senior + male    → James
 *   - Posture + female → Maria
 *   - Posture + male   → David
 *   - General + female → Maria (default warmth)
 *   - General + male   → David (default peer)
 *
 * Gender unspecified (LP / pre-quiz, or user picked "prefer not to say"):
 * fall back to the niche's default anchor (a female cast member, since
 * 40+/60+ wellness skews majority female).
 *
 * The session-by-session rotation does NOT change per niche or gender; only
 * the lead does.
 */
export type GenderInput = "female" | "male" | "skip" | undefined | null;

export function leadCastFor(niche: Niche, gender?: GenderInput): CastMember {
  const isMale = gender === "male";
  switch (niche) {
    case "seniors":
      return isMale ? CAST.james : CAST.eleanor;
    case "posture":
      return isMale ? CAST.david : CAST.maria;
    default:
      return isMale ? CAST.david : CAST.maria;
  }
}
