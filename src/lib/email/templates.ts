/**
 * Welltread email templates.
 *
 * 16 emails, organized into:
 *   - Acquisition (quiz incomplete, plan abandonment, win-back) - 8 templates
 *   - Trial / payment lifecycle - 8 templates
 *
 * Each template is a function that takes context and returns { subject, html, text }.
 *
 * Style notes:
 * - Plain HTML, no React Email dep. Cleaner, more reliable across clients.
 * - System-font stack only (per the no-custom-fonts rule).
 * - No em dashes (per the no-em-dashes rule). Hyphens only.
 * - Hyperlinks in sage. Single CTA per email. Soft.
 * - Plain-text mirror always present (deliverability + accessibility).
 */

const SAGE = "#2D4F4A";
const PAPER = "#FAF7F2";
const INK = "#1A1A1A";
const INK_SOFT = "#4B5152";
const CLAY = "#C18C5D";

const FONT_STACK = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;

type TemplateOutput = {
  subject: string;
  html: string;
  text: string;
};

type Ctx = {
  /** A friendly first-name if we have it, else null - templates avoid generic greetings if absent. */
  firstName?: string | null;
  /** Resume link (already minted with token) for re-engagement emails. */
  resumeUrl?: string;
  /** Direct checkout link (already minted with token). */
  checkoutUrl?: string;
  /** The user's stated activity from Q19 (normalized via Claude). */
  activity?: string | null;
  /** Niche, if known. */
  niche?: "seniors" | "posture" | "general" | null;
  /** Tier display name + per-day price for trial / payment emails. */
  tierName?: string;
  tierPrice?: string;
  perDay?: string;
  /** Used in trial emails. */
  trialEndDate?: string;
  /** Used in cancellation / refund. */
  effectiveDate?: string;
  /** Magic-link login URL. */
  loginUrl?: string;
  /** Billing-update URL (Stripe customer portal). */
  billingUrl?: string;
  /** Support contact mailto. */
  supportEmail?: string;
  /** Cast portrait URL for the niche-lead character (header avatar). */
  castImageUrl?: string;
  /** Cast first name, used in the "From: <name>" voicing line. */
  castName?: string;
};

function wrap(content: string, ctx?: Ctx): string {
  // Inline SVG symbol — three ascending dashes, sage. Email clients support inline SVG inconsistently;
  // VML fallback would be ideal but adds bulk. Most modern clients (Gmail, Apple Mail, Outlook 2019+) render it.
  const symbolSvg = `<svg width="20" height="20" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;"><g fill="${SAGE}"><rect x="4" y="26" width="11" height="4" rx="2"/><rect x="14.5" y="18" width="11" height="4" rx="2"/><rect x="25" y="10" width="11" height="4" rx="2"/></g></svg>`;

  // Header: niche-lead cast portrait (avatar) + Welltread lockup.
  // Falls back to lockup only if no cast image is provided.
  const wordmarkHtml = `<span style="display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:600;color:${SAGE};letter-spacing:0.2em;text-transform:uppercase;">${symbolSvg}<span>Welltread</span></span>`;

  const headerHtml = ctx?.castImageUrl
    ? `<div style="display:flex;align-items:center;gap:12px;margin-bottom:32px;">
         <img src="${ctx.castImageUrl}" alt="${ctx.castName ?? "Welltread"}" width="48" height="60" style="display:block;width:48px;height:60px;border-radius:12px;object-fit:cover;border:1px solid #E6DFCF;" />
         <div>
           ${wordmarkHtml}
           ${ctx.castName ? `<div style="font-size:12px;color:${INK_SOFT};margin-top:2px;">From ${ctx.castName}</div>` : ""}
         </div>
       </div>`
    : `<div style="text-align:left;margin-bottom:32px;">
         ${wordmarkHtml}
       </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Welltread</title>
</head>
<body style="margin:0;padding:0;background:${PAPER};font-family:${FONT_STACK};color:${INK};">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;">
  ${headerHtml}
  ${content}
  <hr style="border:none;border-top:1px solid #E6DFCF;margin:48px 0 24px;">
  <p style="font-size:12px;color:${INK_SOFT};line-height:1.6;">
    Welltread, Inc. - personalized movement programs for the body you have today.<br>
    Questions? Reply to this email or write to us at hello@welltread.co.<br>
    <a href="{{unsubscribe_url}}" style="color:${INK_SOFT};text-decoration:underline;">Unsubscribe</a>
  </p>
</div>
</body>
</html>`;
}

