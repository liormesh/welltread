import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { normalizeActivity } from "@/lib/ai/activity";

type AnswerValue = string | string[] | number;

type Body = {
  id?: string;
  email?: string;
  answers?: Record<string, AnswerValue>;
  niche?: string;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ACTIVITY_CHIP_VALUES = new Set([
  "garden",
  "stairs",
  "grandkids",
  "hike",
  "floor",
  "sleep",
  "walks",
  "tennis",
]);

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Body;

    if (!body.id || !UUID_RE.test(body.id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    if (
      !body.email ||
      typeof body.email !== "string" ||
      !body.email.includes("@") ||
      body.email.length > 254
    ) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const email = body.email.toLowerCase().trim();
    const supabase = createServiceClient();

    const { data: session, error: readErr } = await supabase
      .from("quiz_sessions")
      .select("utm, niche, metadata")
      .eq("id", body.id)
      .single();

    if (readErr || !session) {
      console.error("[quiz/complete] session read failed", readErr);
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const niche =
      body.niche === "seniors" ||
      body.niche === "posture" ||
      body.niche === "general"
        ? body.niche
        : (session.niche as string | null) ?? "general";

    const source =
      (session.utm as Record<string, string> | null)?.source ?? "home";

    // Email signup upsert (idempotent)
    let signupId: string | null = null;
    const { data: inserted, error: insertErr } = await supabase
      .from("email_signups")
      .insert({
        email,
        source,
        utm: session.utm ?? {},
      })
      .select("id")
      .single();

    if (insertErr) {
      if (insertErr.code === "23505") {
        const { data: existing } = await supabase
          .from("email_signups")
          .select("id")
          .eq("email", email)
          .single();
        signupId = existing?.id ?? null;
      } else {
        console.error("[quiz/complete] signup insert failed", insertErr);
      }
    } else {
      signupId = inserted?.id ?? null;
    }

    // Normalize the Q19 free-text activity (best-effort, never blocks completion)
    let normalizedActivity: string | null = null;
    const q19 = body.answers?.["Q19"];
    if (typeof q19 === "string" && q19.trim().length > 0 && !ACTIVITY_CHIP_VALUES.has(q19.trim())) {
      normalizedActivity = await normalizeActivity(
        q19,
        niche as "seniors" | "posture" | "general",
      );
    }

    // Store back on the session metadata so the plan reveal can use it
    const existingMetadata =
      typeof session.metadata === "object" && session.metadata !== null
        ? (session.metadata as Record<string, unknown>)
        : {};

    const update: Record<string, unknown> = {
      completed_at: new Date().toISOString(),
      niche,
      metadata: {
        ...existingMetadata,
        ...(normalizedActivity ? { normalized_activity: normalizedActivity } : {}),
      },
    };
    if (body.answers && typeof body.answers === "object") {
      update.answers = body.answers;
    }
    if (signupId) {
      update.email_signup_id = signupId;
    }

    const { error: updateErr } = await supabase
      .from("quiz_sessions")
      .update(update)
      .eq("id", body.id);

    if (updateErr) {
      console.error("[quiz/complete] session update failed", updateErr);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      normalized_activity: normalizedActivity,
    });
  } catch (err) {
    console.error("[quiz/complete] unhandled", err);
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
