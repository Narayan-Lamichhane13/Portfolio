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
    // Compare actual scroll height to the collapsed constraint.
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
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-900 to-transparent" />
        )}
      </div>

      {isOverflowing && (
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          className="mt-3 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  )
}


