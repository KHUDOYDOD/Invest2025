import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Force dynamic rendering for this route
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Simple credential check - in production, you should query the database
    // and use proper password hashing
    if (username === "admin" && password === "admin123") {
      // Set a cookie for authentication
      cookies().set("admin_token", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      })

      return NextResponse.json({
        success: true,
        user: {
          id: "1",
          username: "admin",
          name: "Administrator",
          role: "super_admin",
        },
      })
    }

    return NextResponse.json({ success: false, error: "Неверное имя пользователя или пароль" }, { status: 401 })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ success: false, error: "Ошибка аутентификации" }, { status: 500 })
  }
}
