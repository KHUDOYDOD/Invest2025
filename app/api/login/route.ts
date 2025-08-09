import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email и пароль обязательны' 
      }, { status: 400 })
    }

    console.log('Attempting login for:', email)

    // Поиск пользователя по email или full_name
    const userResult = await query(
      'SELECT id, full_name, email, password_hash, role, balance FROM users WHERE email = $1 OR full_name = $1',
      [email]
    )

    if (userResult.rows.length === 0) {
      console.log('User not found:', email)
      return NextResponse.json({ 
        success: false, 
        error: 'Неверные учетные данные' 
      }, { status: 401 })
    }

    const user = userResult.rows[0]
    console.log('Found user:', user.email, 'Role:', user.role)

    // Проверка пароля
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      console.log('Invalid password for user:', email)
      return NextResponse.json({ 
        success: false, 
        error: 'Неверные учетные данные' 
      }, { status: 401 })
    }

    // Создание JWT токена
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    )

    console.log('✅ Successful login for:', user.email)

    return NextResponse.json({
      success: true,
      message: 'Успешная авторизация',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        balance: user.balance
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Ошибка сервера' 
    }, { status: 500 })
  }
}