
import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    console.log("Loading new users from database...")

    // Получаем последних 8 зарегистрированных пользователей для ленты активности
    const result = await query(`
      SELECT 
        u.id,
        u.full_name as name,
        u.email,
        u.created_at as joined_date,
        u.country
      FROM users u
      WHERE u.role_id = 2
      ORDER BY u.created_at DESC
      LIMIT 8
    `)

    const newUsers = result.rows.map(user => ({
      id: user.id,
      name: user.name || 'Anonymous User',
      email: user.email,
      joinedDate: user.joined_date
    }))

    console.log(`✅ Loaded ${newUsers.length} new users from database`)

    return NextResponse.json({
      success: true,
      data: newUsers
    })
  } catch (error) {
    console.error("Error loading new users:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to load new users"
    }, { status: 500 })
  }
}
