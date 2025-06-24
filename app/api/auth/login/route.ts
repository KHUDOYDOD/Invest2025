import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { query } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email и пароль обязательны" }, { status: 400 })
    }

    // Поиск пользователя в базе данных
    const result = await query(
      `SELECT u.id, u.email, u.full_name, u.password_hash, u.balance, u.total_invested, 
              u.total_earned, u.is_active, ur.name as role_name
       FROM users u
       LEFT JOIN user_roles ur ON u.role_id = ur.id
       WHERE u.email = $1`,
      [email]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 })
    }

    const user = result.rows[0]

    if (!user.is_active) {
      return NextResponse.json({ error: "Аккаунт заблокирован" }, { status: 403 })
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 })
    }

    // Обновляем время последнего входа
    await query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    )

    // Создаем JWT токен
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role_name 
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        balance: user.balance,
        total_invested: user.total_invested,
        total_earned: user.total_earned,
        role: user.role_name,
        isAdmin: user.role_name === 'admin',
      },
      token
    })

    // Устанавливаем cookie с токеном
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 дней
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
