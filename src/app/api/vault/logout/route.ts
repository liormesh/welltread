import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/vault/login";
  url.search = "";

  const res = NextResponse.redirect(url, 303);
  res.cookies.set("wt_vault_auth", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
