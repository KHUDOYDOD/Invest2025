import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    console.log("Loading investment plans from database...")

    // Получаем реальные планы инвестиций из базы данных
    const result = await query(
      `SELECT id, name, min_amount, max_amount, daily_percent, duration_days as duration, total_return, description, features, is_active, created_at
       FROM investment_plans 
       WHERE is_active = true 
       ORDER BY min_amount ASC`
    )

    console.log(`✅ Investment plans loaded from database: ${result.rows.length}`)

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Investment plans API error:", error)
    return NextResponse.json({ error: "Ошибка загрузки планов" }, { status: 500 })
  }
}
