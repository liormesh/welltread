import { NextResponse, type NextRequest } from "next/server";

const VAULT_COOKIE = "wt_vault_auth";
const APP_HOSTS = new Set(["welltread.app", "www.welltread.app"]);

/**
 * Edge middleware:
 *
 * 1. **Host routing for welltread.app**: rewrites /<path> → /app/<path>
 *    so the .app domain serves the authenticated product layer cleanly,
 *    while the .co domain serves marketing + quiz + paywall + vault.
 *    Same Worker, different URL space.
 *
 * 2. **Vault gate**: cookie-based password gate for /vault/* on .co.
 *    Untouched by the host rewrite (vault doesn't exist on .app).
 */
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;
  const host = req.headers.get("host")?.toLowerCase() ?? "";

  // -------- 1. welltread.app → /app/* rewrite --------
  if (APP_HOSTS.has(host)) {
    // Don't rewrite api routes, _next assets, or anything already under /app
    const passThrough =
      pathname.startsWith("/api/") ||
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/app/") ||
      pathname === "/app" ||
      pathname.startsWith("/cast/") ||
      pathname.startsWith("/scenes/") ||
      pathname.startsWith("/shapes/") ||
      pathname.startsWith("/samples/") ||
      pathname === "/favicon.ico";

    if (!passThrough) {
      // Root → /app/today
      const target = pathname === "/" ? "/app/today" : `/app${pathname}`;
      url.pathname = target;
      return NextResponse.rewrite(url);
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

  return NextResponse.next();
}

export const config = {
  // Match everything except static assets + Next internals.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
