'use client'

import { EyeOff } from 'lucide-react'
import BlogArticleLayout, { BlogSection, BlogCodeBlock } from '@/components/BlogArticleLayout'

export default function OwaspA08IntegrityFailures() {
  return (
    <BlogArticleLayout>
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-fuchsia-500 to-purple-500 rounded-sm">
              <EyeOff className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs uppercase tracking-[0.1em] font-sans" style={{ color: 'hsl(0 0% 100% / 0.45)' }}>OWASP Top 10</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide section-heading mb-3 text-white">A08: Software &amp; Data Integrity Failures</h1>
          <p className="text-base font-sans" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
            A08 includes supply-chain and integrity issues: untrusted updates, missing signature verification, unsafe deserialization, and pipelines that accept tampered artifacts.
          </p>
        </header>

        <BlogSection title="What it is (and why it matters)">
          <p className="text-gray-400">
            Systems often assume code and data are trustworthy once they&apos;re &quot;inside&quot; the environment. Integrity failures happen when attackers can swap artifacts (packages, plugins,
            configs) or feed untrusted serialized data that the app treats as authoritative.
          </p>
        </BlogSection>

        <BlogSection title="Vulnerable example (downloading updates without verification)">
          <BlogCodeBlock
            language="Pseudo-code (anti-pattern)"
            code={`// ❌ anti-pattern: download + execute without signature verification
artifact = download("https://updates.example.com/plugin.bin")
install(artifact)
runPlugin(artifact)`}
          />
        </BlogSection>

        <BlogSection title="Safer pattern (verify signatures + pin sources)">
          <BlogCodeBlock
            language="Pseudo-code (safer)"
            code={`artifact = download(allowedUrl)
if (!verifySignature(artifact, trustedPublicKey)) deny()
if (!hashMatches(artifact, expectedSha256)) deny()
install(artifact)`}
          />
        </BlogSection>

        <BlogSection title="Practical checklist">
          <p className="text-gray-400">
            Use signed releases, verify checksums, pin dependency sources, lock CI/CD permissions, and avoid unsafe deserialization of untrusted inputs.
          </p>
        </BlogSection>
    </BlogArticleLayout>
  )
}
