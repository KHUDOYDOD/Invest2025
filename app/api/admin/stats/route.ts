import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    console.log("Loading admin stats from database...")

    // Получаем общую статистику пользователей
    const usersStats = await query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_users_month
      FROM users
    `)

    // Получаем статистику транзакций
    const transactionsStats = await query(`
      SELECT 
        COUNT(*) as total_transactions,
        COALESCE(SUM(amount) FILTER (WHERE type = 'deposit' AND status = 'completed'), 0) as total_deposits,
        COALESCE(SUM(amount) FILTER (WHERE type = 'withdrawal' AND status = 'completed'), 0) as total_withdrawals,
        COALESCE(SUM(amount) FILTER (WHERE type = 'profit' AND status = 'completed'), 0) as total_profits
      FROM transactions
    `)

    // Получаем статистику инвестиций
    const investmentsStats = await query(`
      SELECT 
        COUNT(*) as total_investments,
        COALESCE(SUM(amount), 0) as total_invested_amount,
        COUNT(*) FILTER (WHERE status = 'active') as active_investments
      FROM investments
    `)

    const stats = {
      users: {
        total: parseInt(usersStats.rows[0].total_users) || 0,
        newThisMonth: parseInt(usersStats.rows[0].new_users_month) || 0,
        growth: 0 // Можно добавить расчет роста позже
      },
      transactions: {
        total: parseInt(transactionsStats.rows[0].total_transactions) || 0,
        totalDeposits: parseFloat(transactionsStats.rows[0].total_deposits) || 0,
        totalWithdrawals: parseFloat(transactionsStats.rows[0].total_withdrawals) || 0,
        totalProfits: parseFloat(transactionsStats.rows[0].total_profits) || 0
      },
      investments: {
        total: parseInt(investmentsStats.rows[0].total_investments) || 0,
        totalAmount: parseFloat(investmentsStats.rows[0].total_invested_amount) || 0,
        active: parseInt(investmentsStats.rows[0].active_investments) || 0
      }
    }

    console.log(`✅ Admin stats loaded from database`)

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Admin stats API error:", error)
    return NextResponse.json({ error: "Ошибка загрузки статистики" }, { status: 500 })
  }
}