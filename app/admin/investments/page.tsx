"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InvestmentPlansAdmin } from "@/components/admin/investment-plans"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"

export default function InvestmentsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Управление инвестициями</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Новый план
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Инвестиционные планы</CardTitle>
          <CardDescription>Управление инвестиционными планами платформы</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Активные планы</TabsTrigger>
              <TabsTrigger value="draft">Черновики</TabsTrigger>
              <TabsTrigger value="archived">Архивные</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-4">
              <InvestmentPlansAdmin />
            </TabsContent>
            <TabsContent value="draft" className="mt-4">
              <div className="text-center py-8 text-slate-500">Нет черновиков планов</div>
            </TabsContent>
            <TabsContent value="archived" className="mt-4">
              <div className="text-center py-8 text-slate-500">Нет архивных планов</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Активные инвестиции пользователей</CardTitle>
          <CardDescription>Все текущие инвестиции пользователей</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="h-12 px-4 text-left font-medium">ID</th>
                  <th className="h-12 px-4 text-left font-medium">Пользователь</th>
                  <th className="h-12 px-4 text-left font-medium">План</th>
                  <th className="h-12 px-4 text-left font-medium">Сумма</th>
                  <th className="h-12 px-4 text-left font-medium">Дата начала</th>
                  <th className="h-12 px-4 text-left font-medium">Статус</th>
                  <th className="h-12 px-4 text-left font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-4 align-middle">{1000 + i}</td>
                    <td className="p-4 align-middle">Пользователь {i + 1}</td>
                    <td className="p-4 align-middle">{["Базовый", "Стандарт", "Премиум"][i % 3]}</td>
                    <td className="p-4 align-middle">${(1000 * (i + 1)).toLocaleString()}</td>
                    <td className="p-4 align-middle">{new Date(2023, 5 + i, 10 + i).toLocaleDateString("ru-RU")}</td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          i % 3 === 0
                            ? "bg-green-100 text-green-800"
                            : i % 3 === 1
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {i % 3 === 0 ? "Активен" : i % 3 === 1 ? "В обработке" : "Завершен"}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <Button variant="ghost" size="sm">
                        Подробнее
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
