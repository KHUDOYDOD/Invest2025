import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { loginField, password } = await request.json()

    if (!loginField || !password) {
      return NextResponse.json({ error: 'Email/логин и пароль обязательны' }, { status: 400 })
    }

    console.log('Login attempt for:', loginField)

    // Ищем пользователя по email или full_name
    const userResult = await query(
      `SELECT 
        id, 
        email, 
        full_name, 
        password_hash, 
        role_id, 
        status,
        COALESCE(balance, 0) as balance,
        COALESCE(total_invested, 0) as total_invested,
        COALESCE(total_earned, 0) as total_earned
      FROM users 
      WHERE (email = $1 OR full_name = $1) AND status = 'active'`,
      [loginField]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'Неверный email/логин или пароль' }, { status: 401 })
    }

    const user = userResult.rows[0]

    // Проверяем пароль
    console.log('Checking password for user:', user.email, 'with hash:', user.password_hash.substring(0, 20))
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)
    console.log('Password validation result:', isPasswordValid)
    
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Неверный email/логин или пароль' }, { status: 401 })
    }

    // Обновляем время последнего входа
    await query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    )

    // Создаем JWT токен
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role_id === 1 ? 'admin' : 'user'
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    console.log('Login successful for user:', user.email)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        balance: parseFloat(user.balance),
        total_invested: parseFloat(user.total_invested),
        total_earned: parseFloat(user.total_earned),
        role: user.role_id === 1 ? 'admin' : 'user',
        isAdmin: user.role_id === 1
      },
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}