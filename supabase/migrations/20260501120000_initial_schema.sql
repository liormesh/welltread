-- Welltread - initial schema
-- Migration: 20260501120000_initial_schema
-- Purpose: full data model for the multi-niche mobility platform
-- Idempotent: safe to re-run

-- ============================================================================
-- ENABLE EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- gen_random_uuid()

-- ============================================================================
-- HELPERS
-- ============================================================================

-- updated_at trigger function (single function reused across all tables)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- email_signups (already created in earlier migration; declared again for completeness/idempotency)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.email_signups (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email                 text NOT NULL,
  source                text NOT NULL DEFAULT 'home',
  utm                   jsonb NOT NULL DEFAULT '{}'::jsonb,
  user_agent            text,
  ip_country            text,
  created_at            timestamptz NOT NULL DEFAULT now(),
  unsubscribed_at       timestamptz,
  converted_to_user_id  uuid
);

CREATE UNIQUE INDEX IF NOT EXISTS email_signups_email_idx ON public.email_signups (lower(email));
CREATE INDEX IF NOT EXISTS email_signups_source_idx ON public.email_signups (source);
CREATE INDEX IF NOT EXISTS email_signups_created_idx ON public.email_signups (created_at DESC);

ALTER TABLE public.email_signups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS anon_can_insert ON public.email_signups;
CREATE POLICY anon_can_insert ON public.email_signups
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS service_can_read_all ON public.email_signups;
CREATE POLICY service_can_read_all ON public.email_signups
  FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ============================================================================
-- profiles
-- ============================================================================
-- One row per user. Linked to auth.users when they sign up post-trial.
-- Soft-delete via deleted_at (GDPR compliance: retain anonymized record, mask PII).

