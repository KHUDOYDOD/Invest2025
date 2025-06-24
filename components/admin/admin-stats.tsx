"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Users, CreditCard, LineChart, DollarSign } from "lucide-react"

export function AdminStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Всего пользователей"
        value="15,783"
        change="+12.5%"
        trend="up"
        icon={<Users className="h-5 w-5" />}
      />
      <StatCard
        title="Инвестиции за месяц"
        value="$1,245,650"
        change="+5.2%"
        trend="up"
        icon={<LineChart className="h-5 w-5" />}
      />
      <StatCard
        title="Выплаты за месяц"
        value="$458,320"
        change="-2.4%"
        trend="down"
        icon={<CreditCard className="h-5 w-5" />}
      />
      <StatCard
        title="Доход платформы"
        value="$84,320"
        change="+18.3%"
        trend="up"
        icon={<DollarSign className="h-5 w-5" />}
      />
    </div>
  )
}

function StatCard({
  title,
  value,
  change,
  trend,
  icon,
}: {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-500 text-sm">{title}</span>
          <div className="bg-slate-100 p-2 rounded-full">{icon}</div>
        </div>
        <div className="text-2xl font-bold mb-2">{value}</div>
        <div className={`flex items-center text-sm ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
          {trend === "up" ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
          {change} за месяц
        </div>
      </CardContent>
    </Card>
  )
}
