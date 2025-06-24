import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Force dynamic rendering for this route
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("admin_profiles").select("*").single()

    if (error) {
      console.error("Error fetching admin profile:", error)
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
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
      .from("admin_profiles")
      .update({
        name: body.name,
        email: body.email,
        phone: body.phone,
        position: body.position,
        updated_at: new Date().toISOString(),
      })
      .eq("id", "00000000-0000-0000-0000-000000000001")
      .select()
      .single()

    if (error) {
      console.error("Error updating admin profile:", error)
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
