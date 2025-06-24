"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { MoreHorizontal, Edit, Trash2, Copy } from "lucide-react"

// Пустой массив вместо mock данных
const mockPlans: any[] = []

export function InvestmentPlansAdmin() {
  const [plans, setPlans] = useState(mockPlans)

  const handleToggleActive = (planId: number) => {
    setPlans(plans.map((plan) => (plan.id === planId ? { ...plan, active: !plan.active } : plan)))
  }

  const handleDeletePlan = (planId: number) => {
    if (confirm("Вы уверены, что хотите удалить этот инвестиционный план?")) {
      setPlans(plans.filter((plan) => plan.id !== planId))
    }
  }

  return (
    <div className="rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50">
            <th className="h-12 px-4 text-left font-medium">ID</th>
            <th className="h-12 px-4 text-left font-medium">Название</th>
            <th className="h-12 px-4 text-left font-medium">Доходность</th>
            <th className="h-12 px-4 text-left font-medium">Срок</th>
            <th className="h-12 px-4 text-left font-medium">Мин. депозит</th>
            <th className="h-12 px-4 text-left font-medium">Макс. депозит</th>
            <th className="h-12 px-4 text-left font-medium">Инвесторы</th>
            <th className="h-12 px-4 text-left font-medium">Активен</th>
            <th className="h-12 px-4 text-left font-medium">Действия</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.id} className="border-b">
              <td className="p-4 align-middle">{plan.id}</td>
              <td className="p-4 align-middle font-medium">{plan.name}</td>
              <td className="p-4 align-middle">
                {plan.dailyReturn}% в день / {plan.totalReturn}% всего
              </td>
              <td className="p-4 align-middle">{plan.term} дней</td>
              <td className="p-4 align-middle">${plan.minDeposit}</td>
              <td className="p-4 align-middle">${plan.maxDeposit}</td>
              <td className="p-4 align-middle">
                {plan.investors} / ${plan.totalInvested.toLocaleString()}
              </td>
              <td className="p-4 align-middle">
                <Switch checked={plan.active} onCheckedChange={() => handleToggleActive(plan.id)} />
              </td>
              <td className="p-4 align-middle">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Действия</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Редактировать</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      <span>Дублировать</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDeletePlan(plan.id)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Удалить</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
