import { type NextRequest, NextResponse } from "next/server"

// Локальное хранилище пользователей (в реальном приложении это была бы база данных)
const registeredUsers: any[] = []

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 Starting registration process...")

    const { email, password, name } = await request.json()

    console.log("📝 Registration data received:", {
      name: name ? "✅" : "❌",
      email: email ? "✅" : "❌",
      password: password ? "✅" : "❌",
    })

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Все поля обязательны" }, { status: 400 })
    }

    // Проверяем, не существует ли уже пользователь с таким email
    const existingUser = registeredUsers.find((u) => u.email === email)
    if (existingUser) {
      return NextResponse.json({ error: "Пользователь с таким email уже существует" }, { status: 400 })
    }

    // Создаем нового пользователя
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      balance: 0,
      isAdmin: false,
      createdAt: new Date().toISOString(),
    }

    registeredUsers.push(newUser)

    console.log("✅ New user registered:", email)

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        balance: newUser.balance,
        isAdmin: newUser.isAdmin,
      },
    })
  } catch (error) {
    console.error("❌ Registration error:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
