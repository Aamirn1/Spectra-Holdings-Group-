'use client'

import { motion } from 'framer-motion'
import { UserPlus, Store, Trees, Sparkles } from 'lucide-react'

const steps = [
  {
    icon: UserPlus,
    title: 'Residents Join',
    description: 'Community members sign up and connect to their local neighborhood platform, gaining access to services and events.',
    color: 'from-purple-500 to-violet-600',
  },
  {
    icon: Store,
    title: 'Businesses Register',
    description: 'Local businesses list their services on the platform, reaching residents who need what they offer most.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: Trees,
    title: 'Community Grows',
    description: 'As more residents and businesses connect, the local ecosystem strengthens — creating jobs, trust, and convenience.',
    color: 'from-purple-600 to-violet-500',
  },
  {
    icon: Sparkles,
    title: 'Everyone Benefits',
    description: 'Residents find trusted services, businesses gain customers, and communities flourish together in a self-reinforcing cycle.',
    color: 'from-violet-600 to-purple-500',
  },
]

export function EcosystemSection() {
  return (
    <section className="relative py-16 sm:py-24 bg-[#0a0a0f]">
      {/* Background accent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-[0.04]"
        style={{
          background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.5) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            How the{' '}
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-300 bg-clip-text text-transparent">
              Ecosystem Works
            </span>
          </h2>
          <div className="w-24 h-1 gradient-primary mx-auto rounded-full mb-6" />
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
            A self-reinforcing cycle where every participant contributes to and benefits from community growth.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-[12.5%] right-[12.5%] h-[2px] -translate-y-1/2">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-purple-500/30 via-violet-500/40 to-purple-500/30 origin-left"
            />
            {/* Animated dots on line */}
            {[0, 33, 66, 100].map((pos, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.2 }}
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full gradient-primary"
                style={{ left: `${pos}%`, transform: 'translate(-50%, -50%)' }}
              />
            ))}
          </div>

          {/* Steps Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 * i }}
                className="relative glass-strong rounded-2xl p-5 sm:p-6 card-hover group text-center"
              >
                {/* Step Number */}
                <div className="absolute -top-3 -right-3 w-7 h-7 sm:w-8 sm:h-8 gradient-primary rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold glow-purple">
                  {i + 1}
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-5 group-hover:glow-purple transition-all`}>
                  <step.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>

                {/* Arrow to next step - Mobile/Tablet */}
                {i < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-4">
                    <motion.div
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-purple-400/50">
                        <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
