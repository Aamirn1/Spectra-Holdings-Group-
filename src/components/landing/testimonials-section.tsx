'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const testimonials = [
  {
    name: 'Maria Rodriguez',
    role: 'Resident, Spectra Heights',
    initials: 'MR',
    rating: 5,
    text: 'Spectra transformed how I find local services. Within my first week, I discovered a plumber, a babysitter, and a caterer — all within walking distance. This platform truly connects our community.',
  },
  {
    name: 'James Chen',
    role: 'Business Owner, Valley Vista',
    initials: 'JC',
    rating: 5,
    text: 'As a small restaurant owner, Spectra gave me visibility I never had before. My customer base grew by 40% in just three months. The community-first approach makes all the difference.',
  },
  {
    name: 'Aisha Thompson',
    role: 'Community Manager, Oakwood Commons',
    initials: 'AT',
    rating: 5,
    text: 'Managing 1,500+ residents used to mean endless phone calls and bulletin boards. Spectra centralized everything — events, services, communication. It\'s a game-changer for community management.',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? 'fill-purple-400 text-purple-400'
              : 'text-gray-600'
          }`}
        />
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  return (
    <section className="relative py-24 bg-[#0a0a0f]">
      {/* Background accent */}
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full opacity-[0.03]"
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
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-300 bg-clip-text text-transparent">
              Communities
            </span>
          </h2>
          <div className="w-24 h-1 gradient-primary mx-auto rounded-full mb-6" />
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Hear from the residents, business owners, and community managers who experience the Spectra difference every day.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 * i }}
              className="glass-strong rounded-2xl p-6 card-hover group relative overflow-hidden"
            >
              {/* Quote icon */}
              <Quote className="absolute top-4 right-4 w-10 h-10 text-purple-500/10 group-hover:text-purple-500/20 transition-colors" />

              {/* Top purple accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent group-hover:via-purple-500/60 transition-all" />

              {/* Star Rating */}
              <div className="mb-4">
                <StarRating rating={testimonial.rating} />
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-300 leading-relaxed mb-6 text-sm">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border border-purple-500/20">
                  <AvatarFallback className="bg-gradient-to-br from-purple-600/60 to-violet-700/60 text-white text-xs font-bold">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                  <p className="text-xs text-purple-400/80">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
