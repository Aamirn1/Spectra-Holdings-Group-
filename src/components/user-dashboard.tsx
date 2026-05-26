'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Heart,
  Calendar,
  Search,
  MapPin,
  Building2,
  Compass,
  Sparkles,
  ArrowRight,
  Eye,
  Star,
  Clock,
  LayoutGrid,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuthStore, useNavigationStore } from '@/lib/store'

interface NearbyBusiness {
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

interface CommunityEvent {
  id: string
  title: string
  date: string
  location: string
  imageUrl?: string
  category?: string
}

export function UserDashboard() {
  const { user } = useAuthStore()
  const { navigate } = useNavigationStore()
  const [nearbyBusinesses, setNearbyBusinesses] = useState<NearbyBusiness[]>([])
  const [savedBusinesses, setSavedBusinesses] = useState<NearbyBusiness[]>([])
  const [recentEvents, setRecentEvents] = useState<CommunityEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [bizRes, eventsRes] = await Promise.all([
          fetch('/api/businesses?limit=6'),
          fetch('/api/events?limit=3'),
        ])

        const bizData = await bizRes.json()
        if (bizData.businesses) {
          setNearbyBusinesses(bizData.businesses)
          // Use first 3 as "saved" for demo purposes
          setSavedBusinesses(bizData.businesses.slice(0, 3))
        }

        const eventsData = await eventsRes.json()
        if (eventsData.events) {
          setRecentEvents(eventsData.events)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getCategoryName = (cat: NearbyBusiness['category']) =>
    typeof cat === 'string' ? cat : cat.name

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4 sm:px-0">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="rounded-2xl border-0 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-violet-900 to-purple-800" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl" />
          </div>
          <CardContent className="relative p-6 sm:p-8 flex items-center gap-4 sm:gap-6">
            <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-purple-400/30 shadow-lg shadow-purple-500/20">
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-white text-2xl font-bold">
                {user?.name?.charAt(0) || 'R'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-purple-300" />
                <span className="text-purple-300 text-sm font-medium">Resident Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Welcome back, {user?.name || 'Resident'}!
              </h1>
              <p className="text-purple-200/70 mt-1">Explore your community and discover local services</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        <Card className="glass-strong rounded-2xl border-0 card-hover">
          <CardContent className="p-4 sm:p-5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <Heart className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{savedBusinesses.length}</p>
              <p className="text-xs text-gray-400">Saved Businesses</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong rounded-2xl border-0 card-hover">
          <CardContent className="p-4 sm:p-5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-violet-500/15 flex items-center justify-center">
              <Compass className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{nearbyBusinesses.length}</p>
              <p className="text-xs text-gray-400">Nearby Services</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong rounded-2xl border-0 card-hover">
          <CardContent className="p-4 sm:p-5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{recentEvents.length}</p>
              <p className="text-xs text-gray-400">Community Events</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong rounded-2xl border-0 card-hover">
          <CardContent className="p-4 sm:p-5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-violet-500/15 flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{nearbyBusinesses.filter(b => b.isFeatured).length}</p>
              <p className="text-xs text-gray-400">Active Listings</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button
            onClick={() => navigate('directory')}
            className="h-auto py-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 shadow-lg shadow-purple-500/20"
          >
            <div className="flex flex-col items-center gap-1.5">
              <LayoutGrid className="w-5 h-5" />
              <span className="text-xs font-medium">Browse Directory</span>
            </div>
          </Button>
          <Button
            onClick={() => navigate('directory')}
            className="h-auto py-4 rounded-xl glass-strong text-purple-300 hover:text-white hover:bg-white/10 border-0"
          >
            <div className="flex flex-col items-center gap-1.5">
              <Search className="w-5 h-5" />
              <span className="text-xs font-medium">Search Services</span>
            </div>
          </Button>
          <Button
            onClick={() => navigate('events')}
            className="h-auto py-4 rounded-xl glass-strong text-purple-300 hover:text-white hover:bg-white/10 border-0"
          >
            <div className="flex flex-col items-center gap-1.5">
              <Calendar className="w-5 h-5" />
              <span className="text-xs font-medium">View Events</span>
            </div>
          </Button>
          <Button
            onClick={() => navigate('directory')}
            className="h-auto py-4 rounded-xl glass-strong text-purple-300 hover:text-white hover:bg-white/10 border-0"
          >
            <div className="flex flex-col items-center gap-1.5">
              <MapPin className="w-5 h-5" />
              <span className="text-xs font-medium">Find Nearby</span>
            </div>
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nearby Businesses - 2 cols */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="glass-strong rounded-2xl border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-white text-lg">
                  <Compass className="w-5 h-5 text-purple-400" />
                  Nearby Businesses
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                  onClick={() => navigate('directory')}
                >
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-white/5 rounded-xl h-28" />
                  ))}
                </div>
              ) : nearbyBusinesses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                  {nearbyBusinesses.map((biz) => (
                    <div
                      key={biz.id}
                      className="group p-4 rounded-xl bg-white/5 hover:bg-white/8 border border-white/5 hover:border-purple-500/20 transition-all duration-200 cursor-pointer"
                      onClick={() => navigate('business-detail', { slug: biz.slug, id: biz.id })}
                    >
                      <div className="flex items-start gap-3">
                        <div className="shrink-0">
                          {biz.logoUrl ? (
                            <img src={biz.logoUrl} alt={biz.name} className="w-11 h-11 rounded-lg object-cover" />
                          ) : (
                            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                              {biz.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white text-sm truncate group-hover:text-purple-300 transition-colors">
                            {biz.name}
                          </h4>
                          <Badge variant="secondary" className="mt-1 text-[10px] bg-purple-500/10 text-purple-300 border-0">
                            {getCategoryName(biz.category)}
                          </Badge>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {biz.city}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {biz.viewCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building2 className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No businesses found nearby</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Right sidebar - Saved + Events */}
        <div className="space-y-6">
          {/* My Saved Businesses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="glass-strong rounded-2xl border-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-white text-lg">
                  <Heart className="w-5 h-5 text-purple-400" />
                  My Saved
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse bg-white/5 rounded-lg h-16" />
                    ))}
                  </div>
                ) : savedBusinesses.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {savedBusinesses.map((biz) => (
                      <div
                        key={biz.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/8 border border-white/5 cursor-pointer transition-all"
                        onClick={() => navigate('business-detail', { slug: biz.slug, id: biz.id })}
                      >
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {biz.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-white truncate">{biz.name}</p>
                          <p className="text-xs text-gray-400 truncate">{getCategoryName(biz.category)} · {biz.city}</p>
                        </div>
                        <Heart className="w-4 h-4 text-purple-400 fill-purple-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Heart className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No saved businesses</p>
                    <Button
                      variant="link"
                      className="text-purple-400 hover:text-purple-300 mt-1 p-0 h-auto"
                      onClick={() => navigate('directory')}
                    >
                      Browse Directory
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Community Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <Card className="glass-strong rounded-2xl border-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-white text-lg">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    Upcoming Events
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                    onClick={() => navigate('events')}
                  >
                    All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse bg-white/5 rounded-lg h-16" />
                    ))}
                  </div>
                ) : recentEvents.length > 0 ? (
                  <div className="space-y-2">
                    {recentEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-3 rounded-lg bg-white/5 hover:bg-white/8 border border-white/5 transition-all cursor-pointer"
                        onClick={() => navigate('events')}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center shrink-0">
                            <span className="text-white text-xs font-bold">
                              {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-white truncate">{event.title}</p>
                            <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{event.location}</span>
                            </div>
                            <p className="text-xs text-purple-400 mt-0.5">
                              {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No upcoming events</p>
                    <Button
                      variant="link"
                      className="text-purple-400 hover:text-purple-300 mt-1 p-0 h-auto"
                      onClick={() => navigate('events')}
                    >
                      View Events
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
