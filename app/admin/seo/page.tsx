"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Save, Search, TrendingUp, Eye, MousePointer } from "lucide-react"

export default function SEOPage() {
  const [metaData, setMetaData] = useState({
    title: "InvestPro - Надежная инвестиционная платформа",
    description: "Инвестируйте с гарантированной доходностью. Безопасные инвестиции с высокой прибылью.",
    keywords: "инвестиции, доходность, прибыль, инвестиционная платформа",
  })

  const [seoMetrics] = useState([
    { page: "Главная", views: 15420, clicks: 1240, ctr: "8.04%" },
    { page: "Инвестиционные планы", views: 8930, clicks: 890, ctr: "9.97%" },
    { page: "О компании", views: 3450, clicks: 210, ctr: "6.09%" },
    { page: "Контакты", views: 2100, clicks: 150, ctr: "7.14%" },
  ])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">SEO управление</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Органический трафик</p>
                <p className="text-2xl font-bold">24,567</p>
                <p className="text-sm text-green-600">+12.5%</p>
              </div>
              <Search className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Позиции в ТОП-10</p>
                <p className="text-2xl font-bold">47</p>
                <p className="text-sm text-green-600">+8</p>
              </div>
              <TrendingUp className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Показы</p>
                <p className="text-2xl font-bold">156,890</p>
                <p className="text-sm text-green-600">+15.2%</p>
              </div>
              <Eye className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">CTR</p>
                <p className="text-2xl font-bold">8.4%</p>
                <p className="text-sm text-green-600">+0.8%</p>
              </div>
              <MousePointer className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="meta" className="w-full">
        <TabsList className="grid grid-cols-4 w-[600px]">
          <TabsTrigger value="meta">Мета-теги</TabsTrigger>
          <TabsTrigger value="keywords">Ключевые слова</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          <TabsTrigger value="sitemap">Карта сайта</TabsTrigger>
        </TabsList>

        <TabsContent value="meta" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Мета-теги страниц</CardTitle>
              <CardDescription>Управление мета-информацией для поисковых систем</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title (заголовок)</label>
                <Input value={metaData.title} onChange={(e) => setMetaData({ ...metaData, title: e.target.value })} />
                <p className="text-xs text-slate-500">Длина: {metaData.title.length}/60 символов</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description (описание)</label>
                <Textarea
                  value={metaData.description}
                  onChange={(e) => setMetaData({ ...metaData, description: e.target.value })}
                  rows={3}
                />
                <p className="text-xs text-slate-500">Длина: {metaData.description.length}/160 символов</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Keywords (ключевые слова)</label>
                <Textarea
                  value={metaData.keywords}
                  onChange={(e) => setMetaData({ ...metaData, keywords: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Open Graph изображение</label>
                <Input placeholder="URL изображения для социальных сетей" />
              </div>

              <Button>
                <Save className="h-4 w-4 mr-2" />
                Сохранить мета-теги
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Ключевые слова</CardTitle>
              <CardDescription>Мониторинг позиций по ключевым словам</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <span className="font-medium">инвестиционная платформа</span>
                    <p className="text-sm text-slate-600">Позиция: 3</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">ТОП-10</Badge>
                </div>

                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <span className="font-medium">надежные инвестиции</span>
                    <p className="text-sm text-slate-600">Позиция: 7</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">ТОП-10</Badge>
                </div>

                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <span className="font-medium">высокая доходность</span>
                    <p className="text-sm text-slate-600">Позиция: 15</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">ТОП-20</Badge>
                </div>

                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <span className="font-medium">пассивный доход</span>
                    <p className="text-sm text-slate-600">Позиция: 25</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">ТОП-50</Badge>
                </div>
              </div>

              <div className="mt-6">
                <Button>Добавить ключевое слово</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO аналитика</CardTitle>
              <CardDescription>Статистика поисковой оптимизации</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seoMetrics.map((metric, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{metric.page}</h3>
                    </div>
                    <div className="flex space-x-8 text-sm">
                      <div className="text-center">
                        <p className="text-slate-600">Показы</p>
                        <p className="font-semibold">{metric.views.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-600">Клики</p>
                        <p className="font-semibold">{metric.clicks.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-600">CTR</p>
                        <p className="font-semibold">{metric.ctr}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sitemap" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Карта сайта</CardTitle>
              <CardDescription>Управление XML sitemap</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium mb-2">Текущая карта сайта:</p>
                <p className="text-sm text-slate-600">https://investpro.com/sitemap.xml</p>
                <p className="text-xs text-slate-400">Последнее обновление: 15.01.2025</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Частота обновления</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="daily">Ежедневно</option>
                  <option value="weekly">Еженедельно</option>
                  <option value="monthly">Ежемесячно</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Автоматическое обновление</label>
                <input type="checkbox" defaultChecked />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Исключить страницы</label>
                <Textarea placeholder="/admin/*&#10;/test/*&#10;/private/*" rows={3} />
              </div>

              <div className="flex space-x-4">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Обновить карту сайта
                </Button>
                <Button variant="outline">Скачать sitemap.xml</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
