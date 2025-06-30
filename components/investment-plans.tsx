
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, TrendingUp, Shield, Clock, Star, Zap, Crown, Diamond, Sparkles, ArrowRight, DollarSign } from "lucide-react"

const investmentPlans = [
  {
    id: 1,
    name: "Стартовый",
    minAmount: 100,
    maxAmount: 999,
    dailyProfit: 1.2,
    totalProfit: 120,
    duration: 30,
    popular: false,
    features: ["Минимальный риск", "Ежедневные выплаты", "Поддержка 24/7", "Мгновенный старт", "Реинвестирование"],
    description: "Идеальный план для начинающих инвесторов. Низкий порог входа и стабильная доходность.",
    color: "from-cyan-400 to-blue-600",
    darkColor: "from-cyan-500/20 to-blue-600/20",
    icon: TrendingUp,
    borderGlow: "border-cyan-500/30 shadow-cyan-500/20",
  },
  {
    id: 2,
    name: "Стандартный",
    minAmount: 1000,
    maxAmount: 4999,
    dailyProfit: 1.8,
    totalProfit: 154,
    duration: 30,
    popular: true,
    features: [
      "Повышенная доходность",
      "Приоритетная поддержка",
      "Бонус за пополнение 5%",
      "Персональный менеджер",
      "Аналитические отчеты",
      "Страхование депозита",
    ],
    description: "Оптимальное соотношение риска и доходности. Самый популярный выбор наших клиентов.",
    color: "from-emerald-400 to-green-600",
    darkColor: "from-emerald-500/20 to-green-600/20",
    icon: Shield,
    borderGlow: "border-emerald-500/30 shadow-emerald-500/20",
  },
  {
    id: 3,
    name: "Премиум",
    minAmount: 5000,
    maxAmount: 19999,
    dailyProfit: 2.5,
    totalProfit: 200,
    duration: 30,
    popular: false,
    features: [
      "Максимальная доходность",
      "VIP поддержка",
      "Бонус за пополнение 10%",
      "Индивидуальная стратегия",
      "Еженедельные консультации",
      "Полное страхование",
      "Досрочный вывод без комиссии",
    ],
    description: "Для опытных инвесторов, готовых к высокой доходности. Премиальное обслуживание.",
    color: "from-purple-400 to-pink-600",
    darkColor: "from-purple-500/20 to-pink-600/20",
    icon: Crown,
    borderGlow: "border-purple-500/30 shadow-purple-500/20",
  },
  {
    id: 4,
    name: "VIP Элитный",
    minAmount: 20000,
    maxAmount: 100000,
    dailyProfit: 3.2,
    totalProfit: 288,
    duration: 30,
    popular: false,
    features: [
      "Эксклюзивная доходность",
      "Персональный трейдер",
      "Бонус за пополнение 15%",
      "Приватные инвестиции",
      "Ежедневные консультации",
      "Максимальное страхование",
      "Гибкие условия вывода",
      "Доступ к закрытым проектам",
    ],
    description: "Элитный план для крупных инвесторов. Эксклюзивные возможности и максимальная прибыль.",
    color: "from-yellow-400 to-orange-600",
    darkColor: "from-yellow-500/20 to-orange-600/20",
    icon: Diamond,
    borderGlow: "border-yellow-500/30 shadow-yellow-500/20",
  },
]

