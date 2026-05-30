'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigationStore, useAuthStore } from '@/lib/store'

// Layout components
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BackToTop } from '@/components/back-to-top'
import { ChatWidget } from '@/components/chat-widget'
import type { ChatWidgetHandle } from '@/components/chat-widget'
import { FloatingActions } from '@/components/floating-actions'

// Landing page components
import { HeroSection } from '@/components/hero-section'
import { AboutSection } from '@/components/landing/about-section'
import { MissionSection } from '@/components/landing/mission-section'
import { LeadershipSection } from '@/components/landing/leadership-section'
import { ProjectsSection } from '@/components/landing/projects-section'
import { CommunitiesSection } from '@/components/landing/communities-section'
import { EcosystemSection } from '@/components/landing/ecosystem-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { CTASection } from '@/components/landing/cta-section'

// View components
import { DirectoryView } from '@/components/directory-view'
import { BusinessDetail, type BusinessDetailData } from '@/components/business-detail'
import { EventCard, type EventCardData } from '@/components/event-card'
import { NewsCard, type NewsCardData } from '@/components/news-card'
import { AuthForms } from '@/components/auth-forms'
import { UserDashboard } from '@/components/user-dashboard'
import { BusinessDashboard } from '@/components/business-dashboard'
import { AdminDashboard } from '@/components/admin-dashboard'
import { AboutView } from '@/components/about-view'
import { ContactView } from '@/components/contact-view'
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader2, Building2, Newspaper, Calendar } from 'lucide-react'

// ==================== HOME VIEW ====================
function HomeView() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <MissionSection />
      <LeadershipSection />
      <ProjectsSection />
      <CommunitiesSection />
      <EcosystemSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}

// ==================== EVENTS VIEW ====================
function EventsView() {
  const { navigate } = useNavigationStore()
  const [events, setEvents] = useState<EventCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)
      try {
        const res = await fetch(`/api/events?limit=12&page=${page}`)
        const data = await res.json()
        if (data.events) {
          const mapped = data.events.map((e: any) => ({
            id: e.id,
            title: e.title,
            date: e.date,
            location: e.location,
            imageUrl: e.imageUrl,
            category: e.category,
          }))
          if (page === 1) {
            setEvents(mapped)
          } else {
            setEvents(prev => [...prev, ...mapped])
          }
          setHasMore(mapped.length >= 12)
        }
      } catch (error) {
        console.error('Failed to fetch events:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [page])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Calendar className="w-8 h-8 text-purple-400" />
          Community Events
        </h1>
        <p className="text-gray-400 mb-8">Discover upcoming events and activities in your community</p>
      </motion.div>

      {loading && page === 1 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white/5 rounded-xl h-72" />
          ))}
        </div>
      ) : events.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
          {hasMore && (
            <div className="mt-8 text-center">
              <Button variant="outline" onClick={() => setPage(p => p + 1)} className="rounded-xl px-8">
                Load More Events
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Events Found</h3>
          <p className="text-gray-500">Check back soon for upcoming community events!</p>
        </div>
      )}
    </div>
  )
}

// ==================== NEWS VIEW ====================
function NewsView() {
  const [news, setNews] = useState<NewsCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    async function fetchNews() {
      setLoading(true)
      try {
        const res = await fetch(`/api/news?limit=12&page=${page}`)
        const data = await res.json()
        if (data.news) {
          const mapped = data.news.map((n: any) => ({
            id: n.id,
            title: n.title,
            excerpt: n.excerpt,
            imageUrl: n.imageUrl,
            date: n.createdAt,
            category: n.category,
          }))
          if (page === 1) {
            setNews(mapped)
          } else {
            setNews(prev => [...prev, ...mapped])
          }
          setHasMore(mapped.length >= 12)
        }
      } catch (error) {
        console.error('Failed to fetch news:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [page])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Newspaper className="w-8 h-8 text-purple-400" />
          Community News
        </h1>
        <p className="text-gray-400 mb-8">Stay updated with the latest news and announcements</p>
      </motion.div>

      {loading && page === 1 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white/5 rounded-xl h-72" />
          ))}
        </div>
      ) : news.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <NewsCard key={item.id} news={item} index={index} />
            ))}
          </div>
          {hasMore && (
            <div className="mt-8 text-center">
              <Button variant="outline" onClick={() => setPage(p => p + 1)} className="rounded-xl px-8">
                Load More News
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <Newspaper className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No News Found</h3>
          <p className="text-gray-500">Stay tuned for the latest community updates!</p>
        </div>
      )}
    </div>
  )
}

// ==================== BUSINESS DETAIL VIEW ====================
function BusinessDetailView() {
  const { viewParams, goBack } = useNavigationStore()
  const [business, setBusiness] = useState<BusinessDetailData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBusiness() {
      if (!viewParams.id) return
      setLoading(true)
      try {
        const res = await fetch(`/api/businesses/${viewParams.id}`)
        const data = await res.json()
        if (data.business) {
          const b = data.business
          setBusiness({
            id: b.id,
            name: b.name,
            slug: b.slug,
            description: b.description,
            address: b.address,
            city: b.city,
            state: b.state,
            phone: b.phone,
            whatsapp: b.whatsapp,
            website: b.website,
            email: b.email,
            logoUrl: b.logoUrl,
            coverUrl: b.coverUrl,
            hours: b.hours,
            services: b.services,
            category: b.category?.name || 'General',
            isFeatured: b.isFeatured,
            viewCount: b.viewCount,
            isApproved: b.status === 'approved',
          })
        }
      } catch (error) {
        console.error('Failed to fetch business:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBusiness()
  }, [viewParams.id])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="bg-white/5 rounded-xl h-64" />
          <div className="bg-white/5 rounded-xl h-32" />
          <div className="bg-white/5 rounded-xl h-48" />
        </div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">Business Not Found</h3>
        <Button onClick={goBack} variant="outline" className="rounded-xl mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BusinessDetail business={business} />
    </div>
  )
}

