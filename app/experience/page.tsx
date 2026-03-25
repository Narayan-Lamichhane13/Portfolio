'use client'

import React, { useEffect, useRef } from 'react'
import { ExternalLink } from 'lucide-react'
import ReadMore from '@/components/ReadMore'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

type ExperienceItem = {
  title: string
  subtitle?: string
  description: string | React.ReactNode
  tags: string[]
  color: string
  image?: { src: string; alt: string }
  pdf?: { src: string; label: string }
  links?: Array<{ href: string; label: string }>
}

const experiences: ExperienceItem[] = [
  {
    title: 'AI Research Assistant - UIUC',
    subtitle: 'Research in Adversarial Examples (Jun 2024 - Aug 2024)',
    description: (
      <>
        <p className="leading-relaxed" style={{ color: 'hsl(0 0% 100% / 0.6)' }}>
          In this research study, I explored how small, carefully-designed perturbations to images can cause a neural network to make incorrect predictions—an effect known as an adversarial example. I tested controlled noise added to images (including low-amplitude pixel perturbations) and observed how model confidence and top-1 predictions shifted as the perturbation strength increased.
        </p>
        <p className="leading-relaxed mt-4" style={{ color: 'hsl(0 0% 100% / 0.6)' }}>
          Adversarial examples matter because they expose security and reliability risks in real-world AI systems. Even when the perturbation is constrained, the decision boundary learned by a model can be exploited. Robustness research often evaluates accuracy under attack, studies transferability across models, and uses defenses like adversarial training to improve stability.
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2" style={{ color: 'hsl(0 0% 100% / 0.6)' }}>
          <li>Led an undergraduate research team to analyze vulnerabilities in ML models, improving adversarial robustness by 15% through advanced training techniques.</li>
          <li>Secured $2000 in research funding by presenting project outcomes to stakeholders and writing compelling proposals.</li>
        </ul>
      </>
    ),
    tags: ['UIUC', 'Adversarial ML', 'Computer Vision', 'AI Security'],
    color: 'hsl(var(--accent))',
    image: { src: `${basePath}/portfolio-photos/IMG_8150.webp`, alt: 'Adversarial examples research photo' },
    pdf: { src: `${basePath}/portfolio-photos/Research%20Poster%20Final.pdf`, label: 'View Research Poster (PDF)' },
  },
  {
    title: 'Tile',
    subtitle: 'Founder | AirDrop for Windows — Chicago, IL (Nov 2025 – Present)',
    description: (
      <ul className="list-disc pl-6 space-y-2" style={{ color: 'hsl(0 0% 100% / 0.6)' }}>
        <li>Founder-led project to develop a cross-platform file transfer application using TCP-based networking concepts via direct HTTP streaming over local networks, enabling seamless peer-to-peer file syncing between iOS and Windows devices.</li>
        <li>Integrated AI agents and LLM-powered copilot to automate file organization, eliminating manual sorting across folders.</li>
        <li>Went through the full Product Management life cycle process by defining core user workflows and running an early MVP pilot with 20+ students to gather usability feedback to create updates.</li>
      </ul>
    ),
    tags: ['Product', 'Networking', 'Windows', 'iOS', 'LLMs'],
    color: 'hsl(var(--accent))',
    image: { src: `${basePath}/portfolio-photos/Tile.png`, alt: 'Tile project image' },
  },
  {
    title: '3Sharp',
    subtitle: 'Product Management Intern — Seattle, WA (Jun 2025 – Aug 2025)',
    description: (
      <ul className="list-disc pl-6 space-y-2" style={{ color: 'hsl(0 0% 100% / 0.6)' }}>
        <li>Collaborated cross-functionally with 3Sharp and Microsoft engineers to build 15+ interactive showcase systems for B2B customers from scratch—later published on Microsoft.com during a period of low staffing.</li>
        <li>Resolved 20+ UI/UX issues by applying analytical and product management concepts to logistics data in Power BI, leveraging project management methodologies to drive optimization and secure an additional $5K in project budget.</li>
      </ul>
    ),
    tags: ['Product', 'Microsoft', 'Power BI', 'UI/UX'],
    color: 'hsl(var(--accent))',
    links: [{ href: 'https://partner.microsoft.com/en-us/asset/collection/industry-dream-demos-and-dream-demo-in-a-box#/', label: 'Check it out here' }],
  },
  {
    title: 'MTC',
    subtitle: 'Executive Board: Product Manager',
    description: (
      <ul className="list-disc pl-6 space-y-2" style={{ color: 'hsl(0 0% 100% / 0.6)' }}>
        <li>Managed a cross-functional team of 7 to build a real estate API that aggregates land data into a visualization dashboard; defined the product skeleton in Figma, drove project timelines, and executed full delivery for a stakeholder presentation in San Francisco.</li>
        <li>Secured 3 client projects by pitching MTC&apos;s mission, generating $300 in funding.</li>
      </ul>
    ),
    tags: ['Product', 'Figma', 'APIs', 'Dashboard'],
    color: 'hsl(var(--accent))',
    links: [{ href: 'https://lanward-dashboard-fresh.vercel.app/', label: 'Check it out here' }],
  },
  {
    title: 'SIGPwny',
    subtitle: 'CTF Competitor',
    description: (
      <>
        <p className="leading-relaxed" style={{ color: 'hsl(0 0% 100% / 0.6)' }}>
          <strong className="text-white">SIGPwny Security 2025 CTF</strong> — 1st Place (Beginner&apos;s Bracket), 9th Place (Advanced Bracket)
          <br />
          <strong className="text-white">SIGPwny Security 2024 CTF</strong> — 10th Place out of 94 teams
        </p>
        <p className="leading-relaxed mt-4" style={{ color: 'hsl(0 0% 100% / 0.6)' }}>
          Competitor for Capture the Flag (CTF) events. Gained hands-on experience with cryptography, OSINT techniques, and reverse engineering using Ghidra.
        </p>
      </>
    ),
    tags: ['CTF', 'Cryptography', 'OSINT', 'Reverse Engineering', 'Ghidra'],
    color: 'hsl(var(--accent))',
    image: { src: `${basePath}/portfolio-photos/SIGPwny.jpg`, alt: 'SIGPwny image' },
  },
  {
    title: 'Airify',
    subtitle: 'Co-Founder — NASA Space Apps Challenge — Chicago, IL (Sept 2025 – Nov 2025)',
    description: (
      <ul className="list-disc pl-6 space-y-2" style={{ color: 'hsl(0 0% 100% / 0.6)' }}>
        <li>Co-founded a student-led project building an air quality platform in Python, that integrates NASA satellite data with local pollution and weather datasets.</li>
        <li>Conducted market analysis on 10+ studies and incorporated feedback from engineers at NASA, Google, and IBM to identify real-world applications for helping organizations assess pollution risk in real time.</li>
      </ul>
    ),
    tags: ['Python', 'NASA TEMPO', 'Data', 'Product'],
    color: 'hsl(var(--accent))',
    links: [{ href: 'https://airifyaqi.vercel.app/', label: 'Check it out here' }],
  },
  {
    title: 'SafeFit',
    subtitle: 'Software Security Engineer Intern',
    description: (
      <>
        <p className="leading-relaxed" style={{ color: 'hsl(0 0% 100% / 0.6)' }}>
          As a Software Security Engineer Intern, I contributed to the full-stack build (React Native mobile front-end ↔ Flask REST API back-end) and led efforts to identify and mitigate vulnerabilities against the OWASP Top 10—from robust authentication to secure data handling.
        </p>
        <p className="leading-relaxed mt-4" style={{ color: 'hsl(0 0% 100% / 0.6)' }}>
          We demoed the platform to investors and mentors and got invaluable feedback on both the tech stack and the user impact.
        </p>
      </>
    ),
    tags: ['Security', 'OWASP Top 10', 'React Native', 'Flask'],
    color: 'hsl(var(--accent))',
    image: { src: `${basePath}/portfolio-photos/SafeFit.png`, alt: 'SafeFit image' },
  },
]

