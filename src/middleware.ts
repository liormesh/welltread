import { NextResponse, type NextRequest } from "next/server";

const VAULT_COOKIE = "wt_vault_auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/vault")) return NextResponse.next();
  if (pathname === "/vault/login") return NextResponse.next();
  if (pathname.startsWith("/api/vault/login")) return NextResponse.next();

  const expected = process.env.VAULT_AUTH_TOKEN;
  if (!expected) {
    return new NextResponse(
      "Vault not configured. Set VAULT_AUTH_TOKEN.",
      { status: 503 },
    );
  }

  const cookie = req.cookies.get(VAULT_COOKIE)?.value;
  if (cookie === expected) return NextResponse.next();

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/vault/login";
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/vault/:path*"],
};
