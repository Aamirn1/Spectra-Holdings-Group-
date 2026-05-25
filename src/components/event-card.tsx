'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface EventCardData {
  id: string
  title: string
  date: string
  location?: string
  imageUrl?: string
  category?: string
}

interface EventCardProps {
  event: EventCardData
  index?: number
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'TBD'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Card className="overflow-hidden rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
        {/* Image or gradient fallback */}
        <div className="relative h-40 overflow-hidden">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <Calendar className="w-12 h-12 text-white/50" />
            </div>
          )}

          {/* Date badge */}
          <div className="absolute top-3 left-3 bg-white rounded-lg shadow-md px-2.5 py-1.5 text-center">
            <div className="text-xs font-bold text-teal-600 uppercase">
              {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
            </div>
            <div className="text-lg font-bold text-gray-900 leading-none">
              {new Date(event.date).getDate()}
            </div>
          </div>

          {/* Category badge */}
          {event.category && (
            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white border-0 text-xs">
              {event.category}
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
            {event.title}
          </h3>

          {event.location && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
            <Button
              size="sm"
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-full text-xs"
            >
              RSVP
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
