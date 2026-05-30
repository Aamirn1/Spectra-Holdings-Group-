'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface FloatingActionsProps {
  onChatOpen: () => void
}

export function FloatingActions({ onChatOpen }: FloatingActionsProps) {
  const [expanded, setExpanded] = useState(false)
  const [visible, setVisible] = useState(false)

  // Show FAB only after user scrolls past hero section (~600px on mobile)
  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // check initial
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleExpand = () => {
    setExpanded(!expanded)
  }

  const handleWhatsApp = () => {
    window.open('https://wa.me/19546849707', '_blank', 'noopener,noreferrer')
    setExpanded(false)
  }

  const handleChat = () => {
    onChatOpen()
    setExpanded(false)
  }

  const buttonSize = 'w-12 h-12 sm:w-14 sm:h-14'
  const iconSizeSmall = 'w-5 h-5 sm:w-6 sm:h-6'

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-40 flex flex-col items-center gap-3"
        >
          {/* Expandable sub-buttons — appear above the main FAB */}
          <AnimatePresence>
            {expanded && (
              <>
                {/* WhatsApp option */}
                <motion.button
                  key="whatsapp"
                  initial={{ opacity: 0, scale: 0, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0, y: 20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.05 }}
                  onClick={handleWhatsApp}
                  className={`${buttonSize} bg-[#25D366] hover:bg-[#20bd5a] rounded-full shadow-lg shadow-green-500/25 flex items-center justify-center text-white transition-colors active:scale-95`}
                  aria-label="Chat on WhatsApp"
                >
                  <svg viewBox="0 0 24 24" className={iconSizeSmall + ' fill-current'}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </motion.button>

                {/* AI Chat option */}
                <motion.button
                  key="chat"
                  initial={{ opacity: 0, scale: 0, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0, y: 20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
                  onClick={handleChat}
                  className={`${buttonSize} rounded-full shadow-lg shadow-purple-500/25 flex items-center justify-center transition-colors active:scale-95 overflow-hidden p-0`}
                  aria-label="AI Chat Assistant"
                >
                  <Image
                    src="/headset-icon.png"
                    alt="AI Assistant"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover rounded-full"
                  />
                </motion.button>
              </>
            )}
          </AnimatePresence>

          {/* Main FAB button — WhatsApp icon when collapsed, X when expanded */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleExpand}
            className={`${buttonSize} rounded-full shadow-lg flex items-center justify-center text-white cursor-pointer border-0 outline-none focus:outline-none transition-colors ${
              expanded
                ? 'bg-gray-700 hover:bg-gray-600 shadow-gray-700/25'
                : 'bg-[#25D366] hover:bg-[#20bd5a] shadow-green-500/25'
            }`}
            aria-label={expanded ? 'Close options' : 'Open contact options'}
          >
            {expanded ? (
              <motion.div
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.div>
            ) : (
              <motion.div
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.15 }}
              >
                <svg viewBox="0 0 24 24" className={iconSizeSmall + ' fill-current'}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </motion.div>
            )}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
