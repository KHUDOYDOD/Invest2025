"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, TrendingUp, Shield, Clock, Star, Zap } from "lucide-react"

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
    color: "from-blue-500 to-cyan-500",
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
    color: "from-green-500 to-emerald-500",
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
    color: "from-purple-500 to-pink-500",
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
    color: "from-yellow-500 to-orange-500",
  },
]

export function InvestmentPlans() {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Инвестиционные планы</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Выберите подходящий план инвестирования и начните получать стабильный пассивный доход уже сегодня
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2 text-green-500" />
              Гарантированная безопасность
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
              Стабильная доходность
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-purple-500" />
              Ежедневные выплаты
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
          {investmentPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer ${
                selectedPlan === plan.id
                  ? "border-blue-500 shadow-xl scale-105"
                  : "border-slate-200 hover:border-slate-300"
              } ${plan.popular ? "ring-2 ring-green-500" : ""}`}
              onClick={() => setSelectedPlan(selectedPlan === plan.id ? null : plan.id)}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                  <Star className="h-3 w-3 inline mr-1" />
                  ПОПУЛЯРНЫЙ
                </div>
              )}

              <div className={`h-2 bg-gradient-to-r ${plan.color}`} />

              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-slate-900 flex items-center">
                  {plan.name}
                  {plan.id === 4 && <Zap className="h-5 w-5 ml-2 text-yellow-500" />}
                </CardTitle>
                <CardDescription className="text-slate-600 text-sm leading-relaxed">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-3xl font-bold text-slate-900 mb-1">{plan.dailyProfit}%</div>
                  <div className="text-sm text-slate-600">ежедневно</div>
                  <div className="text-lg font-semibold text-green-600 mt-2">
                    {plan.totalProfit}% за {plan.duration} дней
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Минимум:</span>
                    <span className="font-semibold">${plan.minAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Максимум:</span>
                    <span className="font-semibold">${plan.maxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Срок:</span>
                    <span className="font-semibold">{plan.duration} дней</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900 text-sm">Преимущества плана:</h4>
                  <div className="space-y-1">
                    {plan.features
                      .slice(0, selectedPlan === plan.id ? plan.features.length : 3)
                      .map((feature, index) => (
                        <div key={index} className="flex items-center text-xs text-slate-600">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-500 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    {plan.features.length > 3 && selectedPlan !== plan.id && (
                      <div className="text-xs text-blue-600 font-medium">
                        +{plan.features.length - 3} дополнительных преимуществ
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-semibold py-3 transition-all duration-300`}
                  size="lg"
                >
                  Инвестировать сейчас
                </Button>

                <div className="text-center">
                  <Badge variant="outline" className="text-xs">
                    Гарантия возврата средств
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Почему выбирают наши инвестиционные планы?</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto mb-3 text-green-500" />
                <h4 className="font-semibold mb-2">100% Безопасность</h4>
                <p className="text-slate-600">Ваши инвестиции защищены современными технологиями</p>
              </div>
              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-3 text-blue-500" />
                <h4 className="font-semibold mb-2">Стабильный доход</h4>
                <p className="text-slate-600">Ежедневные выплаты без задержек и комиссий</p>
              </div>
              <div className="text-center">
                <Clock className="h-8 w-8 mx-auto mb-3 text-purple-500" />
                <h4 className="font-semibold mb-2">Быстрый старт</h4>
                <p className="text-slate-600">Начните получать прибыль уже через 24 часа</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
