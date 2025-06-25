The provided changes replace the handleSubmit function to connect the withdrawal form to a withdraw API endpoint.
```
```replit_final_file
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CreditCard,
  Wallet,
  Bitcoin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Shield,
  Clock,
  DollarSign,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"

const withdrawMethods = [
  {
    id: "card",
    name: "Банковская карта",
    description: "Visa, MasterCard, Мир",
    icon: <CreditCard className="h-6 w-6" />,
    fee: "2%",
    time: "1-3 рабочих дня",
    minAmount: 50,
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-500/10 to-teal-600/10",
  },
  {
    id: "crypto",
    name: "Криптовалюта",
    description: "Bitcoin, Ethereum, USDT",
    icon: <Bitcoin className="h-6 w-6" />,
    fee: "1%",
    time: "30-60 минут",
    minAmount: 25,
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-500/10 to-orange-500/10",
  },
  {
    id: "ewallet",
    name: "Электронные кошельки",
    description: "Qiwi, WebMoney, ЮMoney",
    icon: <Wallet className="h-6 w-6" />,
    fee: "3%",
    time: "2-6 часов",
    minAmount: 30,
    gradient: "from-violet-500 to-purple-500",
    bgGradient: "from-violet-500/10 to-purple-500/10",
  },
]

interface WithdrawFormProps {
  balance: number
  onWithdraw?: (amount: number) => void
}

