
'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Target,
  ArrowUpRight,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  ChevronRight,
  Star,
  Globe,
  Shield,
  Award,
  Zap
} from 'lucide-react'

// Главный компонент сайта
export default function InvestmentPlatform() {
  const [statistics, setStatistics] = useState({
    totalUsers: 6,
    totalPaid: 50,
    totalInvestments: 0,
    averageReturn: 24.5
  })

  const [newUsers] = useState([
    {
      id: 1,
      name: "Алексей Петров",
      email: "alexey@example.com",
      country: "RU",
      country_name: "Россия",
      joined_date: new Date().toISOString()
    },
    {
      id: 2,
      name: "Мария Иванова", 
      email: "maria@example.com",
      country: "UA",
      country_name: "Украина",
      joined_date: new Date().toISOString()
    },
    {
      id: 3,
      name: "Дмитрий Козлов",
      email: "dmitry@example.com", 
      country: "BY",
      country_name: "Беларусь",
      joined_date: new Date().toISOString()
    }
  ])

  const [activities] = useState([
    {
      id: 1,
      user_name: "Иван Смирнов",
      action: "deposit",
      amount: 500,
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      user_name: "Елена Волкова",
      action: "withdraw", 
      amount: 150,
      timestamp: new Date().toISOString()
    }
  ])

  const getActionColor = (action: string) => {
    switch (action) {
      case 'deposit': return 'bg-green-500/20 text-green-700 border-green-200'
      case 'withdraw': return 'bg-blue-500/20 text-blue-700 border-blue-200'
      case 'investment': return 'bg-purple-500/20 text-purple-700 border-purple-200'
      default: return 'bg-gray-500/20 text-gray-700 border-gray-200'
    }
  }

  const getActionText = (action: string) => {
    switch (action) {
      case 'deposit': return 'Пополнение'
      case 'withdraw': return 'Вывод'
      case 'investment': return 'Инвестиция'
      default: return 'Операция'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">InvestPro</h1>
                <p className="text-sm text-gray-300">Профессиональные инвестиции</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Онлайн
              </Badge>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Войти
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Регистрация
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Статистика платформы
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Актуальные данные нашей инвестиционной платформы в режиме реального времени
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Активных клиентов */}
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  +12.5%
                </Badge>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-white">{statistics.totalUsers}</h3>
                <p className="text-purple-200 text-sm font-medium">Активных клиентов</p>
              </div>
            </CardContent>
          </Card>

          {/* Выплачено клиентам */}
          <Card className="bg-gradient-to-br from-teal-500/20 to-teal-600/20 border-teal-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  +8.3%
                </Badge>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-white">${statistics.totalPaid}</h3>
                <p className="text-teal-200 text-sm font-medium">Выплачено клиентам</p>
              </div>
            </CardContent>
          </Card>

          {/* Выплачено прибыли */}
          <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  +15.7%
                </Badge>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-white">${statistics.totalInvestments}</h3>
                <p className="text-orange-200 text-sm font-medium">Выплачено прибыли</p>
              </div>
            </CardContent>
          </Card>

          {/* Средняя доходность */}
          <Card className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 border-pink-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  +2.1%
                </Badge>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-white">{statistics.averageReturn}%</h3>
                <p className="text-pink-200 text-sm font-medium">Средняя доходность</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Данные обновляются в реальном времени</span>
          </div>
        </div>

        {/* Activity Feed and New Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Live Activity Feed */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Активность в реальном времени</span>
              </CardTitle>
              <CardDescription className="text-gray-300">
                Последние транзакции пользователей
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activities.map((activity, index) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {activity.user_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-white font-medium">{activity.user_name}</p>
                      <p className="text-gray-400 text-sm">{getActionText(activity.action)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getActionColor(activity.action)} mb-1`}>
                      ${activity.amount}
                    </Badge>
                    <p className="text-gray-400 text-xs">только что</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* New Users */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Новые пользователи</CardTitle>
              <CardDescription className="text-gray-300">
                Недавно зарегистрированные клиенты
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {newUsers.map((user, index) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.country_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-1">
                      Новый
                    </Badge>
                    <p className="text-gray-400 text-xs">сегодня</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Investment Plans Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Инвестиционные планы</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Выберите подходящий тарифный план для максимизации прибыли
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 relative overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white">Начальный</CardTitle>
                <CardDescription className="text-gray-300">
                  Для новых инвесторов
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">1.5%</div>
                  <div className="text-gray-300 text-sm">ежедневно</div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Минимум:</span>
                    <span className="text-white">$50</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Максимум:</span>
                    <span className="text-white">$999</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Срок:</span>
                    <span className="text-white">30 дней</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Выбрать план
                </Button>
              </CardContent>
            </Card>

            {/* Standard Plan */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 relative overflow-hidden border-gold">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-500 to-orange-500 text-white text-xs px-3 py-1 rounded-bl-lg">
                Популярный
              </div>
              <CardHeader>
                <CardTitle className="text-white">Стандарт</CardTitle>
                <CardDescription className="text-gray-300">
                  Оптимальный выбор
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">2.1%</div>
                  <div className="text-gray-300 text-sm">ежедневно</div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Минимум:</span>
                    <span className="text-white">$1,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Максимум:</span>
                    <span className="text-white">$4,999</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Срок:</span>
                    <span className="text-white">45 дней</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                  Выбрать план
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 relative overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white">Премиум</CardTitle>
                <CardDescription className="text-gray-300">
                  Для опытных инвесторов
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">2.8%</div>
                  <div className="text-gray-300 text-sm">ежедневно</div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Минимум:</span>
                    <span className="text-white">$5,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Максимум:</span>
                    <span className="text-white">$50,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Срок:</span>
                    <span className="text-white">60 дней</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                  Выбрать план
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Безопасность</h3>
            <p className="text-gray-400 text-sm">SSL шифрование и защита данных</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Лицензия</h3>
            <p className="text-gray-400 text-sm">Регулируется финансовыми органами</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Быстрые выплаты</h3>
            <p className="text-gray-400 text-sm">Вывод средств в течение 24 часов</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Мировой охват</h3>
            <p className="text-gray-400 text-sm">Обслуживание в 50+ странах</p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-white/5 backdrop-blur-lg mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold text-xl">InvestPro</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Профессиональная инвестиционная платформа с высокой доходностью и надежной защитой средств.
              </p>
              <div className="flex space-x-4">
                <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Инвестиции</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Тарифные планы</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Калькулятор прибыли</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Реферальная программа</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Компания</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Отзывы</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Новости</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Контакты</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Поддержка</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Служба поддержки</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Правила</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Конфиденциальность</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Безопасность</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 InvestPro. Все права защищены.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                SSL Secured
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                Licensed
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
