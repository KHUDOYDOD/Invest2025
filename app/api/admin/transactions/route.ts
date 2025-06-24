import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""
    const type = searchParams.get("transactionType") || "all"
    const status = searchParams.get("status") || "all"
    const amountMin = searchParams.get("amountMin")
    const amountMax = searchParams.get("amountMax")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")
    const sortBy = searchParams.get("sortBy") || "created_at"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    
    const offset = (page - 1) * limit

    console.log(`Loading admin transactions with advanced filters: page=${page}, limit=${limit}`)

    // Строим WHERE условие
    let whereConditions = []
    let queryParams = []
    let paramIndex = 1

    // Поиск по пользователю, описанию или ID транзакции
    if (search) {
      whereConditions.push(`(u.email ILIKE $${paramIndex} OR u.full_name ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex} OR t.id::text ILIKE $${paramIndex})`)
      queryParams.push(`%${search}%`)
      paramIndex++
    }

    // Фильтр по типу транзакции
    if (type !== "all") {
      whereConditions.push(`t.type = $${paramIndex}`)
      queryParams.push(type)
      paramIndex++
    }

    // Фильтр по статусу
    if (status !== "all") {
      whereConditions.push(`t.status = $${paramIndex}`)
      queryParams.push(status)
      paramIndex++
    }

    // Фильтр по минимальной сумме
    if (amountMin && !isNaN(parseFloat(amountMin))) {
      whereConditions.push(`t.amount >= $${paramIndex}`)
      queryParams.push(parseFloat(amountMin))
      paramIndex++
    }

    // Фильтр по максимальной сумме
    if (amountMax && !isNaN(parseFloat(amountMax))) {
      whereConditions.push(`t.amount <= $${paramIndex}`)
      queryParams.push(parseFloat(amountMax))
      paramIndex++
    }

    // Фильтр по дате создания
    if (dateFrom) {
      whereConditions.push(`t.created_at >= $${paramIndex}`)
      queryParams.push(new Date(dateFrom))
      paramIndex++
    }

    if (dateTo) {
      whereConditions.push(`t.created_at <= $${paramIndex}`)
      queryParams.push(new Date(dateTo))
      paramIndex++
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // Валидируем и строим ORDER BY
    const validSortFields = ['created_at', 'amount', 'type', 'status', 'user_name']
    const validSortBy = validSortFields.includes(sortBy) ? 
      (sortBy === 'user_name' ? 'u.full_name' : `t.${sortBy}`) : 't.created_at'
    const validSortOrder = ['asc', 'desc'].includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'DESC'

    // Получаем транзакции с информацией о пользователях
    const transactionsResult = await query(`
      SELECT 
        t.id, t.user_id, t.type, t.amount, t.status, t.description, 
        t.method, t.fee, t.final_amount, t.created_at, t.updated_at,
        u.email as user_email, u.full_name as user_name
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      ${whereClause}
      ORDER BY ${validSortBy} ${validSortOrder}
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