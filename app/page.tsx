'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'
import { getStroke } from 'perfect-freehand'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const PAPER = { left: 0.28, top: 0.33, right: 0.71, bottom: 0.82 }
const HOLD_MS = 500
const FADE_MS = 600
const INK = '30, 25, 20'

type PenStroke = {
  points: number[][]
  lastTime: number
  path: Path2D | null
  dirty: boolean
}

function getPaperBounds(imgW: number, imgH: number, vpW: number, vpH: number) {
  const imgRatio = imgW / imgH
  const vpRatio = vpW / vpH
  let scale: number, offsetX: number, offsetY: number

  if (vpRatio > imgRatio) {
    scale = vpW / imgW
    offsetX = 0
    offsetY = (imgH * scale - vpH) / 2
  } else {
    scale = vpH / imgH
    offsetX = (imgW * scale - vpW) / 2
    offsetY = 0
  }

  const rawLeft = PAPER.left * imgW * scale - offsetX
  const rawTop = PAPER.top * imgH * scale - offsetY
  const rawRight = PAPER.right * imgW * scale - offsetX
  const rawBottom = PAPER.bottom * imgH * scale - offsetY

  const left = Math.max(0, rawLeft)
  const top = Math.max(0, rawTop)
  const right = Math.min(vpW, rawRight)
  const bottom = Math.min(vpH, rawBottom)

  return {
    left,
    top,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top),
  }
}

