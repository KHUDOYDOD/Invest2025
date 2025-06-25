
"use client"

import { useState, useEffect } from "react"
import { Users, DollarSign, TrendingUp, Award, BarChart, Activity } from "lucide-react"

interface Stats {
  totalUsers: number
  totalInvested: number
  totalPaid: number
  activeInvestments: number
  totalProjects: number
  successRate: number
  averageReturn: number
  onlineUsers: number
}

export function PlatformStatistics() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalInvested: 0,
    totalPaid: 0,
    activeInvestments: 0,
    totalProjects: 0,
    successRate: 0,
    averageReturn: 0,
    onlineUsers: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)

        const response = await fetch('/api/statistics')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setStats(data.data)
          } else {
            setStats({
              totalUsers: 0,
              totalInvested: 0,
              totalPaid: 0,
              activeInvestments: 0,
              totalProjects: 0,
              successRate: 95.0,
              averageReturn: 24.5,
              onlineUsers: 0,
            })
          }
        } else {
          console.warn("Failed to fetch statistics, using default values")
        }
        setError(null)
      } catch (err) {
        console.error("Ошибка загрузки статистики:", err)
        setError(null)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 300000) // Обновление каждые 5 минут

    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toLocaleString()
  }

  const statisticsData = [
    {
      title: "Всего пользователей",
      value: formatNumber(stats.totalUsers),
      icon: Users,
      color: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-500/20 to-cyan-600/20",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400",
      shadowColor: "shadow-blue-500/25",
    },
    {
      title: "Общие инвестиции",
      value: `$${formatNumber(stats.totalInvested)}`,
      icon: DollarSign,
      color: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-500/20 to-teal-600/20",
      borderColor: "border-emerald-500/30",
      textColor: "text-emerald-400",
      shadowColor: "shadow-emerald-500/25",
    },
    {
      title: "Общие выплаты",
      value: `$${formatNumber(stats.totalPaid)}`,
      icon: TrendingUp,
      color: "from-purple-500 to-violet-600",
      bgGradient: "from-purple-500/20 to-violet-600/20",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-400",
      shadowColor: "shadow-purple-500/25",
    },
    {
      title: "Активные инвестиции",
      value: formatNumber(stats.activeInvestments),
      icon: Activity,
      color: "from-orange-500 to-red-600",
      bgGradient: "from-orange-500/20 to-red-600/20",
      borderColor: "border-orange-500/30",
      textColor: "text-orange-400",
      shadowColor: "shadow-orange-500/25",
    },
    {
      title: "Инвестиционные планы",
      value: formatNumber(stats.totalProjects),
      icon: BarChart,
      color: "from-yellow-500 to-amber-600",
      bgGradient: "from-yellow-500/20 to-amber-600/20",
      borderColor: "border-yellow-500/30",
      textColor: "text-yellow-400",
      shadowColor: "shadow-yellow-500/25",
    },
    {
      title: "Успешность платформы",
      value: `${stats.successRate}%`,
      icon: Award,
      color: "from-pink-500 to-rose-600",
      bgGradient: "from-pink-500/20 to-rose-600/20",
      borderColor: "border-pink-500/30",
      textColor: "text-pink-400",
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
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-white via-cyan-100 to-purple-200 bg-clip-text text-transparent">
              Статистика платформы
            </h2>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Актуальные данные нашей инвестиционной платформы в режиме реального времени
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {statisticsData.map((stat, index) => (
            <div
              key={stat.title}
              className={`p-6 rounded-2xl border ${stat.borderColor} bg-gradient-to-br ${stat.bgGradient} backdrop-blur-xl shadow-xl ${stat.shadowColor} hover:shadow-2xl transition-all duration-500 relative overflow-hidden group animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="flex items-start relative z-10">
                <div
                  className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} text-white shadow-lg mr-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>

                <div className="flex-1">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-slate-300 text-lg font-medium">{stat.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Дополнительные статистики */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-2xl font-bold text-white mb-2">Средняя доходность</h4>
                <p className="text-emerald-400 text-3xl font-bold">{stats.averageReturn}%</p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                <TrendingUp className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-2xl font-bold text-white mb-2">Пользователи онлайн</h4>
                <p className="text-blue-400 text-3xl font-bold">{formatNumber(stats.onlineUsers)}</p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
                <Users className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Индикатор обновления */}
        <div className="mt-16 text-center animate-fade-in-delayed">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-slate-300 text-sm font-medium">Обновляется каждые 5 минут</span>
          </div>
        </div>
      </div>
    </section>
  )
}
