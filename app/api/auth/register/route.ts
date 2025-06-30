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

    // Проверяем, существует ли уже пользователь
    const existingUser = await query(`
      SELECT id FROM users WHERE email = $1 OR full_name = $1
    `, [email]);

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
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
        email, full_name, password_hash, phone, country, 
        referral_code, role_id, is_active, is_verified,
        balance, total_invested, total_earned,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, 2, true, false, 0, 0, 0, NOW(), NOW()
      ) RETURNING id, email, full_name
    `, [email, fullName, passwordHash, phone, country, referralCode]);

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
    return NextResponse.json(
      { error: 'Ошибка сервера при регистрации' },
      { status: 500 }
    );
  }
}