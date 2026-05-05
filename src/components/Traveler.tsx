import { AnimatePresence, motion } from 'framer-motion';

interface TravelerProps {
  active: boolean;
  toLabel: string;
  onSkip: () => void;
}

/**
 * Traveler — flight HUD overlay shown while the SpaceScene camera is
 * cruising between waypoints. The actual motion lives in SpaceScene; this
 * component only paints the cinematic chrome (boost indicator, telemetry,
 * skip control, speed lines).
 */
export function Traveler({ active, toLabel, onSkip }: TravelerProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="traveler-hud"
          className="absolute inset-0 z-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {/* Speed-line streaks */}
          <SpeedLines />

          {/* Outer frame */}
          <div className="absolute inset-6 border border-ember-500/40 rounded-[2px] pointer-events-none" />
          <div className="absolute inset-6 ring-1 ring-inset ring-white/5 rounded-[2px] pointer-events-none" />

          {/* Top-left: telemetry */}
          <div className="absolute top-10 left-10 font-mono text-[10.5px] uppercase tracking-wider-2 text-ember-400 flex items-center gap-3 pointer-events-none">
            <span className="relative inline-flex w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-ember-400 animate-ping opacity-70" />
              <span className="relative inline-block w-1.5 h-1.5 rounded-full bg-ember-400" />
            </span>
            BURN · TRANSFER ORBIT
          </div>

          {/* Top-right: skip */}
          <button
            onClick={onSkip}
            className="absolute top-10 right-10 btn-ghost pointer-events-auto z-10"
          >
            Skip
            <span className="font-mono text-mist-500 text-[10px]">[ESC]</span>
          </button>

          {/* Bottom-center: target indicator + progress */}
          <div className="absolute inset-x-0 bottom-12 flex flex-col items-center gap-3 pointer-events-none">
            <div className="font-mono text-[10.5px] uppercase tracking-wider-2 text-mist-300 flex items-center gap-3">
              <span>Target</span>
              <span className="font-sans text-[14px] tracking-tight font-semibold text-white">
                {toLabel}
              </span>
            </div>
            <div className="w-[260px] h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-ember-500 via-ember-400 to-mist-300"
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 2.6, ease: 'linear' }}
              />
            </div>
          </div>

          {/* Reticle in center for sci-fi vibe */}
          <Reticle />

          {/* Subtle warm tint to the whole frame during burn */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(255,148,74,0.06) 75%, rgba(255,148,74,0.12) 100%)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Reticle() {
  return (
    <svg
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
    >
      <circle cx="60" cy="60" r="40" stroke="rgba(255,184,119,0.35)" strokeWidth="0.7" />
      <circle cx="60" cy="60" r="18" stroke="rgba(255,184,119,0.5)" strokeWidth="0.7" />
      <line x1="60" y1="14" x2="60" y2="32" stroke="rgba(255,184,119,0.6)" strokeWidth="0.7" />
      <line x1="60" y1="88" x2="60" y2="106" stroke="rgba(255,184,119,0.6)" strokeWidth="0.7" />
      <line x1="14" y1="60" x2="32" y2="60" stroke="rgba(255,184,119,0.6)" strokeWidth="0.7" />
      <line x1="88" y1="60" x2="106" y2="60" stroke="rgba(255,184,119,0.6)" strokeWidth="0.7" />
      <circle cx="60" cy="60" r="2" fill="#ff944a" />
    </svg>
  );
}

function SpeedLines() {
  const lines = Array.from({ length: 14 }).map((_, i) => ({
    top: 10 + ((i * 23) % 80),
    delay: (i % 5) * 0.06,
    len: 80 + ((i * 47) % 200),
    opacity: 0.2 + ((i * 13) % 30) / 100,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {lines.map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${s.top}%`,
            left: '-20%',
            height: '1px',
            width: `${s.len}px`,
            background:
              'linear-gradient(90deg, transparent, rgba(255,214,168,0.65), transparent)',
            opacity: 0,
          }}
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: ['0vw', '140vw'], opacity: [0, s.opacity, 0] }}
          transition={{
            duration: 1.4,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
