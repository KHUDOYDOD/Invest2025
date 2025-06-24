import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// Force dynamic rendering for this route
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    // Получаем куки сессии
    const sessionCookie = cookies().get("admin_session")?.value

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    try {
      // Парсим данные сессии
      const session = JSON.parse(sessionCookie)

      // Проверяем срок действия сессии
      if (new Date(session.expires_at) < new Date()) {
        return NextResponse.json({ authenticated: false, error: "Сессия истекла" }, { status: 401 })
      }

      // Сессия действительна
      return NextResponse.json({
        authenticated: true,
        user: {
          id: session.id,
          username: session.username,
          name: session.name,
          role: session.role,
        },
      })
    } catch (e) {
      return NextResponse.json({ authenticated: false, error: "Недействительная сессия" }, { status: 401 })
    }
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ authenticated: false, error: "Ошибка сервера" }, { status: 500 })
  }
}
