'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Users, Building2 } from 'lucide-react'
import { useNavigationStore } from '@/lib/store'

export function CTASection() {
  const { navigate } = useNavigationStore()

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      {/* Purple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-violet-900 to-purple-950" />

      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      {/* Glowing orbs */}
      <div
        className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.5) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Join Our Growing Community
          </h2>
          <div className="w-24 h-1 bg-white/30 mx-auto rounded-full mb-6" />
          <p className="text-sm sm:text-base text-white/80 mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            Whether you&apos;re a resident looking for trusted local services, a business wanting to
            reach your community, or simply exploring — there&apos;s a place for you at Spectra Holdings Group.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            className="bg-white text-purple-900 hover:bg-gray-100 font-semibold rounded-full px-6 sm:px-8 text-base sm:text-lg w-full sm:w-auto"
            onClick={() => navigate('register')}
          >
            <Users className="w-5 h-5 mr-2" />
            Join as Resident
          </Button>
          <Button
            size="lg"
            className="bg-white/10 border border-white/20 text-white hover:bg-white/20 font-semibold rounded-full px-6 sm:px-8 text-base sm:text-lg backdrop-blur-sm w-full sm:w-auto"
            onClick={() => navigate('register-business')}
          >
            <Building2 className="w-5 h-5 mr-2" />
            Register Your Business
          </Button>

        </motion.div>
      </div>
    </section>
  )
}
