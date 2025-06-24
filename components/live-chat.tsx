"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, User, Bot } from "lucide-react"

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Здравствуйте! Как я могу вам помочь?",
      sender: "bot",
      time: "14:30",
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, userMessage])
    setNewMessage("")

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: "Спасибо за ваше сообщение! Наш специалист свяжется с вами в ближайшее время.",
        sender: "bot",
        time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 ${isOpen ? "hidden" : "flex"}`}
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-80 h-96 bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl animate-scale-in">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-lg">
                <MessageCircle className="h-5 w-5 mr-2" />
                Онлайн поддержка
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center text-sm text-blue-100">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              Онлайн
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-64">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-slate-100 text-slate-900"
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      {message.sender === "user" ? <User className="h-3 w-3 mr-1" /> : <Bot className="h-3 w-3 mr-1" />}
                      <span className="text-xs opacity-70">{message.time}</span>
                    </div>
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  placeholder="Введите сообщение..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
