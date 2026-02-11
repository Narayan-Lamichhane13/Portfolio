'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Shield } from 'lucide-react'

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

export default function OwaspA02CryptographicFailures() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-5 h-5" />
          Back to Blog
        </Link>

        <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-gray-400 font-medium">OWASP Top 10</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">A02: Cryptographic Failures</h1>
          <p className="text-lg text-gray-400">
            A02 covers mistakes that expose sensitive data: weak encryption choices, poor key management, missing TLS, or storing secrets improperly.
          </p>
        </motion.header>

        <Section title="What it is (and why it matters)">
          <p className="text-gray-400">
            Even “using encryption” can be unsafe if keys are hardcoded, modes are insecure, IVs are reused, or integrity is not protected. Modern guidance is to use well-vetted
            libraries and authenticated encryption (e.g., AES-GCM) with keys stored outside the codebase.
          </p>
        </Section>

        <Section title="Vulnerable example (hardcoded key + no integrity)">
          <p className="text-gray-400">Hardcoding keys makes them easy to leak. Encrypting without authenticity can allow tampering.</p>
          <CodeBlock
            language="Node.js (anti-pattern)"
            code={`// ❌ anti-pattern: hardcoded key (and simplistic encryption)
const KEY = 'dev-key-please-change'

export function encryptSensitive(data) {
  // placeholder example (do not copy)
  return Buffer.from(KEY + ':' + data).toString('base64')
}`}
          />
        </Section>

        <Section title="Safer pattern (use env-managed keys + authenticated encryption)">
          <p className="text-gray-400">
            Use a KMS or environment-managed secrets, rotate keys, and use authenticated encryption. Here&apos;s a simplified example using AES-256-GCM.
          </p>
          <CodeBlock
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
        </Section>

        <Section title="Practical checklist">
          <p className="text-gray-400">
            Enforce TLS, classify sensitive fields, avoid rolling your own crypto, store secrets in a vault/KMS, and add automated checks to prevent committing keys.
          </p>
        </Section>
      </div>
    </div>
  )
}


