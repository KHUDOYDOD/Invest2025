"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useVoiceNotifications } from "@/hooks/use-voice-notifications"
import { toast } from "sonner"

interface InvestmentPlan {
  id: number
  name: string
  min_amount: number
  max_amount: number
  daily_profit_rate: number
  duration_days: number
}

interface InvestmentDialogProps {
  isOpen: boolean
  onClose: () => void
  plan: InvestmentPlan | null
  userBalance: number
  onSuccess: () => void
}

export function InvestmentDialog({ 
  isOpen, 
  onClose, 
  plan, 
  userBalance, 
  onSuccess 
}: InvestmentDialogProps) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { playInvestmentNotification, playErrorNotification } = useVoiceNotifications()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!plan || !amount) return

    const investmentAmount = parseFloat(amount)
    
    if (investmentAmount < plan.min_amount) {
      const errorMsg = `Минимальная сумма: $${plan.min_amount}`
      toast.error(errorMsg)
      playErrorNotification(errorMsg)
      return
    }

    if (investmentAmount > plan.max_amount) {
      const errorMsg = `Максимальная сумма: $${plan.max_amount}`
      toast.error(errorMsg)
      playErrorNotification(errorMsg)
      return
    }

    if (investmentAmount > userBalance) {
      const errorMsg = "Недостаточно средств на балансе"
      toast.error(errorMsg)
      playErrorNotification(errorMsg)
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/investments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plan_id: plan.id,
          amount: investmentAmount
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success(data.message)
        
        // Воспроизводим голосовое уведомление
        if (data.voiceData) {
          playInvestmentNotification(
            data.voiceData.amount, 
            data.voiceData.planName,
            "Ваша инвестиция активирована"
          )
        }
        
        onSuccess()
        onClose()
        setAmount("")
      } else {
        toast.error(data.error || 'Ошибка создания инвестиции')
        playErrorNotification(data.error || 'Произошла ошибка при создании инвестиции')
      }
    } catch (error) {
      console.error('Investment error:', error)
      const errorMsg = 'Ошибка соединения с сервером'
      toast.error(errorMsg)
      playErrorNotification(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  if (!plan) return null

  const expectedProfit = parseFloat(amount || "0") * (plan.daily_profit_rate / 100) * plan.duration_days

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Инвестировать в план "{plan.name}"</DialogTitle>
          <DialogDescription>
            Создайте новую инвестицию в выбранный план
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Сумма инвестиции</Label>
              <Input
                id="amount"
                type="number"
                placeholder={`Минимум $${plan.min_amount}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={plan.min_amount}
                max={Math.min(plan.max_amount, userBalance)}
                step="0.01"
                required
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Минимум: ${plan.min_amount}</span>
                <span>Максимум: ${plan.max_amount}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Информация о плане</Label>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Дневная ставка:</span>
                  <Badge variant="secondary">{plan.daily_profit_rate}%</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Продолжительность:</span>
                  <Badge variant="outline">{plan.duration_days} дней</Badge>
                </div>
              </div>
            </div>

            {amount && parseFloat(amount) > 0 && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium">Прогноз прибыли:</div>
                <div className="text-lg font-bold text-green-600">
                  ${expectedProfit.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">
                  За {plan.duration_days} дней
                </div>
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              <span>Доступно на балансе: </span>
              <span className="font-medium">${userBalance.toFixed(2)}</span>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading || !amount}>
              {isLoading ? "Создание..." : "Инвестировать"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}