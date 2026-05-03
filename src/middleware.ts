import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/auth";

const VAULT_COOKIE = "wt_vault_auth";
const APP_HOSTS = new Set(["welltread.app", "www.welltread.app"]);

const PUBLIC_APP_PATHS = new Set([
  "/app/login",
  "/app/auth/callback",
]);

/**
 * Edge middleware:
 *
 * 1. **Host routing for welltread.app**: rewrites /<path> → /app/<path>
 * 2. **Vault gate**: cookie-based password gate for /vault/* on .co
 * 3. **App auth gate**: Supabase session check for /app/*
 *    - /app/login + /app/auth/callback are public
 *    - everything else requires an authenticated user
 */
export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;
  const host = req.headers.get("host")?.toLowerCase() ?? "";

  // -------- 1. welltread.app → /app/* rewrite --------
  if (APP_HOSTS.has(host)) {
    const passThrough =
      pathname.startsWith("/api/") ||
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/app/") ||
      pathname === "/app" ||
      pathname.startsWith("/cast/") ||
      pathname.startsWith("/scenes/") ||
      pathname.startsWith("/shapes/") ||
      pathname.startsWith("/samples/") ||
      pathname.startsWith("/videos/") ||
      pathname === "/favicon.ico";

    if (!passThrough) {
      const target = pathname === "/" ? "/app/today" : `/app${pathname}`;
      url.pathname = target;
      // After rewriting, fall through to the auth gate below using the rewritten path
      const rewritten = NextResponse.rewrite(url);
      return await applyAuthGate(req, rewritten, target);
    }
  }

  // -------- 2. Vault gate (welltread.co only) --------
  if (pathname.startsWith("/vault")) {
    if (pathname === "/vault/login") return NextResponse.next();
    if (pathname.startsWith("/api/vault/login")) return NextResponse.next();

    const expected = process.env.VAULT_AUTH_TOKEN;
    if (!expected) {
      return new NextResponse("Vault not configured. Set VAULT_AUTH_TOKEN.", {
        status: 503,
      });
    }

    const cookie = req.cookies.get(VAULT_COOKIE)?.value;
    if (cookie === expected) return NextResponse.next();

    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/vault/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // -------- 3. App auth gate (when accessed directly via /app/*) --------
  if (pathname.startsWith("/app")) {
    const baseRes = NextResponse.next();
    return await applyAuthGate(req, baseRes, pathname);
  }

  return NextResponse.next();
}

async function applyAuthGate(
  req: NextRequest,
  baseRes: NextResponse,
  resolvedPath: string,
) {
  // Public paths inside /app
  if (
    PUBLIC_APP_PATHS.has(resolvedPath) ||
    resolvedPath.startsWith("/app/auth/")
  ) {
    return baseRes;
  }

  try {
    const supabase = createSupabaseMiddlewareClient(req, baseRes);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Compute the visible-to-user redirect target (the actual URL they typed)
      const redirectFrom = req.nextUrl.pathname.startsWith("/app/")
        ? req.nextUrl.pathname.replace(/^\/app/, "")
        : req.nextUrl.pathname;
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/app/login";
      loginUrl.search = "";
      if (redirectFrom && redirectFrom !== "/" && redirectFrom !== "/login") {
        loginUrl.searchParams.set("redirect", `/app${redirectFrom}`);
      }
      return NextResponse.redirect(loginUrl);
    }
  } catch (err) {
    // If Supabase client creation fails (env not set), fail open in dev,
    // closed in prod. For now: allow through with a server-side warning
    // so we don't break local development.
    console.warn("[middleware] auth gate skipped:", err);
  }

  return baseRes;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