export function InvestmentPlans() {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const calculateReturn = (plan: any, amount: number = plan.minAmount) => {
    const dailyReturn = (amount * plan.dailyProfit) / 100
    const totalReturn = dailyReturn * plan.duration
    return {
      daily: dailyReturn,
      total: totalReturn,
      percentage: ((totalReturn / amount) * 100).toFixed(1)
    }
  }

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-emerald-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div 
          className={`text-center mb-20 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-8 backdrop-blur-sm">
            <Sparkles className="h-5 w-5 mr-3 text-blue-400" />
            <span className="text-blue-300 font-medium">Инвестиционные планы</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-8 leading-tight">
            Выберите ваш путь к успеху
          </h2>
          
          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            Инновационные инвестиционные решения с гарантированной доходностью и полной прозрачностью процесса
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center bg-black/30 backdrop-blur-sm px-6 py-3 rounded-2xl border border-green-500/30">
              <Shield className="h-5 w-5 mr-3 text-green-400" />
              <span className="text-green-300">Гарантированная безопасность</span>
            </div>
            <div className="flex items-center bg-black/30 backdrop-blur-sm px-6 py-3 rounded-2xl border border-blue-500/30">
              <TrendingUp className="h-5 w-5 mr-3 text-blue-400" />
              <span className="text-blue-300">Стабильная доходность</span>
            </div>
            <div className="flex items-center bg-black/30 backdrop-blur-sm px-6 py-3 rounded-2xl border border-purple-500/30">
              <Clock className="h-5 w-5 mr-3 text-purple-400" />
              <span className="text-purple-300">Ежедневные выплаты</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
          {investmentPlans.map((plan, index) => (
            <div
              key={plan.id}
              className={`transform transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <Card
                className={`relative overflow-hidden border-2 transition-all duration-500 hover:scale-105 cursor-pointer group bg-black/60 backdrop-blur-xl h-full ${
                  selectedPlan === plan.id
                    ? `${plan.borderGlow} shadow-2xl scale-105`
                    : `border-gray-800 hover:${plan.borderGlow} hover:shadow-xl`
                } ${hoveredPlan === plan.id ? 'z-10' : ''}`}
                onClick={() => setSelectedPlan(selectedPlan === plan.id ? null : plan.id)}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {/* Animated Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.darkColor} opacity-0 group-hover:opacity-100 transition-all duration-700`} />
                
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-2 text-sm font-bold shadow-2xl animate-pulse">
                      <Star className="h-4 w-4 mr-2" />
                      ПОПУЛЯРНЫЙ
                    </Badge>
                  </div>
                )}

                {/* Elite Badge */}
                {plan.name === "VIP Элитный" && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-6 py-2 text-sm font-bold shadow-2xl">
                      <Crown className="h-4 w-4 mr-2" />
                      VIP ELITE
                    </Badge>
                  </div>
                )}

                {/* Glowing Border Animation */}
                <div className={`absolute inset-0 bg-gradient-to-r ${plan.color} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700`} />

                <CardHeader className="relative pb-6 pt-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${plan.color} text-white shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                      <plan.icon className="h-8 w-8" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">{plan.dailyProfit}%</div>
                      <div className="text-sm text-gray-400">в день</div>
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                    {plan.name}
                  </CardTitle>
                  
                  <CardDescription className="text-gray-400 text-base leading-relaxed">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative space-y-6">
                  {/* Profit Display */}
                  <div className="bg-gradient-to-r from-black/40 to-gray-900/40 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400 mb-1">
                          {plan.totalProfit}%
                        </div>
                        <div className="text-xs text-gray-400">Общий доход</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400 mb-1 flex items-center justify-center">
                          <Clock className="h-5 w-5 mr-1" />
                          {plan.duration}
                        </div>
                        <div className="text-xs text-gray-400">дней</div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-700/50 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Сумма инвестиций:</span>
                        <span className="text-white font-semibold">
                          ${plan.minAmount.toLocaleString()} - ${plan.maxAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-white text-sm flex items-center">
                      <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
                      Преимущества плана:
                    </h4>
                    <div className="space-y-2">
                      {plan.features
                        .slice(0, selectedPlan === plan.id ? plan.features.length : 4)
                        .map((feature, index) => (
                          <div 
                            key={index} 
                            className={`flex items-center text-sm text-gray-300 transform transition-all duration-300 delay-${index * 100}`}
                          >
                            <CheckCircle className="h-4 w-4 mr-3 text-green-400 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      {plan.features.length > 4 && selectedPlan !== plan.id && (
                        <div className="text-sm text-blue-400 font-medium flex items-center">
                          <ArrowRight className="h-4 w-4 mr-1" />
                          +{plan.features.length - 4} дополнительных преимуществ
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ROI Calculator */}
                  {selectedPlan === plan.id && (
                    <div className={`mt-6 p-6 bg-gradient-to-r ${plan.darkColor} rounded-2xl border border-gray-600/50 backdrop-blur-sm animate-fadeIn`}>
                      <h4 className="text-white font-semibold mb-4 flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-green-400" />
                        Расчет доходности (мин. сумма)
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Инвестиция:</span>
                          <span className="text-white font-bold text-lg">
                            ${plan.minAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Ежедневно:</span>
                          <span className="text-green-400 font-bold text-lg">
                            ${calculateReturn(plan).daily.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-600/30">
                          <span className="text-gray-300">Общая прибыль:</span>
                          <span className="text-green-400 font-bold text-xl">
                            ${calculateReturn(plan).total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-bold py-4 text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl relative overflow-hidden group`}
                    size="lg"
                  >
                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    <span className="relative flex items-center justify-center">
                      Инвестировать сейчас
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>

                  <div className="text-center">
                    <Badge variant="outline" className="text-xs border-green-500/30 text-green-400 bg-green-500/10">
                      <Shield className="h-3 w-3 mr-1" />
                      Гарантия возврата средств
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Bottom Info Section */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-black/60 via-gray-900/60 to-black/60 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-gray-700/50">
            <h3 className="text-3xl font-bold text-white mb-8 text-center">
              Почему выбирают наши инвестиционные планы?
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl border border-green-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-12 w-12 mx-auto text-green-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-4">100% Безопасность</h4>
                <p className="text-gray-300 leading-relaxed">
                  Ваши инвестиции защищены современными технологиями шифрования и страхованием
                </p>
              </div>
              
              <div className="text-center group">
                <div className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl border border-blue-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-12 w-12 mx-auto text-blue-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-4">Стабильный доход</h4>
                <p className="text-gray-300 leading-relaxed">
                  Ежедневные выплаты без задержек с возможностью реинвестирования
                </p>
              </div>
              
              <div className="text-center group">
                <div className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl border border-purple-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-12 w-12 mx-auto text-purple-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-4">Быстрый старт</h4>
                <p className="text-gray-300 leading-relaxed">
                  Начните получать прибыль уже через 24 часа после инвестирования
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
