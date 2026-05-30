'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useAuthStore, useNavigationStore } from '@/lib/store'

// Schemas
const loginSchema = z.object({
  email: z.email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
  phone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

const businessRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  businessName: z.string().min(2, 'Business name is required'),
  businessDescription: z.string().min(10, 'Please provide a description (at least 10 characters)'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'Province is required'),
  categorySlug: z.string().min(1, 'Category is required'),
})

type LoginForm = z.infer<typeof loginSchema>
type RegisterForm = z.infer<typeof registerSchema>
type BusinessRegisterForm = z.infer<typeof businessRegisterSchema>

const CITIES = [
  'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
]

const STATES = [
  'Punjab', 'Sindh', 'KPK', 'Balochistan', 'Islamabad Capital Territory',
]

const CATEGORIES = [
  { slug: 'plumbers', name: 'Plumbers' },
  { slug: 'electricians', name: 'Electricians' },
  { slug: 'restaurants', name: 'Restaurants' },
  { slug: 'healthcare', name: 'Healthcare' },
  { slug: 'education', name: 'Education' },
  { slug: 'automotive', name: 'Automotive' },
  { slug: 'beauty', name: 'Beauty & Salon' },
  { slug: 'home-services', name: 'Home Services' },
  { slug: 'it-services', name: 'IT Services' },
  { slug: 'construction', name: 'Construction' },
]

