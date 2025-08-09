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

    // Фильтр по статусу (упрощенный - все пользователи активны)
    if (status !== "all") {
      // В нашей упрощенной схеме все пользователи активны
      // но оставляем логику для совместимости
    }

    // Фильтр по роли
    if (role !== "all") {
      if (role === "admin") {
        whereConditions.push(`role = $${paramIndex}`)
        queryParams.push('admin')
      } else if (role === "user") {
        whereConditions.push(`role = $${paramIndex}`)
        queryParams.push('user')
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
    const validSortFields = ['created_at', 'email', 'full_name', 'balance']
    const validSortBy = validSortFields.includes(sortBy) ? sortBy : 'created_at'
    const validSortOrder = ['asc', 'desc'].includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'DESC'

    // Получаем пользователей с упрощенной структурой
    const usersResult = await query(`
      SELECT 
        id, email, full_name, balance, role, created_at, updated_at
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
      role: user.role,
      balance: parseFloat(user.balance || 0),
      total_invested: 0,
      total_earned: 0,
      is_active: true,
      last_login: user.updated_at
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