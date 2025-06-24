"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  Clock,
  DollarSign,
  Crown,
  Rocket,
  CheckCircle,
  Calculator,
  AlertCircle,
  Sparkles,
  Shield,
  Zap,
  Diamond,
  Target,
} from "lucide-react"
import { toast } from "sonner"

interface InvestmentPlan {
  id: string
  name: string
  min_amount: number
  max_amount: number
  daily_percent: number
  duration: number
  total_return: number
  features: string[]
  description?: string
  is_active?: boolean
}

// Demo plans with black theme
const demoPlans: InvestmentPlan[] = [
  {
    id: "plan-1",
    name: "Стандарт",
    min_amount: 100,
    max_amount: 1000,
    daily_percent: 2,
    duration: 30,
    total_return: 60,
    features: ["Ежедневные выплаты", "Реинвестирование", "Страхование вклада", "24/7 поддержка"],
    description: "Идеальный план для начинающих инвесторов",
    is_active: true,
  },
  {
    id: "plan-2",
    name: "Премиум",
    min_amount: 1000,
    max_amount: 5000,
    daily_percent: 3,
    duration: 15,
    total_return: 45,
    features: [
      "Ежедневные выплаты",
      "Реинвестирование",
      "Страхование вклада",
      "Приоритетная поддержка",
      "Персональный менеджер",
    ],
    description: "Для опытных инвесторов с высокой доходностью",
    is_active: true,
  },
  {
    id: "plan-3",
    name: "VIP Elite",
    min_amount: 5000,
    max_amount: 50000,
    daily_percent: 4,
    duration: 10,
    total_return: 40,
    features: [
      "Ежедневные выплаты",
      "Реинвестирование",
      "Полное страхование",
      "VIP поддержка 24/7",
      "Персональный менеджер",
      "Эксклюзивные инвестиции",
      "Приоритетный вывод",
    ],
    description: "Эксклюзивный план для VIP клиентов",
    is_active: true,
  },
]

