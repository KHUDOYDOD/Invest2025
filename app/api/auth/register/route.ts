import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/database';

function generateReferralCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, phone, country } = await request.json();

    // Валидация данных
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, пароль и полное имя обязательны' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Пароль должен содержать минимум 6 символов' },
        { status: 400 }
      );
    }

    // Проверяем, не существует ли уже пользователь с таким email
    const existingUser = await query(`
      SELECT id FROM users WHERE email = $1
    `, [email]);

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 409 }
      );
    }

    // Сохраняем пароль без хеширования (только для разработки!)
    const passwordHash = password;

    // Генерируем уникальный реферальный код
    let referralCode;
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      referralCode = generateReferralCode();
      const codeCheck = await query(`
        SELECT id FROM users WHERE referral_code = $1
      `, [referralCode]);

      if (codeCheck.rows.length === 0) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return NextResponse.json(
        { error: 'Не удалось создать уникальный реферальный код' },
        { status: 500 }
      );
    }

    // Создаем нового пользователя
    const newUser = await query(`
      INSERT INTO users (
        email, 
        full_name, 
        password_hash, 
        phone, 
        country, 
        referral_code,
        role_id,
        status,
        is_active,
        email_verified
      ) VALUES ($1, $2, $3, $4, $5, $6, 2, 'active', true, true)
      RETURNING id, email, full_name, referral_code
    `, [email, fullName, passwordHash, phone || null, country || null, referralCode]);

    const user = newUser.rows[0];

    // Создаем JWT токен для автоматического входа
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: 'user'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const response = NextResponse.json({
      success: true,
      message: 'Регистрация успешно завершена',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        referralCode: user.referral_code,
        role: 'user',
        balance: 0.00
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