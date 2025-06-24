import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Force dynamic rendering for this route
export const dynamic = "force-dynamic"

// GET запрос для получения профиля пользователя
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

    // Проверяем, существует ли таблица user_profiles
    const { error: tableCheckError } = await supabase.from("user_profiles").select("count").limit(1)

    // Если таблицы нет, создаем ее
    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      console.log("Profile table does not exist yet")
      return NextResponse.json({ error: "Profile table does not exist yet" }, { status: 404 })
    }

    // Получаем профиль пользователя
    const { data, error } = await supabase.from("user_profiles").select("*").eq("email", email).single()

    if (error) {
      console.error("Error fetching profile:", error)
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Преобразуем snake_case в camelCase для фронтенда
    const camelCaseData = Object.entries(data).reduce((acc, [key, value]) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      return { ...acc, [camelKey]: value }
    }, {})

    // Получаем достижения пользователя
    const { data: achievements, error: achievementsError } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_email", email)

    if (achievementsError) {
      console.error("Error fetching achievements:", achievementsError)
    }

    // Преобразуем достижения в camelCase
    const camelCaseAchievements = achievements
      ? achievements.map((achievement) => {
          return Object.entries(achievement).reduce((acc, [key, value]) => {
            const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
            return { ...acc, [camelKey]: value }
          }, {})
        })
      : []

    return NextResponse.json({
      ...camelCaseData,
      achievements: camelCaseAchievements,
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST запрос для создания/обновления профиля пользователя
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Преобразуем camelCase в snake_case для базы данных
    const snakeCaseData = Object.entries(body).reduce((acc, [key, value]) => {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
      return { ...acc, [snakeKey]: value }
    }, {})

    // Проверяем, существует ли таблица user_profiles
    const { error: tableCheckError } = await supabase.from("user_profiles").select("count").limit(1)

    // Если таблицы нет, возвращаем ошибку
    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      console.log("Profile table does not exist yet")
      return NextResponse.json({ error: "Profile table does not exist yet" }, { status: 404 })
    }

    // Проверяем, существует ли профиль
    const { data: existingProfile } = await supabase.from("user_profiles").select("id").eq("email", email).single()

    let result
    if (existingProfile) {
      // Обновляем существующий профиль
      const { data, error } = await supabase
        .from("user_profiles")
        .update({
          ...snakeCaseData,
          updated_at: new Date().toISOString(),
        })
        .eq("email", email)
        .select()
        .single()

      if (error) {
        console.error("Error updating profile:", error)
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
      }

      result = data
    } else {
      // Создаем новый профиль
      const { data, error } = await supabase
        .from("user_profiles")
        .insert({
          ...snakeCaseData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating profile:", error)
        return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
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
