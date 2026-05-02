import { NextResponse } from "next/server";

const VAULT_COOKIE = "wt_vault_auth";
const ONE_WEEK = 60 * 60 * 24 * 7;

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as { password?: string } | null;
    const password = typeof body?.password === "string" ? body.password : "";

    const expected = process.env.VAULT_AUTH_TOKEN;
    if (!expected) {
      return NextResponse.json(
        { error: "Vault not configured" },
        { status: 503 },
      );
    }

    if (password !== expected) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(VAULT_COOKIE, expected, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: ONE_WEEK,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
