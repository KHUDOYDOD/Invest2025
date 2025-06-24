"use client"

import { TransactionsList } from "@/components/admin/transactions-list"
import { AdminHeader } from "@/components/admin/header"

export default function AdminTransactionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <AdminHeader />
        
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
          <TransactionsList />
        </div>
      </div>
    </div>
  )
}