"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  CreditCard,
  User,
  Calendar,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DepositRequest {
  id: string
  user_id: string
  amount: number
  method: string
  payment_details: any
  status: string
  admin_comment?: string
  created_at: string
  processed_at?: string
  users?: {
    id: string
    full_name: string
    email: string
  }
}

interface WithdrawalRequest {
  id: string
  user_id: string
  amount: number
  method: string
  wallet_address: string
  fee: number
  final_amount: number
  status: string
  admin_comment?: string
  created_at: string
  processed_at?: string
  users?: {
    id: string
    full_name: string
    email: string
  }
}

export default function RequestsPage() {
  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>([])
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRequests()
    // Обновляем каждые 30 секунд
    const interval = setInterval(fetchRequests, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔄 Fetching admin requests...")

      // Fetch deposit requests
      const depositResponse = await fetch("/api/deposit-requests")
      console.log("Deposit response status:", depositResponse.status)

      if (!depositResponse.ok) {
        throw new Error(`HTTP error! status: ${depositResponse.status}`)
      }

      const depositData = await depositResponse.json()
      console.log("✅ Deposit requests loaded:", depositData.length)
      setDepositRequests(Array.isArray(depositData) ? depositData : [])

      // Fetch withdrawal requests
      const withdrawalResponse = await fetch("/api/withdrawal-requests")
      console.log("Withdrawal response status:", withdrawalResponse.status)

      if (!withdrawalResponse.ok) {
        throw new Error(`HTTP error! status: ${withdrawalResponse.status}`)
      }

      const withdrawalData = await withdrawalResponse.json()
      console.log("✅ Withdrawal requests loaded:", withdrawalData.length)
      setWithdrawalRequests(Array.isArray(withdrawalData) ? withdrawalData : [])
    } catch (error) {
      console.error("❌ Error fetching requests:", error)
      setError("Ошибка подключения к серверу")
      toast.error("Ошибка загрузки запросов")
    } finally {
      setLoading(false)
    }
  }

  const handleApproveDeposit = async (requestId: string) => {
    setProcessing(requestId)
    try {
      const response = await fetch(`/api/admin/deposit-requests/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "approved",
        }),
      })

      if (response.ok) {
        setDepositRequests((prev) =>
          prev.map((req) =>
            req.id === requestId ? { ...req, status: "approved", processed_at: new Date().toISOString() } : req,
          ),
        )
        toast.success("Запрос на пополнение одобрен")
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to approve request")
      }
    } catch (error) {
      console.error("Error approving deposit:", error)
      toast.error("Ошибка при одобрении запроса")
    } finally {
      setProcessing(null)
    }
  }

  const handleRejectDeposit = async (requestId: string, reason: string) => {
    setProcessing(requestId)
    try {
      const response = await fetch(`/api/admin/deposit-requests/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "failed",
          admin_comment: reason,
        }),
      })

      if (response.ok) {
        setDepositRequests((prev) =>
          prev.map((req) =>
            req.id === requestId
              ? { ...req, status: "failed", admin_comment: reason, processed_at: new Date().toISOString() }
              : req,
          ),
        )
        toast.success("Запрос на пополнение отклонен")
        // Перезагружаем данные
        fetchRequests()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to reject request")
      }
    } catch (error) {
      console.error("Error rejecting deposit:", error)
      toast.error("Ошибка при отклонении запроса")
    } finally {
      setProcessing(null)
    }
  }

  const handleApproveWithdrawal = async (requestId: string) => {
    setProcessing(requestId)
    try {
      const response = await fetch(`/api/admin/withdrawal-requests/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "completed",
        }),
      })

      if (response.ok) {
        setWithdrawalRequests((prev) =>
          prev.map((req) =>
            req.id === requestId ? { ...req, status: "completed", processed_at: new Date().toISOString() } : req,
          ),
        )
        toast.success("Запрос на вывод одобрен")
        fetchRequests()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to approve request")
      }
    } catch (error) {
      console.error("Error approving withdrawal:", error)
      toast.error("Ошибка при одобрении запроса")
    } finally {
      setProcessing(null)
    }
  }

  const handleRejectWithdrawal = async (requestId: string, reason: string) => {
    setProcessing(requestId)
    try {
      const response = await fetch(`/api/admin/withdrawal-requests/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "failed",
          admin_comment: reason,
        }),
      })

      if (response.ok) {
        setWithdrawalRequests((prev) =>
          prev.map((req) =>
            req.id === requestId
              ? { ...req, status: "failed", admin_comment: reason, processed_at: new Date().toISOString() }
              : req,
          ),
        )
        toast.success("Запрос на вывод отклонен")
        fetchRequests()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to reject request")
      }
    } catch (error) {
      console.error("Error rejecting withdrawal:", error)
      toast.error("Ошибка при отклонении запроса")
    } finally {
      setProcessing(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Ожидает
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Одобрено
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Отклонено
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const RequestCard = ({ request, type, onApprove, onReject }: any) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${type === "deposit" ? "bg-green-100" : "bg-red-100"}`}>
              {type === "deposit" ? (
                <DollarSign className={`w-5 h-5 ${type === "deposit" ? "text-green-600" : "text-red-600"}`} />
              ) : (
                <CreditCard className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">#{request.id.slice(0, 8)}</h3>
              <p className="text-sm text-gray-500 flex items-center">
                <User className="w-4 h-4 mr-1" />
                {request.users?.full_name || request.users?.email || "Пользователь"}
              </p>
            </div>
          </div>
          {getStatusBadge(request.status)}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Сумма:</span>
            <span className="font-semibold text-lg">${request.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Способ:</span>
            <span>{request.method}</span>
          </div>
          {type === "withdrawal" && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">Адрес:</span>
                <span className="text-sm font-mono">{request.wallet_address?.slice(0, 20)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">К выплате:</span>
                <span className="font-semibold">${request.final_amount}</span>
              </div>
            </>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Дата:</span>
            <span className="text-sm flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(request.created_at).toLocaleString("ru-RU")}
            </span>
          </div>
          {request.admin_comment && (
            <div className="flex justify-between">
              <span className="text-gray-600">Комментарий:</span>
              <span className="text-sm text-red-600">{request.admin_comment}</span>
            </div>
          )}
        </div>

        {request.status === "pending" && (
          <div className="flex space-x-2">
            <Button
              onClick={() => onApprove(request.id)}
              disabled={processing === request.id}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {processing === request.id ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Одобрить
            </Button>
            <Dialog open={isDialogOpen && selectedRequest?.id === request.id} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => setSelectedRequest(request)}
                  disabled={processing === request.id}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Отклонить
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Отклонить запрос #{request.id.slice(0, 8)}</DialogTitle>
                  <DialogDescription>
                    Укажите причину отклонения запроса пользователя {request.users?.full_name || request.users?.email}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reason">Причина отклонения</Label>
                    <Textarea
                      id="reason"
                      placeholder="Введите причину отклонения..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => onReject(request.id, rejectReason)}
                    disabled={!rejectReason.trim() || processing === request.id}
                  >
                    {processing === request.id ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Отклонить запрос
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const pendingDeposits = depositRequests.filter((req) => req.status === "pending").length
  const pendingWithdrawals = withdrawalRequests.filter((req) => req.status === "pending").length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Загрузка запросов...</span>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Управление запросами</h1>
        <div className="flex space-x-4">
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Пополнений: {pendingDeposits}
          </Badge>
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Выводов: {pendingWithdrawals}
          </Badge>
          <Button onClick={fetchRequests} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Обновить
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="deposits" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deposits" className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Запросы на пополнение ({pendingDeposits})</span>
          </TabsTrigger>
          <TabsTrigger value="withdrawals" className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span>Запросы на вывод ({pendingWithdrawals})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deposits" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Запросы на пополнение</CardTitle>
              <CardDescription>Управление запросами пользователей на пополнение баланса</CardDescription>
            </CardHeader>
            <CardContent>
              {depositRequests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {depositRequests.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      type="deposit"
                      onApprove={handleApproveDeposit}
                      onReject={handleRejectDeposit}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Нет запросов на пополнение</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Запросы на вывод</CardTitle>
              <CardDescription>Управление запросами пользователей на вывод средств</CardDescription>
            </CardHeader>
            <CardContent>
              {withdrawalRequests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {withdrawalRequests.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      type="withdrawal"
                      onApprove={handleApproveWithdrawal}
                      onReject={handleRejectWithdrawal}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Нет запросов на вывод</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}