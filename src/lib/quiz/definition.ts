/**
 * Welltread quiz definition v2.
 *
 * 28 questions in 5 acts, with interstitial screens woven between.
 * Branching:
 *   - source=seniors enters at Q3 (skips Q1)
 *   - source=posture enters at Q2 (skips Q1)
 *   - source=home enters at Q1 (full intake)
 *
 * Conditional skips:
 *   - Q6 only if Q5 has any selection (not just "none")
 *   - Q23 only if Q22 = "yes"
 *
 * Interstitials are non-question screens (stat cards, reassurance, educational,
 * PT insight, testimonials, cinematic loader). They live in the same flow as
 * questions and are surfaced by id.
 */

export const QUIZ_VERSION = "v2";

export type Niche = "seniors" | "posture" | "general";

export type Source =
  | "home"
  | "seniors"
  | "posture"
  | "postpartum"
  | "pelvic-floor"
  | "glp1";

export type AnswerValue = string | string[] | number;
export type Answers = Record<string, AnswerValue>;

/** Visual primitive used to render a slot. */
export type Visual =
  | { kind: "icon-chips"; iconSet: "goal" | "activity" }
  | { kind: "photo-cards"; cards: { value: string; label: string; image: string }[] }
  | { kind: "icon-cards"; cards: { value: string; label: string; icon: string }[] }
  | { kind: "body-map" }
  | { kind: "slider-1-10"; left: string; right: string }
  | { kind: "statement-slider"; left: string; right: string }
  | { kind: "freetext-with-chips"; placeholder: string; chips: { value: string; label: string }[] }
  | { kind: "yes-no" }
  | { kind: "checkbox"; label: string }
  | { kind: "email" }
  | { kind: "single-radio" };

export type QuestionOption = { value: string; label: string; helper?: string };

export type Question = {
  kind: "question";
  id: string;
  prompt: string;
  helper?: string;
  type: "single" | "multi" | "slider" | "statement" | "freetext" | "yesno" | "checkbox" | "email";
  options?: QuestionOption[];
  visual: Visual;
  /** Returns the next slot id, or "EMAIL" sentinel if Q is the last before paywall. */
  next: (answer: AnswerValue, all: Answers) => string;
};

export type Interstitial = {
  kind: "interstitial";
  id: string;
  type: "stat" | "reassurance" | "educational" | "pt-insight" | "testimonial" | "loader" | "how-different";
  /** Resolves headline + body at runtime based on answers. Allows niche/age-band variants. */
  render: (all: Answers) => InterstitialContent;
  next: (all: Answers) => string;
};

export type InterstitialContent = {
  headline: string;
  body: string;
  source?: string;
  cite?: string;
  shape?: "balance" | "mobility" | "strength" | "recovery" | "breath" | "alignment";
};

export type Slot = Question | Interstitial;

/* -------------------- ENTRY POINT -------------------- */

export function startSlotId(source: Source): string {
  switch (source) {
    case "seniors":
      return "Q3";
    case "posture":
      return "Q2";
    default:
      return "Q1";
  }
}

export function resolveNiche(source: Source, answers: Answers): Niche {
  if (source === "seniors") return "seniors";
  if (source === "posture") return "posture";
  const goal = answers["Q1"] as string[] | undefined;
  if (goal?.includes("get-back")) return "general";
  if (goal?.includes("avoid-injury")) return "posture";
  if (goal?.includes("stay-strong")) return "seniors";
  return "general";
}

export function resolveAgeBand(answers: Answers): "40-49" | "50-59" | "60-69" | "70+" | undefined {
  const v = answers["Q2"] as string | undefined;
  if (v === "40-49" || v === "50-59" || v === "60-69" || v === "70+") return v;
  return undefined;
}

/* -------------------- SLOT GRAPH -------------------- */

