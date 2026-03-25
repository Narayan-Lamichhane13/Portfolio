'use client'

import { Network } from 'lucide-react'
import BlogArticleLayout, { BlogSection, BlogCodeBlock } from '@/components/BlogArticleLayout'

export default function OwaspA10SSRF() {
  return (
    <BlogArticleLayout>
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-sm">
              <Network className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs uppercase tracking-[0.1em] font-sans" style={{ color: 'hsl(0 0% 100% / 0.45)' }}>OWASP Top 10</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide section-heading mb-3 text-white">A10: Server-Side Request Forgery (SSRF)</h1>
          <p className="text-base font-sans" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
            SSRF happens when a server fetches a user-supplied URL without sufficient validation, potentially allowing access to internal services or sensitive metadata endpoints.
          </p>
        </header>

        <BlogSection title="What it is (and why it matters)">
          <p className="text-gray-400">
            Many apps provide URL previewing, webhooks, image fetching, or import-from-URL features. If attackers can control the destination, they may abuse the server&apos;s network
            access (including internal-only hosts).
          </p>
        </BlogSection>

        <BlogSection title="Vulnerable example (fetching arbitrary URLs)">
          <BlogCodeBlock
            language="Node.js (anti-pattern)"
            code={`// ❌ anti-pattern: user controls destination URL
app.get('/api/fetch', async (req, res) => {
  const url = req.query.url
  const resp = await fetch(url)
  res.send(await resp.text())
})`}
          />
        </BlogSection>

        <BlogSection title="Safer pattern (allowlist + egress controls)">
          <p className="text-gray-400">
            A strong defense combines application allowlists with network egress controls. At the app layer, only allow known hosts/schemes and reject IP literals and private ranges.
          </p>
          <BlogCodeBlock
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
        </BlogSection>

        <BlogSection title="Practical checklist">
          <p className="text-gray-400">
            Prefer allowlists, disable unnecessary outbound access, use dedicated fetch services, and add monitoring for unusual outbound destinations.
          </p>
        </BlogSection>
    </BlogArticleLayout>
  )
}
