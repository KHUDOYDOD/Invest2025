import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("id")

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID обязателен" }, { status: 400 })
    }

    console.log("Loading profile data for user:", userId)

    // Получаем данные пользователя из базы данных
    const userResult = await query(
      `SELECT id, email, full_name, balance, total_invested, total_earned, role_id, created_at, phone, country, city, address, bio, avatar_url, last_login
       FROM users WHERE id = $1`,
      [userId]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json({ success: false, error: "Пользователь не найден" }, { status: 404 })
    }

    const user = userResult.rows[0]
    
    // Определяем роль
    const isAdmin = user.role_id === 1

    const profileData = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      balance: parseFloat(user.balance || 0),
      total_invested: parseFloat(user.total_invested || 0),
      total_earned: parseFloat(user.total_earned || 0),
      role: isAdmin ? "admin" : "user",
      created_at: user.created_at,
      phone: user.phone || "",
      country: user.country || "",
      city: user.city || "",
      address: user.address || "",
      bio: user.bio || "",
      avatar_url: user.avatar_url || "",
      last_login: user.last_login,
    }

    console.log("Profile data loaded successfully for user:", user.email)

    return NextResponse.json({
      success: true,
      user: profileData,
    })
  } catch (error) {
    console.error("Profile API error:", error)
    return NextResponse.json({ success: false, error: "Ошибка сервера" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, updates } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID обязателен" }, { status: 400 })
    }

    console.log("Updating profile for user:", userId, updates)

    // Обновляем данные пользователя
    const updateResult = await query(
      `UPDATE users 
       SET full_name = COALESCE($2, full_name),
           phone = COALESCE($3, phone),
           country = COALESCE($4, country),
           city = COALESCE($5, city),
           address = COALESCE($6, address),
           bio = COALESCE($7, bio),
           avatar_url = COALESCE($8, avatar_url)
       WHERE id = $1
       RETURNING id, email, full_name, balance, total_invested, total_earned, role_id, created_at, phone, country, city, address, bio, avatar_url`,
      [
        userId,
        updates.full_name,
        updates.phone,
        updates.country,
        updates.city,
        updates.address,
        updates.bio,
        updates.avatar_url,
      ]
    )

    if (updateResult.rows.length === 0) {
      return NextResponse.json({ success: false, error: "Пользователь не найден" }, { status: 404 })
    }

    const user = updateResult.rows[0]
    const isAdmin = user.role_id === 1

    const profileData = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      balance: parseFloat(user.balance || 0),
      total_invested: parseFloat(user.total_invested || 0),
      total_earned: parseFloat(user.total_earned || 0),
      role: isAdmin ? "admin" : "user",
      created_at: user.created_at,
      phone: user.phone || "",
      country: user.country || "",
      city: user.city || "",
      address: user.address || "",
      bio: user.bio || "",
      avatar_url: user.avatar_url || "",
    }

    console.log("Profile updated successfully for user:", user.email)

    return NextResponse.json({
      success: true,
      user: profileData,
    })
  } catch (error) {
    console.error("Profile update API error:", error)
    return NextResponse.json({ success: false, error: "Ошибка обновления профиля" }, { status: 500 })
  }
}