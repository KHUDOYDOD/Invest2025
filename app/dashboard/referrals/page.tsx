"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardNav } from "@/components/dashboard/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReferralStats } from "@/components/dashboard/referral-stats"
import { Users } from "lucide-react"

function ReferralsContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <DashboardHeader />

      <div className="flex">
        <DashboardNav activeItem="referrals" />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-white">Реферальная программа</h1>
              <p className="text-white/70 text-lg">Приглашайте друзей и получайте бонусы</p>
            </div>

            <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Ваши рефералы
                </CardTitle>
                <CardDescription className="text-white/90">Статистика по приглашенным пользователям</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ReferralStats />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function ReferralsPage() {
  return (
    <AuthGuard>
      <ReferralsContent />
    </AuthGuard>
  )
}
