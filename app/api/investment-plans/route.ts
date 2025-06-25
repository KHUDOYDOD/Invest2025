import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    console.log("Loading investment plans from database...")

    const plansResult = await query(`
      SELECT 
        id, name, description, min_amount, max_amount, 
        daily_percent, duration, total_return, features, is_active
      FROM investment_plans 
      WHERE is_active = true
      ORDER BY min_amount ASC
    `)

    const plans = plansResult.rows.map(plan => ({
      ...plan,
      min_amount: parseFloat(plan.min_amount),
      max_amount: parseFloat(plan.max_amount),
      daily_percent: parseFloat(plan.daily_percent),
      total_return: parseFloat(plan.total_return),
      features: plan.features || []
    }))

    console.log(`✅ Investment plans loaded from database: ${plans.length} plans`)

    return NextResponse.json({
      success: true,
      plans
    })
  } catch (error) {
    console.error("Error loading investment plans:", error)
    
    // Возвращаем базовые планы как fallback
    const fallbackPlans = [
      {
        id: "1",
        name: "Стандарт",
        description: "Идеальный план для начинающих инвесторов",
        min_amount: 100,
        max_amount: 1000,
        daily_percent: 2,
        duration: 30,
        total_return: 60,
        features: ["Ежедневные выплаты", "Реинвестирование", "Страхование вклада", "24/7 поддержка"],
        is_active: true
      },
      {
        id: "2",
        name: "Премиум",
        description: "Для опытных инвесторов с высокой доходностью",
        min_amount: 1000,
        max_amount: 5000,
        daily_percent: 3,
        duration: 15,
        total_return: 45,
        features: ["Ежедневные выплаты", "Реинвестирование", "Страхование вклада", "Приоритетная поддержка", "Персональный менеджер"],
        is_active: true
      },
      {
        id: "3",
        name: "VIP Elite",
        description: "Эксклюзивный план для VIP клиентов",
        min_amount: 5000,
        max_amount: 50000,
        daily_percent: 4,
        duration: 10,
        total_return: 40,
        features: ["Ежедневные выплаты", "Реинвестирование", "Полное страхование", "VIP поддержка", "Персональный аналитик", "Эксклюзивные отчеты"],
        is_active: true
      }
    ]

    return NextResponse.json({
      success: true,
      plans: fallbackPlans
    })
  }
}