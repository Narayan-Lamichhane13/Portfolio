'use client'

import { Fingerprint } from 'lucide-react'
import BlogArticleLayout, { BlogSection, BlogCodeBlock } from '@/components/BlogArticleLayout'

export default function OwaspA07AuthenticationFailures() {
  return (
    <BlogArticleLayout>
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-sm">
            <Fingerprint className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs uppercase tracking-[0.1em] font-sans" style={{ color: 'hsl(0 0% 100% / 0.45)' }}>OWASP Top 10</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide section-heading mb-3 text-white">A07: Identification &amp; Authentication Failures</h1>
        <p className="text-base font-sans" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
          A07 covers weaknesses in login/session flows: poor password handling, missing MFA, weak session tokens, insecure cookies, and broken logout/session invalidation.
        </p>
      </header>

      <BlogSection title="What it is (and why it matters)">
        <p className="text-gray-400">
          Auth is a high-value target. Failures here often lead to account takeover (ATO). Secure systems use strong password hashing, rate limiting, MFA, and safe session handling.
        </p>
      </BlogSection>

      <BlogSection title="Vulnerable example (storing passwords unsafely)">
        <BlogCodeBlock
          language="Anti-pattern"
          code={`// ❌ anti-pattern: storing plaintext (or reversible) passwords
await db.user.create({
  data: { email, password: req.body.password }
})`}
        />
      </BlogSection>

      <BlogSection title="Safer pattern (hashing + rate limiting + secure cookies)">
        <BlogCodeBlock
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
      </BlogSection>

      <BlogSection title="Practical checklist">
        <p className="text-gray-400">
          Add login rate limits, MFA for sensitive actions, short session lifetimes, refresh-token rotation, and server-side session invalidation on logout/password change.
        </p>
      </BlogSection>
    </BlogArticleLayout>
  )
}
