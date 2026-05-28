'use client'

import { motion } from 'framer-motion'
import { Building2, Home, Users, TrendingUp, Shield, Heart } from 'lucide-react'
import Image from 'next/image'

const aboutStats = [
  { label: 'Affordable Housing Units', value: '10,000+', icon: Home },
  { label: 'Active Communities', value: '200+', icon: Building2 },
  { label: 'Residents Served', value: '50,000+', icon: Users },
  { label: 'Local Businesses Supported', value: '5,000+', icon: TrendingUp },
]

const pillars = [
  {
    icon: Shield,
    title: 'Affordable Housing',
    description: 'Developing quality affordable housing communities that provide safe, comfortable living environments for families across the nation.',
  },
  {
    icon: Heart,
    title: 'Community Development',
    description: 'Building more than structures — we cultivate thriving neighborhoods with parks, gathering spaces, and essential amenities.',
  },
  {
    icon: TrendingUp,
    title: 'Economic Empowerment',
    description: 'Connecting residents with local businesses and services, creating sustainable economic ecosystems within each community.',
  },
]

export function AboutSection() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-20 bg-[#0a0a0f]">
      {/* Subtle background glow */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.04]"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CEO Intro — Photo on right, text on left */}
        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-10 mb-12 sm:mb-20">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left"
          >
            <p className="text-purple-400 font-semibold text-sm sm:text-base tracking-wider uppercase mb-2">
              Our Leadership
            </p>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Meet Our{' '}
              <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-300 bg-clip-text text-transparent">
                Chief Executive
              </span>{' '}
              Officer
            </h2>
            <div className="w-16 h-1 gradient-primary rounded-full mb-4 mx-auto lg:mx-0" />
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1">Syed Aamir Nadeem</h3>
            <p className="text-purple-400 font-medium text-sm sm:text-base mb-4">CEO & Founder</p>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-4 max-w-lg mx-auto lg:mx-0">
              A visionary leader driving the transformation of affordable housing communities through
              innovative technology and strategic community development. Under his leadership, Spectra
              Holdings Group has grown from a single community to a nationwide network spanning 15+ states
              and serving over 50,000 residents.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed max-w-lg mx-auto lg:mx-0">
              With a deep commitment to bridging the gap between affordable housing and local economic
              opportunity, he has built a platform where residents, businesses, and neighborhoods flourish together.
            </p>
          </motion.div>

          {/* Right — Team Photo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[500px] xl:max-w-[540px]">
              {/* Glow behind image */}
              <div className="absolute -inset-1 sm:-inset-3 bg-gradient-to-r from-purple-600/20 via-violet-500/15 to-purple-600/20 rounded-3xl blur-2xl" />

              {/* Image container */}
              <div className="relative rounded-2xl overflow-hidden border border-purple-500/20 shadow-2xl shadow-purple-900/30">
                <Image
                  src="/team-hero.png"
                  alt="Spectra Holdings Group leadership team with CEO Syed Aamir Nadeem"
                  width={540}
                  height={370}
                  className="w-full h-auto object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/50 via-transparent to-transparent" />
              </div>

              {/* Floating badge — bottom right */}
              <motion.div
                className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 glass-strong rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-lg"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <p className="text-purple-400 font-bold text-xs sm:text-sm">15+ States</p>
                <p className="text-gray-400 text-[10px] sm:text-xs">Nationwide Reach</p>
              </motion.div>

              {/* Floating badge — top left */}
              <motion.div
                className="absolute top-2 left-2 sm:top-4 sm:left-4 glass-strong rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-lg"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <p className="text-purple-400 font-bold text-xs sm:text-sm">50K+</p>
                <p className="text-gray-400 text-[10px] sm:text-xs">Residents Served</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            About{' '}
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-300 bg-clip-text text-transparent">
              Spectra Holdings Group
            </span>
          </h2>
          <div className="w-24 h-1 gradient-primary mx-auto rounded-full mb-6" />
          <p className="text-sm sm:text-base lg:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Spectra Holdings Group stands at the intersection of community development and technology,
            creating a new paradigm for how affordable housing communities connect, grow, and thrive.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-10 sm:mb-16"
        >
          {aboutStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * i }}
              className="glass rounded-xl p-3 sm:p-6 text-center card-hover"
            >
              <stat.icon className="w-5 h-5 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-2 sm:mb-3" />
              <p className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Three Pillars */}
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 * i }}
              className="glass rounded-xl p-4 sm:p-6 card-hover group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:glow-purple transition-all">
                <pillar.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{pillar.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
