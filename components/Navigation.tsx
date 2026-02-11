'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, Briefcase, Shield, Building2 } from 'lucide-react'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const navItems = [
  { name: 'About', href: '/', icon: Home },
  { name: 'Experience', href: '/experience', icon: Building2 },
  { name: 'Projects', href: '/projects', icon: Briefcase },
  { name: 'Security Blog', href: '/blog', icon: Shield },
]

export default function Navigation() {
  const pathname = usePathname()
  const normalizedPath = basePath && pathname.startsWith(basePath) ? pathname.slice(basePath.length) || '/' : pathname

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-bold text-xl">N</span>
            </motion.div>
            <span className="font-bold text-xl hidden sm:block text-white">Narayan Lamichhane</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = normalizedPath === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'text-purple-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium hidden sm:inline">{item.name}</span>
                  </motion.div>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

