'use client'

import { motion } from 'framer-motion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const leaders = [
  {
    name: 'Syed Aamir Nadeem',
    title: 'CEO & Founder',
    initials: 'SAN',
    description: 'Visionary leader driving the transformation of affordable housing communities through innovative technology and strategic community development.',
    featured: true,
  },
  {
    name: 'Sarah Mitchell',
    title: 'Director of Operations',
    initials: 'SM',
    description: 'Overseeing day-to-day operations across 200+ communities, ensuring seamless service delivery and operational excellence.',
    featured: false,
  },
  {
    name: 'Marcus Johnson',
    title: 'Head of Community Relations',
    initials: 'MJ',
    description: 'Building meaningful relationships between residents, businesses, and community stakeholders to foster thriving neighborhoods.',
    featured: false,
  },
  {
    name: 'Dr. Priya Sharma',
    title: 'Chief Technology Officer',
    initials: 'PS',
    description: 'Leading the development of cutting-edge platforms that connect residents with local services and power the community ecosystem.',
    featured: false,
  },
]

export function LeadershipSection() {
  return (
    <section className="relative py-24 bg-[#0a0a0f]">
      {/* Background accent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-[0.03]"
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
            Our{' '}
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-300 bg-clip-text text-transparent">
              Leadership
            </span>
          </h2>
          <div className="w-24 h-1 gradient-primary mx-auto rounded-full mb-6" />
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            The visionaries and strategists behind Spectra Holdings Group&apos;s mission to transform communities.
          </p>
        </motion.div>

        {/* CEO - Featured Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex justify-center"
        >
          <div className="glass-strong rounded-2xl p-8 max-w-2xl w-full card-hover group relative overflow-hidden">
            {/* Purple accent border */}
            <div className="absolute top-0 left-0 right-0 h-[2px] gradient-primary" />
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="w-24 h-24 border-2 border-purple-500/30 group-hover:border-purple-500/60 transition-all">
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-violet-700 text-white text-2xl font-bold">
                  {leaders[0].initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-bold text-white mb-1">{leaders[0].name}</h3>
                <p className="bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent font-semibold mb-3">
                  {leaders[0].title}
                </p>
                <p className="text-gray-400 leading-relaxed">{leaders[0].description}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Other Leaders Grid */}
        <div className="grid sm:grid-cols-3 gap-6">
          {leaders.slice(1).map((leader, i) => (
            <motion.div
              key={leader.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 * i }}
              className="glass rounded-xl p-6 card-hover group text-center"
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent group-hover:via-purple-500/60 transition-all" 
                style={{ position: 'relative' }} 
              />
              <Avatar className="w-16 h-16 mx-auto mb-4 border-2 border-purple-500/20 group-hover:border-purple-500/50 transition-all">
                <AvatarFallback className="bg-gradient-to-br from-purple-600/80 to-violet-700/80 text-white text-lg font-bold">
                  {leader.initials}
                </AvatarFallback>
              </Avatar>
              <h4 className="text-lg font-semibold text-white mb-1">{leader.name}</h4>
              <p className="text-sm bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent font-medium mb-3">
                {leader.title}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">{leader.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
