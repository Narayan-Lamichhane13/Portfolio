'use client'

import { useRef, useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Shield, Code, Search, ArrowRight, Github, Linkedin, Twitter,
  Download, Star, Zap, Users, Layers
} from 'lucide-react'

/** */
function ScrubGradientName({ name }: { name: string }) {
  // 0..100 (0 = all blue, 100 = all pink)
  const [pct, setPct] = useState(25)
  const wrapRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)

  // Base gradients
  const blueGrad = 'linear-gradient(90deg, #2563eb, #3b82f6)'
  const pinkGrad = 'linear-gradient(90deg, #f472b6, #ec4899)'

  // Pink layer is revealed from the RIGHT towards LEFT (like scrubbing R→L)
  const pinkClip = useMemo(() => {
    // We want the divider to sit exactly at pct% from the LEFT.
    // clip-path inset: top right bottom left
    // Right side should hide what’s to the right of the divider.
    const right = `${Math.max(0, 100 - pct)}%`
    return `inset(0 ${right} 0 0)`
  }, [pct])

  const handlePos = useMemo(() => `${pct}%`, [pct])

  const updatePctFromEvent = useCallback((clientX: number) => {
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width)
    const p = Math.round((x / rect.width) * 100)
    setPct(p)
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    updatePctFromEvent(e.clientX)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return
    updatePctFromEvent(e.clientX)
  }
  const onPointerUp = (e: React.PointerEvent) => {
    draggingRef.current = false
    ;(e.target as HTMLElement).releasePointerCapture?.(e.pointerId)
  }

  return (
  <div
      ref={wrapRef}
      className="relative inline-block select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      // Make the whole area draggable/touchable
  style={{ touchAction: 'none', cursor: 'ew-resize', fontSize: '1.06em' }}
      aria-label="Color scrubber for name"
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      {/* Blue layer (base) */}
      <span
        className="inline-block bg-clip-text text-transparent"
        style={{
          backgroundImage: blueGrad,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {name}
      </span>

      {/* Pink layer (on top, revealed via clip) */}
      <span
        className="absolute inset-0 bg-clip-text text-transparent pointer-events-none"
        style={{
          backgroundImage: pinkGrad,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          clipPath: pinkClip,
          transition: 'clip-path 80ms linear',
        }}
      >
        {name}
      </span>

      {/* Foreground divider + knob */}
      <div
        className="absolute inset-y-0 pointer-events-none"
        style={{ left: handlePos }}
      >
        <div className="h-full w-0.5 bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
        <div className="absolute top-1/2 -translate-y-1/2 -left-3">
          <div className="h-5 w-5 rounded-full bg-white shadow-[0_6px_18px_rgba(0,0,0,0.18)] border border-black/5" />
        </div>
      </div>
    </div>
  )
}

/** ======= PAGE ======= */
export default function Home() {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [aboutRef, aboutInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [skillsRef, skillsInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const skills = [
    { name: 'Penetration Testing & CTFs', icon: Shield, level: 90 },
    { name: 'Web Security & Vulnerability Research', icon: Search, level: 88 },
    { name: 'Python / C++ Development', icon: Code, level: 85 },
    { name: 'Network Security & Incident Response', icon: Zap, level: 83 },
    { name: 'Project Management & Agile', icon: Users, level: 92 },
    { name: 'Product Strategy & Roadmapping', icon: Layers, level: 90 },
  ]

  const achievements = [
    { number: 'Top 10', label: 'SIGPwny CTF Ranking (94 teams)' },
    { number: '3+', label: 'Leadership Roles (PM & Lead Eng.)' },
    { number: '$2K+', label: 'Research Funding Secured' },
    { number: '10+', label: 'Security Projects Delivered' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation />

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* background blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg mb-6">
                <Shield className="w-5 h-5 text-primary-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Project Manager & Cybersecurity Engineer</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-[1.1]"
            >
              Hi, I&apos;m{' '}
              <ScrubGradientName name="Narayan Lamichhane" />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Rising senior at UIUC passionate about bridging <b>product management</b> and <b>cybersecurity</b>. 
              From leading teams at startups and student clubs to competing in CTFs, 
              I bring both strategic leadership and hands-on technical expertise.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/projects"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                View My Work
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white/80 backdrop-blur-sm border border-white/20 text-gray-700 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Get In Touch
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center space-x-6 mt-12"
            >
              <a href="https://github.com/naralami13" className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                <Github className="w-6 h-6 text-gray-700" />
              </a>
              <a href="https://linkedin.com/in/naralami13" className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                <Linkedin className="w-6 h-6 text-gray-700" />
              </a>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={heroInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </motion.div>
      </section>

      {/* About */}
      <section ref={aboutRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={aboutInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About Me</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              I combine <b>cybersecurity expertise</b> with <b>project management leadership</b> to deliver secure, innovative, and impactful solutions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={aboutInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="relative">
                <div className="w-80 h-80 mx-auto bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center">
                  <div className="w-72 h-72 bg-white rounded-full flex items-center justify-center shadow-2xl">
                    <div className="w-64 h-64 rounded-full overflow-hidden relative">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/assets/IMG_5412.jpeg`}
                        alt="Horse Ride"
                        width={256}
                        height={256}
                        className="w-64 h-64 object-cover object-[50%_2%]"
                        priority
                      />
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <Star className="w-8 h-8 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={aboutInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.4 }} className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Driving Secure Innovation</h3>
              <p className="text-gray-600 leading-relaxed">
                As a <b>CS major at UIUC (3.8 GPA)</b> and <b>SIGPwny CTF competitor</b>, I’ve strengthened my technical foundation in cybersecurity, distributed systems, and AI.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Beyond engineering, I’ve led teams as <b>Product Manager for the Muslim Tech Club</b>, <b>Lead Engineer at SafeFit</b>, and <b>Intern at 3Sharp (Microsoft Azure demos)</b>.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200">
                  Let's Connect <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <button className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <Download className="mr-2 w-4 h-4" />
                  Download CV
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section ref={skillsRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={skillsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Skills & Expertise</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Blending cybersecurity depth with project management leadership.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <motion.div key={skill.name} initial={{ opacity: 0, y: 20 }} animate={skillsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: index * 0.1 }} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center mb-4">
                  <skill.icon className="w-8 h-8 text-primary-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">{skill.name}</h3>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${skill.level}%` }} />
                </div>
                <p className="text-sm text-gray-600 mt-2">{skill.level}% proficiency</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Achievements</h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">Highlights from my journey in <b>cybersecurity and product management</b>.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((a, i) => (
              <motion.div key={a.label} initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: i * 0.1 }} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{a.number}</div>
                <div className="text-primary-100 font-medium">{a.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
