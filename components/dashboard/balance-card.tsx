"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  PiggyBank,
  Activity
} from "lucide-react"

interface BalanceData {
  balance: number
  total_invested: number
  total_earned: number
  total_deposits: number
  total_withdrawals: number
  total_profit_earned: number
  active_investments: number
  total_investments: number
  member_since: string
}

export function BalanceCard() {
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBalance()
  }, [])

  const fetchBalance = async () => {
    try {
      const response = await fetch('/api/dashboard/balance')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setBalanceData(data.balance)
        }
      }
    } catch (error) {
      console.error('Error fetching balance:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString))
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!balanceData) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Ошибка загрузки данных баланса</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Основные финансовые карточки */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Текущий баланс */}
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">
              Текущий баланс
            </CardTitle>
            <Wallet className="h-4 w-4 text-blue-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(balanceData.balance)}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Button size="sm" variant="secondary" className="text-xs">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                Пополнить
              </Button>
              <Button size="sm" variant="outline" className="text-xs text-blue-600 border-blue-200">
                <ArrowDownLeft className="h-3 w-3 mr-1" />
                Вывести
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Общие инвестиции */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Инвестировано
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(balanceData.total_invested)}</div>
            <p className="text-xs text-muted-foreground">
              Активных: {balanceData.active_investments} из {balanceData.total_investments}
            </p>
          </CardContent>
        </Card>

        {/* Общая прибыль */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Заработано
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(balanceData.total_earned)}
            </div>
            <p className="text-xs text-muted-foreground">
              Прибыль: {formatCurrency(balanceData.total_profit_earned)}
            </p>
          </CardContent>
        </Card>

        {/* Статистика депозитов/выводов */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Операции
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Пополнено:</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(balanceData.total_deposits)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Выведено:</span>
                <span className="font-medium text-red-600">
                  {formatCurrency(balanceData.total_withdrawals)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Дополнительная информация */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Информация об аккаунте</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Дата регистрации</p>
              <p className="font-medium">{formatDate(balanceData.member_since)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Статус аккаунта</p>
              <Badge variant="default" className="mt-1">
                Активный инвестор
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Доходность</p>
              <p className="font-medium text-green-600">
                {balanceData.total_invested > 0 
                  ? `+${((balanceData.total_earned / balanceData.total_invested) * 100).toFixed(1)}%`
                  : '0%'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}