import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
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

    console.log('Fetching balance for user:', decoded.userId)

    // Получаем баланс пользователя
    const result = await query(
      `SELECT balance, total_invested, total_earned FROM users WHERE id = $1`,
      [decoded.userId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })
    }

    const user = result.rows[0]

    return NextResponse.json({
      success: true,
      balance: parseFloat(user.balance) || 0,
      total_invested: parseFloat(user.total_invested) || 0,
      total_earned: parseFloat(user.total_earned) || 0
    })

  } catch (error) {
    console.error('Error fetching balance:', error)
    return NextResponse.json({ 
      error: 'Ошибка получения баланса',
      details: error.message 
    }, { status: 500 })
  }
}