import { NextResponse } from "next/server";

export const runtime = "edge";

type Payload = {
  email: string;
  source: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;
    if (!body.email?.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    // TODO: persist to Supabase (welltread project) once Stripe + Supabase
    // wiring is in place. For the weekend launch we accept-and-acknowledge.
    console.log(
      `[notify] email=${body.email} source=${body.source} ts=${new Date().toISOString()}`,
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
