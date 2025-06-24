"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Lock, Key, AlertTriangle, CheckCircle, XCircle, Eye, Save, RefreshCw } from "lucide-react"

export default function SecurityPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(5)
  const [sessionTimeout, setSessionTimeout] = useState(30)
  const [ipWhitelist, setIpWhitelist] = useState("")

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Безопасность системы</h1>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Shield className="w-4 h-4 mr-1" />
          Защищено
        </Badge>
      </div>

      <Tabs defaultValue="authentication" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="authentication">Аутентификация</TabsTrigger>
          <TabsTrigger value="access">Контроль доступа</TabsTrigger>
          <TabsTrigger value="monitoring">Мониторинг</TabsTrigger>
          <TabsTrigger value="encryption">Шифрование</TabsTrigger>
        </TabsList>

        <TabsContent value="authentication" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>Настройки аутентификации</span>
              </CardTitle>
              <CardDescription>Управление методами входа в систему</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Двухфакторная аутентификация</Label>
                  <p className="text-sm text-gray-500">Обязательная 2FA для всех администраторов</p>
                </div>
                <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="loginAttempts">Максимум попыток входа</Label>
                  <Input
                    id="loginAttempts"
                    type="number"
                    value={loginAttempts}
                    onChange={(e) => setLoginAttempts(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Таймаут сессии (мин)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(Number(e.target.value))}
                  />
                </div>
              </div>

              <Button className="w-full md:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Сохранить настройки аутентификации
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="w-5 h-5" />
                <span>Контроль доступа</span>
              </CardTitle>
              <CardDescription>Управление правами доступа и IP-адресами</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="ipWhitelist">Белый список IP-адресов</Label>
                <Input
                  id="ipWhitelist"
                  placeholder="192.168.1.1, 10.0.0.1"
                  value={ipWhitelist}
                  onChange={(e) => setIpWhitelist(e.target.value)}
                />
                <p className="text-sm text-gray-500">Разделяйте IP-адреса запятыми</p>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Будьте осторожны при настройке IP-фильтрации. Неправильные настройки могут заблокировать доступ.
                </AlertDescription>
              </Alert>

              <Button className="w-full md:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Сохранить настройки доступа
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Мониторинг безопасности</span>
              </CardTitle>
              <CardDescription>Отслеживание подозрительной активности</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="font-medium">Успешные входы</p>
                  <p className="text-2xl font-bold text-green-600">1,234</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="font-medium">Неудачные попытки</p>
                  <p className="text-2xl font-bold text-red-600">45</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="font-medium">Подозрительная активность</p>
                  <p className="text-2xl font-bold text-yellow-600">3</p>
                </div>
              </div>

              <Button className="w-full md:w-auto">
                <RefreshCw className="w-4 h-4 mr-2" />
                Обновить статистику
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="encryption" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Настройки шифрования</span>
              </CardTitle>
              <CardDescription>Управление криптографическими параметрами</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">SSL/TLS сертификат</h3>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Активен до 2025-12-31
                  </Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Алгоритм шифрования</h3>
                  <Badge variant="outline">AES-256</Badge>
                </div>
              </div>

              <Button className="w-full md:w-auto">
                <RefreshCw className="w-4 h-4 mr-2" />
                Обновить сертификат
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
