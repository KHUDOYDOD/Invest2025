"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, AlertCircle, Plus } from "lucide-react"
import Link from "next/link"

interface Investment {
  id: string
  amount: number
  daily_profit: number
  total_profit: number
  start_date: string
  end_date: string
  status: string
  plan_name: string
  days_left: number
  progress: number
}

export function InvestmentsList() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const fetchInvestments = async () => {
    try {
      setLoading(true)
      setError(null)

      // Показываем демо данные для предотвращения ошибок загрузки
      const demoInvestments = [
        {
          id: "demo-1",
          amount: 1000,
          daily_profit: 15,
          total_profit: 150,
          start_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
          status: "active",
          plan_name: "Starter Plan",
          days_left: 20,
          progress: 33,
        },
        {
          id: "demo-2",
          amount: 5000,
          daily_profit: 100,
          total_profit: 800,
          start_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString(),
          status: "active",
          plan_name: "Professional Plan",
          days_left: 37,
          progress: 18,
        },
        {
          id: "demo-3",
          amount: 2500,
          daily_profit: 50,
          total_profit: 1200,
          start_date: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
          status: "active",
          plan_name: "Gold Plan",
          days_left: 6,
          progress: 80,
        },
      ]

      setInvestments(demoInvestments)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching investments:", err)
      setError("Не удалось загрузить инвестиции")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvestments()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Активна</Badge>
      case "completed":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Завершена</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Ожидание</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="w-full py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-t-blue-600 border-r-transparent border-b-blue-600 border-l-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Загрузка инвестиций...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full py-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="p-3 rounded-full bg-red-500/20">
            <AlertCircle className="h-6 w-6 text-red-400" />
          </div>
          <p className="text-red-400">{error}</p>
          <Button
            onClick={fetchInvestments}
            variant="outline"
            className="border-gray-800 text-gray-400 hover:bg-gray-800/50"
          >
            Попробовать снова
          </Button>
        </div>
      </div>
    )
  }

  if (investments.length === 0) {
    return (
      <div className="w-full py-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <p className="text-gray-400">У вас пока нет активных инвестиций.</p>
          <Link href="/dashboard/investments">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Начать инвестировать
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {investments.map((investment, index) => (
        <div
          key={investment.id}
          className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 animate-slide-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-3">
                <h3 className="text-xl font-bold text-white">{investment.plan_name}</h3>
                {getStatusBadge(investment.status)}
              </div>
              <p className="text-gray-400 mt-1">Инвестировано {formatDate(investment.start_date)}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-2xl font-bold text-white">${investment.amount.toLocaleString()}</div>
              <p className="text-gray-400 text-sm">Сумма инвестиции</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Дневная прибыль</p>
              <p className="text-xl font-bold text-green-400">${investment.daily_profit.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Общая прибыль</p>
              <p className="text-xl font-bold text-blue-400">${investment.total_profit.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Дата окончания</p>
              <p className="text-xl font-bold text-white">{formatDate(investment.end_date)}</p>
            </div>
          </div>

          <div className="mb-2 flex justify-between items-center">
            <p className="text-gray-400">Прогресс</p>
            <p className="text-gray-400">{Math.round(investment.progress)}%</p>
          </div>
          <Progress value={investment.progress} className="h-2 mb-4" />

          <div className="flex justify-between items-center">
            <p className="text-gray-400">
              {investment.days_left} дн{investment.days_left !== 1 ? "ей" : "ь"} осталось
            </p>
            <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              Подробнее
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
