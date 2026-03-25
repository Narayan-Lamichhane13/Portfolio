'use client'

import { Package } from 'lucide-react'
import BlogArticleLayout, { BlogSection, BlogCodeBlock } from '@/components/BlogArticleLayout'

export default function OwaspA06VulnerableOutdatedComponents() {
  return (
    <BlogArticleLayout>
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-slate-500 to-zinc-500 rounded-sm">
            <Package className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs uppercase tracking-[0.1em] font-sans" style={{ color: 'hsl(0 0% 100% / 0.45)' }}>OWASP Top 10</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide section-heading mb-3 text-white">A06: Vulnerable &amp; Outdated Components</h1>
        <p className="text-base font-sans" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
          Your app depends on third-party code (libraries, frameworks, containers). If those components have known vulnerabilities and aren&apos;t patched, your app inherits the risk.
        </p>
      </header>

      <BlogSection title="What it is (and why it matters)">
        <p className="text-gray-400">
          This category is about supply-chain exposure: outdated dependencies, unpinned versions, missing SBOMs, and not monitoring advisories. It&apos;s often not a &quot;code bug&quot; but a
          process gap.
        </p>
      </BlogSection>

      <BlogSection title="Example: unpinned dependency versions (risk)">
        <p className="text-gray-400">
          Unpinned or broadly-ranged versions can pull in unexpected updates, while never-updated lockfiles can keep known-vulnerable versions forever.
        </p>
        <BlogCodeBlock
          language="package.json (illustrative)"
          code={`{
  "dependencies": {
    "some-lib": "^1.0.0" // wide range; changes over time
  }
}`}
        />
      </BlogSection>

      <BlogSection title="Safer pattern (pin + scan + patch workflow)">
        <BlogCodeBlock
          language="Process + tooling (example)"
          code={`- Pin dependencies via lockfiles (package-lock.json / pnpm-lock.yaml)
- Run SCA in CI (e.g., npm audit, Dependabot, Snyk)
- Track ownership for key deps (who patches, how fast)
- Patch regularly; remove unused deps; prefer maintained libs`}
        />
      </BlogSection>

      <BlogSection title="Practical checklist">
        <p className="text-gray-400">
          Keep an inventory (SBOM), monitor advisories, patch quickly, verify transitive deps, and scan images/containers too.
        </p>
      </BlogSection>
    </BlogArticleLayout>
  )
}
