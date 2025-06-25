import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

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
        COALESCE(total_invested, 0) as total_invested,
        COALESCE(total_earned, 0) as total_earned,
        created_at,
        is_active
      FROM users 
      WHERE id = $1 AND is_active = true`,
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
        ip.daily_return_rate,
        ip.duration_days,
        COALESCE(i.total_earned, 0) as total_earned
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
        COALESCE(daily_return_rate, 0) as daily_return_rate,
        duration_days,
        description,
        features,
        is_active
      FROM investment_plans
      WHERE is_active = true
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
        total_earned: parseFloat(inv.total_earned),
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