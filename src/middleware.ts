import { NextResponse, type NextRequest } from "next/server";

const VAULT_COOKIE = "wt_vault_auth";
const APP_HOSTS = new Set(["welltread.app", "www.welltread.app"]);

/**
 * Edge middleware. Two responsibilities only:
 *
 * 1. **Host routing**: rewrite welltread.app/* → /app/* so the .app domain
 *    serves the authenticated product layer cleanly while .co serves
 *    marketing + quiz + paywall + vault.
 * 2. **Vault gate**: cookie-based password gate for /vault/* on .co.
 *
 * App auth is NOT enforced here. Each /app/* page does its own auth check
 * via the SSR Supabase client (which can read AND write the refresh cookie
 * cleanly without the rewrite-cookie-loss issue middleware has).
 */
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;
  const host = req.headers.get("host")?.toLowerCase() ?? "";

  // -------- 1. welltread.app → /app/* rewrite --------
  if (APP_HOSTS.has(host)) {
    const passThrough =
      pathname.startsWith("/api/") ||
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/.well-known/") ||
      pathname.startsWith("/app/") ||
      pathname === "/app" ||
      pathname.startsWith("/cast/") ||
      pathname.startsWith("/scenes/") ||
      pathname.startsWith("/shapes/") ||
      pathname.startsWith("/samples/") ||
      pathname.startsWith("/videos/") ||
      pathname.startsWith("/brand/") ||
      pathname === "/favicon.ico" ||
      pathname === "/icon.svg" ||
      pathname === "/apple-icon.png" ||
      pathname === "/manifest.webmanifest" ||
      pathname === "/og-image.png" ||
      pathname === "/privacy" ||
      pathname === "/terms" ||
      pathname === "/health-disclaimer" ||
      pathname === "/delete-account" ||
      pathname === "/data-deletion";

    if (!passThrough) {
      const target = pathname === "/" ? "/app/today" : `/app${pathname}`;
      url.pathname = target;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
