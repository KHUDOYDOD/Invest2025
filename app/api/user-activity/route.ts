import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    console.log("Loading user activity from database...")

    // Получаем последние транзакции из базы данных для отображения активности
    const result = await query(`
      SELECT 
        t.id,
        t.type,
        t.amount,
        t.status,
        t.created_at as time,
        u.full_name as user_name,
        t.user_id,
        ip.name as plan_name
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      LEFT JOIN investments i ON t.type = 'investment' AND t.user_id = i.user_id
      LEFT JOIN investment_plans ip ON i.plan_id = ip.id
      WHERE t.status = 'completed'
      ORDER BY t.created_at DESC
      LIMIT 10
    `)

    const activities = result.rows.map(activity => ({
      id: activity.id,
      type: activity.type,
      amount: parseFloat(activity.amount || 0),
      user_name: activity.user_name || 'Anonymous User',
      time: activity.time,
      plan_name: activity.plan_name || null,
      user_id: activity.user_id
    }))

    console.log(`✅ Loaded ${activities.length} user activities from database`)

    return NextResponse.json({
      success: true,
      data: activities
    })
  } catch (error) {
    console.error("Error loading user activity:", error)
    return NextResponse.json({
      success: false,
      data: []
    })
  }
}