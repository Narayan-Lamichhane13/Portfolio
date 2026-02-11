'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Network } from 'lucide-react'

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

export default function OwaspA10SSRF() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-5 h-5" />
          Back to Blog
        </Link>

        <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
              <Network className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-gray-400 font-medium">OWASP Top 10</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">A10: Server-Side Request Forgery (SSRF)</h1>
          <p className="text-lg text-gray-400">
            SSRF happens when a server fetches a user-supplied URL without sufficient validation, potentially allowing access to internal services or sensitive metadata endpoints.
          </p>
        </motion.header>

        <Section title="What it is (and why it matters)">
          <p className="text-gray-400">
            Many apps provide URL previewing, webhooks, image fetching, or import-from-URL features. If attackers can control the destination, they may abuse the server&apos;s network
            access (including internal-only hosts).
          </p>
        </Section>

        <Section title="Vulnerable example (fetching arbitrary URLs)">
          <CodeBlock
            language="Node.js (anti-pattern)"
            code={`// ❌ anti-pattern: user controls destination URL
app.get('/api/fetch', async (req, res) => {
  const url = req.query.url
  const resp = await fetch(url)
  res.send(await resp.text())
})`}
          />
        </Section>

        <Section title="Safer pattern (allowlist + egress controls)">
          <p className="text-gray-400">
            A strong defense combines application allowlists with network egress controls. At the app layer, only allow known hosts/schemes and reject IP literals and private ranges.
          </p>
          <CodeBlock
            language="Node.js (allowlist example)"
            code={`const ALLOWED_HOSTS = new Set(['example.com', 'api.example.com'])

function assertAllowed(u: URL) {
  if (u.protocol !== 'https:') throw new Error('Only https allowed')
  if (!ALLOWED_HOSTS.has(u.hostname)) throw new Error('Host not allowed')
}

app.get('/api/fetch', async (req, res) => {
  const u = new URL(String(req.query.url))
  assertAllowed(u)
  const resp = await fetch(u.toString())
  res.send(await resp.text())
})`}
          />
        </Section>

        <Section title="Practical checklist">
          <p className="text-gray-400">
            Prefer allowlists, disable unnecessary outbound access, use dedicated fetch services, and add monitoring for unusual outbound destinations.
          </p>
        </Section>
      </div>
    </div>
  )
}


