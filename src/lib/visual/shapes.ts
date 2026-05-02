/**
 * Drill-shape vocabulary for Welltread.
 *
 * When a question, plan section, or content slot doesn't have a specific
 * visual target (no clear demographic to render, no clear exercise to
 * illustrate), we use these abstract shapes from the brand palette. Each
 * shape has a movement-archetype meaning, used for cinematic loaders,
 * stat-card backgrounds, breath/recovery interstitials, and any plan-reveal
 * slot where the program is mixed.
 */

export type DrillArchetype =
  | "balance"
  | "mobility"
  | "strength"
  | "recovery"
  | "breath"
  | "alignment";

export type DrillShape = {
  id: DrillArchetype;
  name: string;
  meaning: string;
  /** Where in the product to use this shape. */
  uses: string[];
  image: string;
};

export const SHAPES: Record<DrillArchetype, DrillShape> = {
  balance: {
    id: "balance",
    name: "Balance",
    meaning:
      "Equilibrium and poise. A circle held above a horizon - steady, intentional, anchored.",
    uses: [
      "Senior balance interstitials",
      "Quiz Q11-Q12 (push/listen, motivation/schedule)",
      "Stat cards about fall prevention",
    ],
    image: "/shapes/balance.png",
  },

  mobility: {
    id: "mobility",
    name: "Mobility",
    meaning:
      "Gentle release. A flowing single brushstroke from corner to corner - fluid, calligraphic.",
    uses: [
      "Stretch / flexibility sessions",
      "Quiz Q5 (body map) related interstitials",
      "Plan reveal milestone marker for week 3 (less stiff)",
    ],
    image: "/shapes/mobility.png",
  },

  strength: {
    id: "strength",
    name: "Strength",
    meaning:
      "Rooted vertical force rising from a grounded base. Stable, deliberate, structural.",
    uses: [
      "Strength sessions",
      "Plan reveal milestone marker for week 6 (stronger)",
      "Posture & Back 40+ landing page accents",
    ],
    image: "/shapes/strength.png",
  },

  recovery: {
    id: "recovery",
    name: "Recovery",
    meaning:
      "Layered horizon - dawn / dusk. Restorative, settled, end-of-day calm.",
    uses: [
      "Rest day cards in week templates",
      "Sleep-related quiz interstitials",
      "Cooldown blocks",
    ],
    image: "/shapes/recovery.png",
  },

  breath: {
    id: "breath",
    name: "Breath",
    meaning:
      "Concentric rings radiating from a single point. Rhythmic, expansive, the breath cycle.",
    uses: [
      "Breath / meditation blocks",
      "Q24 commitment slider background",
      "S5 PT insight card (after slider battery)",
    ],
    image: "/shapes/breath.png",
  },

  alignment: {
    id: "alignment",
    name: "Alignment",
    meaning:
      "Vertical axis with subtle counterweight markers. Spinal integrity, postural awareness.",
    uses: [
      "Posture-specific interstitials",
      "Plan reveal week 12 milestone marker",
      "Senior + posture LP hero accents",
    ],
    image: "/shapes/alignment.png",
  },
};

/** Pick a shape from a goal tag set or a niche. */
export function shapeForGoal(goalTag: string): DrillShape {
  const map: Record<string, DrillArchetype> = {
    balance: "balance",
    "fall-prevention": "balance",
    mobility: "mobility",
    flexibility: "mobility",
    stretch: "mobility",
    strength: "strength",
    posture: "alignment",
    rest: "recovery",
    sleep: "recovery",
    breath: "breath",
    meditation: "breath",
    alignment: "alignment",
  };
  const archetype = map[goalTag] ?? "balance";
  return SHAPES[archetype];
}
