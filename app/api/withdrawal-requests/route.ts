
import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    console.log("🔄 Loading withdrawal requests...")

    const result = await query(`
      SELECT 
        wr.id,
        wr.user_id,
        wr.amount,
        wr.method,
        wr.wallet_address,
        wr.fee,
        wr.final_amount,
        wr.status,
        wr.admin_comment,
        wr.created_at,
        wr.processed_at,
        u.full_name,
        u.email
      FROM withdrawal_requests wr
      LEFT JOIN users u ON wr.user_id = u.id
      ORDER BY wr.created_at DESC
    `)

    const requests = result.rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      amount: parseFloat(row.amount),
      method: row.method,
      wallet_address: row.wallet_address,
      fee: parseFloat(row.fee || 0),
      final_amount: parseFloat(row.final_amount),
      status: row.status,
      admin_comment: row.admin_comment,
      created_at: row.created_at,
      processed_at: row.processed_at,
      users: {
        id: row.user_id,
        full_name: row.full_name || "Пользователь",
        email: row.email || "email@example.com"
      }
    }))

    console.log("✅ Withdrawal requests loaded:", requests.length)

    return NextResponse.json(requests)
  } catch (error) {
    console.error("❌ Error loading withdrawal requests:", error)
    return NextResponse.json({ error: "Ошибка загрузки заявок" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    console.log("🔄 Creating new withdrawal request:", data)

    const result = await query(`
      INSERT INTO withdrawal_requests (user_id, amount, method, wallet_address, fee, final_amount, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING id
    `, [
      data.userId || "1",
      data.amount,
      data.method,
      data.walletAddress || data.cardNumber || data.phoneNumber,
      data.fee || 0,
      data.finalAmount || data.amount
    ])

    const newRequestId = result.rows[0].id

    console.log("✅ New withdrawal request created:", newRequestId)

    return NextResponse.json({
      success: true,
      id: newRequestId
    })
  } catch (error) {
    console.error("❌ Error creating withdrawal request:", error)
    return NextResponse.json({ error: "Ошибка создания заявки" }, { status: 500 })
  }
}
