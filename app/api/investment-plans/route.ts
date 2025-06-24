import { NextResponse } from "next/server"

// Демо планы инвестирования
const demoPlans = [
  {
    id: "plan-1",
    name: "Стандарт",
    min_amount: 100,
    max_amount: 1000,
    daily_percent: 2,
    duration: 30,
    total_return: 60,
    features: ["Ежедневные выплаты", "Реинвестирование", "Страхование вклада", "24/7 поддержка"],
    description: "Идеальный план для начинающих инвесторов",
    is_active: true,
  },
  {
    id: "plan-2",
    name: "Премиум",
    min_amount: 1000,
    max_amount: 5000,
    daily_percent: 3,
    duration: 15,
    total_return: 45,
    features: [
      "Ежедневные выплаты",
      "Реинвестирование",
      "Страхование вклада",
      "Приоритетная поддержка",
      "Персональный менеджер",
    ],
    description: "Для опытных инвесторов с высокой доходностью",
    is_active: true,
  },
  {
    id: "plan-3",
    name: "VIP Elite",
    min_amount: 5000,
    max_amount: 50000,
    daily_percent: 4,
    duration: 10,
    total_return: 40,
    features: [
      "Ежедневные выплаты",
      "Реинвестирование",
      "Полное страхование",
      "VIP поддержка 24/7",
      "Персональный менеджер",
      "Эксклюзивные инвестиции",
      "Приоритетный вывод",
    ],
    description: "Эксклюзивный план для VIP клиентов",
    is_active: true,
  },
]

export async function GET() {
  try {
    console.log("✅ Investment plans loaded (demo data)")

    return NextResponse.json(demoPlans)
  } catch (error) {
    console.error("❌ Error loading investment plans:", error)
    return NextResponse.json({ error: "Ошибка загрузки планов" }, { status: 500 })
  }
}
