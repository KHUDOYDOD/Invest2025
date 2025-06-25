"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, Plus, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"

interface Transaction {
  id: string
  type: string
  amount: number
  status: string
  created_at: string
  description?: string
  payment_method?: string
  plan_name?: string
}

interface TransactionsListProps {
  userId: string
  limit?: number
}

export function TransactionsList({ userId, limit = 5 }: TransactionsListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId && userId.trim() !== "") {
      fetchTransactions()
    }
  }, [userId, limit])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Fetching transactions for userId:', userId)
      
      const response = await fetch(`/api/transactions?userId=${userId}&limit=${limit}`)
      const data = await response.json()

      console.log('Transactions API response:', data)

      if (data.success) {
        setTransactions(data.transactions || [])
      } else {
        console.error('Transactions API error:', data.error)
        setError(data.error || 'Ошибка загрузки транзакций')
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
      setError('Ошибка соединения с сервером')
    } finally {
      setLoading(false)
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4" />
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4" />
      case "investment":
        return <Plus className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "text-green-400 bg-green-500/20"
      case "withdrawal":
        return "text-red-400 bg-red-500/20"
      case "investment":
        return "text-blue-400 bg-blue-500/20"
      default:
        return "text-gray-400 bg-gray-500/20"
    }
  }

  const getTransactionTitle = (transaction: Transaction) => {
    switch (transaction.type) {
      case "deposit":
        return "Пополнение баланса"
      case "withdrawal":
        return "Вывод средств"
      case "investment":
        return transaction.plan_name ? `Инвестиция в "${transaction.plan_name}"` : "Инвестиция"
      default:
        return transaction.description || "Транзакция"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle2 className="h-3 w-3" />
      case "pending":
        return <Clock className="h-3 w-3" />
      case "failed":
        return <XCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "Завершена"
      case "pending":
        return "В обработке"
      case "failed":
        return "Отклонена"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/10 rounded-full" />
              <div className="space-y-2">
                <div className="w-32 h-4 bg-white/10 rounded" />
                <div className="w-20 h-3 bg-white/5 rounded" />
              </div>
            </div>
            <div className="w-16 h-4 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 mb-4">{error}</p>
        <Button onClick={fetchTransactions} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Повторить
        </Button>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400 mb-2">У вас пока нет транзакций</p>
        <p className="text-gray-500 text-sm">
          Пополните баланс или сделайте инвестицию, чтобы увидеть историю операций
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction, index) => (
        <motion.div
          key={transaction.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${getTransactionColor(transaction.type)}`}>
              {getTransactionIcon(transaction.type)}
            </div>
            <div>
              <p className="text-white font-medium">
                {getTransactionTitle(transaction)}
              </p>
              <p className="text-white/60 text-sm">
                {new Date(transaction.created_at).toLocaleDateString("ru-RU", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {transaction.payment_method && (
                <p className="text-white/40 text-xs">
                  {transaction.payment_method === 'balance' ? 'С баланса' : 
                   transaction.payment_method === 'bank_transfer' ? 'Банковский перевод' :
                   transaction.payment_method === 'card' ? 'Банковская карта' : 
                   transaction.payment_method}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className={`font-semibold ${
                transaction.type === 'deposit' || transaction.type === 'profit' ? 'text-green-400' :
                transaction.type === 'withdrawal' || transaction.type === 'investment' ? 'text-red-400' :
                'text-white'
              }`}>
                {transaction.type === 'deposit' || transaction.type === 'profit' ? '+' : '-'}
                ${Number(transaction.amount).toFixed(2)}
              </p>
              <div className="flex items-center space-x-1">
                {getStatusIcon(transaction.status)}
                <Badge variant={getStatusVariant(transaction.status)} className="text-xs">
                  {getStatusText(transaction.status)}
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}