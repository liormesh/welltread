/**
 * Plan resolution from real Supabase data.
 *
 * Reads the user's active user_plan + recent daily_completions, computes
 * today's session number / week / streak, and picks the cast member per the
 * niche-aware rotation.
 *
 * Phase 1 limitation: session content (movements + cues + videos) still comes
 * from sample-plan.ts. Once we have a real movement_library + sessions schema,
 * resolveTodaySession() will pull the actual session for day_number from the
 * user's plan's archetype.
 */

import { createSupabaseRouteClient } from "@/lib/supabase/auth";
import { castForSession, type CastMember } from "@/lib/visual/cast";
import type { Niche } from "@/lib/quiz/definition";
import { buildSessionOne, type Session } from "@/lib/app/sample-plan";
import type { CastId } from "@/lib/visual/cast";

export type TodayContext = {
  /** True if the resolution succeeded - if false, /app/today should fall back to sample data. */
  ok: boolean;
  niche: Niche;
  firstName: string | null;
  /** The Q19 / normalized activity from the quiz. */
  activity: string | null;
  /** Day number relative to plan.start_date (1-indexed). */
  dayNumber: number;
  /** Week number relative to plan.start_date (1-indexed). */
  weekNumber: number;
  /** Today's scheduled session (placeholder content until real schema lands). */
  session: Session;
  /** Cast member demonstrating today's session. */
  cast: CastMember;
  /** Days completed in the user's plan (drives streak). */
  streakDays: number;
  /** Yesterday's completion summary, if any. */
  yesterday:
    | {
        sessionLabel: string;
        durationMinutes: number;
        notes: string | null;
      }
    | null;
  /** Today already completed? */
  completedToday: boolean;
};

/**
 * Resolve everything /app/today needs about the current user's plan.
 * Returns null if the user has no active plan (caller should redirect).
 */
export async function resolveTodayForUser(): Promise<TodayContext | null> {
  const supabase = await createSupabaseRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, display_name, primary_niche, metadata")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  if (!profile) return null;

  const { data: plan } = await supabase
    .from("user_plans")
    .select("id, niche, start_date, weeks, plan_data, metadata")
    .eq("profile_id", profile.id)
    .eq("status", "active")
    .order("start_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!plan) return null;

  const { data: completions } = await supabase
    .from("daily_completions")
    .select("date, day_number, week_number, duration_seconds, notes, movement_completed")
    .eq("profile_id", profile.id)
    .eq("plan_id", plan.id)
    .eq("movement_completed", true)
    .order("date", { ascending: false })
    .limit(40);

  // Compute day_number relative to plan.start_date
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

  const niche: Niche =
    plan.niche === "seniors" || plan.niche === "posture"
      ? plan.niche
      : "general";

  const cast = castForSession(niche, dayNumber);

  // Build session 1 with the resolved lead cast for matched bookends.
  // All days currently route to session 1 until more sessions ship.
  const session = buildSessionOne(cast.id as CastId);

  const todayStr = today.toISOString().slice(0, 10);
  const completedToday = completions?.some((c) => c.date === todayStr) ?? false;

  // Streak: count consecutive days with movement_completed = true ending yesterday or today
  let streakDays = 0;
  if (completions && completions.length > 0) {
    const completionDates = new Set(
      completions.map((c) => c.date as string),
    );
    // Walk backward from today
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      if (completionDates.has(ds)) {
        streakDays++;
      } else if (i > 0) {
        // Allow today to not be done yet without breaking streak
        break;
      }
    }
  }

  // Yesterday's completion (if any)
  const yDate = new Date(today);
  yDate.setDate(yDate.getDate() - 1);
  const yStr = yDate.toISOString().slice(0, 10);
  const yRow = completions?.find((c) => c.date === yStr) ?? null;

  const yesterday = yRow
    ? {
        sessionLabel: `Day ${yRow.day_number}`,
        durationMinutes: Math.round((yRow.duration_seconds ?? 0) / 60),
        notes: (yRow.notes as string | null) ?? null,
      }
    : null;

  // First name resolution: prefer full_name's first token, fall back to display_name
  const firstName = (() => {
    if (profile.full_name) {
      const first = (profile.full_name as string).trim().split(/\s+/)[0];
      if (first) return first;
    }
    if (profile.display_name) return profile.display_name as string;
    return null;
  })();

  // Activity from profile.metadata.normalized_activity (set by Q19 normalization
  // when the user completed the quiz)
  const meta = (profile.metadata ?? {}) as Record<string, unknown>;
  const activity =
    typeof meta.normalized_activity === "string"
      ? (meta.normalized_activity as string)
      : null;

  return {
    ok: true,
    niche,
    firstName,
    activity,
    dayNumber,
    weekNumber,
    session,
    cast,
    streakDays,
    yesterday,
    completedToday,
  };
}
