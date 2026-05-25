'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, Loader2 } from 'lucide-react'
import { SearchBar } from '@/components/search-bar'
import { BusinessCard, type BusinessCardData } from '@/components/business-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useSearchStore } from '@/lib/store'

interface DirectoryViewProps {
  initialCategory?: string
}

export function DirectoryView({ initialCategory }: DirectoryViewProps) {
  const { query, category, city, state, setCategory, results, isSearching, search } = useSearchStore()
  const [businesses, setBusinesses] = useState<BusinessCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory)
    }
  }, [initialCategory, setCategory])

  const fetchBusinesses = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      if (category && category !== 'all') params.set('category', category)
      if (city && city !== 'all') params.set('city', city)
      if (state && state !== 'all') params.set('state', state)
      params.set('page', page.toString())
      params.set('limit', '12')

      const res = await fetch(`/api/businesses?${params.toString()}`)
      const data = await res.json()

      if (data.businesses) {
        const newBusinesses = data.businesses.map((b: any) => ({
          id: b.id,
          name: b.name,
          slug: b.slug,
          description: b.description,
          city: b.city,
          state: b.state,
          category: b.category?.name || b.categorySlug || 'General',
          phone: b.phone,
          logoUrl: b.logoUrl,
          isFeatured: b.isFeatured,
          viewCount: b.viewCount,
        }))

        if (page === 1) {
          setBusinesses(newBusinesses)
        } else {
          setBusinesses((prev) => [...prev, ...newBusinesses])
        }
        setHasMore(newBusinesses.length >= 12)
      } else {
        if (page === 1) setBusinesses([])
        setHasMore(false)
      }
    } catch {
      if (page === 1) setBusinesses([])
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [query, category, city, state, page])

  useEffect(() => {
    setPage(1)
  }, [query, category, city, state])

  useEffect(() => {
    fetchBusinesses()
  }, [fetchBusinesses])

  const handleSearch = () => {
    setPage(1)
    search()
    fetchBusinesses()
  }

  const handleLoadMore = () => {
    setPage((prev) => prev + 1)
  }

  // Merge with search store results if available
  const displayBusinesses = results.length > 0 && isSearching === false
    ? results.map((b: any) => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        description: b.description,
        city: b.city,
        state: b.state,
        category: b.category?.name || b.categorySlug || 'General',
        phone: b.phone,
        logoUrl: b.logoUrl,
        isFeatured: b.isFeatured,
        viewCount: b.viewCount,
      }))
    : businesses

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Business Directory</h1>
        <p className="text-gray-400">Find trusted local businesses and services in your community</p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-8"
      >
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search businesses..."
          size="md"
          showFilters={true}
        />
      </motion.div>

      {/* Loading State */}
      {loading && page === 1 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
              <div className="flex items-start gap-4">
                <Skeleton className="w-14 h-14 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : displayBusinesses.length > 0 ? (
        <>
          {/* Results count */}
          <p className="text-sm text-gray-400 mb-4">
            Showing {displayBusinesses.length} businesses
            {category && category !== 'all' && (
              <span> in <span className="font-medium text-purple-400">{category}</span></span>
            )}
            {city && city !== 'all' && (
              <span> near <span className="font-medium text-purple-400">{city}</span></span>
            )}
          </p>

          {/* Business Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayBusinesses.map((business, index) => (
              <BusinessCard key={business.id} business={business} index={index} />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={loading}
                className="rounded-xl px-8 border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Load More
              </Button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Businesses Found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Try adjusting your search filters or browse all businesses by clearing the filters.
          </p>
        </motion.div>
      )}
    </div>
  )
}
