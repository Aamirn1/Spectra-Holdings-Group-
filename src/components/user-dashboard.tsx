'use client'

import { motion } from 'framer-motion'
import { Heart, Calendar, Search, User, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuthStore, useNavigationStore } from '@/lib/store'

interface SavedBusiness {
  id: string
  name: string
  category: string
  city: string
}

interface UpcomingEvent {
  id: string
  title: string
  date: string
}

interface UserDashboardProps {
  savedBusinesses?: SavedBusiness[]
  upcomingEvents?: UpcomingEvent[]
}

export function UserDashboard({ savedBusinesses = [], upcomingEvents = [] }: UserDashboardProps) {
  const { user } = useAuthStore()
  const { navigate } = useNavigationStore()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white border-0">
          <CardContent className="p-6 flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-white/30">
              <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'User'}!</h1>
              <p className="text-white/80">Manage your saved businesses and upcoming events</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-4"
      >
        <Card className="rounded-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{savedBusinesses.length}</p>
              <p className="text-xs text-gray-500">Saved Businesses</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{upcomingEvents.length}</p>
              <p className="text-xs text-gray-500">Upcoming Events</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl col-span-2 sm:col-span-1">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
              <Search className="w-5 h-5 text-teal-500" />
            </div>
            <div>
              <Button
                variant="ghost"
                className="text-teal-600 hover:text-teal-700 p-0 h-auto font-semibold"
                onClick={() => navigate('directory')}
              >
                Find Services →
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Saved Businesses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="w-5 h-5 text-rose-500" />
                Saved Businesses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {savedBusinesses.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {savedBusinesses.map((biz) => (
                    <div key={biz.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm text-gray-900">{biz.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{biz.category}</Badge>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{biz.city}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-rose-400 hover:text-rose-500">
                        <Heart className="w-4 h-4 fill-current" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No saved businesses yet</p>
                  <Button
                    variant="link"
                    className="text-teal-600 mt-1"
                    onClick={() => navigate('directory')}
                  >
                    Browse Directory
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-orange-500" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-sm text-gray-900">{event.title}</p>
                      <span className="text-xs text-gray-400">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No upcoming events</p>
                  <Button
                    variant="link"
                    className="text-teal-600 mt-1"
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

      {/* Profile Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-teal-500" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Name</p>
                <p className="font-medium text-gray-900">{user?.name || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Email</p>
                <p className="font-medium text-gray-900">{user?.email || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Phone</p>
                <p className="font-medium text-gray-900">{user?.phone || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Location</p>
                <p className="font-medium text-gray-900">
                  {user?.city && user?.state ? `${user.city}, ${user.state}` : '—'}
                </p>
              </div>
            </div>
            <Separator className="my-4" />
            <Button variant="outline" className="rounded-xl">
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
