"use client"

import { useState, useEffect } from "react"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Clock, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface Transaction {
  id: string
  user_id: string
  type: string
  amount: number
  status: string
  created_at: string
  user_name?: string
}

export function UserActivityRows() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)

        // Загружаем реальные данные активности
        const response = await fetch('/api/user-activity')
        if (response.ok) {
          const data = await response.json()
          if (data.success && Array.isArray(data.data)) {
            const formattedTransactions = data.data.map((activity: any) => ({
              id: activity.id,
              user_id: activity.user_id || 'unknown',
              type: activity.type,
              amount: activity.amount || 0,
              status: activity.status || 'completed',
              created_at: activity.time,
              user_name: activity.user_name || 'Anonymous',
            }))
            setTransactions(formattedTransactions)
          } else {
            setTransactions([])
          }
        } else {
          console.warn("Failed to fetch user activity, showing empty list")
          setTransactions([])
        }
        setError(null)
      } catch (err) {
        console.error("Ошибка загрузки транзакций:", err)
        setError(null)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowUpRight className="h-5 w-5 text-emerald-400" />
      case "withdrawal":
        return <ArrowDownRight className="h-5 w-5 text-red-400" />
      case "investment":
        return <TrendingUp className="h-5 w-5 text-blue-400" />
      default:
        return <TrendingUp className="h-5 w-5 text-purple-400" />
    }
  }

  const getTypeConfig = (type: string) => {
    switch (type) {
      case "deposit":
        return {
          color: "text-emerald-400",
          bgColor: "bg-emerald-500/20",
          borderColor: "border-emerald-500/30",
          label: "Пополнение",
        }
      case "withdrawal":
        return {
          color: "text-red-400",
          bgColor: "bg-red-500/20",
          borderColor: "border-red-500/30",
          label: "Вывод",
        }
      case "investment":
        return {
          color: "text-blue-400",
          bgColor: "bg-blue-500/20",
          borderColor: "border-blue-500/30",
          label: "Инвестиция",
        }
      default:
        return {
          color: "text-purple-400",
          bgColor: "bg-purple-500/20",
          borderColor: "border-purple-500/30",
          label: "Операция",
        }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const formatAmount = (amount: number, type: string) => {
    const prefix = type === "deposit" ? "+" : type === "withdrawal" ? "-" : ""
    return `${prefix}$${amount.toLocaleString()}`
  }

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    const matchesFilter = filterType === "all" || tx.type === filterType
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-t-indigo-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    )
  }

  if (transactions.length === 0) {
    return null
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent mb-6">
            Последние операции
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Актуальная история транзакций на нашей платформе
          </p>
        </div>

        {/* Фильтры */}
        <div className="mb-12 flex flex-col sm:flex-row gap-4 justify-between items-center animate-slide-up">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Поиск по имени пользователя..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-indigo-500/50"
            />
          </div>

          <div className="flex gap-2">
            {[
              { value: "all", label: "Все" },
              { value: "deposit", label: "Пополнения" },
              { value: "withdrawal", label: "Выводы" },
              { value: "investment", label: "Инвестиции" },
            ].map((filter) => (
              <Button
                key={filter.value}
                variant={filterType === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(filter.value)}
                className={`${
                  filterType === filter.value
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Таблица */}
        <div className="overflow-hidden bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-slide-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Пользователь</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Операция</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Сумма</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Время</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.slice(0, 5).map((tx, index) => {
                  const getTypeIcon = () => {
                    switch (tx.type) {
                      case "deposit":
                        return "💰"
                      case "withdrawal":
                        return "💸"
                      case "investment":
                        return "📈"
                      case "profit":
                        return "💎"
                      default:
                        return "💳"
                    }
                  }

                  const getTypeText = () => {
                    switch (tx.type) {
                      case "deposit":
                        return "Пополнение"
                      case "withdrawal":
                        return "Вывод средств"
                      case "investment":
                        return `Инвестиция: ${tx.plan_name || "План"}`
                      case "profit":
                        return "Получение прибыли"
                      default:
                        return "Операция"
                    }
                  }

                  const getAmountColor = () => {
                    switch (tx.type) {
                      case "deposit":
                      case "profit":
                        return "text-green-400"
                      case "withdrawal":
                      case "investment":
                        return "text-blue-400"
                      default:
                        return "text-slate-300"
                    }
                  }

                  return (
                    <tr
                      key={`${tx.id}-${index}`}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                            {tx.user_name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase() || "UN"}
                          </div>
                          <span className="text-white font-medium">{tx.user_name || "Пользователь"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getTypeIcon()}</span>
                          <span className="text-slate-300">{getTypeText()}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`font-bold text-lg ${getAmountColor()}`}>
                          {tx.type === "deposit" || tx.type === "profit" ? "+" : "-"}${tx.amount}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-slate-400">
                          <span className="text-sm font-medium">{formatDate(tx.created_at)}</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            </div>
        </div>

        {/* Кнопка "Показать всех" для транзакций - всегда видна */}
        <div className="mt-8 text-center animate-fade-in-delayed">
          <Link href="/all-transactions">
            <button className="group relative px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-indigo-400/30">
              <span className="relative z-10 flex items-center gap-3">
                📊 Показать все операции ({filteredTransactions.length})
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </button>
          </Link>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-slate-400 text-lg">Операции не найдены</p>
          </div>
        )}

        {/* Информация в подвале */}
        <div className="mt-12 text-center animate-fade-in-delayed">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
            <Clock className="h-4 w-4 text-slate-400" />
            <span className="text-slate-300 text-sm font-medium">
              Показано последних {filteredTransactions.length} операций
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}