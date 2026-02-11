'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Brain,
  Building2,
  Shield,
  Users,
  Zap,
  ExternalLink,
  Briefcase,
  Plane,
} from 'lucide-react'
import ReadMore from '@/components/ReadMore'

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

  {
    title: 'Tile',
    subtitle: 'Founder | AirDrop for Windows — Chicago, IL (Nov 2025 – Present)',
    description: (
      <ul className="list-disc pl-6 space-y-2 text-gray-400">
        <li>
          Founder-led project to develop a cross-platform file transfer application using TCP-based networking concepts via direct HTTP streaming over local networks, enabling seamless peer-to-peer file syncing between iOS and Windows devices.
        </li>
        <li>
          Integrated AI agents and LLM-powered copilot to automate file organization, eliminating manual sorting across folders.
        </li>
        <li>
          Went through the full Product Management life cycle process by defining core user workflows and running an early MVP pilot with 20+ students to gather usability feedback to create updates.
        </li>
      </ul>
    ),
    tags: ['Product', 'Networking', 'Windows', 'iOS', 'LLMs'],
    icon: Building2,
    color: 'from-blue-500 to-purple-500',
    image: {
      src: `${basePath}/portfolio-photos/Tile.png`,
      alt: 'Tile project image',
    },
  },
  {
    title: '3Sharp',
    subtitle: 'Product Management Intern — Seattle, WA (Jun 2025 – Aug 2025)',
    description: (
      <ul className="list-disc pl-6 space-y-2 text-gray-400">
        <li>
          Collaborated cross-functionally with 3Sharp and Microsoft engineers to build 15+ interactive showcase systems for B2B customers from scratch—later published on Microsoft.com during a period of low staffing.
        </li>
        <li>
          Resolved 20+ UI/UX issues by applying analytical and product management concepts to logistics data in Power BI, leveraging project management methodologies to drive optimization and secure an additional $5K in project budget.
        </li>
      </ul>
    ),
    tags: ['Product', 'Microsoft', 'Power BI', 'UI/UX'],
    icon: Briefcase,
    color: 'from-purple-500 to-pink-500',
    links: [
      {
        href: 'https://partner.microsoft.com/en-us/asset/collection/industry-dream-demos-and-dream-demo-in-a-box#/',
        label: 'Check it out here',
      },
    ],
  },
  {
    title: 'MTC',
    subtitle: 'Executive Board: Product Manager',
    description: (
      <ul className="list-disc pl-6 space-y-2 text-gray-400">
        <li>
          Managed a cross-functional team of 7 to build a real estate API that aggregates land data into a visualization dashboard; defined the product skeleton in Figma, drove project timelines, and executed full delivery for a stakeholder presentation in San Francisco.
        </li>
        <li>
          Secured 3 client projects by pitching MTC’s mission, generating $300 in funding.
        </li>
      </ul>
    ),
    tags: ['Product', 'Figma', 'APIs', 'Dashboard'],
    icon: Users,
    color: 'from-orange-500 to-red-500',
    links: [
      {
        href: 'https://lanward-dashboard-fresh.vercel.app/',
        label: 'Check it out here',
      },
    ],
  },
  {
    title: 'SIGPwny',
    subtitle: 'CTF Competitor',
    description: (
      <>
        <p className="text-gray-400 leading-relaxed">
          <strong className="text-white">SIGPwny Security 2025 CTF</strong> — 1st Place (Beginner&apos;s Bracket), 9th Place (Advanced Bracket)
          <br />
          <strong className="text-white">SIGPwny Security 2024 CTF</strong> — 10th Place out of 94 teams
        </p>
        <p className="text-gray-400 leading-relaxed mt-4">
          Competitor for Capture the Flag (CTF) events, earning: 1st Place (Beginner&apos;s Bracket) and 9th Place (Advanced Bracket) in SIGPwny Fall 2025 CTF, and 10th Place (out of 94 teams) in Fall 2024 CTF.
          <br />
          – Gained hands-on experience with cryptography, OSINT techniques, and reverse engineering using Ghidra.
        </p>
      </>
    ),
    tags: ['CTF', 'Cryptography', 'OSINT', 'Reverse Engineering', 'Ghidra'],
    icon: Shield,
    color: 'from-red-500 to-orange-500',
    image: {
      src: `${basePath}/portfolio-photos/SIGPwny.jpg`,
      alt: 'SIGPwny image',
    },
  },
  {
    title: 'Airify',
    subtitle: 'Co-Founder — NASA Space Apps Challenge — Chicago, IL (Sept 2025 – Nov 2025)',
    description: (
      <ul className="list-disc pl-6 space-y-2 text-gray-400">
        <li>
          Co-founded a student-led project building an air quality platform in Python, that integrates NASA satellite data with local pollution and weather datasets.
        </li>
        <li>
          Conducted market analysis on 10+ studies and incorporated feedback from engineers at NASA, Google, and IBM to identify real-world applications for helping organizations assess pollution risk in real time.
        </li>
      </ul>
    ),
    tags: ['Python', 'NASA TEMPO', 'Data', 'Product'],
    icon: Plane,
    color: 'from-cyan-500 to-blue-500',
    links: [
      {
        href: 'https://airifyaqi.vercel.app/',
        label: 'Check it out here',
      },
    ],
  },
  {
    title: 'SafeFit',
    subtitle: 'Software Security Engineer Intern',
    description: (
      <>
        <p className="text-gray-400 leading-relaxed">
          As a Software Security Engineer Intern, I contributed to the full‑stack build (React Native mobile front‑end ↔ Flask REST API back‑end) and led efforts to identify and mitigate vulnerabilities against the OWASP Top 10—from robust authentication to secure data handling.
        </p>
        <p className="text-gray-400 leading-relaxed mt-4">
          We demoed the platform to investors and mentors and got invaluable feedback on both the tech stack and the user impact.
        </p>
      </>
    ),
    tags: ['Security', 'OWASP Top 10', 'React Native', 'Flask'],
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    image: {
      src: `${basePath}/portfolio-photos/SafeFit.png`,
      alt: 'SafeFit image',
    },
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
              className="bg-zinc-900 rounded-2xl overflow-hidden card-hover flex flex-col h-full"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${item.color} p-8 text-white`}>
                <item.icon className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold">{item.title}</h3>
                {item.subtitle && <p className="text-white/90 mt-1 font-medium">{item.subtitle}</p>}
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-1">
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

                <ReadMore collapsedHeight={210} className="mb-6 leading-relaxed">
                  {typeof item.description === 'string' ? (
                    <p className="text-gray-400">{item.description}</p>
                  ) : (
                    item.description
                  )}
                </ReadMore>

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
                  <div className="flex flex-wrap gap-3 mt-auto">
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


