import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyUnsubscribeToken } from "@/lib/email/tokens";

const SAGE = "#2D4F4A";
const PAPER = "#FAF7F2";
const INK = "#1A1A1A";
const INK_SOFT = "#4B5152";
const FONT_STACK = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;

function page(title: string, body: string, status = 200): Response {
  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} - Welltread</title></head>
<body style="margin:0;padding:48px 24px;background:${PAPER};font-family:${FONT_STACK};color:${INK};">
<div style="max-width:480px;margin:0 auto;text-align:left;">
  <div style="font-size:14px;font-weight:600;color:${SAGE};letter-spacing:0.2em;text-transform:uppercase;margin-bottom:32px;">Welltread</div>
  <h1 style="font-size:24px;font-weight:600;margin:0 0 16px;line-height:1.3;">${title}</h1>
  <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0;">${body}</p>
</div>
</body></html>`;
  return new Response(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

async function recordUnsubscribe(email: string, source: string): Promise<boolean> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("email_unsubscribes")
    .upsert(
      { email, source, unsubscribed_at: new Date().toISOString() },
      { onConflict: "email" },
    );
  if (error) {
    console.error("[unsubscribe] upsert failed", error);
    return false;
  }
  // Best-effort mirror onto email_signups for legacy queries.
  await supabase
    .from("email_signups")
    .update({ unsubscribed_at: new Date().toISOString() })
    .ilike("email", email);
  return true;
}

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return page("Invalid unsubscribe link", "This link is missing its token. Reply to any of our emails and we'll remove you manually.", 400);
  }
  const email = await verifyUnsubscribeToken(token);
  if (!email) {
    return page("Link expired or invalid", "This unsubscribe link is no longer valid. Reply to any of our emails and we'll remove you manually.", 400);
  }
  const ok = await recordUnsubscribe(email, "link-click");
  if (!ok) {
    return page("Something went wrong", "We couldn't process that just now. Please try again, or reply to any of our emails.", 500);
  }
  return page(
    "You're unsubscribed",
    `We won't email <strong style="color:${INK};">${email}</strong> again. If this was a mistake, reply to any past Welltread email and we'll restore you.`,
  );
}

// One-click unsubscribe (RFC 8058). Mail clients POST here when the user clicks
// the native "Unsubscribe" affordance. Must return 200 quickly.
export async function POST(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) return NextResponse.json({ ok: false, reason: "no-token" }, { status: 400 });
  const email = await verifyUnsubscribeToken(token);
  if (!email) return NextResponse.json({ ok: false, reason: "invalid-token" }, { status: 400 });
  const ok = await recordUnsubscribe(email, "one-click");
  return NextResponse.json({ ok }, { status: ok ? 200 : 500 });
}
