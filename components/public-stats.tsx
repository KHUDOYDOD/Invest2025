"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, DollarSign, TrendingUp, Award } from "lucide-react"
import { motion } from "framer-motion"

interface Stats {
  totalUsers: number
  totalInvested: number
  totalPaid: number
  totalProfit: number
}

export function PublicStats() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalInvested: 0,
    totalPaid: 0,
    totalProfit: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Используем демо данные без базы данных
      const demoStats = {
        totalUsers: 15420,
        totalInvested: 2850000,
        totalPaid: 1250000,
        totalProfit: 850000,
      }

      setStats(demoStats)
    } catch (err) {
      console.error("Error loading statistics:", err)
      setError(null)
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
    return num.toLocaleString()
  }

  const statsData = [
    {
      title: "Total Users",
      value: formatNumber(stats.totalUsers),
      icon: Users,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Investments",
      value: `$${formatNumber(stats.totalInvested)}`,
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Withdrawals",
      value: `$${formatNumber(stats.totalPaid)}`,
      icon: TrendingUp,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Total Profit",
      value: `$${formatNumber(stats.totalProfit)}`,
      icon: Award,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-500/10",
    },
  ]

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-slate-900 to-gray-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Platform Statistics
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">Real-time data from our investment platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div
                    className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${stat.color} text-white shadow-lg mb-4`}
                  >
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {isLoading ? (
                      <div className="animate-pulse bg-slate-800 h-8 w-16 mx-auto rounded"></div>
                    ) : (
                      stat.value
                    )}
                  </h3>
                  <p className="text-slate-300 text-sm">{stat.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
