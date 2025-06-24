import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Force dynamic rendering for this route
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("project_counter").select("*").single()

    if (error) {
      console.error("Error fetching project counter:", error)
      return NextResponse.json({ error: "Failed to fetch project counter" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("project_counter")
      .update({
        current_count: body.current_count,
        increment_speed: body.increment_speed,
        is_active: body.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", "00000000-0000-0000-0000-000000000001")
      .select()
      .single()

    if (error) {
      console.error("Error updating project counter:", error)
      return NextResponse.json({ error: "Failed to update project counter" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
