import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Проверяем авторизацию
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Токен авторизации не найден' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Токен не действителен' }, { status: 401 })
    }

    // Получаем ID пользователя из токена (базовая проверка)
    let userId: string
    try {
      const jwt = require('jsonwebtoken')
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any
      userId = decoded.userId

      if (!userId) {
        return NextResponse.json({ error: 'Недействительный токен' }, { status: 401 })
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      return NextResponse.json({ error: 'Недействительный токен' }, { status: 401 })
    }

    console.log('Loading dashboard data for user:', userId)

    // Получаем данные пользователя
    const userResult = await query(
      `SELECT 
        id, 
        email, 
        full_name, 
        balance::decimal as balance,
        total_invested::decimal as total_invested,
        total_earned::decimal as total_earned,
        created_at,
        role_id
      FROM users 
      WHERE id = $1 AND is_active = true`,
      [userId]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })
    }

    const user = userResult.rows[0]

    // Получаем инвестиции пользователя
    const investmentsResult = await query(
      `SELECT 
        i.id,
        i.amount::decimal as amount,
        i.total_profit::decimal as profit,
        i.status,
        i.created_at,
        i.end_date as expires_at,
        ip.name as plan_name,
        ip.daily_percent::decimal as daily_return_rate,
        ip.duration as duration_days
      FROM investments i
      LEFT JOIN investment_plans ip ON i.plan_id = ip.id
      WHERE i.user_id = $1
      ORDER BY i.created_at DESC`,
      [userId]
    )

    // Получаем транзакции пользователя
    const transactionsResult = await query(
      `SELECT 
        id,
        type,
        amount::decimal as amount,
        fee::decimal as fee,
        status,
        method,
        payment_details,
        created_at,
        processed_at
      FROM transactions
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 20`,
      [userId]
    )

    // Получаем активные планы инвестиций
    const plansResult = await query(
      `SELECT 
        id,
        name,
        min_amount::decimal as min_amount,
        max_amount::decimal as max_amount,
        daily_percent::decimal as daily_return_rate,
        duration as duration_days,
        description,
        features,
        is_active
      FROM investment_plans
      WHERE is_active = true
      ORDER BY min_amount ASC`
    )

    console.log('Dashboard data loaded successfully for user:', userId)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        balance: parseFloat(user.balance || '0'),
        total_invested: parseFloat(user.total_invested || '0'),
        total_earned: parseFloat(user.total_earned || '0'),
        member_since: user.created_at,
        role: user.role_id === 1 ? 'admin' : 'user'
      },
      investments: investmentsResult.rows.map(inv => ({
        id: inv.id,
        amount: parseFloat(inv.amount || '0'),
        profit: parseFloat(inv.profit || '0'),
        status: inv.status,
        plan_name: inv.plan_name,
        daily_return: parseFloat(inv.daily_return_rate || '0'),
        duration: inv.duration_days,
        created_at: inv.created_at,
        expires_at: inv.expires_at
      })),
      transactions: transactionsResult.rows.map(tx => ({
        id: tx.id,
        type: tx.type,
        amount: parseFloat(tx.amount || '0'),
        fee: parseFloat(tx.fee || '0'),
        status: tx.status,
        method: tx.method,
        payment_details: tx.payment_details,
        created_at: tx.created_at,
        processed_at: tx.processed_at
      })),
      investment_plans: plansResult.rows.map(plan => ({
        id: plan.id,
        name: plan.name,
        min_amount: parseFloat(plan.min_amount || '0'),
        max_amount: parseFloat(plan.max_amount || '0'),
        daily_return: parseFloat(plan.daily_return_rate || '0'),
        duration: plan.duration_days,
        description: plan.description,
        features: plan.features,
        is_active: plan.is_active
      }))
    })

  } catch (error) {
    console.error('Dashboard all API error:', error)

    // Детальная обработка ошибок
    if (error instanceof Error) {
      if (error.message.includes('does not exist')) {
        return NextResponse.json({ 
          error: 'Ошибка базы данных: отсутствуют необходимые таблицы',
          details: error.message
        }, { status: 500 })
      }

      if (error.message.includes('authentication')) {
        return NextResponse.json({ error: 'Ошибка аутентификации' }, { status: 401 })
      }
    }

    return NextResponse.json({ 
      error: 'Ошибка сервера при загрузке данных',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}