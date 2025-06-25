
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

    console.log('Fetching transactions for user:', decoded.userId)

    // Получаем транзакции пользователя
    const result = await query(
      `SELECT 
        id,
        type,
        amount,
        status,
        created_at,
        description,
        payment_method as method
      FROM transactions
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 50`,
      [decoded.userId]
    )

    console.log(`Found ${result.rows.length} transactions for user ${decoded.userId}`)

    return NextResponse.json({
      success: true,
      transactions: result.rows
    })

  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ 
      error: 'Ошибка получения транзакций',
      details: error.message 
    }, { status: 500 })
  }
}