// ==================== DASHBOARD VIEW ====================
function DashboardView() {
  const { user } = useAuthStore()
  const { navigate } = useNavigationStore()

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <AuthForms />
      </div>
    )
  }

  if (user.role === 'ADMIN') {
    return <AdminDashboardView />
  }
  if (user.role === 'BUSINESS') {
    return <BusinessDashboardView />
  }

  // RESIDENT
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <UserDashboard />
    </div>
  )
}

// ==================== BUSINESS DASHBOARD VIEW ====================
function BusinessDashboardView() {
  const { user } = useAuthStore()
  const [business, setBusiness] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBusiness() {
      if (!user) return
      try {
        const res = await fetch(`/api/businesses?limit=100`)
        const data = await res.json()
        if (data.businesses) {
          const userBusiness = data.businesses.find((b: any) => b.userId === user.id)
          if (userBusiness) {
            setBusiness({
              id: userBusiness.id,
              name: userBusiness.name,
              description: userBusiness.description,
              category: userBusiness.category?.name || 'General',
              city: userBusiness.city,
              state: userBusiness.state,
              status: userBusiness.status || 'pending',
              isFeatured: userBusiness.isFeatured,
              viewCount: userBusiness.viewCount,
              logoUrl: userBusiness.logoUrl,
            })
          }
        }
      } catch (error) {
        console.error('Failed to fetch business:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBusiness()
  }, [user])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BusinessDashboard business={business} />
    </div>
  )
}

// ==================== ADMIN DASHBOARD VIEW ====================
function AdminDashboardView() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBusinesses: 0,
    pendingApprovals: 0,
    totalEvents: 0,
    totalNews: 0,
  })
  const [pendingBusinesses, setPendingBusinesses] = useState<any[]>([])
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuthStore()

  const fetchAdminData = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch('/api/admin', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.stats) {
        setStats(data.stats)
      }
      if (data.pendingBusinesses) {
        setPendingBusinesses(data.pendingBusinesses)
      }
      if (data.recentUsers) {
        setRecentUsers(data.recentUsers)
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchAdminData()
  }, [fetchAdminData])

  const handleApprove = async (id: string) => {
    if (!token) return
    try {
      await fetch(`/api/businesses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'approved' }),
      })
      setPendingBusinesses(prev => prev.filter(b => b.id !== id))
      setStats(prev => ({
        ...prev,
        pendingApprovals: prev.pendingApprovals - 1,
        totalBusinesses: prev.totalBusinesses + 1,
      }))
    } catch (error) {
      console.error('Failed to approve business:', error)
    }
  }

  const handleReject = async (id: string) => {
    if (!token) return
    try {
      await fetch(`/api/businesses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setPendingBusinesses(prev => prev.filter(b => b.id !== id))
      setStats(prev => ({
        ...prev,
        pendingApprovals: prev.pendingApprovals - 1,
      }))
    } catch (error) {
      console.error('Failed to reject business:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AdminDashboard
        stats={stats}
        pendingBusinesses={pendingBusinesses}
        recentUsers={recentUsers}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  )
}

// ==================== MAIN APP ====================
export default function Home() {
  const { currentView, navigate } = useNavigationStore()
  const { user, checkAuth } = useAuthStore()
  const [initializing, setInitializing] = useState(true)
  const chatWidgetRef = useRef<ChatWidgetHandle>(null)

  // Check auth on mount
  useEffect(() => {
    checkAuth().finally(() => setInitializing(false))
  }, [checkAuth])

  // Seed the database on first visit
  useEffect(() => {
    async function seedDB() {
      try {
        await fetch('/api/seed', { method: 'POST' })
      } catch (error) {
        // Silently fail - might already be seeded
      }
    }
    seedDB()
  }, [])

  // Render the current view
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />
      case 'directory':
        return (
          <div className="pt-4">
            <DirectoryView />
          </div>
        )
      case 'business-detail':
        return <BusinessDetailView />
      case 'events':
        return <EventsView />
      case 'news':
        return <NewsView />
      case 'login':
      case 'register':
      case 'register-business':
        return (
          <div className="max-w-md mx-auto px-4 py-12">
            <AuthForms />
          </div>
        )
      case 'dashboard':
      case 'resident-portal':
        return <DashboardView />
      case 'business-dashboard':
        return <BusinessDashboardView />
      case 'admin':
        return <AdminDashboardView />
      case 'about':
        return <AboutView />
      case 'contact':
        return <ContactView />
      default:
        return <HomeView />
    }
  }

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading Spectra...</p>
        </div>
      </div>
    )
  }

  const isHome = currentView === 'home'

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      
      <main className={`flex-1 ${isHome ? '' : 'pt-16'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <SiteFooter />
      <BackToTop />
      <ChatWidget ref={chatWidgetRef} />
      <FloatingActions onChatOpen={() => chatWidgetRef.current?.open()} />
    </div>
  )
}
