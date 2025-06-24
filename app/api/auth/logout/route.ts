import { NextResponse } from "next/server"

export async function POST() {
  try {
    console.log("🚪 Processing logout request...")

    // Создаем ответ с очисткой cookies
    const response = NextResponse.json({
      success: true,
      message: "Вы успешно вышли из системы",
    })

    // Очищаем все возможные cookies
    const cookiesToClear = [
      "auth-token",
      "user-session",
      "sb-access-token",
      "sb-refresh-token",
      "supabase-auth-token",
      "next-auth.session-token",
      "authjs.session-token",
    ]

    cookiesToClear.forEach((cookieName) => {
      response.cookies.set(cookieName, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
      })
    })

    console.log("✅ Logout successful, cookies cleared")

    return response
  } catch (error) {
    console.error("❌ Logout error:", error)
    return NextResponse.json(
      {
        error: "Ошибка при выходе из системы",
      },
      { status: 500 },
    )
  }
}
