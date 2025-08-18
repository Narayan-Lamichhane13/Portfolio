'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Navigation from '@/components/Navigation'
import { 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  ArrowRight,
  Search,
  Filter,
  BookOpen,
  Shield,
  Lock,
  Zap,
  Eye
} from 'lucide-react'
import Link from 'next/link'

export default function Blog() {
  const [blogRef, blogInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const blogPosts = [
    {
      id: 1,
      title: "Advanced Persistent Threats: Detection and Mitigation Strategies",
      excerpt: "An in-depth analysis of APT attack patterns, detection techniques, and effective mitigation strategies for enterprise environments.",
      content: "Advanced Persistent Threats (APTs) represent one of the most sophisticated forms of cyber attacks...",
      author: "Your Name",
      date: "2024-01-15",
      readTime: "8 min read",
      category: "Threat Intelligence",
      tags: ["APT", "Detection", "Mitigation", "Enterprise Security"],
      featured: true,
      image: "/api/placeholder/600/300"
    },
    {
      id: 2,
      title: "Zero-Day Vulnerabilities: Understanding the Race Against Time",
      excerpt: "Exploring the lifecycle of zero-day vulnerabilities, from discovery to patch deployment, and the critical role of rapid response.",
      content: "Zero-day vulnerabilities represent the most dangerous type of security flaw...",
      author: "Your Name",
      date: "2024-01-10",
      readTime: "6 min read",
      category: "Vulnerability Research",
      tags: ["Zero-Day", "Vulnerabilities", "Patch Management", "Response"],
      featured: false,
      image: "/api/placeholder/600/300"
    },
    {
      id: 3,
      title: "Web Application Security: Modern Attack Vectors and Defenses",
      excerpt: "A comprehensive guide to current web application security threats and the latest defensive techniques and tools.",
      content: "Web applications continue to be a primary target for cyber attackers...",
      author: "Your Name",
      date: "2024-01-05",
      readTime: "10 min read",
      category: "Web Security",
      tags: ["Web Security", "OWASP", "XSS", "SQL Injection"],
      featured: false,
      image: "/api/placeholder/600/300"
    },
    {
      id: 4,
      title: "Machine Learning in Cybersecurity: Opportunities and Challenges",
      excerpt: "Examining how machine learning is transforming cybersecurity, from threat detection to automated response systems.",
      content: "Machine learning has emerged as a game-changer in cybersecurity...",
      author: "Your Name",
      date: "2023-12-28",
      readTime: "12 min read",
      category: "AI & Security",
      tags: ["Machine Learning", "AI", "Threat Detection", "Automation"],
      featured: false,
      image: "/api/placeholder/600/300"
    },
    {
      id: 5,
      title: "Cloud Security: Shared Responsibility Model Deep Dive",
      excerpt: "Understanding the shared responsibility model in cloud security and best practices for securing cloud environments.",
      content: "Cloud computing has revolutionized how organizations deploy and manage their infrastructure...",
      author: "Your Name",
      date: "2023-12-20",
      readTime: "7 min read",
      category: "Cloud Security",
      tags: ["Cloud Security", "AWS", "Azure", "Shared Responsibility"],
      featured: false,
      image: "/api/placeholder/600/300"
    },
    {
      id: 6,
      title: "Incident Response: Building an Effective Security Operations Center",
      excerpt: "A practical guide to establishing and maintaining an effective SOC for rapid incident detection and response.",
      content: "A well-functioning Security Operations Center (SOC) is crucial for any organization...",
      author: "Your Name",
      date: "2023-12-15",
      readTime: "9 min read",
      category: "Incident Response",
      tags: ["SOC", "Incident Response", "SIEM", "Threat Hunting"],
      featured: false,
      image: "/api/placeholder/600/300"
    },
    {
      id: 7,
      title: "Mobile Security: Protecting Apps in the Age of BYOD",
      excerpt: "Security considerations and best practices for mobile application development and BYOD policies.",
      content: "Mobile devices have become ubiquitous in both personal and professional environments...",
      author: "Your Name",
      date: "2023-12-10",
      readTime: "8 min read",
      category: "Mobile Security",
      tags: ["Mobile Security", "BYOD", "App Security", "iOS", "Android"],
      featured: false,
      image: "/api/placeholder/600/300"
    },
    {
      id: 8,
      title: "Cryptography in Practice: Implementing Secure Communication",
      excerpt: "Practical implementation of cryptographic protocols for secure communication and data protection.",
      content: "Cryptography is the foundation of secure communication in the digital age...",
      author: "Your Name",
      date: "2023-12-05",
      readTime: "11 min read",
      category: "Cryptography",
      tags: ["Cryptography", "TLS", "Encryption", "Key Management"],
      featured: false,
      image: "/api/placeholder/600/300"
    }
  ]

  const categories = [
    { name: "All", icon: BookOpen, count: blogPosts.length },
    { name: "Threat Intelligence", icon: Eye, count: 1 },
    { name: "Vulnerability Research", icon: Search, count: 1 },
    { name: "Web Security", icon: Shield, count: 1 },
    { name: "AI & Security", icon: Zap, count: 1 },
    { name: "Cloud Security", icon: Lock, count: 1 },
    { name: "Incident Response", icon: Shield, count: 1 },
    { name: "Mobile Security", icon: Lock, count: 1 },
    { name: "Cryptography", icon: Lock, count: 1 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Security <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Insights, research, and analysis on cybersecurity trends, threats, and defensive strategies 
              from my ongoing security research and professional experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Article</h2>
            {blogPosts.filter(post => post.featured).map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <div className="h-64 md:h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                      <Shield className="w-24 h-24 text-white" />
                    </div>
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center mb-4">
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-6">
                      <User className="w-4 h-4 mr-2" />
                      <span className="mr-4">{post.author}</span>
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="mr-4">{new Date(post.date).toLocaleDateString()}</span>
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{post.readTime}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200"
                    >
                      Read Article
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section ref={blogRef} className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={blogInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.filter(post => !post.featured).map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={blogInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    <Shield className="w-12 h-12 text-white" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span className="mr-3">{new Date(post.date).toLocaleDateString()}</span>
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{post.tags.length - 3} more
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors duration-200"
                    >
                      Read More
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
  <section className="py-20 bg-gradient-to-r from-primary-700 to-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Stay Updated with Security Insights
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Subscribe to receive the latest cybersecurity research, threat intelligence, and security best practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50"
              />
              <button className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
