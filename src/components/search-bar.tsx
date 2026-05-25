'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowRight, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSearchStore } from '@/lib/store'

interface SearchBarProps {
  onSearch?: (query: string, category: string, city: string, state: string) => void
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  showFilters?: boolean
}

const PAKISTAN_CITIES = [
  'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
]

const PAKISTAN_STATES = [
  'Punjab', 'Sindh', 'KPK', 'Balochistan', 'Islamabad Capital Territory',
  'Gilgit-Baltistan', 'Azad Kashmir',
]

export function SearchBar({
  onSearch,
  placeholder = 'Search for businesses, services...',
  size = 'md',
  showFilters = false,
}: SearchBarProps) {
  const { query, category, city, state, setQuery, setCategory, setCity, setState } = useSearchStore()
  const [filtersVisible, setFiltersVisible] = useState(showFilters)

  const sizeClasses = {
    sm: 'h-10 text-sm',
    md: 'h-12 text-base',
    lg: 'h-14 text-lg',
  }

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query, category, city, state)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      <motion.div
        className={`flex items-center gap-2 bg-white rounded-full shadow-lg border border-gray-200 px-4 ${sizeClasses[size]}`}
        whileFocus={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Search className="w-5 h-5 text-gray-400 shrink-0" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
        />
        {!showFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFiltersVisible(!filtersVisible)}
            className="shrink-0 hover:bg-gray-100"
          >
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          </Button>
        )}
        <Button
          onClick={handleSearch}
          className="shrink-0 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-full px-4"
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>

      {(filtersVisible || showFilters) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-wrap gap-3 items-center justify-center"
        >
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[160px] bg-white rounded-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="plumbers">Plumbers</SelectItem>
              <SelectItem value="electricians">Electricians</SelectItem>
              <SelectItem value="restaurants">Restaurants</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="automotive">Automotive</SelectItem>
              <SelectItem value="beauty">Beauty & Salon</SelectItem>
              <SelectItem value="home-services">Home Services</SelectItem>
              <SelectItem value="it-services">IT Services</SelectItem>
            </SelectContent>
          </Select>

          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="w-[160px] bg-white rounded-full">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {PAKISTAN_CITIES.map((c) => (
                <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={state} onValueChange={setState}>
            <SelectTrigger className="w-[160px] bg-white rounded-full">
              <SelectValue placeholder="Province" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Provinces</SelectItem>
              {PAKISTAN_STATES.map((s) => (
                <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
      )}
    </div>
  )
}
