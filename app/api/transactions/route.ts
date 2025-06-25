import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    console.log('Fetching transactions for user:', userId, 'limit:', limit)

    // Получаем транзакции пользователя
    const result = await query(
      `SELECT 
        t.id,
        t.type,
        t.amount,
        t.status,
        t.created_at,
        t.description,
        t.payment_method,
        CASE 
          WHEN t.type = 'investment' THEN ip.name
          ELSE NULL
        END as plan_name
      FROM transactions t
      LEFT JOIN investments i ON t.user_id = i.user_id AND t.type = 'investment' AND t.created_at = i.created_at
      LEFT JOIN investment_plans ip ON i.plan_id = ip.id
      WHERE t.user_id = $1
      ORDER BY t.created_at DESC
      LIMIT $2`,
      [userId, limit]
    )

    console.log(`Found ${result.rows.length} transactions for user ${userId}`)

    return NextResponse.json({
      success: true,
      transactions: result.rows
    })

  } catch (error) {
    console.error('Transactions API error:', error)
    return NextResponse.json({ 
      error: 'Ошибка загрузки транзакций',
      details: error.message 
    }, { status: 500 })
  }
}