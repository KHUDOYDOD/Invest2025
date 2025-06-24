import { createClient as createServerSupabaseClient, type SupabaseClient } from "@supabase/supabase-js"

let serverSupabase: SupabaseClient | null = null

export function createClient(): SupabaseClient {
  if (!serverSupabase) {
    serverSupabase = createServerSupabaseClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  }

  return serverSupabase
}

/* make sure the named export is discoverable */
