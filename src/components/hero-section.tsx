'use client'

import { motion } from 'framer-motion'
import { TypewriterEffect } from '@/components/typewriter-effect'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, Building2, Phone, MapPin } from 'lucide-react'
import { useNavigationStore } from '@/lib/store'

const TYPEWRITER_WORDS = [
  'Building Communities',
  'Connecting Residents',
  'Empowering Local Business',
  'Transforming Neighborhoods',
]

const floatingOrbs = [
  { size: 300, top: '-5%', left: '-5%', delay: 0, duration: 15, opacity: 0.15 },
  { size: 200, top: '20%', left: '80%', delay: 2, duration: 18, opacity: 0.1 },
  { size: 250, top: '60%', left: '70%', delay: 4, duration: 20, opacity: 0.12 },
  { size: 180, top: '75%', left: '-3%', delay: 1, duration: 16, opacity: 0.08 },
  { size: 150, top: '10%', left: '40%', delay: 3, duration: 14, opacity: 0.1 },
  { size: 220, top: '45%', left: '20%', delay: 5, duration: 22, opacity: 0.06 },
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
    <section className="relative overflow-hidden min-h-screen flex items-center bg-[#0a0a0f]">
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
            y: [0, -30, 0, 20, 0],
            x: [0, 15, 0, -10, 0],
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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.3) 0%, rgba(124, 58, 237, 0.1) 30%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
        {/* Typewriter line */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-6"
        >
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 font-light">
            <TypewriterEffect words={TYPEWRITER_WORDS} />
          </p>
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight">
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
          <p className="text-2xl sm:text-3xl font-semibold text-white/90 mb-4">
            Building Tomorrow&apos;s Communities, Today
          </p>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-base sm:text-lg text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed"
        >
          Spectra Holdings Group is a premier community development company dedicated to
          building thriving neighborhoods through affordable housing, local business ecosystems,
          and connected resident experiences. We transform communities across the nation by
          bridging the gap between residents and the services they need.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Button
            size="lg"
            className="gradient-primary text-white hover:opacity-90 font-semibold rounded-full px-8 text-lg glow-purple border-0"
            onClick={() => navigate('about')}
          >
            Explore Communities
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            size="lg"
            className="bg-white/5 border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/50 font-semibold rounded-full px-8 text-lg backdrop-blur-sm"
            onClick={() => navigate('register')}
          >
            <Users className="w-5 h-5 mr-2" />
            Join as Resident
          </Button>
          <Button
            size="lg"
            className="bg-white/5 border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/50 font-semibold rounded-full px-8 text-lg backdrop-blur-sm"
            onClick={() => navigate('register-business')}
          >
            <Building2 className="w-5 h-5 mr-2" />
            Register Your Business
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 text-gray-300 hover:bg-white/5 hover:text-white font-semibold rounded-full px-8 text-lg"
            onClick={() => navigate('contact')}
          >
            <Phone className="w-5 h-5 mr-2" />
            Contact Us
          </Button>
        </motion.div>

        {/* Animated Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <div className="glass-strong rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 + i * 0.15 }}
                  className="text-center"
                >
                  <stat.icon className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade to black */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
    </section>
  )
}
