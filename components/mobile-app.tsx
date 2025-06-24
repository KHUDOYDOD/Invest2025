"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, Download, Star, Shield, Zap, Bell } from "lucide-react"

export function MobileApp() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 backdrop-blur-sm">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className={`space-y-8 ${isVisible ? "animate-slide-in-left" : "opacity-0"}`}>
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full border border-white/20 text-white">
                <Smartphone className="w-4 h-4 mr-2" />
                Скоро в App Store и Google Play
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Мобильное приложение InvestPro
              </h2>

              <p className="text-xl text-slate-300 leading-relaxed">
                Управляйте инвестициями в любое время и в любом месте с нашим мобильным приложением
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 text-white">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                  <Shield className="h-5 w-5" />
                </div>
                <span>Безопасные транзакции</span>
              </div>
              <div className="flex items-center space-x-3 text-white">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
                  <Zap className="h-5 w-5" />
                </div>
                <span>Быстрые операции</span>
              </div>
              <div className="flex items-center space-x-3 text-white">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                  <Bell className="h-5 w-5" />
                </div>
                <span>Push-уведомления</span>
              </div>
              <div className="flex items-center space-x-3 text-white">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                  <Star className="h-5 w-5" />
                </div>
                <span>Премиум функции</span>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-black hover:bg-gray-800 text-white flex items-center justify-center space-x-3 px-8 py-4 rounded-xl transform hover:scale-105 transition-all duration-300"
              >
                <Download className="h-6 w-6" />
                <div className="text-left">
                  <div className="text-xs">Скачать в</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </Button>

              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-3 px-8 py-4 rounded-xl transform hover:scale-105 transition-all duration-300"
              >
                <Download className="h-6 w-6" />
                <div className="text-left">
                  <div className="text-xs">Скачать в</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className={`relative ${isVisible ? "animate-slide-in-right" : "opacity-0"}`}>
            <div className="relative mx-auto w-80 h-96">
              {/* Phone Frame */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl transform rotate-6 hover:rotate-3 transition-transform duration-500"></div>
              <div className="absolute inset-2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="p-6 h-full flex flex-col justify-between text-white">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-sm font-medium">InvestPro</div>
                      <div className="text-sm">14:30</div>
                    </div>

                    <div className="space-y-4">
                      <Card className="bg-white/20 backdrop-blur-sm border-white/30">
                        <CardContent className="p-4">
                          <div className="text-sm opacity-80">Баланс</div>
                          <div className="text-2xl font-bold">$12,450.00</div>
                          <div className="text-sm text-green-300">+5.2% сегодня</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/20 backdrop-blur-sm border-white/30">
                        <CardContent className="p-4">
                          <div className="text-sm opacity-80">Активные инвестиции</div>
                          <div className="text-xl font-bold">$8,200.00</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" className="bg-white/20 hover:bg-white/30 border-white/30">
                      Пополнить
                    </Button>
                    <Button size="sm" className="bg-white/20 hover:bg-white/30 border-white/30">
                      Вывести
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
