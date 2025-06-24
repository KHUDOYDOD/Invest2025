import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array(4)
        .fill(null)
        .map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
    </div>
  )
}

export function RevenueChartSkeleton() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[350px] w-full" />
      </CardContent>
    </Card>
  )
}

export function InvoicesTableSkeleton() {
  return (
    <div className="rounded-md border">
      <div className="p-4">
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="border-t">
        {Array(5)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
      </div>
    </div>
  )
}
