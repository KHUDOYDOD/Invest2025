import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email/логин и пароль обязательны' },
        { status: 400 }
      );
    }

    // Ищем пользователя в базе данных по email или логину
    const userResult = await query(`
      SELECT 
        u.id,
        u.email,
        u.full_name,
        u.password_hash,
        u.role_id,
        u.status,
        ur.name as role_name
      FROM users u
      LEFT JOIN user_roles ur ON u.role_id = ur.id
      WHERE (u.email = $1 OR u.full_name = $1) AND u.is_active = true
    `, [email]);

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Неверный email/логин или пароль' },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];

    // Проверяем статус пользователя
    if (user.status !== 'active') {
      return NextResponse.json(
        { error: 'Аккаунт заблокирован' },
        { status: 401 }
      );
    }

    // Проверяем пароль с использованием bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Неверный email/логин или пароль' },
        { status: 401 }
      );
    }

    // Обновляем время последнего входа
    await query(`
      UPDATE users 
      SET last_login = NOW(), updated_at = NOW()
      WHERE id = $1
    `, [user.id]);

    // Создаем JWT токен
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role_name || 'user'
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    // Определяем URL для редиректа
    const redirectUrl = user.role_id <= 2 ? '/admin/dashboard' : '/dashboard';

    const response = NextResponse.json({
      success: true,
      message: 'Вход выполнен успешно',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role_name || 'user',
        isAdmin: user.role_id <= 2
      },
      token: token,
      redirect: redirectUrl
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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при входе' },
      { status: 500 }
    );
  }
}