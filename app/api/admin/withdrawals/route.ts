import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    console.log('Loading withdrawal requests from database...')

    // Получаем все транзакции выводов
    const result = await query(
      `SELECT 
        t.id,
        t.user_id,
        u.full_name as user_name,
        u.email as user_email,
        t.amount,
        t.status,
        t.created_at,
        t.method,
        t.description,
        COALESCE(t.fee, 0) as fee,
        t.final_amount
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      WHERE t.type = 'withdrawal'
      ORDER BY t.created_at DESC`,
      []
    )

    console.log(`✅ Loaded ${result.rows.length} withdrawal requests from database`)

    return NextResponse.json({
      success: true,
      withdrawals: result.rows
    })

  } catch (error) {
    console.error('Error loading withdrawal requests:', error)
    return NextResponse.json({ error: 'Ошибка загрузки запросов на вывод' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user_id, amount, method, description } = await request.json()

    if (!user_id || !amount) {
      return NextResponse.json({ error: 'Не указан пользователь или сумма' }, { status: 400 })
    }

    // Проверяем баланс пользователя
    const userResult = await query(
      'SELECT balance FROM users WHERE id = $1',
      [user_id]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })
    }

    const userBalance = parseFloat(userResult.rows[0].balance) || 0
    if (userBalance < amount) {
      return NextResponse.json({ error: 'Недостаточно средств на балансе' }, { status: 400 })
    }

    // Рассчитываем комиссию (например, 5%)
    const fee = amount * 0.05
    const finalAmount = amount - fee

    // Создаем новый запрос на вывод
    const result = await query(
      `INSERT INTO transactions (user_id, type, amount, status, method, description, fee, final_amount, created_at)
       VALUES ($1, 'withdrawal', $2, 'pending', $3, $4, $5, $6, CURRENT_TIMESTAMP)
       RETURNING *`,
      [user_id, amount, method || 'bank_transfer', description || 'Запрос на вывод средств', fee, finalAmount]
    )

    console.log('✅ Created new withdrawal request:', result.rows[0])

    return NextResponse.json({
      success: true,
      withdrawal: result.rows[0]
    })

  } catch (error) {
    console.error('Error creating withdrawal request:', error)
    return NextResponse.json({ error: 'Ошибка создания запроса на вывод' }, { status: 500 })
  }
}