function button(url: string, label: string): string {
  return `<div style="margin:32px 0;">
    <a href="${url}" style="display:inline-block;background:${SAGE};color:${PAPER};text-decoration:none;font-weight:500;padding:14px 28px;border-radius:14px;font-size:15px;">${label}</a>
  </div>`;
}

function softLink(url: string, label: string): string {
  return `<a href="${url}" style="color:${SAGE};text-decoration:underline;">${label}</a>`;
}

function greeting(ctx: Ctx, fallback = "Hi"): string {
  if (ctx.firstName) return `Hi ${ctx.firstName},`;
  return `${fallback},`;
}

const SUPPORT = "hello@welltread.co";

/* ====================================================================== */
/* ACQUISITION FLOW (Pre-payment) - 8 templates                          */
/* ====================================================================== */

/** A1 - sent 6h after quiz_session.started_at if !completed_at */
export function quizIncomplete6h(ctx: Ctx): TemplateOutput {
  const url = ctx.resumeUrl ?? "https://welltread.co/quiz";
  const subject = "Your assessment is half done";
  const text = `${greeting(ctx)}

You started your Welltread assessment a little while ago. It takes about 5 minutes to finish, and your plan is waiting on the other side.

Pick up where you left off: ${url}

If anything was unclear or felt heavy - that's normal. Most of our members come to us after years of pushing through.

- The Welltread team

If you want us to stop reminding you, ${SUPPORT}.`;
  const html = wrap(`
    <h1 style="font-size:28px;font-weight:600;margin:0 0 16px;color:${INK};line-height:1.2;">Your assessment is half done</h1>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">${greeting(ctx)}</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">You started your Welltread assessment a little while ago. It takes about 5 minutes to finish, and your plan is waiting on the other side.</p>
    ${button(url, "Pick up where I left off")}
    <p style="font-size:14px;line-height:1.6;color:${INK_SOFT};margin:0;">If anything was unclear or felt heavy - that's normal. Most of our members come to us after years of pushing through.</p>
  `, ctx);
  return { subject, html, text };
}

/** A2 - sent 24h after quiz_session.started_at if !completed_at */
export function quizIncomplete24h(ctx: Ctx): TemplateOutput {
  const url = ctx.resumeUrl ?? "https://welltread.co/quiz";
  const subject = "Your plan is one step away";
  const text = `${greeting(ctx)}

The body you have today is the starting line - not a problem to solve. We just need a few more answers to design around it.

Pick up where you left off: ${url}

It's about 2 minutes from here.

- The Welltread team`;
  const html = wrap(`
    <h1 style="font-size:28px;font-weight:600;margin:0 0 16px;color:${INK};line-height:1.2;">Your plan is one step away</h1>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">${greeting(ctx)}</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">The body you have today is the starting line - not a problem to solve. We just need a few more answers to design around it.</p>
    ${button(url, "Continue my assessment")}
    <p style="font-size:14px;line-height:1.6;color:${INK_SOFT};margin:0;">It's about 2 minutes from here.</p>
  `, ctx);
  return { subject, html, text };
}

