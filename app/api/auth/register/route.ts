
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { email, password, full_name } = await request.json()

    console.log('Registration attempt:', { email, full_name })

    // Валидация входных данных
    if (!email || !password || !full_name) {
      return NextResponse.json({ 
        error: 'Email, пароль и полное имя обязательны' 
      }, { status: 400 })
    }

    // Проверка длины пароля
    if (password.length < 3) {
      return NextResponse.json({ 
        error: 'Пароль должен содержать минимум 3 символа' 
      }, { status: 400 })
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'Некорректный формат email' 
      }, { status: 400 })
    }

    // Проверяем, существует ли пользователь с таким email
    const existingUserResult = await query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    )

    if (existingUserResult.rows.length > 0) {
      return NextResponse.json({ 
        error: 'Пользователь с таким email уже существует' 
      }, { status: 400 })
    }

    // Хешируем пароль
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Генерируем реферальный код
    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase()

    console.log('Creating new user with:', { email, full_name, referralCode })

    // Создаем нового пользователя
    const createUserResult = await query(
      `INSERT INTO users (
        email, 
        full_name, 
        password_hash, 
        referral_code, 
        role_id, 
        status, 
        balance, 
        total_invested, 
        total_earned,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING id, email, full_name, balance, created_at`,
      [
        email.toLowerCase().trim(), 
        full_name.trim(), 
        passwordHash, 
        referralCode, 
        2, // role_id: 2 = user
        'active', 
        0.00, 
        0.00, 
        0.00
      ]
    )

    if (createUserResult.rows.length === 0) {
      throw new Error('Не удалось создать пользователя')
    }

    const newUser = createUserResult.rows[0]

    console.log('User created successfully:', newUser.id)

    // Создаем JWT токен
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email,
        role: 'user'
      },
      process.env.NEXTAUTH_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    console.log('Registration successful for:', newUser.email)

    return NextResponse.json({
      success: true,
      message: 'Регистрация прошла успешно',
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        balance: parseFloat(newUser.balance || '0'),
        total_invested: 0,
        total_earned: 0,
        role: 'user',
        isAdmin: false,
        created_at: newUser.created_at
      },
      token
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: `Ошибка регистрации: ${error.message}` 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      error: 'Внутренняя ошибка сервера' 
    }, { status: 500 })
  }
}
