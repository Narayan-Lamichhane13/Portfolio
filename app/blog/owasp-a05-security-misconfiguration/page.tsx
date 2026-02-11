'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, FileWarning } from 'lucide-react'

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

export default function OwaspA05SecurityMisconfiguration() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-5 h-5" />
          Back to Blog
        </Link>

        <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
              <FileWarning className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-gray-400 font-medium">OWASP Top 10</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">A05: Security Misconfiguration</h1>
          <p className="text-lg text-gray-400">
            Security misconfiguration includes unsafe defaults, overly verbose error messages, missing security headers, exposed admin tools, and permissive cloud storage.
          </p>
        </motion.header>

        <Section title="What it is (and why it matters)">
          <p className="text-gray-400">
            Many incidents happen because production environments run with debug settings, sample credentials, or broad network access. The fix is usually configuration and
            operational hardening, not new features.
          </p>
        </Section>

        <Section title="Vulnerable example (debug errors in production)">
          <CodeBlock
            language="Express (anti-pattern)"
            code={`// ❌ anti-pattern: detailed stack traces exposed to users
app.use((err, req, res, next) => {
  res.status(500).send(err.stack)
})`}
          />
        </Section>

        <Section title="Safer pattern (generic errors + structured logging)">
          <CodeBlock
            language="Express (safer)"
            code={`app.use((err, req, res, next) => {
  // ✅ log internally (with request id), return generic message to client
  logger.error({ err, requestId: req.id })
  res.status(500).json({ error: 'Internal Server Error' })
})`}
          />
        </Section>

        <Section title="Practical checklist">
          <p className="text-gray-400">
            Use IaC + review, disable debug, restrict admin endpoints, set security headers, harden CORS, rotate secrets, and continuously scan cloud configs (S3/GCS/IAM).
          </p>
        </Section>
      </div>
    </div>
  )
}


