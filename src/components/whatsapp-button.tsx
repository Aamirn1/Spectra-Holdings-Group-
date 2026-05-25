'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function WhatsAppButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.a
            href="https://wa.me/923205719979"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg shadow-green-500/20 flex items-center justify-center text-white transition-colors"
            aria-label="Chat with us on WhatsApp"
          >
            <MessageCircle className="w-6 h-6" />
            {/* Pulse animation */}
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30" />
          </motion.a>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-white/10 backdrop-blur-xl border-white/10 text-white">
          <p>Chat with us on WhatsApp</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
