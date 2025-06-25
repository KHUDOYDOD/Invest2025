"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardNav } from "@/components/dashboard/nav"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Copy,
  Loader2,
  QrCode,
  Smartphone,
  Bitcoin,
  RefreshCw,
  Clock,
  Info,
  AlertTriangle,
  Check,
} from "lucide-react"

export default function DepositPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [amount, setAmount] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [transactionId, setTransactionId] = useState<string>("")
  const [cardNumber, setCardNumber] = useState<string>("")
  const [cardExpiry, setCardExpiry] = useState<string>("")
  const [cardCvv, setCardCvv] = useState<string>("")
  const [cardName, setCardName] = useState<string>("")
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [cryptoNetwork, setCryptoNetwork] = useState<string>("trc20")
  const [commission, setCommission] = useState<number>(0)
  const [totalAmount, setTotalAmount] = useState<number>(0)

  // Адреса для криптовалютных платежей
  const cryptoAddresses = {
    trc20: "TYN5CrEMj4hJcGpZHRq1qPgWwzfCVtJnEF",
    ton: "UQBFn2HwWvDRfYKCg2UNwBZUUPJG7Z3R1XGZS4SB-TW4Xneu",
  }

  // QR-коды для оплаты (заглушки)
  const qrCodes = {
    card: "/placeholder.svg?height=200&width=200",
    sbp: "/placeholder.svg?height=200&width=200",
    crypto: "/placeholder.svg?height=200&width=200",
  }

  useEffect(() => {
    // Проверяем авторизацию пользователя
    const checkAuth = () => {
      try {
        const userEmail = localStorage.getItem("userEmail")
        if (!userEmail) {
          window.location.href = "/login"
          return
        }
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Auth check error:", error)
        window.location.href = "/login"
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Расчет комиссии в зависимости от метода оплаты
  useEffect(() => {
    if (!amount || !selectedMethod) {
      setCommission(0)
      setTotalAmount(0)
      return
    }

    const amountValue = Number.parseFloat(amount)
    if (isNaN(amountValue)) {
      setCommission(0)
      setTotalAmount(0)
      return
    }

    let commissionRate = 0
    switch (selectedMethod) {
      case "card":
        commissionRate = 0.02 // 2% для карт
        break
      case "sbp":
        commissionRate = 0.01 // 1% для СБП
        break
      case "crypto":
        commissionRate = 0.005 // 0.5% для крипты
        break
      default:
        commissionRate = 0
    }

    const calculatedCommission = amountValue * commissionRate
    setCommission(calculatedCommission)
    setTotalAmount(amountValue + calculatedCommission)
  }, [amount, selectedMethod])

  // Форматирование номера карты
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Форматирование срока действия карты
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return v
  }

  // Форматирование номера телефона
  const formatPhoneNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (!v) return ""
    if (v.length <= 1) return `+${v}`
    if (v.length <= 4) return `+${v.substring(0, 1)} (${v.substring(1)}`
    if (v.length <= 7) return `+${v.substring(0, 1)} (${v.substring(1, 4)}) ${v.substring(4)}`
    if (v.length <= 10) return `+${v.substring(0, 1)} (${v.substring(1, 4)}) ${v.substring(4, 7)}-${v.substring(7)}`
    return `+${v.substring(0, 1)} (${v.substring(1, 4)}) ${v.substring(4, 7)}-${v.substring(7, 9)}-${v.substring(9, 11)}`
  }

  // Копирование в буфер обмена
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Скопировано в буфер обмена")
  }

  // Обработка нажатия кнопки "Далее"
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedMethod) {
        toast.error("Выберите способ оплаты")
        return
      }
      if (!amount || Number.parseFloat(amount) <= 0) {
        toast.error("Введите корректную сумму")
        return
      }
      setCurrentStep(2)
    } else if (currentStep === 2) {
      // Валидация в зависимости от метода оплаты
      if (selectedMethod === "card") {
        if (cardNumber.replace(/\s/g, "").length !== 16) {
          toast.error("Введите корректный номер карты")
          return
        }
        if (cardExpiry.length !== 5) {
          toast.error("Введите корректный срок действия карты")
          return
        }
        if (cardCvv.length !== 3) {
          toast.error("Введите корректный CVV код")
          return
        }
        if (!cardName) {
          toast.error("Введите имя владельца карты")
          return
        }
      } else if (selectedMethod === "sbp") {
        if (phoneNumber.replace(/\D/g, "").length !== 11) {
          toast.error("Введите корректный номер телефона")
          return
        }
      }
      setCurrentStep(3)
    } else if (currentStep === 3) {
      handleSubmitPayment()
    }
  }

  // Обработка отправки платежа
  const handleSubmitPayment = async () => {
    setIsProcessing(true)

    try {
      // Получаем токен из localStorage
      const token = localStorage.getItem('authToken')
      if (!token) {
        toast.error('Необходима авторизация')
        window.location.href = '/login'
        return
      }

      // Отправляем запрос на создание депозита
      const response = await fetch('/api/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: Number.parseFloat(amount),
          payment_method: selectedMethod,
          wallet_address: selectedMethod === 'crypto' ? cryptoAddresses[cryptoNetwork] : null,
          card_number: selectedMethod === 'card' ? cardNumber : null
        })
      })

      const data = await response.json()

      if (data.success) {
        setTransactionId(data.transaction.id)
        setIsSuccess(true)
        toast.success('Заявка на пополнение создана!')
      } else {
        toast.error(data.error || 'Ошибка создания заявки')
      }

    } catch (error) {
      console.error("Payment error:", error)
      toast.error("Произошла ошибка при обработке платежа")
    } finally {
      setIsProcessing(false)
    }
  }

  // Сброс формы и возврат к первому шагу
  const resetForm = () => {
    setCurrentStep(1)
    setSelectedMethod(null)
    setAmount("")
    setCardNumber("")
    setCardExpiry("")
    setCardCvv("")
    setCardName("")
    setPhoneNumber("")
    setCryptoNetwork("trc20")
    setIsSuccess(false)
    setTransactionId("")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-white text-lg">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float delay-2000"></div>
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl animate-float delay-3000"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      <DashboardHeader />

      <div className="flex relative z-10">
        <DashboardNav activeItem="deposit" />

        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Пополнение счета
              </h1>
              <p className="text-blue-200 max-w-2xl mx-auto">
                Выберите удобный способ пополнения и внесите средства на ваш инвестиционный счет
              </p>
            </div>

            {/* Progress Steps */}
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-700 -translate-y-1/2"></div>
              <div
                className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 -translate-y-1/2 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              ></div>
              <div className="relative flex justify-between">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                      currentStep >= 1
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {currentStep > 1 ? <Check className="h-5 w-5" /> : "1"}
                  </div>
                  <span className="text-xs mt-2 text-white">Способ</span>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                      currentStep >= 2
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {currentStep > 2 ? <Check className="h-5 w-5" /> : "2"}
                  </div>
                  <span className="text-xs mt-2 text-white">Детали</span>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                      currentStep >= 3
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {isSuccess ? <Check className="h-5 w-5" /> : "3"}
                  </div>
                  <span className="text-xs mt-2 text-white">Подтверждение</span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white">
                  {currentStep === 1 && "Выберите способ пополнения"}
                  {currentStep === 2 && "Введите детали платежа"}
                  {currentStep === 3 && (isSuccess ? "Платеж обрабатывается" : "Подтверждение платежа")}
                </CardTitle>
                <CardDescription className="text-white/70">
                  {currentStep === 1 && "Выберите удобный способ пополнения и укажите сумму"}
                  {currentStep === 2 && "Заполните необходимые данные для выбранного способа оплаты"}
                  {currentStep === 3 &&
                    (isSuccess
                      ? "Ваш платеж обрабатывается. Это может занять некоторое время"
                      : "Проверьте данные перед подтверждением")}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Step 1: Select Payment Method */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <RadioGroup
                      value={selectedMethod || ""}
                      onValueChange={setSelectedMethod}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <Label
                        htmlFor="card"
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                          selectedMethod === "card"
                            ? "border-blue-500 bg-blue-500/20"
                            : "border-white/20 bg-white/5 hover:bg-white/10"
                        } cursor-pointer transition-all duration-200`}
                      >
                        <RadioGroupItem value="card" id="card" className="sr-only" />
                        <CreditCard className="h-10 w-10 mb-3 text-blue-400" />
                        <span className="text-white font-medium">Банковская карта</span>
                        <span className="text-white/60 text-xs mt-1">Visa, MasterCard</span>
                        <Badge className="mt-2 bg-blue-500/30 text-blue-200">Комиссия 2%</Badge>
                      </Label>

                      <Label
                        htmlFor="sbp"
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                          selectedMethod === "sbp"
                            ? "border-green-500 bg-green-500/20"
                            : "border-white/20 bg-white/5 hover:bg-white/10"
                        } cursor-pointer transition-all duration-200`}
                      >
                        <RadioGroupItem value="sbp" id="sbp" className="sr-only" />
                        <Smartphone className="h-10 w-10 mb-3 text-green-400" />
                        <span className="text-white font-medium">Система быстрых платежей</span>
                        <span className="text-white/60 text-xs mt-1">СБП</span>
                        <Badge className="mt-2 bg-green-500/30 text-green-200">Комиссия 1%</Badge>
                      </Label>

                      <Label
                        htmlFor="crypto"
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                          selectedMethod === "crypto"
                            ? "border-purple-500 bg-purple-500/20"
                            : "border-white/20 bg-white/5 hover:bg-white/10"
                        } cursor-pointer transition-all duration-200`}
                      >
                        <RadioGroupItem value="crypto" id="crypto" className="sr-only" />
                        <Bitcoin className="h-10 w-10 mb-3 text-purple-400" />
                        <span className="text-white font-medium">Криптовалюта</span>
                        <span className="text-white/60 text-xs mt-1">USDT TRC-20, TON</span>
                        <Badge className="mt-2 bg-purple-500/30 text-purple-200">Комиссия 0.5%</Badge>
                      </Label>
                    </RadioGroup>

                    <div className="pt-4">
                      <Label htmlFor="amount" className="text-white mb-2 block">
                        Сумма пополнения
                      </Label>
                      <div className="relative">
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Введите сумму"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-12"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-white/70">USD</span>
                        </div>
                      </div>
                    </div>

                    {amount && Number.parseFloat(amount) > 0 && selectedMethod && (
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/70">Сумма:</span>
                          <span className="text-white">${Number.parseFloat(amount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/70">Комиссия:</span>
                          <span className="text-white">${commission.toFixed(2)}</span>
                        </div>
                        <Separator className="my-2 bg-white/10" />
                        <div className="flex justify-between items-center font-medium">
                          <span className="text-white">Итого к оплате:</span>
                          <span className="text-white">${totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    )}

                    <Alert className="bg-blue-500/20 border-blue-500/30 text-blue-200">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Информация</AlertTitle>
                      <AlertDescription>
                        Средства будут зачислены на ваш счет после подтверждения платежа. Обычно это занимает от
                        нескольких минут до часа.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {/* Step 2: Payment Details */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    {/* Card Payment Form */}
                    {selectedMethod === "card" && (
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1 rounded-lg">
                          <div className="bg-gray-900 rounded-md p-4">
                            <div className="flex justify-between items-start mb-6">
                              <div className="w-12 h-8 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-md"></div>
                              <div className="text-white text-xs">Secure Payment</div>
                            </div>
                            <div className="mb-6">
                              <div className="text-white/60 text-xs mb-1">Номер карты</div>
                              <div className="text-white font-mono text-lg tracking-wider">
                                {cardNumber || "•••• •••• •••• ••••"}
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <div>
                                <div className="text-white/60 text-xs mb-1">Имя владельца</div>
                                <div className="text-white font-mono uppercase">{cardName || "ИМЯ ФАМИЛИЯ"}</div>
                              </div>
                              <div>
                                <div className="text-white/60 text-xs mb-1">Срок / CVV</div>
                                <div className="text-white font-mono">
                                  {cardExpiry || "MM/YY"} / {cardCvv ? "•••" : "•••"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber" className="text-white">
                              Номер карты
                            </Label>
                            <Input
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                              maxLength={19}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cardName" className="text-white">
                              Имя владельца
                            </Label>
                            <Input
                              id="cardName"
                              placeholder="IVAN IVANOV"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value.toUpperCase())}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardExpiry" className="text-white">
                              Срок действия
                            </Label>
                            <Input
                              id="cardExpiry"
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                              maxLength={5}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cardCvv" className="text-white">
                              CVV код
                            </Label>
                            <Input
                              id="cardCvv"
                              type="password"
                              placeholder="•••"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                              maxLength={3}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            />
                          </div>
                        </div>

                        <Alert className="bg-yellow-500/20 border-yellow-500/30 text-yellow-200">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Безопасность</AlertTitle>
                          <AlertDescription>
                            Мы не храним данные вашей карты. Платежи обрабатываются через защищенный шлюз с
                            использованием шифрования.
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}

                    {/* SBP Payment Form */}
                    {selectedMethod === "sbp" && (
                      <div className="space-y-6">
                        <div className="bg-white/5 rounded-lg p-6 border border-white/10 text-center">
                          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <QrCode className="h-10 w-10 text-green-400" />
                          </div>
                          <h3 className="text-white text-lg font-medium mb-2">Оплата через СБП</h3>
                          <p className="text-white/70 mb-4">
                            Введите номер телефона, привязанный к СБП, для получения QR-кода
                          </p>

                          <div className="space-y-4 max-w-xs mx-auto">
                            <div className="space-y-2">
                              <Label htmlFor="phoneNumber" className="text-white text-left block">
                                Номер телефона
                              </Label>
                              <Input
                                id="phoneNumber"
                                placeholder="+7 (999) 123-45-67"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                              />
                            </div>
                          </div>
                        </div>

                        <Alert className="bg-green-500/20 border-green-500/30 text-green-200">
                          <Info className="h-4 w-4" />
                          <AlertTitle>Как это работает</AlertTitle>
                          <AlertDescription>
                            После ввода номера телефона вы получите QR-код для оплаты через приложение вашего банка.
                            Средства будут зачислены автоматически после подтверждения платежа.
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}

                    {/* Crypto Payment Form */}
                    {selectedMethod === "crypto" && (
                      <div className="space-y-6">
                        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                          <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="w-32 h-32 bg-purple-500/20 rounded-lg flex items-center justify-center">
                              <QrCode className="h-16 w-16 text-purple-400" />
                            </div>
                            <div className="flex-1 space-y-4">
                              <div>
                                <h3 className="text-white font-medium mb-1">Выберите сеть</h3>
                                <div className="flex space-x-3">
                                  <Button
                                    type="button"
                                    variant={cryptoNetwork === "trc20" ? "default" : "outline"}
                                    className={
                                      cryptoNetwork === "trc20"
                                        ? "bg-gradient-to-r from-green-600 to-emerald-600"
                                        : "border-white/20 text-white hover:bg-white/10"
                                    }
                                    onClick={() => setCryptoNetwork("trc20")}
                                  >
                                    USDT TRC-20
                                  </Button>
                                  <Button
                                    type="button"
                                    variant={cryptoNetwork === "ton" ? "default" : "outline"}
                                    className={
                                      cryptoNetwork === "ton"
                                        ? "bg-gradient-to-r from-blue-600 to-cyan-600"
                                        : "border-white/20 text-white hover:bg-white/10"
                                    }
                                    onClick={() => setCryptoNetwork("ton")}
                                  >
                                    USDT TON
                                  </Button>
                                </div>
                              </div>

                              <div>
                                <Label className="text-white/70 text-sm">Адрес кошелька</Label>
                                <div className="flex items-center bg-white/10 rounded-md p-2 mt-1">
                                  <code className="text-white text-xs md:text-sm flex-1 font-mono break-all">
                                    {cryptoAddresses[cryptoNetwork as keyof typeof cryptoAddresses]}
                                  </code>
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="text-white/70 hover:text-white hover:bg-white/10"
                                    onClick={() =>
                                      copyToClipboard(cryptoAddresses[cryptoNetwork as keyof typeof cryptoAddresses])
                                    }
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              <div>
                                <Label className="text-white/70 text-sm">Сумма к оплате</Label>
                                <div className="flex items-center bg-white/10 rounded-md p-2 mt-1">
                                  <code className="text-white text-sm flex-1 font-mono">
                                    {totalAmount.toFixed(2)} USDT
                                  </code>
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="text-white/70 hover:text-white hover:bg-white/10"
                                    onClick={() => copyToClipboard(totalAmount.toFixed(2))}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Alert className="bg-red-500/20 border-red-500/30 text-red-200">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Важно!</AlertTitle>
                          <AlertDescription>
                            Отправляйте USDT только в выбранной сети (TRC-20 или TON). Отправка в другой сети может
                            привести к потере средств. Обязательно укажите точную сумму для быстрой обработки платежа.
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}

                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/70">Сумма:</span>
                        <span className="text-white">${Number.parseFloat(amount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/70">Комиссия:</span>
                        <span className="text-white">${commission.toFixed(2)}</span>
                      </div>
                      <Separator className="my-2 bg-white/10" />
                      <div className="flex justify-between items-center font-medium">
                        <span className="text-white">Итого к оплате:</span>
                        <span className="text-white">${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Confirmation */}
                {currentStep === 3 && !isSuccess && (
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-white font-medium mb-4">Проверьте данные платежа</h3>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">Способ оплаты:</span>
                          <span className="text-white">
                            {selectedMethod === "card"
                              ? "Банковская карта"
                              : selectedMethod === "sbp"
                                ? "Система быстрых платежей"
                                : "Криптовалюта"}
                          </span>
                        </div>

                        {selectedMethod === "card" && (
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">Номер карты:</span>
                            <span className="text-white font-mono">
                              **** **** **** {cardNumber.replace(/\s/g, "").slice(-4)}
                            </span>
                          </div>
                        )}

                        {selectedMethod === "sbp" && (
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">Номер телефона:</span>
                            <span className="text-white">{phoneNumber}</span>
                          </div>
                        )}

                        {selectedMethod === "crypto" && (
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">Сеть:</span>
                            <span className="text-white">{cryptoNetwork === "trc20" ? "USDT TRC-20" : "USDT TON"}</span>
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <span className="text-white/70">Сумма:</span>
                          <span className="text-white">${Number.parseFloat(amount).toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-white/70">Комиссия:</span>
                          <span className="text-white">${commission.toFixed(2)}</span>
                        </div>

                        <Separator className="my-2 bg-white/10" />

                        <div className="flex justify-between items-center font-medium">
                          <span className="text-white">Итого к оплате:</span>
                          <span className="text-white">${totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <Alert className="bg-blue-500/20 border-blue-500/30 text-blue-200">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Информация о платеже</AlertTitle>
                      <AlertDescription>
                        После подтверждения платежа вы будете перенаправлены на страницу оплаты. Средства будут
                        зачислены на ваш счет после успешной обработки платежа.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {/* Success State */}
                {currentStep === 3 && isSuccess && (
                  <div className="space-y-6">
                    <div className="text-center py-6">
                      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-10 w-10 text-green-400" />
                      </div>
                      <h3 className="text-white text-xl font-medium mb-2">Заявка на пополнение создана</h3>
                      <p className="text-white/70 mb-4">
                        Ваша заявка на пополнение счета успешно создана и находится в обработке
                      </p>

                      <div className="bg-white/5 rounded-lg p-4 border border-white/10 max-w-xs mx-auto mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/70">ID транзакции:</span>
                          <span className="text-white font-mono">{transactionId}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/70">Статус:</span>
                          <Badge className="bg-yellow-500/30 text-yellow-200">В обработке</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">Сумма:</span>
                          <span className="text-white">${Number.parseFloat(amount).toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center space-x-2 text-white/70 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>Ожидаемое время обработки: 5-30 минут</span>
                      </div>
                    </div>

                    <Alert className="bg-blue-500/20 border-blue-500/30 text-blue-200">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Что дальше?</AlertTitle>
                      <AlertDescription>
                        Вы можете отслеживать статус вашего платежа в разделе "Транзакции". Как только платеж будет
                        обработан, средства будут зачислены на ваш счет.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between border-t border-white/10 bg-white/5">
                {currentStep > 1 && !isSuccess && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Назад
                  </Button>
                )}
                {isSuccess ? (
                  <Button
                    type="button"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 ml-auto"
                    onClick={resetForm}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Новый платеж
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 ${
                      currentStep === 1 ? "w-full" : "ml-auto"
                    }`}
                    onClick={handleNextStep}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Обработка...
                      </>
                    ) : (
                      <>
                        {currentStep < 3 ? "Продолжить" : "Подтвердить"}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
