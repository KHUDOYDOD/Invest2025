import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const id = params.id

    const { error } = await supabase.from("project_launches").delete().eq("id", id)

    if (error) {
      console.error("Error deleting project launch:", error)
      return NextResponse.json({ error: "Failed to delete project launch" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const id = params.id
    const body = await request.json()

    const { data, error } = await supabase.from("project_launches").update(body).eq("id", id).select().single()

    if (error) {
      console.error("Error updating project launch:", error)
      return NextResponse.json({ error: "Failed to update project launch" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const id = params.id

    const { data, error } = await supabase.from("project_launches").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching project launch:", error)
      return NextResponse.json({ error: "Failed to fetch project launch" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
