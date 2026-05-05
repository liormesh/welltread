-- email_unsubscribes: single source of truth for opt-outs across email_signups + profiles.
-- Keyed by lowercased email. Sender gates on this before every send.
-- Date: 2026-05-04

CREATE TABLE IF NOT EXISTS public.email_unsubscribes (
  email             text PRIMARY KEY,
  unsubscribed_at   timestamptz NOT NULL DEFAULT now(),
  source            text,
  metadata          jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS email_unsubscribes_at_idx
  ON public.email_unsubscribes (unsubscribed_at DESC);

ALTER TABLE public.email_unsubscribes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS email_unsubscribes_service_all ON public.email_unsubscribes;
CREATE POLICY email_unsubscribes_service_all ON public.email_unsubscribes
  FOR ALL TO service_role USING (true) WITH CHECK (true);