CREATE TABLE IF NOT EXISTS public.profiles (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id          uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  email_signup_id       uuid REFERENCES public.email_signups(id) ON DELETE SET NULL,

  -- identity
  full_name             text,
  display_name          text,
  email                 text,                                              -- denormalized for queries; auth.users is source of truth

  -- preferences
  timezone              text DEFAULT 'America/New_York',                   -- IANA
  locale                text NOT NULL DEFAULT 'en',
  units_system          text NOT NULL DEFAULT 'imperial' CHECK (units_system IN ('imperial', 'metric')),

  -- niche affinity
  primary_niche         text CHECK (primary_niche IN ('seniors', 'posture', 'postpartum', 'pelvic_floor', 'glp1', 'other')),
  secondary_niches      text[] DEFAULT '{}'::text[],

  -- demo (nullable, used for safer plan generation)
  date_of_birth         date,
  gender                text CHECK (gender IN ('male', 'female', 'nonbinary', 'prefer_not')),

  -- lifecycle
  onboarded_at          timestamptz,
  last_active_at        timestamptz,
  deleted_at            timestamptz,                                       -- soft-delete (GDPR)

  -- flexible
  metadata              jsonb NOT NULL DEFAULT '{}'::jsonb,

  -- system
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS profiles_auth_user_idx ON public.profiles (auth_user_id) WHERE auth_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles (lower(email)) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS profiles_niche_idx ON public.profiles (primary_niche);
CREATE INDEX IF NOT EXISTS profiles_active_idx ON public.profiles (last_active_at DESC) WHERE deleted_at IS NULL;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_self_read ON public.profiles;
CREATE POLICY profiles_self_read ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS profiles_self_update ON public.profiles;
CREATE POLICY profiles_self_update ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS profiles_service_all ON public.profiles;
CREATE POLICY profiles_service_all ON public.profiles
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- backfill the FK now that profiles exists
ALTER TABLE public.email_signups
  DROP CONSTRAINT IF EXISTS email_signups_converted_to_user_fk;
ALTER TABLE public.email_signups
  ADD CONSTRAINT email_signups_converted_to_user_fk
  FOREIGN KEY (converted_to_user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


-- ============================================================================
-- quiz_sessions
-- ============================================================================
-- Anon-insertable. Records the quiz answer graph at runtime.
-- One session = one walk through the quiz. Multiple sessions per profile is fine.

CREATE TABLE IF NOT EXISTS public.quiz_sessions (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id            uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  email_signup_id       uuid REFERENCES public.email_signups(id) ON DELETE SET NULL,

  -- which quiz definition was served (versioned)
  niche                 text NOT NULL,
  quiz_version          text NOT NULL DEFAULT 'v1',

  -- answers as a graph (key = question_id, value = answer)
  answers               jsonb NOT NULL DEFAULT '{}'::jsonb,

  -- attribution
  utm                   jsonb NOT NULL DEFAULT '{}'::jsonb,
  click_ids             jsonb NOT NULL DEFAULT '{}'::jsonb,                -- {fbclid, ttclid, gclid, msclkid}
  client_id             text,                                              -- anonymous browser id
  session_id            text,                                              -- multi-page session

  -- environment
  user_agent            text,
  ip_country            text,
  referrer              text,

  -- lifecycle
  started_at            timestamptz NOT NULL DEFAULT now(),
  completed_at          timestamptz,
  abandoned_at          timestamptz,                                       -- set by cron when started > N hours ago and !completed

  -- output
  plan_id               uuid,                                              -- forward FK, declared after user_plans

  metadata              jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS quiz_sessions_profile_idx ON public.quiz_sessions (profile_id) WHERE profile_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS quiz_sessions_email_signup_idx ON public.quiz_sessions (email_signup_id) WHERE email_signup_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS quiz_sessions_niche_idx ON public.quiz_sessions (niche);
CREATE INDEX IF NOT EXISTS quiz_sessions_completed_idx ON public.quiz_sessions (completed_at DESC) WHERE completed_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS quiz_sessions_started_idx ON public.quiz_sessions (started_at DESC);
CREATE INDEX IF NOT EXISTS quiz_sessions_utm_gin ON public.quiz_sessions USING gin (utm jsonb_path_ops);

ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS quiz_sessions_anon_insert ON public.quiz_sessions;
CREATE POLICY quiz_sessions_anon_insert ON public.quiz_sessions
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS quiz_sessions_self_read ON public.quiz_sessions;
CREATE POLICY quiz_sessions_self_read ON public.quiz_sessions
  FOR SELECT TO authenticated
  USING (
    profile_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
  );

DROP POLICY IF EXISTS quiz_sessions_service_all ON public.quiz_sessions;
CREATE POLICY quiz_sessions_service_all ON public.quiz_sessions
  FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ============================================================================
-- user_plans
-- ============================================================================
-- A snapshot of a generated plan. Plans can be replaced (e.g., user re-takes quiz).
-- replaces_plan_id forms a chain so we can audit plan history per user.

CREATE TABLE IF NOT EXISTS public.user_plans (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id            uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quiz_session_id       uuid REFERENCES public.quiz_sessions(id) ON DELETE SET NULL,

  -- which generator + niche
  niche                 text NOT NULL,
  plan_template_version text NOT NULL DEFAULT 'v1',

  -- duration
  weeks                 int NOT NULL DEFAULT 12 CHECK (weeks > 0 AND weeks <= 52),
  start_date            date NOT NULL DEFAULT CURRENT_DATE,
  end_date              date GENERATED ALWAYS AS (start_date + (weeks * 7)) STORED,

  -- the actual plan (snapshot)
  plan_data             jsonb NOT NULL,                                    -- {weekly_themes, daily_prompts, movement_library_refs}

  -- lifecycle
  status                text NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'paused', 'completed', 'replaced', 'abandoned')),
  replaces_plan_id      uuid REFERENCES public.user_plans(id) ON DELETE SET NULL,
  archived_at           timestamptz,

  -- system
  generated_at          timestamptz NOT NULL DEFAULT now(),
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),

  metadata              jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS user_plans_profile_idx ON public.user_plans (profile_id);
CREATE INDEX IF NOT EXISTS user_plans_status_idx ON public.user_plans (status);
CREATE INDEX IF NOT EXISTS user_plans_active_idx ON public.user_plans (profile_id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS user_plans_quiz_idx ON public.user_plans (quiz_session_id) WHERE quiz_session_id IS NOT NULL;

DROP TRIGGER IF EXISTS user_plans_updated_at ON public.user_plans;
CREATE TRIGGER user_plans_updated_at BEFORE UPDATE ON public.user_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- now that user_plans exists, add the FK from quiz_sessions.plan_id
ALTER TABLE public.quiz_sessions
  DROP CONSTRAINT IF EXISTS quiz_sessions_plan_fk;
ALTER TABLE public.quiz_sessions
  ADD CONSTRAINT quiz_sessions_plan_fk
  FOREIGN KEY (plan_id) REFERENCES public.user_plans(id) ON DELETE SET NULL;

ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_plans_self_read ON public.user_plans;
CREATE POLICY user_plans_self_read ON public.user_plans
  FOR SELECT TO authenticated
  USING (profile_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()));

DROP POLICY IF EXISTS user_plans_service_all ON public.user_plans;
CREATE POLICY user_plans_service_all ON public.user_plans
  FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ============================================================================
-- daily_completions
-- ============================================================================
-- One row per (user, day) tracking 1-2-3: movement, nutrition, habit.
-- High write volume table. Composite indexes critical.
-- Future: PARTITION BY RANGE (date) when row count exceeds 10M.

CREATE TABLE IF NOT EXISTS public.daily_completions (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id            uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id               uuid NOT NULL REFERENCES public.user_plans(id) ON DELETE CASCADE,

  -- where in the plan
  week_number           int NOT NULL CHECK (week_number > 0),
  day_number            int NOT NULL CHECK (day_number BETWEEN 1 AND 7),
  date                  date NOT NULL,

  -- what got done
  movement_completed    boolean NOT NULL DEFAULT false,
  nutrition_logged      boolean NOT NULL DEFAULT false,
  habit_done            boolean NOT NULL DEFAULT false,

  -- detail (optional)
  duration_seconds      int,
  difficulty_rating     int CHECK (difficulty_rating BETWEEN 1 AND 5),
  pain_during           int CHECK (pain_during BETWEEN 0 AND 10),
  energy_after          int CHECK (energy_after BETWEEN 1 AND 5),
  notes                 text,

  -- system
  completed_at          timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now(),

  UNIQUE (profile_id, plan_id, date)
);

CREATE INDEX IF NOT EXISTS daily_completions_profile_date_idx ON public.daily_completions (profile_id, date DESC);
CREATE INDEX IF NOT EXISTS daily_completions_plan_progress_idx ON public.daily_completions (plan_id, week_number, day_number);
CREATE INDEX IF NOT EXISTS daily_completions_recent_completed_idx ON public.daily_completions (completed_at DESC) WHERE completed_at IS NOT NULL;

ALTER TABLE public.daily_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS daily_completions_self_read ON public.daily_completions;
CREATE POLICY daily_completions_self_read ON public.daily_completions
  FOR SELECT TO authenticated
  USING (profile_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()));

