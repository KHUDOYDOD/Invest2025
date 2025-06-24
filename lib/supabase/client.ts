import { createClient as createBrowserSupabaseClient, type SupabaseClient } from "@supabase/supabase-js"

let browserSupabase: SupabaseClient | null = null

export function createClient(): SupabaseClient {
  if (typeof window === "undefined") {
    throw new Error("createClient (client) must run in the browser.")
  }

  if (!browserSupabase) {
    browserSupabase = createBrowserSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }

  return browserSupabase
}

/* make sure the named export is discoverable */
