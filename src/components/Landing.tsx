import { motion } from 'framer-motion';
import { PROFILE } from '../data/portfolio';

interface LandingProps {
  onStart: () => void;
}

/**
 * Landing — overlay only. The Three.js space scene is the world behind it.
 * The user sees the rocket and moon, with this title floating in space.
 */
export function Landing({ onStart }: LandingProps) {
  return (
    <motion.section
      key="landing"
      className="absolute inset-0 z-10 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Hairline frame */}
      <div className="absolute inset-6 border border-white/5 rounded-[2px] pointer-events-none" />

      {/* HUD top bar */}
      <div className="absolute top-8 left-8 right-8 flex items-center justify-between text-mist-400 pointer-events-auto">
        <div className="flex items-center gap-3">
          <Logo />
          <div className="hairline w-12 h-px hidden sm:block" />
          <span className="font-sans text-[12px] font-medium text-mist-200">
            {PROFILE.name}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span className="font-mono text-[11px] uppercase tracking-wider-2">
            Mission · Discover who I am
          </span>
        </div>
      </div>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <motion.div
          className="font-mono text-[10.5px] uppercase tracking-wider-3 text-ember-400 mb-6 flex items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <span className="relative inline-flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full bg-ember-400 animate-ping opacity-70" />
            <span className="relative inline-block w-1.5 h-1.5 rounded-full bg-ember-400" />
          </span>
          PRE-LAUNCH · ALL SYSTEMS NOMINAL
        </motion.div>

        <motion.h1
          className="font-sans font-semibold tracking-tight text-center text-balance text-[clamp(2.5rem,6.5vw,5rem)] leading-[1.05] mb-4 text-white max-w-[16ch]"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          Hi, I’m {PROFILE.shortName}.
          <br />
          <span className="text-mist-300 font-medium">Let’s blast off.</span>
        </motion.h1>

        <motion.p
          className="text-mist-200 max-w-xl text-center text-[15px] leading-relaxed text-balance mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.9 }}
        >
          {PROFILE.intro}
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 pointer-events-auto"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.9 }}
        >
          <button onClick={onStart} className="launch-btn group">
            <span className="relative z-10 flex items-center gap-3">
              <RocketGlyph />
              Click here to start
              <Arrow />
            </span>
          </button>
        </motion.div>

        <motion.div
          className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-3 text-mist-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
        >
          <div className="hairline w-24 h-px" />
          <span className="font-mono text-[10.5px] uppercase tracking-wider-2">
            press <span className="text-mist-200">enter</span> or{' '}
            <span className="text-mist-200">→</span> to launch
          </span>
        </motion.div>
      </div>
    </motion.section>
  );
}

function Logo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="rgba(255,255,255,0.65)"
        strokeWidth="1"
      />
      <path
        d="M12 4 L12 20 M4 12 L20 12"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="0.6"
      />
      <circle cx="12" cy="12" r="2" fill="#ffb877" />
    </svg>
  );
}

function RocketGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2c3 3 4 7 4 11l-2 3h-4l-2-3c0-4 1-8 4-11z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8 16l-2 4 4-2M16 16l2 4-4-2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
      <path
        d="M1 5h12m0 0L9 1m4 4L9 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