DROP POLICY IF EXISTS daily_completions_self_write ON public.daily_completions;
CREATE POLICY daily_completions_self_write ON public.daily_completions
  FOR ALL TO authenticated
  USING (profile_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()))
  WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()));

DROP POLICY IF EXISTS daily_completions_service_all ON public.daily_completions;
CREATE POLICY daily_completions_service_all ON public.daily_completions
  FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ============================================================================
-- weekly_checkins
-- ============================================================================
-- Self-reported weekly state. AI summary generated post-checkin.
-- Photos stored in Supabase Storage; URLs persisted here.

CREATE TABLE IF NOT EXISTS public.weekly_checkins (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id                  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id                     uuid REFERENCES public.user_plans(id) ON DELETE SET NULL,

  week_number                 int NOT NULL,

  -- measurements (allow either system; UI converts based on profile.units_system)
  weight_lbs                  numeric(6, 2),
  weight_kg                   numeric(6, 2),
  body_fat_pct                numeric(4, 2),

  -- self-report (1-5)
  energy_rating               int CHECK (energy_rating BETWEEN 1 AND 5),
  sleep_rating                int CHECK (sleep_rating BETWEEN 1 AND 5),
  pain_rating                 int CHECK (pain_rating BETWEEN 1 AND 5),
  mood_rating                 int CHECK (mood_rating BETWEEN 1 AND 5),
  confidence_rating           int CHECK (confidence_rating BETWEEN 1 AND 5),

  -- qualitative
  photo_urls                  text[] NOT NULL DEFAULT '{}'::text[],
  notes                       text,

  -- AI
  ai_summary                  text,
  ai_summary_generated_at     timestamptz,
  ai_summary_model            text,

  created_at                  timestamptz NOT NULL DEFAULT now(),

  UNIQUE (profile_id, plan_id, week_number)
);

