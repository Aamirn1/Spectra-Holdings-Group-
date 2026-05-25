'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  MapPin,
  Phone,
  Globe,
  Clock,
  Heart,
  Eye,
  Share2,
  MessageCircle,
  Star,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useNavigationStore } from '@/lib/store'

export interface BusinessDetailData {
  id: string
  name: string
  slug: string
  description: string
  address: string
  city: string
  state: string
  phone: string
  whatsapp?: string
  website?: string
  email?: string
  logoUrl?: string
  coverUrl?: string
  hours?: string
  services?: string
  category: { name: string; slug: string } | string
  isFeatured: boolean
  viewCount: number
  isApproved: boolean
}

interface BusinessDetailProps {
  business: BusinessDetailData
}

export function BusinessDetail({ business }: BusinessDetailProps) {
  const { goBack } = useNavigationStore()
  const [isSaved, setIsSaved] = useState(false)
  const categoryName = typeof business.category === 'string' ? business.category : business.category.name

  const parsedHours: Record<string, string> = business.hours
    ? (() => {
        try { return JSON.parse(business.hours) } catch { return {} }
      })()
    : {}

  const parsedServices: string[] = business.services
    ? (() => {
        try { return JSON.parse(business.services) } catch { return [] }
      })()
    : []

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          onClick={goBack}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Directory
        </Button>
      </motion.div>

      {/* Cover Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-xl overflow-hidden mb-6"
      >
        {business.coverUrl ? (
          <img
            src={business.coverUrl}
            alt={business.name}
            className="w-full h-48 sm:h-64 object-cover"
          />
        ) : (
          <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={business.name}
                className="w-24 h-24 rounded-xl object-cover border-4 border-white/30"
              />
            ) : (
              <span className="text-6xl font-bold text-white/50">
                {business.name.charAt(0)}
              </span>
            )}
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Featured badge */}
        {business.isFeatured && (
          <Badge className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0">
            ⭐ Featured
          </Badge>
        )}
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {business.name}
              </h1>
              {business.isApproved && (
                <CheckCircle2 className="w-5 h-5 text-teal-500" />
              )}
            </div>
            <Badge className="mt-2 bg-teal-50 text-teal-700 border-teal-200">
              {categoryName}
            </Badge>
            <div className="flex items-center gap-1 mt-2 text-gray-500">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{business.address}, {business.city}, {business.state}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isSaved ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsSaved(!isSaved)}
              className={isSaved ? 'bg-rose-500 hover:bg-rose-600' : ''}
            >
              <Heart className={`w-4 h-4 mr-1 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved' : 'Save'}
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {business.viewCount} views
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400" />
            Coming soon
          </span>
        </div>

        <Separator />

        {/* Description */}
        <Card className="rounded-xl">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
            <p className="text-gray-600 leading-relaxed">{business.description}</p>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="rounded-xl">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>

            <div className="grid gap-3">
              {business.phone && (
                <a
                  href={`tel:${business.phone}`}
                  className="flex items-center gap-3 text-gray-600 hover:text-teal-600 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-teal-600" />
                  </div>
                  <span>{business.phone}</span>
                </a>
              )}

              {business.whatsapp && (
                <a
                  href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-600 hover:text-green-600 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <span>WhatsApp: {business.whatsapp}</span>
                </a>
              )}

              {business.website && (
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-600 hover:text-teal-600 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-teal-600" />
                  </div>
                  <span>{business.website}</span>
                </a>
              )}

              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-red-500" />
                </div>
                <span>{business.address}, {business.city}, {business.state}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        {Object.keys(parsedHours).length > 0 && (
          <Card className="rounded-xl">
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-600" />
                Operating Hours
              </h2>
              <div className="grid gap-2">
                {Object.entries(parsedHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">{day}</span>
                    <span className="text-gray-500">{hours}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Services */}
        {parsedServices.length > 0 && (
          <Card className="rounded-xl">
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Services</h2>
              <div className="flex flex-wrap gap-2">
                {parsedServices.map((service, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-gray-100 text-gray-700"
                  >
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl"
          >
            Request Quote
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={() => setIsSaved(!isSaved)}
          >
            <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            {isSaved ? 'Saved to Favorites' : 'Save to Favorites'}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
