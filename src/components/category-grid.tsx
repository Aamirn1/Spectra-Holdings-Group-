'use client'

import { motion } from 'framer-motion'
import {
  Wrench,
  Utensils,
  Heart,
  Zap,
  GraduationCap,
  Car,
  Scissors,
  Home,
  Monitor,
  Building2,
  MoreHorizontal,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export interface CategoryData {
  id: string
  name: string
  slug: string
  icon?: string
  businessCount: number
}

interface CategoryGridProps {
  categories: CategoryData[]
  onSelect?: (category: CategoryData) => void
}

const iconMap: Record<string, React.ReactNode> = {
  wrench: <Wrench className="w-7 h-7" />,
  utensils: <Utensils className="w-7 h-7" />,
  heart: <Heart className="w-7 h-7" />,
  zap: <Zap className="w-7 h-7" />,
  graduation: <GraduationCap className="w-7 h-7" />,
  car: <Car className="w-7 h-7" />,
  scissors: <Scissors className="w-7 h-7" />,
  home: <Home className="w-7 h-7" />,
  monitor: <Monitor className="w-7 h-7" />,
  building: <Building2 className="w-7 h-7" />,
}

const gradients = [
  'from-purple-500 to-violet-600',
  'from-orange-500 to-amber-500',
  'from-rose-500 to-pink-500',
  'from-purple-400 to-indigo-500',
  'from-orange-400 to-red-500',
  'from-violet-500 to-purple-600',
  'from-amber-500 to-yellow-500',
  'from-pink-500 to-purple-500',
  'from-indigo-500 to-purple-500',
  'from-red-500 to-rose-600',
]

function getCategoryIcon(icon?: string) {
  if (!icon) return <MoreHorizontal className="w-7 h-7" />
  return iconMap[icon] || <MoreHorizontal className="w-7 h-7" />
}

export function CategoryGrid({ categories, onSelect }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <Card
            className="cursor-pointer border-0 shadow-md hover:shadow-xl transition-shadow rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm card-hover"
            onClick={() => onSelect?.(category)}
          >
            <CardContent className="p-0">
              <div
                className={`bg-gradient-to-br ${gradients[index % gradients.length]} p-6 text-white flex flex-col items-center gap-2`}
              >
                {getCategoryIcon(category.icon)}
                <h3 className="font-semibold text-sm text-center">{category.name}</h3>
              </div>
              <div className="px-3 py-2 text-center bg-white/5">
                <span className="text-xs text-gray-400">
                  {category.businessCount} {category.businessCount === 1 ? 'business' : 'businesses'}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
