/**
 * Activity normalization via Claude Haiku.
 *
 * Takes the user's free-text Q19 answer and a niche, returns a clean infinitive
 * phrase that completes "By week 12, you'll be ready to ___."
 *
 * Server-side only. Reads ANTHROPIC_API_KEY from Worker secrets.
 */

import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 60;

/**
 * Normalize a free-text activity answer into a plan-reveal-ready phrase.
 *
 * Returns null if the API call fails or the response is unusable - the caller
 * should fall back to its own simple parsing.
 */
export async function normalizeActivity(
  rawText: string,
  niche: "seniors" | "posture" | "general",
): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn("[ai/activity] ANTHROPIC_API_KEY not set");
    return null;
  }

  const cleaned = rawText.trim().slice(0, 200);
  if (!cleaned) return null;

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [
        {
          role: "user",
          content: SYSTEM_PROMPT.replace("{NICHE}", niche).replace(
            "{USER_TEXT}",
            cleaned,
          ),
        },
      ],
    });

    const block = response.content?.[0];
    if (!block || block.type !== "text") return null;

    const text = block.text.trim();
    return sanitize(text);
  } catch (err) {
    console.error("[ai/activity] Claude call failed", err);
    return null;
  }
}

const SYSTEM_PROMPT = `You are normalizing a free-text answer from a wellness movement assessment.

The user was asked: "What's one thing you want to do better - or get back to?"

Their niche is: {NICHE}
Their answer: "{USER_TEXT}"

Output ONLY a short infinitive-form activity phrase that grammatically completes the sentence:
"By week 12, you'll be ready to ___."

RULES:
- Output the phrase only. No quotes, no period, no preamble, no "Here's the phrase:", nothing else.
- Lowercase first letter.
- 4-12 words maximum.
- Use second-person possessive where natural ("your back", "your knees") not first-person.
- Preserve the user's specific intent; don't generalize.
- If the user wrote a complete sentence, extract the action.
- If the user wrote multiple things, pick the most concrete or first one.
- If the user's answer is unclear or empty, output: "feel like yourself again"

EXAMPLES:
- "I want to garden again without my back hurting" -> "garden without your back hurting"
- "play golf on weekends" -> "play golf on weekends without pain"
- "i used to hike a lot" -> "hike a real trail again"
- "pickleball with my friends" -> "play pickleball with your friends"
- "stop falling" -> "stay steady on your feet"
- "tie my own shoes" -> "bend down and tie your shoes"
- "" -> "feel like yourself again"

Now output the phrase for this user's answer:`;

function sanitize(text: string): string {
  // Strip surrounding quotes, periods, line breaks
  let out = text.replace(/^["'`]+|["'`]+$/g, "").trim();
  out = out.replace(/[.!?]+$/g, "").trim();
  out = out.split("\n")[0].trim();
  // Lowercase first letter
  if (out.length > 0) {
    out = out.charAt(0).toLowerCase() + out.slice(1);
  }
  // Length cap (safety)
  if (out.length > 120) out = out.slice(0, 120);
  // Strip risky chars
  out = out.replace(/[<>{}]/g, "");
  return out;
}
