'use client'

import { Network } from 'lucide-react'
import BlogArticleLayout, { BlogSection, BlogCodeBlock } from '@/components/BlogArticleLayout'

export default function OwaspA04InsecureDesign() {
  return (
    <BlogArticleLayout>
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-sm">
            <Network className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs uppercase tracking-[0.1em] font-sans" style={{ color: 'hsl(0 0% 100% / 0.45)' }}>OWASP Top 10</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide section-heading mb-3 text-white">A04: Insecure Design</h1>
        <p className="text-base font-sans" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
          Insecure design isn&apos;t a bug in one line of code—it&apos;s a missing security control in the product design (threat modeling, abuse cases, and safety constraints).
        </p>
      </header>

      <BlogSection title="What it is (and why it matters)">
        <p className="text-gray-400">
          If a feature is designed without security requirements (rate limits, step-up auth, verification flows, authorization boundaries), the implementation will often be &quot;correct&quot;
          but still unsafe. A04 issues are prevented with threat modeling and explicit security invariants.
        </p>
      </BlogSection>

      <BlogSection title="Example: password reset without strong verification (design flaw)">
        <p className="text-gray-400">
          The core issue is the <strong>design</strong>: allowing account reset based only on easily guessable info. Even perfect code can&apos;t save a weak verification model.
        </p>
        <BlogCodeBlock
          language="Pseudo-code (anti-pattern)"
          code={`// ❌ insecure design: weak reset verification
resetPassword(email, newPassword) {
  // sends reset if email exists, no strong proof of control
  if (userExists(email)) setPassword(email, newPassword)
}`}
        />
      </BlogSection>

      <BlogSection title="Safer design pattern (token + expiry + step-up)">
        <p className="text-gray-400">
          Use time-limited, single-use tokens tied to a delivery channel the user controls; consider step-up verification (MFA) for high-risk actions.
        </p>
        <BlogCodeBlock
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
      </BlogSection>

      <BlogSection title="Practical checklist">
        <p className="text-gray-400">
          Do lightweight threat modeling per feature, define security invariants (&quot;only owner can…&quot;, &quot;high-risk actions require step-up&quot;), and build abuse-case tests alongside unit
          tests.
        </p>
      </BlogSection>
    </BlogArticleLayout>
  )
}
