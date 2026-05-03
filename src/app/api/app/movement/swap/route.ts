/**
 * POST /api/app/movement/swap
 *
 * Phase 1 implementation: the user flagged pain on a body region during a
 * movement. We don't have the regression library yet, so the "swap" is
 * actually a guided-pause cue: "Hold here. Take a breath. Slow down or use
 * the wall."
 *
 * What we DO collect (real data for Phase 2):
 *  - Which movement they were doing
 *  - Which body region(s) hurt
 *  - When in the session it happened
 *
 * Stored on a new `pain_flags` jsonb on the user's most recent
 * daily_completions row OR a fresh row tagged with "in-progress" if no row
 * exists yet for today. We coalesce flags by date so a user can flag multiple
 * times in one session.
 *
 * Phase 2 (Trello card) will:
 *  - Look up regression in movement_library
 *  - Return alternate video URL + cue
 *  - Track the swap in a structured movement_swaps table
 *  - Trigger the adaptation engine (3 region-flags in 7 days = taper)
 */

import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/auth";

type Body = {
  sessionId: string;
  movementId: string;
  movementName: string;
  regions: string[]; // e.g. ["lower-back", "knees"]
};

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Body | null;
    if (!body || !Array.isArray(body.regions)) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    const supabase = await createSupabaseRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const { data: plan } = await supabase
      .from("user_plans")
      .select("id, start_date")
      .eq("profile_id", profile.id)
      .eq("status", "active")
      .order("start_date", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!plan) {
      return NextResponse.json({ error: "No active plan" }, { status: 404 });
    }

    // Compute today's day_number / week_number from plan.start_date
    const startDate = new Date(plan.start_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    const diffDays = Math.max(
      1,
      Math.floor((today.getTime() - startDate.getTime()) / 86400000) + 1,
    );
    const dayNumber = diffDays;
    const weekNumber = Math.ceil(diffDays / 7);
    const dateStr = today.toISOString().slice(0, 10);

    // Find or create today's daily_completion row to attach the pain flag to.
    const { data: existing } = await supabase
      .from("daily_completions")
      .select("id, notes")
      .eq("profile_id", profile.id)
      .eq("plan_id", plan.id)
      .eq("date", dateStr)
      .maybeSingle();

    const flagNote = `${body.movementName} - ${body.regions.join(", ")}`;

    if (existing) {
      // Append to existing row's notes (keep history of flags during the session)
      const newNotes = existing.notes
        ? `${existing.notes}\nFlagged: ${flagNote}`
        : `Flagged: ${flagNote}`;
      await supabase
        .from("daily_completions")
        .update({ notes: newNotes, pain_during: 8 })
        .eq("id", existing.id);
    } else {
      // Create an in-progress row. movement_completed=false until the user
      // submits the actual check-in.
      await supabase.from("daily_completions").insert({
        profile_id: profile.id,
        plan_id: plan.id,
        week_number: weekNumber,
        day_number: dayNumber,
        date: dateStr,
        movement_completed: false,
        pain_during: 8,
        notes: `Flagged: ${flagNote}`,
      });
    }

    // Phase 1 response: same movement, with a guided-pause cue overlay.
    // Phase 2 will return a real regression movement.
    return NextResponse.json({
      ok: true,
      // Tells the player to override the cue text + pause/resume timer.
      action: "soften",
      cueOverlay: `Hold here. Slow down or use the wall. Skip if it doesn't ease.`,
      durationSeconds: 30,
    });
  } catch (err) {
    console.error("[movement/swap] failed", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
