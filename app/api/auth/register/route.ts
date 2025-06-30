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

    if (!country) {
      return NextResponse.json(
        { error: 'Выбор страны обязателен' },
        { status: 400 }
      );
    }

    // Маппинг кодов стран на названия
    const countryNames: Record<string, string> = {
      'AF': 'Афганистан', 'AL': 'Албания', 'DZ': 'Алжир', 'AD': 'Андорра', 'AO': 'Ангола',
      'AG': 'Антигуа и Барбуда', 'AR': 'Аргентина', 'AM': 'Армения', 'AU': 'Австралия', 'AT': 'Австрия',
      'AZ': 'Азербайджан', 'BS': 'Багамы', 'BH': 'Бахрейн', 'BD': 'Бангладеш', 'BB': 'Барбадос',
      'BY': 'Беларусь', 'BE': 'Бельгия', 'BZ': 'Белиз', 'BJ': 'Бенин', 'BT': 'Бутан',
      'BO': 'Боливия', 'BA': 'Босния и Герцеговина', 'BW': 'Ботсвана', 'BR': 'Бразилия', 'BN': 'Бруней',
      'BG': 'Болгария', 'BF': 'Буркина-Фасо', 'BI': 'Бурунди', 'KH': 'Камбоджа', 'CM': 'Камерун',
      'CA': 'Канада', 'CV': 'Кабо-Верде', 'CF': 'ЦАР', 'TD': 'Чад', 'CL': 'Чили',
      'CN': 'Китай', 'CO': 'Колумбия', 'KM': 'Коморы', 'CG': 'Конго', 'CD': 'ДР Конго',
      'CR': 'Коста-Рика', 'CI': 'Кот-д\'Ивуар', 'HR': 'Хорватия', 'CU': 'Куба', 'CY': 'Кипр',
      'CZ': 'Чехия', 'DK': 'Дания', 'DJ': 'Джибути', 'DM': 'Доминика', 'DO': 'Доминиканская Республика',
      'EC': 'Эквадор', 'EG': 'Египет', 'SV': 'Сальвадор', 'GQ': 'Экваториальная Гвинея', 'ER': 'Эритрея',
      'EE': 'Эстония', 'SZ': 'Эсватини', 'ET': 'Эфиопия', 'FJ': 'Фиджи', 'FI': 'Финляндия',
      'FR': 'Франция', 'GA': 'Габон', 'GM': 'Гамбия', 'GE': 'Грузия', 'DE': 'Германия',
      'GH': 'Гана', 'GR': 'Греция', 'GD': 'Гренада', 'GT': 'Гватемала', 'GN': 'Гвинея',
      'GW': 'Гвинея-Бисау', 'GY': 'Гайана', 'HT': 'Гаити', 'HN': 'Гондурас', 'HU': 'Венгрия',
      'IS': 'Исландия', 'IN': 'Индия', 'ID': 'Индонезия', 'IR': 'Иран', 'IQ': 'Ирак',
      'IE': 'Ирландия', 'IL': 'Израиль', 'IT': 'Италия', 'JM': 'Ямайка', 'JP': 'Япония',
      'JO': 'Иордания', 'KZ': 'Казахстан', 'KE': 'Кения', 'KI': 'Кирибати', 'KP': 'КНДР',
      'KR': 'Южная Корея', 'KW': 'Кувейт', 'KG': 'Кыргызстан', 'LA': 'Лаос', 'LV': 'Латвия',
      'LB': 'Ливан', 'LS': 'Лесото', 'LR': 'Либерия', 'LY': 'Ливия', 'LI': 'Лихтенштейн',
      'LT': 'Литва', 'LU': 'Люксембург', 'MG': 'Мадагаскар', 'MW': 'Малави', 'MY': 'Малайзия',
      'MV': 'Мальдивы', 'ML': 'Мали', 'MT': 'Мальта', 'MH': 'Маршалловы Острова', 'MR': 'Мавритания',
      'MU': 'Маврикий', 'MX': 'Мексика', 'FM': 'Микронезия', 'MD': 'Молдова', 'MC': 'Монако',
      'MN': 'Монголия', 'ME': 'Черногория', 'MA': 'Марокко', 'MZ': 'Мозамбик', 'MM': 'Мьянма',
      'NA': 'Намибия', 'NR': 'Науру', 'NP': 'Непал', 'NL': 'Нидерланды', 'NZ': 'Новая Зеландия',
      'NI': 'Никарагуа', 'NE': 'Нигер', 'NG': 'Нигерия', 'MK': 'Северная Македония', 'NO': 'Норвегия',
      'OM': 'Оман', 'PK': 'Пакистан', 'PW': 'Палау', 'PA': 'Панама', 'PG': 'Папуа-Новая Гвинея',
      'PY': 'Парагвай', 'PE': 'Перу', 'PH': 'Филиппины', 'PL': 'Польша', 'PT': 'Португалия',
      'QA': 'Катар', 'RO': 'Румыния', 'RU': 'Россия', 'RW': 'Руанда', 'KN': 'Сент-Китс и Невис',
      'LC': 'Сент-Люсия', 'VC': 'Сент-Винсент и Гренадины', 'WS': 'Самоа', 'SM': 'Сан-Марино',
      'ST': 'Сан-Томе и Принсипи', 'SA': 'Саудовская Аравия', 'SN': 'Сенегал', 'RS': 'Сербия',
      'SC': 'Сейшелы', 'SL': 'Сьерра-Леоне', 'SG': 'Сингапур', 'SK': 'Словакия', 'SI': 'Словения',
      'SB': 'Соломоновы Острова', 'SO': 'Сомали', 'ZA': 'ЮАР', 'SS': 'Южный Судан', 'ES': 'Испания',
      'LK': 'Шри-Ланка', 'SD': 'Судан', 'SR': 'Суринам', 'SE': 'Швеция', 'CH': 'Швейцария',
      'SY': 'Сирия', 'TJ': 'Таджикистан', 'TZ': 'Танзания', 'TH': 'Таиланд', 'TL': 'Восточный Тимор',
      'TG': 'Того', 'TO': 'Тонга', 'TT': 'Тринидад и Тобаго', 'TN': 'Тунис', 'TR': 'Турция',
      'TM': 'Туркменистан', 'TV': 'Тувалу', 'UG': 'Уганда', 'UA': 'Украина', 'AE': 'ОАЭ',
      'GB': 'Великобритания', 'US': 'США', 'UY': 'Уругвай', 'UZ': 'Узбекистан', 'VU': 'Вануату',
      'VA': 'Ватикан', 'VE': 'Венесуэла', 'VN': 'Вьетнам', 'YE': 'Йемен', 'ZM': 'Замбия', 'ZW': 'Зимбабве'
    };

    const countryName = countryNames[country] || country;

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

    // Хешируем пароль
    const passwordHash = await bcrypt.hash(password, 12);

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
        country_name,
        referral_code,
        role_id,
        status,
        is_active,
        email_verified,
        balance,
        total_invested,
        total_earned
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 5, 'active', true, true, 0.00, 0.00, 0.00)
      RETURNING id, email, full_name, referral_code, country, country_name
    `, [email, fullName, passwordHash, phone || null, country, countryName, referralCode]);

    const user = newUser.rows[0];

    // Создаем JWT токен для автоматического входа
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
    console.error('Full error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      email,
      fullName,
      country
    });
    
    return NextResponse.json(
      { 
        error: 'Ошибка сервера при регистрации',
        details: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
}