import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Landing } from './components/Landing';
import { NavControls } from './components/NavControls';
import { SceneFrame } from './components/SceneFrame';
import { Traveler } from './components/Traveler';
import { SpaceScene, type SpaceSceneHandle } from './components/space/SpaceScene';
import { ANCHORS, WAYPOINTS } from './components/space/waypoints';
import { AboutSection } from './components/sections/AboutSection';
import { ContactSection } from './components/sections/ContactSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { SECTIONS, type SectionId } from './data/portfolio';

type Phase = 'landing' | 'cruising' | 'docked' | 'outro';

const SECTION_RENDERERS: Record<SectionId, () => JSX.Element> = {
  about: AboutSection,
  experience: ExperienceSection,
  projects: ProjectsSection,
  contact: ContactSection,
};

/** Distance from an anchor that counts as "docked". */
const DOCK_EPSILON = 0.012;

function nearestAnchorIndex(progress: number): number {
  let bestIdx = 0;
  let bestDist = Infinity;
  for (let i = 0; i < ANCHORS.length; i++) {
    const d = Math.abs(ANCHORS[i] - progress);
    if (d < bestDist) {
      bestDist = d;
      bestIdx = i;
    }
  }
  return bestIdx;
}

/**
 * App drives a continuous progress value (0..1) along the moon-orbit curve.
 *
 *   ANCHORS[0] = landing, ANCHORS[1..N] = the portfolio sections.
 *
 * Navigation is keyboard-only (arrow keys, page up/down, number keys) plus
 * the in-panel Next CTA and the right-rail jump dots. Wheel/touch driving
 * was removed because it felt twitchy and unreliable.
 */
