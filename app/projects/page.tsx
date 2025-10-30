'use client'

import { motion } from 'framer-motion'
import { Github, ExternalLink, Shield, Brain } from 'lucide-react'

const projects = [
  {
    title: 'Vulnerability Scanner',
    description: 'An advanced network vulnerability scanner built with Python that uses Nmap for port scanning and integrates with the NVD API to identify known CVEs. Features include multi-threading, TCP/UDP scanning, and export capabilities.',
    tags: ['Python', 'Cybersecurity', 'Nmap', 'CVE Detection'],
    github: 'https://github.com/Narayan-Lamichhane13/Vulnerbility-Scanner',
    icon: Shield,
    color: 'from-red-500 to-orange-500',
  },
  {
    title: 'Neural Network Phishing Detection',
    description: 'A PyTorch-based neural network classifier for detecting phishing URLs. Implements a multi-layer perceptron with dropout regularization, achieving high accuracy through comprehensive data preprocessing and evaluation metrics.',
    tags: ['Python', 'PyTorch', 'Machine Learning', 'Cybersecurity'],
    github: 'https://github.com/Narayan-Lamichhane13/NN_regression',
    icon: Brain,
    color: 'from-blue-500 to-purple-500',
  },
]

export default function Projects() {
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            My <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Exploring the intersection of cybersecurity and software development through hands-on projects
          </p>
          <motion.a
            href="https://github.com/Narayan-Lamichhane13"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
          >
            <Github className="w-5 h-5" />
            View All on GitHub
          </motion.a>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * (index + 1), duration: 0.6 }}
              className="bg-zinc-900 rounded-2xl overflow-hidden card-hover"
            >
              {/* Project Header with Gradient */}
              <div className={`bg-gradient-to-r ${project.color} p-8 text-white`}>
                <project.icon className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
              </div>

              {/* Project Content */}
              <div className="p-8">
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-zinc-800 text-gray-300 rounded-full text-sm font-medium border border-zinc-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-4">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all hover:scale-105"
                  >
                    <Github className="w-5 h-5" />
                    View Code
                  </a>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-4 py-3 border-2 border-zinc-700 rounded-lg hover:border-purple-500 hover:bg-purple-500/10 transition-all"
                  >
                    <ExternalLink className="w-5 h-5 text-gray-300" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* More Projects Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12">
            <h3 className="text-2xl font-bold mb-4 text-white">More Projects Coming Soon!</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              I'm constantly working on new projects at the intersection of product management, cybersecurity, and software development. Check back soon for updates!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

