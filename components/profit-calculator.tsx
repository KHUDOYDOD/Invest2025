"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Calculator, TrendingUp, DollarSign, BarChart3, PieChart, Target } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const investmentPlans = [
  { id: "basic", name: "Базовый", dailyReturn: 0.8, term: 30, minDeposit: 50, color: "from-green-500 to-emerald-600" },
  { id: "standard", name: "Стандарт", dailyReturn: 1.2, term: 40, minDeposit: 500, color: "from-blue-500 to-cyan-600" },
  {
    id: "premium",
    name: "Премиум",
    dailyReturn: 1.5,
    term: 50,
    minDeposit: 2000,
    color: "from-purple-500 to-pink-600",
  },
  { id: "vip", name: "VIP", dailyReturn: 2.0, term: 60, minDeposit: 10000, color: "from-yellow-500 to-orange-600" },
]

export function ProfitCalculator() {
  const [amount, setAmount] = useState([1000])
  const [selectedPlan, setSelectedPlan] = useState("standard")
  const [results, setResults] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [animatedValues, setAnimatedValues] = useState({
    dailyProfit: 0,
    totalProfit: 0,
    totalReturn: 0,
  })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const calculateProfit = () => {
    const plan = investmentPlans.find((p) => p.id === selectedPlan)
    if (!plan || !amount[0]) return

    const investmentAmount = amount[0]
    const dailyProfit = (investmentAmount * plan.dailyReturn) / 100
    const totalProfit = dailyProfit * plan.term
    const totalReturn = investmentAmount + totalProfit

    setResults({
      dailyProfit,
      totalProfit,
      totalReturn,
      plan: plan.name,
      term: plan.term,
      planColor: plan.color,
      roi: ((totalProfit / investmentAmount) * 100).toFixed(1),
    })

    // Animate numbers
    animateNumbers({ dailyProfit, totalProfit, totalReturn })
  }

  const animateNumbers = (target: any) => {
    const duration = 1000
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setAnimatedValues({
        dailyProfit: target.dailyProfit * progress,
        totalProfit: target.totalProfit * progress,
        totalReturn: target.totalReturn * progress,
      })

      if (currentStep >= steps) {
        clearInterval(interval)
        setAnimatedValues(target)
      }
    }, stepDuration)
  }

  useEffect(() => {
    if (amount[0] && selectedPlan) {
      calculateProfit()
    }
  }, [amount, selectedPlan])

  const selectedPlanData = investmentPlans.find((p) => p.id === selectedPlan)

  return (
    <div className={`max-w-7xl mx-auto ${isVisible ? "animate-scale-in" : "opacity-0"}`}>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Calculator Input */}
        <div className="lg:col-span-1">
          <Card className="bg-white shadow-xl border-0 overflow-hidden h-full">
            <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
              <CardTitle className="flex items-center text-xl">
                <Calculator className="h-6 w-6 mr-3" />
                Параметры расчета
              </CardTitle>
              <CardDescription className="text-slate-300">Настройте параметры для расчета прибыли</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Amount Slider */}
              <div className="space-y-4">
                <Label className="text-slate-700 font-medium">Сумма инвестиции: ${amount[0].toLocaleString('en-US')}</Label>
                <Slider value={amount} onValueChange={setAmount} max={100000} min={50} step={50} className="w-full" />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>$50</span>
                  <span>$100,000</span>
                </div>
              </div>

              {/* Plan Selection */}
              <div className="space-y-3">
                <Label className="text-slate-700 font-medium">Инвестиционный план</Label>
                <div className="grid grid-cols-1 gap-2">
                  {investmentPlans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                        selectedPlan === plan.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-slate-900">{plan.name}</div>
                          <div className="text-sm text-slate-600">{plan.dailyReturn}% в день</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-slate-900">{plan.term} дней</div>
                          <div className="text-xs text-slate-500">от ${plan.minDeposit}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="space-y-3">
                <Label className="text-slate-700 font-medium">Быстрый выбор</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[1000, 5000, 10000].map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount([quickAmount])}
                      className="text-xs"
                    >
                      ${quickAmount.toLocaleString('en-US')}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Display */}
        <div className="lg:col-span-2">
          <AnimatePresence>
            {results ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Main Results Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <DollarSign className="h-10 w-10 mx-auto mb-3 opacity-80" />
                      <p className="text-green-100 text-sm mb-1">Ежедневная прибыль</p>
                      <p className="text-2xl font-bold">${animatedValues.dailyProfit.toFixed(2)}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-80" />
                      <p className="text-blue-100 text-sm mb-1">Общая прибыль</p>
                      <p className="text-2xl font-bold">${animatedValues.totalProfit.toFixed(2)}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <Target className="h-10 w-10 mx-auto mb-3 opacity-80" />
                      <p className="text-purple-100 text-sm mb-1">Итого к получению</p>
                      <p className="text-2xl font-bold">${animatedValues.totalReturn.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Analysis */}
                <Card className="bg-white shadow-xl border-0">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
                    <CardTitle className="flex items-center text-slate-800">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Детальный анализ инвестиции
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Investment Details */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-slate-800 mb-3">Параметры инвестиции</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-600">План:</span>
                            <span className="font-medium text-slate-800">{results.plan}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Сумма инвестиции:</span>
                            <span className="font-medium text-slate-800">${amount[0].toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Срок инвестиции:</span>
                            <span className="font-medium text-slate-800">{results.term} дней</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Дневная доходность:</span>
                            <span className="font-medium text-slate-800">{selectedPlanData?.dailyReturn}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Profitability Analysis */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-slate-800 mb-3">Анализ доходности</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-600">ROI:</span>
                            <span className="font-medium text-green-600">{results.roi}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Месячная прибыль:</span>
                            <span className="font-medium text-slate-800">
                              ${(animatedValues.dailyProfit * 30).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Годовая доходность:</span>
                            <span className="font-medium text-blue-600">
                              {(((animatedValues.dailyProfit * 365) / amount[0]) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Эффективность:</span>
                            <span className="font-medium text-purple-600">
                              {results.roi > 50 ? "Высокая" : results.roi > 25 ? "Средняя" : "Низкая"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <div className="flex justify-between text-sm text-slate-600 mb-2">
                        <span>Прогресс инвестиции</span>
                        <span>100%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2, delay: 0.5 }}
                          className={`h-3 rounded-full bg-gradient-to-r ${selectedPlanData?.color}`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Button */}
                <div className="text-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Начать инвестировать
                  </Button>
                </div>
              </motion.div>
            ) : (
              <Card className="bg-white shadow-xl border-0 h-full">
                <CardContent className="flex flex-col items-center justify-center h-full py-20">
                  <PieChart className="h-20 w-20 text-slate-300 mb-6" />
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Готов к расчету</h3>
                  <p className="text-slate-600 text-center max-w-md">
                    Выберите сумму инвестиции и план для получения детального анализа доходности
                  </p>
                </CardContent>
              </Card>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
