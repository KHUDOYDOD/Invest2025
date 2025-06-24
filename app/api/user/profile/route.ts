import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("id")

    if (!userId) {
      return NextResponse.json({ error: "ID пользователя обязателен" }, { status: 400 })
    }

    const supabase = createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Ошибка подключения к базе данных" }, { status: 500 })
    }

    // Получаем данные пользователя с профилем
    const { data: user, error: userError } = await supabase
      .from("users")
      .select(`
        *,
        profile:user_profiles(*)
      `)
      .eq("id", userId)
      .single()

    if (userError || !user) {
      console.error("User fetch error:", userError)
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        balance: Number(user.balance) || 0,
        total_invested: Number(user.total_invested) || 0,
        total_profit: Number(user.total_profit) || 0,
        total_withdrawn: Number(user.total_withdrawn) || 0,
        referral_count: user.referral_count || 0,
        referral_code: user.referral_code,
        role: user.role_id === 1 ? "admin" : "user",
        status: user.status,
        email_verified: user.email_verified,
        kyc_verified: user.kyc_verified,
        created_at: user.created_at,
        profile: user.profile?.[0] || null,
      },
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { userId, full_name, phone, country, city, bio, occupation } = body

    if (!userId) {
      return NextResponse.json({ error: "ID пользователя обязателен" }, { status: 400 })
    }

    const supabase = createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Ошибка подключения к базе данных" }, { status: 500 })
    }

    // Обновляем основные данные пользователя
    const { error: userError } = await supabase.from("users").update({ full_name }).eq("id", userId)

    if (userError) {
      console.error("User update error:", userError)
      return NextResponse.json({ error: "Ошибка обновления пользователя" }, { status: 500 })
    }

    // Обновляем или создаем профиль
    const { error: profileError } = await supabase.from("user_profiles").upsert({
      user_id: userId,
      phone,
      country,
      city,
      bio,
      occupation,
      updated_at: new Date().toISOString(),
    })

    if (profileError) {
      console.error("Profile update error:", profileError)
      return NextResponse.json({ error: "Ошибка обновления профиля" }, { status: 500 })
    }

    // Получаем обновленные данные
    const { data: updatedUser, error: fetchError } = await supabase
      .from("users")
      .select(`
        *,
        profile:user_profiles(*)
      `)
      .eq("id", userId)
      .single()

    if (fetchError) {
      console.error("Updated user fetch error:", fetchError)
      return NextResponse.json({ error: "Ошибка получения обновленных данных" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Профиль успешно обновлен",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        full_name: updatedUser.full_name,
        balance: Number(updatedUser.balance) || 0,
        total_invested: Number(updatedUser.total_invested) || 0,
        total_profit: Number(updatedUser.total_profit) || 0,
        total_withdrawn: Number(updatedUser.total_withdrawn) || 0,
        referral_count: updatedUser.referral_count || 0,
        referral_code: updatedUser.referral_code,
        role: updatedUser.role_id === 1 ? "admin" : "user",
        status: updatedUser.status,
        email_verified: updatedUser.email_verified,
        kyc_verified: updatedUser.kyc_verified,
        created_at: updatedUser.created_at,
        profile: updatedUser.profile?.[0] || null,
      },
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
