"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  CreditCard,
  Bitcoin,
  Wallet,
  Shield,
  Clock,
  DollarSign,
  Percent,
  AlertTriangle,
  CheckCircle,
  Save,
  Loader2,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PaymentSettingsPage() {
  const [autoApproval, setAutoApproval] = useState(true)
  const [minDeposit, setMinDeposit] = useState("50")
  const [maxDeposit, setMaxDeposit] = useState("50000")
  const [minWithdraw, setMinWithdraw] = useState("10")
  const [maxWithdraw, setMaxWithdraw] = useState("10000")
  const [cardFee, setCardFee] = useState("0")
  const [cryptoFee, setCryptoFee] = useState("1")
  const [ewalletFee, setEwalletFee] = useState("2")
  const [withdrawFee, setWithdrawFee] = useState("2")
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const [paymentMethods, setPaymentMethods] = useState({
    card: true,
    crypto: true,
    ewallet: true,
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const settings = {
        autoApproval,
        minDeposit,
        maxDeposit,
        minWithdraw,
        maxWithdraw,
        cardFee,
        cryptoFee,
        ewalletFee,
        withdrawFee,
        paymentMethods,
      }

      localStorage.setItem("paymentSettings", JSON.stringify(settings))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      alert("Ошибка при сохранении настроек")
    } finally {
      setLoading(false)
    }
  }

  const handleMethodToggle = (method: string) => {
    setPaymentMethods((prev) => ({
      ...prev,
      [method]: !prev[method as keyof typeof prev],
    }))
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Настройки платежей</h1>
          <p className="text-slate-600 mt-2">Управление платежными системами и лимитами</p>
        </div>
        <Button onClick={handleSave} disabled={loading} className="bg-green-600 hover:bg-green-700">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Сохранение...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Сохранить настройки
            </>
          )}
        </Button>
      </div>

      {saved && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">Настройки платежей успешно сохранены!</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">
            <Settings className="w-4 h-4 mr-2" />
            Общие
          </TabsTrigger>
          <TabsTrigger value="methods">
            <CreditCard className="w-4 h-4 mr-2" />
            Способы оплаты
          </TabsTrigger>
          <TabsTrigger value="limits">
            <DollarSign className="w-4 h-4 mr-2" />
            Лимиты
          </TabsTrigger>
          <TabsTrigger value="fees">
            <Percent className="w-4 h-4 mr-2" />
            Комиссии
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Автоматическое одобрение
              </CardTitle>
              <CardDescription>Настройки автоматического зачисления средств</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Автоматическое зачисление пополнений</h3>
                  <p className="text-sm text-slate-600">Средства будут зачисляться на баланс сразу после пополнения</p>
                </div>
                <Switch checked={autoApproval} onCheckedChange={setAutoApproval} />
              </div>

              <Alert className={autoApproval ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}>
                {autoApproval ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-orange-600" />
                )}
                <AlertDescription className={autoApproval ? "text-green-800" : "text-orange-800"}>
                  {autoApproval
                    ? "Пополнения зачисляются автоматически. Пользователи получают средства мгновенно."
                    : "Пополнения требуют ручного одобрения администратором."}
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4 text-center">
                    <DollarSign className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                    <h3 className="font-semibold text-blue-900">Пополнения</h3>
                    <p className="text-sm text-blue-700">{autoApproval ? "Автоматически" : "Ручное одобрение"}</p>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4 text-center">
                    <AlertTriangle className="w-8 h-8 mx-auto text-red-600 mb-2" />
                    <h3 className="font-semibold text-red-900">Выводы</h3>
                    <p className="text-sm text-red-700">Всегда ручное одобрение</p>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="p-4 text-center">
                    <Shield className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                    <h3 className="font-semibold text-purple-900">Безопасность</h3>
                    <p className="text-sm text-purple-700">Полная защита</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Доступные способы оплаты</CardTitle>
              <CardDescription>Включите или отключите платежные методы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                  className={`border-2 transition-colors ${paymentMethods.card ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                        <div>
                          <h3 className="font-medium">Банковские карты</h3>
                          <p className="text-sm text-gray-600">Visa, MasterCard, Мир</p>
                        </div>
                      </div>
                      <Switch checked={paymentMethods.card} onCheckedChange={() => handleMethodToggle("card")} />
                    </div>
                    <Badge variant={paymentMethods.card ? "default" : "secondary"}>
                      {paymentMethods.card ? "Активен" : "Отключен"}
                    </Badge>
                  </CardContent>
                </Card>

                <Card
                  className={`border-2 transition-colors ${paymentMethods.crypto ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Bitcoin className="w-6 h-6 text-orange-600" />
                        <div>
                          <h3 className="font-medium">Криптовалюты</h3>
                          <p className="text-sm text-gray-600">BTC, ETH, USDT</p>
                        </div>
                      </div>
                      <Switch checked={paymentMethods.crypto} onCheckedChange={() => handleMethodToggle("crypto")} />
                    </div>
                    <Badge variant={paymentMethods.crypto ? "default" : "secondary"}>
                      {paymentMethods.crypto ? "Активен" : "Отключен"}
                    </Badge>
                  </CardContent>
                </Card>

                <Card
                  className={`border-2 transition-colors ${paymentMethods.ewallet ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Wallet className="w-6 h-6 text-purple-600" />
                        <div>
                          <h3 className="font-medium">Электронные кошельки</h3>
                          <p className="text-sm text-gray-600">Qiwi, WebMoney</p>
                        </div>
                      </div>
                      <Switch checked={paymentMethods.ewallet} onCheckedChange={() => handleMethodToggle("ewallet")} />
                    </div>
                    <Badge variant={paymentMethods.ewallet ? "default" : "secondary"}>
                      {paymentMethods.ewallet ? "Активен" : "Отключен"}
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Лимиты пополнения</CardTitle>
                <CardDescription>Минимальные и максимальные суммы для пополнения</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="min-deposit">Минимальная сумма ($)</Label>
                  <Input
                    id="min-deposit"
                    type="number"
                    value={minDeposit}
                    onChange={(e) => setMinDeposit(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-deposit">Максимальная сумма ($)</Label>
                  <Input
                    id="max-deposit"
                    type="number"
                    value={maxDeposit}
                    onChange={(e) => setMaxDeposit(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Лимиты вывода</CardTitle>
                <CardDescription>Минимальные и максимальные суммы для вывода</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="min-withdraw">Минимальная сумма ($)</Label>
                  <Input
                    id="min-withdraw"
                    type="number"
                    value={minWithdraw}
                    onChange={(e) => setMinWithdraw(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-withdraw">Максимальная сумма ($)</Label>
                  <Input
                    id="max-withdraw"
                    type="number"
                    value={maxWithdraw}
                    onChange={(e) => setMaxWithdraw(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fees" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Комиссии за пополнение</CardTitle>
                <CardDescription>Настройка комиссий для разных способов пополнения</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-fee">Банковские карты (%)</Label>
                  <Input
                    id="card-fee"
                    type="number"
                    step="0.1"
                    value={cardFee}
                    onChange={(e) => setCardFee(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crypto-fee">Криптовалюты (%)</Label>
                  <Input
                    id="crypto-fee"
                    type="number"
                    step="0.1"
                    value={cryptoFee}
                    onChange={(e) => setCryptoFee(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ewallet-fee">Электронные кошельки (%)</Label>
                  <Input
                    id="ewallet-fee"
                    type="number"
                    step="0.1"
                    value={ewalletFee}
                    onChange={(e) => setEwalletFee(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Комиссии за вывод</CardTitle>
                <CardDescription>Настройка комиссий для вывода средств</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="withdraw-fee">Комиссия за вывод (%)</Label>
                  <Input
                    id="withdraw-fee"
                    type="number"
                    step="0.1"
                    value={withdrawFee}
                    onChange={(e) => setWithdrawFee(e.target.value)}
                  />
                </div>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>Комиссия применяется ко всем способам вывода средств</AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
