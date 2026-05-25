'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, LogOut, LayoutDashboard, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from '@/components/ui/sheet'
import { useNavigationStore, useAuthStore, type ViewName } from '@/lib/store'

const NAV_LINKS: { label: string; view: ViewName }[] = [
  { label: 'Home', view: 'home' },
  { label: 'Directory', view: 'directory' },
  { label: 'Events', view: 'events' },
  { label: 'News', view: 'news' },
  { label: 'About', view: 'about' },
  { label: 'Contact', view: 'contact' },
]

export function SiteHeader() {
  const { currentView, navigate } = useNavigationStore()
  const { user, logout } = useAuthStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHome = currentView === 'home'
  const headerBg = isHome && !isScrolled
    ? 'bg-transparent'
    : 'bg-white/80 backdrop-blur-lg border-b border-gray-200/50'

  const textColor = isHome && !isScrolled
    ? 'text-white'
    : 'text-gray-700'

  const handleNav = (view: ViewName) => {
    navigate(view)
    setMobileOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2"
          >
            <span className={`text-xl font-bold bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent`}>
              Spectra
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.view}
                onClick={() => handleNav(link.view)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === link.view
                    ? isHome && !isScrolled
                      ? 'text-white bg-white/20'
                      : 'text-teal-600 bg-teal-50'
                    : isHome && !isScrolled
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={() => handleNav(user.role === 'admin' ? 'admin' : user.role === 'business' ? 'business-dashboard' : 'dashboard')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isHome && !isScrolled
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className={`text-sm font-medium ${textColor}`}>{user.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className={isHome && !isScrolled ? 'text-white/80 hover:text-white hover:bg-white/10' : ''}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => handleNav('login')}
                  className={isHome && !isScrolled ? 'text-white hover:text-white hover:bg-white/10' : ''}
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => handleNav('register')}
                  className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-full"
                >
                  Register
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex items-center justify-between p-4 border-b">
                  <span className="text-lg font-bold bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">
                    Spectra
                  </span>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="w-5 h-5" />
                    </Button>
                  </SheetClose>
                </div>

                <div className="p-4 space-y-1">
                  {NAV_LINKS.map((link) => (
                    <button
                      key={link.view}
                      onClick={() => handleNav(link.view)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        currentView === link.view
                          ? 'text-teal-600 bg-teal-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>

                <div className="border-t p-4 space-y-2">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 mb-3 px-2">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full justify-start rounded-xl"
                        onClick={() => handleNav(user.role === 'admin' ? 'admin' : user.role === 'business' ? 'business-dashboard' : 'dashboard')}
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start rounded-xl text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => { logout(); setMobileOpen(false) }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="w-full rounded-xl"
                        onClick={() => handleNav('login')}
                      >
                        Sign In
                      </Button>
                      <Button
                        className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl"
                        onClick={() => handleNav('register')}
                      >
                        Register
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full rounded-xl border-orange-200 text-orange-600 hover:bg-orange-50"
                        onClick={() => handleNav('register-business')}
                      >
                        <Building2 className="w-4 h-4 mr-2" />
                        List Your Business
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
