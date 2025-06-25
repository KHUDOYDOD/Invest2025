import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'
import { requireAdmin } from '@/lib/auth'

// PUT - обновить транзакцию
export const PUT = requireAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const data = await request.json()
    const { id } = params
    const { type, amount, status, description } = data

    // Получаем текущую транзакцию
    const currentResult = await query('SELECT * FROM transactions WHERE id = $1', [id])
    const currentTransaction = currentResult.rows[0]

    if (!currentTransaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    // Обновляем транзакцию
    const result = await query(
      `UPDATE transactions 
       SET type = $1, amount = $2, status = $3, description = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 RETURNING *`,
      [type, amount, status, description, id]
    )

    // Обновляем баланс пользователя при изменении статуса
    const oldStatus = currentTransaction.status
    const newStatus = status
    const userId = currentTransaction.user_id

    if (oldStatus !== newStatus) {
      if (oldStatus === 'completed' && newStatus !== 'completed') {
        // Отменяем предыдущее зачисление/списание
        if (currentTransaction.type === 'deposit') {
          await query('UPDATE users SET balance = balance - $1 WHERE id = $2', [currentTransaction.amount, userId])
        } else if (currentTransaction.type === 'withdrawal') {
          await query('UPDATE users SET balance = balance + $1 WHERE id = $2', [currentTransaction.amount, userId])
        }
      } else if (oldStatus !== 'completed' && newStatus === 'completed') {
        // Применяем новое зачисление/списание
        if (type === 'deposit') {
          await query('UPDATE users SET balance = balance + $1 WHERE id = $2', [amount, userId])
        } else if (type === 'withdrawal') {
          await query('UPDATE users SET balance = balance - $1 WHERE id = $2', [amount, userId])
        }
      }
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating transaction:', error)
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 })
  }
})

// DELETE - удалить транзакцию
export const DELETE = requireAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { id } = params

    // Получаем транзакцию перед удалением
    const transactionResult = await query('SELECT * FROM transactions WHERE id = $1', [id])
    const transaction = transactionResult.rows[0]

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    // Если транзакция была завершена, откатываем изменения баланса
    if (transaction.status === 'completed') {
      if (transaction.type === 'deposit') {
        await query('UPDATE users SET balance = balance - $1 WHERE id = $2', [transaction.amount, transaction.user_id])
      } else if (transaction.type === 'withdrawal') {
        await query('UPDATE users SET balance = balance + $1 WHERE id = $2', [transaction.amount, transaction.user_id])
      }
    }

    // Удаляем транзакцию
    await query('DELETE FROM transactions WHERE id = $1', [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting transaction:', error)
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 })
  }
})