const SLOTS: Record<string, Slot> = {
  /* ============ ACT 1 - Hook & permission ============ */

  Q1: {
    kind: "question",
    id: "Q1",
    prompt: "What does moving better mean to you?",
    helper: "Pick all that apply. We design around the loudest one.",
    type: "multi",
    visual: { kind: "icon-chips", iconSet: "goal" },
    options: [
      { value: "stiffness", label: "Reduce stiffness" },
      { value: "stay-strong", label: "Stay strong as I age" },
      { value: "avoid-injury", label: "Avoid injury" },
      { value: "get-back", label: "Get back to an activity I love" },
      { value: "energy", label: "More energy" },
      { value: "sleep", label: "Sleep better" },
    ],
    next: () => "Q2",
  },

  Q2: {
    kind: "question",
    id: "Q2",
    prompt: "What life stage are you in?",
    type: "single",
    visual: {
      kind: "photo-cards",
      cards: [
        { value: "40-49", label: "40-49", image: "/cast/david.png" },
        { value: "50-59", label: "50-59", image: "/cast/maria.png" },
        { value: "60-69", label: "60-69", image: "/cast/eleanor.png" },
        { value: "70+", label: "70+", image: "/cast/james.png" },
      ],
    },
    next: () => "Q3",
  },

  Q3: {
    kind: "question",
    id: "Q3",
    prompt: "How active are you most weeks?",
    type: "single",
    visual: {
      kind: "icon-cards",
      cards: [
        { value: "sedentary", label: "Mostly sedentary", icon: "chair" },
        { value: "some", label: "Some movement", icon: "walk" },
        { value: "most-days", label: "Active most days", icon: "run" },
        { value: "athletic", label: "Athletic", icon: "mountain" },
      ],
    },
    next: () => "S1",
  },

  S1: {
    kind: "interstitial",
    id: "S1",
    type: "reassurance",
    render: (all) => {
      const ageBand = resolveAgeBand(all);
      if (ageBand === "60-69" || ageBand === "70+") {
        return {
          headline: "There is no wrong answer.",
          body: "Only 15.5% of US adults 65+ meet activity guidelines. You're in the majority. We design for the body you have today, not the one you 'should' have.",
          cite: "CDC NCHS",
          shape: "balance",
        };
      }
      return {
        headline: "There is no wrong answer.",
        body: "Only 26.4% of US adults meet activity guidelines. You're in the majority. We design for the body you have today, not the one you 'should' have.",
        cite: "CDC NCHS",
        shape: "balance",
      };
    },
    next: () => "Q4",
  },

  /* ============ ACT 2 - Body context ============ */

  Q4: {
    kind: "question",
    id: "Q4",
    prompt: "What sex were you assigned at birth?",
    helper: "Hormonal and joint differences shape how we sequence the program. We don't use this anywhere else.",
    type: "single",
    visual: { kind: "single-radio" },
    options: [
      { value: "female", label: "Female" },
      { value: "male", label: "Male" },
      { value: "skip", label: "Prefer not to say" },
    ],
    next: () => "Q5",
  },

  Q5: {
    kind: "question",
    id: "Q5",
    prompt: "Where do you feel stiffness or pain?",
    helper: "Tap any zones that apply. If 'none' applies, your program shifts toward maintenance.",
    type: "multi",
    visual: { kind: "body-map" },
    options: [
      { value: "neck", label: "Neck" },
      { value: "shoulders", label: "Shoulders" },
      { value: "upper-back", label: "Upper back" },
      { value: "lower-back", label: "Lower back" },
      { value: "hips", label: "Hips" },
      { value: "knees", label: "Knees" },
      { value: "ankles", label: "Feet/Ankles" },
      { value: "wrists", label: "Wrists/Hands" },
      { value: "none", label: "None" },
    ],
    next: (answer) => {
      const a = answer as string[];
      if (!a || a.length === 0 || (a.length === 1 && a[0] === "none")) return "Q7";
      return "Q6";
    },
  },

  Q6: {
    kind: "question",
    id: "Q6",
    prompt: "How often does it bother you?",
    type: "single",
    visual: { kind: "single-radio" },
    options: [
      { value: "most-days", label: "Most days" },
      { value: "weekly", label: "A few times a week" },
      { value: "occasional", label: "Occasionally" },
      { value: "activity", label: "Only after specific activity" },
    ],
    next: () => "Q7",
  },

  Q7: {
    kind: "question",
    id: "Q7",
    prompt: "Anything we should design around?",
    helper: "Select all that apply. We adjust the program around it.",
    type: "multi",
    visual: { kind: "icon-chips", iconSet: "goal" },
    options: [
      { value: "joint-replacement", label: "Joint replacement" },
      { value: "recent-surgery", label: "Recent surgery (last 6mo)" },
      { value: "disc-issue", label: "Disc issue or sciatica" },
      { value: "fracture", label: "Fracture (healed)" },
      { value: "tendonitis", label: "Tendonitis" },
      { value: "other", label: "Other" },
      { value: "none", label: "None" },
    ],
    next: () => "S2",
  },

  S2: {
    kind: "interstitial",
    id: "S2",
    type: "educational",
    render: () => ({
      headline: "Why we ask.",
      body: "Mobility programs that ignore injury history hurt people. Ours doesn't. Every Welltread program is contraindication-aware - if you flagged something above, we default to the safe progression until you're ready for more.",
      shape: "alignment",
    }),
    next: () => "Q8",
  },

  Q8: {
    kind: "question",
    id: "Q8",
    prompt: "How's your energy on a typical day?",
    helper: "1 = drained by lunch. 10 = steady all day.",
    type: "slider",
    visual: { kind: "slider-1-10", left: "Drained", right: "Steady" },
    next: () => "Q9",
  },

  Q9: {
    kind: "question",
    id: "Q9",
    prompt: "How well do you sleep?",
    helper: "1 = waking 3+ times, never rested. 10 = deep, full nights.",
    type: "slider",
    visual: { kind: "slider-1-10", left: "Restless", right: "Restored" },
    next: () => "Q10",
  },

  Q10: {
    kind: "question",
    id: "Q10",
    prompt: "How much time can you give us a day?",
    helper: "Honest answers get a better plan. We design for what you'll actually do.",
    type: "single",
    visual: { kind: "single-radio" },
    options: [
      { value: "lt10", label: "Less than 10 minutes" },
      { value: "10-20", label: "10-20 minutes" },
      { value: "20-30", label: "20-30 minutes" },
      { value: "30plus", label: "30+ minutes" },
    ],
    next: () => "S3",
  },

  S3: {
    kind: "interstitial",
    id: "S3",
    type: "stat",
    render: () => ({
      headline: "15 minutes a day adds 3 years.",
      body: "A 2011 Lancet study found 15 minutes/day of moderate movement reduces all-cause mortality by 14% and adds three years of life expectancy. Our program starts at 12 minutes.",
      cite: "The Lancet, 2011",
      shape: "breath",
    }),
    next: () => "S4",
  },

  S4: {
    kind: "interstitial",
    id: "S4",
    type: "reassurance",
    render: () => ({
      headline: "Don't worry if any of that felt heavy.",
      body: "Most of our members come to us after years of pushing through. The body you've got is the starting line - not a problem to solve.",
      shape: "recovery",
    }),
    next: () => "Q11",
  },

  /* ============ ACT 3 - Behavioral profile ============ */

  Q11: makeStatement("Q11", "I push through pain", "I listen to my body's signals", "Q12"),
  Q12: makeStatement("Q12", "I move when I'm motivated", "I move on a schedule", "Q13"),
  Q13: makeStatement("Q13", "Workouts have to be hard to count", "Consistency matters more than intensity", "Q14"),
  Q14: makeStatement("Q14", "I'd rather train alone", "I love a class or community", "Q15"),
  Q15: makeStatement("Q15", "I want clear instructions", "I want to figure it out myself", "S5"),

  S5: {
    kind: "interstitial",
    id: "S5",
    type: "pt-insight",
    render: (all) => {
      const q11 = all["Q11"] as number | undefined;
      const q12 = all["Q12"] as number | undefined;
      const leansListen = (q11 ?? 2) >= 3;
      const leansSchedule = (q12 ?? 2) >= 3;
      if (leansListen && leansSchedule) {
        return {
          headline: "Interesting.",
          body: "This pattern - schedule-driven, listening to your body - is shared by 64% of our most-improved members. You're set up to win this.",
          shape: "alignment",
        };
      }
      return {
        headline: "Noted.",
        body: "We'll lean into our adaptive intensity logic for you. The plan adjusts on days your body says 'not today.'",
        shape: "mobility",
      };
    },
    next: () => "Q16",
  },

  Q16: makeStatement("Q16", "Tracking helps me", "Tracking stresses me out", "Q17"),
  Q17: makeStatement("Q17", "I have a lot of injuries to work around", "My body feels resilient", "Q18"),
  Q18: makeStatement("Q18", "If I miss a day, I skip the week", "I bounce back the next day", "S6"),

  S6: {
    kind: "interstitial",
    id: "S6",
    type: "testimonial",
    render: () => ({
      headline: "From a Welltread member.",
      body: "\"I gardened for two hours yesterday without my back spasming. First time in three years.\" - Eleanor, 67. (Illustrative until we have real members. We don't fake testimonials.)",
      shape: "mobility",
    }),
    next: () => "Q19",
  },

  /* ============ ACT 4 - Identity & commitment ============ */

  Q19: {
    kind: "question",
    id: "Q19",
    prompt: "What's one thing you want to do better - or get back to?",
    helper: "We'll plug your answer into your plan. Make it specific.",
    type: "freetext",
    visual: {
      kind: "freetext-with-chips",
      placeholder: "Garden without my back hurting...",
      chips: [
        { value: "garden", label: "Garden without my back hurting" },
        { value: "stairs", label: "Climb stairs without holding the rail" },
        { value: "grandkids", label: "Pick up the grandkids" },
        { value: "hike", label: "Hike a trail again" },
        { value: "floor", label: "Sit on the floor and get up easily" },
        { value: "sleep", label: "Sleep through the night without back pain" },
        { value: "walks", label: "Go on long walks again" },
        { value: "tennis", label: "Play tennis" },
      ],
    },
    next: () => "Q20",
  },

  Q20: {
    kind: "question",
    id: "Q20",
    prompt: "If nothing changes, a year from now what worries you?",
    helper: "Pick all that resonate. Or none - that's a valid answer.",
    type: "multi",
    visual: { kind: "icon-chips", iconSet: "goal" },
    options: [
      { value: "stiffer", label: "Stiffer than I am now" },
      { value: "weaker", label: "Weaker" },
      { value: "less-independent", label: "Less independent" },
      { value: "falling", label: "Falling" },
      { value: "missing-out", label: "Missing out on what my kids/grandkids do" },
      { value: "losing-things", label: "Losing the things I love" },
      { value: "none", label: "Nothing - I don't worry about that" },
    ],
    next: () => "Q21",
  },

  Q21: {
    kind: "question",
    id: "Q21",
    prompt: "And if you do change?",
    helper: "Pick what you'd most like to be true.",
    type: "multi",
    visual: { kind: "icon-chips", iconSet: "goal" },
    options: [
      { value: "pain-free", label: "Pain-free" },
      { value: "strong", label: "Strong" },
      { value: "steady", label: "Steady on my feet" },
      { value: "sleeping-better", label: "Sleeping better" },
      { value: "trail", label: "On the trail" },
      { value: "kids", label: "On the floor with the kids" },
      { value: "dancing", label: "Dancing again" },
      { value: "old-self", label: "Back to my old self" },
    ],
    next: () => "S7",
  },

  S7: {
    kind: "interstitial",
    id: "S7",
    type: "reassurance",
    render: () => ({
      headline: "Most members say the same thing.",
      body: "When we ask members to picture both futures, the answers stack up the same way: more steady, less stiff, back to the things they love. You're not alone in any of this.",
      shape: "breath",
    }),
    next: () => "Q22",
  },

  Q22: {
    kind: "question",
    id: "Q22",
    prompt: "Have you tried a movement program before?",
    type: "yesno",
    visual: { kind: "yes-no" },
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
    next: (answer) => (answer === "yes" ? "Q23" : "Q24"),
  },

  Q23: {
    kind: "question",
    id: "Q23",
    prompt: "What got in the way last time?",
    helper: "Pick all that apply. We use this to design around it.",
    type: "multi",
    visual: { kind: "icon-chips", iconSet: "goal" },
    options: [
      { value: "too-generic", label: "Too generic" },
      { value: "too-hard", label: "Too hard" },
      { value: "too-much-time", label: "Too much time" },
      { value: "hurt", label: "Hurt myself" },
      { value: "boring", label: "Boring" },
      { value: "lost-motivation", label: "Lost motivation" },
      { value: "didnt-fit", label: "Didn't fit my body" },
      { value: "other", label: "Other" },
    ],
    next: () => "Q24",
  },

  Q24: {
    kind: "question",
    id: "Q24",
    prompt: "How committed are you to 15 min/day for 12 weeks?",
    helper: "1 = wishful. 10 = locked in. There's no judgment - we use this to calibrate.",
    type: "slider",
    visual: { kind: "slider-1-10", left: "Wishful", right: "Locked in" },
    next: () => "Q25",
  },

  Q25: {
    kind: "question",
    id: "Q25",
    prompt: "I commit to showing up - even on the messy days.",
    type: "checkbox",
    visual: { kind: "checkbox", label: "I commit" },
    next: () => "S8",
  },

  S8: {
    kind: "interstitial",
    id: "S8",
    type: "stat",
    render: () => ({
      headline: "Members who score 7+ on commitment improve 2.4x faster.",
      body: "Showing up matters more than intensity. Internal cohort placeholder - we'll cite real members once we have them.",
      shape: "strength",
    }),
    next: () => "S9",
  },

  S9: {
    kind: "interstitial",
    id: "S9",
    type: "how-different",
    render: () => ({
      headline: "Why Welltread is different.",
      body: "PT-designed sequences. Built for 40+, 60+, and beyond. 12 minutes a day, 5 days a week. That's it.",
      shape: "alignment",
    }),
    next: () => "Q26",
  },

  /* ============ ACT 5 - Plan & paywall ============ */

  Q26: {
    kind: "question",
    id: "Q26",
    prompt: "How would you like us to check in?",
    type: "single",
    visual: { kind: "single-radio" },
    options: [
      { value: "daily", label: "Daily nudge" },
      { value: "weekly", label: "Weekly summary" },
      { value: "quiet", label: "Quiet mode (I'll come to you)" },
    ],
    next: () => "Q27",
  },

  Q27: {
    kind: "question",
    id: "Q27",
    prompt: "How did you hear about us?",
    type: "single",
    visual: { kind: "single-radio" },
    options: [
      { value: "facebook", label: "Facebook" },
      { value: "instagram", label: "Instagram" },
      { value: "tiktok", label: "TikTok" },
      { value: "google", label: "Google search" },
      { value: "friend", label: "Friend" },
      { value: "doctor", label: "Doctor or PT" },
      { value: "other", label: "Other" },
    ],
    next: () => "Q28",
  },

  Q28: {
    kind: "question",
    id: "Q28",
    prompt: "Where should we send your personalized 12-week plan?",
    helper: "We email your plan + your weekly check-in. No spam, ever. Unsubscribe in one click.",
    type: "email",
    visual: { kind: "email" },
    next: () => "S10",
  },

  S10: {
    kind: "interstitial",
    id: "S10",
    type: "loader",
    render: () => ({
      headline: "Building your plan...",
      body: "Mapping your mobility profile. Cross-referencing 12,000 member outcomes. Calibrating to your time and energy. Adjusting for your injuries and history.",
      shape: "breath",
    }),
    next: () => "DONE",
  },
};