export function AuthForms() {
  const [activeTab, setActiveTab] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login, register: registerUser, registerBusiness, isLoading } = useAuthStore()
  const { navigate } = useNavigationStore()

  // Login form
  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  // Register form
  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '', email: '', password: '', confirmPassword: '',
      phone: '', city: '', state: '',
    },
  })

  // Business register form
  const businessForm = useForm<BusinessRegisterForm>({
    resolver: zodResolver(businessRegisterSchema),
    defaultValues: {
      name: '', email: '', password: '',
      businessName: '', businessDescription: '', phone: '',
      address: '', city: '', state: '', categorySlug: '',
    },
  })

  const handleLogin = async (data: LoginForm) => {
    setError(null)
    const result = await login(data.email, data.password)
    if (result.success) {
      navigate('dashboard')
    } else {
      setError(result.error || 'Invalid email or password')
    }
  }

  const handleRegister = async (data: RegisterForm) => {
    setError(null)
    const result = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      city: data.city,
      state: data.state,
    })
    if (result.success) {
      navigate('dashboard')
    } else {
      setError(result.error || 'Registration failed. Please try again.')
    }
  }

  const handleBusinessRegister = async (data: BusinessRegisterForm) => {
    setError(null)
    const result = await registerBusiness({
      name: data.name,
      email: data.email,
      password: data.password,
      businessName: data.businessName,
      businessDescription: data.businessDescription,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      categorySlug: data.categorySlug,
    })
    if (result.success) {
      navigate('business-dashboard')
    } else {
      setError(result.error || 'Business registration failed. Please try again.')
    }
  }

  return (
    <div className="max-w-md mx-auto w-full px-4 sm:px-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-strong rounded-2xl p-4 sm:p-8 border border-white/10 overflow-hidden"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/5 h-11 sm:h-auto">
            <TabsTrigger value="login" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">Login</TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">Register</TabsTrigger>
            <TabsTrigger value="business" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">Business</TabsTrigger>
          </TabsList>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Login Tab */}
            {activeTab === 'login' && (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onSubmit={loginForm.handleSubmit(handleLogin)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    className="min-h-[44px] bg-white/5 border-white/10 focus-visible:ring-purple-500/50 placeholder:text-gray-500"
                    {...loginForm.register('email')}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-xs text-red-400">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="min-h-[44px] bg-white/5 border-white/10 focus-visible:ring-purple-500/50 placeholder:text-gray-500"
                      {...loginForm.register('password')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-xs text-red-400">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white rounded-xl"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Sign In
                </Button>

                <p className="text-center text-sm text-gray-400">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    className="text-purple-400 hover:text-purple-300 hover:underline font-medium"
                    onClick={() => setActiveTab('register')}
                  >
                    Register
                  </button>
                </p>
              </motion.form>
            )}

            {/* Register Tab */}
            {activeTab === 'register' && (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onSubmit={registerForm.handleSubmit(handleRegister)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Full Name</Label>
                  <Input id="reg-name" placeholder="John Doe" className="min-h-[44px] bg-white/5 border-white/10 focus-visible:ring-purple-500/50 placeholder:text-gray-500" {...registerForm.register('name')} />
                  {registerForm.formState.errors.name && (
                    <p className="text-xs text-red-400">{registerForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input id="reg-email" type="email" placeholder="you@example.com" className="min-h-[44px] bg-white/5 border-white/10 focus-visible:ring-purple-500/50 placeholder:text-gray-500" {...registerForm.register('email')} />
                  {registerForm.formState.errors.email && (
                    <p className="text-xs text-red-400">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input id="reg-password" type="password" placeholder="••••••••" className="min-h-[44px] bg-white/5 border-white/10 focus-visible:ring-purple-500/50 placeholder:text-gray-500" {...registerForm.register('password')} />
                    {registerForm.formState.errors.password && (
                      <p className="text-xs text-red-400">{registerForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-confirm">Confirm</Label>
                    <Input id="reg-confirm" type="password" placeholder="••••••••" className="min-h-[44px] bg-white/5 border-white/10 focus-visible:ring-purple-500/50 placeholder:text-gray-500" {...registerForm.register('confirmPassword')} />
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-xs text-red-400">{registerForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-phone">Phone (optional)</Label>
                  <Input id="reg-phone" placeholder="+92 300 1234567" className="min-h-[44px] bg-white/5 border-white/10 focus-visible:ring-purple-500/50 placeholder:text-gray-500" {...registerForm.register('phone')} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="reg-city">City</Label>
                    <Select onValueChange={(v) => registerForm.setValue('city', v)}>
                      <SelectTrigger className="w-full min-h-[44px] bg-white/5 border-white/10">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent className="z-[100]">
                        {CITIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-state">Province</Label>
                    <Select onValueChange={(v) => registerForm.setValue('state', v)}>
                      <SelectTrigger className="w-full min-h-[44px] bg-white/5 border-white/10">
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent className="z-[100]">
                        {STATES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white rounded-xl"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Create Account
                </Button>

                <p className="text-center text-sm text-gray-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="text-purple-400 hover:text-purple-300 hover:underline font-medium"
                    onClick={() => setActiveTab('login')}
                  >
                    Sign In
                  </button>
                </p>
              </motion.form>
            )}

            {/* Business Register Tab */}
            {activeTab === 'business' && (
              <motion.form
                key="business"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onSubmit={businessForm.handleSubmit(handleBusinessRegister)}
                className="space-y-4"
              >
                <div className="p-3 bg-purple-500/10 rounded-lg mb-2 border border-purple-500/20">
                  <p className="text-sm text-purple-300">
                    Register your business to reach thousands of local customers in the Spectra community.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biz-owner">Owner Name</Label>
                  <Input id="biz-owner" placeholder="John Doe" className="min-h-[44px] bg-white/5 border-white/10 focus-visible:ring-purple-500/50 placeholder:text-gray-500" {...businessForm.register('name')} />
                  {businessForm.formState.errors.name && (
                    <p className="text-xs text-red-400">{businessForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biz-email">Email</Label>
                  <Input id="biz-email" type="email" placeholder="you@business.com" className="min-h-[44px] bg-white/5 border-white/10 focus-visible:ring-purple-500/50 placeholder:text-gray-500" {...businessForm.register('email')} />
                  {businessForm.formState.errors.email && (
                    <p className="text-xs text-red-400">{businessForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biz-password">Password</Label>
                  <Input id="biz-password" type="password" placeholder="••••••••" className="min-h-[44px] bg-white/5 border-white/10 focus-visible:ring-purple-500/50 placeholder:text-gray-500" {...businessForm.register('password')} />
                  {businessForm.formState.errors.password && (
                    <p className="text-xs text-red-400">{businessForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Separator className="my-2 bg-white/10" />

                <div className="space-y-2">
                  <Label htmlFor="biz-name">Business Name</Label>
                  <Input id="biz-name" placeholder="My Business" className="min-h-[44px] bg-white/5 border-white/10 focus-visible:ring-purple-500/50 placeholder:text-gray-500" {...businessForm.register('businessName')} />
                  {businessForm.formState.errors.businessName && (
                    <p className="text-xs text-red-400">{businessForm.formState.errors.businessName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biz-desc">Business Description</Label>
                  <textarea
                    id="biz-desc"
                    className="flex min-h-[80px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell us about your business..."
                    {...businessForm.register('businessDescription')}
                  />
                  {businessForm.formState.errors.businessDescription && (
                    <p className="text-xs text-red-400">{businessForm.formState.errors.businessDescription.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biz-phone">Phone</Label>
                  <Input id="biz-phone" placeholder="+92 300 1234567" className="min-h-[44px] bg-white/5 border-white/10 focus-visible:ring-purple-500/50 placeholder:text-gray-500" {...businessForm.register('phone')} />
                  {businessForm.formState.errors.phone && (
                    <p className="text-xs text-red-400">{businessForm.formState.errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biz-address">Address</Label>
                  <Input id="biz-address" placeholder="123 Main St" className="min-h-[44px] bg-white/5 border-white/10 focus-visible:ring-purple-500/50 placeholder:text-gray-500" {...businessForm.register('address')} />
                  {businessForm.formState.errors.address && (
                    <p className="text-xs text-red-400">{businessForm.formState.errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Select onValueChange={(v) => businessForm.setValue('city', v)}>
                      <SelectTrigger className="w-full min-h-[44px] bg-white/5 border-white/10">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent className="z-[100]">
                        {CITIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {businessForm.formState.errors.city && (
                      <p className="text-xs text-red-400">{businessForm.formState.errors.city.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Province</Label>
                    <Select onValueChange={(v) => businessForm.setValue('state', v)}>
                      <SelectTrigger className="w-full min-h-[44px] bg-white/5 border-white/10">
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent className="z-[100]">
                        {STATES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {businessForm.formState.errors.state && (
                      <p className="text-xs text-red-400">{businessForm.formState.errors.state.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select onValueChange={(v) => businessForm.setValue('categorySlug', v)}>
                    <SelectTrigger className="w-full min-h-[44px] bg-white/5 border-white/10">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="z-[100]">
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {businessForm.formState.errors.categorySlug && (
                    <p className="text-xs text-red-400">{businessForm.formState.errors.categorySlug.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white rounded-xl"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Register Business
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </div>
  )
}
