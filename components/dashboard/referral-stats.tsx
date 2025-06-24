"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Copy, Users, DollarSign, Share, UserPlus } from "lucide-react"

// Пустой массив вместо mock данных
const mockReferrals: any[] = []

export function ReferralStats() {
  const [referralLink] = useState("https://investpro.com/ref/user123456")
  const [copied, setCopied] = useState(false)

  const totalReferrals = mockReferrals.length
  const totalEarned = mockReferrals.reduce((sum, ref) => sum + ref.earned, 0)
  const totalInvested = mockReferrals.reduce((sum, ref) => sum + ref.totalInvested, 0)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Всего рефералов</p>
                <p className="text-2xl font-bold">{totalReferrals}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Заработано</p>
                <p className="text-2xl font-bold text-green-600">${totalEarned}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Инвестировано рефералами</p>
                <p className="text-2xl font-bold">${totalInvested.toLocaleString()}</p>
              </div>
              <Share className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link */}
      <Card>
        <CardHeader>
          <CardTitle>Ваша реферальная ссылка</CardTitle>
          <CardDescription>
            Поделитесь этой ссылкой и получайте до 10% от депозитов приглашенных пользователей
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="referral-link">Реферальная ссылка</Label>
            <div className="flex space-x-2">
              <Input id="referral-link" value={referralLink} readOnly />
              <Button onClick={copyToClipboard} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                {copied ? "Скопировано!" : "Копировать"}
              </Button>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Условия реферальной программы</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 1-й уровень: 5% от депозитов приглашенных пользователей</li>
              <li>• 2-й уровень: 3% от депозитов пользователей 2-го уровня</li>
              <li>• 3-й уровень: 2% от депозитов пользователей 3-го уровня</li>
              <li>• Выплаты происходят автоматически при каждом депозите реферала</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Referrals List */}
      <Card>
        <CardHeader>
          <CardTitle>Ваши рефералы</CardTitle>
          <CardDescription>Список пользователей, зарегистрированных по вашей ссылке</CardDescription>
        </CardHeader>
        <CardContent>
          {mockReferrals.length > 0 ? (
            <div className="space-y-4">
              {mockReferrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{referral.name}</h4>
                      <p className="text-sm text-slate-500">{referral.email}</p>
                      <p className="text-xs text-slate-400">
                        Регистрация: {new Date(referral.registrationDate).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant={referral.level === 1 ? "default" : "secondary"}>{referral.level} уровень</Badge>
                    <p className="text-sm">
                      <span className="text-slate-500">Инвестировал:</span> ${referral.totalInvested}
                    </p>
                    <p className="text-sm">
                      <span className="text-slate-500">Заработано:</span>
                      <span className="text-green-600 font-medium"> ${referral.earned}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <UserPlus className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Нет рефералов</h3>
              <p className="text-slate-500 mb-6">Поделитесь своей реферальной ссылкой, чтобы начать зарабатывать</p>
              <Button onClick={copyToClipboard} className="bg-gradient-to-r from-purple-600 to-indigo-600">
                <Copy className="h-4 w-4 mr-2" />
                Скопировать ссылку
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
