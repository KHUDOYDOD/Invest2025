
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    // Получаем токен из заголовков
    const authHeader = request.headers.get('authorization')
    let token: string | null = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    }
    
    if (!token) {
      return NextResponse.json({ error: 'Токен не предоставлен' }, { status: 401 })
    }

    // Верифицируем токен
    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret')
    } catch (error) {
      return NextResponse.json({ error: 'Недействительный токен' }, { status: 401 })
    }

    const { amount, payment_method, payment_details } = await request.json()

    // Валидация данных
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Некорректная сумма' }, { status: 400 })
    }

    if (!payment_method) {
      return NextResponse.json({ error: 'Способ вывода не указан' }, { status: 400 })
    }

    // Проверяем баланс пользователя
    const userResult = await query(
      `SELECT balance FROM users WHERE id = $1`,
      [decoded.userId]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })
    }

    const userBalance = parseFloat(userResult.rows[0].balance)

    if (userBalance < amount) {
      return NextResponse.json({ 
        error: 'Недостаточно средств на балансе',
        balance: userBalance 
      }, { status: 400 })
    }

    console.log('Creating withdrawal for user:', decoded.userId, 'amount:', amount)

    // Создаем транзакцию вывода
    const result = await query(
      `INSERT INTO transactions (user_id, type, amount, status, description, payment_method, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, amount, status, created_at`,
      [decoded.userId, 'withdrawal', amount, 'pending', 'Вывод средств', payment_method]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Ошибка создания транзакции' }, { status: 500 })
    }

    const transaction = result.rows[0]

    // Списываем средства с баланса пользователя
    await query(
      `UPDATE users SET balance = balance - $1 WHERE id = $2`,
      [amount, decoded.userId]
    )

    return NextResponse.json({
      success: true,
      message: 'Заявка на вывод создана',
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        status: 'pending',
        created_at: transaction.created_at
      }
    })

  } catch (error) {
    console.error('Error creating withdrawal:', error)
    return NextResponse.json({ 
      error: 'Ошибка создания заявки на вывод',
      details: error.message 
    }, { status: 500 })
  }
}
