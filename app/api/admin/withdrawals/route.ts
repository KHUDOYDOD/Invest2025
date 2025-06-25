import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'
import { requireAdmin } from '@/lib/auth'

// GET - получить все запросы на вывод
export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const url = new URL(request.url)
    const status = url.searchParams.get('status') || 'pending'
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    const result = await query(`
      SELECT 
        t.id,
        t.user_id,
        u.full_name as user_name,
        u.email as user_email,
        u.balance as user_balance,
        t.amount,
        t.status,
        t.description,
        t.created_at,
        t.updated_at
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      WHERE t.type = 'withdrawal'
      ${status !== 'all' ? 'AND t.status = $1' : ''}
      ORDER BY t.created_at DESC
      LIMIT $${status !== 'all' ? '2' : '1'} OFFSET $${status !== 'all' ? '3' : '2'}
    `, status !== 'all' ? [status, limit, offset] : [limit, offset])

    // Подсчет общего количества
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM transactions t
      WHERE t.type = 'withdrawal'
      ${status !== 'all' ? 'AND t.status = $1' : ''}
    `, status !== 'all' ? [status] : [])

    const total = parseInt(countResult.rows[0].total)

    return NextResponse.json({
      withdrawals: result.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Error fetching withdrawals:', error)
    return NextResponse.json({ error: 'Failed to fetch withdrawals' }, { status: 500 })
  }
})

// POST - обработать запрос на вывод
export const POST = requireAdmin(async (request: NextRequest) => {
  try {
    const { transactionId, action, adminNote } = await request.json()

    // Получаем транзакцию
    const transactionResult = await query(
      'SELECT * FROM transactions WHERE id = $1 AND type = $2',
      [transactionId, 'withdrawal']
    )

    if (transactionResult.rows.length === 0) {
      return NextResponse.json({ error: 'Withdrawal transaction not found' }, { status: 404 })
    }

    const transaction = transactionResult.rows[0]

    if (transaction.status !== 'pending') {
      return NextResponse.json({ error: 'Transaction already processed' }, { status: 400 })
    }

    // Получаем текущий баланс пользователя
    const userResult = await query('SELECT balance FROM users WHERE id = $1', [transaction.user_id])
    const userBalance = parseFloat(userResult.rows[0].balance)

    if (action === 'approve') {
      // Проверяем достаточность средств
      if (userBalance < transaction.amount) {
        return NextResponse.json({ 
          error: 'Insufficient user balance', 
          userBalance, 
          requestedAmount: transaction.amount 
        }, { status: 400 })
      }

      // Одобряем вывод
      await query(
        `UPDATE transactions 
         SET status = 'completed', description = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [adminNote || 'Approved by admin', transactionId]
      )

      // Списываем с баланса пользователя
      await query(
        'UPDATE users SET balance = balance - $1 WHERE id = $2',
        [transaction.amount, transaction.user_id]
      )

      return NextResponse.json({ 
        success: true, 
        message: 'Withdrawal approved and balance updated' 
      })
    } else if (action === 'reject') {
      // Отклоняем вывод
      await query(
        `UPDATE transactions 
         SET status = 'failed', description = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [adminNote || 'Rejected by admin', transactionId]
      )

      return NextResponse.json({ 
        success: true, 
        message: 'Withdrawal rejected' 
      })
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error processing withdrawal:', error)
    return NextResponse.json({ error: 'Failed to process withdrawal' }, { status: 500 })
  }
})