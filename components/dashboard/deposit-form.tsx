"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  CreditCard,
  Bitcoin,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  DollarSign,
  Copy,
  Smartphone,
  Loader2,
} from "lucide-react"

// Методы пополнения
const paymentMethods = [
  {
    id: "card",
    name: "Банковская карта",
    description: "Visa, MasterCard, Мир",
    icon: <CreditCard className="h-6 w-6" />,
    fee: "0%",
    time: "1-5 минут",
    popular: true,
    gradient: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-500/10 to-indigo-600/10",
    details: {
      card_number: "4444 5555 6666 7777",
      holder_name: "IVAN PETROV",
      bank_name: "Сбербанк",
      instructions: "Переведите указанную сумму на карту. Средства зачислятся после подтверждения администратором.",
    },
  },
  {
    id: "sbp",
    name: "Система быстрых платежей",
    description: "СБП Сбербанк",
    icon: <Smartphone className="h-6 w-6" />,
    fee: "0%",
    time: "Мгновенно",
    popular: true,
    gradient: "from-emerald-500 to-green-600",
    bgGradient: "from-emerald-500/10 to-green-600/10",
    details: {
      phone: "+7 922 123 45 67",
      bank_name: "Сбербанк",
      instructions: "Переведите через СБП на указанный номер телефона. Укажите в комментарии ваш email.",
    },
  },
  {
    id: "usdt_trc20",
    name: "USDT TRC-20",
    description: "Tether USDT TRC-20",
    icon: <Bitcoin className="h-6 w-6" />,
    fee: "0%",
    time: "5-15 минут",
    popular: false,
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-500/10 to-orange-500/10",
    details: {
      address: "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
      network: "TRON (TRC-20)",
      currency: "USDT",
      instructions: "Отправьте USDT только в сети TRC-20! Отправка в другой сети приведет к потере средств.",
    },
  },
]

const quickAmounts = [50, 100, 250, 500, 1000, 2500]

interface DepositFormProps {
  onDeposit?: (amount: number, method: string, paymentDetails: any) => void
}

