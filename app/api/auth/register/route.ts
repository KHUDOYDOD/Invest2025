import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { query } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, full_name } = await request.json()
    
    // Используем name или full_name
    const userName = name || full_name

    if (!email || !password || !userName) {
      return NextResponse.json({ error: "Email, пароль и имя обязательны" }, { status: 400 })
    }
    
    // Простая валидация пароля
    if (password.length < 3) {
      return NextResponse.json({ error: "Пароль должен содержать минимум 3 символа" }, { status: 400 })
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

    // Создаем нового пользователя (role_id: 2 = user, 1 = admin)
    const result = await query(
      `INSERT INTO users (email, full_name, password_hash, referral_code, role_id)
       VALUES ($1, $2, $3, $4, 2)
       RETURNING id, email, full_name, balance, created_at`,
      [email, userName, passwordHash, referralCode]
    )

    const newUser = result.rows[0]

    // Создаем JWT токен для автоматического входа
    const jwt = require('jsonwebtoken')
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email,
        role: "user" 
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        balance: newUser.balance,
        total_invested: "0.00",
        total_earned: "0.00",
        role: "user",
        isAdmin: false,
        created_at: newUser.created_at,
      },
      token
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
