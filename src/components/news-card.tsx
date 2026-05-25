'use client'

import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface NewsCardData {
  id: string
  title: string
  excerpt?: string
  imageUrl?: string
  date: string
  category?: string
}

interface NewsCardProps {
  news: NewsCardData
  index?: number
}

export function NewsCard({ news, index = 0 }: NewsCardProps) {
  const formattedDate = news.date
    ? new Date(news.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

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
          {news.imageUrl ? (
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
              <span className="text-4xl font-bold text-white/30">
                {news.title.charAt(0)}
              </span>
            </div>
          )}

          {/* Category badge */}
          {news.category && (
            <Badge className="absolute top-3 left-3 bg-white/90 text-gray-700 border-0 text-xs">
              {news.category}
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
            {news.title}
          </h3>

          {news.excerpt && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
              {news.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formattedDate}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 text-xs p-0 h-auto"
            >
              Read More →
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
