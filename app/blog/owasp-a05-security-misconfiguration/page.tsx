'use client'

import { FileWarning } from 'lucide-react'
import BlogArticleLayout, { BlogSection, BlogCodeBlock } from '@/components/BlogArticleLayout'

export default function OwaspA05SecurityMisconfiguration() {
  return (
    <BlogArticleLayout>
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-sm">
            <FileWarning className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs uppercase tracking-[0.1em] font-sans" style={{ color: 'hsl(0 0% 100% / 0.45)' }}>OWASP Top 10</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide section-heading mb-3 text-white">A05: Security Misconfiguration</h1>
        <p className="text-base font-sans" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
          Security misconfiguration includes unsafe defaults, overly verbose error messages, missing security headers, exposed admin tools, and permissive cloud storage.
        </p>
      </header>

      <BlogSection title="What it is (and why it matters)">
        <p className="text-gray-400">
          Many incidents happen because production environments run with debug settings, sample credentials, or broad network access. The fix is usually configuration and
          operational hardening, not new features.
        </p>
      </BlogSection>

      <BlogSection title="Vulnerable example (debug errors in production)">
        <BlogCodeBlock
          language="Express (anti-pattern)"
          code={`// ❌ anti-pattern: detailed stack traces exposed to users
app.use((err, req, res, next) => {
  res.status(500).send(err.stack)
})`}
        />
      </BlogSection>

      <BlogSection title="Safer pattern (generic errors + structured logging)">
        <BlogCodeBlock
          language="Express (safer)"
          code={`app.use((err, req, res, next) => {
  // ✅ log internally (with request id), return generic message to client
  logger.error({ err, requestId: req.id })
  res.status(500).json({ error: 'Internal Server Error' })
})`}
        />
      </BlogSection>

      <BlogSection title="Practical checklist">
        <p className="text-gray-400">
          Use IaC + review, disable debug, restrict admin endpoints, set security headers, harden CORS, rotate secrets, and continuously scan cloud configs (S3/GCS/IAM).
        </p>
      </BlogSection>
    </BlogArticleLayout>
  )
}
