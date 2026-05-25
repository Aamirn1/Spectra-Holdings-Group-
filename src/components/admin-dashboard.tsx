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
  Shield,
  Settings,
  BarChart3,
  UserCog,
  MapPin,
  Sparkles,
  Layers,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

interface PendingBusiness {
  id: string
  name: string
  ownerName: string
  category: string
  city: string
  state?: string
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
  stats: {
    totalUsers: number
    totalBusinesses: number
    pendingApprovals: number
    totalEvents: number
    totalNews: number
  }
  pendingBusinesses: PendingBusiness[]
  recentUsers: RecentUser[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

const roleConfig: Record<string, { label: string; color: string }> = {
  ADMIN: { label: 'ADMIN', color: 'bg-purple-500/15 text-purple-400 border-purple-500/20' },
  BUSINESS: { label: 'BUSINESS', color: 'bg-violet-500/15 text-violet-400 border-violet-500/20' },
  RESIDENT: { label: 'RESIDENT', color: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
}

export function AdminDashboard({
  stats,
  pendingBusinesses,
  recentUsers,
  onApprove,
  onReject,
}: AdminDashboardProps) {
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

  const handleApprove = async (id: string) => {
    setProcessingIds(prev => new Set(prev).add(id))
    try {
      await onApprove(id)
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const handleReject = async (id: string) => {
    setProcessingIds(prev => new Set(prev).add(id))
    try {
      await onReject(id)
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'purple' },
    { label: 'Total Businesses', value: stats.totalBusinesses, icon: Building2, color: 'violet' },
    { label: 'Pending Approvals', value: stats.pendingApprovals, icon: AlertTriangle, color: 'amber' },
    { label: 'Total Events', value: stats.totalEvents, icon: Calendar, color: 'purple' },
    { label: 'Total News', value: stats.totalNews, icon: Newspaper, color: 'violet' },
    { label: 'Total Communities', value: 19, icon: Layers, color: 'purple' },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Admin Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="glass-strong rounded-2xl border-0 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-violet-900 to-purple-800" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl" />
          </div>
          <CardContent className="relative p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Spectra Holdings Admin Panel</h1>
                <p className="text-purple-200/70 mt-0.5">Manage the community platform and oversee operations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {statCards.map((stat, index) => (
          <Card key={stat.label} className="glass-strong rounded-2xl border-0 card-hover">
            <CardContent className="p-4 sm:p-5 flex flex-col items-center text-center">
              <div className={`w-11 h-11 rounded-xl ${stat.color === 'amber' ? 'bg-amber-500/15' : stat.color === 'violet' ? 'bg-violet-500/15' : 'bg-purple-500/15'} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color === 'amber' ? 'text-amber-400' : stat.color === 'violet' ? 'text-violet-400' : 'text-purple-400'}`} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button className="h-auto py-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 shadow-lg shadow-purple-500/20">
            <div className="flex flex-col items-center gap-1.5">
              <UserCog className="w-5 h-5" />
              <span className="text-xs font-medium">Manage Users</span>
            </div>
          </Button>
          <Button className="h-auto py-4 rounded-xl glass-strong text-purple-300 hover:text-white hover:bg-white/10 border-0">
            <div className="flex flex-col items-center gap-1.5">
              <Building2 className="w-5 h-5" />
              <span className="text-xs font-medium">Manage Businesses</span>
            </div>
          </Button>
          <Button className="h-auto py-4 rounded-xl glass-strong text-purple-300 hover:text-white hover:bg-white/10 border-0">
            <div className="flex flex-col items-center gap-1.5">
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs font-medium">View Reports</span>
            </div>
          </Button>
          <Button className="h-auto py-4 rounded-xl glass-strong text-purple-300 hover:text-white hover:bg-white/10 border-0">
            <div className="flex flex-col items-center gap-1.5">
              <Settings className="w-5 h-5" />
              <span className="text-xs font-medium">Settings</span>
            </div>
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Business Approvals - 2 cols */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="glass-strong rounded-2xl border-0 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-white text-lg">
                  <Clock className="w-5 h-5 text-amber-400" />
                  Pending Business Approvals
                  {stats.pendingApprovals > 0 && (
                    <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/20 text-xs ml-1">
                      {stats.pendingApprovals}
                    </Badge>
                  )}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingBusinesses.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {pendingBusinesses.map((biz) => (
                    <div
                      key={biz.id}
                      className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/20 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                              {biz.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-semibold text-white truncate">{biz.name}</h4>
                              <p className="text-xs text-gray-400">by {biz.ownerName}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs bg-purple-500/10 text-purple-300 border-0">
                              {biz.category}
                            </Badge>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {biz.city}{biz.state ? `, ${biz.state}` : ''}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(biz.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-lg text-xs h-8 px-3 shadow-lg shadow-green-500/20"
                            onClick={() => handleApprove(biz.id)}
                            disabled={processingIds.has(biz.id)}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-lg text-xs h-8 px-3 shadow-lg shadow-red-500/20"
                            onClick={() => handleReject(biz.id)}
                            disabled={processingIds.has(biz.id)}
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <CheckCircle2 className="w-12 h-12 text-purple-500/40 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-300 mb-1">All Caught Up!</h3>
                  <p className="text-sm text-gray-400">No pending business approvals at this time.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Right sidebar - Recent Users + Content Management */}
        <div className="space-y-6">
          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <Card className="glass-strong rounded-2xl border-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-white text-lg">
                  <Users className="w-5 h-5 text-purple-400" />
                  Recent Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentUsers.length > 0 ? (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {recentUsers.map((user) => {
                      const role = roleConfig[user.role] || roleConfig.RESIDENT
                      return (
                        <div
                          key={user.id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5"
                        >
                          <Avatar className="w-9 h-9 border border-purple-500/20">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-white text-xs font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <Badge className={`${role.color} border text-[10px] font-semibold`}>
                              {role.label}
                            </Badge>
                            <span className="text-[10px] text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No users yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Content Management Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="glass-strong rounded-2xl border-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-white text-lg">
                  <Layers className="w-5 h-5 text-purple-400" />
                  Content Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-purple-500/20 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-purple-500/15 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Events</p>
                        <p className="text-xs text-gray-400">{stats.totalEvents} published</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-purple-500/20 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center">
                        <Newspaper className="w-4 h-4 text-violet-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">News</p>
                        <p className="text-xs text-gray-400">{stats.totalNews} published</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-purple-500/20 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-purple-500/15 flex items-center justify-center">
                        <Layers className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Categories</p>
                        <p className="text-xs text-gray-400">Manage listings</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