export function InvestmentPlansSelector() {
  const [plans, setPlans] = useState<InvestmentPlan[]>(demoPlans)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [isInvesting, setIsInvesting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userBalance, setUserBalance] = useState<number>(25000) // Устанавливаем значение по умолчанию
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/investment-plans")

      if (!response.ok) {
        console.warn("Failed to fetch investment plans, using demo data")
        return
      }

      const data = await response.json()

      if (Array.isArray(data) && data.length > 0) {
        setPlans(data)
      }
    } catch (err) {
      console.error("Error fetching investment plans:", err)
      setError("Используются демо данные")
    } finally {
      setLoading(false)
    }
  }

  const handleInvest = async () => {
    if (!selectedPlan) {
      toast.error("Выберите инвестиционный план")
      return
    }

    if (!investmentAmount || investmentAmount.trim() === "") {
      toast.error("Введите сумму инвестиции")
      return
    }

    const plan = plans.find((p) => p.id === selectedPlan)
    if (!plan) {
      toast.error("Выбранный план не найден")
      return
    }

    const amount = Number(investmentAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error("Введите корректную сумму")
      return
    }

    if (amount < plan.min_amount) {
      toast.error(`Минимальная сумма: $${plan.min_amount}`)
      return
    }

    if (amount > plan.max_amount) {
      toast.error(`Максимальная сумма: $${plan.max_amount}`)
      return
    }

    // Безопасная проверка баланса
    const currentBalance = userBalance || 0
    if (amount > currentBalance) {
      toast.error("Недостаточно средств на балансе", {
        description: `Доступно: $${currentBalance.toLocaleString()}`,
      })
      return
    }

    setIsInvesting(true)

    try {
      // Симуляция создания инвестиции
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setUserBalance((prev) => (prev || 0) - amount)

      toast.success(`Инвестиция $${amount} в план "${plan.name}" успешно создана!`, {
        description: `Ожидаемая прибыль: $${calculateProfit(plan, amount).total.toFixed(2)}`,
      })

      setSelectedPlan(null)
      setInvestmentAmount("")
    } catch (error) {
      console.error("Error creating investment:", error)
      toast.error("Ошибка при создании инвестиции", {
        description: "Попробуйте еще раз или обратитесь в поддержку",
      })
    } finally {
      setIsInvesting(false)
    }
  }

  const calculateProfit = (plan: InvestmentPlan, amount: number) => {
    const dailyProfit = (amount * plan.daily_percent) / 100
    const totalProfit = dailyProfit * plan.duration
    return {
      daily: dailyProfit,
      total: totalProfit,
      roi: (totalProfit / amount) * 100,
    }
  }

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "стандарт":
        return <TrendingUp className="h-7 w-7" />
      case "премиум":
        return <Crown className="h-7 w-7" />
      case "vip elite":
        return <Diamond className="h-7 w-7" />
      default:
        return <Rocket className="h-7 w-7" />
    }
  }

  const getPlanColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "стандарт":
        return "from-cyan-400 to-blue-500"
      case "премиум":
        return "from-purple-400 to-pink-500"
      case "vip elite":
        return "from-yellow-400 to-orange-500"
      default:
        return "from-green-400 to-emerald-500"
    }
  }

  const getPlanBorder = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "стандарт":
        return "border-cyan-500/30"
      case "премиум":
        return "border-purple-500/30"
      case "vip elite":
        return "border-yellow-500/30"
      default:
        return "border-green-500/30"
    }
  }

  // Безопасное получение баланса для отображения
  const displayBalance = userBalance || 0

  if (!plans || !Array.isArray(plans)) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-6" />
        <h3 className="text-2xl font-medium text-white mb-4">Ошибка загрузки планов</h3>
        <p className="text-gray-400 mb-6">Не удалось загрузить инвестиционные планы</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          Перезагрузить страницу
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-black/40 border-gray-800 animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-10 bg-gray-700 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* User Balance Display */}
      <Card className="bg-black/60 backdrop-blur-xl border border-green-500/30 shadow-2xl">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Доступно для инвестирования</h3>
              <p className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                ${displayBalance.toLocaleString()}
              </p>
              <p className="text-gray-400 mt-2">Готово к инвестированию</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-500/30">
              <DollarSign className="h-12 w-12 text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div key={plan.id} className="group">
            <Card
              className={`relative overflow-hidden cursor-pointer transition-all duration-500 transform hover:scale-105 bg-black/80 backdrop-blur-xl border-2 ${
                selectedPlan === plan.id
                  ? `${getPlanBorder(plan.name)} shadow-2xl shadow-current/20`
                  : "border-gray-800 hover:border-gray-600"
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${getPlanColor(plan.name)} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
              />

              {/* Popular Badge for Premium */}
              {plan.name === "Премиум" && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 text-sm font-semibold">
                    🔥 Популярный
                  </Badge>
                </div>
              )}

              {/* VIP Badge */}
              {plan.name === "VIP Elite" && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-4 py-1 text-sm font-bold">
                    👑 VIP
                  </Badge>
                </div>
              )}

              <CardHeader className="relative pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${getPlanColor(plan.name)} text-white shadow-xl`}>
                    {getPlanIcon(plan.name)}
                  </div>
                  {plan.is_active === false && (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                      Скоро
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl font-bold text-white mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-gray-400 text-base leading-relaxed">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="relative space-y-6">
                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/40 rounded-xl p-4 border border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">Ежедневно</div>
                    <div className="text-green-400 font-bold text-xl">{plan.daily_percent}%</div>
                  </div>
                  <div className="bg-black/40 rounded-xl p-4 border border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">Срок</div>
                    <div className="text-white font-bold text-xl flex items-center">
                      <Clock className="h-5 w-5 mr-1 text-blue-400" />
                      {plan.duration}д
                    </div>
                  </div>
                </div>

                <div className="bg-black/40 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Общий доход:</span>
                    <span className="text-green-400 font-bold text-xl">{plan.total_return}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Сумма:</span>
                    <span className="text-white font-semibold">
                      ${(plan.min_amount || 0).toLocaleString()} - ${(plan.max_amount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features &&
                    Array.isArray(plan.features) &&
                    plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-300">
                        <CheckCircle className="h-5 w-5 mr-3 text-green-400 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                </div>

                {/* Investment Form */}
                {selectedPlan === plan.id && (
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor={`amount-${plan.id}`} className="text-white text-base font-medium">
                          Сумма инвестиции
                        </Label>
                        <div className="relative mt-2">
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                            $
                          </span>
                          <Input
                            id={`amount-${plan.id}`}
                            type="number"
                            placeholder={(plan.min_amount || 100).toString()}
                            min={plan.min_amount || 100}
                            max={plan.max_amount || 10000}
                            value={investmentAmount}
                            onChange={(e) => setInvestmentAmount(e.target.value)}
                            className="pl-10 pr-4 py-3 bg-black/60 border-gray-600 text-white text-lg placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400 rounded-xl h-14"
                          />
                        </div>
                      </div>

                      {/* Profit Calculator */}
                      {investmentAmount && Number(investmentAmount) >= (plan.min_amount || 100) && (
                        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/30">
                          <h4 className="text-white font-semibold mb-4 flex items-center">
                            <Calculator className="h-5 w-5 mr-2 text-green-400" />
                            Расчет прибыли
                          </h4>
                          <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300">Ежедневная прибыль:</span>
                              <span className="text-green-400 font-bold text-lg">
                                ${calculateProfit(plan, Number(investmentAmount)).daily.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300">Общая прибыль:</span>
                              <span className="text-green-400 font-bold text-lg">
                                ${calculateProfit(plan, Number(investmentAmount)).total.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-green-500/20">
                              <span className="text-gray-300">ROI:</span>
                              <span className="text-green-400 font-bold text-xl">
                                {calculateProfit(plan, Number(investmentAmount)).roi.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={handleInvest}
                        disabled={
                          isInvesting ||
                          !investmentAmount ||
                          Number(investmentAmount) < (plan.min_amount || 100) ||
                          Number(investmentAmount) > (plan.max_amount || 10000) ||
                          Number(investmentAmount) > displayBalance
                        }
                        className={`w-full bg-gradient-to-r ${getPlanColor(plan.name)} hover:opacity-90 text-white shadow-xl transition-all duration-300 h-14 text-lg font-semibold rounded-xl`}
                      >
                        {isInvesting ? (
                          <>
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                            Создание инвестиции...
                          </>
                        ) : (
                          <>
                            <Target className="mr-3 h-6 w-6" />
                            Инвестировать ${investmentAmount || "0"}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Investment Tips */}
      <Card className="bg-black/60 backdrop-blur-xl border border-gray-700 shadow-2xl">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Sparkles className="h-6 w-6 text-yellow-400" />
            <CardTitle className="text-white text-2xl">Советы по инвестированию</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/40 rounded-xl p-6 border border-blue-500/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Shield className="h-6 w-6 text-blue-400" />
                </div>
                <h4 className="font-semibold text-white text-lg">Диверсификация</h4>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Распределяйте инвестиции между разными планами для снижения рисков и увеличения потенциальной прибыли.
              </p>
            </div>

            <div className="bg-black/40 rounded-xl p-6 border border-green-500/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <Zap className="h-6 w-6 text-green-400" />
                </div>
                <h4 className="font-semibold text-white text-lg">Реинвестирование</h4>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Реинвестируйте полученную прибыль для увеличения капитала и получения сложного процента.
              </p>
            </div>

            <div className="bg-black/40 rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-purple-400" />
                </div>
                <h4 className="font-semibold text-white text-lg">Долгосрочность</h4>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Планируйте инвестиции на длительный срок для максимизации прибыли и минимизации влияния рыночных
                колебаний.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
