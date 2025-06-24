import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"

type Invoice = {
  id: string
  name: string
  email: string
  amount: string
  image?: string
}

export default function LatestInvoices({ latestInvoices = [] }: { latestInvoices: Invoice[] }) {
  return (
    <Card className="col-span-4 md:col-span-2">
      <CardHeader>
        <CardTitle>Latest Invoices</CardTitle>
        <CardDescription>Recent payment activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {latestInvoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  {invoice.image ? (
                    <img src={invoice.image || "/placeholder.svg"} alt={invoice.name} />
                  ) : (
                    <span className="text-xs">{invoice.name.charAt(0)}</span>
                  )}
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{invoice.name}</p>
                  <p className="text-xs text-muted-foreground">{invoice.email}</p>
                </div>
              </div>
              <p className="text-sm font-medium">{invoice.amount}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
