
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log('Login attempt for:', email)

    // Валидация входных данных
    if (!email || !password) {
      return NextResponse.json({ 
        success: false,
        error: 'Email и пароль обязательны' 
      }, { status: 400 })
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        success: false,
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

    console.log('Database query result:', userResult.rows.length)

    if (userResult.rows.length === 0) {
      console.log('User not found:', email)
      return NextResponse.json({ 
        success: false,
        error: 'Неверный email или пароль' 
      }, { status: 401 })
    }

    const user = userResult.rows[0]
    console.log('User found:', user.email, 'Status:', user.status)

    // Проверяем статус пользователя
    if (user.status !== 'active') {
      console.log('User account is not active:', user.status)
      return NextResponse.json({ 
        success: false,
        error: 'Аккаунт заблокирован или неактивен' 
      }, { status: 401 })
    }

    // Проверяем пароль
    let passwordValid = false
    
    try {
      if (user.password_hash) {
        // Если есть хеш пароля, используем bcrypt
        passwordValid = await bcrypt.compare(password, user.password_hash)
        console.log('Password check with bcrypt:', passwordValid)
      } else {
        // Для демо пользователей используем простые пароли
        const demoPasswords = {
          'admin@example.com': 'admin123',
          'user@example.com': 'demo123',
          'demo@example.com': 'demo123'
        }
        passwordValid = demoPasswords[email.toLowerCase()] === password
        console.log('Password check with demo passwords:', passwordValid)
      }
    } catch (error) {
      console.error('Password validation error:', error)
      passwordValid = false
    }

    if (!passwordValid) {
      console.log('Invalid password for user:', email)
      return NextResponse.json({ 
        success: false,
        error: 'Неверный email или пароль' 
      }, { status: 401 })
    }

    console.log('Password validation successful for:', user.email)

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

    console.log('Login successful for:', user.email, 'Role:', role)

    // Создаем ответ с токеном в куках
    const response = NextResponse.json({
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
      token,
      redirect: isAdmin ? '/admin/dashboard' : '/dashboard'
    }, { status: 200 })

    // Устанавливаем токен в куки
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 дней
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    
    return NextResponse.json({ 
      success: false,
      error: 'Внутренняя ошибка сервера. Попробуйте позже.' 
    }, { status: 500 })
  }
}
