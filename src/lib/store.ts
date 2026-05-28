import { create } from 'zustand'

export type ViewName = 
  | 'home' 
  | 'directory' 
  | 'business-detail' 
  | 'events' 
  | 'news' 
  | 'news-detail'
  | 'event-detail'
  | 'login' 
  | 'register' 
  | 'register-business' 
  | 'dashboard' 
  | 'business-dashboard' 
  | 'admin' 
  | 'about' 
  | 'contact'
  | 'resident-portal'

interface NavigationState {
  currentView: ViewName
  viewParams: Record<string, string>
  previousView: ViewName | null
  navigate: (view: ViewName, params?: Record<string, string>) => void
  goBack: () => void
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  currentView: 'home',
  viewParams: {},
  previousView: null,
  navigate: (view, params = {}) => {
    const { currentView } = get()
    set({ previousView: currentView, currentView: view, viewParams: params })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },
  goBack: () => {
    const { previousView } = get()
    if (previousView) {
      set({ currentView: previousView, viewParams: {}, previousView: null })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  },
}))

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'RESIDENT' | 'BUSINESS'
  phone?: string
  city?: string
  state?: string
  avatarUrl?: string
}

interface AuthResult {
  success: boolean
  error?: string
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<AuthResult>
  register: (data: RegisterData) => Promise<AuthResult>
  registerBusiness: (data: BusinessRegisterData) => Promise<AuthResult>
  logout: () => void
  checkAuth: () => Promise<void>
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
  city?: string
  state?: string
}

export interface BusinessRegisterData {
  name: string
  email: string
  password: string
  businessName: string
  businessDescription: string
  phone: string
  address: string
  city: string
  state: string
  categorySlug: string
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.success && data.user && data.token) {
        localStorage.setItem('spectra_token', data.token)
        set({ user: data.user, token: data.token, isLoading: false })
        return { success: true }
      }
      set({ isLoading: false })
      return { success: false, error: data.error || 'Login failed' }
    } catch {
      set({ isLoading: false })
      return { success: false, error: 'Network error. Please try again.' }
    }
  },
  register: async (registerData: RegisterData) => {
    set({ isLoading: true })
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...registerData, role: 'RESIDENT' }),
      })
      const data = await res.json()
      if (data.success && data.user && data.token) {
        localStorage.setItem('spectra_token', data.token)
        set({ user: data.user, token: data.token, isLoading: false })
        return { success: true }
      }
      set({ isLoading: false })
      return { success: false, error: data.error || 'Registration failed' }
    } catch {
      set({ isLoading: false })
      return { success: false, error: 'Network error. Please try again.' }
    }
  },
  registerBusiness: async (businessData: BusinessRegisterData) => {
    set({ isLoading: true })
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...businessData, role: 'BUSINESS' }),
      })
      const data = await res.json()
      if (data.success && data.user && data.token) {
        localStorage.setItem('spectra_token', data.token)
        set({ user: data.user, token: data.token, isLoading: false })
        return { success: true }
      }
      set({ isLoading: false })
      return { success: false, error: data.error || 'Registration failed' }
    } catch {
      set({ isLoading: false })
      return { success: false, error: 'Network error. Please try again.' }
    }
  },
  logout: () => {
    localStorage.removeItem('spectra_token')
    set({ user: null, token: null })
  },
  checkAuth: async () => {
    const token = localStorage.getItem('spectra_token')
    if (!token) return
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success && data.user) {
        set({ user: data.user, token })
      } else {
        localStorage.removeItem('spectra_token')
        set({ user: null, token: null })
      }
    } catch {
      localStorage.removeItem('spectra_token')
      set({ user: null, token: null })
    }
  },
}))

interface SearchState {
  query: string
  category: string
  city: string
  state: string
  results: any[]
  isSearching: boolean
  setQuery: (query: string) => void
  setCategory: (category: string) => void
  setCity: (city: string) => void
  setState: (state: string) => void
  search: () => Promise<void>
  clearResults: () => void
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  category: '',
  city: '',
  state: '',
  results: [],
  isSearching: false,
  setQuery: (query) => set({ query }),
  setCategory: (category) => set({ category }),
  setCity: (city) => set({ city }),
  setState: (state) => set({ state }),
  search: async () => {
    const { query, category, city, state } = get()
    set({ isSearching: true })
    try {
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      if (category) params.set('category', category)
      if (city) params.set('city', city)
      if (state) params.set('state', state)
      const res = await fetch(`/api/search?${params.toString()}`)
      const data = await res.json()
      set({ results: data.businesses || [], isSearching: false })
    } catch {
      set({ isSearching: false })
    }
  },
  clearResults: () => set({ results: [], query: '', category: '', city: '', state: '' }),
}))
