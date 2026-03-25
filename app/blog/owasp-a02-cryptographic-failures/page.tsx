'use client'

import { Shield } from 'lucide-react'
import BlogArticleLayout, { BlogSection, BlogCodeBlock } from '@/components/BlogArticleLayout'

export default function OwaspA02CryptographicFailures() {
  return (
    <BlogArticleLayout>
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-sm">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs uppercase tracking-[0.1em] font-sans" style={{ color: 'hsl(0 0% 100% / 0.45)' }}>OWASP Top 10</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide section-heading mb-3 text-white">A02: Cryptographic Failures</h1>
        <p className="text-base font-sans" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
          A02 covers mistakes that expose sensitive data: weak encryption choices, poor key management, missing TLS, or storing secrets improperly.
        </p>
      </header>

      <BlogSection title="What it is (and why it matters)">
        <p className="text-gray-400">
          Even &quot;using encryption&quot; can be unsafe if keys are hardcoded, modes are insecure, IVs are reused, or integrity is not protected. Modern guidance is to use well-vetted
          libraries and authenticated encryption (e.g., AES-GCM) with keys stored outside the codebase.
        </p>
      </BlogSection>

      <BlogSection title="Vulnerable example (hardcoded key + no integrity)">
        <p className="text-gray-400">Hardcoding keys makes them easy to leak. Encrypting without authenticity can allow tampering.</p>
        <BlogCodeBlock
          language="Node.js (anti-pattern)"
          code={`// ❌ anti-pattern: hardcoded key (and simplistic encryption)
const KEY = 'dev-key-please-change'

export function encryptSensitive(data) {
  // placeholder example (do not copy)
  return Buffer.from(KEY + ':' + data).toString('base64')
}`}
        />
      </BlogSection>

      <BlogSection title="Safer pattern (use env-managed keys + authenticated encryption)">
        <p className="text-gray-400">
          Use a KMS or environment-managed secrets, rotate keys, and use authenticated encryption. Here&apos;s a simplified example using AES-256-GCM.
        </p>
        <BlogCodeBlock
          language="Node.js (crypto)"
          code={`import crypto from 'crypto'

const key = Buffer.from(process.env.DATA_KEY_B64!, 'base64') // 32 bytes

export function encrypt(plaintext: string) {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, ciphertext]).toString('base64')
}`}
        />
      </BlogSection>

      <BlogSection title="Practical checklist">
        <p className="text-gray-400">
          Enforce TLS, classify sensitive fields, avoid rolling your own crypto, store secrets in a vault/KMS, and add automated checks to prevent committing keys.
        </p>
      </BlogSection>
    </BlogArticleLayout>
  )
}
