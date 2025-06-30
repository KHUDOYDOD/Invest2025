import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { email, fullName, password, phone, country } = await request.json();

    if (!email || !fullName || !password) {
      return NextResponse.json(
        { error: 'Email, полное имя и пароль обязательны' },
        { status: 400 }
      );
    }

    // Проверяем, существует ли уже пользователь по email
    const existingUser = await query(`
      SELECT id, email FROM users WHERE email = $1
    `, [email]);

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Пользователь с таким email уже существует',
          field: 'email'
        },
        { status: 400 }
      );
    }

    // Проверяем длину пароля
    if (password.length < 6) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Пароль должен содержать минимум 6 символов',
          field: 'password'
        },
        { status: 400 }
      );
    }

    // Хешируем пароль
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Генерируем реферальный код
    const referralCode = `REF${Date.now()}`;

    // Создаем пользователя
    const newUser = await query(`
      INSERT INTO users (
        email, full_name, password_hash, phone, country, country_name,
        referral_code, role_id, is_active, is_verified, email_verified,
        balance, total_invested, total_earned,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, 2, true, false, false, 0, 0, 0, NOW(), NOW()
      ) RETURNING id, email, full_name
    `, [email, fullName, passwordHash, phone || null, country, country, referralCode]);

    const user = newUser.rows[0];

    // Создаем JWT токен
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: 'user'
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    const response = NextResponse.json({
      success: true,
      message: 'Регистрация прошла успешно',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: 'user',
        isAdmin: false
      },
      token: token,
      redirect: '/dashboard'
    });

    // Устанавливаем cookie с токеном
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('Registration error:', error);

    // Детальная обработка ошибок базы данных
    if (error.code === '23505') { // Нарушение уникальности
      return NextResponse.json(
        { 
          success: false,
          error: 'Пользователь с таким email уже существует',
          field: 'email'
        },
        { status: 400 }
      );
    }

    if (error.code === '42703') { // Столбец не существует
      return NextResponse.json(
        { 
          success: false,
          error: 'Ошибка структуры базы данных. Обратитесь к администратору.',
          details: 'Database column missing'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Произошла ошибка сервера при регистрации',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}