import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { SECTIONS, type SectionMeta } from '../data/portfolio';

interface SceneFrameProps {
  meta: SectionMeta;
  /** Telemetry label for the current camera waypoint (e.g. "Near side · approach"). */
  positionLabel: string;
  /** Label of the section the Next button advances to (e.g. "Experience"). */
  nextLabel: string;
  /** Called when the user clicks Next. */
  onNext: () => void;
  children: ReactNode;
}

const ACCENT_HEX: Record<SectionMeta['accent'], string> = {
  ember: '#ff944a',
  aurora: '#7fc6ff',
  mist: '#cbd0dc',
};

/**
 * SceneFrame — a centered glass cockpit panel that floats above the persistent
 * SpaceScene. The moon stays visible on either side and faintly through the
 * panel itself thanks to the translucent backdrop.
 */
export function SceneFrame({
  meta,
  positionLabel,
  nextLabel,
  onNext,
  children,
}: SceneFrameProps) {
  const accent = ACCENT_HEX[meta.accent];

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none px-4">
    <motion.section
      key={meta.id}
      className="relative pointer-events-auto"
      style={{
        width: 'min(720px, 94vw)',
        height: 'min(86vh, 880px)',
      }}
      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Outer cockpit chrome — translucent glass, thin border, corner brackets */}
      <div
        className="absolute inset-0 rounded-[14px] overflow-hidden"
        style={{
          background:
            'linear-gradient(180deg, rgba(8,11,20,0.72) 0%, rgba(6,8,16,0.62) 100%)',
          border: '1px solid rgba(255,255,255,0.10)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          boxShadow:
            '0 30px 90px -20px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Top accent line tinted by section accent */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}66, transparent)`,
          }}
        />
        <Bracket pos="tl" />
        <Bracket pos="tr" />
        <Bracket pos="bl" />
        <Bracket pos="br" />
      </div>

      {/* Inner column — header, scrolling content, Next CTA */}
      <div className="absolute inset-0 flex flex-col p-6 sm:p-7">
        {/* HUD strip: section index + waypoint label */}
        <motion.div
          className="flex items-center justify-between gap-4 shrink-0"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <div className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-wider-2 text-mist-400">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: accent, boxShadow: `0 0 12px ${accent}` }}
            />
            <span>
              {String(meta.index).padStart(2, '0')} /{' '}
              {String(SECTIONS.length).padStart(2, '0')} ·{' '}
              <span className="text-mist-300">{meta.label}</span>
            </span>
          </div>
          <div className="font-mono text-[9.5px] uppercase tracking-wider-2 text-mist-500 text-right truncate max-w-[180px]">
            {positionLabel}
          </div>
        </motion.div>

        {/* Section title block */}
        <motion.div
          className="mt-4 shrink-0"
          initial={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.22, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-sans font-semibold text-white text-[clamp(1.6rem,2.4vw,2.1rem)] leading-[1.05] tracking-tight">
            {meta.title}
          </h2>
          <p className="mt-2 text-mist-300 text-[13px] leading-relaxed max-w-[44ch]">
            {meta.subtitle}
          </p>
        </motion.div>

        <div className="mt-4 h-px hairline shrink-0" />

        {/* Scrolling content surface */}
        <motion.div
          className="mt-4 flex-1 min-h-0 panel-scroll overflow-y-auto overflow-x-hidden pr-1.5"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.06, delayChildren: 0.32 },
            },
          }}
        >
          {children}
        </motion.div>

        {/* Sticky Next CTA */}
        <motion.div
          className="shrink-0 pt-4 mt-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          <button
            onClick={onNext}
            className="next-cta group w-full"
            aria-label={`Next: ${nextLabel}`}
          >
            <span className="font-mono text-[10px] uppercase tracking-wider-3 text-white/60">
              Next stop
            </span>
            <span className="flex items-center gap-3">
              <span className="font-sans font-semibold text-[15px] text-white">
                {nextLabel}
              </span>
              <span className="next-cta-arrow">
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                  <path
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </span>
          </button>
        </motion.div>
      </div>
    </motion.section>
    </div>
  );
}

/* ─── Corner bracket decoration ────────────────────────────────────── */
function Bracket({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const base = 'absolute w-3.5 h-3.5 border-white/35';
  const c = {
    tl: 'top-2 left-2 border-l border-t',
    tr: 'top-2 right-2 border-r border-t',
    bl: 'bottom-2 left-2 border-l border-b',
    br: 'bottom-2 right-2 border-r border-b',
  }[pos];
  return <span className={`${base} ${c}`} aria-hidden />;
}

/* ──────────────────────────────────────────────────────────────────── */
/* PerspectivePanel — flat glass card primitive used by sections.       */
/* ──────────────────────────────────────────────────────────────────── */
interface PerspectivePanelProps {
  children: ReactNode;
  /** Kept for API parity with the old API; ignored visually. */
  depth?: number;
  tilt?: number;
  className?: string;
}

export function PerspectivePanel({
  children,
  className = '',
}: PerspectivePanelProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
        show: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className={`glass-panel rounded-[12px] ${className}`}
    >
      {children}
    </motion.div>
  );
}
