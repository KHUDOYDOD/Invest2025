"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Cloud, Upload, Download, Trash2, ImageIcon, Video, FileText, Music, Search, Filter } from "lucide-react"

export default function MediaPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const mediaFiles = [
    {
      id: 1,
      name: "hero-background.jpg",
      type: "image",
      size: "2.3 MB",
      uploaded: "2024-01-15",
      url: "/images/hero.jpg",
    },
    {
      id: 2,
      name: "company-video.mp4",
      type: "video",
      size: "45.8 MB",
      uploaded: "2024-01-14",
      url: "/videos/intro.mp4",
    },
    { id: 3, name: "logo-white.png", type: "image", size: "156 KB", uploaded: "2024-01-13", url: "/images/logo.png" },
    {
      id: 4,
      name: "terms-of-service.pdf",
      type: "document",
      size: "890 KB",
      uploaded: "2024-01-12",
      url: "/docs/terms.pdf",
    },
    {
      id: 5,
      name: "notification-sound.mp3",
      type: "audio",
      size: "1.2 MB",
      uploaded: "2024-01-11",
      url: "/audio/notification.mp3",
    },
  ]

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-5 h-5 text-blue-500" />
      case "video":
        return <Video className="w-5 h-5 text-purple-500" />
      case "audio":
        return <Music className="w-5 h-5 text-green-500" />
      default:
        return <FileText className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Управление файлами и медиа</h1>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Cloud className="w-4 h-4 mr-1" />
          Облачное хранилище
        </Badge>
      </div>

      <Tabs defaultValue="files" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="files">Файлы</TabsTrigger>
          <TabsTrigger value="upload">Загрузка</TabsTrigger>
          <TabsTrigger value="storage">Хранилище</TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Cloud className="w-5 h-5" />
                  <span>Медиа файлы</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Поиск файлов..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button size="sm" variant="outline">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>Управление загруженными файлами</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mediaFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      {getFileIcon(file.type)}
                      <div>
                        <h3 className="font-medium">{file.name}</h3>
                        <p className="text-sm text-gray-500">
                          {file.size} • Загружен {file.uploaded}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="capitalize">
                        {file.type}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Загрузка файлов</span>
              </CardTitle>
              <CardDescription>Загрузите новые медиа файлы</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Перетащите файлы сюда</h3>
                <p className="text-gray-500 mb-4">или нажмите для выбора файлов</p>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Выбрать файлы
                </Button>
                <p className="text-xs text-gray-400 mt-4">
                  Поддерживаемые форматы: JPG, PNG, GIF, MP4, PDF, MP3 (макс. 50MB)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cloud className="w-5 h-5" />
                <span>Использование хранилища</span>
              </CardTitle>
              <CardDescription>Статистика использования дискового пространства</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Использовано</span>
                    <span>2.1 GB / 10 GB</span>
                  </div>
                  <Progress value={21} className="h-3" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <ImageIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Изображения</p>
                    <p className="text-lg font-bold">1.2 GB</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Video className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Видео</p>
                    <p className="text-lg font-bold">0.7 GB</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <FileText className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Документы</p>
                    <p className="text-lg font-bold">0.15 GB</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Music className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Аудио</p>
                    <p className="text-lg font-bold">0.05 GB</p>
                  </div>
                </div>

                <Button className="w-full md:w-auto">Увеличить хранилище</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
