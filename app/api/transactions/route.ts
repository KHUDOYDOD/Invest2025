import { type NextRequest, NextResponse } from "next/server"

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
    fee: 0,
    final_amount: 5000,
  },
  {
    id: "tx-2",
    user_id: "user-1",
    type: "profit",
    amount: 75,
    status: "completed",
    method: "Автоначисление",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Ежедневная прибыль от инвестиции",
    fee: 0,
    final_amount: 75,
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
    fee: 0,
    final_amount: 10000,
  },
  {
    id: "tx-4",
    user_id: "user-1",
    type: "withdrawal",
    amount: 1000,
    status: "pending",
    method: "Банковская карта",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    description: "Вывод прибыли",
    fee: 30,
    final_amount: 970,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    let transactions = demoTransactions

    // Фильтруем по пользователю если указан
    if (userId) {
      transactions = transactions.filter((tx) => tx.user_id === userId)
    }

    console.log("✅ Transactions loaded (demo data):", transactions.length)

    return NextResponse.json({
      success: true,
      transactions,
    })
  } catch (error) {
    console.error("❌ Error loading transactions:", error)
    return NextResponse.json({ error: "Ошибка загрузки транзакций" }, { status: 500 })
  }
}
