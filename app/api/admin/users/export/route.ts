import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "all"
    const role = searchParams.get("role") || "all"
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")

    console.log("Exporting users with filters:", { search, status, role, dateFrom, dateTo })

    // Строим WHERE условие (тот же код что в основном API)
    let whereConditions = []
    let queryParams = []
    let paramIndex = 1

    if (search) {
      whereConditions.push(`(email ILIKE $${paramIndex} OR full_name ILIKE $${paramIndex} OR id::text ILIKE $${paramIndex})`)
      queryParams.push(`%${search}%`)
      paramIndex++
    }

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

    // Получаем всех пользователей для экспорта
    const usersResult = await query(`
      SELECT 
        id, email, full_name, balance, total_invested, total_earned, 
        is_active, role_id, created_at, last_login
      FROM users 
      ${whereClause}
      ORDER BY created_at DESC
    `, queryParams)

    // Преобразуем данные в CSV
    const headers = [
      'ID',
      'Email', 
      'Полное имя',
      'Баланс',
      'Всего инвестировано',
      'Всего заработано',
      'Статус',
      'Роль',
      'Дата регистрации',
      'Последний вход'
    ]

    const csvData = [headers.join(',')]

    usersResult.rows.forEach(user => {
      const row = [
        user.id,
        user.email,
        `"${user.full_name}"`,
        parseFloat(user.balance || 0).toFixed(2),
        parseFloat(user.total_invested || 0).toFixed(2),
        parseFloat(user.total_earned || 0).toFixed(2),
        user.is_active ? 'Активен' : 'Неактивен',
        user.role_id === 1 ? 'Администратор' : 'Пользователь',
        new Date(user.created_at).toLocaleDateString('ru-RU'),
        user.last_login ? new Date(user.last_login).toLocaleDateString('ru-RU') : 'Никогда'
      ]
      csvData.push(row.join(','))
    })

    const csvContent = csvData.join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="users_export_${new Date().toISOString().split('T')[0]}.csv"`
      }
    })

  } catch (error) {
    console.error("Users export error:", error)
    return NextResponse.json({ error: "Ошибка экспорта пользователей" }, { status: 500 })
  }
}