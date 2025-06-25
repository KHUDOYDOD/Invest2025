
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

    const userId = decoded.userId

    // Получаем все данные одним большим запросом
    const dashboardQuery = `
      WITH user_data AS (
        SELECT 
          u.id, 
          u.email, 
          u.full_name, 
          COALESCE(u.balance, 0) as balance, 
          COALESCE(u.total_invested, 0) as total_invested, 
          COALESCE(u.total_earned, 0) as total_earned, 
          u.role_id,
          u.created_at
        FROM users u
        WHERE u.id = $1 AND u.is_active = true
      ),
      investments_data AS (
        SELECT 
          i.*,
          ip.name as plan_name,
          ip.daily_percent,
          ip.duration_days
        FROM investments i
        LEFT JOIN investment_plans ip ON i.plan_id = ip.id
        WHERE i.user_id = $1 AND i.status = 'active'
        ORDER BY i.created_at DESC
        LIMIT 10
      ),
      transactions_data AS (
        SELECT 
          t.*,
          ip.name as plan_name
        FROM transactions t
        LEFT JOIN investments i ON t.investment_id = i.id
        LEFT JOIN investment_plans ip ON i.plan_id = ip.id
        WHERE t.user_id = $1
        ORDER BY t.created_at DESC
        LIMIT 10
      )
      SELECT 
        json_build_object(
          'user', (SELECT row_to_json(user_data) FROM user_data),
          'investments', COALESCE((SELECT json_agg(investments_data) FROM investments_data), '[]'::json),
          'transactions', COALESCE((SELECT json_agg(transactions_data) FROM transactions_data), '[]'::json)
        ) as dashboard_data
    `

    const result = await query(dashboardQuery, [userId])

    if (result.rows.length === 0 || !result.rows[0].dashboard_data.user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })
    }

    const data = result.rows[0].dashboard_data
    const user = data.user

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        full_name: user.full_name,
        balance: parseFloat(user.balance),
        totalInvested: parseFloat(user.total_invested),
        total_invested: parseFloat(user.total_invested),
        totalProfit: parseFloat(user.total_earned),
        total_earned: parseFloat(user.total_earned),
        role: user.role_id === 1 ? 'admin' : 'user',
        isAdmin: user.role_id === 1,
        created_at: user.created_at
      },
      investments: data.investments || [],
      transactions: data.transactions || []
    })

    // Добавляем заголовки кэширования для браузера
    response.headers.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60')
    
    return response

  } catch (error) {
    console.error('Dashboard all API error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