/** A3 - sent 7d after quiz_session.started_at if still !completed_at */
export function quizIncomplete7d(ctx: Ctx): TemplateOutput {
  const url = ctx.resumeUrl ?? "https://welltread.co/quiz";
  const subject = "Last reminder - your plan is waiting";
  const text = `${greeting(ctx)}

We won't keep nudging. Your assessment answers are saved and your plan is one click away whenever you're ready.

Continue here: ${url}

If this isn't the right time, no worries. We'll be here when it is.

- The Welltread team`;
  const html = wrap(`
    <h1 style="font-size:28px;font-weight:600;margin:0 0 16px;color:${INK};line-height:1.2;">Last reminder - your plan is waiting</h1>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">${greeting(ctx)}</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">We won't keep nudging. Your assessment answers are saved and your plan is one click away whenever you're ready.</p>
    ${button(url, "Continue my assessment")}
    <p style="font-size:14px;line-height:1.6;color:${INK_SOFT};margin:0;">If this isn't the right time, no worries. We'll be here when it is.</p>
  `, ctx);
  return { subject, html, text };
}

/** A4 - sent 2h after quiz_session.completed_at if no checkout */
export function planReady2h(ctx: Ctx): TemplateOutput {
  const url = ctx.resumeUrl ?? "https://welltread.co/plan";
  const subject = "Your 12-week plan is ready";
  const activityLine = ctx.activity
    ? `You told us you want to ${ctx.activity}. We built around that.`
    : `We built it around your answers - your time, your body, your goals.`;
  const text = `${greeting(ctx)}

Your personalized 12-week plan is built and waiting.

${activityLine}

See your plan: ${url}

You can start with a $1 trial or skip the trial entirely if you'd rather commit. 30-day money-back, either way.

- The Welltread team`;
  const html = wrap(`
    <h1 style="font-size:28px;font-weight:600;margin:0 0 16px;color:${INK};line-height:1.2;">Your 12-week plan is ready</h1>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">${greeting(ctx)}</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">${activityLine}</p>
    ${button(url, "See my plan")}
    <p style="font-size:14px;line-height:1.6;color:${INK_SOFT};margin:0;">$1 trial or pay-now option, your choice. 30-day money-back either way.</p>
  `, ctx);
  return { subject, html, text };
}

/** A5 - sent 24h after quiz_session.completed_at if no checkout. More personal. */
export function planReady24h(ctx: Ctx): TemplateOutput {
  const url = ctx.resumeUrl ?? "https://welltread.co/plan";
  const subject = ctx.activity
    ? `${ctx.firstName ?? "Hi"} - here's what we built for you`
    : "Here's what we built for you";
  const activityCallout = ctx.activity
    ? `<blockquote style="border-left:3px solid ${CLAY};padding:8px 16px;margin:16px 0;color:${INK};font-style:italic;">"${ctx.activity}"</blockquote>`
    : "";
  const text = `${greeting(ctx)}

${ctx.activity ? `You said you wanted to ${ctx.activity}. ` : ""}We took your answers and shaped a 12-week plan around them. Same time you've got, same body you've got. Just sequenced properly.

See it here: ${url}

You can take a look without committing. The plan reveal walks you through what week 1, week 6, and week 12 look like.

- The Welltread team`;
  const html = wrap(`
    <h1 style="font-size:28px;font-weight:600;margin:0 0 16px;color:${INK};line-height:1.2;">${ctx.activity ? "Here's what we built for you" : "Your plan is ready to view"}</h1>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 8px;">${greeting(ctx)}</p>
    ${activityCallout}
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:16px 0;">We took your answers and shaped a 12-week plan around them. Same time you've got, same body you've got. Just sequenced properly.</p>
    ${button(url, "See my plan")}
    <p style="font-size:14px;line-height:1.6;color:${INK_SOFT};margin:0;">Take a look without committing. The plan reveal walks you through week 1, 6, and 12.</p>
  `, ctx);
  return { subject, html, text };
}

