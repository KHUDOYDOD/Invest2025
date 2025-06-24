import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "all"
    const role = searchParams.get("role") || "all"
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")
    const sortBy = searchParams.get("sortBy") || "created_at"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    
    const offset = (page - 1) * limit

    console.log(`Loading users with advanced filters: page=${page}, limit=${limit}, search="${search}", status="${status}", role="${role}"`)

    // Строим WHERE условие
    let whereConditions = []
    let queryParams = []
    let paramIndex = 1

    // Поиск по email, имени или ID
    if (search) {
      whereConditions.push(`(email ILIKE $${paramIndex} OR full_name ILIKE $${paramIndex} OR id::text ILIKE $${paramIndex})`)
      queryParams.push(`%${search}%`)
      paramIndex++
    }

    // Фильтр по статусу
    if (status !== "all") {
      if (status === "active") {
        whereConditions.push(`is_active = $${paramIndex}`)
        queryParams.push(true)
      } else if (status === "inactive") {
        whereConditions.push(`is_active = $${paramIndex}`)
        queryParams.push(false)
      }
      paramIndex++
    }

    // Фильтр по роли
    if (role !== "all") {
      if (role === "admin") {
        whereConditions.push(`role_id = $${paramIndex}`)
        queryParams.push(1)
      } else if (role === "user") {
        whereConditions.push(`role_id = $${paramIndex}`)
        queryParams.push(2)
      }
      paramIndex++
    }

    // Фильтр по дате создания
    if (dateFrom) {
      whereConditions.push(`created_at >= $${paramIndex}`)
      queryParams.push(new Date(dateFrom))
      paramIndex++
    }

    if (dateTo) {
      whereConditions.push(`created_at <= $${paramIndex}`)
      queryParams.push(new Date(dateTo))
      paramIndex++
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // Валидируем и строим ORDER BY
    const validSortFields = ['created_at', 'email', 'full_name', 'balance', 'total_invested', 'total_earned', 'last_login']
    const validSortBy = validSortFields.includes(sortBy) ? sortBy : 'created_at'
    const validSortOrder = ['asc', 'desc'].includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'DESC'

    // Получаем пользователей
    const usersResult = await query(`
      SELECT 
        id, email, full_name, balance, total_invested, total_earned, 
        is_active, role_id, created_at, last_login
      FROM users 
      ${whereClause}
      ORDER BY ${validSortBy} ${validSortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...queryParams, limit, offset])

    // Получаем общее количество пользователей
    const countResult = await query(`
      SELECT COUNT(*) as total 
      FROM users 
      ${whereClause}
    `, queryParams)

    const users = usersResult.rows.map(user => ({
      ...user,
      role: user.role_id === 1 ? 'admin' : 'user',
      balance: parseFloat(user.balance || 0),
      total_invested: parseFloat(user.total_invested || 0),
      total_earned: parseFloat(user.total_earned || 0)
    }))

    const totalUsers = parseInt(countResult.rows[0].total)
    const totalPages = Math.ceil(totalUsers / limit)

    console.log(`✅ Users loaded from database: ${users.length} users`)

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total: totalUsers,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error("Admin users API error:", error)
    return NextResponse.json({ error: "Ошибка загрузки пользователей" }, { status: 500 })
  }
}