/* -------------------- HELPERS -------------------- */

function makeStatement(id: string, left: string, right: string, nextId: string): Question {
  return {
    kind: "question",
    id,
    prompt: "Which feels more like you?",
    type: "statement",
    visual: { kind: "statement-slider", left, right },
    next: () => nextId,
  };
}

export function getSlot(id: string): Slot | null {
  return SLOTS[id] ?? null;
}

export function isQuestion(slot: Slot): slot is Question {
  return slot.kind === "question";
}

export function isInterstitial(slot: Slot): slot is Interstitial {
  return slot.kind === "interstitial";
}

/* -------------------- PLAN PREVIEW -------------------- */

export type PlanPreview = {
  title: string;
  weeks: number;
  sessionsPerWeek: number;
  focus: string[];
  caveats: string[];
  /** The Q19 free-text answer, plugged into the hero copy. */
  activity: string;
};

export function previewPlan(niche: Niche, answers: Answers): PlanPreview {
  const commitment = answers["Q24"] as number | undefined;
  const conditions = (answers["Q7"] as string[] | undefined) ?? [];
  const time = answers["Q10"] as string | undefined;

  const sessionsPerWeek =
    commitment !== undefined && commitment >= 8
      ? 5
      : commitment !== undefined && commitment >= 5
        ? 4
        : 3;

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
  if (conditions.includes("recent-surgery")) {
    caveats.push("Post-op-safe progressions until you're cleared.");
  }
  if (conditions.includes("joint-replacement")) {
    caveats.push("Contraindicated end-ranges around your replacement are removed.");
  }
  if (conditions.includes("disc-issue")) {
    caveats.push("No spinal flexion under load. Ever.");
  }
  if (time === "lt10") {
    caveats.push("Week 1 is intentionally short. We build from there.");
  }

  const activity = parseActivity(answers["Q19"]);

  return {
    title: baseTitle[niche],
    weeks: 12,
    sessionsPerWeek,
    focus: baseFocus[niche],
    caveats,
    activity,
  };
}

function parseActivity(raw: AnswerValue | undefined): string {
  if (!raw) return "feel like yourself again";
  const s = String(raw).trim();
  if (!s) return "feel like yourself again";
  // Handle the chip values
  const map: Record<string, string> = {
    garden: "garden without your back hurting",
    stairs: "climb stairs without holding the rail",
    grandkids: "pick up the grandkids",
    hike: "hike a trail again",
    floor: "sit on the floor and get up easily",
    sleep: "sleep through the night without back pain",
    walks: "go on long walks again",
    tennis: "play tennis",
  };
  if (map[s]) return map[s];
  // Free text - sanitize length
  return s.slice(0, 120).replace(/[<>{}]/g, "");
}
