"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CalculatorIcon, TrendingUp, TrendingDown } from "lucide-react"

interface CalculationResult {
  profit: number
  loss: number
  riskReward: number
  positionSize: number
}

export function Calculator() {
  const [entryPrice, setEntryPrice] = useState("")
  const [stopLoss, setStopLoss] = useState("")
  const [takeProfit, setTakeProfit] = useState("")
  const [accountBalance, setAccountBalance] = useState("")
  const [riskPercentage, setRiskPercentage] = useState("2")
  const [tradeType, setTradeType] = useState("long")
  const [result, setResult] = useState<CalculationResult | null>(null)

  const calculateTrade = () => {
    const entry = Number.parseFloat(entryPrice)
    const stop = Number.parseFloat(stopLoss)
    const target = Number.parseFloat(takeProfit)
    const balance = Number.parseFloat(accountBalance)
    const risk = Number.parseFloat(riskPercentage)

    if (!entry || !stop || !target || !balance || !risk) return

    const isLong = tradeType === "long"
    const riskAmount = (balance * risk) / 100

    let riskPerShare: number
    let profitPerShare: number

    if (isLong) {
      riskPerShare = entry - stop
      profitPerShare = target - entry
    } else {
      riskPerShare = stop - entry
      profitPerShare = entry - target
    }

    const positionSize = Math.abs(riskAmount / riskPerShare)
    const profit = profitPerShare * positionSize
    const loss = riskAmount
    const riskReward = Math.abs(profitPerShare / riskPerShare)

    setResult({
      profit,
      loss,
      riskReward,
      positionSize,
    })
  }

  useEffect(() => {
    if (entryPrice && stopLoss && takeProfit && accountBalance) {
      calculateTrade()
    }
  }, [entryPrice, stopLoss, takeProfit, accountBalance, riskPercentage, tradeType])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalculatorIcon className="h-5 w-5" />
          Trading Calculator
        </CardTitle>
        <CardDescription>Calculate position size, risk, and potential profit/loss for your trades</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="trade-type">Trade Type</Label>
            <Select value={tradeType} onValueChange={setTradeType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="long">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    Long
                  </div>
                </SelectItem>
                <SelectItem value="short">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    Short
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="risk-percentage">Risk %</Label>
            <Select value={riskPercentage} onValueChange={setRiskPercentage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1%</SelectItem>
                <SelectItem value="2">2%</SelectItem>
                <SelectItem value="3">3%</SelectItem>
                <SelectItem value="5">5%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="account-balance">Account Balance ($)</Label>
            <Input
              id="account-balance"
              type="number"
              placeholder="10000"
              value={accountBalance}
              onChange={(e) => setAccountBalance(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="entry-price">Entry Price ($)</Label>
            <Input
              id="entry-price"
              type="number"
              placeholder="100.00"
              step="0.01"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stop-loss">Stop Loss ($)</Label>
            <Input
              id="stop-loss"
              type="number"
              placeholder="95.00"
              step="0.01"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="take-profit">Take Profit ($)</Label>
            <Input
              id="take-profit"
              type="number"
              placeholder="110.00"
              step="0.01"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
            />
          </div>
        </div>

        {result && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg space-y-3">
            <h3 className="font-semibold text-slate-900">Calculation Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-slate-600">Position Size</p>
                <p className="text-lg font-semibold">{result.positionSize.toFixed(2)} shares</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-600">Risk/Reward Ratio</p>
                <Badge variant={result.riskReward >= 2 ? "default" : "secondary"}>
                  1:{result.riskReward.toFixed(2)}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-600">Potential Profit</p>
                <p className="text-lg font-semibold text-green-600">+${result.profit.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-600">Potential Loss</p>
                <p className="text-lg font-semibold text-red-600">-${result.loss.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        <Button onClick={calculateTrade} className="w-full">
          Recalculate
        </Button>
      </CardContent>
    </Card>
  )
}
