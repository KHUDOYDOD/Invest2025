
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

    const { amount, payment_method } = await request.json()

    // Валидация данных
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Некорректная сумма' }, { status: 400 })
    }

    if (!payment_method) {
      return NextResponse.json({ error: 'Способ оплаты не указан' }, { status: 400 })
    }

    console.log('Creating deposit for user:', decoded.userId, 'amount:', amount)

    // Создаем транзакцию пополнения
    const result = await query(
      `INSERT INTO transactions (user_id, type, amount, status, description, payment_method, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, amount, status, created_at`,
      [decoded.userId, 'deposit', amount, 'pending', 'Пополнение баланса', payment_method]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Ошибка создания транзакции' }, { status: 500 })
    }

    const transaction = result.rows[0]

    // Если способ оплаты - с баланса, сразу обновляем баланс пользователя
    if (payment_method === 'balance') {
      await query(
        `UPDATE users SET balance = balance + $1 WHERE id = $2`,
        [amount, decoded.userId]
      )

      // Обновляем статус транзакции на завершенную
      await query(
        `UPDATE transactions SET status = 'completed' WHERE id = $1`,
        [transaction.id]
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Заявка на пополнение создана',
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        status: payment_method === 'balance' ? 'completed' : 'pending',
        created_at: transaction.created_at
      }
    })

  } catch (error) {
    console.error('Error creating deposit:', error)
    return NextResponse.json({ 
      error: 'Ошибка создания заявки на пополнение',
      details: error.message 
    }, { status: 500 })
  }
}
