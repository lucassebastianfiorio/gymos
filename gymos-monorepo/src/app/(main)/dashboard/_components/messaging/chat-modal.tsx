"use client"

import { useState } from "react"
import { Send, User, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuthStore } from "@/lib/auth/store"

interface Message {
  id: string
  sender: "user" | "gym"
  text: string
  timestamp: Date
}

export function ChatWithGymModal({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "gym",
      text: "¡Hola! ¿En qué podemos ayudarte hoy?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const handleSend = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue("")

    // Mock response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "gym",
          text: "Recibimos tu mensaje. Un administrador te responderá pronto.",
          timestamp: new Date(),
        },
      ])
    }, 1000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] h-[600px] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b bg-primary text-primary-foreground">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border-2 border-primary-foreground/20">
              <AvatarFallback className="bg-primary-foreground text-primary">
                <Building2 className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <DialogTitle className="text-primary-foreground">Atención al Socio</DialogTitle>
              <DialogDescription className="text-primary-foreground/80 text-xs">
                GymOS — Siempre con vos
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-4 bg-muted/30">
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-white border rounded-tl-none"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1 opacity-70 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-background">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2"
          >
            <Input
              placeholder="Escribe tu mensaje..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
