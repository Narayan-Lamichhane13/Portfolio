'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Terminal } from 'lucide-react'

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

export default function OwaspA03Injection() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-5 h-5" />
          Back to Blog
        </Link>

        <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-gray-400 font-medium">OWASP Top 10</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">A03: Injection</h1>
          <p className="text-lg text-gray-400">
            Injection happens when untrusted input is interpreted as part of a command or query (SQL, NoSQL, OS commands, LDAP, etc.) because the app builds executable strings
            unsafely.
          </p>
        </motion.header>

        <Section title="What it is (and why it matters)">
          <p className="text-gray-400">
            The core mistake is mixing <strong>data</strong> and <strong>instructions</strong>. If user-controlled input is concatenated into a SQL string (or shell command), the backend
            may execute attacker-controlled semantics. The fix is to use parameterization and safe APIs that separate code from data.
          </p>
        </Section>

        <Section title="Vulnerable example (SQL query concatenation)">
          <CodeBlock
            language="Node.js + SQL (anti-pattern)"
            code={`// ❌ anti-pattern: concatenating input into SQL
const email = req.query.email
const sql = "SELECT id, email FROM users WHERE email = '" + email + "'"
const rows = await db.query(sql)
res.json(rows)`}
          />
          <p className="text-gray-400">
            If <code className="text-purple-400">email</code> contains crafted characters, the database may treat them as part of the SQL grammar.
          </p>
        </Section>

        <Section title="Safer pattern (parameterized queries / prepared statements)">
          <CodeBlock
            language="Node.js + SQL (safe pattern)"
            code={`// ✅ safe: parameterized query
const email = req.query.email
const rows = await db.query(
  "SELECT id, email FROM users WHERE email = ?",
  [email]
)
res.json(rows)`}
          />
        </Section>

        <Section title="Also watch for">
          <p className="text-gray-400">
            Command injection (building shell commands), template injection, and unsafe JSON/NoSQL queries. Apply the same rule: don&apos;t build executable strings from untrusted
            input—use typed/parameterized APIs and allowlists.
          </p>
        </Section>
      </div>
    </div>
  )
}


