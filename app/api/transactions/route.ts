import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "10")
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID обязателен" }, { status: 400 })
    }

    console.log(`Loading transactions for user: ${userId}`)

    // Получаем реальные транзакции из базы данных
    const result = await query(
      `SELECT id, type, amount, status, description, method, fee, final_amount, created_at, updated_at
       FROM transactions 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [userId, limit]
    )

    console.log(`✅ Transactions loaded from database: ${result.rows.length}`)

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Transactions API error:", error)
    return NextResponse.json({ error: "Ошибка загрузки транзакций" }, { status: 500 })
  }
}
