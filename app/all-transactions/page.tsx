
"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Search, Filter, Download, Eye, TrendingUp, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { motion } from "framer-motion"

interface Transaction {
  id: string
  user_id: string
  type: string
  amount: number
  status: string
  created_at: string
  user_name?: string
  plan_name?: string
}

export default function AllTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("latest")

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/user-activity')
        if (response.ok) {
          const data = await response.json()
          if (data.success && Array.isArray(data.data)) {
            setTransactions(data.data)
          }
        }
      } catch (err) {
        console.error("Ошибка загрузки:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deposit": return "💰"
      case "withdrawal": return "💸"
      case "investment": return "📈"
      case "profit": return "💎"
      default: return "💳"
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "deposit": return "Пополнение"
      case "withdrawal": return "Вывод средств"
      case "investment": return "Инвестиция"
      case "profit": return "Получение прибыли"
      default: return "Операция"
    }
  }

  const getAmountColor = (type: string) => {
    switch (type) {
      case "deposit":
      case "profit":
        return "text-emerald-400"
      case "withdrawal":
      case "investment":
        return "text-blue-400"
      default:
        return "text-slate-300"
    }
  }

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    const matchesFilter = filterType === "all" || tx.type === filterType
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-indigo-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-xl">Загрузка операций...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Назад
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent">
                  Все операции
                </h1>
                <p className="text-slate-400 mt-2">Полная история транзакций платформы</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Экспорт
            </Button>
          </div>
        </motion.div>

        {/* Статистика */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Всего операций</p>
                <p className="text-2xl font-bold text-white">{filteredTransactions.length}</p>
              </div>
              <div className="p-3 bg-indigo-500/20 rounded-xl">
                <Eye className="h-6 w-6 text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Пополнений</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {filteredTransactions.filter(t => t.type === 'deposit').length}
                </p>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <TrendingUp className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Инвестиций</p>
                <p className="text-2xl font-bold text-blue-400">
                  {filteredTransactions.filter(t => t.type === 'investment').length}
                </p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Выводов</p>
                <p className="text-2xl font-bold text-purple-400">
                  {filteredTransactions.filter(t => t.type === 'withdrawal').length}
                </p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Clock className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Фильтры */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-col lg:flex-row gap-4 justify-between items-center"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Поиск по имени пользователя..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-indigo-500/50"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {[
              { value: "all", label: "Все", color: "indigo" },
              { value: "deposit", label: "Пополнения", color: "emerald" },
              { value: "withdrawal", label: "Выводы", color: "purple" },
              { value: "investment", label: "Инвестиции", color: "blue" },
            ].map((filter) => (
              <Button
                key={filter.value}
                variant={filterType === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(filter.value)}
                className={`${
                  filterType === filter.value
                    ? `bg-gradient-to-r from-${filter.color}-500 to-${filter.color}-600 text-white`
                    : "bg-white/10 border-white/20 text-slate-300 hover:bg-white/20"
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                {filter.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Таблица операций */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left py-6 px-8 text-slate-300 font-semibold">Пользователь</th>
                  <th className="text-left py-6 px-8 text-slate-300 font-semibold">Операция</th>
                  <th className="text-left py-6 px-8 text-slate-300 font-semibold">Сумма</th>
                  <th className="text-left py-6 px-8 text-slate-300 font-semibold">Дата</th>
                  <th className="text-left py-6 px-8 text-slate-300 font-semibold">Статус</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx, index) => (
                  <motion.tr
                    key={`${tx.id}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-all duration-300 group"
                  >
                    <td className="py-6 px-8">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold">
                          {tx.user_name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase() || "UN"}
                        </div>
                        <div>
                          <span className="text-white font-medium text-lg">{tx.user_name || "Пользователь"}</span>
                          <p className="text-slate-400 text-sm">ID: {tx.user_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getTypeIcon(tx.type)}</span>
                        <div>
                          <span className="text-white font-medium">{getTypeText(tx.type)}</span>
                          {tx.plan_name && (
                            <p className="text-slate-400 text-sm">{tx.plan_name}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <span className={`font-bold text-xl ${getAmountColor(tx.type)}`}>
                        {tx.type === "deposit" || tx.type === "profit" ? "+" : "-"}${tx.amount}
                      </span>
                    </td>
                    <td className="py-6 px-8">
                      <div className="text-slate-300">
                        <span className="font-medium">{formatDate(tx.created_at)}</span>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        ✓ Завершено
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-slate-400 text-xl">Операции не найдены</p>
              <p className="text-slate-500 mt-2">Попробуйте изменить параметры поиска</p>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex justify-center"
          >
            <div className="flex items-center gap-2">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Предыдущая
              </Button>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((page) => (
                  <Button
                    key={page}
                    variant={page === 1 ? "default" : "outline"}
                    size="sm"
                    className={page === 1 ? "bg-indigo-600 text-white" : "bg-white/10 border-white/20 text-white hover:bg-white/20"}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Следующая
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
