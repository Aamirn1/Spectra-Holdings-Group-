'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

/** Customer-support headset SVG – headband + earpieces + mic boom */
function HeadsetIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Headband arc */}
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      {/* Left earpiece */}
      <rect x="2" y="13" width="4" height="6" rx="1.5" />
      {/* Right earpiece */}
      <rect x="18" y="13" width="4" height="6" rx="1.5" />
      {/* Microphone boom arm from left earpiece */}
      <path d="M4 19c0 1.5 1 2.5 2.5 2.5h1" />
      {/* Microphone capsule */}
      <circle cx="8.5" cy="21.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
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
            className="fixed z-50 bottom-[88px] right-3 sm:right-6 w-[calc(100vw-1.5rem)] sm:w-96 bg-[#0a0a0f] rounded-2xl shadow-2xl shadow-purple-500/10 border border-white/10 overflow-hidden"
            style={{ maxHeight: 'min(70vh, 480px)' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <HeadsetIcon className="w-4 h-4 text-white" />
                </div>
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
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shrink-0">
                        <HeadsetIcon className="w-3.5 h-3.5 text-white" />
                      </div>
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
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shrink-0">
                      <HeadsetIcon className="w-3.5 h-3.5 text-white" />
                    </div>
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

      {/* Floating Button — Support headset icon with green online dot */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-[88px] right-3 sm:right-6 z-40 w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center text-white hover:from-purple-600 hover:to-violet-700 transition-all hover:scale-105 active:scale-95"
        aria-label="Open AI chat assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <HeadsetIcon className="w-6 h-6" />
        )}
        {/* Green online indicator dot */}
        {!isOpen && (
          <span className="absolute top-0.5 right-0.5">
            <span className="block w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#0a0a0f]" />
            <span className="absolute inset-0 w-3.5 h-3.5 rounded-full bg-green-400 animate-ping opacity-50" />
          </span>
        )}
      </motion.button>
    </>
  )
}
