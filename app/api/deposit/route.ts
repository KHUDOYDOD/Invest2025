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

    const { amount, payment_method, wallet_address, card_number } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Укажите корректную сумму' }, { status: 400 })
    }

    if (!payment_method) {
      return NextResponse.json({ error: 'Выберите способ пополнения' }, { status: 400 })
    }

    console.log('Creating deposit transaction for user:', decoded.userId, 'amount:', amount)

    // Создаем транзакцию депозита
    const result = await query(
      `INSERT INTO transactions (user_id, type, amount, status, description, payment_method, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [
        decoded.userId,
        'deposit',
        amount,
        'pending', // Депозиты требуют подтверждения администратором
        `Пополнение баланса на $${amount}`,
        payment_method
      ]
    )

    console.log('✅ Deposit transaction created:', result.rows[0].id)

    return NextResponse.json({
      success: true,
      message: 'Заявка на пополнение создана и отправлена на модерацию',
      transaction: result.rows[0]
    })

  } catch (error) {
    console.error('Deposit API error:', error)
    return NextResponse.json({ 
      error: 'Ошибка создания заявки на пополнение',
      details: error.message 
    }, { status: 500 })
  }
}