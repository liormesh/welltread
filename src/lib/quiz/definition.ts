/**
 * Welltread quiz definition (v1).
 *
 * The quiz is a directed graph: each answer maps to the next question (or "EMAIL").
 * The `START` node uses the `source` param (from UTM) to pre-branch, so a user
 * who clicks a "senior balance" ad doesn't get asked "what brings you here?".
 *
 * Adding a niche = add a source mapping in QUIZ.start + (optionally) a niche-
 * specific question. Everything else is shared.
 */

export const QUIZ_VERSION = "v1";

export type Niche = "seniors" | "posture" | "general";

export type Source =
  | "home"
  | "seniors"
  | "posture"
  | "postpartum"
  | "pelvic-floor"
  | "glp1";

export type AnswerValue = string | string[];
export type Answers = Record<string, AnswerValue>;

export type QuestionOption = {
  value: string;
  label: string;
  helper?: string;
};

export type Question = {
  id: string;
  prompt: string;
  helper?: string;
  type: "single" | "multi";
  options: QuestionOption[];
  /** Returns the id of the next question, or "EMAIL" to advance to email capture. */
  next: (answer: AnswerValue, answers: Answers) => string | "EMAIL";
};

/**
 * Resolve the entry question id from the source param.
 * Anything we don't know defaults to the generic intake question.
 */
export function startQuestionId(source: Source): string {
  switch (source) {
    case "seniors":
      return "frequency_unsteady";
    case "posture":
      return "pain_location";
    default:
      return "intake";
  }
}

/**
 * Resolve the niche from the source + the intake answer.
 * Used to seed quiz_sessions.niche and to drive plan reveal copy.
 */
export function resolveNiche(source: Source, answers: Answers): Niche {
  if (source === "seniors") return "seniors";
  if (source === "posture") return "posture";
  const intake = answers["intake"];
  if (intake === "balance") return "seniors";
  if (intake === "back_pain") return "posture";
  return "general";
}

const QUESTIONS: Record<string, Question> = {
  intake: {
    id: "intake",
    prompt: "What brings you here today?",
    helper: "Pick the one that's loudest right now.",
    type: "single",
    options: [
      { value: "balance", label: "Balance, falling, feeling unsteady" },
      { value: "back_pain", label: "Back, neck, or posture pain" },
      { value: "general", label: "General mobility and strength" },
    ],
    next: (answer) => {
      if (answer === "balance") return "frequency_unsteady";
      if (answer === "back_pain") return "pain_location";
      return "activity_level";
    },
  },

  frequency_unsteady: {
    id: "frequency_unsteady",
    prompt: "How often do you feel unsteady on your feet?",
    helper: "Honest answers get you a better plan.",
    type: "single",
    options: [
      { value: "daily", label: "Most days" },
      { value: "weekly", label: "A few times a week" },
      { value: "rarely", label: "Rarely, but I want to stay ahead of it" },
    ],
    next: () => "conditions",
  },

  pain_location: {
    id: "pain_location",
    prompt: "Where do you feel it most?",
    type: "single",
    options: [
      { value: "lower", label: "Lower back" },
      { value: "upper", label: "Upper back or neck" },
      { value: "both", label: "Both" },
    ],
    next: () => "activity_level",
  },

  activity_level: {
    id: "activity_level",
    prompt: "How active are you right now?",
    type: "single",
    options: [
      { value: "none", label: "Not really active" },
      { value: "light", label: "A little, here and there" },
      { value: "moderate", label: "Somewhat active most weeks" },
    ],
    next: () => "conditions",
  },

  conditions: {
    id: "conditions",
    prompt: "Anything we should know about?",
    helper: "Select all that apply. We adjust around it.",
    type: "multi",
    options: [
      { value: "recent_surgery", label: "Recent surgery (last 6 months)" },
      { value: "joint_replacement", label: "Joint replacement" },
      { value: "osteoporosis", label: "Osteoporosis or low bone density" },
      { value: "diabetes", label: "Diabetes" },
      { value: "none", label: "None of the above" },
    ],
    next: () => "commitment",
  },

  commitment: {
    id: "commitment",
    prompt: "How many days a week can you realistically commit?",
    helper: "Short sessions count. We start small on purpose.",
    type: "single",
    options: [
      { value: "low", label: "2-3 days" },
      { value: "mid", label: "4-5 days" },
      { value: "flex", label: "I want maximum flexibility" },
    ],
    next: () => "EMAIL",
  },
};

export function getQuestion(id: string): Question | null {
  return QUESTIONS[id] ?? null;
}

/**
 * Mocked plan generator. Real version reads movement_library + applies
 * contraindications. This shape mirrors what the paywall page will display.
 */
export type PlanPreview = {
  title: string;
  weeks: number;
  sessionsPerWeek: number;
  focus: string[];
  caveats: string[];
};

export function previewPlan(niche: Niche, answers: Answers): PlanPreview {
  const commitment = answers["commitment"];
  const conditions = (answers["conditions"] as string[] | undefined) ?? [];
  const activity = answers["activity_level"];

  const sessionsPerWeek =
    commitment === "mid" ? 5 : commitment === "low" ? 3 : 4;

  const baseTitle: Record<Niche, string> = {
    seniors: "Your 12-week Balance & Confidence Reset",
    posture: "Your 12-week Posture & Back Reset",
    general: "Your 12-week Mobility Foundation",
  };

  const baseFocus: Record<Niche, string[]> = {
    seniors: [
      "Standing balance you can trust",
      "Functional strength for stairs and getting up",
      "Gait drills that prevent stumbles",
    ],
    posture: [
      "Mobility for the hips and thoracic spine",
      "Strength for the muscles that hold you up",
      "Day-to-day posture cues that stick",
    ],
    general: [
      "Joint mobility from the ground up",
      "Strength that translates to your day",
      "Recovery built into the week",
    ],
  };

  const caveats: string[] = [];
  if (conditions.includes("recent_surgery")) {
    caveats.push("We default to post-op-safe progressions until you're cleared.");
  }
  if (conditions.includes("joint_replacement")) {
    caveats.push("We avoid contraindicated end-ranges around your replacement.");
  }
  if (conditions.includes("osteoporosis")) {
    caveats.push("No spinal flexion-under-load. Ever.");
  }
  if (activity === "none") {
    caveats.push("Week 1 is intentionally short. We build from there.");
  }

  return {
    title: baseTitle[niche],
    weeks: 12,
    sessionsPerWeek,
    focus: baseFocus[niche],
    caveats,
  };
}
