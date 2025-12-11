'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, AlertTriangle, Code, Terminal, Network } from 'lucide-react'

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
    title: 'Machine Learning in Cybersecurity',
    excerpt: 'Exploring how neural networks can be used to detect phishing attempts and malicious URLs. A practical guide to building ML-powered security tools.',
    date: 'Coming Soon',
    category: 'AI Security',
    icon: Shield,
    color: 'from-blue-500 to-purple-500',
    link: null,
  },
  {
    title: 'Secure Coding Practices',
    excerpt: 'Best practices for writing secure code and avoiding common vulnerabilities. Learn about OWASP Top 10 and how to protect your applications.',
    date: 'Coming Soon',
    category: 'Application Security',
    icon: Code,
    color: 'from-green-500 to-teal-500',
    link: null,
  },
  {
    title: 'Penetration Testing Fundamentals',
    excerpt: 'An introduction to ethical hacking and penetration testing. Learn the methodology, tools, and mindset of security professionals.',
    date: 'Coming Soon',
    category: 'Pentesting',
    icon: Terminal,
    color: 'from-purple-500 to-pink-500',
    link: null,
  },
  {
    title: 'Zero Trust Architecture',
    excerpt: 'Understanding the principles of Zero Trust security and how modern organizations are implementing it to protect their assets.',
    date: 'Coming Soon',
    category: 'Enterprise Security',
    icon: Lock,
    color: 'from-yellow-500 to-red-500',
    link: null,
  },
  {
    title: 'Common Web Vulnerabilities',
    excerpt: 'A comprehensive guide to identifying and mitigating common web application vulnerabilities like XSS, SQL injection, and CSRF.',
    date: 'Coming Soon',
    category: 'Web Security',
    icon: AlertTriangle,
    color: 'from-orange-500 to-red-500',
    link: null,
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
            const ContentWrapper = post.link ? 'a' : 'div'
            const wrapperProps = post.link ? { href: post.link } : {}
            
            return (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1), duration: 0.5 }}
            >
              <ContentWrapper 
                {...wrapperProps}
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
                    {post.link ? 'Read Article →' : 'Coming Soon'}
                  </span>
                </div>
              </div>
              </ContentWrapper>
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

