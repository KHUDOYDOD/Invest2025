
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, DollarSign, TrendingUp, Activity } from "lucide-react"

interface NewUser {
  id: string
  name: string
  email: string
  joinedDate: string
  balance: number
  totalInvested: number
  transactionCount: number
  investmentCount: number
}

export function NewUsersShowcase() {
  const [newUsers, setNewUsers] = useState<NewUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNewUsers = async () => {
      try {
        setLoading(true)

        const response = await fetch('/api/new-users')
        if (response.ok) {
          const data = await response.json()
          if (data.success && Array.isArray(data.data)) {
            setNewUsers(data.data)
          } else {
            setNewUsers([])
          }
        } else {
          console.warn("Failed to fetch new users, showing empty list")
          setNewUsers([])
        }
        setError(null)
      } catch (err) {
        console.error("Ошибка загрузки новых пользователей:", err)
        setError(null)
        setNewUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchNewUsers()
    // Обновляем каждые 60 секунд
    const interval = setInterval(fetchNewUsers, 60000)
    return () => clearInterval(interval)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return "Только что"
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "час" : diffInHours < 5 ? "часа" : "часов"} назад`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} ${diffInDays === 1 ? "день" : diffInDays < 5 ? "дня" : "дней"} назад`
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

  const getUserLevel = (totalInvested: number, transactionCount: number) => {
    if (totalInvested >= 10000 || transactionCount >= 20) {
      return { label: "Премиум", color: "bg-gradient-to-r from-yellow-500 to-yellow-600" }
    } else if (totalInvested >= 1000 || transactionCount >= 5) {
      return { label: "Активный", color: "bg-gradient-to-r from-blue-500 to-blue-600" }
    } else {
      return { label: "Новичок", color: "bg-gradient-to-r from-green-500 to-green-600" }
    }
  }

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-t-purple-500 border-r-transparent border-b-pink-500 border-l-transparent rounded-full animate-spin"></div>
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
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6">
            <Users className="h-8 w-8 text-purple-400" />
            <h2 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-200 bg-clip-text text-transparent">
              Новые участники
            </h2>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse delay-500"></div>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Познакомьтесь с нашими последними участниками и их достижениями
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {newUsers.map((user, index) => {
            const userLevel = getUserLevel(user.totalInvested, user.transactionCount)
            
            return (
              <Card
                key={user.id}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-purple-500/50 transition-all duration-500 group animate-slide-up overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 relative">
                  {/* Gradient overlay на hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10 space-y-4">
                    {/* Аватар и имя */}
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="w-16 h-16 mb-3 ring-2 ring-purple-500/30 group-hover:ring-purple-500/60 transition-all duration-300">
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <h3 className="font-semibold text-white text-lg mb-1 group-hover:text-purple-300 transition-colors">
                        {user.name}
                      </h3>
                      
                      <Badge className={`${userLevel.color} text-white text-xs px-2 py-1 mb-2`}>
                        {userLevel.label}
                      </Badge>
                      
                      <div className="flex items-center text-slate-400 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(user.joinedDate)}
                      </div>
                    </div>

                    {/* Статистика */}
                    <div className="space-y-3 pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-slate-300 text-sm">
                          <DollarSign className="h-4 w-4 mr-1 text-green-400" />
                          <span>Баланс</span>
                        </div>
                        <span className="text-green-400 font-semibold text-sm">
                          ${user.balance.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-slate-300 text-sm">
                          <TrendingUp className="h-4 w-4 mr-1 text-blue-400" />
                          <span>Инвестировано</span>
                        </div>
                        <span className="text-blue-400 font-semibold text-sm">
                          ${user.totalInvested.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-slate-300 text-sm">
                          <Activity className="h-4 w-4 mr-1 text-purple-400" />
                          <span>Операции</span>
                        </div>
                        <span className="text-purple-400 font-semibold text-sm">
                          {user.transactionCount}
                        </span>
                      </div>
                    </div>

                    {/* Индикатор активности */}
                    <div className="flex justify-center pt-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-xs font-medium">Активен</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Информация в подвале */}
        <div className="mt-12 text-center animate-fade-in-delayed">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
            <Users className="h-4 w-4 text-slate-400" />
            <span className="text-slate-300 text-sm font-medium">
              Показаны последние {newUsers.length} новых участников
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
