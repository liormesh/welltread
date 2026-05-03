/**
 * POST /api/app/checkin
 *
 * Records a daily session completion: pain rating, energy rating, qualitative
 * feel, optional flag note. Pulls user_plan_id from the user's active plan.
 *
 * Auth: requires a Supabase session.
 */

import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/auth";

const FEEL_TO_DIFFICULTY: Record<string, number> = {
  "Too easy": 1,
  "Just right": 3,
  "Too hard": 5,
  "Hurt me": 5, // bumped + pain_flagged
};

type Body = {
  sessionId: string;
  body: number; // 1-5
  energy: number; // 1-5
  feel: string; // "Too easy" | "Just right" | "Too hard" | "Hurt me"
  flag?: string;
  durationSeconds?: number;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Body | null;
    if (!body) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    const supabase = await createSupabaseRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    // Resolve profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Resolve active plan
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

    // Compute week / day numbers based on plan start_date
    const startDate = new Date(plan.start_date);
    const today = new Date();
    const diffDays = Math.max(
      1,
      Math.floor((today.getTime() - startDate.getTime()) / 86400000) + 1,
    );
    const weekNumber = Math.ceil(diffDays / 7);
    const dayNumber = ((diffDays - 1) % 7) + 1;

    // Note: pain_during is 0-10 in CDN-style rating. Map our 5 scale → 0-10.
    // Body 1 = tense (high pain), 5 = easy. Invert + scale.
    const painDuring = body.feel === "Hurt me" ? 8 : Math.max(0, (5 - body.body) * 2);
    const energyAfter = body.energy * 2; // 1-5 → 2-10

    const { data: row, error: insertErr } = await supabase
      .from("daily_completions")
      .insert({
        profile_id: profile.id,
        plan_id: plan.id,
        week_number: weekNumber,
        day_number: dayNumber,
        date: today.toISOString().slice(0, 10),
        movement_completed: true,
        duration_seconds: body.durationSeconds ?? null,
        difficulty_rating: FEEL_TO_DIFFICULTY[body.feel] ?? 3,
        pain_during: painDuring,
        energy_after: energyAfter,
        notes: body.flag?.slice(0, 1000) || null,
      })
      .select("id")
      .single();

    if (insertErr) {
      console.error("[checkin] insert failed", insertErr);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: row.id });
  } catch (err) {
    console.error("[checkin] unhandled", err);
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
