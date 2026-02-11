'use client'

import { motion } from 'framer-motion'
import { Shield, TrendingUp, GraduationCap, Github, Linkedin, Mail } from 'lucide-react'
import Link from 'next/link'

export default function AboutMe() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Hi, I&apos;m <span className="gradient-text">Narayan Lamichhane</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl md:text-2xl text-gray-400 mb-8"
          >
            Product Management & Cybersecurity Enthusiast
          </motion.p>
          
          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex justify-center gap-4 mb-12"
          >
            <a
              href="https://github.com/Narayan-Lamichhane13"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-zinc-900 rounded-full border border-zinc-800 hover:border-purple-500 transition-all hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20"
            >
              <Github className="w-6 h-6 text-gray-300" />
            </a>
              <a
                href="https://www.linkedin.com/in/naralami13/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-zinc-900 rounded-full border border-zinc-800 hover:border-blue-500 transition-all hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
              >
                <Linkedin className="w-6 h-6 text-gray-300" />
              </a>
              <a
                href="mailto:nara.lami13@gmail.com"
                className="p-3 bg-zinc-900 rounded-full border border-zinc-800 hover:border-pink-500 transition-all hover:scale-110 hover:shadow-lg hover:shadow-pink-500/20"
              >
                <Mail className="w-6 h-6 text-gray-300" />
              </a>
          </motion.div>
        </motion.div>

        {/* About Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-zinc-900 rounded-2xl p-8 card-hover"
          >
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Product Management</h3>
            <p className="text-gray-400">
              Passionate about building products that solve real-world problems and create meaningful impact for users.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-zinc-900 rounded-2xl p-8 card-hover"
          >
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Cybersecurity</h3>
            <p className="text-gray-400">
              Dedicated to understanding security vulnerabilities and building robust systems to protect digital assets.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-zinc-900 rounded-2xl p-8 card-hover"
          >
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Education</h3>
            <p className="text-gray-400">
              Currently studying at the <strong className="text-white">University of Illinois at Urbana-Champaign (UIUC)</strong>
            </p>
            <p className="text-gray-500 mt-2 font-semibold">
              Graduation: May 2026
            </p>
          </motion.div>
        </div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Let&apos;s Connect!</h2>
            <p className="text-lg md:text-xl text-gray-400 mb-6">
              I&apos;m always interested in discussing new opportunities, projects, or ideas in product management and cybersecurity.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/projects"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
              >
                View My Projects
              </Link>
              <Link
                href="/blog"
                className="px-6 py-3 bg-transparent border-2 border-zinc-700 text-white rounded-lg font-semibold hover:border-purple-500 hover:bg-purple-500/10 transition-all hover:scale-105"
              >
                Read Security Blog
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

