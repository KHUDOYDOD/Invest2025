import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    const result = await query(`
      SELECT 
        id,
        name,
        COALESCE(title, name) as title,
        description,
        status,
        launch_date,
        target_amount,
        raised_amount,
        COALESCE(is_launched, (status = 'active')) as is_launched,
        COALESCE(is_active, true) as is_active,
        COALESCE(show_on_site, false) as show_on_site,
        COALESCE(position, 0) as position,
        COALESCE(icon_type, 'rocket') as icon_type,
        COALESCE(background_type, 'gradient') as background_type,
        COALESCE(color_scheme, 'blue') as color_scheme,
        created_at,
        COALESCE(updated_at, created_at) as updated_at
      FROM project_launches 
      ORDER BY position ASC, created_at DESC
    `)

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching project launches:", error)
    return NextResponse.json({ error: 'Failed to fetch project launches' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const result = await query(
      `INSERT INTO project_launches (
        name, title, description, status, launch_date, target_amount, raised_amount,
        is_launched, is_active, show_on_site, position, icon_type, background_type, color_scheme
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [
        body.name || 'Новый проект',
        body.title || body.name || 'Новый проект', 
        body.description || 'Описание проекта', 
        body.status || 'active', 
        body.launch_date || new Date().toISOString(), 
        body.target_amount || 0, 
        body.raised_amount || 0,
        body.is_launched || false,
        body.is_active !== false,
        body.show_on_site || false,
        body.position || 0,
        body.icon_type || 'rocket',
        body.background_type || 'gradient',
        body.color_scheme || 'blue'
      ]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error creating project launch:", error)
    return NextResponse.json({ error: "Failed to create project launch" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const result = await query(
      `UPDATE project_launches 
       SET name = $1, title = $2, description = $3, status = $4, launch_date = $5,
           target_amount = $6, raised_amount = $7, is_launched = $8, is_active = $9,
           show_on_site = $10, position = $11, icon_type = $12, background_type = $13,
           color_scheme = $14, updated_at = CURRENT_TIMESTAMP
       WHERE id = $15
       RETURNING *`,
      [
        body.name,
        body.title || body.name,
        body.description,
        body.status || 'active',
        body.launch_date,
        body.target_amount || 0,
        body.raised_amount || 0,
        body.is_launched || false,
        body.is_active !== false,
        body.show_on_site || false,
        body.position || 0,
        body.icon_type || 'rocket',
        body.background_type || 'gradient',
        body.color_scheme || 'blue',
        body.id
      ]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error updating project launch:", error)
    return NextResponse.json({ error: "Failed to update project launch" }, { status: 500 })
  }
}
