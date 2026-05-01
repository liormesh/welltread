import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

type Body = {
  id?: string;
  email?: string;
  answers?: Record<string, string | string[]>;
  niche?: string;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

    // Pull session for utm passthrough
    const { data: session, error: readErr } = await supabase
      .from("quiz_sessions")
      .select("utm, niche")
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
        : (session.niche ?? "general");

    const source =
      (session.utm as Record<string, string> | null)?.source ?? "home";

    // Upsert email signup. If duplicate, fetch existing id.
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

    const update: Record<string, unknown> = {
      completed_at: new Date().toISOString(),
      niche,
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

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[quiz/complete] unhandled", err);
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