/** A6 - sent 72h after completion, no checkout. Trust angle. */
export function planReady72h(ctx: Ctx): TemplateOutput {
  const url = ctx.resumeUrl ?? "https://welltread.co/plan";
  const subject = "30-day money-back, no risk";
  const text = `${greeting(ctx)}

If you've been on the fence about Welltread, two things worth knowing:

- 30-day money-back guarantee, no questions. If it doesn't fit your body or your life, we refund.
- $1 trial first if you want to test before committing. Pay-now is also an option if you'd rather skip the trial.

Whichever you pick: ${url}

- The Welltread team`;
  const html = wrap(`
    <h1 style="font-size:28px;font-weight:600;margin:0 0 16px;color:${INK};line-height:1.2;">30-day money-back, no risk</h1>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">${greeting(ctx)}</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 8px;">If you've been on the fence about Welltread, two things worth knowing:</p>
    <ul style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;padding-left:20px;">
      <li><strong style="color:${INK};">30-day money-back guarantee</strong>, no questions. If it doesn't fit your body or your life, we refund.</li>
      <li><strong style="color:${INK};">$1 trial</strong> first if you want to test. Pay-now also an option if you'd rather skip.</li>
    </ul>
    ${button(url, "See my plan")}
  `, ctx);
  return { subject, html, text };
}

/** A7 - sent 14d after completion, no checkout. Soft check-in. */
export function planSoftCheckin14d(ctx: Ctx): TemplateOutput {
  const url = ctx.resumeUrl ?? "https://welltread.co/plan";
  const subject = "Any questions about your plan?";
  const text = `${greeting(ctx)}

We noticed your plan is still sitting there. Did you have any questions before starting?

You can reply to this email - a real person reads it. Or take another look here: ${url}

If the program isn't right for you right now, that's a totally valid answer too. We won't push.

- Lior, founder
hello@welltread.co`;
  const html = wrap(`
    <h1 style="font-size:28px;font-weight:600;margin:0 0 16px;color:${INK};line-height:1.2;">Any questions about your plan?</h1>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">${greeting(ctx)}</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">We noticed your plan is still sitting there. Did you have any questions before starting?</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">You can reply to this email - a real person reads it. Or take another look here: ${softLink(url, "your plan")}.</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">If the program isn't right for you right now, that's a totally valid answer too. We won't push.</p>
    <p style="font-size:14px;line-height:1.6;color:${INK};margin:24px 0 0;"><em>- Lior, founder</em></p>
  `, ctx);
  return { subject, html, text };
}

/** A8 - sent 30d after completion, no checkout. Win-back. Free week-1 sample. */
export function winBack30d(ctx: Ctx): TemplateOutput {
  const url = ctx.resumeUrl ?? "https://welltread.co/plan";
  const subject = "A free week, no commitment";
  const text = `${greeting(ctx)}

It's been a month since you took the assessment. Life happens.

If you're curious but not ready to commit, we'd love to send you the first week of your plan free. Three short sessions, no card, no email follow-up about it. Just see if it fits.

Get the free week: ${url}

- The Welltread team`;
  const html = wrap(`
    <h1 style="font-size:28px;font-weight:600;margin:0 0 16px;color:${INK};line-height:1.2;">A free week, no commitment</h1>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">${greeting(ctx)}</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">It's been a month since you took the assessment. Life happens.</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">If you're curious but not ready to commit, we'd love to send you the first week of your plan free. Three short sessions, no card, no email follow-up about it. Just see if it fits.</p>
    ${button(url, "Send me the free week")}
  `, ctx);
  return { subject, html, text };
}

/* ====================================================================== */
/* TRIAL & PAYMENT LIFECYCLE - 8 templates                               */
/* ====================================================================== */

