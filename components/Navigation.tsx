'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Github, Linkedin } from 'lucide-react'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [socialOpen, setSocialOpen] = useState(false)
  const logoRef = useRef<HTMLDivElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close social popover on outside click or ESC
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!logoRef.current) return
      if (!logoRef.current.contains(e.target as Node)) setSocialOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSocialOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Social popover */}
          <div className="flex items-center space-x-2 relative" ref={logoRef}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={socialOpen}
              onClick={() => setSocialOpen((v) => !v)}
              className="w-8 h-8 bg-gradient-to-r from-primary-700 to-primary-400 rounded-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-400"
              title="Open social links"
            >
              <span className="text-white font-bold text-sm">N</span>
            </button>
            <Link href="/" className="text-xl font-bold gradient-text">Narayan's Portfolio</Link>

            {socialOpen && (
              <div
                role="menu"
                className="absolute top-10 left-0 z-50 w-52 rounded-lg border border-gray-200 bg-white shadow-lg p-2"
              >
                <a
                  href="https://github.com/Narayan-Lamichhane13"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 text-gray-800"
                  role="menuitem"
                >
                  <Github size={18} className="text-gray-700" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/naralami13/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 text-gray-800"
                  role="menuitem"
                >
                  <Linkedin size={18} className="text-gray-700" />
                  <span>LinkedIn</span>
                </a>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`nav-link ${
                  pathname === item.href ? 'active text-primary-600' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md rounded-lg mt-2 shadow-lg">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    pathname === item.href
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
