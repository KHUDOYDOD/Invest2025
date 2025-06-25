import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'
import { requireAdmin } from '@/lib/auth'

// GET - получить все транзакции
export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const search = url.searchParams.get('search') || ''
    const status = url.searchParams.get('status') || ''
    const type = url.searchParams.get('type') || ''
    const sortBy = url.searchParams.get('sortBy') || 'created_at'
    const sortOrder = url.searchParams.get('sortOrder') || 'DESC'

    const offset = (page - 1) * limit

    let whereConditions = []
    let params = []
    let paramIndex = 1

    // Фильтр по поиску (пользователь)
    if (search) {
      whereConditions.push(`u.full_name ILIKE $${paramIndex}`)
      params.push(`%${search}%`)
      paramIndex++
    }

    // Фильтр по статусу
    if (status) {
      whereConditions.push(`t.status = $${paramIndex}`)
      params.push(status)
      paramIndex++
    }

    // Фильтр по типу
    if (type) {
      whereConditions.push(`t.type = $${paramIndex}`)
      params.push(type)
      paramIndex++
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // Основной запрос
    const transactionsQuery = `
      SELECT 
        t.id,
        t.user_id,
        u.full_name as user_name,
        u.email as user_email,
        t.type,
        t.amount,
        t.status,
        t.description,
        t.created_at,
        t.updated_at
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      ${whereClause}
      ORDER BY t.${sortBy} ${sortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    params.push(limit, offset)

    // Запрос для подсчета общего количества
    const countQuery = `
      SELECT COUNT(*) as total
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      ${whereClause}
    `
    const countParams = params.slice(0, -2) // убираем limit и offset

    const [transactionsResult, countResult] = await Promise.all([
      query(transactionsQuery, params),
      query(countQuery, countParams)
    ])

    const total = parseInt(countResult.rows[0].total)
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      transactions: transactionsResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
})

// POST - создать новую транзакцию
export const POST = requireAdmin(async (request: NextRequest) => {
  try {
    const data = await request.json()
    const { user_id, type, amount, status = 'pending', description = '' } = data

    const result = await query(
      `INSERT INTO transactions (user_id, type, amount, status, description) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, type, amount, status, description]
    )

    // Обновляем баланс пользователя для депозитов и выводов
    if (status === 'completed') {
      if (type === 'deposit') {
        await query(
          'UPDATE users SET balance = balance + $1 WHERE id = $2',
          [amount, user_id]
        )
      } else if (type === 'withdrawal') {
        await query(
          'UPDATE users SET balance = balance - $1 WHERE id = $2',
          [amount, user_id]
        )
      }
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
  }
})