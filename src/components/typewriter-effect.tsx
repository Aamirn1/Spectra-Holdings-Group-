'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TypewriterEffectProps {
  words: string[]
  speed?: number
  deleteSpeed?: number
  pauseDuration?: number
}

export function TypewriterEffect({
  words,
  speed = 80,
  deleteSpeed = 40,
  pauseDuration = 2000,
}: TypewriterEffectProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const word = words[currentWordIndex]

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setCurrentText(word.slice(0, currentText.length + 1))
          if (currentText.length + 1 === word.length) {
            setTimeout(() => setIsDeleting(true), pauseDuration)
          }
        } else {
          setCurrentText(word.slice(0, currentText.length - 1))
          if (currentText.length - 1 === 0) {
            setIsDeleting(false)
            setCurrentWordIndex((prev) => (prev + 1) % words.length)
          }
        }
      },
      isDeleting ? deleteSpeed : speed
    )

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentWordIndex, words, speed, deleteSpeed, pauseDuration])

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="inline-flex items-center"
    >
      <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent font-bold">
        {currentText}
      </span>
      <span
        className="ml-0.5 inline-block w-[3px] h-[1em] bg-white transition-opacity duration-100"
        style={{ opacity: cursorVisible ? 1 : 0 }}
      />
    </motion.span>
  )
}
