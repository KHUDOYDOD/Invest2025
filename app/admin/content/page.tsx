"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Plus, Edit, Trash2 } from "lucide-react"

export default function ContentPage() {
  const [heroContent, setHeroContent] = useState({
    title: "Инвестируйте в будущее с InvestPro",
    subtitle: "Надежная платформа для инвестиций с гарантированной доходностью",
    buttonText: "Начать инвестировать",
  })

  const [aboutContent, setAboutContent] = useState({
    title: "О нашей компании",
    description: "Мы предоставляем надежные инвестиционные решения уже более 5 лет...",
    features: ["Высокая доходность", "Безопасность", "Поддержка 24/7"],
  })

  const [newsItems, setNewsItems] = useState([
    { id: 1, title: "Новый инвестиционный план", content: "Представляем новый план...", date: "2025-01-15" },
    { id: 2, title: "Обновление платформы", content: "Улучшили интерфейс...", date: "2025-01-10" },
  ])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Управление контентом</h1>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid grid-cols-5 w-[800px]">
          <TabsTrigger value="hero">Главная секция</TabsTrigger>
          <TabsTrigger value="about">О компании</TabsTrigger>
          <TabsTrigger value="news">Новости</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="testimonials">Отзывы</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Главная секция (Hero)</CardTitle>
              <CardDescription>Редактирование главного баннера сайта</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero-title">Заголовок</Label>
                <Input
                  id="hero-title"
                  value={heroContent.title}
                  onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-subtitle">Подзаголовок</Label>
                <Textarea
                  id="hero-subtitle"
                  value={heroContent.subtitle}
                  onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-button">Текст кнопки</Label>
                <Input
                  id="hero-button"
                  value={heroContent.buttonText}
                  onChange={(e) => setHeroContent({ ...heroContent, buttonText: e.target.value })}
                />
              </div>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Сохранить изменения
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>О компании</CardTitle>
              <CardDescription>Редактирование информации о компании</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about-title">Заголовок</Label>
                <Input
                  id="about-title"
                  value={aboutContent.title}
                  onChange={(e) => setAboutContent({ ...aboutContent, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-description">Описание</Label>
                <Textarea
                  id="about-description"
                  rows={5}
                  value={aboutContent.description}
                  onChange={(e) => setAboutContent({ ...aboutContent, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Преимущества</Label>
                {aboutContent.features.map((feature, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...aboutContent.features]
                        newFeatures[index] = e.target.value
                        setAboutContent({ ...aboutContent, features: newFeatures })
                      }}
                    />
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить преимущество
                </Button>
              </div>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Сохранить изменения
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Новости</CardTitle>
              <CardDescription>Управление новостями и объявлениями</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить новость
                </Button>
              </div>
              <div className="space-y-4">
                {newsItems.map((news) => (
                  <Card key={news.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold">{news.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">{news.content}</p>
                          <p className="text-xs text-slate-400 mt-2">{news.date}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Часто задаваемые вопросы</CardTitle>
              <CardDescription>Управление FAQ секцией</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить вопрос
                </Button>
              </div>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">Как начать инвестировать?</h3>
                        <p className="text-sm text-slate-600 mt-1">
                          Зарегистрируйтесь на платформе, пополните счет и выберите подходящий инвестиционный план.
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Отзывы клиентов</CardTitle>
              <CardDescription>Управление отзывами пользователей</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить отзыв
                </Button>
              </div>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">Иван Петров</h3>
                        <p className="text-sm text-slate-600 mt-1">
                          "Отличная платформа для инвестиций. Получаю стабильный доход уже 6 месяцев."
                        </p>
                        <div className="flex text-yellow-400 mt-2">★★★★★</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
