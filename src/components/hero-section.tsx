'use client'

import { motion } from 'framer-motion'
import { TypewriterEffect } from '@/components/typewriter-effect'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, Building2, MapPin } from 'lucide-react'
import { useNavigationStore } from '@/lib/store'

const TYPEWRITER_WORDS = [
  'Building Communities',
  'Connecting Residents',
  'Empowering Local Business',
  'Transforming Neighborhoods',
]

const floatingOrbs = [
  { size: 200, top: '-5%', left: '-5%', delay: 0, duration: 15, opacity: 0.15 },
  { size: 150, top: '20%', left: '80%', delay: 2, duration: 18, opacity: 0.1 },
  { size: 180, top: '60%', left: '70%', delay: 4, duration: 20, opacity: 0.12 },
  { size: 130, top: '75%', left: '-3%', delay: 1, duration: 16, opacity: 0.08 },
  { size: 120, top: '10%', left: '40%', delay: 3, duration: 14, opacity: 0.1 },
  { size: 160, top: '45%', left: '20%', delay: 5, duration: 22, opacity: 0.06 },
]

const stats = [
  { label: 'States', value: '15+', icon: MapPin },
  { label: 'Communities', value: '200+', icon: Building2 },
  { label: 'Businesses', value: '5,000+', icon: Building2 },
  { label: 'Residents', value: '50,000+', icon: Users },
]

export function HeroSection() {
  const { navigate } = useNavigationStore()

  return (
    <section className="relative overflow-hidden flex items-center bg-[#0a0a0f]">
      {/* Deep gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0a1a] to-[#0a0a0f]" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Animated floating purple orbs */}
      {floatingOrbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            background: `radial-gradient(circle, rgba(139, 92, 246, ${orb.opacity}) 0%, rgba(124, 58, 237, ${orb.opacity * 0.5}) 40%, transparent 70%)`,
          }}
          animate={{
            y: [0, -15, 0, 10, 0],
            x: [0, 8, 0, -5, 0],
            scale: [1, 1.05, 1, 0.95, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Ambient glow at center */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] sm:h-[600px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.3) 0%, rgba(124, 58, 237, 0.1) 30%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-16 sm:pb-20 text-center">
        {/* Typewriter line */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-5 sm:mb-7"
        >
          <p className="text-sm sm:text-lg lg:text-xl text-gray-300 font-light tracking-wide uppercase">
            <TypewriterEffect words={TYPEWRITER_WORDS} />
          </p>
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-5 sm:mb-6 leading-[1.1] tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-300 bg-clip-text text-transparent">
              Spectra
            </span>{' '}
            <span className="text-white">Holdings</span>{' '}
            <span className="text-white">Group</span>
          </h1>
        </motion.div>

        {/* Subheading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          <p className="text-lg sm:text-xl lg:text-2xl font-medium text-white/90 mb-6 sm:mb-8 tracking-wide">
            Building Tomorrow&apos;s Communities, Today
          </p>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-sm sm:text-base lg:text-lg text-gray-400 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2"
        >
          Spectra Holdings Group is a premier community development company dedicated to
          building thriving neighborhoods through affordable housing, local business ecosystems,
          and connected resident experiences.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-3 sm:gap-4 mb-10 sm:mb-14 max-w-md sm:max-w-none mx-auto"
        >
          <Button
            size="lg"
            className="gradient-primary text-white hover:opacity-90 font-semibold rounded-full px-8 py-3 text-sm sm:text-base glow-purple border-0 w-full sm:w-auto tracking-wide"
            onClick={() => navigate('about')}
          >
            Explore Communities
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          </Button>
          <Button
            size="lg"
            className="bg-white/5 border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/50 font-semibold rounded-full px-8 py-3 text-sm sm:text-base backdrop-blur-sm w-full sm:w-auto tracking-wide"
            onClick={() => navigate('register')}
          >
            <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Join as Resident
          </Button>
          <Button
            size="lg"
            className="bg-white/5 border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/50 font-semibold rounded-full px-8 py-3 text-sm sm:text-base backdrop-blur-sm w-full sm:w-auto tracking-wide"
            onClick={() => navigate('register-business')}
          >
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Register Your Business
          </Button>
        </motion.div>

        {/* Animated Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <div className="glass-strong rounded-2xl p-4 sm:p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 + i * 0.15 }}
                  className="text-center"
                >
                  <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mx-auto mb-1" />
                  <p className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
