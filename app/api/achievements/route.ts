import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Force dynamic rendering for this route
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Проверяем, существует ли таблица user_achievements
    const { error: tableCheckError } = await supabase.from("user_achievements").select("count").limit(1)

    // Если таблицы нет, возвращаем ошибку
    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      console.log("Achievements table does not exist yet")
      return NextResponse.json({ error: "Achievements table does not exist yet" }, { status: 404 })
    }

    // Получаем достижения пользователя
    const { data, error } = await supabase.from("user_achievements").select("*").eq("user_email", email)

    if (error) {
      console.error("Error fetching achievements:", error)
      return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 })
    }

    // Преобразуем snake_case в camelCase для фронтенда
    const camelCaseData = data.map((item) => {
      return Object.entries(item).reduce((acc, [key, value]) => {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
        return { ...acc, [camelKey]: value }
      }, {})
    })

    return NextResponse.json(camelCaseData)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userEmail, title, description, icon, unlocked, progress, unlockDate } = body

    if (!userEmail || !title) {
      return NextResponse.json({ error: "User email and title are required" }, { status: 400 })
    }

    const supabase = createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Проверяем, существует ли таблица user_achievements
    const { error: tableCheckError } = await supabase.from("user_achievements").select("count").limit(1)

    // Если таблицы нет, возвращаем ошибку
    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      console.log("Achievements table does not exist yet")
      return NextResponse.json({ error: "Achievements table does not exist yet" }, { status: 404 })
    }

    // Проверяем, существует ли достижение
    const { data: existingAchievement } = await supabase
      .from("user_achievements")
      .select("id")
      .eq("user_email", userEmail)
      .eq("title", title)
      .single()

    let result
    if (existingAchievement) {
      // Обновляем существующее достижение
      const { data, error } = await supabase
        .from("user_achievements")
        .update({
          description,
          icon,
          unlocked,
          progress,
          unlock_date: unlockDate,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingAchievement.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating achievement:", error)
        return NextResponse.json({ error: "Failed to update achievement" }, { status: 500 })
      }

      result = data
    } else {
      // Создаем новое достижение
      const { data, error } = await supabase
        .from("user_achievements")
        .insert({
          user_email: userEmail,
          title,
          description,
          icon,
          unlocked,
          progress,
          unlock_date: unlockDate,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating achievement:", error)
        return NextResponse.json({ error: "Failed to create achievement" }, { status: 500 })
      }

      result = data
    }

    // Преобразуем snake_case в camelCase для фронтенда
    const camelCaseResult = Object.entries(result).reduce((acc, [key, value]) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      return { ...acc, [camelKey]: value }
    }, {})

    return NextResponse.json(camelCaseResult)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
