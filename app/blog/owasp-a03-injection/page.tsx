'use client'

import { Terminal } from 'lucide-react'
import BlogArticleLayout, { BlogSection, BlogCodeBlock } from '@/components/BlogArticleLayout'

export default function OwaspA03Injection() {
  return (
    <BlogArticleLayout>
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-rose-500 to-orange-500 rounded-sm">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs uppercase tracking-[0.1em] font-sans" style={{ color: 'hsl(0 0% 100% / 0.45)' }}>OWASP Top 10</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide section-heading mb-3 text-white">A03: Injection</h1>
        <p className="text-base font-sans" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
          Injection happens when untrusted input is interpreted as part of a command or query (SQL, NoSQL, OS commands, LDAP, etc.) because the app builds executable strings
          unsafely.
        </p>
      </header>

      <BlogSection title="What it is (and why it matters)">
        <p className="text-gray-400">
          The core mistake is mixing <strong>data</strong> and <strong>instructions</strong>. If user-controlled input is concatenated into a SQL string (or shell command), the backend
          may execute attacker-controlled semantics. The fix is to use parameterization and safe APIs that separate code from data.
        </p>
      </BlogSection>

      <BlogSection title="Vulnerable example (SQL query concatenation)">
        <BlogCodeBlock
          language="Node.js + SQL (anti-pattern)"
          code={`// ❌ anti-pattern: concatenating input into SQL
const email = req.query.email
const sql = "SELECT id, email FROM users WHERE email = '" + email + "'"
const rows = await db.query(sql)
res.json(rows)`}
        />
        <p className="text-gray-400">
          If <code className="text-accent">email</code> contains crafted characters, the database may treat them as part of the SQL grammar.
        </p>
      </BlogSection>

      <BlogSection title="Safer pattern (parameterized queries / prepared statements)">
        <BlogCodeBlock
          language="Node.js + SQL (safe pattern)"
          code={`// ✅ safe: parameterized query
const email = req.query.email
const rows = await db.query(
  "SELECT id, email FROM users WHERE email = ?",
  [email]
)
res.json(rows)`}
        />
      </BlogSection>

      <BlogSection title="Also watch for">
        <p className="text-gray-400">
          Command injection (building shell commands), template injection, and unsafe JSON/NoSQL queries. Apply the same rule: don&apos;t build executable strings from untrusted
          input—use typed/parameterized APIs and allowlists.
        </p>
      </BlogSection>
    </BlogArticleLayout>
  )
}
