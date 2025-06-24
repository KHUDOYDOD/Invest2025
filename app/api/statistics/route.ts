import { NextResponse } from "next/server"

// Демо статистика
const demoStats = {
  totalUsers: 15847,
  totalInvested: 2847593,
  totalPaid: 1923847,
  activeInvestments: 8934,
  totalProjects: 156,
  successRate: 98.7,
  averageReturn: 24.5,
  onlineUsers: 1247,
}

export async function GET() {
  try {
    console.log("✅ Statistics loaded (demo data)")

    return NextResponse.json({
      success: true,
      data: demoStats,
    })
  } catch (error) {
    console.error("❌ Error loading statistics:", error)
    return NextResponse.json({ error: "Ошибка загрузки статистики" }, { status: 500 })
  }
}