CREATE INDEX IF NOT EXISTS weekly_checkins_profile_idx ON public.weekly_checkins (profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS weekly_checkins_plan_idx ON public.weekly_checkins (plan_id, week_number);

ALTER TABLE public.weekly_checkins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS weekly_checkins_self_read ON public.weekly_checkins;
CREATE POLICY weekly_checkins_self_read ON public.weekly_checkins
  FOR SELECT TO authenticated
  USING (profile_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()));

DROP POLICY IF EXISTS weekly_checkins_self_write ON public.weekly_checkins;
CREATE POLICY weekly_checkins_self_write ON public.weekly_checkins
  FOR ALL TO authenticated
  USING (profile_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()))
  WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()));

DROP POLICY IF EXISTS weekly_checkins_service_all ON public.weekly_checkins;
CREATE POLICY weekly_checkins_service_all ON public.weekly_checkins
  FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ============================================================================
-- subscriptions
-- ============================================================================
-- Mirror of Stripe state. Webhook is the only writer.
-- ON DELETE RESTRICT on profile FK because we want billing history preserved.

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id                  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,

  -- stripe
  stripe_customer_id          text NOT NULL,
  stripe_subscription_id      text NOT NULL UNIQUE,
  stripe_price_id             text NOT NULL,

  -- state
  status                      text NOT NULL
                              CHECK (status IN ('trialing', 'active', 'past_due', 'unpaid', 'canceled', 'incomplete', 'incomplete_expired', 'paused')),
  tier                        text NOT NULL
                              CHECK (tier IN ('trial', 'monthly', 'quarterly', 'biannual', 'annual')),

  -- pricing snapshot at subscription time
  amount_cents                int NOT NULL,
  currency                    text NOT NULL DEFAULT 'USD',
  interval_unit               text CHECK (interval_unit IN ('day', 'week', 'month', 'year')),
  interval_count              int,

  -- timeline
  trial_start                 timestamptz,
  trial_end                   timestamptz,
  current_period_start        timestamptz NOT NULL,
  current_period_end          timestamptz NOT NULL,
  cancel_at                   timestamptz,
  canceled_at                 timestamptz,
  ended_at                    timestamptz,

  -- payment method snapshot (for retention nudges, "your card ending 1234 expires soon")
  payment_method_brand        text,
  payment_method_last4        text,
  payment_method_exp_month    int,
  payment_method_exp_year     int,

  -- system
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now(),

  metadata                    jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS subscriptions_profile_idx ON public.subscriptions (profile_id);
CREATE INDEX IF NOT EXISTS subscriptions_active_idx ON public.subscriptions (profile_id) WHERE status IN ('trialing', 'active', 'past_due');
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON public.subscriptions (status);
CREATE INDEX IF NOT EXISTS subscriptions_period_end_idx ON public.subscriptions (current_period_end);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_customer_idx ON public.subscriptions (stripe_customer_id);

DROP TRIGGER IF EXISTS subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS subscriptions_self_read ON public.subscriptions;
CREATE POLICY subscriptions_self_read ON public.subscriptions
  FOR SELECT TO authenticated
  USING (profile_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()));

DROP POLICY IF EXISTS subscriptions_service_all ON public.subscriptions;
CREATE POLICY subscriptions_service_all ON public.subscriptions
  FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ============================================================================
-- events
-- ============================================================================
-- Server-side analytics events + CAPI fan-out tracker.
-- Service-role writes only. Future: PARTITION BY RANGE (created_at) at >100M rows.

