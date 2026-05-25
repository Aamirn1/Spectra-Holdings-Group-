'use client'

import { motion } from 'framer-motion'
import { Eye, Edit, ExternalLink, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useAuthStore, useNavigationStore } from '@/lib/store'

interface BusinessInfo {
  id: string
  name: string
  description: string
  category: string
  city: string
  state: string
  isApproved: boolean
  isFeatured: boolean
  viewCount: number
  logoUrl?: string
}

interface BusinessDashboardProps {
  business?: BusinessInfo
}

export function BusinessDashboard({ business }: BusinessDashboardProps) {
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
        <Card className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0">
          <CardContent className="p-6 flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-white/30">
              <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                {business?.name?.charAt(0) || user?.name?.charAt(0) || 'B'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{business?.name || 'Business Dashboard'}</h1>
              <p className="text-white/80">Manage your business listing and track performance</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {business ? (
        <>
          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Listing Status</h2>
                  {business.isApproved ? (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Approved
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Pending Approval
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Eye className="w-6 h-6 text-teal-500 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-gray-900">{business.viewCount}</p>
                    <p className="text-xs text-gray-500">Total Views</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                    <p className="text-sm font-medium text-gray-900">{business.isFeatured ? 'Featured' : 'Standard'}</p>
                    <p className="text-xs text-gray-500">Listing Type</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg col-span-2 sm:col-span-1">
                    <Clock className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                    <p className="text-sm font-medium text-gray-900">Active</p>
                    <p className="text-xs text-gray-500">Status</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Business Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Business Profile</span>
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Business Name</p>
                    <p className="font-medium text-gray-900">{business.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Category</p>
                    <Badge variant="secondary">{business.category}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">City</p>
                    <p className="font-medium text-gray-900">{business.city}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Province</p>
                    <p className="font-medium text-gray-900">{business.state}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Description</p>
                    <p className="text-sm text-gray-600">{business.description}</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex gap-3">
                  <Button
                    className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl"
                    onClick={() => navigate('business-detail', { slug: business.name.toLowerCase().replace(/\s+/g, '-'), id: business.id })}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Listing
                  </Button>
                  <Button variant="outline" className="rounded-xl">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
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
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Clock className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No recent activity</p>
                  <p className="text-xs text-gray-400 mt-1">Activity will appear here when customers interact with your listing</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="rounded-xl">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Business Listed</h3>
              <p className="text-gray-400 mb-4">You haven&apos;t registered a business yet. List your business to reach local customers.</p>
              <Button
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl"
                onClick={() => navigate('register-business')}
              >
                Register Your Business
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
