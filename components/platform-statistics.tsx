
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, DollarSign, TrendingUp, Award, Activity, Database } from "lucide-react"
import { motion } from "framer-motion"

interface PlatformStats {
  totalUsers: number
  totalInvested: number
  totalPaid: number
  activeInvestments: number
  totalProjects: number
  averageReturn: number
}

export function PlatformStatistics() {
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalInvested: 0,
    totalPaid: 0,
    activeInvestments: 0,
    totalProjects: 0,
    averageReturn: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/statistics')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setStats({
              totalUsers: data.data.totalUsers || 0,
              totalInvested: data.data.totalInvested || 0,
              totalPaid: data.data.totalPaid || 0,
              activeInvestments: data.data.activeInvestments || 0,
              totalProjects: data.data.totalProjects || 0,
              averageReturn: data.data.averageReturn || 0,
            })
          }
        } else {
          console.warn("Failed to fetch platform statistics")
        }
      } catch (err) {
        console.error("Error loading platform statistics:", err)
        setError(null)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 300000) // Обновление каждые 5 минут (300 секунд)

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

  const statsData = [
    {
      title: "Общее количество пользователей",
      value: formatNumber(stats.totalUsers),
      icon: Users,
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-500/20 to-cyan-600/20",
      borderColor: "border-blue-500/30",
      shadowColor: "shadow-blue-500/25",
    },
    {
      title: "Общие инвестиции",
      value: `$${formatNumber(stats.totalInvested)}`,
      icon: DollarSign,
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-500/20 to-emerald-600/20",
      borderColor: "border-green-500/30",
      shadowColor: "shadow-green-500/25",
    },
    {
      title: "Общие выплаты",
      value: `$${formatNumber(stats.totalPaid)}`,
      icon: TrendingUp,
      gradient: "from-purple-500 to-violet-600",
      bgGradient: "from-purple-500/20 to-violet-600/20",
      borderColor: "border-purple-500/30",
      shadowColor: "shadow-purple-500/25",
    },
    {
      title: "Активные инвестиции",
      value: formatNumber(stats.activeInvestments),
      icon: Activity,
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-500/20 to-red-600/20",
      borderColor: "border-orange-500/30",
      shadowColor: "shadow-orange-500/25",
    },
    {
      title: "Всего проектов",
      value: formatNumber(stats.totalProjects),
      icon: Database,
      gradient: "from-pink-500 to-rose-600",
      bgGradient: "from-pink-500/20 to-rose-600/20",
      borderColor: "border-pink-500/30",
      shadowColor: "shadow-pink-500/25",
    },
    {
      title: "Средняя доходность",
      value: `${stats.averageReturn.toFixed(1)}%`,
      icon: Award,
      gradient: "from-yellow-500 to-amber-600",
      bgGradient: "from-yellow-500/20 to-amber-600/20",
      borderColor: "border-yellow-500/30",
      shadowColor: "shadow-yellow-500/25",
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
            <p className="text-slate-300 text-lg">Загрузка статистики платформы...</p>
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
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
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
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-2xl border ${stat.borderColor} bg-gradient-to-br ${stat.bgGradient} backdrop-blur-xl shadow-xl ${stat.shadowColor} hover:shadow-2xl transition-all duration-500 relative overflow-hidden group animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="flex items-start relative z-10">
                <div
                  className={`p-3 rounded-2xl bg-gradient-to-r ${stat.gradient} text-white shadow-lg mr-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {loading ? (
                      <div className="animate-pulse bg-slate-800 h-8 w-16 rounded"></div>
                    ) : (
                      stat.value
                    )}
                  </h3>
                  <p className="text-slate-300 text-sm font-medium">{stat.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Индикатор обновления */}
        <div className="mt-16 text-center animate-fade-in-delayed">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-slate-300 text-sm font-medium">Обновляется каждые 5 минут</span>
          </div>
        </div>
      </div>
    </section>
  )
}