function outlineToPath(pts: number[][]): Path2D {
  const path = new Path2D()
  if (pts.length < 2) return path
  path.moveTo(pts[0][0], pts[0][1])
  for (let i = 0; i < pts.length; i++) {
    const [cx, cy] = pts[i]
    const [nx, ny] = pts[(i + 1) % pts.length]
    path.quadraticCurveTo(cx, cy, (cx + nx) / 2, (cy + ny) / 2)
  }
  path.closePath()
  return path
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const strokesRef = useRef<PenStroke[]>([])
  const currentStrokeRef = useRef<PenStroke | null>(null)
  const rafRef = useRef<number>(0)
  const dprRef = useRef(1)
  const sectionsRef = useRef<HTMLDivElement>(null)
  const [paperBounds, setPaperBounds] = useState({ left: 0, top: 0, width: 0, height: 0 })

  useEffect(() => {
    const img = new Image()
    let onResize: (() => void) | null = null

    img.onload = () => {
      onResize = () => {
        const vpW = window.innerWidth
        const vpH = window.innerHeight
        const bounds = getPaperBounds(img.naturalWidth, img.naturalHeight, vpW, vpH)
        setPaperBounds(bounds)

        const canvas = canvasRef.current
        if (canvas) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2)
          canvas.width = Math.round(bounds.width * dpr)
          canvas.height = Math.round(bounds.height * dpr)
          dprRef.current = dpr
        }
      }
      onResize()
      window.addEventListener('resize', onResize)
    }
    img.src = `${basePath}/images/hero.png`

    return () => {
      if (onResize) window.removeEventListener('resize', onResize)
    }
  }, [])

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const now = performance.now()
    const strokes = strokesRef.current
    const totalLife = HOLD_MS + FADE_MS

    for (let i = strokes.length - 1; i >= 0; i--) {
      if (now - strokes[i].lastTime > totalLife) strokes.splice(i, 1)
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (strokes.length === 0) {
      rafRef.current = 0
      return
    }

    const dpr = dprRef.current
    const penOpts = {
      size: 5 * dpr,
      thinning: 0.6,
      smoothing: 0.5,
      streamline: 0.4,
      simulatePressure: true,
      start: { taper: true },
      end: { taper: true },
    }

    ctx.save()

    for (const stroke of strokes) {
      if (stroke.points.length < 2) continue

      const age = now - stroke.lastTime
      let alpha = 1
      if (stroke !== currentStrokeRef.current && age > HOLD_MS) {
        alpha = Math.max(0, 1 - (age - HOLD_MS) / FADE_MS)
      }
      if (alpha <= 0) continue

      if (stroke.dirty || !stroke.path) {
        const outline = getStroke(stroke.points, penOpts)
        stroke.path = outlineToPath(outline)
        stroke.dirty = false
      }

      ctx.fillStyle = `rgba(${INK}, ${alpha * 0.92})`
      ctx.fill(stroke.path)
    }

    ctx.restore()

    rafRef.current = requestAnimationFrame(render)
  }, [])

  const startLoop = useCallback(() => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(render)
  }, [render])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      currentStrokeRef.current = null
      return
    }

    const dpr = dprRef.current
    const cx = x * dpr
    const cy = y * dpr
    const now = performance.now()

    let stroke = currentStrokeRef.current
    if (!stroke || now - stroke.lastTime > 150) {
      stroke = { points: [], lastTime: now, path: null, dirty: true }
      strokesRef.current.push(stroke)
      currentStrokeRef.current = stroke
    }

    stroke.points.push([cx, cy, 0.5])
    stroke.lastTime = now
    stroke.dirty = true

    startLoop()
  }, [startLoop])

  const handleMouseLeave = useCallback(() => {
    currentStrokeRef.current = null
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [handleMouseMove, handleMouseLeave])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )
    const elements = sectionsRef.current?.querySelectorAll('.fade-up-element')
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
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsl(var(--hero-overlay)/0.4)] pointer-events-none z-0" />

      {/* Hero Section */}
      <section className="relative w-full h-screen overflow-hidden flex items-start justify-center z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--hero-overlay)/0.25)] via-transparent to-transparent" />

        {/* Pen canvas aligned to the paper in the hero image */}
        <div
          ref={containerRef}
          className="absolute"
          style={{
            left: paperBounds.left,
            top: paperBounds.top,
            width: paperBounds.width,
            height: paperBounds.height,
            cursor: 'crosshair',
            zIndex: 5,
          }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Name + subtitle */}
        <div className="relative z-10 mt-[8vh] text-center px-4 pointer-events-none">
          <h1 className="hero-name text-primary-foreground text-5xl sm:text-7xl md:text-9xl uppercase tracking-widest">
            Narayan
          </h1>
          <p
            className="mt-4 text-sm sm:text-base tracking-[0.3em] uppercase font-sans"
            style={{ color: 'hsl(0 0% 100% / 0.7)', fontWeight: 400 }}
          >
            Product Manager · Cybersecurity Enthusiast
          </p>

        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 pointer-events-none">
          <span
            className="text-xs tracking-[0.25em] uppercase font-sans"
            style={{ color: 'hsl(0 0% 100% / 0.5)' }}
          >
            Scroll
          </span>
          <div
            className="w-px h-10 scroll-line"
            style={{ backgroundColor: 'hsl(0 0% 100% / 0.5)' }}
          />
        </div>
      </section>

      {/* Content Sections */}
      <div ref={sectionsRef} className="relative z-10 bg-[hsl(var(--background)/0.88)] backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-24 sm:py-32 space-y-24">

          {/* About Cards */}
          <section>
            <h2 className="fade-up-element text-3xl sm:text-4xl font-light tracking-wide mb-10 section-heading">
              About Me
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="fade-up-element content-card">
                <h3 className="text-lg font-medium mb-3 font-sans" style={{ color: 'hsl(var(--accent))' }}>
                  Product Management
                </h3>
                <p className="text-sm leading-relaxed font-sans" style={{ color: 'hsl(0 0% 100% / 0.6)' }}>
                  Passionate about building products that solve real-world problems and create meaningful impact for users.
                </p>
              </div>
              <div className="fade-up-element content-card">
                <h3 className="text-lg font-medium mb-3 font-sans" style={{ color: 'hsl(var(--accent))' }}>
                  Cybersecurity
                </h3>
                <p className="text-sm leading-relaxed font-sans" style={{ color: 'hsl(0 0% 100% / 0.6)' }}>
                  Dedicated to understanding security vulnerabilities and building robust systems to protect digital assets.
                </p>
              </div>
              <div className="fade-up-element content-card">
                <h3 className="text-lg font-medium mb-3 font-sans" style={{ color: 'hsl(var(--accent))' }}>
                  Education
                </h3>
                <p className="text-sm leading-relaxed font-sans" style={{ color: 'hsl(0 0% 100% / 0.6)' }}>
                  Currently at the <strong className="text-white">University of Illinois at Urbana-Champaign (UIUC)</strong>
                </p>
                <p className="text-xs mt-2 font-medium font-sans" style={{ color: 'hsl(0 0% 100% / 0.45)' }}>
                  Graduation: December 2026
                </p>
              </div>
            </div>
          </section>

          {/* Connect CTA */}
          <section className="fade-up-element content-card">
            <h2 className="text-2xl sm:text-3xl font-light tracking-wide mb-4 section-heading">
              Let&apos;s Connect
            </h2>
            <p className="text-sm sm:text-base leading-relaxed mb-6 font-sans" style={{ color: 'hsl(0 0% 100% / 0.6)' }}>
              I&apos;m always interested in discussing new opportunities, projects, or ideas in product management and cybersecurity.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/projects" className="accent-btn">
                View My Projects
              </Link>
              <Link href="/blog" className="outline-btn">
                Read Security Blog
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="fade-up-element pt-12 border-t border-[hsl(0_0%_100%/0.1)] text-center">
            <div className="flex justify-center gap-5 mb-6">
              <a
                href="https://github.com/Narayan-Lamichhane13"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-sm transition-all duration-200 hover:scale-110"
                style={{ background: 'hsl(0 0% 100% / 0.08)', border: '1px solid hsl(0 0% 100% / 0.12)' }}
              >
                <Github className="w-5 h-5" style={{ color: 'hsl(0 0% 100% / 0.7)' }} />
              </a>
              <a
                href="https://www.linkedin.com/in/naralami13/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-sm transition-all duration-200 hover:scale-110"
                style={{ background: 'hsl(0 0% 100% / 0.08)', border: '1px solid hsl(0 0% 100% / 0.12)' }}
              >
                <Linkedin className="w-5 h-5" style={{ color: 'hsl(0 0% 100% / 0.7)' }} />
              </a>
              <a
                href="mailto:nara.lami13@gmail.com"
                className="p-2.5 rounded-sm transition-all duration-200 hover:scale-110"
                style={{ background: 'hsl(0 0% 100% / 0.08)', border: '1px solid hsl(0 0% 100% / 0.12)' }}
              >
                <Mail className="w-5 h-5" style={{ color: 'hsl(0 0% 100% / 0.7)' }} />
              </a>
            </div>
            <p className="text-sm font-sans" style={{ color: 'hsl(0 0% 100% / 0.4)' }}>
              © 2026 Narayan Lamichhane. Built with care.
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}
