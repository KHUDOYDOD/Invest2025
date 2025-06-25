import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    console.log('Loading deposit requests from database...')

    // Получаем все транзакции депозитов
    const result = await query(
      `SELECT 
        t.id,
        t.user_id,
        u.full_name as user_name,
        u.email as user_email,
        t.amount,
        t.status,
        t.created_at,
        t.payment_method as method,
        t.description,
        0 as fee,
        t.amount as final_amount
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      WHERE t.type = 'deposit'
      ORDER BY t.created_at DESC`,
      []
    )

    console.log(`✅ Loaded ${result.rows.length} deposit requests from database`)

    return NextResponse.json({
      success: true,
      deposits: result.rows
    })

  } catch (error) {
    console.error('Error loading deposit requests:', error)
    return NextResponse.json({ error: 'Ошибка загрузки запросов на пополнение' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user_id, amount, method, description } = await request.json()

    if (!user_id || !amount) {
      return NextResponse.json({ error: 'Не указан пользователь или сумма' }, { status: 400 })
    }

    // Создаем новый запрос на пополнение
    const result = await query(
      `INSERT INTO transactions (user_id, type, amount, status, payment_method, description, created_at)
       VALUES ($1, 'deposit', $2, 'pending', $3, $4, CURRENT_TIMESTAMP)
       RETURNING *`,
      [user_id, amount, method || 'bank_transfer', description || 'Запрос на пополнение баланса']
    )

    console.log('✅ Created new deposit request:', result.rows[0])

    return NextResponse.json({
      success: true,
      deposit: result.rows[0]
    })

  } catch (error) {
    console.error('Error creating deposit request:', error)
    return NextResponse.json({ error: 'Ошибка создания запроса на пополнение' }, { status: 500 })
  }
}