export default function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )
    const elements = sectionRef.current?.querySelectorAll('.fade-up-element')
    elements?.forEach((el, i) => {
      ;(el as HTMLElement).style.transitionDelay = `${i * 80}ms`
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
        <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-28 pb-24 sm:pb-32">

          {/* Header */}
          <div className="mb-16 fade-up-element">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-wide section-heading mb-4">
              Experience
            </h1>
            <p className="text-base sm:text-lg font-sans" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
              Research, teams, and hands-on work across security, AI, and product
            </p>
          </div>

          {/* Experience Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {experiences.map((item) => (
              <div key={item.title} className="fade-up-element content-card !p-5 flex flex-col">
                <h3 className="text-base font-medium text-white font-sans mb-0.5">{item.title}</h3>
                {item.subtitle && (
                  <p className="text-xs font-medium mb-3 font-sans" style={{ color: 'hsl(var(--accent))' }}>
                    {item.subtitle}
                  </p>
                )}

                {item.image && (
                  <div className="mb-3 overflow-hidden rounded-sm" style={{ border: '1px solid hsl(0 0% 100% / 0.08)' }}>
                    <div className="aspect-[2/1] w-full">
                      <img
                        src={item.image.src}
                        alt={item.image.alt}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}

                <ReadMore collapsedHeight={100} className="mb-3 leading-relaxed font-sans text-xs">
                  {typeof item.description === 'string' ? (
                    <p style={{ color: 'hsl(0 0% 100% / 0.6)' }}>{item.description}</p>
                  ) : (
                    item.description
                  )}
                </ReadMore>

                {item.pdf && (
                  <div className="mb-3">
                    <a href={item.pdf.src} target="_blank" rel="noopener noreferrer" className="outline-btn text-xs">
                      {item.pdf.label}
                    </a>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {item.tags.map((tag) => (
                    <span key={tag} className="tag-pill !text-[10px] !px-2 !py-1">{tag}</span>
                  ))}
                </div>

                {item.links && item.links.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {item.links.map((l) => (
                      <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="accent-link text-xs">
                        <ExternalLink className="w-3.5 h-3.5" />
                        {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