/** P1 - sent immediately on checkout.session.completed (trial OR pay-now) */
export function trialWelcome(ctx: Ctx): TemplateOutput {
  const url = ctx.loginUrl ?? "https://welltread.app";
  const subject = "Welcome - your plan starts now";
  const text = `${greeting(ctx)}

Welcome to Welltread. Your 12-week plan is live.

Sign in here: ${url}

This link logs you in directly - no password to remember. You'll land on day 1 of your plan, and we'll send a daily nudge if that's the cadence you picked.

A few things worth knowing:
- 12 minutes a day, ${ctx.tierName ?? "your plan"} runs for 12 weeks
- Cancel anytime in your account settings
- 30-day money-back guarantee on month 1

If anything ever doesn't feel right, the in-app "this hurts" button swaps the movement, no questions.

- The Welltread team`;
  const html = wrap(`
    <h1 style="font-size:28px;font-weight:600;margin:0 0 16px;color:${INK};line-height:1.2;">Welcome - your plan starts now</h1>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">${greeting(ctx)}</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">Welcome to Welltread. Your 12-week plan is live.</p>
    ${button(url, "Sign in to your plan")}
    <p style="font-size:14px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">This link logs you in directly. You'll land on day 1, and we'll send a daily nudge if that's what you picked.</p>
    <p style="font-size:14px;line-height:1.6;color:${INK_SOFT};margin:0;">Cancel anytime in your account. 30-day money-back guarantee on month 1.</p>
  `, ctx);
  return { subject, html, text };
}

/** P2 - sent day 3 of trial, engagement nudge */
export function trialDay3(ctx: Ctx): TemplateOutput {
  const url = ctx.loginUrl ?? "https://welltread.app/today";
  const subject = "How's day 3?";
  const text = `${greeting(ctx)}

Day 3 is when most of our members start to feel a small shift. Less stiffness, sharper focus, slightly better sleep.

If you've started: keep going. Day 4 is the foundation block we've designed around your answers.

If you haven't yet: no judgment. Today is a fine day to start. Even 6 minutes counts.

Today's session: ${url}

- The Welltread team`;
  const html = wrap(`
    <h1 style="font-size:28px;font-weight:600;margin:0 0 16px;color:${INK};line-height:1.2;">How's day 3?</h1>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">${greeting(ctx)}</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">Day 3 is when most of our members start to feel a small shift. Less stiffness, sharper focus, slightly better sleep.</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">If you've started: keep going. If you haven't yet: today is a fine day to start. Even 6 minutes counts.</p>
    ${button(url, "Today's session")}
  `, ctx);
  return { subject, html, text };
}

/** P3 - sent on customer.subscription.trial_will_end (day 6) */
export function trialEndingSoon(ctx: Ctx): TemplateOutput {
  const billing = ctx.billingUrl ?? "https://welltread.app/billing";
  const dateLine = ctx.trialEndDate ? `tomorrow (${ctx.trialEndDate})` : "tomorrow";
  const subject = "Your trial ends tomorrow";
  const text = `${greeting(ctx)}

Quick heads up - your $1 trial ends ${dateLine}. After that, your ${ctx.tierName ?? "plan"} starts at ${ctx.tierPrice ?? "the chosen tier"} (${ctx.perDay ?? ""}).

You don't need to do anything. The plan continues, the program adapts as you do.

If you'd rather not continue, cancel here: ${billing}. You'll keep access through tomorrow.

If you have questions about anything: hello@welltread.co.

- The Welltread team`;
  const html = wrap(`
    <h1 style="font-size:28px;font-weight:600;margin:0 0 16px;color:${INK};line-height:1.2;">Your trial ends ${dateLine}</h1>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">${greeting(ctx)}</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">Quick heads up - after that, your ${ctx.tierName ?? "plan"} starts at <strong>${ctx.tierPrice ?? "the chosen tier"}</strong> (${ctx.perDay ?? ""}).</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">You don't need to do anything. The plan continues, the program adapts as you do.</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">If you'd rather not continue, ${softLink(billing, "cancel here")} - you'll keep access through tomorrow.</p>
  `, ctx);
  return { subject, html, text };
}

