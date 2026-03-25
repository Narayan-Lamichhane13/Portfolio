'use client'

import React from 'react'

type ReadMoreProps = {
  children: React.ReactNode
  collapsedHeight?: number
  className?: string
}

export default function ReadMore({ children, collapsedHeight = 180, className }: ReadMoreProps) {
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [isOverflowing, setIsOverflowing] = React.useState(false)

  const measure = React.useCallback(() => {
    const el = contentRef.current
    if (!el) return
    setIsOverflowing(el.scrollHeight > collapsedHeight + 1)
  }, [collapsedHeight])

  React.useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  React.useEffect(() => {
    measure()
  }, [isExpanded, measure])

  return (
    <div className={className}>
      <div
        className="relative"
        style={!isExpanded ? { maxHeight: collapsedHeight, overflow: 'hidden' } : undefined}
      >
        <div ref={contentRef}>{children}</div>

        {!isExpanded && isOverflowing && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
            style={{ background: 'linear-gradient(to top, hsl(0 0% 100% / 0.06), transparent)' }}
          />
        )}
      </div>

      {isOverflowing && (
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          className="mt-3 text-sm font-medium transition-colors duration-200 font-sans"
          style={{ color: 'hsl(var(--accent))' }}
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  )
}
