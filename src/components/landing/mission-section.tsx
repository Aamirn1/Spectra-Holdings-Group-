'use client'

import { motion } from 'framer-motion'
import { Target, Eye, Heart } from 'lucide-react'

const cards = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'Connecting residents with trusted local services and businesses, creating a seamless ecosystem where communities thrive and local economies flourish together.',
    gradient: 'from-purple-500 to-violet-600',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description: 'Every affordable housing community has access to quality local services — where no resident is disconnected from the businesses and support systems they need.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: Heart,
    title: 'Our Values',
    description: 'Trust, Community, Innovation, Accessibility — these pillars guide every decision we make, every community we develop, and every connection we facilitate.',
    gradient: 'from-purple-600 to-violet-500',
  },
]

export function MissionSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-[#0a0a0f]">
      {/* Ambient glow */}
      <div
        className="absolute bottom-0 left-1/4 w-[600px] h-[400px] rounded-full opacity-[0.03]"
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
            What{' '}
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-300 bg-clip-text text-transparent">
              Drives Us
            </span>
          </h2>
          <div className="w-24 h-1 gradient-primary mx-auto rounded-full mb-6" />
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
            Our purpose goes beyond development. We build the connective tissue that makes communities whole.
          </p>
        </motion.div>

        {/* Three Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 * i }}
              className="relative group"
            >
              {/* Purple gradient border on hover */}
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-purple-500/0 via-purple-500/0 to-purple-500/0 group-hover:from-purple-500/40 group-hover:via-violet-500/20 group-hover:to-purple-500/40 transition-all duration-500 rounded-2xl" />
              
              <div className="relative glass-strong rounded-2xl p-4 sm:p-8 h-full card-hover">
                {/* Icon */}
                <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-6 group-hover:glow-purple transition-all`}>
                  <card.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3">{card.title}</h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed">{card.description}</p>

                {/* Bottom accent line */}
                <div className="mt-6 h-[2px] w-12 gradient-primary rounded-full group-hover:w-full transition-all duration-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
