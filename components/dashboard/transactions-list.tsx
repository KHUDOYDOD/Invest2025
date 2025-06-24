"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Users, AlertCircle, RefreshCw, Clock } from "lucide-react"
import { toast } from "sonner"

interface Transaction {
  id: string
  type: string
  amount: number | string
  status: string
  description: string
  method?: string
  fee?: number
  final_amount?: number
  created_at: string
}

interface TransactionsListProps {
  userId?: string
  limit?: number
}

export function TransactionsList({ userId, limit = 10 }: TransactionsListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("📊 Loading transactions from API...")

      const response = await fetch("/api/transactions?limit=10")

      if (!response.ok) {
        throw new Error("Ошибка загрузки транзакций")
      }

      const data = await response.json()
      console.log("✅ Transactions loaded:", data.length)

      setTransactions(data || [])
    } catch (err) {
      console.error("❌ Transaction fetch error:", err)
      setError(err instanceof Error ? err.message : "Ошибка загрузки транзакций")
    } finally {
      setLoading(false)
    }
  }

  // Функция для создания тестовой транзакции
  const createTestTransaction = async () => {
    try {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user?.id) {
        toast.error("Необходима авторизация")
        return
      }

      const { data, error } = await supabase.from("transactions").insert([
        {
          user_id: session.user.id,
          type: "deposit",
          amount: Math.floor(Math.random() * 1000) + 100,
          status: "completed",
          description: "Тестовая транзакция",
          method: "Test",
        },
      ])

      if (error) {
        console.error("❌ Error creating test transaction:", error)
        toast.error("Ошибка создания тестовой транзакции")
      } else {
        toast.success("Тестовая транзакция создана!")
        fetchTransactions()
      }
    } catch (error) {
      console.error("❌ Test transaction error:", error)
      toast.error("Ошибка создания тестовой транзакции")
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [userId, limit])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "Неизвестно"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowUpRight className="h-5 w-5 text-green-400" />
      case "withdrawal":
        return <ArrowDownRight className="h-5 w-5 text-red-400" />
      case "investment":
        return <TrendingUp className="h-5 w-5 text-blue-400" />
      case "referral":
        return <Users className="h-5 w-5 text-yellow-400" />
      case "profit":
        return <TrendingUp className="h-5 w-5 text-purple-400" />
      default:
        return <TrendingUp className="h-5 w-5 text-gray-400" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "text-green-400"
      case "withdrawal":
        return "text-red-400"
      case "investment":
        return "text-blue-400"
      case "referral":
        return "text-yellow-400"
      case "profit":
        return "text-purple-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Завершено</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">В обработке</Badge>
      case "failed":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Отклонено</Badge>
      case "active":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Активно</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{status}</Badge>
    }
  }

  const formatAmount = (amount: number, type: string) => {
    const prefix = type === "deposit" || type === "referral" || type === "profit" ? "+" : "-"
    return `${prefix}$${Number(amount).toLocaleString()}`
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case "deposit":
        return "Пополнение"
      case "withdrawal":
        return "Вывод"
      case "investment":
        return "Инвестиция"
      case "referral":
        return "Реферал"
      case "profit":
        return "Прибыль"
      default:
        return type
    }
  }

  const handleRefresh = () => {
    toast.info("Обновление списка транзакций...")
    fetchTransactions()
  }

  if (loading) {
    return (
      <div className="w-full py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-t-blue-600 border-r-transparent border-b-blue-600 border-l-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Загрузка транзакций...</p>
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
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="border-gray-800 text-gray-400 hover:bg-gray-800/50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Попробовать снова
            </Button>
            {currentUserId && (
              <Button
                onClick={createTestTransaction}
                variant="outline"
                className="border-blue-800 text-blue-400 hover:bg-blue-800/50"
              >
                Создать тест
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.length === 0 ? (
        <div className="w-full py-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Clock className="h-12 w-12 text-gray-500" />
            <p className="text-gray-400">У вас пока нет транзакций.</p>
            <p className="text-gray-500 text-sm">
              Пополните баланс или сделайте инвестицию, чтобы увидеть историю операций.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="border-gray-800 text-gray-400 hover:bg-gray-800/50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Обновить
              </Button>
              {currentUserId && (
                <Button
                  onClick={createTestTransaction}
                  variant="outline"
                  className="border-blue-800 text-blue-400 hover:bg-blue-800/50"
                >
                  Создать тест
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm">Показано {transactions.length} транзакций</span>
            <div className="flex gap-2">
              <Button onClick={handleRefresh} size="sm" variant="ghost" className="text-white/70 hover:bg-white/10">
                <RefreshCw className="h-4 w-4 mr-2" />
                Обновить
              </Button>
              {currentUserId && (
                <Button
                  onClick={createTestTransaction}
                  size="sm"
                  variant="ghost"
                  className="text-blue-400 hover:bg-blue-800/20"
                >
                  Тест
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {transactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:bg-gray-900/70 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-gray-800">{getTypeIcon(transaction.type)}</div>
                    <div>
                      <h4 className="text-white font-medium">{getTypeName(transaction.type)}</h4>
                      <p className="text-gray-400 text-sm">{formatDate(transaction.created_at)}</p>
                      {transaction.method && <p className="text-gray-500 text-xs">{transaction.method}</p>}
                      {transaction.description && (
                        <p className="text-gray-500 text-xs mt-1">{transaction.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className={`text-lg font-semibold ${getTypeColor(transaction.type)}`}>
                      {formatAmount(transaction.amount, transaction.type)}
                    </div>
                    {getStatusBadge(transaction.status)}
                    {transaction.fee && Number(transaction.fee) > 0 && (
                      <p className="text-gray-500 text-xs">Комиссия: ${Number(transaction.fee)}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
