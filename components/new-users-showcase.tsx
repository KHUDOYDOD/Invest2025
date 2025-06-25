
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Clock, Globe } from "lucide-react"

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
  'NO': '🇳🇴'
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
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) {
      return "только что"
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} мин назад`
    } else {
      const diffInHours = Math.floor(diffInMinutes / 60)
      if (diffInHours < 24) {
        return `${diffInHours} ${diffInHours === 1 ? "час" : diffInHours < 5 ? "часа" : "часов"} назад`
      } else {
        const diffInDays = Math.floor(diffInHours / 24)
        return `${diffInDays} ${diffInDays === 1 ? "день" : diffInDays < 5 ? "дня" : "дней"} назад`
      }
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
      <section className="py-16 px-4 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
            <CardContent className="p-8">
              <div className="flex justify-center items-center">
                <div className="w-8 h-8 border-2 border-t-purple-500 border-r-transparent border-b-pink-500 border-l-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-slate-300">Загрузка новых участников...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  if (newUsers.length === 0) {
    return null
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-purple-500/30 transition-all duration-500">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-purple-400" />
                <div>
                  <CardTitle className="text-xl text-white">Новые участники</CardTitle>
                  <CardDescription className="text-slate-400">
                    Последние зарегистрированные пользователи
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Онлайн</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-4">
              {newUsers.map((user, index) => {
                const nickname = generateNickname(user.name, user.email)
                const countryFlag = user.country ? countryFlags[user.country] || '🌍' : '🌍'
                
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-purple-500/30 group animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10 ring-2 ring-purple-500/30 group-hover:ring-purple-500/60 transition-all duration-300">
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-sm">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-white font-medium group-hover:text-purple-300 transition-colors">
                          {nickname}
                        </span>
                        <span className="text-2xl" title={user.country || 'Unknown'}>
                          {countryFlag}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">
                          {formatTimeAgo(user.joinedDate)}
                        </span>
                      </div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Подвал с информацией */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>Показано {newUsers.length} новых участников</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Обновляется автоматически</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
