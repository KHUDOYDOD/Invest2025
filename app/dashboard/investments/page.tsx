"use client"

import { cn } from "@/lib/utils"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardNav } from "@/components/dashboard/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { InvestmentPlansSelector } from "@/components/dashboard/investment-plans-selector"
import { InvestmentsList } from "@/components/dashboard/investments-list"
import {
  TrendingUp,
  BarChart3,
  DollarSign,
  PieChart,
  Target,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Shield,
  Zap,
  Star,
} from "lucide-react"
import { useState, useEffect } from "react"

interface InvestmentStats {
  totalInvested: number
  totalProfit: number
  activeInvestments: number
  monthlyReturn: number
  portfolioValue: number
  availableBalance: number
}

function InvestmentsContent() {
  const [stats, setStats] = useState<InvestmentStats>({
    totalInvested: 0,
    totalProfit: 0,
    activeInvestments: 0,
    monthlyReturn: 0,
    portfolioValue: 0,
    availableBalance: 0,
  })

  // Загрузка реальных данных
  useEffect(() => {
    const loadStats = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const userId = localStorage.getItem("userId")
        
        if (!token || !userId) return
        
        const response = await fetch(`/api/dashboard/all?userId=${userId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          const user = data.user
          const investments = data.investments || []
          
          const totalInvested = investments.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0)
          const totalProfit = investments.reduce((sum: number, inv: any) => sum + (inv.total_profit || 0), 0)
          
          setStats({
            totalInvested: totalInvested,
            totalProfit: totalProfit,
            activeInvestments: investments.filter((inv: any) => inv.status === 'active').length,
            monthlyReturn: totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0,
            portfolioValue: totalInvested + totalProfit,
            availableBalance: user?.balance || 0,
          })
        }
      } catch (error) {
        console.error("Error loading investment stats:", error)
      }
    }
    
    loadStats()
  }, [])

  const [selectedTab, setSelectedTab] = useState<"plans" | "active" | "history">("plans")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <DashboardHeader />

      <div className="flex">
        <DashboardNav activeItem="investments" />

        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-xl">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white">Инвестиции</h1>
              </div>
              <p className="text-white/70 text-lg lg:text-xl max-w-2xl mx-auto">
                Управляйте своим инвестиционным портфелем и отслеживайте доходность
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10" />
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-500/20 rounded-xl">
                        <Wallet className="h-6 w-6 text-blue-400" />
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Портфель</Badge>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm mb-1">Общая стоимость</p>
                      <p className="text-3xl font-bold text-white">${stats.portfolioValue.toLocaleString()}</p>
                      <div className="flex items-center mt-2">
                        <ArrowUpRight className="h-4 w-4 text-green-400 mr-1" />
                        <span className="text-green-400 text-sm font-medium">+15.2%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10" />
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-emerald-500/20 rounded-xl">
                        <TrendingUp className="h-6 w-6 text-emerald-400" />
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Прибыль</Badge>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm mb-1">Общая прибыль</p>
                      <p className="text-3xl font-bold text-white">${stats.totalProfit.toLocaleString()}</p>
                      <div className="flex items-center mt-2">
                        <ArrowUpRight className="h-4 w-4 text-emerald-400 mr-1" />
                        <span className="text-emerald-400 text-sm font-medium">+{stats.monthlyReturn}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-500/10" />
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-purple-500/20 rounded-xl">
                        <BarChart3 className="h-6 w-6 text-purple-400" />
                      </div>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Активные</Badge>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm mb-1">Активных планов</p>
                      <p className="text-3xl font-bold text-white">{stats.activeInvestments}</p>
                      <div className="flex items-center mt-2">
                        <Clock className="h-4 w-4 text-purple-400 mr-1" />
                        <span className="text-purple-400 text-sm font-medium">В работе</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10" />
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-orange-500/20 rounded-xl">
                        <DollarSign className="h-6 w-6 text-orange-400" />
                      </div>
                      <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">Баланс</Badge>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm mb-1">Доступно</p>
                      <p className="text-3xl font-bold text-white">${stats.availableBalance.toLocaleString()}</p>
                      <div className="flex items-center mt-2">
                        <Zap className="h-4 w-4 text-orange-400 mr-1" />
                        <span className="text-orange-400 text-sm font-medium">Готов к инвестициям</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-xl">
                <div className="flex space-x-2">
                  {[
                    { id: "plans", label: "Выбрать план", icon: Target },
                    { id: "active", label: "Активные", icon: TrendingUp },
                    { id: "history", label: "История", icon: BarChart3 },
                  ].map((tab) => {
                    const Icon = tab.icon
                    return (
                      <Button
                        key={tab.id}
                        variant="ghost"
                        onClick={() => setSelectedTab(tab.id as any)}
                        className={cn(
                          "px-6 py-3 rounded-xl transition-all duration-300 font-medium",
                          selectedTab === tab.id
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                            : "text-white/70 hover:text-white hover:bg-white/10",
                        )}
                      >
                        <Icon className="h-5 w-5 mr-2" />
                        {tab.label}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div key={selectedTab}>
              {selectedTab === "plans" && (
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-yellow-500/5" />
                  <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white relative">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 rounded-xl">
                        <Target className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Инвестиционные планы</CardTitle>
                        <CardDescription className="text-white/90">
                          Выберите подходящий план для инвестирования
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <InvestmentPlansSelector />
                  </CardContent>
                </Card>
              )}

              {selectedTab === "active" && (
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white relative">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 rounded-xl">
                        <TrendingUp className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Активные инвестиции</CardTitle>
                        <CardDescription className="text-white/90">
                          Ваши текущие инвестиционные планы и их доходность
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <InvestmentsList />
                  </CardContent>
                </Card>
              )}

              {selectedTab === "history" && (
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-slate-500/5" />
                  <CardHeader className="bg-gradient-to-r from-gray-500 to-slate-600 text-white relative">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 rounded-xl">
                        <BarChart3 className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">История инвестиций</CardTitle>
                        <CardDescription className="text-white/90">
                          Завершенные инвестиции и их результаты
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="text-center py-12">
                      <div className="p-4 bg-gray-500/20 rounded-2xl inline-block mb-4">
                        <BarChart3 className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">История пуста</h3>
                      <p className="text-white/70 mb-6">
                        У вас пока нет завершенных инвестиций. Начните инвестировать, чтобы увидеть историю.
                      </p>
                      <Button
                        onClick={() => setSelectedTab("plans")}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl"
                      >
                        <Star className="h-5 w-5 mr-2" />
                        Начать инвестировать
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-xl border border-emerald-500/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-emerald-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <ArrowDownRight className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">Пополнить баланс</h3>
                      <p className="text-white/70 text-sm">Добавить средства для инвестирования</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-blue-500/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <PieChart className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">Аналитика</h3>
                      <p className="text-white/70 text-sm">Подробная статистика доходности</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-orange-500/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-orange-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Shield className="h-6 w-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">Страхование</h3>
                      <p className="text-white/70 text-sm">Защита ваших инвестиций</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function InvestmentsPage() {
  return (
    <AuthGuard>
      <InvestmentsContent />
    </AuthGuard>
  )
}
