import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

type Body = {
  id?: string;
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
    if (!body.answers || typeof body.answers !== "object") {
      return NextResponse.json({ error: "Invalid answers" }, { status: 400 });
    }

    const update: Record<string, unknown> = { answers: body.answers };
    if (body.niche === "seniors" || body.niche === "posture" || body.niche === "general") {
      update.niche = body.niche;
    }

    const supabase = createServiceClient();
    const { error } = await supabase
      .from("quiz_sessions")
      .update(update)
      .eq("id", body.id);

    if (error) {
      console.error("[quiz/save] update failed", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[quiz/save] unhandled", err);
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
