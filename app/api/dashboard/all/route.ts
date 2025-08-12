import { NextRequest, NextResponse } from 'next/server'
import { query } from '../../../../server/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    let userId = searchParams.get('userId')

    // Если userId не передан в параметрах, попробуем получить из токена
    if (!userId) {
      const authorization = request.headers.get('authorization')
      if (authorization?.startsWith('Bearer ')) {
        const token = authorization.slice(7)
        try {
          const jwt = require('jsonwebtoken')
          const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any
          userId = decoded.userId
        } catch (err) {
          console.error('JWT decode error:', err)
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    console.log('Fetching dashboard data for user:', userId)

    // Получаем данные пользователя
    const userResult = await query(
      `SELECT 
        id, 
        email, 
        full_name, 
        COALESCE(balance, 0) as balance,
        0 as total_invested,
        0 as total_earned,
        created_at
      FROM users 
      WHERE id = $1`,
      [userId]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = userResult.rows[0]

    // Получаем активные инвестиции
    const investmentsResult = await query(
      `SELECT 
        i.id,
        i.amount,
        i.created_at,
        i.status,
        ip.name as plan_name,
        ip.roi_percentage as daily_return_rate,
        ip.duration_days
      FROM investments i
      LEFT JOIN investment_plans ip ON i.plan_id = ip.id
      WHERE i.user_id = $1
      ORDER BY i.created_at DESC
      LIMIT 10`,
      [userId]
    )

    // Получаем последние транзакции
    const transactionsResult = await query(
      `SELECT 
        id,
        type,
        amount,
        status,
        created_at,
        description
      FROM transactions
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 10`,
      [userId]
    )

    // Получаем планы инвестирования
    const plansResult = await query(
      `SELECT 
        id,
        name,
        COALESCE(min_amount, 0) as min_amount,
        COALESCE(max_amount, 0) as max_amount,
        COALESCE(roi_percentage, 0) as daily_return_rate,
        duration_days
      FROM investment_plans
      ORDER BY min_amount ASC`
    )

    console.log(`Dashboard data loaded: User ${user.email}, ${investmentsResult.rows.length} investments, ${transactionsResult.rows.length} transactions`)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        balance: parseFloat(user.balance),
        total_invested: parseFloat(user.total_invested),
        total_earned: parseFloat(user.total_earned),
        created_at: user.created_at
      },
      investments: investmentsResult.rows.map(inv => ({
        id: inv.id,
        amount: parseFloat(inv.amount),
        plan_name: inv.plan_name,
        daily_return_rate: parseFloat(inv.daily_return_rate || '0'),
        duration_days: inv.duration_days,
        status: inv.status,
        created_at: inv.created_at
      })),
      transactions: transactionsResult.rows.map(tx => ({
        id: tx.id,
        type: tx.type,
        amount: parseFloat(tx.amount),
        status: tx.status,
        description: tx.description,
        created_at: tx.created_at
      })),
      investment_plans: plansResult.rows.map(plan => ({
        id: plan.id,
        name: plan.name,
        min_amount: parseFloat(plan.min_amount),
        max_amount: parseFloat(plan.max_amount),
        daily_return: parseFloat(plan.daily_return_rate),
        duration: plan.duration_days,
        description: `План ${plan.name} с доходностью ${plan.daily_return_rate}%`,
        features: [`Доходность ${plan.daily_return_rate}%`, `Срок ${plan.duration_days} дней`],
        is_active: true
      }))
    })

  } catch (error) {
    console.error('Dashboard all API error:', error)

    // Детальная обработка ошибок
    if (error instanceof Error) {
      if (error.message.includes('does not exist')) {
        return NextResponse.json({ 
          error: 'Ошибка базы данных: отсутствуют необходимые таблицы',
          details: 'Требуется настройка базы данных'
        }, { status: 500 })
      }
    }

    return NextResponse.json({ 
      error: 'Ошибка загрузки данных',
      details: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }, { status: 500 })
  }
}