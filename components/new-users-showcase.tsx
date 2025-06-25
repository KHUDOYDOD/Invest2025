
"use client"

import { useState, useEffect } from "react"
import { Users, Clock, Globe, MapPin, Zap } from "lucide-react"

interface NewUser {
  id: string
  name: string
  email: string
  joinedDate: string
  country?: string
}

const countryFlags: Record<string, string> = {
  'RU': '🇷🇺',
  'US': '🇺🇸', 
  'GB': '🇬🇧',
  'DE': '🇩🇪',
  'FR': '🇫🇷',
  'IT': '🇮🇹',
  'ES': '🇪🇸',
  'CA': '🇨🇦',
  'AU': '🇦🇺',
  'JP': '🇯🇵',
  'KR': '🇰🇷',
  'CN': '🇨🇳',
  'IN': '🇮🇳',
  'BR': '🇧🇷',
  'MX': '🇲🇽',
  'UA': '🇺🇦',
  'PL': '🇵🇱',
  'NL': '🇳🇱',
  'SE': '🇸🇪',
  'NO': '🇳🇴',
  'TR': '🇹🇷',
  'AR': '🇦🇷',
  'CL': '🇨🇱',
  'CO': '🇨🇴',
  'VE': '🇻🇪',
  'PT': '🇵🇹',
  'GR': '🇬🇷',
  'FI': '🇫🇮',
  'DK': '🇩🇰',
  'AT': '🇦🇹'
}

const countryNames: Record<string, string> = {
  'RU': 'Россия',
  'US': 'США',
  'GB': 'Великобритания',
  'DE': 'Германия',
  'FR': 'Франция',
  'IT': 'Италия',
  'ES': 'Испания',
  'CA': 'Канада',
  'AU': 'Австралия',
  'JP': 'Япония',
  'KR': 'Южная Корея',
  'CN': 'Китай',
  'IN': 'Индия',
  'BR': 'Бразилия',
  'MX': 'Мексика',
  'UA': 'Украина',
  'PL': 'Польша',
  'NL': 'Нидерланды',
  'SE': 'Швеция',
  'NO': 'Норвегия',
  'TR': 'Турция',
  'AR': 'Аргентина',
  'CL': 'Чили',
  'CO': 'Колумбия',
  'VE': 'Венесуэла',
  'PT': 'Португалия',
  'GR': 'Греция',
  'FI': 'Финляндия',
  'DK': 'Дания',
  'AT': 'Австрия'
}

const getRandomCountry = () => {
  const countries = Object.keys(countryFlags)
  return countries[Math.floor(Math.random() * countries.length)]
}

export function NewUsersShowcase() {
  const [newUsers, setNewUsers] = useState<NewUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNewUsers = async () => {
      try {
        setLoading(true)

        const response = await fetch('/api/new-users')
        if (response.ok) {
          const data = await response.json()
          if (data.success && Array.isArray(data.data)) {
            // Добавляем случайные страны для демонстрации
            const usersWithCountries = data.data.map((user: any) => ({
              ...user,
              country: getRandomCountry()
            }))
            setNewUsers(usersWithCountries)
          } else {
            setNewUsers([])
          }
        } else {
          setNewUsers([])
        }
      } catch (err) {
        console.error("Ошибка загрузки новых пользователей:", err)
        setNewUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchNewUsers()
    // Обновляем каждые 30 секунд
    const interval = setInterval(fetchNewUsers, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return "только что"
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} ${minutes === 1 ? "минуту" : minutes < 5 ? "минуты" : "минут"} назад`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} ${hours === 1 ? "час" : hours < 5 ? "часа" : "часов"} назад`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} ${days === 1 ? "день" : days < 5 ? "дня" : "дней"} назад`
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const generateNickname = (name: string, email: string) => {
    // Генерируем ник из имени или email
    if (name && name !== 'Anonymous User') {
      const nameParts = name.split(' ')
      if (nameParts.length > 1) {
        return nameParts[0] + nameParts[1].charAt(0)
      }
      return nameParts[0]
    }
    
    // Используем часть email до @
    const emailPart = email.split('@')[0]
    return emailPart.charAt(0).toUpperCase() + emailPart.slice(1, 8)
  }

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-t-emerald-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full mx-auto mb-4 animate-spin"></div>
            <p className="text-slate-300 text-lg">Загрузка новых участников...</p>
          </div>
        </div>
      </section>
    )
  }

  if (newUsers.length === 0) {
    return null
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-white via-emerald-100 to-blue-200 bg-clip-text text-transparent">
              Новые участники
            </h2>
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-1000"></div>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Последние зарегистрированные пользователи со всего мира
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {newUsers.map((user, index) => {
            const nickname = generateNickname(user.name, user.email)
            const countryFlag = user.country ? countryFlags[user.country] || '🌍' : '🌍'
            const countryName = user.country ? countryNames[user.country] || 'Неизвестно' : 'Неизвестно'
            
            return (
              <div
                key={user.id}
                className="p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 to-blue-600/20 backdrop-blur-xl shadow-xl shadow-emerald-500/25 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="flex items-start relative z-10">
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-5 w-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-white text-lg font-semibold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                        {nickname}
                      </span>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                        <span className="text-2xl" title={countryName}>
                          {countryFlag}
                        </span>
                        <span className="text-slate-300 text-sm font-medium">
                          {countryName}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-slate-300 text-sm mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-400" />
                      Зарегистрировался на платформе
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <p className="text-slate-400 text-sm font-medium">
                          {formatTimeAgo(user.joinedDate)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-emerald-400 text-xs font-medium">НОВЫЙ</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Дополнительная информация */}
                <div className="mt-4 pt-4 border-t border-white/10 relative z-10">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Globe className="h-4 w-4" />
                      <span>ID: {user.id.slice(0, 8)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Zap className="h-4 w-4 text-blue-400" />
                      <span className="text-blue-400">Активен</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Статистика и индикатор */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-delayed">
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
            <div className="text-3xl font-bold text-emerald-400 mb-2">{newUsers.length}</div>
            <div className="text-slate-300 text-sm">Новых участников</div>
          </div>
          
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {new Set(newUsers.map(u => u.country)).size}
            </div>
            <div className="text-slate-300 text-sm">Стран представлено</div>
          </div>
          
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 text-sm font-medium">ОНЛАЙН</span>
            </div>
            <div className="text-slate-300 text-sm">Обновляется каждые 30 сек</div>
          </div>
        </div>
      </div>
    </section>
  )
}
