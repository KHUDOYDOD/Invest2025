"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RecentTransactions } from "@/components/admin/recent-transactions"
import { Search, Download, Calendar } from "lucide-react"

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [transactionType, setTransactionType] = useState("all")
  const [dateRange, setDateRange] = useState("all")

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Транзакции</h1>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Экспорт
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Все транзакции</CardTitle>
          <CardDescription>Просмотр и управление транзакциями пользователей</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Поиск транзакций..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Тип транзакции" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все типы</SelectItem>
                  <SelectItem value="deposit">Пополнение</SelectItem>
                  <SelectItem value="withdraw">Вывод</SelectItem>
                  <SelectItem value="investment">Инвестиция</SelectItem>
                  <SelectItem value="profit">Прибыль</SelectItem>
                  <SelectItem value="referral">Реферальные</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Период" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все время</SelectItem>
                  <SelectItem value="today">Сегодня</SelectItem>
                  <SelectItem value="week">Эта неделя</SelectItem>
                  <SelectItem value="month">Этот месяц</SelectItem>
                  <SelectItem value="custom">Выбрать период</SelectItem>
                </SelectContent>
              </Select>

              {dateRange === "custom" && (
                <Button variant="outline" size="icon">
                  <Calendar className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <RecentTransactions searchQuery={searchQuery} transactionType={transactionType} dateRange={dateRange} />
        </CardContent>
      </Card>
    </div>
  )
}
