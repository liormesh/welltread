import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

type Payload = {
  email: string;
  source: string;
  utm?: Record<string, string>;
};

const ALLOWED_SOURCES = new Set([
  "home",
  "seniors",
  "posture",
  "postpartum",
  "pelvic-floor",
  "glp1",
  "deploy-verify",
]);

function extractUtmFromReferer(referer: string | null): Record<string, string> {
  if (!referer) return {};
  try {
    const url = new URL(referer);
    const utm: Record<string, string> = {};
    for (const [k, v] of url.searchParams.entries()) {
      if (
        k.startsWith("utm_") ||
        k === "fbclid" ||
        k === "ttclid" ||
        k === "gclid"
      ) {
        utm[k] = v;
      }
    }
    return utm;
  } catch {
    return {};
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;

    if (
      !body?.email ||
      typeof body.email !== "string" ||
      !body.email.includes("@") ||
      body.email.length > 254
    ) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const source =
      typeof body.source === "string" && ALLOWED_SOURCES.has(body.source)
        ? body.source
        : "home";

    const utmFromBody = body.utm && typeof body.utm === "object" ? body.utm : {};
    const utmFromReferer = extractUtmFromReferer(req.headers.get("referer"));
    const utm = { ...utmFromReferer, ...utmFromBody };

    const userAgent = req.headers.get("user-agent")?.slice(0, 500) ?? null;
    const ipCountry = req.headers.get("cf-ipcountry") ?? null;

    const supabase = createServiceClient();

    const { error } = await supabase.from("email_signups").insert({
      email: body.email.toLowerCase().trim(),
      source,
      utm,
      user_agent: userAgent,
      ip_country: ipCountry,
    });

    if (error) {
      // Unique-violation: idempotent re-signup is fine, return success
      if (error.code === "23505") {
        return NextResponse.json({ ok: true, duplicate: true });
      }
      console.error("[notify] insert failed", { code: error.code, message: error.message });
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[notify] unhandled", err);
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
