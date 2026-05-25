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
    const success = await login(data.email, data.password)
    if (success) {
      navigate('dashboard')
    } else {
      setError('Invalid email or password')
    }
  }

  const handleRegister = async (data: RegisterForm) => {
    setError(null)
    const success = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      city: data.city,
      state: data.state,
    })
    if (success) {
      navigate('dashboard')
    } else {
      setError('Registration failed. Please try again.')
    }
  }

  const handleBusinessRegister = async (data: BusinessRegisterForm) => {
    setError(null)
    const success = await registerBusiness({
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
    if (success) {
      navigate('business-dashboard')
    } else {
      setError('Business registration failed. Please try again.')
    }
  }

  return (
    <div className="max-w-md mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
          </TabsList>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
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
                    {...loginForm.register('email')}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-xs text-red-500">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...loginForm.register('password')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-xs text-red-500">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Sign In
                </Button>

                <p className="text-center text-sm text-gray-500">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    className="text-teal-600 hover:underline font-medium"
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
                  <Input id="reg-name" placeholder="John Doe" {...registerForm.register('name')} />
                  {registerForm.formState.errors.name && (
                    <p className="text-xs text-red-500">{registerForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input id="reg-email" type="email" placeholder="you@example.com" {...registerForm.register('email')} />
                  {registerForm.formState.errors.email && (
                    <p className="text-xs text-red-500">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input id="reg-password" type="password" placeholder="••••••••" {...registerForm.register('password')} />
                    {registerForm.formState.errors.password && (
                      <p className="text-xs text-red-500">{registerForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-confirm">Confirm</Label>
                    <Input id="reg-confirm" type="password" placeholder="••••••••" {...registerForm.register('confirmPassword')} />
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-xs text-red-500">{registerForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-phone">Phone (optional)</Label>
                  <Input id="reg-phone" placeholder="+92 300 1234567" {...registerForm.register('phone')} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="reg-city">City</Label>
                    <Select onValueChange={(v) => registerForm.setValue('city', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {CITIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-state">Province</Label>
                    <Select onValueChange={(v) => registerForm.setValue('state', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Create Account
                </Button>

                <p className="text-center text-sm text-gray-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="text-teal-600 hover:underline font-medium"
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
                <div className="p-3 bg-orange-50 rounded-lg mb-2">
                  <p className="text-sm text-orange-700">
                    Register your business to reach thousands of local customers in the Spectra community.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biz-owner">Owner Name</Label>
                  <Input id="biz-owner" placeholder="John Doe" {...businessForm.register('name')} />
                  {businessForm.formState.errors.name && (
                    <p className="text-xs text-red-500">{businessForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biz-email">Email</Label>
                  <Input id="biz-email" type="email" placeholder="you@business.com" {...businessForm.register('email')} />
                  {businessForm.formState.errors.email && (
                    <p className="text-xs text-red-500">{businessForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biz-password">Password</Label>
                  <Input id="biz-password" type="password" placeholder="••••••••" {...businessForm.register('password')} />
                  {businessForm.formState.errors.password && (
                    <p className="text-xs text-red-500">{businessForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Separator className="my-2" />

                <div className="space-y-2">
                  <Label htmlFor="biz-name">Business Name</Label>
                  <Input id="biz-name" placeholder="My Business" {...businessForm.register('businessName')} />
                  {businessForm.formState.errors.businessName && (
                    <p className="text-xs text-red-500">{businessForm.formState.errors.businessName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biz-desc">Business Description</Label>
                  <textarea
                    id="biz-desc"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell us about your business..."
                    {...businessForm.register('businessDescription')}
                  />
                  {businessForm.formState.errors.businessDescription && (
                    <p className="text-xs text-red-500">{businessForm.formState.errors.businessDescription.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biz-phone">Phone</Label>
                  <Input id="biz-phone" placeholder="+92 300 1234567" {...businessForm.register('phone')} />
                  {businessForm.formState.errors.phone && (
                    <p className="text-xs text-red-500">{businessForm.formState.errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biz-address">Address</Label>
                  <Input id="biz-address" placeholder="123 Main St" {...businessForm.register('address')} />
                  {businessForm.formState.errors.address && (
                    <p className="text-xs text-red-500">{businessForm.formState.errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Select onValueChange={(v) => businessForm.setValue('city', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {CITIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {businessForm.formState.errors.city && (
                      <p className="text-xs text-red-500">{businessForm.formState.errors.city.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Province</Label>
                    <Select onValueChange={(v) => businessForm.setValue('state', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {businessForm.formState.errors.state && (
                      <p className="text-xs text-red-500">{businessForm.formState.errors.state.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select onValueChange={(v) => businessForm.setValue('categorySlug', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {businessForm.formState.errors.categorySlug && (
                    <p className="text-xs text-red-500">{businessForm.formState.errors.categorySlug.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl"
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
