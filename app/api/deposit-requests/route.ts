import { NextResponse } from "next/server"

// Локальное хранилище заявок на пополнение
const depositRequests: any[] = [
  {
    id: "dep-1",
    user_id: "user-1",
    amount: 1000,
    method: "Банковская карта",
    payment_details: { cardNumber: "**** 1234" },
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
    console.log("✅ Deposit requests loaded:", depositRequests.length)

    return NextResponse.json(depositRequests)
  } catch (error) {
    console.error("❌ Error loading deposit requests:", error)
    return NextResponse.json({ error: "Ошибка загрузки заявок" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const newRequest = {
      id: `dep-${Date.now()}`,
      user_id: data.userId || "user-1",
      amount: data.amount,
      method: data.method,
      payment_details: data.paymentDetails || {},
      status: "pending",
      created_at: new Date().toISOString(),
      users: {
        id: data.userId || "user-1",
        full_name: data.userName || "Пользователь",
        email: data.userEmail || "user@example.com",
      },
    }

    depositRequests.push(newRequest)

    console.log("✅ New deposit request created:", newRequest.id)

    return NextResponse.json({
      success: true,
      request: newRequest,
    })
  } catch (error) {
    console.error("❌ Error creating deposit request:", error)
    return NextResponse.json({ error: "Ошибка создания заявки" }, { status: 500 })
  }
}
