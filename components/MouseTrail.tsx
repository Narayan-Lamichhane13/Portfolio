'use client'

import { useEffect, useState } from 'react'

interface Point {
  x: number
  y: number
  timestamp: number
}

const MouseTrail = () => {
  const [points, setPoints] = useState<Point[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPoint = {
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      }
      
      setMousePosition({ x: e.clientX, y: e.clientY })
      setPoints(prev => [...prev, newPoint].slice(-20)) // Keep last 20 points
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Clean up old points
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setPoints(prev => prev.filter(point => now - point.timestamp < 1000))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Main cursor glow */}
      <div
  className="absolute w-4 h-4 bg-gradient-to-r from-primary-500 to-primary-300 rounded-full blur-sm opacity-70"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          transform: 'translate(0, 0)',
          transition: 'none'
        }}
      />
      
      {/* Trail points */}
      {points.map((point, index) => {
        const age = Date.now() - point.timestamp
        const opacity = Math.max(0, 1 - age / 1000)
        const scale = Math.max(0.1, 1 - age / 1000)
        
        return (
          <div
            key={point.timestamp}
            className="absolute w-2 h-2 bg-gradient-to-r from-primary-400 to-primary-200 rounded-full blur-sm"
            style={{
              left: point.x - 4,
              top: point.y - 4,
              opacity: opacity * 0.6,
              transform: `scale(${scale})`,
              transition: 'none'
            }}
          />
        )
      })}
      
      {/* Neon trail lines */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {points.length > 1 && (
          <path
            d={`M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`}
            stroke="url(#neonGradient)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="blur(1px)"
            opacity="0.7"
          />
        )}
      </svg>
    </div>
  )
}

export default MouseTrail
