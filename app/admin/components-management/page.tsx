"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Save,
  Home,
  Activity,
  Calculator,
  DollarSign,
  MessageSquare,
  Star,
  HelpCircle,
  Smartphone,
  Shield,
  Grid3X3,
  Layout,
} from "lucide-react"

export default function ComponentsManagementPage() {
  // Hero Section Settings
  const [heroSettings, setHeroSettings] = useState({
    enabled: true,
    title: "Инвестируйте с умом, получайте стабильный доход",
    subtitle: "Профессиональная инвестиционная платформа с ежедневными выплатами, высокой доходностью и гарантированной безопасностью",
    badgeText: "Платформа работает с 2025 года",
    button1Text: "Начать инвестировать",
    button1Link: "/register",
    button2Text: "Войти в систему",
    button2Link: "/login",
    showButtons: true,
    backgroundAnimation: true,
    showStats: true,
    statsUsers: "15K+",
    statsUsersLabel: "Активных инвесторов",
    statsInvested: "$2.8M",
    statsInvestedLabel: "Общие инвестиции",
    statsReturn: "24.8%",
    statsReturnLabel: "Средняя доходность",
    statsReliability: "99.9%",
    statsReliabilityLabel: "Надежность",
  })

  const [loading, setLoading] = useState(false)

  // Load hero settings
  useEffect(() => {
    const loadHeroSettings = async () => {
      try {
        const response = await fetch("/api/admin/hero-settings")
        if (response.ok) {
          const data = await response.json()
          setHeroSettings({
            enabled: data.enabled,
            title: data.title,
            subtitle: data.subtitle,
            badgeText: data.badge_text,
            button1Text: data.button1_text,
            button1Link: data.button1_link,
            button2Text: data.button2_text,
            button2Link: data.button2_link,
            showButtons: data.show_buttons,
            backgroundAnimation: data.background_animation,
            showStats: data.show_stats,
            statsUsers: data.stats_users,
            statsUsersLabel: data.stats_users_label,
            statsInvested: data.stats_invested,
            statsInvestedLabel: data.stats_invested_label,
            statsReturn: data.stats_return,
            statsReturnLabel: data.stats_return_label,
            statsReliability: data.stats_reliability,
            statsReliabilityLabel: data.stats_reliability_label,
          })
        }
      } catch (error) {
        console.error("Error loading hero settings:", error)
      }
    }

    loadHeroSettings()
  }, [])

  // Save hero settings
  const saveHeroSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/hero-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(heroSettings),
      })

      if (response.ok) {
        alert("Настройки Hero секции сохранены!")
      } else {
        alert("Ошибка при сохранении настроек")
      }
    } catch (error) {
      console.error("Error saving hero settings:", error)
      alert("Ошибка при сохранении настроек")
    }
    setLoading(false)
  }

  // User Activity Settings
  const [activitySettings, setActivitySettings] = useState({
    enabled: true,
    showRegistrations: true,
    showDeposits: true,
    showWithdrawals: true,
    showProfits: true,
    updateInterval: 30,
    maxItems: 5,
    animationSpeed: "normal",
  })

  // Calculator Settings
  const [calculatorSettings, setCalculatorSettings] = useState({
    enabled: true,
    minAmount: 100,
    maxAmount: 50000,
    defaultAmount: 1000,
    showPlans: true,
    allowCustomPlans: false,
    roundResults: true,
  })

  // Currency Rates Settings
  const [currencySettings, setCurrencySettings] = useState({
    enabled: true,
    showBitcoin: true,
    showEthereum: true,
    showUsdt: true,
    showBnb: true,
    updateInterval: 60,
    showChange24h: true,
    animateNumbers: true,
  })

  // Testimonials Settings
  const [testimonialsSettings, setTestimonialsSettings] = useState({
    enabled: true,
    autoSlide: true,
    slideInterval: 5,
    showRating: true,
    showAvatar: true,
    maxTestimonials: 10,
  })

  // FAQ Settings
  const [faqSettings, setFaqSettings] = useState({
    enabled: true,
    searchEnabled: true,
    categoriesEnabled: true,
    expandMultiple: false,
    showContactSupport: true,
    maxQuestions: 20,
  })

  // Mobile App Settings
  const [mobileAppSettings, setMobileAppSettings] = useState({
    enabled: true,
    showAndroidLink: true,
    showIosLink: true,
    showQrCode: true,
    showFeatures: true,
    androidUrl: "https://play.google.com/store",
    iosUrl: "https://apps.apple.com",
  })

  // Trust Indicators Settings
  const [trustSettings, setTrustSettings] = useState({
    enabled: true,
    showSslBadge: true,
    showLicense: true,
    showInsurance: true,
    showAwards: true,
    animateCounters: true,
  })

  // Features Settings
  const [featuresSettings, setFeaturesSettings] = useState({
    enabled: true,
    showIcons: true,
    layout: "grid", // grid, list, carousel
    maxFeatures: 8,
    showDescriptions: true,
    animateOnScroll: true,
  })

  // Statistics Settings
  const [statisticsSettings, setStatisticsSettings] = useState({
    enabled: true,
    showUserCount: true,
    showInvestmentAmount: true,
    showProfitPaid: true,
    showAverageReturn: true,
    animateCounters: true,
    updateInterval: 60,
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Управление компонентами сайта</h1>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Layout className="w-4 h-4 mr-1" />
          10 компонентов
        </Badge>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="hero" className="flex items-center space-x-1">
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Hero</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center space-x-1">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Активность</span>
          </TabsTrigger>
          <TabsTrigger value="calculator" className="flex items-center space-x-1">
            <Calculator className="w-4 h-4" />
            <span className="hidden sm:inline">Калькулятор</span>
          </TabsTrigger>
          <TabsTrigger value="currency" className="flex items-center space-x-1">
            <DollarSign className="w-4 h-4" />
            <span className="hidden sm:inline">Валюты</span>
          </TabsTrigger>
          <TabsTrigger value="testimonials" className="flex items-center space-x-1">
            <Star className="w-4 h-4" />
            <span className="hidden sm:inline">Отзывы</span>
          </TabsTrigger>
        </TabsList>

        <TabsList className="grid grid-cols-5 w-full mt-2">
          <TabsTrigger value="faq" className="flex items-center space-x-1">
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
          <TabsTrigger value="mobile" className="flex items-center space-x-1">
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">Мобильное</span>
          </TabsTrigger>
          <TabsTrigger value="trust" className="flex items-center space-x-1">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Доверие</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center space-x-1">
            <Grid3X3 className="w-4 h-4" />
            <span className="hidden sm:inline">Функции</span>
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center space-x-1">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Статистика</span>
          </TabsTrigger>
        </TabsList>

        {/* Hero Section Management */}
        <TabsContent value="hero" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="w-5 h-5" />
                <span>Управление Hero секцией</span>
              </CardTitle>
              <CardDescription>Настройка главного экрана и призыва к действию</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Показывать Hero секцию</Label>
                  <p className="text-sm text-gray-500">Включить/отключить главный экран</p>
                </div>
                <Switch
                  checked={heroSettings.enabled}
                  onCheckedChange={(checked) => setHeroSettings({ ...heroSettings, enabled: checked })}
                />
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="badgeText">Текст бейджа</Label>
                  <Input
                    id="badgeText"
                    value={heroSettings.badgeText}
                    onChange={(e) => setHeroSettings({ ...heroSettings, badgeText: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heroTitle">Главный заголовок</Label>
                  <Textarea
                    id="heroTitle"
                    rows={3}
                    value={heroSettings.title}
                    onChange={(e) => setHeroSettings({ ...heroSettings, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle">Подзаголовок</Label>
                  <Textarea
                    id="heroSubtitle"
                    rows={4}
                    value={heroSettings.subtitle}
                    onChange={(e) => setHeroSettings({ ...heroSettings, subtitle: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="button1Text">Текст первой кнопки</Label>
                    <Input
                      id="button1Text"
                      value={heroSettings.button1Text}
                      onChange={(e) => setHeroSettings({ ...heroSettings, button1Text: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="button1Link">Ссылка первой кнопки</Label>
                    <Input
                      id="button1Link"
                      value={heroSettings.button1Link}
                      onChange={(e) => setHeroSettings({ ...heroSettings, button1Link: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="button2Text">Текст второй кнопки</Label>
                    <Input
                      id="button2Text"
                      value={heroSettings.button2Text}
                      onChange={(e) => setHeroSettings({ ...heroSettings, button2Text: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="button2Link">Ссылка второй кнопки</Label>
                    <Input
                      id="button2Link"
                      value={heroSettings.button2Link}
                      onChange={(e) => setHeroSettings({ ...heroSettings, button2Link: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Показывать кнопки</Label>
                      <p className="text-sm text-gray-500">Отображать кнопки действий</p>
                    </div>
                    <Switch
                      checked={heroSettings.showButtons}
                      onCheckedChange={(checked) => setHeroSettings({ ...heroSettings, showButtons: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Анимация фона</Label>
                      <p className="text-sm text-gray-500">Включить анимированный фон</p>
                    </div>
                    <Switch
                      checked={heroSettings.backgroundAnimation}
                      onCheckedChange={(checked) => setHeroSettings({ ...heroSettings, backgroundAnimation: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Показывать статистику</Label>
                      <p className="text-sm text-gray-500">Отображать статистические карточки</p>
                    </div>
                    <Switch
                      checked={heroSettings.showStats}
                      onCheckedChange={(checked) => setHeroSettings({ ...heroSettings, showStats: checked })}
                    />
                  </div>
                </div>

                {heroSettings.showStats && (
                  <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-semibold">Настройки статистики</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="statsUsers">Количество пользователей</Label>
                        <Input
                          id="statsUsers"
                          value={heroSettings.statsUsers}
                          onChange={(e) => setHeroSettings({ ...heroSettings, statsUsers: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="statsUsersLabel">Подпись пользователей</Label>
                        <Input
                          id="statsUsersLabel"
                          value={heroSettings.statsUsersLabel}
                          onChange={(e) => setHeroSettings({ ...heroSettings, statsUsersLabel: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="statsInvested">Сумма инвестиций</Label>
                        <Input
                          id="statsInvested"
                          value={heroSettings.statsInvested}
                          onChange={(e) => setHeroSettings({ ...heroSettings, statsInvested: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="statsInvestedLabel">Подпись инвестиций</Label>
                        <Input
                          id="statsInvestedLabel"
                          value={heroSettings.statsInvestedLabel}
                          onChange={(e) => setHeroSettings({ ...heroSettings, statsInvestedLabel: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="statsReturn">Доходность</Label>
                        <Input
                          id="statsReturn"
                          value={heroSettings.statsReturn}
                          onChange={(e) => setHeroSettings({ ...heroSettings, statsReturn: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="statsReturnLabel">Подпись доходности</Label>
                        <Input
                          id="statsReturnLabel"
                          value={heroSettings.statsReturnLabel}
                          onChange={(e) => setHeroSettings({ ...heroSettings, statsReturnLabel: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="statsReliability">Надежность</Label>
                        <Input
                          id="statsReliability"
                          value={heroSettings.statsReliability}
                          onChange={(e) => setHeroSettings({ ...heroSettings, statsReliability: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="statsReliabilityLabel">Подпись надежности</Label>
                        <Input
                          id="statsReliabilityLabel"
                          value={heroSettings.statsReliabilityLabel}
                          onChange={(e) => setHeroSettings({ ...heroSettings, statsReliabilityLabel: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button 
                    onClick={saveHeroSettings} 
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Сохранение..." : "Сохранить настройки"}
                  </Button>
                </div>
              </div>

              <Button className="w-full md:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Сохранить настройки Hero
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Activity Management */}
        <TabsContent value="activity" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Управление активностью пользователей</span>
              </CardTitle>
              <CardDescription>Настройка отображения действий пользователей</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Показывать активность</Label>
                  <p className="text-sm text-gray-500">Включить/отключить ленту активности</p>
                </div>
                <Switch
                  checked={activitySettings.enabled}
                  onCheckedChange={(checked) => setActivitySettings({ ...activitySettings, enabled: checked })}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">Регистрации</Label>
                  </div>
                  <Switch
                    checked={activitySettings.showRegistrations}
                    onCheckedChange={(checked) =>
                      setActivitySettings({ ...activitySettings, showRegistrations: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">Депозиты</Label>
                  </div>
                  <Switch
                    checked={activitySettings.showDeposits}
                    onCheckedChange={(checked) => setActivitySettings({ ...activitySettings, showDeposits: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">Выводы</Label>
                  </div>
                  <Switch
                    checked={activitySettings.showWithdrawals}
                    onCheckedChange={(checked) =>
                      setActivitySettings({ ...activitySettings, showWithdrawals: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">Прибыль</Label>
                  </div>
                  <Switch
                    checked={activitySettings.showProfits}
                    onCheckedChange={(checked) => setActivitySettings({ ...activitySettings, showProfits: checked })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="updateInterval">Интервал обновления (сек)</Label>
                  <Input
                    id="updateInterval"
                    type="number"
                    value={activitySettings.updateInterval}
                    onChange={(e) =>
                      setActivitySettings({ ...activitySettings, updateInterval: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxItems">Максимум элементов</Label>
                  <Input
                    id="maxItems"
                    type="number"
                    value={activitySettings.maxItems}
                    onChange={(e) => setActivitySettings({ ...activitySettings, maxItems: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="animationSpeed">Скорость анимации</Label>
                  <Select
                    value={activitySettings.animationSpeed}
                    onValueChange={(value) => setActivitySettings({ ...activitySettings, animationSpeed: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow">Медленная</SelectItem>
                      <SelectItem value="normal">Нормальная</SelectItem>
                      <SelectItem value="fast">Быстрая</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button className="w-full md:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Сохранить настройки активности
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calculator Management */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-5 h-5" />
                <span>Управление калькулятором прибыли</span>
              </CardTitle>
              <CardDescription>Настройка калькулятора доходности</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Показывать калькулятор</Label>
                  <p className="text-sm text-gray-500">Включить/отключить калькулятор</p>
                </div>
                <Switch
                  checked={calculatorSettings.enabled}
                  onCheckedChange={(checked) => setCalculatorSettings({ ...calculatorSettings, enabled: checked })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="calcMinAmount">Минимальная сумма ($)</Label>
                  <Input
                    id="calcMinAmount"
                    type="number"
                    value={calculatorSettings.minAmount}
                    onChange={(e) =>
                      setCalculatorSettings({ ...calculatorSettings, minAmount: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calcMaxAmount">Максимальная сумма ($)</Label>
                  <Input
                    id="calcMaxAmount"
                    type="number"
                    value={calculatorSettings.maxAmount}
                    onChange={(e) =>
                      setCalculatorSettings({ ...calculatorSettings, maxAmount: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calcDefaultAmount">Сумма по умолчанию ($)</Label>
                  <Input
                    id="calcDefaultAmount"
                    type="number"
                    value={calculatorSettings.defaultAmount}
                    onChange={(e) =>
                      setCalculatorSettings({ ...calculatorSettings, defaultAmount: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Показывать планы</Label>
                    <p className="text-sm text-gray-500">Отображать список планов</p>
                  </div>
                  <Switch
                    checked={calculatorSettings.showPlans}
                    onCheckedChange={(checked) => setCalculatorSettings({ ...calculatorSettings, showPlans: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Пользовательские планы</Label>
                    <p className="text-sm text-gray-500">Разрешить ввод своих %</p>
                  </div>
                  <Switch
                    checked={calculatorSettings.allowCustomPlans}
                    onCheckedChange={(checked) =>
                      setCalculatorSettings({ ...calculatorSettings, allowCustomPlans: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Округлять результаты</Label>
                    <p className="text-sm text-gray-500">Округлять до целых чисел</p>
                  </div>
                  <Switch
                    checked={calculatorSettings.roundResults}
                    onCheckedChange={(checked) =>
                      setCalculatorSettings({ ...calculatorSettings, roundResults: checked })
                    }
                  />
                </div>
              </div>

              <Button className="w-full md:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Сохранить настройки калькулятора
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Currency Rates Management */}
        <TabsContent value="currency" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Управление курсами валют</span>
              </CardTitle>
              <CardDescription>Настройка отображения криптовалют</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Показывать курсы валют</Label>
                  <p className="text-sm text-gray-500">Включить/отключить блок курсов</p>
                </div>
                <Switch
                  checked={currencySettings.enabled}
                  onCheckedChange={(checked) => setCurrencySettings({ ...currencySettings, enabled: checked })}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">Bitcoin (BTC)</Label>
                  </div>
                  <Switch
                    checked={currencySettings.showBitcoin}
                    onCheckedChange={(checked) => setCurrencySettings({ ...currencySettings, showBitcoin: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">Ethereum (ETH)</Label>
                  </div>
                  <Switch
                    checked={currencySettings.showEthereum}
                    onCheckedChange={(checked) => setCurrencySettings({ ...currencySettings, showEthereum: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">Tether (USDT)</Label>
                  </div>
                  <Switch
                    checked={currencySettings.showUsdt}
                    onCheckedChange={(checked) => setCurrencySettings({ ...currencySettings, showUsdt: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">Binance (BNB)</Label>
                  </div>
                  <Switch
                    checked={currencySettings.showBnb}
                    onCheckedChange={(checked) => setCurrencySettings({ ...currencySettings, showBnb: checked })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currencyUpdateInterval">Интервал обновления (сек)</Label>
                  <Input
                    id="currencyUpdateInterval"
                    type="number"
                    value={currencySettings.updateInterval}
                    onChange={(e) =>
                      setCurrencySettings({ ...currencySettings, updateInterval: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Изменения за 24ч</Label>
                    <p className="text-sm text-gray-500">Показывать % изменения</p>
                  </div>
                  <Switch
                    checked={currencySettings.showChange24h}
                    onCheckedChange={(checked) => setCurrencySettings({ ...currencySettings, showChange24h: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Анимация чисел</Label>
                    <p className="text-sm text-gray-500">Анимировать изменения</p>
                  </div>
                  <Switch
                    checked={currencySettings.animateNumbers}
                    onCheckedChange={(checked) => setCurrencySettings({ ...currencySettings, animateNumbers: checked })}
                  />
                </div>
              </div>

              <Button className="w-full md:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Сохранить настройки валют
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testimonials Management */}
        <TabsContent value="testimonials" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>Управление отзывами</span>
              </CardTitle>
              <CardDescription>Настройка секции отзывов клиентов</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Показывать отзывы</Label>
                  <p className="text-sm text-gray-500">Включить/отключить секцию отзывов</p>
                </div>
                <Switch
                  checked={testimonialsSettings.enabled}
                  onCheckedChange={(checked) => setTestimonialsSettings({ ...testimonialsSettings, enabled: checked })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="slideInterval">Интервал слайдов (сек)</Label>
                  <Input
                    id="slideInterval"
                    type="number"
                    value={testimonialsSettings.slideInterval}
                    onChange={(e) =>
                      setTestimonialsSettings({ ...testimonialsSettings, slideInterval: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxTestimonials">Максимум отзывов</Label>
                  <Input
                    id="maxTestimonials"
                    type="number"
                    value={testimonialsSettings.maxTestimonials}
                    onChange={(e) =>
                      setTestimonialsSettings({ ...testimonialsSettings, maxTestimonials: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">Автослайды</Label>
                  </div>
                  <Switch
                    checked={testimonialsSettings.autoSlide}
                    onCheckedChange={(checked) =>
                      setTestimonialsSettings({ ...testimonialsSettings, autoSlide: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">Рейтинг</Label>
                  </div>
                  <Switch
                    checked={testimonialsSettings.showRating}
                    onCheckedChange={(checked) =>
                      setTestimonialsSettings({ ...testimonialsSettings, showRating: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">Аватары</Label>
                  </div>
                  <Switch
                    checked={testimonialsSettings.showAvatar}
                    onCheckedChange={(checked) =>
                      setTestimonialsSettings({ ...testimonialsSettings, showAvatar: checked })
                    }
                  />
                </div>
              </div>

              <Button className="w-full md:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Сохранить настройки отзывов
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Management */}
        <TabsContent value="faq" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5" />
                <span>Управление FAQ</span>
              </CardTitle>
              <CardDescription>Настройка секции часто задаваемых вопросов</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Показывать FAQ</Label>
                  <p className="text-sm text-gray-500">Включить/отключить секцию FAQ</p>
                </div>
                <Switch
                  checked={faqSettings.enabled}
                  onCheckedChange={(checked) => setFaqSettings({ ...faqSettings, enabled: checked })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxQuestions">Максимум вопросов</Label>
                  <Input
                    id="maxQuestions"
                    type="number"
                    value={faqSettings.maxQuestions}
                    onChange={(e) => setFaqSettings({ ...faqSettings, maxQuestions: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">Поиск</Label>
                  </div>
                  <Switch
                    checked={faqSettings.searchEnabled}
                    onCheckedChange={(checked) => setFaqSettings({ ...faqSettings, searchEnabled: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">Категории</Label>
                  </div>
                  <Switch
                    checked={faqSettings.categoriesEnabled}
                    onCheckedChange={(checked) => setFaqSettings({ ...faqSettings, categoriesEnabled: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">Множественное открытие</Label>
                  </div>
                  <Switch
                    checked={faqSettings.expandMultiple}
                    onCheckedChange={(checked) => setFaqSettings({ ...faqSettings, expandMultiple: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">Связь с поддержкой</Label>
                  </div>
                  <Switch
                    checked={faqSettings.showContactSupport}
                    onCheckedChange={(checked) => setFaqSettings({ ...faqSettings, showContactSupport: checked })}
                  />
                </div>
              </div>

              <Button className="w-full md:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Сохранить настройки FAQ
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mobile App Management */}
        <TabsContent value="mobile" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5" />
                <span>Управление мобильным приложением</span>
              </CardTitle>
              <CardDescription>Настройка секции мобильного приложения</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Показывать секцию приложения</Label>
                  <p className="text-sm text-gray-500">Включить/отключить рекламу приложения</p>
                </div>
                <Switch
                  checked={mobileAppSettings.enabled}
                  onCheckedChange={(checked) => setMobileAppSettings({ ...mobileAppSettings, enabled: checked })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="androidUrl">Ссылка на Android</Label>
                  <Input
                    id="androidUrl"
                    value={mobileAppSettings.androidUrl}
                    onChange={(e) => setMobileAppSettings({ ...mobileAppSettings, androidUrl: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="iosUrl">Ссылка на iOS</Label>
                  <Input
                    id="iosUrl"
                    value={mobileAppSettings.iosUrl}
                    onChange={(e) => setMobileAppSettings({ ...mobileAppSettings, iosUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">Android ссылка</Label>
                  </div>
                  <Switch
                    checked={mobileAppSettings.showAndroidLink}
                    onCheckedChange={(checked) =>
                      setMobileAppSettings({ ...mobileAppSettings, showAndroidLink: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">iOS ссылка</Label>
                  </div>
                  <Switch
                    checked={mobileAppSettings.showIosLink}
                    onCheckedChange={(checked) => setMobileAppSettings({ ...mobileAppSettings, showIosLink: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">QR код</Label>
                  </div>
                  <Switch
                    checked={mobileAppSettings.showQrCode}
                    onCheckedChange={(checked) => setMobileAppSettings({ ...mobileAppSettings, showQrCode: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">Особенности</Label>
                  </div>
                  <Switch
                    checked={mobileAppSettings.showFeatures}
                    onCheckedChange={(checked) => setMobileAppSettings({ ...mobileAppSettings, showFeatures: checked })}
                  />
                </div>
              </div>

              <Button className="w-full md:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Сохранить настройки приложения
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trust Indicators Management */}
        <TabsContent value="trust" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Управление индикаторами доверия</span>
              </CardTitle>
              <CardDescription>Настройка элементов, повышающих доверие</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Показывать индикаторы доверия</Label>
                  <p className="text-sm text-gray-500">Включить/отключить блок доверия</p>
                </div>
                <Switch
                  checked={trustSettings.enabled}
                  onCheckedChange={(checked) => setTrustSettings({ ...trustSettings, enabled: checked })}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">SSL сертификат</Label>
                  </div>
                  <Switch
                    checked={trustSettings.showSslBadge}
                    onCheckedChange={(checked) => setTrustSettings({ ...trustSettings, showSslBadge: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">Лицензия</Label>
                  </div>
                  <Switch
                    checked={trustSettings.showLicense}
                    onCheckedChange={(checked) => setTrustSettings({ ...trustSettings, showLicense: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">Страхование</Label>
                  </div>
                  <Switch
                    checked={trustSettings.showInsurance}
                    onCheckedChange={(checked) => setTrustSettings({ ...trustSettings, showInsurance: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">Награды</Label>
                  </div>
                  <Switch
                    checked={trustSettings.showAwards}
                    onCheckedChange={(checked) => setTrustSettings({ ...trustSettings, showAwards: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">Анимация счетчиков</Label>
                  </div>
                  <Switch
                    checked={trustSettings.animateCounters}
                    onCheckedChange={(checked) => setTrustSettings({ ...trustSettings, animateCounters: checked })}
                  />
                </div>
              </div>

              <Button className="w-full md:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Сохранить настройки доверия
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Management */}
        <TabsContent value="features" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Grid3X3 className="w-5 h-5" />
                <span>Управление функциями платформы</span>
              </CardTitle>
              <CardDescription>Настройка отображения возможностей платформы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Показывать функции</Label>
                  <p className="text-sm text-gray-500">Включить/отключить секцию функций</p>
                </div>
                <Switch
                  checked={featuresSettings.enabled}
                  onCheckedChange={(checked) => setFeaturesSettings({ ...featuresSettings, enabled: checked })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="featuresLayout">Макет отображения</Label>
                  <Select
                    value={featuresSettings.layout}
                    onValueChange={(value) => setFeaturesSettings({ ...featuresSettings, layout: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Сетка</SelectItem>
                      <SelectItem value="list">Список</SelectItem>
                      <SelectItem value="carousel">Карусель</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxFeatures">Максимум функций</Label>
                  <Input
                    id="maxFeatures"
                    type="number"
                    value={featuresSettings.maxFeatures}
                    onChange={(e) => setFeaturesSettings({ ...featuresSettings, maxFeatures: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Показывать иконки</Label>
                    <p className="text-sm text-gray-500">Отображать иконки функций</p>
                  </div>
                  <Switch
                    checked={featuresSettings.showIcons}
                    onCheckedChange={(checked) => setFeaturesSettings({ ...featuresSettings, showIcons: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Показывать описания</Label>
                    <p className="text-sm text-gray-500">Отображать подробные описания</p>
                  </div>
                  <Switch
                    checked={featuresSettings.showDescriptions}
                    onCheckedChange={(checked) =>
                      setFeaturesSettings({ ...featuresSettings, showDescriptions: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Анимация при скролле</Label>
                    <p className="text-sm text-gray-500">Анимировать появление</p>
                  </div>
                  <Switch
                    checked={featuresSettings.animateOnScroll}
                    onCheckedChange={(checked) =>
                      setFeaturesSettings({ ...featuresSettings, animateOnScroll: checked })
                    }
                  />
                </div>
              </div>

              <Button className="w-full md:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Сохранить настройки функций
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Management */}
        <TabsContent value="statistics" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Управление статистикой платформы</span>
              </CardTitle>
              <CardDescription>Настройка публичной статистики</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Показывать статистику</Label>
                  <p className="text-sm text-gray-500">Включить/отключить блок статистики</p>
                </div>
                <Switch
                  checked={statisticsSettings.enabled}
                  onCheckedChange={(checked) => setStatisticsSettings({ ...statisticsSettings, enabled: checked })}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">Количество пользователей</Label>
                  </div>
                  <Switch
                    checked={statisticsSettings.showUserCount}
                    onCheckedChange={(checked) =>
                      setStatisticsSettings({ ...statisticsSettings, showUserCount: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">Сумма инвестиций</Label>
                  </div>
                  <Switch
                    checked={statisticsSettings.showInvestmentAmount}
                    onCheckedChange={(checked) =>
                      setStatisticsSettings({ ...statisticsSettings, showInvestmentAmount: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">Выплаченная прибыль</Label>
                  </div>
                  <Switch
                    checked={statisticsSettings.showProfitPaid}
                    onCheckedChange={(checked) =>
                      setStatisticsSettings({ ...statisticsSettings, showProfitPaid: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm">Средняя доходность</Label>
                  </div>
                  <Switch
                    checked={statisticsSettings.showAverageReturn}
                    onCheckedChange={(checked) =>
                      setStatisticsSettings({ ...statisticsSettings, showAverageReturn: checked })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="statisticsUpdateInterval">Интервал обновления (сек)</Label>
                  <Input
                    id="statisticsUpdateInterval"
                    type="number"
                    value={statisticsSettings.updateInterval}
                    onChange={(e) =>
                      setStatisticsSettings({ ...statisticsSettings, updateInterval: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Анимация счетчиков</Label>
                    <p className="text-sm text-gray-500">Анимировать числа</p>
                  </div>
                  <Switch
                    checked={statisticsSettings.animateCounters}
                    onCheckedChange={(checked) =>
                      setStatisticsSettings({ ...statisticsSettings, animateCounters: checked })
                    }
                  />
                </div>
              </div>

              <Button className="w-full md:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Сохранить настройки статистики
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
