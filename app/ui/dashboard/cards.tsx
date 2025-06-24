import { CreditCard, DollarSign, Users, Activity } from "lucide-react"

import { Card as CardUI, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Card({
  title,
  value,
  type,
}: {
  title: string
  value: string | number
  type: "collected" | "pending" | "customers" | "activity"
}) {
  const Icon = {
    collected: DollarSign,
    pending: CreditCard,
    customers: Users,
    activity: Activity,
  }[type]

  return (
    <CardUI>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </CardUI>
  )
}
