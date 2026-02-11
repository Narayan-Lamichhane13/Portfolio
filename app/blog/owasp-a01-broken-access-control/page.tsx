'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock } from 'lucide-react'

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

export default function OwaspA01BrokenAccessControl() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Blog
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-gray-400 font-medium">OWASP Top 10</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">A01: Broken Access Control</h1>
          <p className="text-lg text-gray-400">
            Broken access control happens when an app fails to enforce authorization rules consistently, letting users access data or actions they shouldn&apos;t.
          </p>
        </motion.header>

        <Section title="What it is (and why it matters)">
          <p className="text-gray-400">
            Authentication answers <em>who you are</em>. Authorization answers <em>what you&apos;re allowed to do</em>. A01 issues appear when endpoints trust client-supplied identifiers
            (like <code className="text-purple-400">userId</code> or <code className="text-purple-400">accountId</code>) without verifying ownership/permissions on the server.
          </p>
          <p className="text-gray-400">
            Common symptoms include IDOR (Insecure Direct Object Reference), missing role checks, and server-side enforcement that exists in some routes but not others.
          </p>
        </Section>

        <Section title="Vulnerable example (IDOR)">
          <p className="text-gray-400">
            This endpoint returns an invoice by ID, but it never checks that the invoice belongs to the logged-in user.
          </p>
          <CodeBlock
            language="TypeScript (Express-style)"
            code={`app.get('/api/invoices/:id', async (req, res) => {
  const invoice = await db.invoice.findUnique({ where: { id: req.params.id } })
  return res.json(invoice) // ❌ missing authorization check
})`}
          />
        </Section>

        <Section title="Safer pattern (enforce ownership/roles server-side)">
          <p className="text-gray-400">
            Fetch by <strong>both</strong> the object ID and the authenticated user, or enforce a policy/ACL check before returning data.
          </p>
          <CodeBlock
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
        </Section>

        <Section title="Practical checklist">
          <p className="text-gray-400">
            Centralize authorization (middleware/policy layer), deny-by-default, and add automated tests for “cannot access other user&apos;s resource” cases. Log authorization failures to
            help detect probing.
          </p>
        </Section>
      </div>
    </div>
  )
}


