'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Building2,
  Clock,
  Calendar,
  Newspaper,
  CheckCircle2,
  XCircle,
  Plus,
  Eye,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

interface PendingBusiness {
  id: string
  name: string
  ownerName: string
  category: string
  city: string
  createdAt: string
}

interface RecentUser {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

interface AdminDashboardProps {
  stats?: {
    totalUsers: number
    totalBusinesses: number
    pendingApprovals: number
    totalEvents: number
    totalNews: number
  }
  pendingBusinesses?: PendingBusiness[]
  recentUsers?: RecentUser[]
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

export function AdminDashboard({
  stats = { totalUsers: 0, totalBusinesses: 0, pendingApprovals: 0, totalEvents: 0, totalNews: 0 },
  pendingBusinesses = [],
  recentUsers = [],
  onApprove,
  onReject,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Manage the Spectra community platform</p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        <Card className="rounded-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-xs text-gray-500">Users</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBusinesses}</p>
              <p className="text-xs text-gray-500">Businesses</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
              <p className="text-xs text-gray-500">Events</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl col-span-2 sm:col-span-1">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalNews}</p>
              <p className="text-xs text-gray-500">News</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="businesses">
              Businesses
              {stats.pendingApprovals > 0 && (
                <Badge className="ml-1.5 bg-amber-100 text-amber-700 text-[10px] px-1.5">
                  {stats.pendingApprovals}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Pending Approvals Quick View */}
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  Pending Approvals
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingBusinesses.length > 0 ? (
                  <div className="space-y-3">
                    {pendingBusinesses.slice(0, 5).map((biz) => (
                      <div key={biz.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{biz.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">{biz.category}</Badge>
                            <span className="text-xs text-gray-400">{biz.city} • {biz.ownerName}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-xs"
                            onClick={() => onApprove?.(biz.id)}
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full text-xs text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => onReject?.(biz.id)}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">All caught up! No pending approvals.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Button variant="outline" className="rounded-xl h-auto py-4 flex-col gap-2">
                    <Plus className="w-5 h-5 text-teal-600" />
                    <span className="text-xs">Add Category</span>
                  </Button>
                  <Button variant="outline" className="rounded-xl h-auto py-4 flex-col gap-2">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <span className="text-xs">Add Event</span>
                  </Button>
                  <Button variant="outline" className="rounded-xl h-auto py-4 flex-col gap-2">
                    <Newspaper className="w-5 h-5 text-rose-600" />
                    <span className="text-xs">Add News</span>
                  </Button>
                  <Button variant="outline" className="rounded-xl h-auto py-4 flex-col gap-2">
                    <Eye className="w-5 h-5 text-purple-600" />
                    <span className="text-xs">View Site</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Businesses Tab */}
          <TabsContent value="businesses">
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle>Pending Business Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingBusinesses.length > 0 ? (
                  <div className="space-y-3">
                    {pendingBusinesses.map((biz) => (
                      <div key={biz.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{biz.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">{biz.category}</Badge>
                            <span className="text-sm text-gray-500">{biz.city}</span>
                            <Separator orientation="vertical" className="h-4" />
                            <span className="text-sm text-gray-500">Owner: {biz.ownerName}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            Submitted {new Date(biz.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full"
                            onClick={() => onApprove?.(biz.id)}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="rounded-full"
                            onClick={() => onReject?.(biz.id)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
                    <p className="text-gray-400">No pending business approvals</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card className="rounded-xl border-dashed">
                    <CardContent className="p-6 text-center">
                      <Calendar className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-900">Events</h3>
                      <p className="text-sm text-gray-400">{stats.totalEvents} published</p>
                      <Button variant="outline" size="sm" className="mt-3 rounded-xl">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Event
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="rounded-xl border-dashed">
                    <CardContent className="p-6 text-center">
                      <Newspaper className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-900">News</h3>
                      <p className="text-sm text-gray-400">{stats.totalNews} published</p>
                      <Button variant="outline" size="sm" className="mt-3 rounded-xl">
                        <Plus className="w-4 h-4 mr-1" />
                        Add News
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
              </CardHeader>
              <CardContent>
                {recentUsers.length > 0 ? (
                  <div className="space-y-3">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              user.role === 'admin'
                                ? 'bg-purple-50 text-purple-700'
                                : user.role === 'business'
                                ? 'bg-orange-50 text-orange-700'
                                : 'bg-teal-50 text-teal-700'
                            }
                          >
                            {user.role}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400">No users yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
