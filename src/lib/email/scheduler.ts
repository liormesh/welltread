/**
 * Acquisition email scheduler.
 *
 * Runs on a CF Workers cron tick (every 15 minutes).
 * Queries quiz_sessions + email_sends to determine which acquisition emails
 * are due, then sends them via the email send wrapper.
 *
 * Idempotent: email_sends has a unique check on (template_id, quiz_session_id)
 * so a re-run won't double-send.
 */

import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import { TEMPLATES, TEMPLATE_GROUPS } from "@/lib/email/templates";
import { mintResumeToken } from "@/lib/email/tokens";

type Rule = {
  templateId: (typeof TEMPLATE_GROUPS.acquisition)[number];
  /** Minimum age (in minutes) of the source timestamp before this template fires. */
  minAgeMinutes: number;
  /** Maximum age (in minutes) - if older than this, we don't send (the moment has passed). */
  maxAgeMinutes: number;
  /** Which timestamp to measure against. */
  source: "started_at" | "completed_at";
  /** Required state. */
  state: "incomplete" | "completed-no-checkout";
};

const ACQUISITION_RULES: Rule[] = [
  // Quiz incomplete drips
  { templateId: "quiz-incomplete-6h", source: "started_at", state: "incomplete", minAgeMinutes: 6 * 60, maxAgeMinutes: 18 * 60 },
  { templateId: "quiz-incomplete-24h", source: "started_at", state: "incomplete", minAgeMinutes: 24 * 60, maxAgeMinutes: 48 * 60 },
  { templateId: "quiz-incomplete-7d", source: "started_at", state: "incomplete", minAgeMinutes: 7 * 24 * 60, maxAgeMinutes: 14 * 24 * 60 },

  // Plan abandonment drips
  { templateId: "plan-ready-2h", source: "completed_at", state: "completed-no-checkout", minAgeMinutes: 2 * 60, maxAgeMinutes: 12 * 60 },
  { templateId: "plan-ready-24h", source: "completed_at", state: "completed-no-checkout", minAgeMinutes: 24 * 60, maxAgeMinutes: 48 * 60 },
  { templateId: "plan-ready-72h", source: "completed_at", state: "completed-no-checkout", minAgeMinutes: 72 * 60, maxAgeMinutes: 7 * 24 * 60 },
  { templateId: "plan-soft-checkin-14d", source: "completed_at", state: "completed-no-checkout", minAgeMinutes: 14 * 24 * 60, maxAgeMinutes: 21 * 24 * 60 },
  { templateId: "win-back-30d", source: "completed_at", state: "completed-no-checkout", minAgeMinutes: 30 * 24 * 60, maxAgeMinutes: 60 * 24 * 60 },
];

const BASE_URL = "https://welltread.co";

type QuizSessionRow = {
  id: string;
  niche: string | null;
  started_at: string;
  completed_at: string | null;
  answers: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  email_signup_id: string | null;
  email_signups?: { email: string } | null;
};

export async function runAcquisitionTick(): Promise<{
  scanned: number;
  sent: number;
  skipped: number;
  failed: number;
  details: Array<{ rule: string; sessionId: string; result: string }>;
}> {
  const supabase = createServiceClient();
  const now = Date.now();
  const details: Array<{ rule: string; sessionId: string; result: string }> = [];
  let scanned = 0;
  let sent = 0;
  let skipped = 0;
  let failed = 0;

  // For each rule, query candidate sessions.
  for (const rule of ACQUISITION_RULES) {
    const minAgeMs = rule.minAgeMinutes * 60 * 1000;
    const maxAgeMs = rule.maxAgeMinutes * 60 * 1000;
    const oldestEligible = new Date(now - maxAgeMs).toISOString();
    const newestEligible = new Date(now - minAgeMs).toISOString();

    let query = supabase
      .from("quiz_sessions")
      .select("id, niche, started_at, completed_at, answers, metadata, email_signup_id, email_signups!inner(email)")
      .gte(rule.source, oldestEligible)
      .lte(rule.source, newestEligible);

    if (rule.state === "incomplete") {
      query = query.is("completed_at", null);
    } else if (rule.state === "completed-no-checkout") {
      query = query.not("completed_at", "is", null);
      // Future: also filter for users without active subscription.
      // For now: anyone with completed_at + email is eligible.
    }

    const { data, error } = await query.limit(100);
    if (error) {
      console.error("[email/scheduler] query failed", rule.templateId, error);
      continue;
    }
    if (!data || data.length === 0) continue;

    for (const session of data as unknown as QuizSessionRow[]) {
      scanned++;
      const email = session.email_signups?.email;
      if (!email) {
        skipped++;
        continue;
      }

      // Idempotency: skip if already sent
      const { data: prior } = await supabase
        .from("email_sends")
        .select("id")
        .eq("template_id", rule.templateId)
        .eq("quiz_session_id", session.id)
        .limit(1)
        .maybeSingle();

      if (prior) {
        skipped++;
        continue;
      }

      // Mint a resume token for this session
      const token = await mintResumeToken(session.id);
      const resumePath =
        rule.state === "incomplete" ? "/quiz" : "/plan";
      const resumeUrl = token
        ? `${BASE_URL}${resumePath}?resume=${token}`
        : `${BASE_URL}${resumePath}`;

      // Build context for template
      const niche =
        session.niche === "seniors" || session.niche === "posture" || session.niche === "general"
          ? (session.niche as "seniors" | "posture" | "general")
          : null;
      const activity =
        typeof session.metadata?.normalized_activity === "string"
          ? (session.metadata.normalized_activity as string)
          : null;

      const ctx = {
        firstName: null,
        resumeUrl,
        activity,
        niche,
      };

      const renderer = TEMPLATES[rule.templateId];
      if (!renderer) {
        failed++;
        continue;
      }
      const rendered = renderer(ctx);

      const result = await sendEmail({
        templateId: rule.templateId,
        to: email,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
        quizSessionId: session.id,
        emailSignupId: session.email_signup_id,
      });

      details.push({ rule: rule.templateId, sessionId: session.id, result: result.ok ? "sent" : (result.reason ?? "failed") });

      if (result.ok) sent++;
      else if (result.reason === "already-sent") skipped++;
      else failed++;
    }
  }

  return { scanned, sent, skipped, failed, details };
}
