
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log('Login attempt:', { email })

    // Валидация входных данных
    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email и пароль обязательны' 
      }, { status: 400 })
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'Некорректный формат email' 
      }, { status: 400 })
    }

    // Поиск пользователя в базе данных
    const userResult = await query(
      `SELECT 
        id, 
        email, 
        full_name, 
        password_hash, 
        role_id, 
        status, 
        balance, 
        total_invested, 
        total_earned,
        created_at
      FROM users 
      WHERE email = $1`,
      [email.toLowerCase().trim()]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json({ 
        error: 'Неверный email или пароль' 
      }, { status: 401 })
    }

    const user = userResult.rows[0]

    // Проверяем статус пользователя
    if (user.status !== 'active') {
      return NextResponse.json({ 
        error: 'Аккаунт заблокирован или неактивен' 
      }, { status: 401 })
    }

    // Проверяем пароль
    let passwordValid = false
    
    if (user.password_hash) {
      // Если есть хеш пароля, используем bcrypt
      passwordValid = await bcrypt.compare(password, user.password_hash)
    } else {
      // Для демо пользователей используем простые пароли
      const demoPasswords = {
        'admin@example.com': 'admin123',
        'user@example.com': 'demo123',
        'demo@example.com': 'demo123'
      }
      passwordValid = demoPasswords[email.toLowerCase()] === password
    }

    if (!passwordValid) {
      return NextResponse.json({ 
        error: 'Неверный email или пароль' 
      }, { status: 401 })
    }

    console.log('User authenticated successfully:', user.email)

    // Определяем роль пользователя
    const isAdmin = user.role_id === 1
    const role = isAdmin ? 'admin' : 'user'

    // Создаем JWT токен
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: role
      },
      process.env.NEXTAUTH_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    console.log('Login successful for:', user.email)

    return NextResponse.json({
      success: true,
      message: 'Авторизация прошла успешно',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        balance: parseFloat(user.balance || '0'),
        total_invested: parseFloat(user.total_invested || '0'),
        total_earned: parseFloat(user.total_earned || '0'),
        role: role,
        isAdmin: isAdmin,
        created_at: user.created_at
      },
      token
    }, { status: 200 })

  } catch (error) {
    console.error('Login error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: `Ошибка авторизации: ${error.message}` 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      error: 'Внутренняя ошибка сервера' 
    }, { status: 500 })
  }
}
