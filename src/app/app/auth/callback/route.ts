/**
 * Magic-link callback handler.
 *
 * Supabase Auth redirects here after a user clicks the magic-link email.
 * We exchange the auth code for a session, set cookies, then redirect to
 * the app.
 *
 * Implemented as a route handler (not a page) so we can finish the auth
 * exchange server-side and never expose the code to client JS.
 */

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/auth";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const redirect = url.searchParams.get("redirect") ?? "/app/today";
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");

  const supabase = await createSupabaseRouteClient();

  // OTP magic-link flow uses token_hash + type=magiclink
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "magiclink" | "signup" | "recovery" | "email_change",
    });
    if (error) {
      const failUrl = new URL(url.toString());
      failUrl.pathname = "/app/login";
      failUrl.searchParams.set("error", "magic-link-expired");
      failUrl.searchParams.delete("code");
      failUrl.searchParams.delete("token_hash");
      failUrl.searchParams.delete("type");
      failUrl.searchParams.delete("redirect");
      return NextResponse.redirect(failUrl);
    }
    const dest = new URL(url.toString());
    dest.pathname = redirect;
    dest.search = "";
    return NextResponse.redirect(dest);
  }

  // PKCE / OAuth flow uses ?code=
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      const failUrl = new URL(url.toString());
      failUrl.pathname = "/app/login";
      failUrl.searchParams.set("error", "auth-exchange-failed");
      failUrl.searchParams.delete("code");
      failUrl.searchParams.delete("redirect");
      return NextResponse.redirect(failUrl);
    }
    const dest = new URL(url.toString());
    dest.pathname = redirect;
    dest.search = "";
    return NextResponse.redirect(dest);
  }

  // No auth params - just bounce back to login
  const fallback = new URL(url.toString());
  fallback.pathname = "/app/login";
  fallback.search = "";
  return NextResponse.redirect(fallback);
}
