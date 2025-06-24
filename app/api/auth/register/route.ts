import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { query } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { email, password, full_name, phone, country } = await request.json()

    if (!email || !password || !full_name) {
      return NextResponse.json({ error: "Email, пароль и имя обязательны" }, { status: 400 })
    }

    // Проверяем, не существует ли уже пользователь с таким email
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: "Пользователь с таким email уже существует" }, { status: 400 })
    }

    // Хешируем пароль
    const passwordHash = await bcrypt.hash(password, 12)

    // Генерируем реферальный код
    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase()

    // Создаем нового пользователя
    const result = await query(
      `INSERT INTO users (email, full_name, password_hash, phone, country, referral_code, role_id)
       VALUES ($1, $2, $3, $4, $5, $6, 1)
       RETURNING id, email, full_name, balance, created_at`,
      [email, full_name, passwordHash, phone || null, country || null, referralCode]
    )

    const newUser = result.rows[0]

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        balance: newUser.balance,
        created_at: newUser.created_at,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
