'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Fingerprint } from 'lucide-react'

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

export default function OwaspA07AuthenticationFailures() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-5 h-5" />
          Back to Blog
        </Link>

        <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Fingerprint className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-gray-400 font-medium">OWASP Top 10</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">A07: Identification &amp; Authentication Failures</h1>
          <p className="text-lg text-gray-400">
            A07 covers weaknesses in login/session flows: poor password handling, missing MFA, weak session tokens, insecure cookies, and broken logout/session invalidation.
          </p>
        </motion.header>

        <Section title="What it is (and why it matters)">
          <p className="text-gray-400">
            Auth is a high-value target. Failures here often lead to account takeover (ATO). Secure systems use strong password hashing, rate limiting, MFA, and safe session handling.
          </p>
        </Section>

        <Section title="Vulnerable example (storing passwords unsafely)">
          <CodeBlock
            language="Anti-pattern"
            code={`// ❌ anti-pattern: storing plaintext (or reversible) passwords
await db.user.create({
  data: { email, password: req.body.password }
})`}
          />
        </Section>

        <Section title="Safer pattern (hashing + rate limiting + secure cookies)">
          <CodeBlock
            language="Node.js (bcrypt + cookie flags)"
            code={`import bcrypt from 'bcrypt'

const hash = await bcrypt.hash(req.body.password, 12)
await db.user.create({ data: { email, passwordHash: hash } })

// ✅ session cookie: HttpOnly + Secure + SameSite
res.cookie('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
})`}
          />
        </Section>

        <Section title="Practical checklist">
          <p className="text-gray-400">
            Add login rate limits, MFA for sensitive actions, short session lifetimes, refresh-token rotation, and server-side session invalidation on logout/password change.
          </p>
        </Section>
      </div>
    </div>
  )
}


