'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Shield,
  Lock,
  AlertTriangle,
  Code,
  Terminal,
  Network,
  Fingerprint,
  Package,
  FileWarning,
  EyeOff,
} from 'lucide-react'

const blogPosts = [
  {
    title: 'Application Security Lab — From Native Exploits to Web Attacks',
    excerpt: 'Real-world exploitation techniques from stack overflows to heap corruption. Learn about DEP/NX bypass, ret2libc, ROP chains, and defensive strategies.',
    date: 'Published',
    category: 'Application Security',
    icon: Shield,
    color: 'from-red-500 to-orange-500',
    link: '/blog/app-security-lab',
  },
  {
    title: 'OWASP A01: Broken Access Control',
    excerpt: 'How authorization bugs lead to IDOR, privilege escalation, and data exposure — and how to enforce access checks consistently.',
    date: 'OWASP Top 10',
    category: 'OWASP Top 10',
    icon: Lock,
    color: 'from-indigo-500 to-purple-500',
    link: '/blog/owasp-a01-broken-access-control',
  },
  {
    title: 'OWASP A02: Cryptographic Failures',
    excerpt: 'Common encryption/key-management mistakes (plaintext secrets, weak modes, missing TLS) and secure patterns that prevent data leaks.',
    date: 'OWASP Top 10',
    category: 'OWASP Top 10',
    icon: Shield,
    color: 'from-cyan-500 to-blue-500',
    link: '/blog/owasp-a02-cryptographic-failures',
  },
  {
    title: 'OWASP A03: Injection (SQL/Command/LDAP)',
    excerpt: 'Why unsafe string concatenation turns user input into executable queries/commands — plus defensive coding with parameterization.',
    date: 'OWASP Top 10',
    category: 'OWASP Top 10',
    icon: Terminal,
    color: 'from-rose-500 to-orange-500',
    link: '/blog/owasp-a03-injection',
  },
  {
    title: 'OWASP A04: Insecure Design',
    excerpt: 'Security problems caused by missing threat modeling, weak business logic, and absent abuse-case handling — fixed at the design stage.',
    date: 'OWASP Top 10',
    category: 'OWASP Top 10',
    icon: Network,
    color: 'from-emerald-500 to-teal-500',
    link: '/blog/owasp-a04-insecure-design',
  },
  {
    title: 'OWASP A05: Security Misconfiguration',
    excerpt: 'Default settings, verbose errors, open storage, and missing headers — and a checklist to harden production deployments.',
    date: 'OWASP Top 10',
    category: 'OWASP Top 10',
    icon: FileWarning,
    color: 'from-yellow-500 to-orange-500',
    link: '/blog/owasp-a05-security-misconfiguration',
  },
  {
    title: 'OWASP A06: Vulnerable & Outdated Components',
    excerpt: 'How dependency risk becomes application risk — and how SBOMs, scanners, and patching workflows reduce exposure.',
    date: 'OWASP Top 10',
    category: 'OWASP Top 10',
    icon: Package,
    color: 'from-slate-500 to-zinc-500',
    link: '/blog/owasp-a06-vulnerable-outdated-components',
  },
  {
    title: 'OWASP A07: Identification & Authentication Failures',
    excerpt: 'Weak passwords, insecure sessions, and missing MFA controls — plus secure auth/session patterns for modern apps.',
    date: 'OWASP Top 10',
    category: 'OWASP Top 10',
    icon: Fingerprint,
    color: 'from-purple-500 to-pink-500',
    link: '/blog/owasp-a07-authentication-failures',
  },
  {
    title: 'OWASP A08: Software & Data Integrity Failures',
    excerpt: 'Supply-chain risks, untrusted updates, and unsafe deserialization — mitigated with signatures, pinning, and verification.',
    date: 'OWASP Top 10',
    category: 'OWASP Top 10',
    icon: EyeOff,
    color: 'from-fuchsia-500 to-purple-500',
    link: '/blog/owasp-a08-integrity-failures',
  },
  {
    title: 'OWASP A09: Security Logging & Monitoring Failures',
    excerpt: 'When you can’t detect abuse, you can’t respond. What to log, how to alert, and how to build useful audit trails.',
    date: 'OWASP Top 10',
    category: 'OWASP Top 10',
    icon: AlertTriangle,
    color: 'from-red-500 to-pink-500',
    link: '/blog/owasp-a09-logging-monitoring-failures',
  },
  {
    title: 'OWASP A10: Server-Side Request Forgery (SSRF)',
    excerpt: 'How URL-fetching features can be abused to access internal services — and how to lock down egress safely.',
    date: 'OWASP Top 10',
    category: 'OWASP Top 10',
    icon: Network,
    color: 'from-blue-500 to-cyan-500',
    link: '/blog/owasp-a10-ssrf',
  },
]

export default function Blog() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block p-4 bg-gradient-to-r from-red-500 to-purple-600 rounded-2xl mb-6"
          >
            <Shield className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Security <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Insights, tutorials, and thoughts on cybersecurity, product security, and building secure systems
          </p>
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => {
            return (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1), duration: 0.5 }}
            >
              {post.link ? (
                <Link
                  href={post.link}
                  className="block bg-zinc-900 rounded-2xl overflow-hidden card-hover cursor-pointer h-full"
                >
                  {/* Post Header with Gradient */}
                  <div className={`bg-gradient-to-r ${post.color} p-6 text-white`}>
                    <post.icon className="w-10 h-10 mb-3" />
                    <span className="text-sm font-semibold opacity-90">{post.category}</span>
                  </div>

                  {/* Post Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-white">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 font-medium">
                        {post.date}
                      </span>
                      <span className="text-sm text-purple-400 font-semibold">
                        Read Article →
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="block bg-zinc-900 rounded-2xl overflow-hidden card-hover cursor-pointer h-full">
              {/* Post Header with Gradient */}
              <div className={`bg-gradient-to-r ${post.color} p-6 text-white`}>
                <post.icon className="w-10 h-10 mb-3" />
                <span className="text-sm font-semibold opacity-90">{post.category}</span>
              </div>

              {/* Post Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-white">
                  {post.title}
                </h3>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 font-medium">
                    {post.date}
                  </span>
                  <span className="text-sm text-purple-400 font-semibold">
                    Coming Soon
                  </span>
                </div>
              </div>
                </div>
              )}
            </motion.article>
          )})}
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
          <div className="text-center max-w-3xl mx-auto relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Stay Updated</h2>
            <p className="text-lg text-gray-400 mb-8">
              Blog posts coming soon! I&apos;ll be sharing insights on cybersecurity, vulnerability research, and secure product development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white flex-1 max-w-md focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

