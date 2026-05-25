'use client'

import { motion } from 'framer-motion'
import { MapPin, Star, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useNavigationStore } from '@/lib/store'

export interface BusinessCardData {
  id: string
  name: string
  slug: string
  description: string
  city: string
  state: string
  category: { name: string; slug: string } | string
  phone: string
  logoUrl?: string
  isFeatured: boolean
  viewCount: number
}

interface BusinessCardProps {
  business: BusinessCardData
  index?: number
}

export function BusinessCard({ business, index = 0 }: BusinessCardProps) {
  const { navigate } = useNavigationStore()
  const categoryName = typeof business.category === 'string' ? business.category : business.category.name

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card
        className={`group relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${
          business.isFeatured
            ? 'border-2 border-teal-300 shadow-md shadow-teal-100'
            : 'border-gray-200'
        }`}
        onClick={() => navigate('business-detail', { slug: business.slug, id: business.id })}
      >
        {business.isFeatured && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
        )}

        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-4">
            {/* Logo / Avatar */}
            <div className="shrink-0">
              {business.logoUrl ? (
                <img
                  src={business.logoUrl}
                  alt={business.name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                  {business.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900 truncate group-hover:text-teal-600 transition-colors">
                  {business.name}
                </h3>
                {business.isFeatured && (
                  <Badge className="shrink-0 bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 text-xs">
                    Featured
                  </Badge>
                )}
              </div>

              <Badge variant="secondary" className="mt-1 text-xs">
                {categoryName}
              </Badge>

              <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                {business.description}
              </p>

              <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {business.city}, {business.state}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-500 font-medium">New</span>
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {business.viewCount}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
              onClick={(e) => {
                e.stopPropagation()
                navigate('business-detail', { slug: business.slug, id: business.id })
              }}
            >
              View Details →
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
