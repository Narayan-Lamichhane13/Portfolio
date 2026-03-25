'use client'

import React, { useEffect, useRef } from 'react'
import { Github, ExternalLink } from 'lucide-react'
import ReadMore from '@/components/ReadMore'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

type Project = {
  title: string
  description: string | React.ReactNode
  tags: string[]
  github?: string
  pdf?: { src: string; label: string }
  image?: { src: string; alt: string }
}

const projects: Project[] = [
  {
    title: 'Vulnerability Scanner',
    description: 'An advanced network vulnerability scanner built with Python that uses Nmap for port scanning and integrates with the NVD API to identify known CVEs. Features include multi-threading, TCP/UDP scanning, and export capabilities.',
    tags: ['Python', 'Cybersecurity', 'Nmap', 'CVE Detection'],
    github: 'https://github.com/Narayan-Lamichhane13/Vulnerbility-Scanner',
  },
  {
    title: 'Neural Network Phishing Detection',
    description: 'A PyTorch-based neural network classifier for detecting phishing URLs. Implements a multi-layer perceptron with dropout regularization, achieving high accuracy through comprehensive data preprocessing and evaluation metrics.',
    tags: ['Python', 'PyTorch', 'Machine Learning', 'Cybersecurity'],
    github: 'https://github.com/Narayan-Lamichhane13/NN_regression',
  },
]

export default function Projects() {
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
        <div className="max-w-4xl mx-auto px-6 sm:px-8 pt-28 pb-24 sm:pb-32">

          {/* Header */}
          <div className="mb-12 fade-up-element">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-wide section-heading mb-4">
              Projects
            </h1>
            <p className="text-base sm:text-lg font-sans" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
              Exploring the intersection of cybersecurity and software development
            </p>
            <a
              href="https://github.com/Narayan-Lamichhane13"
              target="_blank"
              rel="noopener noreferrer"
              className="accent-btn mt-6"
            >
              <Github className="w-4 h-4" />
              View All on GitHub
            </a>
          </div>

          {/* Projects */}
          <div className="space-y-8">
            {projects.map((project) => (
              <div key={project.title} className="fade-up-element content-card">
                <h3 className="text-xl font-medium text-white mb-1 font-sans">{project.title}</h3>

                {project.image && (
                  <div className="my-5 overflow-hidden rounded-sm" style={{ border: '1px solid hsl(0 0% 100% / 0.08)' }}>
                    <div className="aspect-[16/9] w-full">
                      <img src={project.image.src} alt={project.image.alt} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                  </div>
                )}

                <ReadMore collapsedHeight={190} className="mb-6 leading-relaxed font-sans text-sm">
                  {typeof project.description === 'string' ? (
                    <p style={{ color: 'hsl(0 0% 100% / 0.6)' }}>{project.description}</p>
                  ) : (
                    project.description
                  )}
                </ReadMore>

                {project.pdf && (
                  <div className="mb-6">
                    <a href={project.pdf.src} target="_blank" rel="noopener noreferrer" className="outline-btn text-sm">
                      {project.pdf.label}
                    </a>
                    <div className="mt-4 overflow-hidden rounded-sm" style={{ border: '1px solid hsl(0 0% 100% / 0.08)' }}>
                      <div className="aspect-[4/3] w-full">
                        <iframe title={`${project.title} PDF`} src={project.pdf.src} className="h-full w-full" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag-pill">{tag}</span>
                  ))}
                </div>

                {project.github && (
                  <div className="flex gap-3">
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="accent-btn text-sm">
                      <Github className="w-4 h-4" />
                      View Code
                    </a>
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="outline-btn text-sm">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* More coming */}
          <div className="fade-up-element content-card mt-12 text-center">
            <h3 className="text-xl font-light tracking-wide mb-3 section-heading">More Projects Coming Soon</h3>
            <p className="text-sm font-sans max-w-2xl mx-auto" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
              I&apos;m constantly working on new projects at the intersection of product management, cybersecurity, and software development. Check back soon for updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
