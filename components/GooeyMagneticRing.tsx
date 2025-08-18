"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"

type Props = {
  text: string
  className?: string
  ringRadius?: number // base radius in px
  count?: number // number of blobs
  speed?: number // radians per second
  blobSize?: number // diameter in px
}

// A gooey ring of blobs that orbits around the title and is attracted towards the mouse side.
export default function GooeyMagneticRing({
  text,
  className = "",
  ringRadius = 120,
  count = 6,
  speed = 0.6,
  blobSize = 18,
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [center, setCenter] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const blobsRef = useRef<HTMLDivElement[]>([])

  // Calculate and update the center on mount/resize
  useEffect(() => {
    const updateCenter = () => {
      if (!wrapRef.current) return
      const rect = wrapRef.current.getBoundingClientRect()
      setCenter({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
    }
    updateCenter()
    const ro = new ResizeObserver(updateCenter)
    if (wrapRef.current) ro.observe(wrapRef.current)
    window.addEventListener("scroll", updateCenter, { passive: true })
    window.addEventListener("resize", updateCenter)
    return () => {
      ro.disconnect()
      window.removeEventListener("scroll", updateCenter)
      window.removeEventListener("resize", updateCenter)
    }
  }, [])

  // Track mouse position
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  // Gooey animation loop
  useEffect(() => {
    const animate = (t: number) => {
      if (!startTimeRef.current) startTimeRef.current = t
      const elapsed = (t - startTimeRef.current) / 1000 // seconds

      const cx = center.x
      const cy = center.y
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Attraction vector from center to mouse
      let ax = mx - cx
      let ay = my - cy
      const dist = Math.hypot(ax, ay) || 1
      const ux = ax / dist
      const uy = ay / dist

      // Intensity: stronger when closer, capped
      const maxShift = Math.min(ringRadius * 0.45, 60) // px
      const intensity = Math.min(1, (ringRadius * 1.2) / (dist + 1)) // 0..1
      const shift = maxShift * intensity

      // Move the whole ring a bit towards the mouse
      const ringCx = cx + ux * shift
      const ringCy = cy + uy * shift

      // Render blobs around the ring, with additional radial stretch towards mouse side
      for (let i = 0; i < count; i++) {
        const blob = blobsRef.current[i]
        if (!blob) continue
        const baseAngle = elapsed * speed + (i * Math.PI * 2) / count
        const vx = Math.cos(baseAngle)
        const vy = Math.sin(baseAngle)

        // Alignment of this blob with mouse direction
        const align = vx * ux + vy * uy // -1..1
        const stretch = 1 + 0.35 * align * intensity // stretch towards mouse, compress away
        const r = ringRadius * stretch

        const x = ringCx + vx * r
        const y = ringCy + vy * r

        // Write transforms in viewport coordinates using CSS translate
        blob.style.transform = `translate(${x - blobSize / 2}px, ${y - blobSize / 2}px)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [center.x, center.y, count, blobSize, ringRadius, speed])

  const blobs = useMemo(() => Array.from({ length: count }), [count])

  return (
    <div ref={wrapRef} className="relative inline-block">
      {/* SVG gooey filter definition */}
      <svg className="pointer-events-none absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* The title itself */}
      <h1 className={`text-5xl md:text-6xl font-bold text-gray-900 mb-6 relative z-10 ${className}`}>
        {text.split(" ").map((word, i) => (
          <span key={i} className={i === 1 ? "gradient-text" : undefined}>
            {word}
            {i < text.split(" ").length - 1 ? " " : ""}
          </span>
        ))}
      </h1>

      {/* Gooey blobs layer (positioned in viewport via transform) */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ filter: "url(#gooey)" }}
        aria-hidden
      >
        {blobs.map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) blobsRef.current[i] = el
            }}
            className="rounded-full shadow-[0_0_20px_rgba(99,102,241,0.45)]"
            style={{
              width: blobSize,
              height: blobSize,
              background:
                i % 3 === 0
                  ? "linear-gradient(135deg, rgba(37,99,235,0.95), rgba(59,130,246,0.9))"
                  : i % 3 === 1
                  ? "linear-gradient(135deg, rgba(29,78,216,0.95), rgba(37,99,235,0.9))"
                  : "linear-gradient(135deg, rgba(2,132,199,0.95), rgba(59,130,246,0.9))",
              position: "absolute",
              left: 0,
              top: 0,
              willChange: "transform",
            }}
          />
        ))}
      </div>
    </div>
  )
}
