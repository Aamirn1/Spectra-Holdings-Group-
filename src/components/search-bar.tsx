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

const US_CITIES: Record<string, string[]> = {
  'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale', 'Tallahassee'],
  'Oklahoma': ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Edmond', 'Lawton'],
  'Louisiana': ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette', 'Lake Charles', 'Kenner'],
  'Texas': ['Houston', 'Dallas', 'San Antonio', 'Austin', 'Fort Worth', 'El Paso'],
  'Missouri': ['Kansas City', 'Springfield', 'Columbia', 'Independence', "Lee's Summit", 'St. Joseph'],
  'Kansas': ['Wichita', 'Overland Park', 'Kansas City', 'Olathe', 'Topeka', 'Lawrence'],
  'Mississippi': ['Jackson', 'Gulfport', 'Biloxi', 'Hattiesburg', 'Southaven', 'Meridian'],
}

const US_STATES = [
  'Florida', 'Oklahoma', 'Louisiana', 'Texas', 'Missouri', 'Kansas', 'Mississippi',
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

  const selectedStateCities = US_CITIES[state] || []
  const allCities = Object.values(US_CITIES).flat()

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      <motion.div
        className={`flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full shadow-lg border border-white/10 px-3 sm:px-4 ${sizeClasses[size]}`}
        whileFocus={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Search className="w-5 h-5 text-gray-500 shrink-0" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 placeholder:text-gray-500"
        />
        {!showFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFiltersVisible(!filtersVisible)}
            className="shrink-0 hover:bg-white/5 text-gray-400"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        )}
        <Button
          onClick={handleSearch}
          className="shrink-0 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white rounded-full px-4"
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
            <SelectTrigger className="w-full sm:w-[160px] bg-white/5 border-white/10 rounded-full">
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

          <Select value={state} onValueChange={(v) => { setState(v); setCity('all') }}>
            <SelectTrigger className="w-full sm:w-[160px] bg-white/5 border-white/10 rounded-full">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {US_STATES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={city} onValueChange={setCity} disabled={!state || state === 'all'}>
            <SelectTrigger className="w-full sm:w-[160px] bg-white/5 border-white/10 rounded-full">
              <SelectValue placeholder={state && state !== 'all' ? 'City' : 'State first'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {(state && state !== 'all' ? selectedStateCities : allCities).map((c) => (
                <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
      )}
    </div>
  )
}
