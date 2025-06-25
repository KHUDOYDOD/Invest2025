import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { getServerSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getServerSession(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log(`Loading balance for user ${user.id}`)

    // Получаем актуальный баланс и статистику пользователя
    const userResult = await query(`
      SELECT 
        balance, total_invested, total_earned, created_at
      FROM users
      WHERE id = $1
    `, [user.id])

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userData = userResult.rows[0]

    // Получаем статистику транзакций
    const transactionStats = await query(`
      SELECT 
        COUNT(*) as total_transactions,
        COALESCE(SUM(amount) FILTER (WHERE type = 'deposit' AND status = 'completed'), 0) as total_deposits,
        COALESCE(SUM(amount) FILTER (WHERE type = 'withdrawal' AND status = 'completed'), 0) as total_withdrawals,
        COALESCE(SUM(amount) FILTER (WHERE type = 'profit' AND status = 'completed'), 0) as total_profit_earned
      FROM transactions
      WHERE user_id = $1
    `, [user.id])

    // Получаем статистику инвестиций
    const investmentStats = await query(`
      SELECT 
        COUNT(*) as total_investments,
        COUNT(*) FILTER (WHERE status = 'active') as active_investments,
        COALESCE(SUM(amount), 0) as total_amount_invested
      FROM investments
      WHERE user_id = $1
    `, [user.id])

    const txStats = transactionStats.rows[0]
    const invStats = investmentStats.rows[0]

    const balanceData = {
      balance: parseFloat(userData.balance || 0),
      total_invested: parseFloat(userData.total_invested || 0),
      total_earned: parseFloat(userData.total_earned || 0),
      member_since: userData.created_at,
      
      // Дополнительная статистика
      total_deposits: parseFloat(txStats.total_deposits || 0),
      total_withdrawals: parseFloat(txStats.total_withdrawals || 0),
      total_profit_earned: parseFloat(txStats.total_profit_earned || 0),
      total_transactions: parseInt(txStats.total_transactions || 0),
      
      active_investments: parseInt(invStats.active_investments || 0),
      total_investments: parseInt(invStats.total_investments || 0),
      total_amount_invested: parseFloat(invStats.total_amount_invested || 0)
    }

    console.log(`✅ Balance data loaded for user ${user.id}`)

    return NextResponse.json({
      success: true,
      balance: balanceData
    })
  } catch (error) {
    console.error("Error loading user balance:", error)
    return NextResponse.json({ error: "Ошибка загрузки баланса" }, { status: 500 })
  }
}