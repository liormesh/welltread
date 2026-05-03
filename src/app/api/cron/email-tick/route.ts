/**
 * Cron tick - runs every 15 min to send due acquisition emails.
 * Triggered by Cloudflare Workers Cron Triggers via wrangler.jsonc `triggers.crons`.
 *
 * Also accessible manually via GET (with X-Cron-Auth header for ad-hoc execution).
 */

import { NextResponse } from "next/server";
import { runAcquisitionTick } from "@/lib/email/scheduler";

export async function POST(req: Request) {
  // CF cron-triggered POSTs send a Cloudflare-internal header. We also accept
  // manual triggers if they include the right shared-secret header.
  const auth = req.headers.get("x-cron-auth");
  const expected = process.env.EMAIL_TOKEN_SECRET; // re-using as cron auth shared-secret
  const cfRay = req.headers.get("cf-ray");

  if (!cfRay && auth !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runAcquisitionTick();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[email-tick] failed", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET allowed for ad-hoc/manual runs (also requires auth)
export async function GET(req: Request) {
  return POST(req);
}
