"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Eye, Check, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AdvancedFilters } from "./advanced-filters"

interface Transaction {
  id: string
  user_id: string
  user_name: string
  user_email: string
  amount: number
  type: string
  status: string
  created_at: string
  method: string
  description: string
  fee: number
  final_amount: number
}

export function TransactionsList() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<any>({})
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })

  useEffect(() => {
    fetchTransactions()
  }, [filters, pagination.page])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: filters.search || "",
        transactionType: filters.transactionType || "all",
        status: filters.status || "all",
        sortBy: filters.sortBy || "created_at",
        sortOrder: filters.sortOrder || "desc"
      })

      if (filters.amountMin) params.append('amountMin', filters.amountMin)
      if (filters.amountMax) params.append('amountMax', filters.amountMax)
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom.toISOString())
      if (filters.dateTo) params.append('dateTo', filters.dateTo.toISOString())

      const response = await fetch(`/api/admin/transactions?${params}`)
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        search: filters.search || "",
        transactionType: filters.transactionType || "all",
        status: filters.status || "all",
        export: "true"
      })

      if (filters.amountMin) params.append('amountMin', filters.amountMin)
      if (filters.amountMax) params.append('amountMax', filters.amountMax)
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom.toISOString())
      if (filters.dateTo) params.append('dateTo', filters.dateTo.toISOString())

      const response = await fetch(`/api/admin/transactions/export?${params}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `transactions_export_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Error exporting transactions:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Завершено</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">В ожидании</Badge>
      case "failed":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Ошибка</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "deposit": return "Пополнение"
      case "withdrawal": return "Вывод"
      case "investment": return "Инвестиция"
      case "profit": return "Прибыль"
      case "referral": return "Реферал"
      default: return type
    }
  }

  return (
    <div className="space-y-6">
      <AdvancedFilters
        filterType="transactions"
        onFiltersChange={handleFiltersChange}
        onExport={handleExport}
        totalCount={pagination.total}
        isLoading={loading}
      />

      <Card>
        <CardHeader>
          <CardTitle>Транзакции системы</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Нет транзакций для отображения
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Метод</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-xs">
                        {transaction.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{transaction.user_name}</span>
                          <span className="text-sm text-muted-foreground">{transaction.user_email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getTypeLabel(transaction.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${transaction.amount.toLocaleString()}
                        {transaction.fee > 0 && (
                          <div className="text-xs text-muted-foreground">
                            Комиссия: ${transaction.fee}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(transaction.status)}
                      </TableCell>
                      <TableCell>
                        {new Date(transaction.created_at).toLocaleDateString('ru-RU')}
                        <div className="text-xs text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleTimeString('ru-RU')}
                        </div>
                      </TableCell>
                      <TableCell>{transaction.method || "-"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Просмотр
                            </DropdownMenuItem>
                            {transaction.status === "pending" && (
                              <>
                                <DropdownMenuItem>
                                  <Check className="mr-2 h-4 w-4" />
                                  Подтвердить
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <X className="mr-2 h-4 w-4" />
                                  Отклонить
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Пагинация */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Показано {transactions.length} из {pagination.total} транзакций
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={!pagination.hasPrev}
                  >
                    Назад
                  </Button>
                  <span className="px-3 py-2 text-sm">
                    {pagination.page} из {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={!pagination.hasNext}
                  >
                    Далее
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}