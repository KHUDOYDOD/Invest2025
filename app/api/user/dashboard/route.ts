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

    // Получаем инвестиции пользователя (пока создаем демо данные, позже подключим реальную таблицу)
    const demoInvestments = [
      {
        id: "1",
        user_id: userId,
        amount: 5000,
        daily_profit: 50,
        total_profit: 350,
        start_date: "2024-01-15T00:00:00Z",
        end_date: "2024-02-15T00:00:00Z",
        status: "active",
        plan_name: "Базовый план",
        days_left: 12,
        progress: 75,
      },
    ]

    // Создаем демо транзакции (пока таблица transactions не готова)
    const demoTransactions = [
      {
        id: "tx-1",
        type: "deposit",
        amount: 5000,
        status: "completed",
        description: "Пополнение баланса",
        method: "Банковская карта",
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "tx-2",
        type: "profit",
        amount: 75,
        status: "completed",
        description: "Ежедневная прибыль",
        method: "Автоначисление",
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

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
      investments: demoInvestments,
      transactions: demoTransactions,
    })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ success: false, error: "Ошибка сервера" }, { status: 500 })
  }
}