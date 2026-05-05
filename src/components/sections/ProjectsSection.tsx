import { useEffect, useState } from 'react';
import { PROJECTS } from '../../data/portfolio';
import { PerspectivePanel } from '../SceneFrame';

const STATUS_COLOR = {
  shipped: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/25',
  'in progress': 'text-aurora-300 bg-aurora-400/10 border-aurora-400/25',
  archived: 'text-mist-400 bg-white/5 border-white/12',
} as const;

const FIX_LOGS = [
  '$ boot --module=engine-control',
  '[check] fuel feed .......... unstable',
  '[patch] recalibrate injector map',
  '[patch] restart thrust controller',
  '[test ] burn simulation ..... passed',
  '[check] nav-computer sync ... passed',
  '[ok   ] engine back online',
];

export function ProjectsSection() {
  const [phase, setPhase] = useState<'error' | 'fixing' | 'ready'>('error');
  const [shownLines, setShownLines] = useState(0);

  useEffect(() => {
    if (phase !== 'fixing') return;
    setShownLines(0);
    let doneTimeout: ReturnType<typeof setTimeout> | null = null;
    const interval = setInterval(() => {
      setShownLines((prev) => {
        const next = prev + 1;
        if (next >= FIX_LOGS.length) {
          clearInterval(interval);
          doneTimeout = setTimeout(() => setPhase('ready'), 700);
        }
        return Math.min(next, FIX_LOGS.length);
      });
    }, 380);
    return () => {
      clearInterval(interval);
      if (doneTimeout) clearTimeout(doneTimeout);
    };
  }, [phase]);

  if (phase !== 'ready') {
    const progress = shownLines / FIX_LOGS.length;
    return (
      <PerspectivePanel className="p-0 overflow-hidden">
        <div className="border-b border-white/10 px-4 py-2.5 bg-white/[0.02]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider-2 text-mist-400">
              Project Console · Safari DevTools
            </span>
            <span className="w-[40px]" aria-hidden />
          </div>
        </div>

        {phase === 'error' ? (
          <div className="p-5 sm:p-6">
            <div className="font-mono text-[10px] uppercase tracking-wider-2 text-ember-400 mb-2">
              System Alert
            </div>
            <h3 className="font-sans font-semibold text-[19px] text-white leading-tight">
              Error! Engine problem.
            </h3>
            <p className="text-[13px] text-mist-300 leading-relaxed mt-2">
              Project bay is offline due to thrust controller failure.
            </p>
            <button
              onClick={() => setPhase('fixing')}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-[10px] border border-ember-400/40 bg-ember-500/15 text-ember-200 hover:text-white hover:border-ember-300/70 transition-colors font-mono text-[11px] uppercase tracking-wider-2"
            >
              Click here to fix
            </button>
          </div>
        ) : (
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="font-mono text-[10px] uppercase tracking-wider-2 text-aurora-300">
                Running repair script...
              </div>
              <div className="font-mono text-[10px] text-mist-400">
                {Math.round(progress * 100)}%
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-aurora-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <pre className="bg-ink-950/70 border border-white/10 rounded-[10px] p-4 text-[11px] leading-6 text-mist-200 font-mono min-h-[220px]">
              {FIX_LOGS.slice(0, shownLines).join('\n')}
              {shownLines < FIX_LOGS.length ? (
                <span className="inline-block w-2 h-4 bg-mist-200/70 ml-1 align-middle animate-pulse" />
              ) : null}
            </pre>
          </div>
        )}
      </PerspectivePanel>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {PROJECTS.map((p) => {
        const href = p.github ?? p.link ?? '#';
        return (
          <PerspectivePanel
            key={p.name}
            className="p-0 overflow-hidden group hover:border-white/20 transition-colors"
          >
            <a
              href={href}
              target={href === '#' ? undefined : '_blank'}
              rel={href === '#' ? undefined : 'noreferrer'}
              className="block"
            >
              {p.image && (
                <div
                  className="relative h-[240px] sm:h-[300px] lg:h-[340px] border-b border-white/5 bg-ink-900/60"
                  style={{
                    backgroundImage: `url(${p.image})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(6,7,13,0.05) 0%, rgba(6,7,13,0.55) 100%)',
                    }}
                  />
                </div>
              )}

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-sans font-semibold text-[17px] tracking-tight text-white leading-tight">
                      {p.name}
                    </h3>
                    <p className="text-mist-300 text-[12.5px] mt-0.5">
                      {p.tagline}
                    </p>
                  </div>
                  <span
                    className={`font-mono text-[9.5px] uppercase tracking-wider px-2 py-0.5 rounded-full border whitespace-nowrap ${STATUS_COLOR[p.status]}`}
                  >
                    {p.status}
                  </span>
                </div>

                <div className="hairline h-px my-3" />

                <p className="text-[13px] leading-relaxed text-mist-200">
                  {p.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[9.5px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/12 text-mist-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="font-mono text-[10.5px] text-mist-400">
                    {p.year}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="font-mono text-[9.5px] uppercase tracking-wider-2 text-mist-400">
                    {p.github ? 'View on GitHub' : p.link ? 'Visit site' : 'Coming soon'}
                  </span>
                  <span
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-white/12 text-mist-200 group-hover:border-white/30 group-hover:translate-x-1 transition-transform"
                    aria-hidden
                  >
                    <svg width="11" height="9" viewBox="0 0 14 10" fill="none">
                      <path
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          </PerspectivePanel>
        );
      })}
    </div>
  );
}
