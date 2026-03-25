'use client'

import { Lock } from 'lucide-react'
import BlogArticleLayout, { BlogSection, BlogCodeBlock } from '@/components/BlogArticleLayout'

export default function OwaspA01BrokenAccessControl() {
  return (
    <BlogArticleLayout>
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-sm">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs uppercase tracking-[0.1em] font-sans" style={{ color: 'hsl(0 0% 100% / 0.45)' }}>OWASP Top 10</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide section-heading mb-3 text-white">A01: Broken Access Control</h1>
        <p className="text-base font-sans" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
          Broken access control happens when an app fails to enforce authorization rules consistently, letting users access data or actions they shouldn&apos;t.
        </p>
      </header>

      <BlogSection title="What it is (and why it matters)">
        <p className="text-gray-400">
          Authentication answers <em>who you are</em>. Authorization answers <em>what you&apos;re allowed to do</em>. A01 issues appear when endpoints trust client-supplied identifiers
          (like <code className="text-accent">userId</code> or <code className="text-accent">accountId</code>) without verifying ownership/permissions on the server.
        </p>
        <p className="text-gray-400">
          Common symptoms include IDOR (Insecure Direct Object Reference), missing role checks, and server-side enforcement that exists in some routes but not others.
        </p>
      </BlogSection>

      <BlogSection title="Vulnerable example (IDOR)">
        <p className="text-gray-400">
          This endpoint returns an invoice by ID, but it never checks that the invoice belongs to the logged-in user.
        </p>
        <BlogCodeBlock
          language="TypeScript (Express-style)"
          code={`app.get('/api/invoices/:id', async (req, res) => {
  const invoice = await db.invoice.findUnique({ where: { id: req.params.id } })
  return res.json(invoice) // ❌ missing authorization check
})`}
        />
      </BlogSection>

      <BlogSection title="Safer pattern (enforce ownership/roles server-side)">
        <p className="text-gray-400">
          Fetch by <strong>both</strong> the object ID and the authenticated user, or enforce a policy/ACL check before returning data.
        </p>
        <BlogCodeBlock
          language="TypeScript (Express-style)"
          code={`app.get('/api/invoices/:id', async (req, res) => {
  const userId = req.auth.userId

  const invoice = await db.invoice.findFirst({
    where: { id: req.params.id, ownerUserId: userId },
  })

  if (!invoice) return res.status(404).json({ error: 'Not found' })
  return res.json(invoice)
})`}
        />
      </BlogSection>

      <BlogSection title="Practical checklist">
        <p className="text-gray-400">
          Centralize authorization (middleware/policy layer), deny-by-default, and add automated tests for &quot;cannot access other user&apos;s resource&quot; cases. Log authorization failures to
          help detect probing.
        </p>
      </BlogSection>
    </BlogArticleLayout>
  )
}
