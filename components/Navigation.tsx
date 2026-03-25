'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const navItems = [
  { name: 'About', href: '/' },
  { name: 'Experience', href: '/experience' },
  { name: 'Projects', href: '/projects' },
  { name: 'Tech Blog', href: '/blog' },
  { name: 'Resume', href: '/resume' },
]

export default function Navigation() {
  const pathname = usePathname()
  const normalizedPath = basePath && pathname.startsWith(basePath)
    ? pathname.slice(basePath.length) || '/'
    : pathname
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 glass-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="max-w-5xl mx-auto px-6 sm:px-8 flex items-center justify-between h-14">
        <Link
          href="/"
          className="text-sm font-medium tracking-[0.15em] uppercase font-serif"
          style={{ color: 'hsl(0 0% 100% / 0.9)', fontSize: '1rem' }}
        >
          Narayan
        </Link>
        <div className="flex items-center gap-4 sm:gap-7">
          {navItems.map((item) => {
            const isActive = normalizedPath === item.href ||
              (item.href !== '/' && normalizedPath.startsWith(item.href))

            return (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs sm:text-sm tracking-[0.08em] uppercase transition-colors duration-200 hover:text-white font-sans"
                style={{
                  color: isActive ? 'hsl(0 0% 100%)' : 'hsl(0 0% 100% / 0.55)',
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                {item.name}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