export function DepositForm({ onDeposit }: DepositFormProps) {
  const [amount, setAmount] = useState<number | "">("")
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [step, setStep] = useState<number>(1)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "") {
      setAmount("")
    } else {
      const numValue = Number.parseFloat(value)
      if (!isNaN(numValue) && numValue >= 0) {
        setAmount(numValue)
      }
    }
  }

  const handleQuickAmount = (value: number) => {
    setAmount(value)
  }

  const handleSelectMethod = (methodId: string) => {
    setSelectedMethod(methodId)
  }

  const handleNextStep = () => {
    if (step === 1 && (amount === "" || Number(amount) <= 0)) {
      toast.error("Пожалуйста, введите сумму пополнения")
      return
    }

    if (step === 1 && Number(amount) < 50) {
      toast.error("Минимальная сумма пополнения: $50")
      return
    }

    if (step === 2 && !selectedMethod) {
      toast.error("Пожалуйста, выберите способ оплаты")
      return
    }

    if (step < 3) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async () => {
    if (amount === "" || Number(amount) <= 0) {
      toast.error("Пожалуйста, введите корректную сумму")
      return
    }

    if (!selectedMethod) {
      toast.error("Пожалуйста, выберите способ оплаты")
      return
    }

    setIsProcessing(true)

    try {
      const method = paymentMethods.find((m) => m.id === selectedMethod)

      console.log("🚀 Creating deposit request...")

      const response = await fetch("/api/deposit-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
          method: method?.name || selectedMethod,
          wallet_address: method?.details?.address || method?.details?.card_number || method?.details?.phone || "",
          network: method?.details?.network || "",
          payment_details: method?.details,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Ошибка создания запроса")
      }

      console.log("✅ Deposit request created:", result)

      setIsSuccess(true)
      toast.success(`Заявка на пополнение $${amount} создана!`, {
        description: "Ожидает подтверждения администратора",
      })

      // Вызываем callback если есть
      if (onDeposit) {
        onDeposit(Number(amount), method?.name || selectedMethod, method?.details)
      }

      // Сбрасываем форму через 3 секунды
      setTimeout(() => {
        setAmount("")
        setSelectedMethod(null)
        setStep(1)
        setIsSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("❌ Deposit error:", error)
      toast.error(error instanceof Error ? error.message : "Произошла ошибка при обработке платежа")
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Скопировано в буфер обмена")
  }

  const getSelectedMethod = () => {
    return paymentMethods.find((method) => method.id === selectedMethod)
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4 animate-scale-in">
          <CheckCircle2 className="h-8 w-8 text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Заявка создана!</h3>
        <p className="text-blue-200 mb-4">Заявка на пополнение на сумму ${amount} отправлена на рассмотрение</p>
        <Alert className="bg-blue-500/20 border-blue-500/30 text-blue-200 mb-4">
          <Clock className="h-4 w-4" />
          <AlertDescription>Средства будут зачислены на баланс после подтверждения администратором</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full border-4 border-blue-200/30 border-t-blue-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-blue-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Создание заявки</h3>
        <p className="text-blue-200 mb-6">Пожалуйста, подождите...</p>
      </div>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 shadow-xl overflow-hidden backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-white/10">
        <CardTitle className="text-white flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-blue-400" />
          Пополнение счета
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Step indicator */}
          <div className="flex justify-between mb-6">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step === stepNumber
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : step > stepNumber
                        ? "bg-green-500/20 text-green-400"
                        : "bg-white/10 text-white/50"
                  }`}
                >
                  {step > stepNumber ? <CheckCircle2 className="h-5 w-5" /> : stepNumber}
                </div>
                <span
                  className={`text-xs mt-2 transition-colors duration-300 ${
                    step === stepNumber ? "text-white" : step > stepNumber ? "text-green-400" : "text-white/50"
                  }`}
                >
                  {stepNumber === 1 ? "Сумма" : stepNumber === 2 ? "Способ" : "Подтверждение"}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1: Amount */}
          {step === 1 && (
            <div className="space-y-6 animate-slide-in">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white">
                  Сумма пополнения (USD)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="Введите сумму"
                    min="50"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                  />
                </div>
                <p className="text-white/60 text-sm">Минимальная сумма: $50</p>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Быстрый выбор</Label>
                <div className="grid grid-cols-3 gap-2">
                  {quickAmounts.map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      type="button"
                      variant="outline"
                      onClick={() => handleQuickAmount(quickAmount)}
                      className={`border-white/20 transition-all duration-200 ${
                        amount === quickAmount
                          ? "bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-blue-400"
                          : "bg-white/5 hover:bg-white/10 text-white"
                      }`}
                    >
                      ${quickAmount}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleNextStep}
                  disabled={amount === "" || Number(amount) < 50}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-200"
                >
                  Продолжить
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Payment Method Selection */}
          {step === 2 && (
            <div className="space-y-6 animate-slide-in">
              <div className="space-y-2">
                <Label className="text-white">Выберите способ пополнения</Label>
                <RadioGroup value={selectedMethod || ""} onValueChange={setSelectedMethod}>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`cursor-pointer rounded-lg border p-4 transition-all duration-200 hover:scale-[1.02] ${
                          selectedMethod === method.id
                            ? `bg-gradient-to-br ${method.bgGradient} border-blue-400`
                            : "bg-white/5 border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                        <Label htmlFor={method.id} className="cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-full bg-gradient-to-r ${method.gradient} text-white`}>
                                {method.icon}
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <h4 className="font-medium text-white">{method.name}</h4>
                                  {method.popular && (
                                    <Badge className="ml-2 bg-green-500/20 text-green-300 border border-green-500/30 px-2 py-1 text-xs">
                                      Популярно
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-white/70">{method.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-white/70">Комиссия: {method.fee}</div>
                              <div className="text-xs text-white/60">Время: {method.time}</div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={handlePrevStep}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Назад
                </Button>
                <Button
                  onClick={handleNextStep}
                  disabled={!selectedMethod}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Показать реквизиты
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment Details */}
          {step === 3 && selectedMethod && (
            <div className="space-y-6 animate-slide-in">
              {(() => {
                const method = getSelectedMethod()
                if (!method) return null

                return (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Реквизиты для пополнения</h3>
                      <Card className="bg-white/10 border-white/20">
                        <CardContent className="p-6 space-y-4">
                          {/* Card Payment */}
                          {method.id === "card" && (
                            <div className="space-y-4">
                              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-lg text-white">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm opacity-80">Номер карты</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(method.details.card_number)}
                                    className="text-white hover:bg-white/20"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="font-mono text-xl tracking-wider">{method.details.card_number}</div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-white/70">Получатель</Label>
                                  <div className="bg-white/10 p-3 rounded-lg">
                                    <span className="text-white font-medium">{method.details.holder_name}</span>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-white/70">Банк</Label>
                                  <div className="bg-white/10 p-3 rounded-lg">
                                    <span className="text-white font-medium">{method.details.bank_name}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* SBP Payment */}
                          {method.id === "sbp" && (
                            <div className="space-y-4">
                              <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-lg text-white">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm opacity-80">Номер телефона</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(method.details.phone)}
                                    className="text-white hover:bg-white/20"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="font-mono text-xl">{method.details.phone}</div>
                              </div>

                              <div>
                                <Label className="text-white/70">Банк получателя</Label>
                                <div className="bg-white/10 p-3 rounded-lg">
                                  <span className="text-white font-medium">{method.details.bank_name}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Crypto Payment */}
                          {method.id === "usdt_trc20" && (
                            <div className="space-y-4">
                              <div className="bg-gradient-to-r from-orange-600 to-yellow-600 p-4 rounded-lg text-white">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm opacity-80">Адрес кошелька</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(method.details.address)}
                                    className="text-white hover:bg-white/20"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="font-mono text-sm break-all">{method.details.address}</div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-white/70">Сеть</Label>
                                  <div className="bg-white/10 p-3 rounded-lg">
                                    <span className="text-white font-medium">{method.details.network}</span>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-white/70">Валюта</Label>
                                  <div className="bg-white/10 p-3 rounded-lg">
                                    <span className="text-white font-medium">{method.details.currency}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Amount and Instructions */}
                          <div className="space-y-4">
                            <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/30">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-blue-200">Сумма к переводу</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyToClipboard(amount.toString())}
                                  className="text-blue-200 hover:bg-blue-500/20"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="text-2xl font-bold text-white">${amount}</div>
                            </div>

                            <Alert className="bg-yellow-500/20 border-yellow-500/30 text-yellow-200">
                              <Shield className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Важно:</strong> {method.details.instructions}
                              </AlertDescription>
                            </Alert>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <Button
                        onClick={handlePrevStep}
                        variant="outline"
                        className="flex-1 border-white/20 text-white hover:bg-white/10"
                      >
                        Назад
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={isProcessing}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Создание заявки...
                          </>
                        ) : (
                          "Отправить заявку на пополнение"
                        )}
                      </Button>
                    </div>
                  </>
                )
              })()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
