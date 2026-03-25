'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, ExternalLink, FileText } from 'lucide-react'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
const resumeSrc = `${basePath}/resume/Narayan_Lamichhane_PM_Resume_new25.pdf`

export default function ResumePage() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1 }
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

          <Link href="/" className="accent-link mb-8 inline-flex fade-up-element">
            <ArrowLeft className="w-4 h-4" />
            Back to About
          </Link>

          <div className="fade-up-element mb-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-wide section-heading mb-3">
              Resume
            </h1>
            <p className="text-base font-sans" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
              View the PDF inline, open it in a new tab, or download it in one click.
            </p>
          </div>

          <div className="fade-up-element content-card !p-0 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b" style={{ borderColor: 'hsl(0 0% 100% / 0.08)' }}>
              <div className="min-w-0">
                <p className="text-white font-medium font-sans truncate text-sm">
                  Narayan_Lamichhane_PM_Resume_new25.pdf
                </p>
                <p className="text-xs font-sans" style={{ color: 'hsl(0 0% 100% / 0.45)' }}>
                  Tip: use your browser&apos;s zoom for readability.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href={resumeSrc} target="_blank" rel="noopener noreferrer" className="outline-btn text-sm">
                  <ExternalLink className="w-4 h-4" />
                  Open
                </a>
                <a href={resumeSrc} download className="accent-btn text-sm">
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            </div>
            <div style={{ background: 'hsl(220 20% 5%)' }}>
              <div className="aspect-[8.5/11] w-full">
                <iframe
                  title="Narayan Lamichhane Resume"
                  src={`${resumeSrc}#view=FitH`}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          <p className="text-xs mt-6 font-sans" style={{ color: 'hsl(0 0% 100% / 0.35)' }}>
            If the embedded PDF viewer doesn&apos;t render in your browser, use the Open button.
          </p>
        </div>
      </div>
    </div>
  )
}
