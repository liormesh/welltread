/**
 * Supabase browser client. Used in client components for sign-in / sign-out / auth state listeners.
 */

import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = "https://xzjwbrtvxlluwjkjsmgr.supabase.co";

export function createSupabaseBrowserClient() {
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createBrowserClient(SUPABASE_URL, anon);
}
