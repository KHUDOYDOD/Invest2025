import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("testimonials")
      .update({
        name: body.name,
        position: body.position,
        company: body.company,
        content: body.content,
        avatar_url: body.avatar_url,
        rating: body.rating,
        is_featured: body.is_featured,
        is_active: body.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating testimonial:", error)
      return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("testimonials").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting testimonial:", error)
      return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
