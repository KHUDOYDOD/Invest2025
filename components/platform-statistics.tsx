
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Award,
  Activity,
  Globe,
  BarChart3,
  Zap
} from "lucide-react"

interface PlatformStats {
  totalUsers: number
  totalInvested: number
  totalPaid: number
  activeInvestments: number
  totalProjects: number
  averageReturn: number
  onlineUsers: number
  successRate: number
}

export function PlatformStatistics() {
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalInvested: 0,
    totalPaid: 0,
    activeInvestments: 0,
    totalProjects: 0,
    averageReturn: 0,
    onlineUsers: 0,
    successRate: 0,
  })
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const fetchStats = async () => {
    try {
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
            onlineUsers: data.data.onlineUsers || 0,
            successRate: data.data.successRate || 0,
          })
          setLastUpdate(new Date())
        }
      }
    } catch (err) {
      console.error("Error loading platform statistics:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    // Обновление каждые 5 минут (300000 мс)
    const interval = setInterval(fetchStats, 300000)
    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toLocaleString()
  }

  const statsData = [
    {
      title: "Всего пользователей",
      value: formatNumber(stats.totalUsers),
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      change: "+12.5%"
    },
    {
      title: "Общие инвестиции",
      value: `$${formatNumber(stats.totalInvested)}`,
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      change: "+8.3%"
    },
    {
      title: "Выплачено прибыли",
      value: `$${formatNumber(stats.totalPaid)}`,
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      change: "+15.7%"
    },
    {
      title: "Активные инвестиции",
      value: formatNumber(stats.activeInvestments),
      icon: Activity,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      change: "+5.2%"
    },
    {
      title: "Успешных проектов",
      value: formatNumber(stats.totalProjects),
      icon: Award,
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-500/10",
      change: "+3.1%"
    },
    {
      title: "Средняя доходность",
      value: `${stats.averageReturn}%`,
      icon: BarChart3,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-500/10",
      change: "+2.4%"
    },
    {
      title: "Онлайн сейчас",
      value: formatNumber(stats.onlineUsers),
      icon: Globe,
      color: "from-cyan-500 to-blue-500",
      bgColor: "bg-cyan-500/10",
      change: "Live"
    },
    {
      title: "Успешность",
      value: `${stats.successRate}%`,
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/10",
      change: "+0.8%"
    }
  ]

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-emerald-400 mb-4">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <p className="text-slate-300 text-lg">Загрузка статистики платформы...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-100 to-purple-200 bg-clip-text text-transparent">
              Статистика платформы
            </h2>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-500"></div>
          </div>
          <p className="text-slate-400 text-lg mb-4">
            Данные обновляются в реальном времени каждые 5 минут
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Activity className="w-4 h-4" />
            <span>Последнее обновление: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Сетка статистики */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative p-6 bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl hover:border-slate-600/50 transition-all duration-300 overflow-hidden">
                  {/* Свечение при наведении */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Иконка */}
                  <div className={`inline-flex p-3 rounded-xl ${stat.bgColor} mb-4 relative z-10`}>
                    <Icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                  </div>

                  {/* Значение */}
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-slate-400 text-sm mb-2">
                      {stat.title}
                    </p>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        stat.change.includes('+') 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : stat.change === 'Live'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>

                  {/* Анимированная граница */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-slate-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Нижний текст */}
        <div className="text-center mt-12">
          <p className="text-slate-500 text-sm">
            Все данные обновляются автоматически • Следующее обновление через 5 минут
          </p>
        </div>
      </div>
    </section>
  )
}
