import { type NextRequest, NextResponse } from "next/server"

// Демо данные пользователей
const demoUsers = {
  "user-1": {
    id: "user-1",
    name: "Демо Пользователь",
    email: "demo@example.com",
    balance: 25000,
    totalInvested: 15000,
    totalProfit: 2500,
    referralCount: 3,
    isAdmin: false,
  },
  "admin-1": {
    id: "admin-1",
    name: "Администратор",
    email: "admin@example.com",
    balance: 100000,
    totalInvested: 50000,
    totalProfit: 12000,
    referralCount: 15,
    isAdmin: true,
  },
}

// Демо инвестиции
const demoInvestments = [
  {
    id: "inv-1",
    user_id: "user-1",
    amount: 5000,
    daily_profit: 75,
    total_profit: 750,
    start_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    investment_plans: {
      name: "Стандарт",
      daily_percent: 1.5,
    },
  },
  {
    id: "inv-2",
    user_id: "user-1",
    amount: 10000,
    daily_profit: 200,
    total_profit: 1600,
    start_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    investment_plans: {
      name: "Премиум",
      daily_percent: 2,
    },
  },
]

// Демо транзакции
const demoTransactions = [
  {
    id: "tx-1",
    user_id: "user-1",
    type: "deposit",
    amount: 5000,
    status: "completed",
    method: "Банковская карта",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Пополнение баланса",
  },
  {
    id: "tx-2",
    user_id: "user-1",
    type: "profit",
    amount: 75,
    status: "completed",
    method: "Автоначисление",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Ежедневная прибыль",
  },
  {
    id: "tx-3",
    user_id: "user-1",
    type: "investment",
    amount: 10000,
    status: "completed",
    method: "Внутренний перевод",
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Инвестиция в план Премиум",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "ID пользователя не указан" }, { status: 400 })
    }

    // Получаем данные пользователя
    const user = demoUsers[userId as keyof typeof demoUsers]
    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    // Получаем инвестиции пользователя
    const userInvestments = demoInvestments.filter((inv) => inv.user_id === userId)

    // Получаем транзакции пользователя
    const userTransactions = demoTransactions.filter((tx) => tx.user_id === userId)

    console.log("✅ Dashboard data loaded for user:", userId)

    return NextResponse.json({
      success: true,
      user,
      investments: userInvestments,
      transactions: userTransactions,
    })
  } catch (error) {
    console.error("❌ Dashboard error:", error)
    return NextResponse.json({ error: "Ошибка загрузки данных" }, { status: 500 })
  }
}
