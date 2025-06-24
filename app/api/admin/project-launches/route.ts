import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    const result = await query(
      'SELECT * FROM project_launches ORDER BY created_at DESC'
    )

    return NextResponse.json({ launches: result.rows })
  } catch (error) {
    console.error("Error fetching project launches:", error)
    return NextResponse.json({ launches: [] })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const result = await query(
      `INSERT INTO project_launches (name, description, target_amount, raised_amount, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        body.name || 'New Project',
        body.description || 'Project description',
        body.target_amount || 0,
        body.raised_amount || 0,
        body.status || 'active'
      ]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error creating project launch:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
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
       SET name = $1, description = $2, target_amount = $3, raised_amount = $4, status = $5
       WHERE id = $6
       RETURNING *`,
      [
        body.name,
        body.description,
        body.target_amount,
        body.raised_amount,
        body.status,
        body.id
      ]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error updating project launch:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
