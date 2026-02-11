'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Briefcase,
  Brain,
  Building2,
  Plane,
  Shield,
  Users,
  Zap,
  ExternalLink,
} from 'lucide-react'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

type ExperienceItem = {
  title: string
  subtitle?: string
  description: string | React.ReactNode
  tags: string[]
  icon: React.ComponentType<{ className?: string }>
  color: string
  image?: {
    src: string
    alt: string
  }
  pdf?: {
    src: string
    label: string
  }
  links?: Array<{
    href: string
    label: string
  }>
}

const experiences: ExperienceItem[] = [
  {
    title: 'AI Research Assistant - UIUC',
    subtitle: 'Research in Adversarial Examples (Jun 2024 - Aug 2024)',
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
    tags: ['UIUC', 'Adversarial ML', 'Computer Vision', 'AI Security'],
    icon: Brain,
    color: 'from-emerald-500 to-teal-500',
    image: {
      src: `${basePath}/portfolio-photos/IMG_8150.webp`,
      alt: 'Adversarial examples research photo',
    },
    pdf: {
      src: `${basePath}/portfolio-photos/Research%20Poster%20Final.pdf`,
      label: 'View Research Poster (PDF)',
    },
  },

  // Placeholders — add photos/descriptions later
  {
    title: 'Tile',
    subtitle: 'Experience (details coming soon)',
    description:
      'Placeholder for Tile experience. Add your description, impact, and technologies here once you share the details.',
    tags: ['Coming Soon'],
    icon: Building2,
    color: 'from-blue-500 to-purple-500',
  },
  {
    title: '3Sharp',
    subtitle: 'Experience (details coming soon)',
    description:
      'Placeholder for 3Sharp experience. Add your description, impact, and technologies here once you share the details.',
    tags: ['Coming Soon'],
    icon: Briefcase,
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'MTC',
    subtitle: 'Experience (details coming soon)',
    description:
      'Placeholder for MTC experience. Add your description, impact, and technologies here once you share the details.',
    tags: ['Coming Soon'],
    icon: Users,
    color: 'from-orange-500 to-red-500',
  },
  {
    title: 'SIGPwny',
    subtitle: 'Experience (details coming soon)',
    description:
      'Placeholder for SIGPwny experience. Add your description, impact, and technologies here once you share the details.',
    tags: ['Coming Soon'],
    icon: Shield,
    color: 'from-red-500 to-orange-500',
  },
  {
    title: 'Airify',
    subtitle: 'Experience (details coming soon)',
    description:
      'Placeholder for Airify experience. Add your description, impact, and technologies here once you share the details.',
    tags: ['Coming Soon'],
    icon: Plane,
    color: 'from-cyan-500 to-blue-500',
  },
  {
    title: 'SafeFit',
    subtitle: 'Experience (details coming soon)',
    description:
      'Placeholder for SafeFit experience. Add your description, impact, and technologies here once you share the details.',
    tags: ['Coming Soon'],
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
  },
]

export default function Experience() {
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
            My <span className="gradient-text">Experience</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Research, teams, and hands-on work across security, AI, and product
          </p>
        </motion.div>

        {/* Experience Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {experiences.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * (index + 1), duration: 0.6 }}
              className="bg-zinc-900 rounded-2xl overflow-hidden card-hover"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${item.color} p-8 text-white`}>
                <item.icon className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold">{item.title}</h3>
                {item.subtitle && <p className="text-white/90 mt-1 font-medium">{item.subtitle}</p>}
              </div>

              {/* Content */}
              <div className="p-8">
                {item.image && (
                  <div className="mb-6 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                    <div className="aspect-[16/9] w-full">
                      <img
                        src={item.image.src}
                        alt={item.image.alt}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}

                <div className="mb-6 leading-relaxed">
                  {typeof item.description === 'string' ? (
                    <p className="text-gray-400">{item.description}</p>
                  ) : (
                    item.description
                  )}
                </div>

                {item.pdf && (
                  <div className="mb-6">
                    <a
                      href={item.pdf.src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-zinc-700 text-gray-200 hover:border-purple-500 hover:bg-purple-500/10 transition-all"
                    >
                      {item.pdf.label}
                    </a>
                    <div className="mt-4 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                      <div className="aspect-[4/3] w-full">
                        <iframe title={`${item.title} PDF`} src={item.pdf.src} className="h-full w-full" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-zinc-800 text-gray-300 rounded-full text-sm font-medium border border-zinc-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links (optional) */}
                {item.links && item.links.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {item.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 text-gray-200 hover:border-purple-500 hover:bg-purple-500/10 transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}


