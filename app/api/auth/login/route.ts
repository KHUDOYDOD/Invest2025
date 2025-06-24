import { type NextRequest, NextResponse } from "next/server"

// Демо пользователи
const demoUsers = [
  {
    id: "user-1",
    email: "demo@example.com",
    password: "demo123",
    name: "Демо Пользователь",
    balance: 25000,
    isAdmin: false,
  },
  {
    id: "admin-1",
    email: "admin@example.com",
    password: "admin123",
    name: "Администратор",
    balance: 100000,
    isAdmin: true,
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email и пароль обязательны" }, { status: 400 })
    }

    // Поиск пользователя в демо данных
    const user = demoUsers.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 })
    }

    console.log("✅ User logged in:", user.email)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        balance: user.balance,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error) {
    console.error("❌ Login error:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
