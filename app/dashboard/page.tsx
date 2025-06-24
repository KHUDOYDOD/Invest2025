"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardNav } from "@/components/dashboard/nav"
import { DepositForm } from "@/components/dashboard/deposit-form"
import { TransactionsList } from "@/components/dashboard/transactions-list"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  TrendingUp,
  User,
  Shield,
  Clock,
  Wallet,
  BarChart3,
  Globe,
  CheckCircle,
  MapPin,
  CreditCard,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

function DashboardContent() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [userData, setUserData] = useState<any>(null)
  const [investments, setInvestments] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDepositForm, setShowDepositForm] = useState(false)
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    console.log("Dashboard: Component mounted")

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      updateInvestmentTimers()
    }, 1000)

    fetchDashboardData()

    return () => {
      clearInterval(timer)
      console.log("Dashboard: Component unmounted")
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const userId = localStorage.getItem("userId")
      const userEmail = localStorage.getItem("userEmail")

      if (!userId || !userEmail) {
        throw new Error("Пользователь не авторизован")
      }

      console.log("🔄 Fetching dashboard data for user:", userEmail)

      const response = await fetch("/api/user/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Ошибка загрузки данных")
      }

      const data = await response.json()
      console.log("✅ Dashboard data loaded:", data)

      if (data.success) {
        console.log("Setting dashboard data:", data)
        setUserData(data.user)
        setInvestments(data.investments || [])
        setTransactions(data.transactions || [])

        // Обновляем localStorage с актуальными данными
        if (data.user) {
          localStorage.setItem("userName", data.user.name || "")
          localStorage.setItem("userRole", data.user.isAdmin ? "admin" : "user")
          localStorage.setItem("userBalance", (data.user.balance || 0).toString())
          localStorage.setItem("userTotalInvested", (data.user.totalInvested || 0).toString())
          localStorage.setItem("userTotalEarned", (data.user.totalEarned || 0).toString())
        }
      } else {
        throw new Error(data.error || "Ошибка загрузки данных")
      }
    } catch (err) {
      console.error("❌ Dashboard: Error fetching data:", err)
      setError(err instanceof Error ? err.message : "Ошибка загрузки данных")
    } finally {
      setLoading(false)
    }
  }

  const updateInvestmentTimers = () => {
    const newTimeLeft: { [key: string]: string } = {}

    investments.forEach((investment) => {
      const endDate = new Date(investment.end_date)
      const now = new Date()
      const diff = endDate.getTime() - now.getTime()

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        newTimeLeft[investment.id] = `${days}д ${hours}ч ${minutes}м ${seconds}с`
      } else {
        newTimeLeft[investment.id] = "Завершено"
      }
    })

    setTimeLeft(newTimeLeft)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const handleDeposit = async (amount: number, method: string, paymentDetails: any) => {
    try {
      console.log("💰 Handling deposit:", { amount, method })

      // Обновляем данные после создания заявки
      setTimeout(() => {
        fetchDashboardData()
        setShowDepositForm(false)
      }, 1000)
    } catch (error) {
      console.error("❌ Error handling deposit:", error)
      toast.error("Ошибка обработки пополнения")
    }
  }

  const quickActions = [
    {
      title: "Пополнить баланс",
      subtitle: "Отправить запрос на пополнение",
      icon: <ArrowDownToLine className="h-6 w-6" />,
      color: "from-green-500 to-emerald-600",
      action: () => {
        setShowDepositForm(true)
      },
      limit: "Мин. $50",
    },
    {
      title: "Вывод средств",
      subtitle: "Запросить вывод прибыли",
      icon: <ArrowUpFromLine className="h-6 w-6" />,
      color: "from-red-500 to-pink-600",
      action: () => {
        window.location.href = "/dashboard/withdraw"
      },
      limit: "24/7 доступно",
    },
    {
      title: "Пригласить друзей",
      subtitle: "Получайте бонусы за рефералов",
      icon: <Users className="h-6 w-6" />,
      color: "from-purple-500 to-violet-600",
      action: () => {
        window.location.href = "/dashboard/referrals"
      },
      limit: "до 10%",
    },
    {
      title: "Новая инвестиция",
      subtitle: "Выберите план инвестирования",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "from-orange-500 to-amber-600",
      action: () => {
        window.location.href = "/dashboard/investments"
      },
      limit: "От $100",
    },
    {
      title: "Мой профиль",
      subtitle: "Управление личными данными",
      icon: <User className="h-6 w-6" />,
      color: "from-blue-500 to-cyan-600",
      action: () => {
        window.location.href = "/dashboard/profile"
      },
      limit: "Персонализация",
    },
    ...(userData?.isAdmin
      ? [
          {
            title: "Администратор",
            subtitle: "Панель управления сайтом",
            icon: <Shield className="h-6 w-6" />,
            color: "from-red-600 to-rose-700",
            action: () => {
              window.location.href = "/admin/dashboard"
            },
            limit: "Только админ",
          },
        ]
      : []),
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="relative">
            <RefreshCw className="h-16 w-16 animate-spin text-blue-500 mx-auto mb-4" />
            <div className="absolute inset-0 h-16 w-16 rounded-full border-t-2 border-blue-500 animate-ping opacity-20"></div>
          </div>
          <p className="text-white text-lg mt-4 font-light">Загрузка данных из базы...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Ошибка загрузки</h2>
          <p className="text-red-200 mb-6">{error}</p>
          <div className="space-y-3">
            <Button onClick={fetchDashboardData} className="bg-blue-600 hover:bg-blue-700 w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Попробовать снова
            </Button>
            <Button
              onClick={() => {
                localStorage.clear()
                window.location.href = "/login"
              }}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 w-full"
            >
              Войти заново
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <p className="text-white text-lg">Данные пользователя не найдены</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <DashboardHeader />

      <div className="flex relative z-10">
        <DashboardNav activeItem="dashboard" />

        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20">
                <span className="text-2xl">👋</span>
                <span className="text-white">Добро пожаловать, {userData.name}!</span>
                <span className="text-2xl">💼</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Личный кабинет</h1>
              <p className="text-blue-200 max-w-2xl mx-auto text-lg">
                Управляйте своими инвестициями и следите за доходностью
              </p>

              <div className="flex items-center justify-center space-x-2 text-white/80">
                <Clock className="h-5 w-5" />
                <span className="font-mono text-xl">{formatTime(currentTime)}</span>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-xl border border-green-500/30 relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-green-200 text-sm">Баланс</p>
                      <p className="text-green-100 text-xs">Доступные средства</p>
                    </div>
                    <div className="p-3 bg-green-500/20 rounded-xl">
                      <Wallet className="h-6 w-6 text-green-400" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    ${Number(userData.balance || 0).toLocaleString()}.00
                  </div>
                  <div className="flex items-center text-green-300 text-sm">
                    <span className="mr-1">💰</span>
                    <span>Реальный баланс</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-xl border border-blue-500/30 relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-blue-200 text-sm">Активные инвестиции</p>
                      <p className="text-blue-100 text-xs">Работающий капитал</p>
                    </div>
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                      <TrendingUp className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    ${Number(userData.totalInvested || 0).toLocaleString()}.00
                  </div>
                  <div className="flex items-center text-blue-300 text-sm">
                    <span className="mr-1">📈</span>
                    <span>Инвестировано</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-violet-600/20 backdrop-blur-xl border border-purple-500/30 relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-purple-200 text-sm">Заработано всего</p>
                      <p className="text-purple-100 text-xs">Общая прибыль</p>
                    </div>
                    <div className="p-3 bg-purple-500/20 rounded-xl">
                      <BarChart3 className="h-6 w-6 text-purple-400" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    ${Number(userData.totalProfit || 0).toLocaleString()}.00
                  </div>
                  <div className="flex items-center text-purple-300 text-sm">
                    <span className="mr-1">💎</span>
                    <span>Прибыль</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500/20 to-amber-600/20 backdrop-blur-xl border border-orange-500/30 relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-orange-200 text-sm">Рефералы</p>
                      <p className="text-orange-100 text-xs">Приглашенные друзья</p>
                    </div>
                    <div className="p-3 bg-orange-500/20 rounded-xl">
                      <Users className="h-6 w-6 text-orange-400" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{userData.referralCount || 0}</div>
                  <div className="flex items-center text-orange-300 text-sm">
                    <span className="mr-1">👥</span>
                    <span>Друзей</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
            >
              {quickActions.map((action, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={action.action}
                  className={`bg-gradient-to-br ${action.color} p-6 rounded-2xl text-center cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/10 backdrop-blur-sm`}
                >
                  <div className="text-white mb-4 flex justify-center transform transition-transform duration-300 hover:scale-110">
                    {action.icon}
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-2">{action.title}</h3>
                  <p className="text-white/80 text-xs mb-3 leading-relaxed">{action.subtitle}</p>
                  <div className="bg-white/20 rounded-full px-3 py-1">
                    <p className="text-white/90 text-xs font-medium">{action.limit}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Quick Deposit Form */}
            {showDepositForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Запрос на пополнение</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDepositForm(false)}
                    className="text-white hover:bg-white/10"
                  >
                    ✕
                  </Button>
                </div>
                <DepositForm onDeposit={handleDeposit} />
              </motion.div>
            )}

            {/* Active Investments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Активные инвестиции</h2>
                </div>
                <Link href="/dashboard/investments">
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                    Все инвестиции
                  </Button>
                </Link>
              </div>

              {investments.length > 0 ? (
                <div className="space-y-4">
                  {investments.map((investment) => (
                    <div key={investment.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold">
                          {investment.investment_plans?.name || "План инвестирования"}
                        </h3>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Активно</Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                        <div>
                          <p className="text-white/60 text-xs">Инвестировано</p>
                          <p className="text-white font-semibold">${Number(investment.amount).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-xs">Ежедневно</p>
                          <p className="text-green-400 font-semibold">${Number(investment.daily_profit).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-xs">Заработано</p>
                          <p className="text-blue-400 font-semibold">${Number(investment.total_profit).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-xs">Осталось времени</p>
                          <p className="text-white font-semibold font-mono text-sm">
                            {timeLeft[investment.id] || "Загрузка..."}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60 text-xs">Доходность</p>
                          <p className="text-purple-400 font-semibold">
                            {investment.investment_plans?.daily_percent || 0}% в день
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Дата начала</span>
                          <span className="text-white">
                            {new Date(investment.start_date).toLocaleDateString("ru-RU")}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Дата окончания</span>
                          <span className="text-white">
                            {new Date(investment.end_date).toLocaleDateString("ru-RU")}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white/60">Прогресс</span>
                          <span className="text-white">
                            {Math.round(
                              ((new Date().getTime() - new Date(investment.start_date).getTime()) /
                                (new Date(investment.end_date).getTime() - new Date(investment.start_date).getTime())) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={Math.round(
                            ((new Date().getTime() - new Date(investment.start_date).getTime()) /
                              (new Date(investment.end_date).getTime() - new Date(investment.start_date).getTime())) *
                              100,
                          )}
                          className="h-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
                  <p className="text-white/70 mb-4">У вас пока нет активных инвестиций</p>
                  <Link href="/dashboard/investments">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Начать инвестировать
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <CreditCard className="h-5 w-5 text-green-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Последние транзакции</h2>
                </div>
                <Link href="/dashboard/transactions">
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                    Все транзакции
                  </Button>
                </Link>
              </div>

              <TransactionsList userId={userData.id} />
            </motion.div>

            {/* Status Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <Card className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-3">
                    <User className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Статус аккаунта</h3>
                  <p className="text-xl font-bold">Активный</p>
                  <p className="text-sm opacity-80 mt-1">Верифицированный пользователь</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-3">
                    <Shield className="h-8 w-8" />
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <p className="text-xl font-bold">Защищен</p>
                  </div>
                  <p className="text-sm opacity-80 mt-1">Аккаунт верифицирован</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-3">
                    <Globe className="h-8 w-8" />
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <p className="text-xl font-bold">Россия</p>
                  </div>
                  <p className="text-sm opacity-80 mt-1">Подключено к БД</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  console.log("Dashboard: Page component rendering")
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
