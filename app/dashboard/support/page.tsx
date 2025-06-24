"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardNav } from "@/components/dashboard/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { HelpCircle, MessageCircle, Phone, Mail } from "lucide-react"

function SupportContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <DashboardHeader />

      <div className="flex">
        <DashboardNav activeItem="support" />

        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-white">Поддержка</h1>
              <p className="text-white/70 text-lg">Мы готовы помочь вам 24/7</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <CardTitle className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Написать в поддержку
                  </CardTitle>
                  <CardDescription className="text-white/90">Опишите вашу проблему, и мы поможем</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="subject" className="text-white">
                      Тема обращения
                    </Label>
                    <Input
                      id="subject"
                      placeholder="Кратко опишите проблему"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-white">
                      Сообщение
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Подробно опишите вашу проблему..."
                      className="bg-white/10 border-white/20 text-white min-h-[120px]"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">Отправить сообщение</Button>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                    <CardTitle className="flex items-center">
                      <Phone className="h-5 w-5 mr-2" />
                      Контакты
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-white font-medium">Телефон</p>
                        <p className="text-white/70">+7 (800) 123-45-67</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-white font-medium">Email</p>
                        <p className="text-white/70">support@investpro.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                  <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                    <CardTitle className="flex items-center">
                      <HelpCircle className="h-5 w-5 mr-2" />
                      Часто задаваемые вопросы
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <p className="text-white font-medium mb-2">Как пополнить баланс?</p>
                      <p className="text-white/70 text-sm">
                        Перейдите в раздел "Пополнить" и выберите удобный способ оплаты.
                      </p>
                    </div>
                    <div>
                      <p className="text-white font-medium mb-2">Сколько времени занимает вывод?</p>
                      <p className="text-white/70 text-sm">Обычно вывод средств занимает от 1 до 24 часов.</p>
                    </div>
                    <div>
                      <p className="text-white font-medium mb-2">Как работает реферальная программа?</p>
                      <p className="text-white/70 text-sm">Приглашайте друзей и получайте 5% от их депозитов.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function SupportPage() {
  return (
    <AuthGuard>
      <SupportContent />
    </AuthGuard>
  )
}
