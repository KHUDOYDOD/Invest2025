import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const type = searchParams.get("type") || "all"
    const status = searchParams.get("status") || "all"
    
    const offset = (page - 1) * limit

    console.log(`Loading admin transactions: page=${page}, limit=${limit}, type="${type}", status="${status}"`)

    // Строим WHERE условие
    let whereConditions = []
    let queryParams = []
    let paramIndex = 1

    if (type !== "all") {
      whereConditions.push(`t.type = $${paramIndex}`)
      queryParams.push(type)
      paramIndex++
    }

    if (status !== "all") {
      whereConditions.push(`t.status = $${paramIndex}`)
      queryParams.push(status)
      paramIndex++
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // Получаем транзакции с информацией о пользователях
    const transactionsResult = await query(`
      SELECT 
        t.id, t.user_id, t.type, t.amount, t.status, t.description, 
        t.method, t.fee, t.final_amount, t.created_at, t.updated_at,
        u.email as user_email, u.full_name as user_name
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      ${whereClause}
      ORDER BY t.created_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...queryParams, limit, offset])

    // Получаем общее количество транзакций
    const countResult = await query(`
      SELECT COUNT(*) as total 
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      ${whereClause}
    `, queryParams)

    const transactions = transactionsResult.rows.map(tx => ({
      ...tx,
      amount: parseFloat(tx.amount || 0),
      fee: parseFloat(tx.fee || 0),
      final_amount: parseFloat(tx.final_amount || 0)
    }))

    const totalTransactions = parseInt(countResult.rows[0].total)
    const totalPages = Math.ceil(totalTransactions / limit)

    console.log(`✅ Admin transactions loaded from database: ${transactions.length} transactions`)

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total: totalTransactions,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error("Admin transactions API error:", error)
    return NextResponse.json({ error: "Ошибка загрузки транзакций" }, { status: 500 })
  }
}