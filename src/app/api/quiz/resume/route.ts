/**
 * Resume a quiz session from a signed token in a re-engagement email.
 *
 * Flow:
 *   - Email link: welltread.co/plan?resume=<token>  (or /quiz?resume=<token>)
 *   - Server route /api/quiz/resume?token=<token>&dest=<plan|quiz>
 *   - Verifies token -> fetches session -> returns { source, answers, normalizedActivity }
 *   - Client hydrates localStorage and continues
 *
 * The /plan and /quiz pages load this client-side when they see a `?resume=`
 * param, hydrate state, then strip the param from the URL.
 */

import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyResumeToken } from "@/lib/email/tokens";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const qsid = await verifyResumeToken(token);
  if (!qsid) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { data: session, error } = await supabase
    .from("quiz_sessions")
    .select("id, niche, answers, metadata, utm")
    .eq("id", qsid)
    .single();

  if (error || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const utm = (session.utm as Record<string, string> | null) ?? {};
  const source = (utm["source"] as string) ?? "home";
  const normalizedActivity =
    typeof session.metadata === "object" && session.metadata !== null
      ? (session.metadata as Record<string, unknown>)["normalized_activity"] ?? null
      : null;

  return NextResponse.json({
    id: session.id,
    source,
    answers: session.answers ?? {},
    niche: session.niche,
    normalizedActivity,
  });
}
