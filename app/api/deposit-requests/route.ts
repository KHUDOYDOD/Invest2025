
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET() {
  try {
    console.log("🔄 Fetching deposit requests from database...")

    // Получаем все запросы на пополнение из транзакций
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
      WHERE t.type = 'deposit'
      ORDER BY t.created_at DESC`,
      []
    )

    console.log(`✅ Found ${result.rows.length} deposit requests`)

    // Преобразуем данные в нужный формат
    const depositRequests = result.rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      amount: parseFloat(row.amount),
      method: row.method || 'Банковская карта',
      payment_details: { description: row.description },
      status: row.status,
      created_at: row.created_at,
      users: {
        id: row.user_id,
        full_name: row.full_name,
        email: row.email
      }
    }))

    return NextResponse.json(depositRequests)
  } catch (error) {
    console.error("❌ Error loading deposit requests:", error)
    return NextResponse.json({ error: "Ошибка загрузки заявок на пополнение" }, { status: 500 })
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
