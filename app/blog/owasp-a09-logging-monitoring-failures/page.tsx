'use client'

import { AlertTriangle } from 'lucide-react'
import BlogArticleLayout, { BlogSection, BlogCodeBlock } from '@/components/BlogArticleLayout'

export default function OwaspA09LoggingMonitoringFailures() {
  return (
    <BlogArticleLayout>
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-sm">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs uppercase tracking-[0.1em] font-sans" style={{ color: 'hsl(0 0% 100% / 0.45)' }}>OWASP Top 10</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide section-heading mb-3 text-white">A09: Security Logging &amp; Monitoring Failures</h1>
          <p className="text-base font-sans" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
            If you don&apos;t log the right events (and alert on them), attacks can go undetected and incident response becomes guesswork.
          </p>
        </header>

        <BlogSection title="What it is (and why it matters)">
          <p className="text-gray-400">
            A09 includes missing audit logs for auth/authorization changes, no anomaly alerts (e.g., repeated failures), logs that lack context (request ID/user ID), or logs that are
            never reviewed. The impact is delayed detection and higher breach cost.
          </p>
        </BlogSection>

        <BlogSection title="Vulnerable example (no audit trail for sensitive actions)">
          <BlogCodeBlock
            language="Anti-pattern"
            code={`// ❌ anti-pattern: sensitive change with no security logging
app.post('/api/admin/promote', async (req, res) => {
  await db.user.update({ where: { id: req.body.userId }, data: { role: 'admin' } })
  res.json({ ok: true })
})`}
          />
        </BlogSection>

        <BlogSection title="Safer pattern (structured audit logs + alerts)">
          <BlogCodeBlock
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
        </BlogSection>

        <BlogSection title="Practical checklist">
          <p className="text-gray-400">
            Log auth events, privilege changes, and high-risk actions; include request IDs; protect logs from tampering; and set alerts for unusual spikes or repeated failures.
          </p>
        </BlogSection>
    </BlogArticleLayout>
  )
}
