
import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    console.log("Loading new users from database...")

    // Получаем последних 8 зарегистрированных пользователей для ленты активности
    const result = await query(`
      SELECT 
        u.id,
        u.full_name as name,
        u.email,
        u.created_at as joined_date,
        u.country,
        u.country_name
      FROM users u
      WHERE u.role_id = 2
      ORDER BY u.created_at DESC
      LIMIT 8
    `)

    // Маппинг кодов стран на флаги и названия
    const countryMap: Record<string, { flag: string; name: string }> = {
      'RU': { flag: '🇷🇺', name: 'Россия' },
      'US': { flag: '🇺🇸', name: 'США' },
      'GB': { flag: '🇬🇧', name: 'Великобритания' },
      'DE': { flag: '🇩🇪', name: 'Германия' },
      'FR': { flag: '🇫🇷', name: 'Франция' },
      'CN': { flag: '🇨🇳', name: 'Китай' },
      'JP': { flag: '🇯🇵', name: 'Япония' },
      'KR': { flag: '🇰🇷', name: 'Южная Корея' },
      'IN': { flag: '🇮🇳', name: 'Индия' },
      'BR': { flag: '🇧🇷', name: 'Бразилия' },
      'IT': { flag: '🇮🇹', name: 'Италия' },
      'ES': { flag: '🇪🇸', name: 'Испания' },
      'CA': { flag: '🇨🇦', name: 'Канада' },
      'AU': { flag: '🇦🇺', name: 'Австралия' },
      'MX': { flag: '🇲🇽', name: 'Мексика' },
      'AR': { flag: '🇦🇷', name: 'Аргентина' },
      'TR': { flag: '🇹🇷', name: 'Турция' },
      'UA': { flag: '🇺🇦', name: 'Украина' },
      'BY': { flag: '🇧🇾', name: 'Беларусь' },
      'KZ': { flag: '🇰🇿', name: 'Казахстан' }
    }

    const newUsers = result.rows.map(user => {
      const countryInfo = countryMap[user.country] || { flag: '🌍', name: user.country_name || user.country || 'Неизвестно' }
      return {
        id: user.id,
        name: user.name || 'Anonymous User',
        email: user.email,
        joinedDate: user.joined_date,
        country: user.country,
        countryFlag: countryInfo.flag,
        countryName: user.country_name || countryInfo.name
      }
    })

    console.log(`✅ Loaded ${newUsers.length} new users from database`)

    return NextResponse.json({
      success: true,
      data: newUsers
    })
  } catch (error) {
    console.error("Error loading new users:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to load new users"
    }, { status: 500 })
  }
}
