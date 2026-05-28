'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm your Spectra community assistant. How can I help you today?",
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || data.message || data.response || "I'm sorry, I couldn't process that. Please try again.",
      }

      setMessages((prev) => [...prev, botMessage])
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again later.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 bottom-[100px] sm:bottom-[112px] right-3 sm:right-6 w-[calc(100vw-1.5rem)] sm:w-96 bg-[#0a0a0f] rounded-2xl shadow-2xl shadow-purple-500/10 border border-white/10 overflow-hidden"
            style={{ maxHeight: 'min(70vh, 480px)' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/headset-icon.png"
                  alt="Spectra Assistant"
                  width={28}
                  height={28}
                  className="shrink-0"
                />
                <div className="flex items-center gap-1.5">
                  <h3 className="text-white font-semibold text-sm">Spectra Assistant</h3>
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="h-64 sm:h-72 overflow-y-auto p-3 sm:p-4" ref={scrollRef}>
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <Image
                        src="/headset-icon.png"
                        alt="Assistant"
                        width={28}
                        height={28}
                        className="shrink-0"
                      />
                    )}
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white'
                          : 'bg-white/5 text-gray-300 border border-white/10'
                      }`}
                    >
                      {msg.content}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2 justify-start">
                    <Image
                      src="/headset-icon.png"
                      alt="Assistant"
                      width={28}
                      height={28}
                      className="shrink-0"
                    />
                    <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input */}
            <div className="p-2.5 sm:p-3 border-t border-white/10">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 rounded-full bg-white/5 border-white/10 focus-visible:ring-purple-500/50 placeholder:text-gray-500 text-sm"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white rounded-full px-3"
                  size="icon"
                >
                  {isTyping ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating AI Chat Button — uses the uploaded headset image directly */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 15 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-16 right-3 sm:bottom-[76px] sm:right-6 z-40 cursor-pointer border-0 outline-none focus:outline-none p-0 bg-transparent"
        aria-label="Open AI chat assistant"
      >
        {isOpen ? (
          <div className="w-12 h-12 sm:w-[52px] sm:h-[52px] bg-gradient-to-br from-purple-500 to-violet-600 rounded-full shadow-lg shadow-purple-500/25 flex items-center justify-center">
            <X className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
        ) : (
          <div className="relative">
            <Image
              src="/headset-icon.png"
              alt="AI Assistant"
              width={48}
              height={48}
              className="sm:!w-[52px] sm:!h-[52px]"
            />
            {/* Online status dot */}
            <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#0a0a0f]" />
          </div>
        )}
      </motion.button>
    </>
  )
}
