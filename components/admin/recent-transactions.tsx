"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowDownIcon, ArrowUpIcon, CheckCircle2, Clock, AlertCircle } from "lucide-react"

// Типы транзакций
type TransactionStatus = "completed" | "pending" | "failed"
type TransactionType = "deposit" | "withdrawal"

interface Transaction {
  id: string
  userId: string
  userName: string
  amount: number
  type: TransactionType
  status: TransactionStatus
  date: string
  method: string
}

// Генерация реалистичных данных для транзакций
const generateMockTransactions = (): Transaction[] => {
  const methods = ["Visa", "MasterCard", "PayPal", "Bitcoin", "Ethereum", "Bank Transfer"]
  const statuses: TransactionStatus[] = ["completed", "pending", "failed"]
  const types: TransactionType[] = ["deposit", "withdrawal"]
  const names = [
    "Иван Петров",
    "Анна Смирнова",
    "Алексей Иванов",
    "Мария Кузнецова",
    "Дмитрий Соколов",
    "Елена Новикова",
    "Сергей Морозов",
    "Ольга Волкова",
    "Николай Зайцев",
    "Татьяна Павлова",
    "Андрей Семенов",
    "Юлия Голубева",
  ]

  return Array.from({ length: 10 }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const method = methods[Math.floor(Math.random() * methods.length)]
    const name = names[Math.floor(Math.random() * names.length)]
    const amount = Math.floor(Math.random() * 9000) + 1000

    // Генерация даты за последние 7 дней
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 7))

    return {
      id: `TRX-${Math.floor(Math.random() * 10000)}`,
      userId: `USR-${Math.floor(Math.random() * 10000)}`,
      userName: name,
      amount,
      type,
      status,
      date: date.toISOString().split("T")[0],
      method,
    }
  })
}

// Компонент для отображения статуса транзакции
const StatusBadge = ({ status }: { status: TransactionStatus }) => {
  switch (status) {
    case "completed":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Завершено
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
          <Clock className="h-3 w-3" />В обработке
        </Badge>
      )
    case "failed":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Ошибка
        </Badge>
      )
  }
}

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    // Генерация данных при монтировании компонента
    setTransactions(generateMockTransactions())
  }, [])

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Пользователь</TableHead>
            <TableHead>Тип</TableHead>
            <TableHead>Сумма</TableHead>
            <TableHead>Метод</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead>Статус</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TableRow key={transaction.id} className="hover:bg-slate-50">
                <TableCell className="font-mono text-xs">{transaction.id}</TableCell>
                <TableCell>{transaction.userName}</TableCell>
                <TableCell>
                  {transaction.type === "deposit" ? (
                    <span className="flex items-center text-green-600">
                      <ArrowDownIcon className="mr-1 h-4 w-4" />
                      Пополнение
                    </span>
                  ) : (
                    <span className="flex items-center text-blue-600">
                      <ArrowUpIcon className="mr-1 h-4 w-4" />
                      Вывод
                    </span>
                  )}
                </TableCell>
                <TableCell className="font-medium">${transaction.amount.toLocaleString()}</TableCell>
                <TableCell>{transaction.method}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>
                  <StatusBadge status={transaction.status} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                Нет данных о транзакциях
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
