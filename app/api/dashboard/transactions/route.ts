import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { getServerSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getServerSession(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "20")

    console.log(`Loading transactions for user ${user.id}`)

    // Получаем транзакции пользователя
    const transactionsResult = await query(`
      SELECT 
        id, type, amount, status, description, method, 
        fee, final_amount, created_at, updated_at
      FROM transactions
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `, [user.id, limit])

    const transactions = transactionsResult.rows.map(tx => ({
      ...tx,
      amount: parseFloat(tx.amount || 0),
      fee: parseFloat(tx.fee || 0),
      final_amount: parseFloat(tx.final_amount || 0)
    }))

    console.log(`✅ Loaded ${transactions.length} transactions for user ${user.id}`)

    return NextResponse.json({
      success: true,
      transactions
    })
  } catch (error) {
    console.error("Error loading user transactions:", error)
    return NextResponse.json({ error: "Ошибка загрузки транзакций" }, { status: 500 })
  }
}