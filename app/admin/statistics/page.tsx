"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, TrendingDown, Users, DollarSign, Activity, Eye } from "lucide-react"

export default function StatisticsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Статистика и аналитика</h1>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Экспорт отчета
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Посещения сегодня</p>
                <p className="text-2xl font-bold">2,847</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12.5%
                </p>
              </div>
              <Eye className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Новые регистрации</p>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8.2%
                </p>
              </div>
              <Users className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Депозиты за день</p>
                <p className="text-2xl font-bold">$45,230</p>
                <p className="text-sm text-red-600 flex items-center">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  -3.1%
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Активные инвестиции</p>
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +5.7%
                </p>
              </div>
              <Activity className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 w-[600px]">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="financial">Финансы</TabsTrigger>
          <TabsTrigger value="traffic">Трафик</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Доходы по месяцам</CardTitle>
                <CardDescription>Динамика доходов за последние 12 месяцев</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center bg-slate-50 text-slate-400">
                [График доходов по месяцам]
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Регистрации пользователей</CardTitle>
                <CardDescription>Количество новых пользователей по дням</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center bg-slate-50 text-slate-400">
                [График регистраций]
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>География пользователей</CardTitle>
                <CardDescription>Распределение пользователей по странам</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center bg-slate-50 text-slate-400">
                [Карта пользователей]
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Активность пользователей</CardTitle>
                <CardDescription>Онлайн активность по часам</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center bg-slate-50 text-slate-400">
                [График активности]
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Депозиты vs Выводы</CardTitle>
                <CardDescription>Сравнение входящих и исходящих средств</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center bg-slate-50 text-slate-400">
                [График депозитов и выводов]
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Популярные планы</CardTitle>
                <CardDescription>Распределение инвестиций по планам</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center bg-slate-50 text-slate-400">
                [Круговая диаграмма планов]
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Источники трафика</CardTitle>
                <CardDescription>Откуда приходят пользователи</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center bg-slate-50 text-slate-400">
                [График источников трафика]
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Конверсия</CardTitle>
                <CardDescription>Воронка конверсии пользователей</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center bg-slate-50 text-slate-400">
                [Воронка конверсии]
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
