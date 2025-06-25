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
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET() {
  try {
    console.log("🔄 Fetching withdrawal requests from database...")

    // Получаем все запросы на вывод из транзакций
    const result = await query(
      `SELECT 
        t.id,
        t.user_id,
        u.full_name,
        u.email,
        t.amount,
        t.status,
        t.payment_method as method,
        t.description,
        t.created_at,
        t.updated_at
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      WHERE t.type = 'withdrawal'
      ORDER BY t.created_at DESC`,
      []
    )

    console.log(`✅ Found ${result.rows.length} withdrawal requests`)

    // Преобразуем данные в нужный формат
    const withdrawalRequests = result.rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      amount: parseFloat(row.amount),
      method: row.method || 'Банковская карта',
      wallet_address: 'N/A',
      fee: 0,
      final_amount: parseFloat(row.amount),
      status: row.status,
      created_at: row.created_at,
      users: {
        id: row.user_id,
        full_name: row.full_name,
        email: row.email
      }
    }))

    return NextResponse.json(withdrawalRequests)
  } catch (error) {
    console.error("❌ Error loading withdrawal requests:", error)
    return NextResponse.json({ error: "Ошибка загрузки заявок на вывод" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const newRequest = {
      id: `wit-${Date.now()}`,
      user_id: data.userId || "user-1",
      amount: data.amount,
      method: data.method,
      wallet_address: data.walletAddress || '',
      fee: data.fee || 0,
      final_amount: data.amount - (data.fee || 0),
      status: "pending",
      created_at: new Date().toISOString(),
      users: {
        id: data.userId || "user-1",
        full_name: data.userName || "Пользователь",
        email: data.userEmail || "user@example.com",
      },
    }

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
