import { NextResponse } from "next/server"

// Локальное хранилище заявок на вывод
const withdrawalRequests: any[] = [
  {
    id: "with-1",
    user_id: "user-1",
    amount: 500,
    method: "Банковская карта",
    wallet_address: "**** 5678",
    fee: 15,
    final_amount: 485,
    status: "pending",
    created_at: new Date().toISOString(),
    users: {
      id: "user-1",
      full_name: "Демо Пользователь",
      email: "demo@example.com",
    },
  },
]

export async function GET() {
  try {
    console.log("✅ Withdrawal requests loaded:", withdrawalRequests.length)

    return NextResponse.json(withdrawalRequests)
  } catch (error) {
    console.error("❌ Error loading withdrawal requests:", error)
    return NextResponse.json({ error: "Ошибка загрузки заявок" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const newRequest = {
      id: `with-${Date.now()}`,
      user_id: data.userId || "user-1",
      amount: data.amount,
      method: data.method,
      wallet_address: data.walletAddress || data.cardNumber || data.phoneNumber,
      fee: data.fee || 0,
      final_amount: data.finalAmount || data.amount,
      status: "pending",
      created_at: new Date().toISOString(),
      users: {
        id: data.userId || "user-1",
        full_name: data.userName || "Пользователь",
        email: data.userEmail || "user@example.com",
      },
    }

    withdrawalRequests.push(newRequest)

    console.log("✅ New withdrawal request created:", newRequest.id)

    return NextResponse.json({
      success: true,
      request: newRequest,
    })
  } catch (error) {
    console.error("❌ Error creating withdrawal request:", error)
    return NextResponse.json({ error: "Ошибка создания заявки" }, { status: 500 })
  }
}
