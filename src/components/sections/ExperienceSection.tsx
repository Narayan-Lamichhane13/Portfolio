import { motion } from 'framer-motion';
import { EXPERIENCE } from '../../data/portfolio';
import { asset } from '../../lib/asset';
import { PerspectivePanel } from '../SceneFrame';

export function ExperienceSection() {
  return (
    <div className="flex flex-col gap-4">
      {EXPERIENCE.map((item, idx) => (
        <PerspectivePanel
          key={item.role + item.company}
          className="p-0 overflow-hidden"
        >
          {item.image && (
            <div
              className="relative h-[220px] sm:h-[280px] lg:h-[320px] border-b border-white/5 bg-ink-900/60"
              style={{
                backgroundImage: `url(${asset(item.image)})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(6,7,13,0.05) 0%, rgba(6,7,13,0.65) 100%)',
                }}
              />
            </div>
          )}

          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[9.5px] uppercase tracking-wider-2 text-ember-400">
                {String(idx + 1).padStart(2, '0')} · {idx === 0 ? 'Current' : 'Role'}
              </span>
              <span className="font-mono text-[10px] text-mist-400">
                {item.period}
              </span>
            </div>

            <h3 className="font-sans font-semibold text-[17px] tracking-tight text-white leading-tight">
              {item.role}
            </h3>
            <div className="mt-1 mb-4 flex items-center gap-2 text-mist-300 text-[12.5px]">
              <span className="font-medium">{item.company}</span>
              {item.location && (
                <>
                  <span className="w-1 h-1 rounded-full bg-mist-500" />
                  <span className="text-mist-400">{item.location}</span>
                </>
              )}
            </div>

            <ul className="space-y-2 text-[13px] text-mist-200 leading-relaxed">
              {item.bullets.map((b, i) => (
                <motion.li
                  key={i}
                  className="flex gap-2.5"
                  variants={{
                    hidden: { opacity: 0, x: -6 },
                    show: { opacity: 1, x: 0 },
                  }}
                >
                  <span className="mt-1.5 inline-block w-1 h-1 rounded-full bg-aurora-400 shrink-0" />
                  <span>{b}</span>
                </motion.li>
              ))}
            </ul>

            <div className="hairline h-px my-4" />

            <div className="flex flex-wrap gap-1.5 items-center">
              {item.stack.map((s) => (
                <span
                  key={s}
                  className="font-mono text-[9.5px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/12 text-mist-200 bg-white/[0.03]"
                >
                  {s}
                </span>
              ))}
            </div>

            {(item.link || item.pdf) && (
              <div className="mt-3 flex flex-wrap gap-3 text-[11.5px]">
                {item.link && (
                  <a
                    href={item.link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-aurora-300 hover:text-white transition-colors group"
                  >
                    <ExternalIcon />
                    <span className="underline-offset-4 group-hover:underline">
                      {item.link.label}
                    </span>
                  </a>
                )}
                {item.pdf && (
                  <a
                    href={asset(item.pdf.href)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-mist-200 hover:text-white transition-colors group"
                  >
                    <PdfIcon />
                    <span className="underline-offset-4 group-hover:underline">
                      {item.pdf.label}
                    </span>
                  </a>
                )}
              </div>
            )}
          </div>
        </PerspectivePanel>
      ))}
    </div>
  );
}

function ExternalIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 4h6v6M20 4l-9 9M5 5h6M5 5v14h14v-6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg width="11" height="13" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
