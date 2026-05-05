import { HOBBIES, PROFILE } from '../../data/portfolio';
import { asset } from '../../lib/asset';
import { PerspectivePanel } from '../SceneFrame';

export function AboutSection() {
  return (
    <div className="flex flex-col gap-4">
      <PerspectivePanel className="p-0 overflow-hidden flex flex-col">
        <div
          className="relative w-full bg-ink-900/60"
          style={{ height: 200 }}
        >
          <img
            src={asset(PROFILE.portrait)}
            alt={PROFILE.name}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: '32% 38%' }}
            loading="eager"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(4,6,12,0) 45%, rgba(4,6,12,0.92) 100%)',
            }}
          />
          <div className="absolute top-3 left-4 flex items-center gap-2.5">
            <span className="relative inline-flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
              <span className="relative inline-block w-2 h-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider-2 text-emerald-300">
              Open to roles
            </span>
          </div>
          <div className="absolute bottom-3 left-4 right-4">
            <div className="font-mono text-[10px] uppercase tracking-wider-2 text-mist-400">
              {PROFILE.role}
            </div>
            <div className="mt-0.5 font-sans font-semibold text-[18px] text-white tracking-tight">
              {PROFILE.name}
            </div>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <p className="text-[13.5px] leading-relaxed text-mist-200">
            {PROFILE.intro}
          </p>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="school" value={PROFILE.schoolShort} />
            <Stat label="grad" value="Dec 2026" />
            <Stat label="next" value="Amazon ’26" accent />
          </div>
        </div>
      </PerspectivePanel>

      <PerspectivePanel className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-[9.5px] uppercase tracking-wider-2 text-ember-400">
            05
          </span>
          <span className="font-mono text-[9.5px] uppercase tracking-wider-2 text-mist-400">
            Hobbies
          </span>
        </div>
        <p className="text-[13px] leading-relaxed text-mist-200">
          Outside of work I love chess, cooking, photography, and Muay Thai
          boxing.
        </p>
      </PerspectivePanel>

      <div className="grid grid-cols-2 gap-3">
        {HOBBIES.map((card) => (
          <PerspectivePanel
            key={card.title}
            className="p-0 overflow-hidden flex flex-col"
          >
            {card.image && (
              <div
                className="relative h-[120px] sm:h-[140px] bg-ink-900/60"
                style={{
                  backgroundImage: `url(${asset(card.image)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(6,7,13,0.05) 0%, rgba(6,7,13,0.7) 100%)',
                  }}
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-[9.5px] uppercase tracking-wider-2 text-ember-400">
                  {card.meta}
                </span>
                <span className="font-mono text-[9.5px] uppercase tracking-wider-2 text-mist-400">
                  {card.title}
                </span>
              </div>
              <p className="text-[12.5px] leading-relaxed text-mist-100 font-medium">
                {card.body}
              </p>
            </div>
          </PerspectivePanel>
        ))}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="font-mono text-[9.5px] uppercase tracking-wider-2 text-mist-400">
        {label}
      </div>
      <div
        className={`text-[12.5px] mt-1 font-medium ${
          accent ? 'text-ember-400' : 'text-mist-100'
        }`}
      >
        {value}
      </div>
    </div>
  );
}
