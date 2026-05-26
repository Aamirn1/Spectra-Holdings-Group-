'use client'

import { motion } from 'framer-motion'
import { TypewriterEffect } from '@/components/typewriter-effect'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, Building2, MapPin } from 'lucide-react'
import { useNavigationStore } from '@/lib/store'
import Image from 'next/image'

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
    <section className="relative overflow-hidden min-h-[100dvh] sm:min-h-screen flex items-center bg-[#0a0a0f]">
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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] sm:h-[600px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.3) 0%, rgba(124, 58, 237, 0.1) 30%, transparent 70%)',
        }}
      />

      {/* Content — Two-column on desktop, stacked on mobile */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-20 pb-12 sm:pb-16 lg:pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* LEFT — Text Content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl lg:max-w-none">
            {/* Typewriter line */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-3 sm:mb-5"
            >
              <p className="text-sm sm:text-xl lg:text-2xl text-gray-300 font-light">
                <TypewriterEffect words={TYPEWRITER_WORDS} />
              </p>
            </motion.div>

            {/* Main heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-5 leading-tight">
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
              <p className="text-base sm:text-2xl lg:text-3xl font-semibold text-white/90 mb-2 sm:mb-3">
                Building Tomorrow&apos;s Communities, Today
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-sm sm:text-base lg:text-lg text-gray-400 mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Spectra Holdings Group is a premier community development company dedicated to
              building thriving neighborhoods through affordable housing, local business ecosystems,
              and connected resident experiences.
            </motion.p>

            {/* CTA Buttons — Stacked on mobile, row on tablet+ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start gap-3 sm:gap-4 mb-8 sm:mb-10 max-w-md sm:max-w-none mx-auto lg:mx-0"
            >
              <Button
                size="lg"
                className="gradient-primary text-white hover:opacity-90 font-semibold rounded-full px-6 sm:px-8 text-sm sm:text-base glow-purple border-0 w-full sm:w-auto"
                onClick={() => navigate('about')}
              >
                Explore Communities
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                className="bg-white/5 border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/50 font-semibold rounded-full px-6 sm:px-8 text-sm sm:text-base backdrop-blur-sm w-full sm:w-auto"
                onClick={() => navigate('register')}
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Join as Resident
              </Button>
              <Button
                size="lg"
                className="bg-white/5 border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/50 font-semibold rounded-full px-6 sm:px-8 text-sm sm:text-base backdrop-blur-sm w-full sm:w-auto"
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
              <div className="glass-strong rounded-2xl p-4 sm:p-6 max-w-lg mx-auto lg:mx-0">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
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

          {/* RIGHT — Team Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-1 w-full max-w-md sm:max-w-lg lg:max-w-none flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[520px] xl:max-w-[580px]">
              {/* Glow behind image */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-violet-500/15 to-purple-600/20 rounded-3xl blur-2xl" />

              {/* Image container with border */}
              <div className="relative rounded-2xl overflow-hidden border border-purple-500/20 shadow-2xl shadow-purple-900/30">
                <Image
                  src="/team-hero.png"
                  alt="Spectra Holdings Group leadership team"
                  width={580}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
                {/* Subtle gradient overlay on image bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/40 via-transparent to-transparent" />
              </div>

              {/* Decorative floating badge */}
              <motion.div
                className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 glass-strong rounded-xl px-3 sm:px-4 py-2 sm:py-3 shadow-lg"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <p className="text-purple-400 font-bold text-sm sm:text-base">Trusted by 50K+</p>
                <p className="text-gray-400 text-xs sm:text-sm">Residents Nationwide</p>
              </motion.div>

              {/* Top-left decorative badge */}
              <motion.div
                className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 glass-strong rounded-xl px-3 sm:px-4 py-2 sm:py-3 shadow-lg"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <p className="text-purple-400 font-bold text-sm sm:text-base">200+</p>
                <p className="text-gray-400 text-xs sm:text-sm">Communities</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade to black */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
    </section>
  )
}
