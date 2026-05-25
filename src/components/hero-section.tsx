'use client'

import { motion } from 'framer-motion'
import { TypewriterEffect } from '@/components/typewriter-effect'
import { SearchBar } from '@/components/search-bar'
import { Button } from '@/components/ui/button'
import { ArrowRight, Briefcase } from 'lucide-react'
import { useNavigationStore } from '@/lib/store'

const TYPEWRITER_WORDS = [
  'Find Plumbers',
  'Find Restaurants',
  'Find Healthcare',
  'Find Electricians',
  'Find Local Services',
]

const floatingShapes = [
  { size: 80, top: '10%', left: '5%', delay: 0, duration: 8 },
  { size: 60, top: '60%', left: '85%', delay: 1, duration: 10 },
  { size: 100, top: '30%', left: '90%', delay: 2, duration: 12 },
  { size: 40, top: '80%', left: '10%', delay: 3, duration: 9 },
  { size: 70, top: '15%', left: '70%', delay: 1.5, duration: 11 },
  { size: 50, top: '70%', left: '50%', delay: 0.5, duration: 7 },
]

export function HeroSection() {
  const { navigate } = useNavigationStore()

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-700 min-h-[600px] flex items-center">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Floating animated shapes */}
      {floatingShapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10"
          style={{
            width: shape.size,
            height: shape.size,
            top: shape.top,
            left: shape.left,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-16 sm:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Your Neighborhood.{' '}
            <br className="hidden sm:block" />
            Your Services.
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-xl sm:text-2xl text-white/90 mb-2">
            <TypewriterEffect words={TYPEWRITER_WORDS} />
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg text-white/80 mb-8 max-w-2xl mx-auto"
        >
          Connect with trusted local businesses and services in your Spectra community
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <SearchBar
            size="lg"
            showFilters={true}
            onSearch={() => navigate('directory')}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            className="bg-white text-teal-700 hover:bg-gray-100 font-semibold rounded-full px-8 text-lg"
            onClick={() => navigate('directory')}
          >
            Find Services
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white/10 font-semibold rounded-full px-8 text-lg bg-transparent"
            onClick={() => navigate('register-business')}
          >
            <Briefcase className="w-5 h-5 mr-2" />
            List Your Business
          </Button>
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 50L48 45.7C96 41.3 192 32.7 288 30.2C384 27.7 480 31.3 576 38.8C672 46.3 768 57.7 864 58.8C960 60 1056 51 1152 45.8C1248 40.7 1344 39.3 1392 38.8L1440 38.3V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}
