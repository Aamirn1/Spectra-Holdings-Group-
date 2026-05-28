'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Users, Building2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigationStore } from '@/lib/store'

const communities = [
  {
    name: 'Spectra Heights',
    location: 'Houston, TX',
    businesses: 85,
    residents: 2200,
  },
  {
    name: 'Maple Grove',
    location: 'Jacksonville, FL',
    businesses: 62,
    residents: 1800,
  },
  {
    name: 'Valley Vista',
    location: 'San Jose, CA',
    businesses: 45,
    residents: 1200,
  },
  {
    name: 'Oakwood Commons',
    location: 'Atlanta, GA',
    businesses: 58,
    residents: 1500,
  },
  {
    name: 'Riverside Terrace',
    location: 'Dallas, TX',
    businesses: 72,
    residents: 1900,
  },
  {
    name: 'Cedar Park Village',
    location: 'Orlando, FL',
    businesses: 38,
    residents: 950,
  },
]

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, target, duration])

  return <span ref={ref}>{count.toLocaleString()}</span>
}

export function CommunitiesSection() {
  const { navigate } = useNavigationStore()

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-[#0a0a0f]">
      {/* Ambient glow */}
      <div
        className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full opacity-[0.03]"
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
            Our{' '}
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-300 bg-clip-text text-transparent">
              Communities
            </span>
          </h2>
          <div className="w-24 h-1 gradient-primary mx-auto rounded-full mb-6" />
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
            Thriving neighborhoods where residents and local businesses create lasting connections.
          </p>
        </motion.div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {communities.map((community, i) => (
            <motion.div
              key={community.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="glass rounded-xl p-4 sm:p-6 card-hover group"
            >
              {/* Community Name */}
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-violet-300 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                {community.name}
              </h3>

              {/* Location */}
              <div className="flex items-center gap-1 text-sm text-gray-400 mb-4">
                <MapPin className="w-4 h-4 text-purple-400/60" />
                {community.location}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="glass rounded-lg p-2.5 sm:p-3 text-center">
                  <Building2 className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                  <p className="text-base sm:text-lg font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
                    <AnimatedCounter target={community.businesses} />
                  </p>
                  <p className="text-xs text-gray-500">Businesses</p>
                </div>
                <div className="glass rounded-lg p-2.5 sm:p-3 text-center">
                  <Users className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                  <p className="text-base sm:text-lg font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
                    <AnimatedCounter target={community.residents} />
                  </p>
                  <p className="text-xs text-gray-500">Residents</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Button
            size="lg"
            className="gradient-primary text-white hover:opacity-90 font-semibold rounded-full px-8 text-lg glow-purple border-0 w-full sm:w-auto"
            onClick={() => navigate('directory')}
          >
            Explore All Communities
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
