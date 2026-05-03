/**
 * Supabase Auth - SSR helpers.
 *
 * Page-level auth: each /app/* page calls requireUser() or requireProfile().
 * Auth no longer lives in middleware (caused cookie-loss issues with rewrites).
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = "https://xzjwbrtvxlluwjkjsmgr.supabase.co";

/** For server actions and route handlers. Reads + writes cookies. */
export async function createSupabaseRouteClient() {
  const cookieStore = await cookies();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createServerClient(SUPABASE_URL, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          /* RSC contexts where cookies are read-only */
        }
      },
    },
  });
}

/** For middleware - reserved for future, currently unused since auth moved to pages. */
export function createSupabaseMiddlewareClient(
  req: NextRequest,
  res: NextResponse,
) {
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createServerClient(SUPABASE_URL, anon, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          res.cookies.set(name, value, options);
        });
      },
    },
  });
}

/** Resolve the current user (or null). Doesn't redirect. */
export async function getCurrentUser() {
  const supabase = await createSupabaseRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Resolve the current profile row (or null). Doesn't redirect. */
export async function getCurrentProfile() {
  const supabase = await createSupabaseRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  return profile;
}

/** Page-level guard. Redirects to /app/login (or .co/quiz for cold visitors) if unauthed. */
export async function requireUser(opts?: { coldRedirect?: string }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(opts?.coldRedirect ?? "/app/login");
  }
  return user;
}

/** Page-level guard for routes that need a fully-provisioned profile. */
export async function requireProfile() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/app/login");
  }
  return profile;
}
