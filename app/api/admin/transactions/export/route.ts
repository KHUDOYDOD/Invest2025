import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const type = searchParams.get("transactionType") || "all"
    const status = searchParams.get("status") || "all"
    const amountMin = searchParams.get("amountMin")
    const amountMax = searchParams.get("amountMax")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")

    console.log("Exporting transactions with filters:", { search, type, status, amountMin, amountMax, dateFrom, dateTo })

    // Строим WHERE условие (тот же код что в основном API)
    let whereConditions = []
    let queryParams = []
    let paramIndex = 1

    if (search) {
      whereConditions.push(`(u.email ILIKE $${paramIndex} OR u.full_name ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex} OR t.id::text ILIKE $${paramIndex})`)
      queryParams.push(`%${search}%`)
      paramIndex++
    }

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

    if (amountMin && !isNaN(parseFloat(amountMin))) {
      whereConditions.push(`t.amount >= $${paramIndex}`)
      queryParams.push(parseFloat(amountMin))
      paramIndex++
    }

    if (amountMax && !isNaN(parseFloat(amountMax))) {
      whereConditions.push(`t.amount <= $${paramIndex}`)
      queryParams.push(parseFloat(amountMax))
      paramIndex++
    }

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

    // Получаем все транзакции для экспорта
    const transactionsResult = await query(`
      SELECT 
        t.id, t.user_id, t.type, t.amount, t.status, t.description, 
        t.method, t.fee, t.final_amount, t.created_at, t.updated_at,
        u.email as user_email, u.full_name as user_name
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      ${whereClause}
      ORDER BY t.created_at DESC
    `, queryParams)

    // Преобразуем данные в CSV
    const headers = [
      'ID транзакции',
      'Email пользователя',
      'Имя пользователя',
      'Тип',
      'Сумма',
      'Комиссия',
      'Итоговая сумма',
      'Статус',
      'Описание',
      'Метод',
      'Дата создания',
      'Дата обновления'
    ]

    const csvData = [headers.join(',')]

    const getTypeLabel = (type: string) => {
      switch (type) {
        case "deposit": return "Пополнение"
        case "withdrawal": return "Вывод"
        case "investment": return "Инвестиция"
        case "profit": return "Прибыль"
        case "referral": return "Реферал"
        default: return type
      }
    }

    const getStatusLabel = (status: string) => {
      switch (status.toLowerCase()) {
        case "completed": return "Завершено"
        case "pending": return "В ожидании"
        case "failed": return "Ошибка"
        default: return status
      }
    }

    transactionsResult.rows.forEach(transaction => {
      const row = [
        transaction.id,
        transaction.user_email,
        `"${transaction.user_name}"`,
        getTypeLabel(transaction.type),
        parseFloat(transaction.amount || 0).toFixed(2),
        parseFloat(transaction.fee || 0).toFixed(2),
        parseFloat(transaction.final_amount || 0).toFixed(2),
        getStatusLabel(transaction.status),
        `"${transaction.description || ''}"`,
        `"${transaction.method || ''}"`,
        new Date(transaction.created_at).toLocaleString('ru-RU'),
        transaction.updated_at ? new Date(transaction.updated_at).toLocaleString('ru-RU') : ''
      ]
      csvData.push(row.join(','))
    })

    const csvContent = csvData.join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="transactions_export_${new Date().toISOString().split('T')[0]}.csv"`
      }
    })

  } catch (error) {
    console.error("Transactions export error:", error)
    return NextResponse.json({ error: "Ошибка экспорта транзакций" }, { status: 500 })
  }
}