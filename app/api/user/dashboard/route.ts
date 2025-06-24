import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID обязателен" }, { status: 400 })
    }

    console.log("Loading dashboard data for user:", userId)

    // Получаем данные пользователя из базы данных
    const userResult = await query(
      `SELECT id, email, full_name, balance, total_invested, total_earned, role_id, created_at
       FROM users WHERE id = $1`,
      [userId]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json({ success: false, error: "Пользователь не найден" }, { status: 404 })
    }

    const user = userResult.rows[0]
    
    // Определяем роль
    const isAdmin = user.role_id === 1

    // Получаем реальные инвестиции пользователя
    const investmentsResult = await query(
      `SELECT id, plan_name, amount, daily_profit, total_profit, start_date, end_date, status, progress, days_left, days_total
       FROM investments 
       WHERE user_id = $1
       ORDER BY start_date DESC`,
      [userId]
    )

    // Получаем реальные транзакции пользователя
    const transactionsResult = await query(
      `SELECT id, type, amount, status, description, method, fee, final_amount, created_at
       FROM transactions 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 5`,
      [userId]
    )

    const userData = {
      id: user.id,
      name: user.full_name,
      email: user.email,
      balance: parseFloat(user.balance),
      totalInvested: parseFloat(user.total_invested),
      totalEarned: parseFloat(user.total_earned),
      isAdmin: isAdmin,
      joinDate: user.created_at,
    }

    console.log("Dashboard data loaded successfully for user:", user.email)

    return NextResponse.json({
      success: true,
      user: userData,
      investments: investmentsResult.rows,
      transactions: transactionsResult.rows,
    })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ success: false, error: "Ошибка сервера" }, { status: 500 })
  }
}