/** P4 - sent on first invoice.paid (day 8) */
export function paidMonth1(ctx: Ctx): TemplateOutput {
  const url = ctx.loginUrl ?? "https://welltread.app/today";
  const subject = "Welcome to month 1";
  const text = `${greeting(ctx)}

Your trial converted - thanks for sticking with it. ${ctx.tierName ? `Your ${ctx.tierName} plan` : "Your plan"} is now active.

This week is your first real progression. Slightly longer, slightly steadier, your body's ready for it.

Today's session: ${url}

Reminder: cancel anytime, 30-day money-back. Your plan adapts as you do.

- The Welltread team`;
  const html = wrap(`
    <h1 style="font-size:28px;font-weight:600;margin:0 0 16px;color:${INK};line-height:1.2;">Welcome to month 1</h1>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">${greeting(ctx)}</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">Your trial converted - thanks for sticking with it. ${ctx.tierName ? `Your <strong>${ctx.tierName}</strong> plan` : "Your plan"} is now active.</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">This week is your first real progression. Slightly longer, slightly steadier, your body's ready for it.</p>
    ${button(url, "Today's session")}
    <p style="font-size:14px;line-height:1.6;color:${INK_SOFT};margin:0;">Cancel anytime, 30-day money-back, plan adapts as you do.</p>
  `, ctx);
  return { subject, html, text };
}

/** P5 - sent on invoice.payment_failed */
export function paymentFailed(ctx: Ctx): TemplateOutput {
  const billing = ctx.billingUrl ?? "https://welltread.app/billing";
  const subject = "We couldn't bill your card";
  const text = `${greeting(ctx)}

Your card declined when we tried to renew your Welltread subscription. Could be expiry, insufficient funds, or your bank flagging the charge.

Update your payment method here: ${billing}

We'll automatically retry over the next few days. If that fails too, your access pauses (it doesn't disappear - we'll keep your plan and your progress).

Need help? hello@welltread.co.

- The Welltread team`;
  const html = wrap(`
    <h1 style="font-size:28px;font-weight:600;margin:0 0 16px;color:${INK};line-height:1.2;">We couldn't bill your card</h1>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">${greeting(ctx)}</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">Your card declined. Could be expiry, insufficient funds, or your bank flagging the charge.</p>
    ${button(billing, "Update payment method")}
    <p style="font-size:14px;line-height:1.6;color:${INK_SOFT};margin:0;">We'll auto-retry over the next few days. If that fails, access pauses (your plan + progress are preserved).</p>
  `, ctx);
  return { subject, html, text };
}

/** P6 - sent on customer.subscription.deleted */
export function cancellationConfirmed(ctx: Ctx): TemplateOutput {
  const dateLine = ctx.effectiveDate ? `on ${ctx.effectiveDate}` : "at the end of your current billing period";
  const subject = "Your subscription is cancelled";
  const text = `${greeting(ctx)}

Your Welltread subscription is cancelled. You'll keep full access ${dateLine}, then your account quietly closes.

A few things:
- Your plan and progress are preserved if you ever want to come back. Same email, same place.
- We don't do exit interviews. But if you want to share why, hit reply - it actually helps us.
- The door is open. Always.

- The Welltread team`;
  const html = wrap(`
    <h1 style="font-size:28px;font-weight:600;margin:0 0 16px;color:${INK};line-height:1.2;">Your subscription is cancelled</h1>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">${greeting(ctx)}</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">You'll keep full access ${dateLine}.</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">Your plan and progress are preserved if you ever want to come back. Same email, same place.</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">If you want to share why, hit reply. It actually helps us.</p>
    <p style="font-size:14px;line-height:1.6;color:${INK};margin:24px 0 0;"><em>The door is open. Always.</em></p>
  `, ctx);
  return { subject, html, text };
}

