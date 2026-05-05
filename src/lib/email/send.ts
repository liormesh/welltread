/**
 * Resend wrapper. Server-side only.
 * Handles brand-default From + reply-to and idempotency tracking via email_sends.
 */

import { createServiceClient } from "@/lib/supabase/server";
import { mintUnsubscribeToken } from "@/lib/email/tokens";

const RESEND_BASE = "https://api.resend.com/emails";

export const FROM_DEFAULT = "Welltread <hello@welltread.co>";
export const REPLY_TO_DEFAULT = "hello@welltread.co";
const UNSUB_BASE_URL = "https://welltread.co/api/unsubscribe";

export type SendArgs = {
  templateId: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Optional ids for tracking + idempotency */
  quizSessionId?: string | null;
  emailSignupId?: string | null;
  profileId?: string | null;
  /** Arbitrary metadata persisted to email_sends.metadata. Used as the idempotency
   *  key for retention emails (week_index, completion_id) — callers handle their
   *  own dedup check before calling sendEmail. */
  metadata?: Record<string, unknown> | null;
  /** If true, skip the dedup check (manual resend) */
  skipDedupe?: boolean;
};

/**
 * Send a transactional email via Resend, then record it in `email_sends`.
 * Returns null if dedup hit (already sent this template to this session).
 */
export async function sendEmail(args: SendArgs): Promise<{ ok: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email/send] RESEND_API_KEY not set - skipping send");
    return { ok: false, reason: "no-api-key" };
  }

  const supabase = createServiceClient();
  const recipient = args.to.trim().toLowerCase();

  // Suppression check: never send to a previously-unsubscribed address.
  const { data: suppressed } = await supabase
    .from("email_unsubscribes")
    .select("email")
    .eq("email", recipient)
    .limit(1)
    .maybeSingle();
  if (suppressed) {
    return { ok: false, reason: "unsubscribed" };
  }

  // Dedup check: have we already sent this template to this session?
  if (!args.skipDedupe && args.quizSessionId) {
    const { data: prior } = await supabase
      .from("email_sends")
      .select("id")
      .eq("template_id", args.templateId)
      .eq("quiz_session_id", args.quizSessionId)
      .limit(1)
      .maybeSingle();
    if (prior) {
      return { ok: false, reason: "already-sent" };
    }
  }

  const fromAddr = process.env.EMAIL_FROM || FROM_DEFAULT;
  const replyTo = process.env.EMAIL_REPLY_TO || REPLY_TO_DEFAULT;

  // Mint a per-recipient unsubscribe URL and substitute the {{unsubscribe_url}}
  // placeholder that templates emit in their footer. Falls back to a mailto if
  // EMAIL_TOKEN_SECRET isn't configured (templates still render, link still works).
  const unsubToken = await mintUnsubscribeToken(recipient);
  const unsubscribeUrl = unsubToken
    ? `${UNSUB_BASE_URL}?token=${unsubToken}`
    : `mailto:${REPLY_TO_DEFAULT}?subject=Unsubscribe`;
  const html = args.html.replaceAll("{{unsubscribe_url}}", unsubscribeUrl);
  const textWithSub = args.text.replaceAll("{{unsubscribe_url}}", unsubscribeUrl);
  const text = textWithSub.includes(unsubscribeUrl)
    ? textWithSub
    : `${textWithSub}\n\n---\nUnsubscribe: ${unsubscribeUrl}`;

  let providerId: string | null = null;
  let providerStatus = "queued";

  try {
    const res = await fetch(RESEND_BASE, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddr,
        to: [args.to],
        reply_to: replyTo,
        subject: args.subject,
        html,
        text,
        headers: {
          // RFC 8058 one-click unsubscribe. Gmail + Apple Mail surface a native
          // "Unsubscribe" affordance and POST to the URL on click.
          "List-Unsubscribe": unsubToken
            ? `<${unsubscribeUrl}>, <mailto:${REPLY_TO_DEFAULT}?subject=Unsubscribe>`
            : `<mailto:${REPLY_TO_DEFAULT}?subject=Unsubscribe>`,
          ...(unsubToken ? { "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } : {}),
        },
        tags: [
          { name: "template", value: args.templateId },
          ...(args.quizSessionId ? [{ name: "qs", value: args.quizSessionId.slice(0, 30) }] : []),
        ],
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.error("[email/send] resend rejected", res.status, errBody);
      providerStatus = "failed";
    } else {
      const data = (await res.json().catch(() => null)) as { id?: string } | null;
      providerId = data?.id ?? null;
      providerStatus = "sent";
    }
  } catch (err) {
    console.error("[email/send] fetch failed", err);
    providerStatus = "failed";
  }

  // Always record - we want telemetry on failures too
  await supabase.from("email_sends").insert({
    template_id: args.templateId,
    recipient_email: args.to,
    quiz_session_id: args.quizSessionId ?? null,
    email_signup_id: args.emailSignupId ?? null,
    profile_id: args.profileId ?? null,
    provider_id: providerId,
    provider_status: providerStatus,
    sent_at: new Date().toISOString(),
    metadata: args.metadata ?? {},
  });

  return { ok: providerStatus === "sent" };
}
