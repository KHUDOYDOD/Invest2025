import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("project_launches")
      .select("*")
      .order("launch_date", { ascending: true })

    if (error) {
      console.error("Error fetching project launches:", error)
      return NextResponse.json({ error: "Failed to fetch project launches" }, { status: 500 })
    }

    return NextResponse.json(data || [])
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
      .from("project_launches")
      .insert([
        {
          name: body.name,
          title: body.title,
          description: body.description,
          launch_date: body.launch_date,
          is_launched: body.is_launched || false,
          is_active: body.is_active || true,
          show_on_site: body.show_on_site || true,
          position: body.position,
          color_scheme: body.color_scheme || "blue",
          icon_type: body.icon_type || "rocket",
          pre_launch_title: body.pre_launch_title || "До запуска проекта",
          post_launch_title: body.post_launch_title || "Проект запущен!",
          pre_launch_description: body.pre_launch_description || "Следите за обратным отсчетом до официального запуска",
          post_launch_description: body.post_launch_description || "Наша платформа успешно работает",
          background_type: body.background_type || "gradient",
          custom_css: body.custom_css,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating project launch:", error)
      return NextResponse.json({ error: "Failed to create project launch" }, { status: 500 })
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

    if (!body.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("project_launches")
      .update({
        name: body.name,
        title: body.title,
        description: body.description,
        launch_date: body.launch_date,
        is_launched: body.is_launched,
        is_active: body.is_active,
        show_on_site: body.show_on_site,
        position: body.position,
        color_scheme: body.color_scheme,
        icon_type: body.icon_type,
        pre_launch_title: body.pre_launch_title,
        post_launch_title: body.post_launch_title,
        pre_launch_description: body.pre_launch_description,
        post_launch_description: body.post_launch_description,
        background_type: body.background_type,
        custom_css: body.custom_css,
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.id)
      .select()
      .single()

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
