'use client'

import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EventCard, type EventCardData } from '@/components/event-card'
import { useNavigationStore } from '@/lib/store'

interface EventsSectionProps {
  events: EventCardData[]
  title?: string
  showViewAll?: boolean
}

export function EventsSection({
  events,
  title = 'Upcoming Events',
  showViewAll = true,
}: EventsSectionProps) {
  const { navigate } = useNavigationStore()

  return (
    <section className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-7 h-7 text-orange-500" />
            {title}
          </h2>
          {showViewAll && events.length > 0 && (
            <Button
              variant="ghost"
              className="text-teal-600 hover:text-teal-700"
              onClick={() => navigate('events')}
            >
              View All Events →
            </Button>
          )}
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-500">No Upcoming Events</h3>
            <p className="text-sm text-gray-400 mt-1">Check back soon for new community events!</p>
          </div>
        )}
      </motion.div>
    </section>
  )
}
