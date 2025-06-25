import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { getServerSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getServerSession(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log(`Loading investments for user ${user.id}`)

    // Получаем инвестиции пользователя
    const investmentsResult = await query(`
      SELECT 
        i.id,
        i.amount,
        i.daily_profit,
        i.total_profit,
        i.start_date,
        i.end_date,
        i.status,
        i.created_at,
        ip.name as plan_name,
        ip.daily_percent,
        ip.duration
      FROM investments i
      JOIN investment_plans ip ON i.plan_id = ip.id
      WHERE i.user_id = $1
      ORDER BY i.created_at DESC
    `, [user.id])

    const investments = investmentsResult.rows.map(investment => {
      const startDate = new Date(investment.start_date)
      const endDate = new Date(investment.end_date)
      const now = new Date()
      
      const totalDays = investment.duration
      const daysPassed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      const daysLeft = Math.max(0, totalDays - daysPassed)
      const progress = totalDays > 0 ? Math.min(100, (daysPassed / totalDays) * 100) : 0

      return {
        id: investment.id,
        amount: parseFloat(investment.amount),
        daily_profit: parseFloat(investment.daily_profit || 0),
        total_profit: parseFloat(investment.total_profit || 0),
        start_date: investment.start_date,
        end_date: investment.end_date,
        status: investment.status,
        plan_name: investment.plan_name,
        days_left: daysLeft,
        progress: Math.round(progress)
      }
    })

    console.log(`✅ Loaded ${investments.length} investments for user ${user.id}`)

    return NextResponse.json({
      success: true,
      investments
    })
  } catch (error) {
    console.error("Error loading user investments:", error)
    return NextResponse.json({ error: "Ошибка загрузки инвестиций" }, { status: 500 })
  }
}