import { motion } from 'framer-motion';
import { CONTACT_BLOCKS, PROFILE } from '../../data/portfolio';
import { PerspectivePanel } from '../SceneFrame';

export function ContactSection() {
  return (
    <div className="flex flex-col gap-4">
      <PerspectivePanel className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="font-mono text-[10px] uppercase tracking-wider-2 text-mist-400">
            Contact · 2026
          </span>
          <span className="font-mono text-[10px] text-mist-500">
            always open
          </span>
        </div>
        <h3 className="font-sans font-semibold text-[24px] sm:text-[26px] tracking-tight text-white leading-[1.1]">
          Let’s connect!
        </h3>
        <p className="mt-3 text-[13.5px] leading-relaxed text-mist-200">
          Email me at{' '}
          <a
            className="text-aurora-300 hover:text-white underline-offset-4 hover:underline transition-colors"
            href={`mailto:${PROFILE.email}`}
          >
            {PROFILE.email}
          </a>{' '}
          for my resume — or reach out on LinkedIn or GitHub. Always happy to
          chat about product, engineering, or research.
        </p>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <a
            className="contact-btn"
            href={`mailto:${PROFILE.email}`}
            aria-label="Email Narayan"
          >
            <MailIcon />
            <span className="flex flex-col items-start leading-tight">
              <span className="font-mono text-[9px] uppercase tracking-wider-2 text-mist-400">
                Email
              </span>
              <span className="text-[12px] text-white font-medium truncate max-w-[180px]">
                {PROFILE.email}
              </span>
            </span>
          </a>
          <a
            className="contact-btn"
            href={PROFILE.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
            <span className="flex flex-col items-start leading-tight">
              <span className="font-mono text-[9px] uppercase tracking-wider-2 text-mist-400">
                LinkedIn
              </span>
              <span className="text-[12px] text-white font-medium">
                naralami13
              </span>
            </span>
          </a>
          <a
            className="contact-btn"
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <GitHubIcon />
            <span className="flex flex-col items-start leading-tight">
              <span className="font-mono text-[9px] uppercase tracking-wider-2 text-mist-400">
                GitHub
              </span>
              <span className="text-[12px] text-white font-medium">
                Narayan-Lamichhane13
              </span>
            </span>
          </a>
        </div>
      </PerspectivePanel>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CONTACT_BLOCKS.map((block, i) => (
          <PerspectivePanel key={block.heading} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-sans font-semibold text-[14px] tracking-tight text-white">
                {block.heading}
              </h4>
              <span className="font-mono text-[9.5px] text-mist-400">
                /0{i + 1}
              </span>
            </div>
            <ul className="space-y-2.5">
              {block.items.map((item) => (
                <motion.li
                  key={item.label}
                  variants={{
                    hidden: { opacity: 0, x: -4 },
                    show: { opacity: 1, x: 0 },
                  }}
                  className="flex flex-col gap-0.5"
                >
                  <span className="font-mono text-[9px] uppercase tracking-wider-2 text-mist-400">
                    {item.label}
                  </span>
                  <span className="text-[12.5px] text-mist-100 leading-snug">
                    {item.value}
                  </span>
                </motion.li>
              ))}
            </ul>
          </PerspectivePanel>
        ))}
      </div>
    </div>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M7 10v7M7 7v.01M11 17v-4.5a2.5 2.5 0 0 1 5 0V17M11 10v7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.93.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
