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

    // Получаем все данные пользователя одним запросом
    const userDataQuery = `
      SELECT 
        u.id, 
        u.email, 
        u.full_name, 
        COALESCE(u.balance, 0) as balance, 
        COALESCE(u.total_invested, 0) as total_invested, 
        COALESCE(u.total_earned, 0) as total_earned, 
        u.role_id,
        u.created_at,
        COALESCE(inv_stats.active_investments, 0) as active_investments,
        COALESCE(inv_stats.total_profit, 0) as total_profit,
        COALESCE(ref_stats.referral_count, 0) as referral_count
      FROM users u
      LEFT JOIN (
        SELECT 
          user_id,
          COUNT(*) as active_investments,
          COALESCE(SUM(total_profit), 0) as total_profit
        FROM investments 
        WHERE status = 'active'
        GROUP BY user_id
      ) inv_stats ON u.id = inv_stats.user_id
      LEFT JOIN (
        SELECT 
          referrer_id,
          COUNT(*) as referral_count
        FROM users 
        WHERE referrer_id IS NOT NULL
        GROUP BY referrer_id
      ) ref_stats ON u.id = ref_stats.referrer_id
      WHERE u.id = $1 AND u.is_active = true
    `

    const userResult = await query(userDataQuery, [decoded.userId])

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })
    }

    const user = userResult.rows[0]
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        full_name: user.full_name,
        balance: parseFloat(user.balance),
        totalInvested: parseFloat(user.total_invested),
        total_invested: parseFloat(user.total_invested),
        totalProfit: parseFloat(user.total_profit),
        total_earned: parseFloat(user.total_earned),
        activeInvestments: parseInt(user.active_investments),
        referralCount: parseInt(user.referral_count),
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