export function WithdrawForm({ balance = 0, onWithdraw }: WithdrawFormProps) {
  const [amount, setAmount] = useState("")
  const [withdrawMethod, setWithdrawMethod] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [cryptoNetwork, setCryptoNetwork] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1)
  const [paymentDetails, setPaymentDetails] = useState("")

  const handleNextStep = () => {
    setError("")

    if (step === 1) {
      const withdrawAmount = Number(amount)
      if (!amount || withdrawAmount <= 0) {
        setError("Введите корректную сумму")
        return
      }
      if (withdrawAmount > balance) {
        setError("Недостаточно средств на балансе")
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!withdrawMethod) {
        setError("Выберите способ вывода")
        return
      }
      const selectedMethod = withdrawMethods.find((m) => m.id === withdrawMethod)
      if (selectedMethod && Number(amount) < selectedMethod.minAmount) {
        setError(`Минимальная сумма для ${selectedMethod.name}: $${selectedMethod.minAmount}`)
        return
      }
      setStep(3)
    } else if (step === 3) {
      if (!walletAddress.trim()) {
        setError("Введите реквизиты для вывода")
        return
      }
      if (withdrawMethod === "crypto" && !cryptoNetwork) {
        setError("Выберите сеть криптовалюты")
        return
      }
      setStep(4)
    }
  }

  const handlePrevStep = () => {
    setError("")
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || parseFloat(amount) <= 0) {
      setError("Введите корректную сумму")
      return
    }

    if (!withdrawMethod) {
      setError("Выберите способ вывода")
      return
    }

    if (parseFloat(amount) < 10) {
      setError("Минимальная сумма вывода: $10")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Токен не найден')
        return
      }

      const response = await fetch('/api/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          payment_method: withdrawMethod,
          payment_details: paymentDetails
        })
      })

      const data = await response.json()

      if (response.ok) {
        //onSuccess?.() //TODO: fix undefined onSuccess
        //onClose()  //TODO: fix undefined onClose
        setSuccess(true);
        setTimeout(() => {
          setAmount("")
          setWalletAddress("")
          setWithdrawMethod("")
          setStep(1)
          setSuccess(false)
        }, 3000)
        alert(`Заявка на вывод на сумму $${amount} создана успешно!`)
      } else {
        setError(data.error || 'Ошибка создания заявки')
      }
    } catch (error) {
      console.error('Error creating withdrawal:', error)
      setError("Произошла ошибка при создании заявки")
    } finally {
      setIsLoading(false)
    }
  }

  const selectedMethod = withdrawMethods.find((method) => method.id === withdrawMethod)
  const withdrawAmount = Number.parseFloat(amount) || 0
  const feeAmount = selectedMethod ? (withdrawAmount * Number.parseFloat(selectedMethod.fee.replace("%", ""))) / 100 : 0
  const finalAmount = withdrawAmount - feeAmount

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 py-12"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-10 w-10 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Заявка создана!</h3>
          <p className="text-emerald-200">
            Запрос на вывод <span className="text-emerald-400 font-semibold">${amount}</span> отправлен на рассмотрение.
          </p>
          <p className="text-emerald-300 text-sm mt-2">Средства будут переведены после подтверждения администратором</p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Balance Display */}
      <Card className="bg-gradient-to-r from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 shadow-2xl">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <DollarSign className="h-6 w-6 text-emerald-400" />
            <h4 className="font-medium text-emerald-400">Доступный баланс</h4>
          </div>
          <p className="text-3xl font-bold text-white">${balance.toFixed(2)}</p>
          <p className="text-emerald-300 mt-2">Готово к выводу</p>
        </CardContent>
      </Card>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                step >= stepNumber
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                  : "bg-white/10 text-white/50"
              }`}
            >
              {stepNumber}
            </div>
            {stepNumber < 4 && (
              <div
                className={`w-12 h-1 mx-2 rounded transition-all duration-300 ${
                  step > stepNumber ? "bg-gradient-to-r from-emerald-500 to-teal-600" : "bg-white/10"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/30">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Step 1: Amount Selection */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white">Сумма для вывода</h3>
            <p className="text-white/70">Введите сумму, которую хотите вывести</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-white text-lg">
                Сумма вывода
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 text-lg">$</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="100"
                  min="10"
                  max={balance}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 h-14 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400"
                />
              </div>
              <p className="text-sm text-white/60">
                Доступно для вывода: <span className="text-emerald-400 font-medium">${balance.toFixed(2)}</span>
              </p>
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-3">
              {[25, 50, 100, 250].map((quickAmount) => (
                <Button
                  key={quickAmount}
                  type="button"
                  variant="outline"
                  onClick={() => setAmount(quickAmount.toString())}
                  disabled={quickAmount > balance}
                  className={`h-12 border-white/20 text-white hover:bg-white/10 transition-all duration-200 ${
                    amount === quickAmount.toString()
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-500"
                      : ""
                  }`}
                >
                  ${quickAmount}
                </Button>
              ))}
            </div>

            <Button
              onClick={() => setAmount(balance.toString())}
              variant="outline"
              className="w-full h-12 border-white/20 text-white hover:bg-white/10"
            >
              Вывести весь баланс (${balance.toFixed(2)})
            </Button>
          </div>

          <Button
            onClick={handleNextStep}
            disabled={!amount || Number(amount) <= 0 || Number(amount) > balance}
            className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium"
          >
            Продолжить
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      )}

      {/* Step 2: Method Selection */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white">Способ вывода</h3>
            <p className="text-white/70">
              Сумма к выводу: <span className="text-emerald-400 font-semibold">${amount}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {withdrawMethods.map((method) => (
              <Card
                key={method.id}
                className={`cursor-pointer transition-all duration-300 transform hover:scale-105 relative overflow-hidden ${
                  withdrawMethod === method.id
                    ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20"
                    : "border-white/20 bg-white/5 hover:bg-white/10"
                } ${Number(amount) < method.minAmount ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => Number(amount) >= method.minAmount && setWithdrawMethod(method.id)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${method.bgGradient} opacity-50`}></div>

                <CardContent className="p-6 relative">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${method.gradient} text-white shadow-lg`}>
                      {method.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{method.name}</h3>
                      <p className="text-white/70 text-sm">{method.description}</p>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center justify-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-400" />
                        <span className="text-white/80">{method.time}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-yellow-400 font-medium">Комиссия: {method.fee}</span>
                      </div>
                      <div className="text-white/60 text-xs">Мин. сумма: ${method.minAmount}</div>
                    </div>
                    {Number(amount) < method.minAmount && (
                      <div className="text-red-400 text-xs font-medium">Недостаточная сумма</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handlePrevStep}
              variant="outline"
              className="flex-1 h-12 border-white/20 text-white hover:bg-white/10"
            >
              Назад
            </Button>
            <Button
              onClick={handleNextStep}
              disabled={!withdrawMethod}
              className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium"
            >
              Продолжить
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Payment Details */}
      {step === 3 && selectedMethod && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white">Реквизиты для вывода</h3>
            <p className="text-white/70">Введите данные для {selectedMethod.name.toLowerCase()}</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet" className="text-white text-lg">
                {withdrawMethod === "card"
                  ? "Номер банковской карты"
                  : withdrawMethod === "crypto"
                    ? "Адрес криптокошелька"
                    : "Номер электронного кошелька"}
              </Label>
              <Input
                id="wallet"
                placeholder={
                  withdrawMethod === "card"
                    ? "1234 5678 9012 3456"
                    : withdrawMethod === "crypto"
                      ? "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                      : "R123456789"
                }
                value={walletAddress}
                onChange={(e) => {
                  setWalletAddress(e.target.value)
                  setPaymentDetails(e.target.value)
                }}
                className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400"
              />
              <p className="text-sm text-white/60">
                {withdrawMethod === "card" && "Введите номер карты без пробелов"}
                {withdrawMethod === "crypto" && "Убедитесь, что адрес указан корректно"}
                {withdrawMethod === "ewallet" && "Введите номер кошелька или телефон"}
              </p>
            </div>
            {withdrawMethod === "crypto" && (
              <div className="space-y-2">
                <Label htmlFor="network" className="text-white text-lg">
                  Сеть криптовалюты
                </Label>
                <Input
                  id="network"
                  placeholder="Ethereum (ERC20)"
                  value={cryptoNetwork}
                  onChange={(e) => setCryptoNetwork(e.target.value)}
                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400"
                />
                <p className="text-sm text-white/60">Выберите сеть, через которую будет произведен перевод</p>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handlePrevStep}
              variant="outline"
              className="flex-1 h-12 border-white/20 text-white hover:bg-white/10"
            >
              Назад
            </Button>
            <Button
              onClick={handleNextStep}
              disabled={!walletAddress.trim() || (withdrawMethod === "crypto" && !cryptoNetwork)}
              className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium"
            >
              Продолжить
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && selectedMethod && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white">Подтверждение вывода</h3>
            <p className="text-white/70">Проверьте все данные перед отправкой заявки</p>
          </div>

          {/* Transaction Summary */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Детали операции
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Способ вывода:</span>
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedMethod.gradient} text-white`}>
                    {selectedMethod.icon}
                  </div>
                  <span className="text-white font-medium">{selectedMethod.name}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Реквизиты:</span>
                <span className="text-white font-mono text-sm">
                  {walletAddress.length > 20 ? `${walletAddress.slice(0, 20)}...` : walletAddress}
                </span>
              </div>
              {selectedMethod.id === "crypto" && (
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Сеть:</span>
                  <span className="text-white font-mono text-sm">{cryptoNetwork}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-white/70">Сумма вывода:</span>
                <span className="text-white font-medium">${withdrawAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Комиссия ({selectedMethod.fee}):</span>
                <span className="text-red-400 font-medium">-${feeAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Время обработки:</span>
                <span className="text-blue-400 font-medium">{selectedMethod.time}</span>
              </div>
              <div className="border-t border-white/20 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold text-lg">К получению:</span>
                  <span className="text-emerald-400 font-bold text-xl">${finalAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert className="bg-yellow-500/20 border-yellow-500/30 text-yellow-200">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Средства будут переведены после подтверждения администратором. Обычно это занимает до 24 часов.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-3">
              <Button
                type="button"
                onClick={handlePrevStep}
                variant="outline"
                className="flex-1 h-12 border-white/20 text-white hover:bg-white/10"
              >
                Назад
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Создание заявки...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Создать заявку на вывод
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  )
}