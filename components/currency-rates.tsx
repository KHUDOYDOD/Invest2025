"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader } from "@/components/ui/card"
import { Loader2, ArrowUpRight, ArrowDownRight } from "lucide-react"

type Rates = Record<string, number>

export function CurrencyRates() {
  const [rates, setRates] = useState<Rates | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=EUR,GBP,JPY,BTC,ETH")
        const data = await res.json()
        setRates(data.rates as Rates)
      } catch (err) {
        console.error("Failed to fetch currency rates", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRates()
  }, [])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h3 className="text-lg font-semibold">Live Currency Rates (USD)</h3>
      </CardHeader>

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : rates ? (
        <ul className="divide-y px-6 pb-4">
          {Object.entries(rates).map(([symbol, rate]) => (
            <li key={symbol} className="flex items-center justify-between py-2">
              <span className="font-medium">{symbol}</span>
              <span className="flex items-center gap-1">
                {rate.toFixed(2)}
                {rate >= 1 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-6 py-4 text-sm text-muted-foreground">Could not load rates.</p>
      )}
    </Card>
  )
}
