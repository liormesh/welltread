import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { QUIZ_VERSION, type Source } from "@/lib/quiz/definition";

const ALLOWED_SOURCES: Source[] = [
  "home",
  "seniors",
  "posture",
  "postpartum",
  "pelvic-floor",
  "glp1",
];

type Body = {
  source?: string;
  utm?: Record<string, string>;
  click_ids?: Record<string, string>;
  client_id?: string;
  referrer?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Body;

    const source: Source =
      typeof body.source === "string" &&
      (ALLOWED_SOURCES as string[]).includes(body.source)
        ? (body.source as Source)
        : "home";

    const niche =
      source === "seniors"
        ? "seniors"
        : source === "posture"
          ? "posture"
          : "general";

    const utm = body.utm && typeof body.utm === "object" ? body.utm : {};
    const click_ids =
      body.click_ids && typeof body.click_ids === "object" ? body.click_ids : {};
    const client_id =
      typeof body.client_id === "string" ? body.client_id.slice(0, 100) : null;
    const referrer =
      typeof body.referrer === "string" ? body.referrer.slice(0, 1000) : null;

    const userAgent = req.headers.get("user-agent")?.slice(0, 500) ?? null;
    const ipCountry = req.headers.get("cf-ipcountry") ?? null;

    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("quiz_sessions")
      .insert({
        niche,
        quiz_version: QUIZ_VERSION,
        utm: { ...utm, source },
        click_ids,
        client_id,
        user_agent: userAgent,
        ip_country: ipCountry,
        referrer,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("[quiz/start] insert failed", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error("[quiz/start] unhandled", err);
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
