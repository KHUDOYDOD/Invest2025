"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpRight, ArrowDownRight, CreditCard, Wallet, RefreshCw, Copy, Check, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

export function QuickActions() {
  const [activeTab, setActiveTab] = useState("deposit")
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [transferAmount, setTransferAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [withdrawMethod, setWithdrawMethod] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const walletAddress = "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t"

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!depositAmount || !paymentMethod) {
      toast.error("Пожалуйста, заполните все поля")
      return
    }

    setIsLoading(true)

    // Имитация запроса к API
    setTimeout(() => {
      setIsLoading(false)
      toast.success(`Запрос на пополнение на сумму $${depositAmount} успешно создан`)
      setDepositAmount("")
      setPaymentMethod("")
    }, 1500)
  }

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault()
    if (!withdrawAmount || !withdrawMethod) {
      toast.error("Пожалуйста, заполните все поля")
      return
    }

    setIsLoading(true)

    // Имитация запроса к API
    setTimeout(() => {
      setIsLoading(false)
      toast.success(`Запрос на вывод на сумму $${withdrawAmount} успешно создан`)
      setWithdrawAmount("")
      setWithdrawMethod("")
    }, 1500)
  }

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!transferAmount || !recipientAddress) {
      toast.error("Пожалуйста, заполните все поля")
      return
    }

    setIsLoading(true)

    // Имитация запроса к API
    setTimeout(() => {
      setIsLoading(false)
      toast.success(`Перевод на сумму $${transferAmount} успешно выполнен`)
      setTransferAmount("")
      setRecipientAddress("")
    }, 1500)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    toast.success("Адрес скопирован в буфер обмена")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-6 bg-white/10 border border-white/20">
        <TabsTrigger
          value="deposit"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/70 data-[state=active]:to-emerald-600/70 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-md transition-all duration-300 text-white/80 hover:text-white"
        >
          <ArrowUpRight className="h-4 w-4 mr-2" />
          Пополнить
        </TabsTrigger>
        <TabsTrigger
          value="withdraw"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500/70 data-[state=active]:to-pink-600/70 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-md transition-all duration-300 text-white/80 hover:text-white"
        >
          <ArrowDownRight className="h-4 w-4 mr-2" />
          Вывести
        </TabsTrigger>
        <TabsTrigger
          value="transfer"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/70 data-[state=active]:to-purple-600/70 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-md transition-all duration-300 text-white/80 hover:text-white"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Перевести
        </TabsTrigger>
      </TabsList>

      <TabsContent value="deposit" className="mt-0">
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deposit-amount" className="text-white">
                  Сумма пополнения
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">$</span>
                  <Input
                    id="deposit-amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-8 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-method" className="text-white">
                  Способ оплаты
                </Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Выберите способ оплаты" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/20 text-white">
                    <SelectItem value="card">Банковская карта</SelectItem>
                    <SelectItem value="crypto">Криптовалюта</SelectItem>
                    <SelectItem value="bank">Банковский перевод</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Обработка...
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Пополнить баланс
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white/5 rounded-lg p-4 border border-white/10"
          >
            <h3 className="text-white font-medium mb-4">Реквизиты для пополнения</h3>

            <div className="space-y-4">
              <div>
                <p className="text-white/70 text-sm mb-1">Адрес кошелька:</p>
                <div className="flex items-center justify-between bg-white/10 rounded-md p-2">
                  <code className="text-xs text-white/90 overflow-hidden overflow-ellipsis">{walletAddress}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-white/70 hover:text-white hover:bg-white/10"
                    onClick={copyToClipboard}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-white/70 text-sm">Доступные способы пополнения:</p>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-white/10 rounded-md p-2 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-white/70" />
                  </div>
                  <div className="bg-white/10 rounded-md p-2 flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-white/70"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2L2 7L12 12L22 7L12 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 17L12 22L22 17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 12L12 17L22 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="bg-white/10 rounded-md p-2 flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-white/70"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path
                        d="M8 14L12 10M12 10L16 14M12 10V18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M12 6H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="bg-white/10 rounded-md p-2 flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-white/70" />
                  </div>
                </div>
              </div>

              <div className="text-white/70 text-xs">
                <p className="mb-1">Важная информация:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Минимальная сумма пополнения: $100</li>
                  <li>Средства зачисляются в течение 24 часов</li>
                  <li>Комиссия за пополнение: 0%</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </TabsContent>

      <TabsContent value="withdraw" className="mt-0">
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdraw-amount" className="text-white">
                  Сумма вывода
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">$</span>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-8 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="withdraw-method" className="text-white">
                  Способ вывода
                </Label>
                <Select value={withdrawMethod} onValueChange={setWithdrawMethod} required>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Выберите способ вывода" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/20 text-white">
                    <SelectItem value="card">Банковская карта</SelectItem>
                    <SelectItem value="crypto">Криптовалюта</SelectItem>
                    <SelectItem value="bank">Банковский перевод</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Обработка...
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="h-4 w-4 mr-2" />
                    Вывести средства
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white/5 rounded-lg p-4 border border-white/10"
          >
            <h3 className="text-white font-medium mb-4">Информация о выводе</h3>

            <div className="space-y-4">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-md p-3">
                <p className="text-yellow-300 text-sm">
                  Запросы на вывод обрабатываются в течение 24-48 часов. Минимальная сумма вывода: $50.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-white/70 text-sm">Доступные способы вывода:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/10 rounded-md p-3 flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-white/70" />
                    <span className="text-white/90 text-sm">Банковская карта</span>
                  </div>
                  <div className="bg-white/10 rounded-md p-3 flex items-center space-x-3">
                    <svg
                      className="h-5 w-5 text-white/70"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2L2 7L12 12L22 7L12 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 17L12 22L22 17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 12L12 17L22 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-white/90 text-sm">Криптовалюта</span>
                  </div>
                </div>
              </div>

              <div className="text-white/70 text-xs">
                <p className="mb-1">Комиссии за вывод:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Банковская карта: 2.5%</li>
                  <li>Криптовалюта: 1%</li>
                  <li>Банковский перевод: 3%</li>
                  <li>PayPal: 3.5%</li>
                </ul>
              </div>

              <div className="text-white/70 text-xs">
                <p className="mb-1">Лимиты:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Минимальная сумма: $50</li>
                  <li>Максимальная сумма: $10,000 в день</li>
                  <li>Максимальная сумма: $50,000 в месяц</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </TabsContent>

      <TabsContent value="transfer" className="mt-0">
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <form onSubmit={handleTransfer} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="transfer-amount" className="text-white">
                  Сумма перевода
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">$</span>
                  <Input
                    id="transfer-amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-8 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient-address" className="text-white">
                  Адрес получателя
                </Label>
                <Input
                  id="recipient-address"
                  placeholder="Введите ID или адрес кошелька"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Обработка...
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Перевести средства
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white/5 rounded-lg p-4 border border-white/10"
          >
            <h3 className="text-white font-medium mb-4">Информация о переводах</h3>

            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-md p-3">
                <p className="text-blue-300 text-sm">
                  Переводы между пользователями платформы выполняются мгновенно и без комиссии.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-white/70 text-sm">Недавние получатели:</p>
                <div className="space-y-2">
                  <div className="bg-white/10 rounded-md p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-xs">
                          АС
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white/90 text-sm">Алексей Смирнов</p>
                        <p className="text-white/60 text-xs">ID: 58392</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    >
                      Выбрать
                    </Button>
                  </div>
                  <div className="bg-white/10 rounded-md p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-xs">
                          ЕК
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white/90 text-sm">Екатерина Козлова</p>
                        <p className="text-white/60 text-xs">ID: 67201</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    >
                      Выбрать
                    </Button>
                  </div>
                </div>
              </div>

              <div className="text-white/70 text-xs">
                <p className="mb-1">Важная информация:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Минимальная сумма перевода: $10</li>
                  <li>Максимальная сумма: $5,000 в день</li>
                  <li>Переводы необратимы, проверяйте данные получателя</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </TabsContent>
    </Tabs>
  )
}

function Avatar({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={`relative inline-block rounded-full overflow-hidden ${className || ""}`}>{children}</div>
}

function AvatarFallback({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={`flex items-center justify-center w-full h-full ${className || ""}`}>{children}</div>
}
