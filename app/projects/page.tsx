'use client'

import { motion } from 'framer-motion'
import React from 'react'
import { Github, ExternalLink, Shield, Brain } from 'lucide-react'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

type Project = {
  title: string
  description: string | React.ReactNode
  tags: string[]
  github?: string
  pdf?: {
    src: string
    label: string
  }
  icon: React.ComponentType<{ className?: string }>
  color: string
  image?: {
    src: string
    alt: string
  }
}

const projects: Project[] = [
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
  {
    title: 'Research in Adversarial Examples',
    description: (
      <>
        <p className="text-gray-400 leading-relaxed">
          In this research study, I explored how small, carefully-designed perturbations to images can cause a neural network to make incorrect predictions—an effect known as an adversarial example. I tested controlled noise added to images (including low-amplitude pixel perturbations) and observed how model confidence and top-1 predictions shifted as the perturbation strength increased. This helped demonstrate how modern computer vision models can be highly accurate on clean inputs, yet surprisingly sensitive to subtle input changes that are often imperceptible to humans.
        </p>
        <p className="text-gray-400 leading-relaxed mt-4">
          Adversarial examples matter because they expose security and reliability risks in real-world AI systems (e.g., vision models used in automated inspection or safety-critical pipelines). Even when the perturbation is constrained (commonly measured with norms like \(L_\infty\) or \(L_2\)), the decision boundary learned by a model can be exploited. Robustness research often evaluates accuracy under attack, studies transferability across models, and uses defenses like adversarial training to improve stability under worst-case input shifts.
        </p>

        <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-400">
          <li>
            Led an undergraduate research team to analyze vulnerabilities in machine learning models, improving adversarial robustness by 15% through advanced training techniques.
          </li>
          <li>Secured $2000 in research funding by presenting project outcomes to stakeholders and writing compelling proposals.</li>
        </ul>
      </>
    ),
    tags: ['Adversarial ML', 'Computer Vision', 'AI Security', 'Robustness'],
    icon: Brain,
    color: 'from-emerald-500 to-teal-500',
    image: {
      src: `${basePath}/portfolio-photos/IMG_8150.webp`,
      alt: 'Adversarial examples research project photo',
    },
    pdf: {
      src: `${basePath}/portfolio-photos/Research%20Poster%20Final.pdf`,
      label: 'View Research Poster (PDF)',
    },
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
                {project.image && (
                  <div className="mb-6 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                    <div className="aspect-[16/9] w-full">
                      <img
                        src={project.image.src}
                        alt={project.image.alt}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}

                <div className="mb-6 leading-relaxed">
                  {typeof project.description === 'string' ? (
                    <p className="text-gray-400">{project.description}</p>
                  ) : (
                    project.description
                  )}
                </div>

                {project.pdf && (
                  <div className="mb-6">
                    <a
                      href={project.pdf.src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-zinc-700 text-gray-200 hover:border-purple-500 hover:bg-purple-500/10 transition-all"
                    >
                      {project.pdf.label}
                    </a>
                    <div className="mt-4 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                      <div className="aspect-[4/3] w-full">
                        <iframe
                          title={`${project.title} PDF`}
                          src={project.pdf.src}
                          className="h-full w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}

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
                {project.github && (
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
                )}
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
              I&apos;m constantly working on new projects at the intersection of product management, cybersecurity, and software development. Check back soon for updates!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

