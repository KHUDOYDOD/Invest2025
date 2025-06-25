
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, DollarSign, TrendingUp, Award, Activity, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface PlatformStats {
  totalUsers: number
  totalInvested: number
  totalWithdrawals: number
  totalProfit: number
  activeInvestments: number
  lastUpdated: string
}

export function PlatformStatistics() {
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalInvested: 0,
    totalWithdrawals: 0,
    totalProfit: 0,
    activeInvestments: 0,
    lastUpdated: new Date().toLocaleTimeString('ru-RU'),
  })
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date())

  useEffect(() => {
    loadStats()
    
    // Обновление каждые 5 минут (300000 мс)
    const interval = setInterval(() => {
      loadStats()
    }, 300000)

    return () => clearInterval(interval)
  }, [])

  const loadStats = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/statistics')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const newStats = {
            totalUsers: data.data.totalUsers || 0,
            totalInvested: data.data.totalInvested || 0,
            totalWithdrawals: data.data.totalPaid || 0,
            totalProfit: data.data.totalProfit || 0,
            activeInvestments: data.data.activeInvestments || 0,
            lastUpdated: new Date().toLocaleTimeString('ru-RU'),
          }
          setStats(newStats)
          setLastUpdateTime(new Date())
        }
      }
    } catch (error) {
      console.error("Error loading platform statistics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toLocaleString('ru-RU')
  }

  const formatCurrency = (amount: number) => {
    return `$${formatNumber(amount)}`
  }

  const statsData = [
    {
      title: "Всего пользователей",
      value: formatNumber(stats.totalUsers),
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Общие инвестиции", 
      value: formatCurrency(stats.totalInvested),
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      title: "Активные инвестиции",
      value: formatNumber(stats.activeInvestments),
      icon: Activity,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      title: "Общие выплаты",
      value: formatCurrency(stats.totalWithdrawals),
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
  ]

  const timeAgo = () => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - lastUpdateTime.getTime()) / 1000)
    
    if (diffInSeconds < 60) return `${diffInSeconds} сек назад`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} мин назад`
    return `${Math.floor(diffInSeconds / 3600)} ч назад`
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            Статистика платформы
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-4">
            Актуальные данные нашей инвестиционной платформы в режиме реального времени
          </p>
          
          {/* Last Update Time */}
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              Последнее обновление: {timeAgo()}
            </span>
            {isLoading && (
              <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="wait">
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
                  className={`bg-gradient-to-br ${stat.bgColor} backdrop-blur-xl border ${stat.borderColor} shadow-2xl hover:shadow-3xl transition-all duration-500 transform group-hover:scale-105 overflow-hidden relative`}
                >
                  {/* Animated border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-full"></div>
                  
                  <CardContent className="p-8 text-center relative z-10">
                    {/* Icon */}
                    <div className="relative mb-6">
                      <div
                        className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${stat.color} text-white shadow-2xl group-hover:shadow-3xl transition-all duration-300`}
                      >
                        <stat.icon className="h-8 w-8" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    {/* Value */}
                    <div className="mb-4">
                      {isLoading ? (
                        <div className="animate-pulse bg-slate-700/50 h-10 w-24 mx-auto rounded-lg"></div>
                      ) : (
                        <motion.h3
                          key={stat.value}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300"
                        >
                          {stat.value}
                        </motion.h3>
                      )}
                    </div>
                    
                    {/* Title */}
                    <p className="text-slate-300 text-lg font-medium group-hover:text-white transition-colors duration-300">
                      {stat.title}
                    </p>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-br from-white/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Update Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full text-slate-400 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Автоматическое обновление каждые 5 минут
          </div>
        </motion.div>
      </div>
    </section>
  )
}
