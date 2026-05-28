'use client'

import { useState, useEffect } from 'react'
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
  { label: 'About', view: 'about' },
  { label: 'Directory', view: 'directory' },
  { label: 'Events', view: 'events' },
  { label: 'News', view: 'news' },
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
    : 'bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-purple-500/10'

  const handleNav = (view: ViewName) => {
    navigate(view)
    setMobileOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 overflow-hidden ${headerBg}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2"
          >
            <span className={`text-2xl font-bold tracking-wide bg-gradient-to-r from-purple-400 via-violet-400 to-purple-300 bg-clip-text text-transparent`}>
              Spectra
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.view}
                onClick={() => handleNav(link.view)}
                className={`text-xs font-medium tracking-widest uppercase transition-colors ${
                  currentView === link.view
                    ? 'text-purple-400'
                    : isHome && !isScrolled
                      ? 'text-white/70 hover:text-white'
                      : 'text-white/70 hover:text-white'
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
                  onClick={() => handleNav(user.role === 'ADMIN' ? 'admin' : user.role === 'BUSINESS' ? 'business-dashboard' : 'dashboard')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isHome && !isScrolled
                      ? 'text-white/70 hover:text-white hover:bg-white/10'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-white text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className={`text-sm font-medium text-white/80`}>{user.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="text-white/60 hover:text-white hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => handleNav('login')}
                  className="text-white/80 hover:text-white"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => handleNav('register')}
                  className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white rounded-full"
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
                  className="md:hidden text-white/80 hover:text-white"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-72 p-0 pb-6 bg-[#0a0a0f] border-purple-500/10">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex items-center justify-between p-4 border-b border-purple-500/10">
                  <div>
                    <span className="text-lg font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-purple-300 bg-clip-text text-transparent">
                      Spectra
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">Spectra Holdings Group</p>
                  </div>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                      <X className="w-5 h-5" />
                    </Button>
                  </SheetClose>
                </div>

                <div className="p-4 pt-2 space-y-1">
                  {NAV_LINKS.map((link) => (
                    <button
                      key={link.view}
                      onClick={() => handleNav(link.view)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        currentView === link.view
                          ? 'text-purple-400 bg-purple-500/10'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>

                <div className="border-t border-purple-500/10 p-4 space-y-2">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 mb-3 px-2">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm text-white">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full justify-start rounded-xl border-purple-500/20 text-white/80 hover:bg-purple-500/10 hover:text-white"
                        onClick={() => handleNav(user.role === 'ADMIN' ? 'admin' : user.role === 'BUSINESS' ? 'business-dashboard' : 'dashboard')}
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start rounded-xl text-red-400 border-red-500/20 hover:bg-red-500/10 hover:text-red-300"
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
                        className="w-full rounded-xl border-purple-500/20 text-white/80 hover:bg-purple-500/10 hover:text-white"
                        onClick={() => handleNav('login')}
                      >
                        Sign In
                      </Button>
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white rounded-xl"
                        onClick={() => handleNav('register')}
                      >
                        Register
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full rounded-xl border-violet-500/20 text-violet-400 hover:bg-violet-500/10 hover:text-violet-300"
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