export default function App() {
  const [phase, setPhase] = useState<Phase>('landing');
  const [sectionIdx, setSectionIdx] = useState(0);
  const [thankYouOpen, setThankYouOpen] = useState(false);

  const sceneRef = useRef<SpaceSceneHandle>(null);
  const progressRef = useRef(0);
  const interactingRef = useRef(false);
  const thankYouRef = useRef(false);
  thankYouRef.current = thankYouOpen;
  // True from the moment the user triggers Finish until Thank You opens —
  // the trans-Earth coast plays during this window and input is locked out.
  const outroPlayingRef = useRef(false);

  /* Apply a progress value to the scene + state. */
  const applyProgress = useCallback((p: number, instant = false) => {
    const clamped = Math.max(0, Math.min(1, p));
    progressRef.current = clamped;
    if (instant) sceneRef.current?.setProgressInstant(clamped);
    else sceneRef.current?.setProgress(clamped);
  }, []);

  /* Smoothly transition to a specific anchor index (0..N). */
  const goToAnchor = useCallback(
    (anchorIdx: number) => {
      const clampedIdx = Math.max(0, Math.min(ANCHORS.length - 1, anchorIdx));
      const target = ANCHORS[clampedIdx];
      const wasLanding = progressRef.current < 0.04;
      const goingToLanding = clampedIdx === 0;
      interactingRef.current = false;
      applyProgress(target);
      setSectionIdx(Math.max(0, clampedIdx - 1));
      if (Math.abs(target - progressRef.current) > 0 && !wasLanding) {
        setPhase('cruising');
      } else if (wasLanding && !goingToLanding) {
        setPhase('cruising');
      } else {
        setPhase(goingToLanding ? 'landing' : 'docked');
      }
    },
    [applyProgress],
  );

  const startVoyage = useCallback(() => {
    goToAnchor(1);
  }, [goToAnchor]);

  /* End-of-tour: rocket peels off toward Earth, then Thank You opens. */
  const triggerFinish = useCallback(() => {
    if (outroPlayingRef.current || thankYouRef.current) return;
    interactingRef.current = false;
    if (!sceneRef.current) {
      setThankYouOpen(true);
      return;
    }
    outroPlayingRef.current = true;
    setPhase('outro');
    sceneRef.current.playOutro(() => {
      outroPlayingRef.current = false;
      setThankYouOpen(true);
    });
  }, []);

  const next = useCallback(() => {
    const cur = nearestAnchorIndex(progressRef.current);
    if (cur >= ANCHORS.length - 1) {
      triggerFinish();
      return;
    }
    goToAnchor(cur + 1);
  }, [goToAnchor, triggerFinish]);

  const prev = useCallback(() => {
    const cur = nearestAnchorIndex(progressRef.current);
    goToAnchor(Math.max(0, cur - 1));
  }, [goToAnchor]);

  const goToSection = useCallback(
    (sectionIndex: number) => {
      const wrapped =
        ((sectionIndex % SECTIONS.length) + SECTIONS.length) % SECTIONS.length;
      goToAnchor(wrapped + 1);
    },
    [goToAnchor],
  );

  const returnHome = useCallback(() => {
    setThankYouOpen(false);
    goToAnchor(0);
  }, [goToAnchor]);

  const skipTravel = useCallback(() => {
    const idx = nearestAnchorIndex(progressRef.current);
    const anchor = ANCHORS[idx];
    applyProgress(anchor, true);
    interactingRef.current = false;
    setSectionIdx(Math.max(0, idx - 1));
    setPhase(idx === 0 ? 'landing' : 'docked');
  }, [applyProgress]);

  /* Camera arrival — fired by SpaceScene once easing settles. */
  const handleArrive = useCallback((arrivedAt: number) => {
    const idx = nearestAnchorIndex(arrivedAt);
    if (interactingRef.current) return;
    if (Math.abs(ANCHORS[idx] - arrivedAt) > DOCK_EPSILON) return;
    setSectionIdx(Math.max(0, idx - 1));
    setPhase(idx === 0 ? 'landing' : 'docked');
  }, []);

  /* ─── Keyboard listeners only (mouse/touch driving removed) ────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'Escape' && thankYouRef.current) {
        e.preventDefault();
        setThankYouOpen(false);
        return;
      }
      if (thankYouRef.current || outroPlayingRef.current) return;
      if (
        e.key === 'ArrowRight' ||
        e.key === 'ArrowDown' ||
        e.key === 'PageDown' ||
        e.key === ' '
      ) {
        e.preventDefault();
        const idx = nearestAnchorIndex(progressRef.current);
        if (idx >= ANCHORS.length - 1) {
          triggerFinish();
        } else {
          goToAnchor(idx + 1);
        }
      } else if (
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowUp' ||
        e.key === 'PageUp'
      ) {
        e.preventDefault();
        prev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToAnchor(0);
      } else if (e.key === 'Escape') {
        if (interactingRef.current) skipTravel();
      } else if (e.key === 'Enter') {
        if (progressRef.current < 0.04) {
          e.preventDefault();
          startVoyage();
        }
      } else if (/^[1-9]$/.test(e.key)) {
        const n = parseInt(e.key, 10);
        if (n <= ANCHORS.length - 1) {
          e.preventDefault();
          goToAnchor(n);
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goToAnchor, prev, startVoyage, skipTravel, triggerFinish]);

  const currentMeta = SECTIONS[sectionIdx];
  const Section = SECTION_RENDERERS[currentMeta.id];
  const currentWaypoint = WAYPOINTS[sectionIdx + 1] ?? WAYPOINTS[1];
  const isLastSection = sectionIdx === SECTIONS.length - 1;
  const nextSection = SECTIONS[(sectionIdx + 1) % SECTIONS.length];
  const nextCtaLabel = isLastSection ? 'Finish' : nextSection.label;
  const targetSection =
    phase === 'cruising'
      ? SECTIONS[
          Math.max(0, nearestAnchorIndex(progressRef.current) - 1)
        ]
      : currentMeta;

  return (
    <main className="relative h-full w-full overflow-hidden">
      {/* The 3D world — always mounted, persistent. */}
      <SpaceScene ref={sceneRef} onArrive={handleArrive} />

      {/* Subtle vignette so panels read clearly over the canvas. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 60%, transparent 30%, rgba(0,0,0,0.45) 90%)',
        }}
      />

      {/* Phase overlays */}
      {phase === 'landing' && <Landing onStart={startVoyage} />}

      {phase === 'docked' && !thankYouOpen && (
        <SceneFrame
          meta={currentMeta}
          positionLabel={currentWaypoint.label}
          nextLabel={nextCtaLabel}
          onNext={next}
        >
          <Section />
        </SceneFrame>
      )}

      {phase === 'docked' && !thankYouOpen && (
        <NavControls
          sections={SECTIONS}
          currentIndex={sectionIdx}
          onJump={goToSection}
          onReturnHome={returnHome}
        />
      )}

      <Traveler
        active={phase === 'cruising'}
        toLabel={targetSection.label}
        onSkip={skipTravel}
      />

      {/* Persistent keyboard hint — visible whenever the user is on the
          tour so the navigation control is impossible to miss. */}
      {!thankYouOpen && phase !== 'outro' && (
        <ArrowKeyHint
          onAdvance={
            phase === 'landing' ? startVoyage : phase === 'docked' ? next : undefined
          }
          isLast={
            phase === 'docked' && sectionIdx === SECTIONS.length - 1
          }
        />
      )}

      <AnimatePresence>
        {thankYouOpen && <ThankYouOverlay onClose={returnHome} />}
      </AnimatePresence>
    </main>
  );
}

function ThankYouOverlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      key="thank-you"
      role="dialog"
      aria-modal
      aria-labelledby="thank-you-title"
      className="absolute inset-0 z-[60] flex items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-md"
        onClick={onClose}
        aria-hidden
      />
      <motion.div
        className="relative max-w-md w-full rounded-2xl border border-white/15 bg-ink-900/90 px-8 py-10 text-center shadow-2xl"
        initial={{ scale: 0.94, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, y: 8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        <p className="font-mono text-[10px] uppercase tracking-wider-2 text-aurora-400 mb-3">
          End of tour
        </p>
        <h2
          id="thank-you-title"
          className="font-sans font-semibold text-2xl sm:text-3xl text-white tracking-tight"
        >
          Thank you for visiting.
        </h2>
        <p className="mt-3 text-mist-300 text-[14px] leading-relaxed">
          Glad you made it through the flyby — safe travels back to Earth.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-8 inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-white/20 text-mist-100 text-sm font-medium hover:bg-white/10 hover:text-white transition-colors"
        >
          Back home
        </button>
      </motion.div>
    </motion.div>
  );
}

/**
 * ArrowKeyHint — a large, unmissable keycap pinned to the bottom-right of the
 * viewport. Tells the visitor exactly which key advances the tour. Clicking
 * it also advances (handy if they don't trust their keyboard).
 */
function ArrowKeyHint({
  onAdvance,
  isLast,
}: {
  onAdvance?: () => void;
  isLast?: boolean;
}) {
  const label = isLast ? 'Finish tour' : 'Next section';
  return (
    <motion.button
      type="button"
      onClick={onAdvance}
      disabled={!onAdvance}
      className="arrow-key-hint group"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      aria-label={`Press the right arrow key for the ${label.toLowerCase()}`}
    >
      <span className="font-mono text-[9.5px] uppercase tracking-wider-3 text-mist-300">
        Press
      </span>
      <span className="keycap" aria-hidden>
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
          <path
            d="M1 7h14m0 0L10 1.5M15 7l-5 5.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col items-start leading-tight">
        <span className="font-mono text-[9.5px] uppercase tracking-wider-3 text-mist-400">
          right arrow
        </span>
        <span className="font-sans font-semibold text-[12.5px] text-white tracking-tight">
          {label}
        </span>
      </span>
    </motion.button>
  );
}
