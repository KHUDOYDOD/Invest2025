
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { loginField, password } = await request.json()

    console.log('Login attempt for:', loginField)

    // Валидация входных данных
    if (!loginField || !password) {
      return NextResponse.json({ 
        error: 'Email/логин и пароль обязательны' 
      }, { status: 400 })
    }

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
      WHERE (LOWER(email) = LOWER($1) OR LOWER(full_name) = LOWER($1)) 
      AND status = 'active'`,
      [loginField.trim()]
    )

    if (userResult.rows.length === 0) {
      console.log('User not found:', loginField)
      return NextResponse.json({ 
        error: 'Неверный email/логин или пароль' 
      }, { status: 401 })
    }

    const user = userResult.rows[0]
    console.log('User found:', user.email, 'Role ID:', user.role_id)

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)
    console.log('Password validation result:', isPasswordValid)
    
    if (!isPasswordValid) {
      console.log('Invalid password for user:', user.email)
      return NextResponse.json({ 
        error: 'Неверный email/логин или пароль' 
      }, { status: 401 })
    }

    // Обновляем время последнего входа
    await query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    )

    // Определяем роль пользователя
    const userRole = user.role_id === 1 ? 'admin' : 'user'
    const isAdmin = user.role_id === 1

    // Создаем JWT токен
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: userRole
      },
      process.env.NEXTAUTH_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    console.log('Login successful for user:', user.email, 'Role:', userRole)

    return NextResponse.json({
      success: true,
      message: 'Вход выполнен успешно',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        balance: parseFloat(user.balance),
        total_invested: parseFloat(user.total_invested),
        total_earned: parseFloat(user.total_earned),
        role: userRole,
        isAdmin: isAdmin
      },
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: `Ошибка входа: ${error.message}` 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      error: 'Внутренняя ошибка сервера' 
    }, { status: 500 })
  }
}
