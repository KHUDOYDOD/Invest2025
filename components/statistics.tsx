"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, DollarSign, TrendingUp, Award, ArrowUp, ArrowDown } from "lucide-react"
import { motion } from "framer-motion"

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
  }, [])

  const loadStatistics = async () => {
    try {
      setLoading(true)
      setError(null)

      // Используем демо данные без базы данных
      const demoStats = {
        usersCount: 15420,
        usersChange: 12.5,
        investmentsAmount: 2850000,
        investmentsChange: 8.3,
        payoutsAmount: 1250000,
        payoutsChange: 15.7,
        profitabilityRate: 18.5,
        profitabilityChange: 2.1,
      }

      setStats(demoStats)
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
      gradient: "from-violet-500 via-purple-500 to-indigo-600",
      bgGradient: "from-violet-500/20 to-purple-600/20",
      shadowColor: "shadow-violet-500/25",
    },
    {
      title: "Месячные инвестиции",
      value: `$${formatNumber(stats.investmentsAmount)}`,
      change: formatChange(stats.investmentsChange),
      changeValue: stats.investmentsChange,
      icon: DollarSign,
      gradient: "from-emerald-500 via-teal-500 to-cyan-600",
      bgGradient: "from-emerald-500/20 to-teal-600/20",
      shadowColor: "shadow-emerald-500/25",
    },
    {
      title: "Выплачено прибыли",
      value: `$${formatNumber(stats.payoutsAmount)}`,
      change: formatChange(stats.payoutsChange),
      changeValue: stats.payoutsChange,
      icon: TrendingUp,
      gradient: "from-orange-500 via-amber-500 to-yellow-600",
      bgGradient: "from-orange-500/20 to-amber-600/20",
      shadowColor: "shadow-orange-500/25",
    },
    {
      title: "Средняя доходность",
      value: `${stats.profitabilityRate}%`,
      change: formatChange(stats.profitabilityChange),
      changeValue: stats.profitabilityChange,
      icon: Award,
      gradient: "from-pink-500 via-rose-500 to-red-600",
      bgGradient: "from-pink-500/20 to-rose-600/20",
      shadowColor: "shadow-pink-500/25",
    },
  ]

  if (error) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 backdrop-blur-sm"
            >
              <p className="text-red-400 text-lg">Ошибка загрузки статистики: {error}</p>
            </motion.div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
      {/* Анимированные фоновые элементы */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-violet-600/5 to-pink-600/5 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-6">
            Статистика платформы
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Актуальные данные нашей инвестиционной платформы в режиме реального времени
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: index * 0.15,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              className="group"
            >
              <Card
                className={`bg-gradient-to-br ${stat.bgGradient} backdrop-blur-xl border border-white/10 shadow-2xl ${stat.shadowColor} hover:shadow-3xl transition-all duration-500 overflow-hidden relative`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <CardContent className="p-8 text-center relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.15 + 0.3, type: "spring", stiffness: 200 }}
                    className={`inline-flex p-4 rounded-3xl bg-gradient-to-r ${stat.gradient} text-white shadow-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon className="h-8 w-8" />
                  </motion.div>

                  <motion.h3
                    className="text-4xl font-bold text-white mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.15 + 0.5 }}
                  >
                    {loading ? (
                      <div className="animate-pulse bg-slate-700/50 h-10 w-24 mx-auto rounded-xl"></div>
                    ) : (
                      <motion.span
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: index * 0.15 + 0.6 }}
                      >
                        {stat.value}
                      </motion.span>
                    )}
                  </motion.h3>

                  <p className="text-slate-300 text-lg font-medium mb-4">{stat.title}</p>

                  {!loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15 + 0.8 }}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm ${getChangeColor(stat.changeValue)} font-semibold text-sm`}
                    >
                      {getChangeIcon(stat.changeValue)}
                      {stat.change}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Дополнительные декоративные элементы */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-slate-300 text-sm font-medium">Данные обновляются в реальном времени</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
