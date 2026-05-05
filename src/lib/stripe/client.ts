/**
 * Server-side Stripe client.
 *
 * Single shared instance per Worker invocation. Keys come from env:
 *   STRIPE_SECRET_KEY       — required, sk_test_... or sk_live_...
 *   STRIPE_PRICE_RECURRING  — the subscription price (3-month, $59 default)
 *   STRIPE_PRICE_TRIAL_FEE  — the one-time $1 trial-start fee
 *   STRIPE_WEBHOOK_SECRET   — for verifying inbound webhook events
 */
import Stripe from "stripe";

let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY env var is required");
  cached = new Stripe(key);
  return cached;
}

export function getPriceIds() {
  return {
    recurring: process.env.STRIPE_PRICE_RECURRING ?? "",
    trialFee: process.env.STRIPE_PRICE_TRIAL_FEE ?? "",
  };
}

export function getAppBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.APP_URL ??
    "https://welltread.co"
  );
}
