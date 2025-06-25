import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'
import { requireAdmin } from '@/lib/auth'

// PATCH - частичное обновление проекта
export const PATCH = requireAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { id } = params
    const body = await request.json()

    // Получаем текущий проект
    const currentResult = await query('SELECT * FROM project_launches WHERE id = $1', [id])
    
    if (currentResult.rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const current = currentResult.rows[0]

    // Обновляем только переданные поля
    const result = await query(
      `UPDATE project_launches 
       SET name = COALESCE($1, name),
           title = COALESCE($2, title),
           description = COALESCE($3, description),
           status = COALESCE($4, status),
           launch_date = COALESCE($5, launch_date),
           target_amount = COALESCE($6, target_amount),
           raised_amount = COALESCE($7, raised_amount),
           is_launched = COALESCE($8, is_launched),
           is_active = COALESCE($9, is_active),
           show_on_site = COALESCE($10, show_on_site),
           position = COALESCE($11, position),
           icon_type = COALESCE($12, icon_type),
           background_type = COALESCE($13, background_type),
           color_scheme = COALESCE($14, color_scheme),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $15
       RETURNING *`,
      [
        body.name || null,
        body.title || null,
        body.description || null,
        body.status || null,
        body.launch_date || null,
        body.target_amount || null,
        body.raised_amount || null,
        body.is_launched !== undefined ? body.is_launched : null,
        body.is_active !== undefined ? body.is_active : null,
        body.show_on_site !== undefined ? body.show_on_site : null,
        body.position || null,
        body.icon_type || null,
        body.background_type || null,
        body.color_scheme || null,
        id
      ]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating project launch:', error)
    return NextResponse.json({ error: 'Failed to update project launch' }, { status: 500 })
  }
})

// DELETE - удаление проекта
export const DELETE = requireAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { id } = params

    const result = await query('DELETE FROM project_launches WHERE id = $1 RETURNING id', [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Error deleting project launch:', error)
    return NextResponse.json({ error: 'Failed to delete project launch' }, { status: 500 })
  }
})