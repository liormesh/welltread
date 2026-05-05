/**
 * POST /api/stripe/checkout
 *
 * Creates a Stripe Checkout Session for the $1 trial → 3-month subscription
 * flow described in /vault/trial-flow.
 *
 * - $1 one-time line item charged immediately
 * - Subscription with trial_period_days=7 starts the recurring price after
 * - On success, user lands on /app/welcome where the webhook will have
 *   already provisioned their plan via customer.subscription.created
 */
import { NextResponse } from "next/server";
import { getStripe, getPriceIds, getAppBaseUrl } from "@/lib/stripe/client";

type Body = {
  email?: string;
  quizSessionId?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Body;
    const stripe = getStripe();
    const { recurring, trialFee } = getPriceIds();

    if (!recurring || !trialFee) {
      return NextResponse.json(
        { error: "Stripe price IDs not configured" },
        { status: 500 },
      );
    }

    const baseUrl = getAppBaseUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        { price: recurring, quantity: 1 },
        { price: trialFee, quantity: 1 },
      ],
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          quiz_session_id: body.quizSessionId ?? "",
        },
      },
      customer_email: body.email,
      payment_method_collection: "always",
      allow_promotion_codes: true,
      success_url: `${baseUrl}/app/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/plan?canceled=1`,
      metadata: {
        quiz_session_id: body.quizSessionId ?? "",
      },
    });

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
