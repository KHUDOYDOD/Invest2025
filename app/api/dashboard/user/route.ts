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

    // Получаем данные пользователя из БД
    const userResult = await query(
      `SELECT 
        id, 
        email, 
        full_name, 
        COALESCE(balance, 0) as balance, 
        COALESCE(total_invested, 0) as total_invested, 
        COALESCE(total_earned, 0) as total_earned, 
        role_id,
        created_at
      FROM users 
      WHERE id = $1 AND is_active = true`,
      [decoded.userId]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })
    }

    const user = userResult.rows[0]
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        balance: parseFloat(user.balance),
        total_invested: parseFloat(user.total_invested),
        total_earned: parseFloat(user.total_earned),
        role: user.role_id === 1 ? 'admin' : 'user',
        isAdmin: user.role_id === 1,
        created_at: user.created_at
      }
    })

  } catch (error) {
    console.error('Dashboard user API error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}