'use client'

import { motion } from 'framer-motion'
import { Heart, Users, Building2, Globe, Target, Award, Shield, Lightbulb } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const STATS = [
  { icon: Users, label: 'Community Members', value: '5,000+', color: 'text-teal-600 bg-teal-50' },
  { icon: Building2, label: 'Local Businesses', value: '500+', color: 'text-orange-600 bg-orange-50' },
  { icon: Globe, label: 'Cities Covered', value: '10+', color: 'text-rose-600 bg-rose-50' },
  { icon: Heart, label: 'Happy Customers', value: '10,000+', color: 'text-emerald-600 bg-emerald-50' },
]

const VALUES = [
  {
    icon: Target,
    title: 'Community First',
    description: 'We believe in the power of local communities. Every connection we facilitate strengthens the neighborhood fabric.',
  },
  {
    icon: Shield,
    title: 'Trust & Verification',
    description: 'Every business on our platform is verified, ensuring residents connect with reliable and trustworthy service providers.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We leverage technology to make finding local services effortless, bringing the community closer together.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We strive for excellence in everything we do, from our platform experience to the businesses we feature.',
  },
]

export function AboutView() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-16"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          About{' '}
          <span className="bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">
            Spectra Holdings Group
          </span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          We&apos;re building the bridge between local communities and the businesses that serve them.
        </p>
      </motion.div>

      {/* Mission */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-16"
      >
        <Card className="rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white border-0">
          <CardContent className="p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              To empower local communities by creating a trusted digital marketplace where residents can easily discover,
              connect with, and support local businesses and services — strengthening neighborhoods one connection at a time.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
      >
        {STATS.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
          >
            <Card className="rounded-xl text-center">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Our Story */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
        <div className="max-w-3xl mx-auto space-y-4 text-gray-600 leading-relaxed">
          <p>
            Spectra Holdings Group was born from a simple observation: finding reliable local services shouldn&apos;t be hard.
            In communities across Pakistan, residents struggled to discover trusted plumbers, electricians, healthcare providers,
            and other essential services in their neighborhoods.
          </p>
          <p>
            We set out to change that. Our platform brings together local businesses and the communities they serve in one
            easy-to-use digital space. Every business is verified, every review is genuine, and every connection matters.
          </p>
          <p>
            Today, Spectra serves thousands of residents across multiple cities, connecting them with hundreds of local businesses.
            But we&apos;re just getting started — our vision is to become the go-to platform for every neighborhood in Pakistan.
          </p>
        </div>
      </motion.div>

      {/* Values */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {VALUES.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            >
              <Card className="rounded-xl h-full">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mb-4">
                    <value.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-500">{value.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
