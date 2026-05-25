'use client'

import { motion } from 'framer-motion'
import {
  Eye,
  Edit,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  TrendingUp,
  BarChart3,
  Users,
  Settings,
  Plus,
  Building2,
  Sparkles,
  Globe,
  CalendarDays,
  Wrench,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { useAuthStore, useNavigationStore } from '@/lib/store'

interface BusinessInfo {
  id: string
  name: string
  description: string
  category: string
  city: string
  state: string
  isApproved?: boolean
  isFeatured: boolean
  viewCount: number
  logoUrl?: string
  status?: string
}

interface BusinessDashboardProps {
  business: BusinessInfo | null
}

export function BusinessDashboard({ business }: BusinessDashboardProps) {
  const { user } = useAuthStore()
  const { navigate } = useNavigationStore()

  const status = business?.status || (business?.isApproved ? 'approved' : 'pending')

  const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    approved: {
      label: 'Approved',
      color: 'bg-green-500/15 text-green-400 border-green-500/20',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    pending: {
      label: 'Pending Review',
      color: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    rejected: {
      label: 'Rejected',
      color: 'bg-red-500/15 text-red-400 border-red-500/20',
      icon: <XCircle className="w-3.5 h-3.5" />,
    },
  }

  const currentStatus = statusConfig[status] || statusConfig.pending

  // Profile completion calculation
  const profileCompletion = business
    ? Math.round(
        [
          !!business.name,
          !!business.description,
          !!business.category,
          !!business.city,
          !!business.state,
          !!business.logoUrl,
          business.isFeatured,
        ].filter(Boolean).length / 7 * 100
      )
    : 0

  // If no business, show CTA
  if (!business) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="glass-strong rounded-2xl border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-violet-900 to-purple-800" />
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl" />
            </div>
            <CardContent className="relative p-8 sm:p-12 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Create Your Business Listing</h2>
              <p className="text-purple-200/70 mb-8 max-w-md mx-auto">
                Join the Spectra Holdings community and reach thousands of local residents looking for services like yours.
              </p>
              <Button
                className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white rounded-xl px-8 py-3 h-auto text-base shadow-lg shadow-purple-500/30"
                onClick={() => navigate('register-business')}
              >
                <Plus className="w-5 h-5 mr-2" />
                Register Your Business
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Business Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="glass-strong rounded-2xl border-0 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-violet-900/60 to-transparent" />
          <CardContent className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-purple-400/30 shadow-lg shadow-purple-500/20">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-white text-2xl font-bold">
                  {business.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{business.name}</h1>
                  <Badge className={`${currentStatus.color} border text-xs font-medium flex items-center gap-1`}>
                    {currentStatus.icon}
                    {currentStatus.label}
                  </Badge>
                </div>
                <p className="text-purple-200/70">{business.category} · {business.city}, {business.state}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                  <Eye className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold text-white">{business.viewCount}</span>
                  <span>views</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Business Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <Card className="glass-strong rounded-2xl border-0 card-hover">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{Math.max(1, Math.floor(business.viewCount * 0.3))}</p>
              <p className="text-xs text-gray-400">Views This Week</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong rounded-2xl border-0 card-hover">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/15 flex items-center justify-center">
              <Eye className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{business.viewCount}</p>
              <p className="text-xs text-gray-400">Total Views</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong rounded-2xl border-0 card-hover">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{profileCompletion}%</p>
              <p className="text-xs text-gray-400">Profile Completion</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Profile Completion Bar */}
      {profileCompletion < 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card className="glass-strong rounded-2xl border-0">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Complete your profile to increase visibility</span>
                <span className="text-sm font-semibold text-purple-400">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="h-2 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-purple-600 [&>div]:to-violet-500" />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button
            className="h-auto py-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 shadow-lg shadow-purple-500/20"
            onClick={() => navigate('business-detail', { slug: business.name.toLowerCase().replace(/\s+/g, '-'), id: business.id })}
          >
            <div className="flex flex-col items-center gap-1.5">
              <Edit className="w-5 h-5" />
              <span className="text-xs font-medium">Edit Profile</span>
            </div>
          </Button>
          <Button
            className="h-auto py-4 rounded-xl glass-strong text-purple-300 hover:text-white hover:bg-white/10 border-0"
            onClick={() => navigate('business-detail', { slug: business.name.toLowerCase().replace(/\s+/g, '-'), id: business.id })}
          >
            <div className="flex flex-col items-center gap-1.5">
              <Globe className="w-5 h-5" />
              <span className="text-xs font-medium">View Public Page</span>
            </div>
          </Button>
          <Button
            className="h-auto py-4 rounded-xl glass-strong text-purple-300 hover:text-white hover:bg-white/10 border-0"
          >
            <div className="flex flex-col items-center gap-1.5">
              <Plus className="w-5 h-5" />
              <span className="text-xs font-medium">Add Services</span>
            </div>
          </Button>
          <Button
            className="h-auto py-4 rounded-xl glass-strong text-purple-300 hover:text-white hover:bg-white/10 border-0"
          >
            <div className="flex flex-col items-center gap-1.5">
              <CalendarDays className="w-5 h-5" />
              <span className="text-xs font-medium">Manage Hours</span>
            </div>
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <Card className="glass-strong rounded-2xl border-0 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white text-lg">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Business Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Weekly Views Bar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-gray-400">Weekly Views</span>
                    <span className="text-sm font-semibold text-white">{Math.max(1, Math.floor(business.viewCount * 0.3))}</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-600 to-violet-500 transition-all duration-1000"
                      style={{ width: `${Math.min(100, Math.max(10, business.viewCount * 2))}%` }}
                    />
                  </div>
                </div>

                {/* Total Reach */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-gray-400">Total Reach</span>
                    <span className="text-sm font-semibold text-white">{business.viewCount}</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-600 to-purple-500 transition-all duration-1000"
                      style={{ width: `${Math.min(100, Math.max(10, business.viewCount))}%` }}
                    />
                  </div>
                </div>

                {/* Engagement */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-gray-400">Engagement Rate</span>
                    <span className="text-sm font-semibold text-white">{Math.max(5, Math.floor(Math.random() * 30 + 10))}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-400 transition-all duration-1000"
                      style={{ width: `${Math.max(15, Math.floor(Math.random() * 40 + 15))}%` }}
                    />
                  </div>
                </div>

                {/* Profile Strength */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-gray-400">Profile Strength</span>
                    <span className="text-sm font-semibold text-purple-400">{profileCompletion}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-400 to-violet-400 transition-all duration-1000"
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>
                </div>

                <Separator className="bg-white/5" />

                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-400">Tip: Add a logo and services to boost your profile</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="glass-strong rounded-2xl border-0 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white text-lg">
                <Clock className="w-5 h-5 text-purple-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Activity Items */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/15 flex items-center justify-center shrink-0">
                    <Eye className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">Profile View</p>
                    <p className="text-xs text-gray-400">Someone viewed your business listing</p>
                    <p className="text-xs text-purple-400/60 mt-0.5">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">Search Appearance</p>
                    <p className="text-xs text-gray-400">Your business appeared in 3 search results</p>
                    <p className="text-xs text-purple-400/60 mt-0.5">5 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/15 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">Listing Approved</p>
                    <p className="text-xs text-gray-400">Your business listing was approved and is now live</p>
                    <p className="text-xs text-purple-400/60 mt-0.5">1 day ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">Profile Created</p>
                    <p className="text-xs text-gray-400">Welcome! Your business profile was created</p>
                    <p className="text-xs text-purple-400/60 mt-0.5">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
