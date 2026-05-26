'use client'

import { motion } from 'framer-motion'
import { Building2, Home, Users, TrendingUp, Shield, Heart } from 'lucide-react'

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
    <section className="relative py-16 sm:py-24 bg-[#0a0a0f]">
      {/* Subtle background glow */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.04]"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            About{' '}
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-300 bg-clip-text text-transparent">
              Spectra Holdings Group
            </span>
          </h2>
          <div className="w-24 h-1 gradient-primary mx-auto rounded-full mb-6" />
          <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Spectra Holdings Group stands at the intersection of community development and technology,
            creating a new paradigm for how affordable housing communities connect, grow, and thrive.
          </p>
        </motion.div>

        {/* Main Content - Two Column */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left - Description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-strong rounded-2xl p-5 sm:p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Redefining Community Living
              </h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                At Spectra Holdings Group, we believe that every community deserves access to quality
                services, trusted local businesses, and a connected resident experience. Our platform
                bridges the gap between affordable housing developments and the local economy that
                sustains them.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Through innovative technology and deep community engagement, we create ecosystems where
                residents discover local services, businesses find their customer base, and neighborhoods
                flourish together. From Texas to New York, Florida to California — our footprint of
                community transformation continues to grow.
              </p>
            </div>
          </motion.div>

          {/* Right - Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {aboutStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * i }}
                  className="glass rounded-xl p-4 sm:p-6 text-center card-hover"
                >
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-3" />
                  <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Three Pillars */}
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 * i }}
              className="glass rounded-xl p-5 sm:p-6 card-hover group"
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
