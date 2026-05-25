'use client'

import { motion } from 'framer-motion'
import { Newspaper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NewsCard, type NewsCardData } from '@/components/news-card'
import { useNavigationStore } from '@/lib/store'

interface NewsSectionProps {
  news: NewsCardData[]
  title?: string
  showViewAll?: boolean
}

export function NewsSection({
  news,
  title = 'Latest News',
  showViewAll = true,
}: NewsSectionProps) {
  const { navigate } = useNavigationStore()

  return (
    <section className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <Newspaper className="w-7 h-7 text-purple-400" />
            {title}
          </h2>
          {showViewAll && news.length > 0 && (
            <Button
              variant="ghost"
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
              onClick={() => navigate('news')}
            >
              View All News →
            </Button>
          )}
        </div>

        {news.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <NewsCard key={item.id} news={item} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
            <Newspaper className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-400">No News Yet</h3>
            <p className="text-sm text-gray-500 mt-1">Stay tuned for the latest community updates!</p>
          </div>
        )}
      </motion.div>
    </section>
  )
}