CREATE TABLE IF NOT EXISTS public.events (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id            uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  email_signup_id       uuid REFERENCES public.email_signups(id) ON DELETE SET NULL,
  quiz_session_id       uuid REFERENCES public.quiz_sessions(id) ON DELETE SET NULL,

  -- event identity
  event_name            text NOT NULL,
  event_category        text,
  event_id_external     text,                                              -- the dedup id we send to all CAPIs

  -- payload
  properties            jsonb NOT NULL DEFAULT '{}'::jsonb,

  -- attribution
  client_id             text,
  session_id            text,
  utm                   jsonb NOT NULL DEFAULT '{}'::jsonb,
  click_ids             jsonb NOT NULL DEFAULT '{}'::jsonb,

  -- environment
  user_agent            text,
  ip_country            text,
  referrer              text,
  url                   text,

  -- monetization
  value_cents           int,
  currency              text,

  -- CAPI fan-out tracking
  synced_to             text[] NOT NULL DEFAULT '{}'::text[],              -- ['meta', 'tiktok', 'google', 'reddit', 'pinterest', 'ga4']
  sync_errors           jsonb NOT NULL DEFAULT '{}'::jsonb,                -- {meta: '...', tiktok: '...'}

  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS events_event_name_idx ON public.events (event_name);
CREATE INDEX IF NOT EXISTS events_profile_idx ON public.events (profile_id, created_at DESC) WHERE profile_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS events_created_idx ON public.events (created_at DESC);
CREATE INDEX IF NOT EXISTS events_external_idx ON public.events (event_id_external) WHERE event_id_external IS NOT NULL;
CREATE INDEX IF NOT EXISTS events_utm_gin ON public.events USING gin (utm jsonb_path_ops);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS events_service_all ON public.events;
CREATE POLICY events_service_all ON public.events
  FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ============================================================================
-- movement_library
-- ============================================================================
-- Catalog of movements/exercises. Public-read content. Service-role writes.
-- Plan generator picks from this library subject to user constraints.

CREATE TABLE IF NOT EXISTS public.movement_library (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                        text NOT NULL UNIQUE,
  name                        text NOT NULL,
  short_description           text,
  long_description            text,

  -- media
  video_url                   text,
  thumbnail_url               text,
  demo_image_urls             text[] NOT NULL DEFAULT '{}'::text[],

  -- classification
  niche_tags                  text[] NOT NULL DEFAULT '{}'::text[],        -- ['seniors', 'posture', 'postpartum', etc.]
  movement_pattern            text,                                        -- e.g., 'hinge', 'squat', 'rotation', 'balance'
  body_region                 text[] NOT NULL DEFAULT '{}'::text[],        -- ['lower_back', 'hips', 'shoulders']

  -- characteristics
  intensity_level             int CHECK (intensity_level BETWEEN 1 AND 5),
  duration_seconds            int,
  equipment_required          text[] NOT NULL DEFAULT '{}'::text[],        -- ['mat', 'band', 'chair', 'wall']

  -- safety
  contraindications           text[] NOT NULL DEFAULT '{}'::text[],        -- ['recent_back_surgery', 'unmedicated_hypertension']
  prerequisites               text[] NOT NULL DEFAULT '{}'::text[],        -- references to easier movements first

  -- content review
  reviewed_by                 text,                                        -- e.g., 'Dr. Jane Smith, DPT'
  review_date                 date,

  -- lifecycle
  status                      text NOT NULL DEFAULT 'draft'
                              CHECK (status IN ('draft', 'published', 'archived')),
  archived_at                 timestamptz,

  -- system
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now(),

  metadata                    jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS movement_library_published_idx ON public.movement_library (status) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS movement_library_niche_gin ON public.movement_library USING gin (niche_tags);
CREATE INDEX IF NOT EXISTS movement_library_pattern_idx ON public.movement_library (movement_pattern) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS movement_library_intensity_idx ON public.movement_library (intensity_level) WHERE status = 'published';

DROP TRIGGER IF EXISTS movement_library_updated_at ON public.movement_library;
CREATE TRIGGER movement_library_updated_at BEFORE UPDATE ON public.movement_library
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.movement_library ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS movement_library_public_read ON public.movement_library;
CREATE POLICY movement_library_public_read ON public.movement_library
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS movement_library_service_all ON public.movement_library;
CREATE POLICY movement_library_service_all ON public.movement_library
  FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ============================================================================
-- DONE
-- ============================================================================
-- Schema as of 2026-05-01.
-- Future migrations:
--   - audit_log table when admin-actions volume justifies
--   - achievements / badges if gamification ships
--   - exercise_progressions (parent/child relationships in movement_library)
--   - PARTITION daily_completions and events by date when row count >10M / >100M
