
import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    console.log("Loading new users from database...")

    // Получаем последних 5 зарегистрированных пользователей
    const result = await query(`
      SELECT 
        u.id,
        u.full_name as name,
        u.email,
        u.created_at as joined_date,
        u.balance,
        u.total_invested,
        COALESCE(t.transaction_count, 0) as transaction_count,
        COALESCE(i.investment_count, 0) as investment_count
      FROM users u
      LEFT JOIN (
        SELECT user_id, COUNT(*) as transaction_count
        FROM transactions 
        WHERE status = 'completed'
        GROUP BY user_id
      ) t ON u.id = t.user_id
      LEFT JOIN (
        SELECT user_id, COUNT(*) as investment_count
        FROM investments
        GROUP BY user_id
      ) i ON u.id = i.user_id
      WHERE u.role_id = 2
      ORDER BY u.created_at DESC
      LIMIT 5
    `)

    const newUsers = result.rows.map(user => ({
      id: user.id,
      name: user.name || 'Anonymous User',
      email: user.email,
      joinedDate: user.joined_date,
      balance: parseFloat(user.balance || 0),
      totalInvested: parseFloat(user.total_invested || 0),
      transactionCount: parseInt(user.transaction_count || 0),
      investmentCount: parseInt(user.investment_count || 0)
    }))

    console.log(`✅ Loaded ${newUsers.length} new users from database`)

    return NextResponse.json({
      success: true,
      data: newUsers
    })
  } catch (error) {
    console.error("Error loading new users:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to load new users"
    }, { status: 500 })
  }
}
