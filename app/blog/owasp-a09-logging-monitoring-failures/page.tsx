'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, AlertTriangle } from 'lucide-react'

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

export default function OwaspA09LoggingMonitoringFailures() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-5 h-5" />
          Back to Blog
        </Link>

        <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-gray-400 font-medium">OWASP Top 10</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">A09: Security Logging &amp; Monitoring Failures</h1>
          <p className="text-lg text-gray-400">
            If you don&apos;t log the right events (and alert on them), attacks can go undetected and incident response becomes guesswork.
          </p>
        </motion.header>

        <Section title="What it is (and why it matters)">
          <p className="text-gray-400">
            A09 includes missing audit logs for auth/authorization changes, no anomaly alerts (e.g., repeated failures), logs that lack context (request ID/user ID), or logs that are
            never reviewed. The impact is delayed detection and higher breach cost.
          </p>
        </Section>

        <Section title="Vulnerable example (no audit trail for sensitive actions)">
          <CodeBlock
            language="Anti-pattern"
            code={`// ❌ anti-pattern: sensitive change with no security logging
app.post('/api/admin/promote', async (req, res) => {
  await db.user.update({ where: { id: req.body.userId }, data: { role: 'admin' } })
  res.json({ ok: true })
})`}
          />
        </Section>

        <Section title="Safer pattern (structured audit logs + alerts)">
          <CodeBlock
            language="Example"
            code={`app.post('/api/admin/promote', async (req, res) => {
  const actor = req.auth.userId
  const target = req.body.userId

  // ... enforce authorization ...
  await db.user.update({ where: { id: target }, data: { role: 'admin' } })

  auditLogger.info({
    event: 'ROLE_CHANGED',
    actorUserId: actor,
    targetUserId: target,
    requestId: req.id,
  })

  res.json({ ok: true })
})`}
          />
        </Section>

        <Section title="Practical checklist">
          <p className="text-gray-400">
            Log auth events, privilege changes, and high-risk actions; include request IDs; protect logs from tampering; and set alerts for unusual spikes or repeated failures.
          </p>
        </Section>
      </div>
    </div>
  )
}


