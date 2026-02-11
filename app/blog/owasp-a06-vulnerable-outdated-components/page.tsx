'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Package } from 'lucide-react'

function CodeBlock({ code, language }: { code: string; language?: string }) {
  return (
    <pre className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 overflow-x-auto text-sm text-gray-200">
      <code>{language ? `// ${language}\n${code}` : code}</code>
    </pre>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
      <div className="space-y-4 text-gray-300">{children}</div>
    </section>
  )
}

export default function OwaspA06VulnerableOutdatedComponents() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-5 h-5" />
          Back to Blog
        </Link>

        <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-slate-500 to-zinc-500 rounded-xl">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-gray-400 font-medium">OWASP Top 10</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">A06: Vulnerable &amp; Outdated Components</h1>
          <p className="text-lg text-gray-400">
            Your app depends on third-party code (libraries, frameworks, containers). If those components have known vulnerabilities and aren&apos;t patched, your app inherits the risk.
          </p>
        </motion.header>

        <Section title="What it is (and why it matters)">
          <p className="text-gray-400">
            This category is about supply-chain exposure: outdated dependencies, unpinned versions, missing SBOMs, and not monitoring advisories. It&apos;s often not a “code bug” but a
            process gap.
          </p>
        </Section>

        <Section title="Example: unpinned dependency versions (risk)">
          <p className="text-gray-400">
            Unpinned or broadly-ranged versions can pull in unexpected updates, while never-updated lockfiles can keep known-vulnerable versions forever.
          </p>
          <CodeBlock
            language="package.json (illustrative)"
            code={`{
  "dependencies": {
    "some-lib": "^1.0.0" // wide range; changes over time
  }
}`}
          />
        </Section>

        <Section title="Safer pattern (pin + scan + patch workflow)">
          <CodeBlock
            language="Process + tooling (example)"
            code={`- Pin dependencies via lockfiles (package-lock.json / pnpm-lock.yaml)
- Run SCA in CI (e.g., npm audit, Dependabot, Snyk)
- Track ownership for key deps (who patches, how fast)
- Patch regularly; remove unused deps; prefer maintained libs`}
          />
        </Section>

        <Section title="Practical checklist">
          <p className="text-gray-400">
            Keep an inventory (SBOM), monitor advisories, patch quickly, verify transitive deps, and scan images/containers too.
          </p>
        </Section>
      </div>
    </div>
  )
}


