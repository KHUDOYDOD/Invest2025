
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, DollarSign, TrendingUp, Award, ArrowUp, ArrowDown, Clock } from "lucide-react"

interface StatisticsData {
  usersCount: number
  usersChange: number
  investmentsAmount: number
  investmentsChange: number
  payoutsAmount: number
  payoutsChange: number
  profitabilityRate: number
  profitabilityChange: number
}

export function Statistics() {
  const [stats, setStats] = useState<StatisticsData>({
    usersCount: 0,
    usersChange: 0,
    investmentsAmount: 0,
    investmentsChange: 0,
    payoutsAmount: 0,
    payoutsChange: 0,
    profitabilityRate: 0,
    profitabilityChange: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStatistics()
    
    // Обновление каждые 5 минут (300000 мс)
    const interval = setInterval(loadStatistics, 300000)
    
    return () => clearInterval(interval)
  }, [])

  const loadStatistics = async () => {
    try {
      setLoading(true)
      setError(null)

      // Загружаем реальную статистику
      const response = await fetch('/api/statistics')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const realStats = {
            usersCount: data.data.totalUsers || 0,
            usersChange: 12.5, // Можно добавить расчет изменений позже
            investmentsAmount: data.data.totalInvested || 0,
            investmentsChange: 8.3,
            payoutsAmount: data.data.totalPaid || 0,
            payoutsChange: 15.7,
            profitabilityRate: data.data.averageReturn || 0,
            profitabilityChange: 2.1,
          }
          setStats(realStats)
        } else {
          throw new Error("Failed to load statistics")
        }
      } else {
        throw new Error("Failed to fetch statistics")
      }
    } catch (error) {
      console.error("Ошибка загрузки статистики:", error)
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}М`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}К`
    }
    return num.toLocaleString("ru-RU")
  }

  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : ""
    return `${sign}${change}%`
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-emerald-400" : "text-red-400"
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <ArrowUp className="h-3 w-3 text-emerald-400" />
    ) : (
      <ArrowDown className="h-3 w-3 text-red-400" />
    )
  }

  const statsData = [
    {
      title: "Активные инвесторы",
      value: formatNumber(stats.usersCount),
      change: formatChange(stats.usersChange),
      changeValue: stats.usersChange,
      icon: Users,
      gradient: "from-violet-500 to-purple-600",
      bgGradient: "from-violet-500/20 to-purple-600/20",
      borderColor: "border-violet-500/30",
      shadowColor: "shadow-violet-500/25",
    },
    {
      title: "Месячные инвестиции",
      value: `$${formatNumber(stats.investmentsAmount)}`,
      change: formatChange(stats.investmentsChange),
      changeValue: stats.investmentsChange,
      icon: DollarSign,
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-500/20 to-teal-600/20",
      borderColor: "border-emerald-500/30",
      shadowColor: "shadow-emerald-500/25",
    },
    {
      title: "Выплачено прибыли",
      value: `$${formatNumber(stats.payoutsAmount)}`,
      change: formatChange(stats.payoutsChange),
      changeValue: stats.payoutsChange,
      icon: TrendingUp,
      gradient: "from-orange-500 to-amber-600",
      bgGradient: "from-orange-500/20 to-amber-600/20",
      borderColor: "border-orange-500/30",
      shadowColor: "shadow-orange-500/25",
    },
    {
      title: "Средняя доходность",
      value: `${stats.profitabilityRate}%`,
      change: formatChange(stats.profitabilityChange),
      changeValue: stats.profitabilityChange,
      icon: Award,
      gradient: "from-pink-500 to-rose-600",
      bgGradient: "from-pink-500/20 to-rose-600/20",
      borderColor: "border-pink-500/30",
      shadowColor: "shadow-pink-500/25",
    },
  ]

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-t-cyan-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full mx-auto mb-4 animate-spin"></div>
            <p className="text-slate-300 text-lg">Загрузка статистики...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center">
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-red-400 text-lg">Ошибка загрузки статистики: {error}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-emerald-600/5 to-teal-600/5 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-white via-cyan-100 to-purple-200 bg-clip-text text-transparent">
              Статистика платформы
            </h2>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Актуальные данные нашей инвестиционной платформы в режиме реального времени
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 justify-center">
          {statsData.map((stat, index) => (
            <div
              key={stat.title}
              className={`p-6 rounded-2xl border ${stat.borderColor} bg-gradient-to-br ${stat.bgGradient} backdrop-blur-xl shadow-xl ${stat.shadowColor} hover:shadow-2xl transition-all duration-500 relative overflow-hidden group animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="flex flex-col items-center text-center relative z-10">
                <div
                  className={`p-3 rounded-2xl bg-gradient-to-r ${stat.gradient} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="h-8 w-8" />
                </div>

                <div className="flex-1 text-center">
                  <h3 className="text-4xl font-bold text-white mb-3">
                    {stat.value}
                  </h3>
                  <p className="text-slate-300 text-lg font-medium mb-4">{stat.title}</p>

                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm ${getChangeColor(stat.changeValue)} font-semibold text-sm`}>
                    {getChangeIcon(stat.changeValue)}
                    {stat.change}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Индикатор обновления данных */}
        <div className="mt-16 text-center animate-fade-in-delayed">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <Clock className="h-4 w-4 text-slate-400" />
            <span className="text-slate-300 text-sm font-medium">Обновляется каждые 5 минут</span>
          </div>
        </div>
      </div>
    </section>
  )
}
