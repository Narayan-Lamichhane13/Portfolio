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

export default function OwaspA04InsecureDesign() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-5 h-5" />
          Back to Blog
        </Link>

        <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
              <Network className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-gray-400 font-medium">OWASP Top 10</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">A04: Insecure Design</h1>
          <p className="text-lg text-gray-400">
            Insecure design isn&apos;t a bug in one line of code—it&apos;s a missing security control in the product design (threat modeling, abuse cases, and safety constraints).
          </p>
        </motion.header>

        <Section title="What it is (and why it matters)">
          <p className="text-gray-400">
            If a feature is designed without security requirements (rate limits, step-up auth, verification flows, authorization boundaries), the implementation will often be “correct”
            but still unsafe. A04 issues are prevented with threat modeling and explicit security invariants.
          </p>
        </Section>

        <Section title="Example: password reset without strong verification (design flaw)">
          <p className="text-gray-400">
            The core issue is the <strong>design</strong>: allowing account reset based only on easily guessable info. Even perfect code can&apos;t save a weak verification model.
          </p>
          <CodeBlock
            language="Pseudo-code (anti-pattern)"
            code={`// ❌ insecure design: weak reset verification
resetPassword(email, newPassword) {
  // sends reset if email exists, no strong proof of control
  if (userExists(email)) setPassword(email, newPassword)
}`}
          />
        </Section>

        <Section title="Safer design pattern (token + expiry + step-up)">
          <p className="text-gray-400">
            Use time-limited, single-use tokens tied to a delivery channel the user controls; consider step-up verification (MFA) for high-risk actions.
          </p>
          <CodeBlock
            language="Pseudo-code (safer pattern)"
            code={`requestReset(email) {
  token = randomToken()
  store(tokenHash, email, expiresIn=15min, singleUse=true)
  emailLink(to=email, url="/reset?token=...")
}

confirmReset(token, newPassword) {
  record = lookupValidToken(token)
  if (!record) deny()
  setPassword(record.email, newPassword)
  invalidateToken(record)
}`}
          />
        </Section>

        <Section title="Practical checklist">
          <p className="text-gray-400">
            Do lightweight threat modeling per feature, define security invariants (“only owner can…”, “high-risk actions require step-up”), and build abuse-case tests alongside unit
            tests.
          </p>
        </Section>
      </div>
    </div>
  )
}


