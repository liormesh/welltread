/**
 * POST /api/stripe/webhook
 *
 * Stripe POSTs lifecycle events here. We verify the signature, then route
 * the events we care about for the trial → subscription flow.
 *
 * Configure: in Stripe dashboard (or via CLI `stripe listen --forward-to ...`),
 * subscribe to:
 *   checkout.session.completed
 *   customer.subscription.created
 *   customer.subscription.updated
 *   customer.subscription.deleted
 *   invoice.payment_failed
 *   invoice.payment_succeeded
 *
 * For POC: we log + return 200. Plan provisioning lands in the next pass
 * (writes to subscriptions table, ties to profile via email).
 */
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripe = getStripe();
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 },
    );
  }

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "verification failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // POC: log the event type + key ids. Persistence lands next pass.
  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;
      console.log(
        `[stripe] checkout.session.completed id=${s.id} customer=${s.customer} sub=${s.subscription}`,
      );
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      console.log(
        `[stripe] ${event.type} sub=${sub.id} status=${sub.status} customer=${sub.customer}`,
      );
      break;
    }
    case "invoice.payment_failed":
    case "invoice.payment_succeeded": {
      const inv = event.data.object as Stripe.Invoice;
      console.log(
        `[stripe] ${event.type} invoice=${inv.id} customer=${inv.customer} amount=${inv.amount_paid}`,
      );
      break;
    }
    default:
      console.log(`[stripe] unhandled event ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
