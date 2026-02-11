'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, EyeOff } from 'lucide-react'

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

export default function OwaspA08IntegrityFailures() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-5 h-5" />
          Back to Blog
        </Link>

        <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-fuchsia-500 to-purple-500 rounded-xl">
              <EyeOff className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-gray-400 font-medium">OWASP Top 10</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">A08: Software &amp; Data Integrity Failures</h1>
          <p className="text-lg text-gray-400">
            A08 includes supply-chain and integrity issues: untrusted updates, missing signature verification, unsafe deserialization, and pipelines that accept tampered artifacts.
          </p>
        </motion.header>

        <Section title="What it is (and why it matters)">
          <p className="text-gray-400">
            Systems often assume code and data are trustworthy once they&apos;re “inside” the environment. Integrity failures happen when attackers can swap artifacts (packages, plugins,
            configs) or feed untrusted serialized data that the app treats as authoritative.
          </p>
        </Section>

        <Section title="Vulnerable example (downloading updates without verification)">
          <CodeBlock
            language="Pseudo-code (anti-pattern)"
            code={`// ❌ anti-pattern: download + execute without signature verification
artifact = download("https://updates.example.com/plugin.bin")
install(artifact)
runPlugin(artifact)`}
          />
        </Section>

        <Section title="Safer pattern (verify signatures + pin sources)">
          <CodeBlock
            language="Pseudo-code (safer)"
            code={`artifact = download(allowedUrl)
if (!verifySignature(artifact, trustedPublicKey)) deny()
if (!hashMatches(artifact, expectedSha256)) deny()
install(artifact)`}
          />
        </Section>

        <Section title="Practical checklist">
          <p className="text-gray-400">
            Use signed releases, verify checksums, pin dependency sources, lock CI/CD permissions, and avoid unsafe deserialization of untrusted inputs.
          </p>
        </Section>
      </div>
    </div>
  )
}


