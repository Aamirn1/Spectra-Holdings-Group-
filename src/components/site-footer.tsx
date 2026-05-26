'use client'

import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useNavigationStore, type ViewName } from '@/lib/store'

const QUICK_LINKS: { label: string; view: ViewName }[] = [
  { label: 'Home', view: 'home' },
  { label: 'Directory', view: 'directory' },
  { label: 'Events', view: 'events' },
  { label: 'News', view: 'news' },
  { label: 'About Us', view: 'about' },
  { label: 'Contact', view: 'contact' },
]

const RESIDENT_LINKS: { label: string; view: ViewName }[] = [
  { label: 'Join Community', view: 'register' },
  { label: 'Browse Directory', view: 'directory' },
  { label: 'Upcoming Events', view: 'events' },
  { label: 'Latest News', view: 'news' },
  { label: 'My Dashboard', view: 'dashboard' },
]

const BUSINESS_LINKS: { label: string; view: ViewName }[] = [
  { label: 'Register Business', view: 'register-business' },
  { label: 'Business Directory', view: 'directory' },
  { label: 'Business Login', view: 'login' },
  { label: 'Advertise With Us', view: 'contact' },
]

const COMPANY_LINKS: { label: string; view: ViewName }[] = [
  { label: 'About Spectra', view: 'about' },
  { label: 'Our Leadership', view: 'about' },
  { label: 'Our Projects', view: 'home' },
  { label: 'Contact Us', view: 'contact' },
]

export function SiteFooter() {
  const { navigate } = useNavigationStore()

  return (
    <footer className="bg-[#050508] text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* About Column */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-300 bg-clip-text text-transparent">
                Spectra
              </span>
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Spectra Holdings Group — building tomorrow&apos;s communities, connecting residents with trusted local businesses and services.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-purple-500/20 flex items-center justify-center transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4 text-gray-400" />
              </a>
              <a href="#" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-purple-500/20 flex items-center justify-center transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4 text-gray-400" />
              </a>
              <a href="#" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-purple-500/20 flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4 text-gray-400" />
              </a>
              <a href="#" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-purple-500/20 flex items-center justify-center transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4 text-gray-400" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.view}>
                  <button
                    onClick={() => navigate(link.view)}
                    className="text-sm text-gray-500 hover:text-purple-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* For Residents */}
          <div>
            <h4 className="font-semibold text-white mb-4">For Residents</h4>
            <ul className="space-y-2">
              {RESIDENT_LINKS.map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => navigate(link.view)}
                    className="text-sm text-gray-500 hover:text-purple-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* For Businesses */}
          <div>
            <h4 className="font-semibold text-white mb-4">For Businesses</h4>
            <ul className="space-y-2">
              {BUSINESS_LINKS.map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => navigate(link.view)}
                    className="text-sm text-gray-500 hover:text-purple-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 mb-6">
              {COMPANY_LINKS.map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => navigate(link.view)}
                    className="text-sm text-gray-500 hover:text-purple-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>

            <h4 className="font-semibold text-white mb-3">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-500">Spectra Holdings Group, Lahore, Pakistan</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                <a href="tel:+923205719979" className="text-sm text-gray-500 hover:text-purple-400 transition-colors">
                  +92 320 571 9979
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <a href="mailto:info@spectraholdings.com" className="text-sm text-gray-500 hover:text-purple-400 transition-colors">
                  info@spectraholdings.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6 sm:my-8 bg-white/5" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2024 Spectra Holdings Group. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <button className="hover:text-purple-400 transition-colors">Privacy Policy</button>
            <span>•</span>
            <button className="hover:text-purple-400 transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  )
}
