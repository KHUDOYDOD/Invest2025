import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching testimonials:", error)
      return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("testimonials")
      .insert({
        name: body.name,
        position: body.position,
        company: body.company,
        content: body.content,
        avatar_url: body.avatar_url,
        rating: body.rating,
        is_featured: body.is_featured,
        is_active: body.is_active,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating testimonial:", error)
      return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
