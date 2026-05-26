'use client'

import { motion } from 'framer-motion'
import { MapPin, Calendar, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const projects = [
  {
    title: 'Spectra Heights',
    description: 'A flagship mixed-use community featuring 500 affordable housing units, retail spaces, and a community center with integrated business directory.',
    location: 'Houston, TX',
    status: 'Active',
    units: '500+',
    year: '2023',
  },
  {
    title: 'Maple Grove Residences',
    description: 'A suburban community development with 300 housing units, green spaces, and a dedicated commercial zone for local businesses.',
    location: 'Jacksonville, FL',
    status: 'Active',
    units: '300+',
    year: '2022',
  },
  {
    title: 'Sunset Park Commons',
    description: 'An urban renewal project transforming a historic district into a vibrant community with affordable housing and local enterprise zones.',
    location: 'Brooklyn, NY',
    status: 'Planning',
    units: '400+',
    year: '2025',
  },
  {
    title: 'Valley Vista Community',
    description: 'A master-planned community integrating residential living with a business incubator and technology hub for local entrepreneurs.',
    location: 'San Jose, CA',
    status: 'Completed',
    units: '250+',
    year: '2021',
  },
]

const statusColors: Record<string, string> = {
  Active: 'from-purple-500 to-violet-500',
  Planning: 'from-amber-500 to-orange-500',
  Completed: 'from-green-500 to-emerald-500',
}

export function ProjectsSection() {
  return (
    <section className="relative py-16 sm:py-24 bg-[#0a0a0f]">
      {/* Background accent */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.03]"
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
              Developments
            </span>
          </h2>
          <div className="w-24 h-1 gradient-primary mx-auto rounded-full mb-6" />
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
            Transforming neighborhoods across the nation with thoughtfully designed community developments.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="glass rounded-2xl p-4 sm:p-6 card-hover group relative overflow-hidden"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] gradient-primary opacity-50 group-hover:opacity-100 transition-all" />

              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <Badge
                  className={`bg-gradient-to-r ${statusColors[project.status]} text-white border-0 text-xs font-semibold px-3 py-1`}
                >
                  {project.status}
                </Badge>
                <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-violet-300 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                {project.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {project.description}
              </p>

              {/* Meta Info */}
              <div className="flex items-center flex-wrap gap-2 sm:gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-purple-400/60" />
                  {project.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-purple-400/60" />
                  {project.year}
                </span>
                <span className="text-purple-400/80 font-medium">
                  {project.units} units
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
