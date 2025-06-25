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

    // Получаем инвестиции пользователя
    const result = await query(
      `SELECT 
        i.id,
        i.amount,
        i.status,
        i.start_date,
        i.end_date,
        i.total_profit as profit_earned,
        ip.name as plan_name,
        ip.min_amount,
        ip.max_amount,
        ip.daily_profit_rate,
        ip.duration_days,
        i.created_at
      FROM investments i
      JOIN investment_plans ip ON i.plan_id = ip.id
      WHERE i.user_id = $1
      ORDER BY i.created_at DESC`,
      [decoded.userId]
    )

    return NextResponse.json({
      success: true,
      investments: result.rows
    })

  } catch (error) {
    console.error('Dashboard investments API error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}