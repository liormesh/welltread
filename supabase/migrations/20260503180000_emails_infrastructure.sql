-- Email infrastructure: tracks which emails have been sent + idempotent webhook events
-- Date: 2026-05-03

-- =============================================================================
-- email_sends
-- =============================================================================
-- Tracks every email sent. Used for idempotency (don't double-send the same
-- email to the same session/user) and for analytics (open + click later).
CREATE TABLE IF NOT EXISTS public.email_sends (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id           text NOT NULL,                              -- e.g. "incomplete-quiz-6h"
  recipient_email       text NOT NULL,
  quiz_session_id       uuid REFERENCES public.quiz_sessions(id) ON DELETE SET NULL,
  email_signup_id       uuid REFERENCES public.email_signups(id) ON DELETE SET NULL,
  profile_id            uuid REFERENCES public.profiles(id) ON DELETE SET NULL,

  -- Resend response
  provider_id           text,                                       -- Resend message id
  provider_status       text,                                       -- 'sent' / 'failed' / 'queued'

  -- timing
  scheduled_for         timestamptz,                                -- when the scheduler queued this
  sent_at               timestamptz NOT NULL DEFAULT now(),

  -- env
  metadata              jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS email_sends_session_template_idx
  ON public.email_sends (quiz_session_id, template_id)
  WHERE quiz_session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS email_sends_recipient_idx ON public.email_sends (recipient_email);
CREATE INDEX IF NOT EXISTS email_sends_sent_idx ON public.email_sends (sent_at DESC);
CREATE INDEX IF NOT EXISTS email_sends_template_idx ON public.email_sends (template_id);

ALTER TABLE public.email_sends ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS email_sends_service_all ON public.email_sends;
CREATE POLICY email_sends_service_all ON public.email_sends
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================================
-- stripe_events (placeholder for trial-flow Phase 1)
-- =============================================================================
-- Tracks processed Stripe webhook event ids so we can ack-and-deduplicate.
CREATE TABLE IF NOT EXISTS public.stripe_events (
  id                    text PRIMARY KEY,                           -- evt_xxx from Stripe
  event_type            text NOT NULL,
  processed_at          timestamptz NOT NULL DEFAULT now(),
  payload               jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS stripe_events_type_idx ON public.stripe_events (event_type);
CREATE INDEX IF NOT EXISTS stripe_events_processed_idx ON public.stripe_events (processed_at DESC);

ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS stripe_events_service_all ON public.stripe_events;
CREATE POLICY stripe_events_service_all ON public.stripe_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);
