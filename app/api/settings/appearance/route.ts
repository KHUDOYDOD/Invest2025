import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Force dynamic rendering for this route
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("appearance_settings").select("*").single()

    if (error) {
      console.error("Error fetching appearance settings:", error)
      return NextResponse.json({ error: "Failed to fetch appearance settings" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("appearance_settings")
      .update({
        primary_color: body.primaryColor,
        secondary_color: body.secondaryColor,
        accent_color: body.accentColor,
        dark_mode: body.darkMode,
        logo_url: body.logoUrl,
        favicon_url: body.faviconUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", "00000000-0000-0000-0000-000000000001")
      .select()
      .single()

    if (error) {
      console.error("Error updating appearance settings:", error)
      return NextResponse.json({ error: "Failed to update appearance settings" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
