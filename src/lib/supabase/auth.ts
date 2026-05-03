/**
 * Supabase Auth - SSR helpers using @supabase/ssr.
 *
 * Three flavors of client:
 *  - server-component:  read-only Supabase client for RSC. Reads cookies.
 *  - server-action:     read-write client for route handlers + server actions. Reads + writes cookies.
 *  - middleware:        custom because middleware uses NextResponse to set cookies.
 *  - browser:           lives in src/lib/supabase/browser.ts
 *
 * All clients use the public anon key; auth context is carried via the user's
 * session cookie (HttpOnly, signed by Supabase, 1-hour TTL with refresh).
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = "https://xzjwbrtvxlluwjkjsmgr.supabase.co";

/**
 * For server actions and route handlers - can read AND write cookies.
 * Must be called inside a request lifecycle.
 */
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
          /* ignore - happens in RSC where cookies are read-only */
        }
      },
    },
  });
}

/**
 * For middleware - reads cookies from NextRequest, writes to NextResponse.
 */
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

/** Resolve the current authenticated user (or null). For RSC + route handlers. */
export async function getCurrentUser() {
  const supabase = await createSupabaseRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Resolve the profile row for the current authenticated user.
 * Returns null if not authed or profile not yet provisioned.
 */
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