/** P7 - sent on charge.refunded */
export function refundProcessed(ctx: Ctx): TemplateOutput {
  const subject = "Your refund is on the way";
  const text = `${greeting(ctx)}

We've processed your refund. It should land back on your card within 5-10 business days, depending on your bank.

Your Welltread access has been removed, but your plan stays in our system. If you ever come back, we pick up where you left off.

If we got something wrong about your experience and you'd like to share, hello@welltread.co - I'd genuinely like to hear it.

- Lior, founder`;
  const html = wrap(`
    <h1 style="font-size:28px;font-weight:600;margin:0 0 16px;color:${INK};line-height:1.2;">Your refund is on the way</h1>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">${greeting(ctx)}</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">It should land back on your card within 5-10 business days, depending on your bank.</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">Your access has been removed, but your plan stays in our system. If you ever come back, we pick up where you left off.</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">If we got something wrong and you'd like to share, hit reply. I'd genuinely like to hear it.</p>
    <p style="font-size:14px;line-height:1.6;color:${INK};margin:24px 0 0;"><em>- Lior, founder</em></p>
  `, ctx);
  return { subject, html, text };
}

/** P8 - cancellation win-back, sent 30d after cancellation */
export function winBackCancel(ctx: Ctx): TemplateOutput {
  const url = ctx.loginUrl ?? "https://welltread.co/quiz";
  const subject = "It's been a month - here's a free week";
  const text = `${greeting(ctx)}

A month ago you cancelled your Welltread subscription. No hard feelings. We just wanted to circle back.

If you're curious about coming back: we'll comp you week 1 free. Three sessions, no card, no commitment. Just see if it fits differently this time.

Reactivate here: ${url}

If not, this is the last we'll bother you. Promise.

- The Welltread team`;
  const html = wrap(`
    <h1 style="font-size:28px;font-weight:600;margin:0 0 16px;color:${INK};line-height:1.2;">It's been a month</h1>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">${greeting(ctx)}</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">A month ago you cancelled. No hard feelings. We just wanted to circle back.</p>
    <p style="font-size:16px;line-height:1.6;color:${INK_SOFT};margin:0 0 16px;">If you're curious about coming back: we'll comp you week 1 free. Three sessions, no card, no commitment.</p>
    ${button(url, "Try the free week")}
    <p style="font-size:14px;line-height:1.6;color:${INK_SOFT};margin:0;">If not, this is the last we'll bother you. Promise.</p>
  `, ctx);
  return { subject, html, text };
}

/* ====================================================================== */
/* Registry - all templates by id, for the scheduler + preview page      */
/* ====================================================================== */

export type TemplateRender = (ctx: Ctx) => TemplateOutput;

export const TEMPLATES: Record<string, TemplateRender> = {
  // Acquisition (will be auto-sent)
  "quiz-incomplete-6h": quizIncomplete6h,
  "quiz-incomplete-24h": quizIncomplete24h,
  "quiz-incomplete-7d": quizIncomplete7d,
  "plan-ready-2h": planReady2h,
  "plan-ready-24h": planReady24h,
  "plan-ready-72h": planReady72h,
  "plan-soft-checkin-14d": planSoftCheckin14d,
  "win-back-30d": winBack30d,

  // Trial / payment (templates only - wiring deferred until Stripe lands)
  "trial-welcome": trialWelcome,
  "trial-day-3": trialDay3,
  "trial-ending-soon": trialEndingSoon,
  "paid-month-1": paidMonth1,
  "payment-failed": paymentFailed,
  "cancellation-confirmed": cancellationConfirmed,
  "refund-processed": refundProcessed,
  "win-back-cancel": winBackCancel,
};

export const TEMPLATE_GROUPS = {
  acquisition: [
    "quiz-incomplete-6h",
    "quiz-incomplete-24h",
    "quiz-incomplete-7d",
    "plan-ready-2h",
    "plan-ready-24h",
    "plan-ready-72h",
    "plan-soft-checkin-14d",
    "win-back-30d",
  ] as const,
  payment: [
    "trial-welcome",
    "trial-day-3",
    "trial-ending-soon",
    "paid-month-1",
    "payment-failed",
    "cancellation-confirmed",
    "refund-processed",
    "win-back-cancel",
  ] as const,
};

export type TemplateId = keyof typeof TEMPLATES;
