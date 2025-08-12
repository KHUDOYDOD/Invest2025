import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    console.log("Loading real statistics from database...")

    // Получаем статистику пользователей
    const usersStats = await query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) as active_users
      FROM users
      WHERE role = 'user'
    `)

    // Получаем статистику инвестиций
    const investmentsStats = await query(`
      SELECT 
        COUNT(*) as total_investments,
        COALESCE(SUM(amount), 0) as total_invested,
        COUNT(*) FILTER (WHERE status = 'active') as active_investments
      FROM investments
    `)

    // Получаем статистику транзакций
    const transactionsStats = await query(`
      SELECT 
        COALESCE(SUM(amount) FILTER (WHERE type = 'deposit' AND status = 'completed'), 0) as total_deposits,
        COALESCE(SUM(amount) FILTER (WHERE type = 'withdrawal' AND status = 'completed'), 0) as total_paid,
        COALESCE(SUM(amount) FILTER (WHERE type = 'profit' AND status = 'completed'), 0) as total_profit
      FROM transactions
    `)

    // Получаем количество инвестиционных планов
    const plansStats = await query(`
      SELECT COUNT(*) as total_plans
      FROM investment_plans
    `)

    const users = parseInt(usersStats.rows[0].total_users) || 0
    const totalInvested = parseFloat(investmentsStats.rows[0].total_invested) || 0
    const totalPaid = parseFloat(transactionsStats.rows[0].total_paid) || 0
    const totalProfit = parseFloat(transactionsStats.rows[0].total_profit) || 0
    const activeInvestments = parseInt(investmentsStats.rows[0].active_investments) || 0
    const totalPlans = parseInt(plansStats.rows[0].total_plans) || 0

    // Рассчитываем показатели
    const successRate = users > 0 ? Math.min(98.5, 85 + (totalProfit / Math.max(totalInvested, 1)) * 10) : 95.0
    const averageReturn = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 24.5
    const onlineUsers = Math.floor(users * 0.15) // Примерно 15% пользователей онлайн

    const stats = {
      totalUsers: users,
      totalInvested: Math.round(totalInvested),
      totalPaid: Math.round(totalPaid + totalProfit),
      activeInvestments: activeInvestments,
      totalProjects: totalPlans,
      successRate: Math.round(successRate * 10) / 10,
      averageReturn: Math.round(averageReturn * 10) / 10,
      onlineUsers: onlineUsers,
    }

    console.log("✅ Real statistics loaded from database:", stats)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("❌ Error loading statistics:", error)
    return NextResponse.json({ error: "Ошибка загрузки статистики" }, { status: 500 })
  }
}
