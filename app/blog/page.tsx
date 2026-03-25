'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Shield,
  Lock,
  AlertTriangle,
  Terminal,
  Network,
  Fingerprint,
  Package,
  FileWarning,
  EyeOff,
} from 'lucide-react'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const blogPosts = [
  {
    title: 'Application Security Lab — From Native Exploits to Web Attacks',
    excerpt: 'Real-world exploitation techniques from stack overflows to heap corruption. Learn about DEP/NX bypass, ret2libc, ROP chains, and defensive strategies.',
    date: 'Published',
    category: 'Application Security',
    icon: Shield,
    color: 'hsl(0 70% 55%)',
    link: '/blog/app-security-lab',
  },
  {
    title: 'OWASP A01: Broken Access Control',
    excerpt: 'How authorization bugs lead to IDOR, privilege escalation, and data exposure — and how to enforce access checks consistently.',
    date: 'OWASP Top 10',
    category: 'OWASP Top 10',
    icon: Lock,
    color: 'hsl(240 55% 55%)',
    link: '/blog/owasp-a01-broken-access-control',
  },
  {
    title: 'OWASP A02: Cryptographic Failures',
    excerpt: 'Common encryption/key-management mistakes and secure patterns that prevent data leaks.',
    date: 'OWASP Top 10',
    category: 'OWASP Top 10',
    icon: Shield,
    color: 'hsl(190 65% 50%)',
    link: '/blog/owasp-a02-cryptographic-failures',
  },
  {
    title: 'OWASP A03: Injection (SQL/Command/LDAP)',
    excerpt: 'Why unsafe string concatenation turns user input into executable queries/commands — plus defensive coding with parameterization.',
    date: 'OWASP Top 10',
    category: 'OWASP Top 10',
    icon: Terminal,
    color: 'hsl(15 75% 55%)',
    link: '/blog/owasp-a03-injection',
  },
  {
    title: 'OWASP A04: Insecure Design',
    excerpt: 'Security problems caused by missing threat modeling, weak business logic, and absent abuse-case handling.',
    date: 'OWASP Top 10',
    category: 'OWASP Top 10',
    icon: Network,
    color: 'hsl(var(--accent))',
    link: '/blog/owasp-a04-insecure-design',
  },
  {
    title: 'OWASP A05: Security Misconfiguration',
    excerpt: 'Default settings, verbose errors, open storage, and missing headers — and a checklist to harden production.',
    date: 'OWASP Top 10',
    category: 'OWASP Top 10',
    icon: FileWarning,
    color: 'hsl(40 80% 50%)',
    link: '/blog/owasp-a05-security-misconfiguration',
  },
  {
    title: 'OWASP A06: Vulnerable & Outdated Components',
    excerpt: 'How dependency risk becomes application risk — and how SBOMs, scanners, and patching workflows reduce exposure.',
    date: 'OWASP Top 10',
    category: 'OWASP Top 10',
    icon: Package,
    color: 'hsl(220 10% 50%)',
    link: '/blog/owasp-a06-vulnerable-outdated-components',
  },
  {
    title: 'OWASP A07: Identification & Authentication Failures',
    excerpt: 'Weak passwords, insecure sessions, and missing MFA controls — plus secure auth/session patterns.',
    date: 'OWASP Top 10',
    category: 'OWASP Top 10',
    icon: Fingerprint,
    color: 'hsl(280 55% 55%)',
    link: '/blog/owasp-a07-authentication-failures',
  },
  {
    title: 'OWASP A08: Software & Data Integrity Failures',
    excerpt: 'Supply-chain risks, untrusted updates, and unsafe deserialization — mitigated with signatures and verification.',
    date: 'OWASP Top 10',
    category: 'OWASP Top 10',
    icon: EyeOff,
    color: 'hsl(300 55% 50%)',
    link: '/blog/owasp-a08-integrity-failures',
  },
  {
    title: 'OWASP A09: Security Logging & Monitoring Failures',
    excerpt: 'When you can\'t detect abuse, you can\'t respond. What to log, how to alert, and how to build useful audit trails.',
    date: 'OWASP Top 10',
    category: 'OWASP Top 10',
    icon: AlertTriangle,
    color: 'hsl(345 70% 55%)',
    link: '/blog/owasp-a09-logging-monitoring-failures',
  },
  {
    title: 'OWASP A10: Server-Side Request Forgery (SSRF)',
    excerpt: 'How URL-fetching features can be abused to access internal services — and how to lock down egress safely.',
    date: 'OWASP Top 10',
    category: 'OWASP Top 10',
    icon: Network,
    color: 'hsl(200 70% 50%)',
    link: '/blog/owasp-a10-ssrf',
  },
]

