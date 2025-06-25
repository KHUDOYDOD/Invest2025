
import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    console.log("🔄 Loading deposit requests...")

    const result = await query(`
      SELECT 
        dr.id,
        dr.user_id,
        dr.amount,
        dr.method,
        dr.payment_details,
        dr.status,
        dr.admin_comment,
        dr.created_at,
        dr.processed_at,
        u.full_name,
        u.email
      FROM deposit_requests dr
      LEFT JOIN users u ON dr.user_id = u.id
      ORDER BY dr.created_at DESC
    `)

    const requests = result.rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      amount: parseFloat(row.amount),
      method: row.method,
      payment_details: row.payment_details || {},
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

    console.log("✅ Deposit requests loaded:", requests.length)

    return NextResponse.json(requests)
  } catch (error) {
    console.error("❌ Error loading deposit requests:", error)
    return NextResponse.json({ error: "Ошибка загрузки заявок" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    console.log("🔄 Creating new deposit request:", data)

    const result = await query(`
      INSERT INTO deposit_requests (user_id, amount, method, payment_details, status)
      VALUES ($1, $2, $3, $4, 'pending')
      RETURNING id
    `, [
      data.userId || "1",
      data.amount,
      data.method,
      JSON.stringify(data.paymentDetails || {})
    ])

    const newRequestId = result.rows[0].id

    console.log("✅ New deposit request created:", newRequestId)

    return NextResponse.json({
      success: true,
      id: newRequestId
    })
  } catch (error) {
    console.error("❌ Error creating deposit request:", error)
    return NextResponse.json({ error: "Ошибка создания заявки" }, { status: 500 })
  }
}
