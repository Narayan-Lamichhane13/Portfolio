import { PROFILE, type SectionMeta } from '../data/portfolio';

interface NavControlsProps {
  sections: SectionMeta[];
  currentIndex: number;
  onJump: (index: number) => void;
  onReturnHome: () => void;
}

/**
 * NavControls — minimal HUD chrome around the centered cockpit panel:
 *   • top-left: home button (logo + name)
 *   • right rail: section indicator (jump-to)
 *
 * The Next CTA lives inside SceneFrame so it sits where the user is reading.
 */
export function NavControls({
  sections,
  currentIndex,
  onJump,
  onReturnHome,
}: NavControlsProps) {
  const current = sections[currentIndex];

  return (
    <>
      {/* Hairline frame */}
      <div className="absolute inset-6 border border-white/5 rounded-[2px] pointer-events-none z-30" />

      {/* Top bar */}
      <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-40 pointer-events-none gap-4">
        <div className="flex items-center gap-3 pointer-events-auto min-w-0">
          <button
            onClick={onReturnHome}
            className="flex items-center gap-3 group shrink-0"
            aria-label="Return home"
          >
            <Logo />
            <div className="hairline w-12 h-px transition-all group-hover:w-16 hidden sm:block" />
            <span className="font-sans text-[12px] font-medium text-mist-200 group-hover:text-white transition-colors">
              {PROFILE.name}
            </span>
          </button>
          <span className="font-mono text-[11px] text-mist-500 ml-2 hidden md:inline">
            /
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider-2 text-mist-400 truncate hidden md:inline">
            {current.label}
          </span>
        </div>
      </div>

      {/* Right rail — section indicator (hover-revealing, jump-to) */}
      <div className="hidden md:flex flex-col items-end absolute right-9 top-1/2 -translate-y-1/2 z-40 pointer-events-auto group/rail">
        <ul className="flex flex-col gap-5">
          {sections.map((s, i) => {
            const isActive = i === currentIndex;
            return (
              <li key={s.id}>
                <button
                  onClick={() => onJump(i)}
                  className="group flex items-center gap-3 cursor-pointer flex-row-reverse"
                  aria-label={`Go to ${s.label}`}
                >
                  <span
                    className={`font-mono text-[10px] uppercase tracking-wider-2 transition-all w-5 text-right ${
                      isActive ? 'text-white' : 'text-mist-500 group-hover:text-mist-200'
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <span
                    className={`block h-px transition-all ${
                      isActive
                        ? 'w-10 bg-white'
                        : 'w-5 bg-mist-500/30 group-hover:w-7 group-hover:bg-mist-300'
                    }`}
                  />
                  <span
                    className={`text-[12px] whitespace-nowrap transition-all duration-300 opacity-0 translate-x-2 ${
                      isActive ? 'text-white' : 'text-mist-300'
                    } group-hover/rail:opacity-100 group-hover/rail:translate-x-0`}
                  >
                    {s.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

function Logo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
      <path
        d="M5 17 L12 6 L19 17"
        stroke="#fff"
        strokeWidth="1.2"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="12" cy="12" r="1.6" fill="#5eb8ff" />
    </svg>
  );
}