export default function Blog() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    const elements = sectionRef.current?.querySelectorAll('.fade-up-element')
    elements?.forEach((el, i) => {
      ;(el as HTMLElement).style.transitionDelay = `${i * 60}ms`
      observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url('${basePath}/images/hero.png')` }}
    >
      <div className="fixed inset-0 bg-gradient-to-b from-[hsl(var(--hero-overlay)/0.6)] via-[hsl(var(--hero-overlay)/0.8)] to-[hsl(var(--hero-overlay)/0.92)] pointer-events-none z-0" />

      <div ref={sectionRef} className="relative z-10">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 pt-28 pb-24 sm:pb-32">

          {/* Header */}
          <div className="text-center mb-16 fade-up-element">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-wide section-heading mb-4">
              Security Blog
            </h1>
            <p className="text-base sm:text-lg font-sans max-w-3xl mx-auto" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
              Insights, tutorials, and thoughts on cybersecurity, product security, and building secure systems
            </p>
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => {
              const Icon = post.icon
              return (
                <article key={post.title} className="fade-up-element">
                  {post.link ? (
                    <Link href={post.link} className="block content-card !p-0 overflow-hidden cursor-pointer h-full group">
                      <div className="p-5 pb-3 flex items-center gap-3">
                        <div className="p-2 rounded-sm" style={{ background: `${post.color}`, opacity: 0.9 }}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs uppercase tracking-[0.1em] font-sans font-medium" style={{ color: 'hsl(0 0% 100% / 0.45)' }}>
                          {post.category}
                        </span>
                      </div>
                      <div className="px-5 pb-5">
                        <h3 className="text-base font-medium text-white mb-2 font-sans group-hover:text-accent transition-colors duration-200">
                          {post.title}
                        </h3>
                        <p className="text-sm leading-relaxed mb-4 font-sans" style={{ color: 'hsl(0 0% 100% / 0.5)' }}>
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-sans" style={{ color: 'hsl(0 0% 100% / 0.35)' }}>
                            {post.date}
                          </span>
                          <span className="text-xs font-medium font-sans" style={{ color: 'hsl(var(--accent))' }}>
                            Read Article →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="content-card !p-0 overflow-hidden h-full opacity-70">
                      <div className="p-5 pb-3 flex items-center gap-3">
                        <div className="p-2 rounded-sm" style={{ background: `${post.color}`, opacity: 0.9 }}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs uppercase tracking-[0.1em] font-sans font-medium" style={{ color: 'hsl(0 0% 100% / 0.35)' }}>
                          {post.category}
                        </span>
                      </div>
                      <div className="px-5 pb-5">
                        <h3 className="text-base font-medium text-white mb-2 font-sans">{post.title}</h3>
                        <p className="text-sm leading-relaxed mb-4 font-sans" style={{ color: 'hsl(0 0% 100% / 0.4)' }}>
                          {post.excerpt}
                        </p>
                        <span className="text-xs font-sans" style={{ color: 'hsl(0 0% 100% / 0.3)' }}>Coming Soon</span>
                      </div>
                    </div>
                  )}
                </article>
              )
            })}
          </div>

          {/* Newsletter / CTA */}
          <div className="fade-up-element content-card mt-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-light tracking-wide mb-4 section-heading">Stay Updated</h2>
            <p className="text-sm sm:text-base font-sans mb-8 max-w-2xl mx-auto" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
              Blog posts coming soon! I&apos;ll be sharing insights on cybersecurity, vulnerability research, and secure product development.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 rounded-sm text-sm text-white font-sans outline-none transition-colors duration-200"
                style={{
                  background: 'hsl(0 0% 100% / 0.06)',
                  border: '1px solid hsl(0 0% 100% / 0.12)',
                }}
              />
              <button className="accent-btn text-sm">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
