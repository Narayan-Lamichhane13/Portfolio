'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Terminal as TerminalIcon, Shield } from 'lucide-react'
import Link from 'next/link'

export default function AppSecurityLab() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28">
        {/* Back Button */}
        <Link href="/blog">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blog
          </motion.button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-gray-400 font-medium">Application Security</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Application Security Lab — From Native Exploits to Web Attacks
          </h1>
          <p className="text-lg text-gray-400">
            A deep dive into real-world exploitation techniques, from stack overflows to web vulnerabilities
          </p>
        </motion.div>

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="prose prose-invert max-w-none"
        >
          {/* Goal & Threat Model */}
          <Section title="Goal & Threat Model">
            <p>
              The lab simulates real attack paths against vulnerable programs and web apps. The objective is to escalate control from simple input fields to full shell access and data exfiltration by chaining small, reliable primitives. I focused on:
            </p>
            <ul>
              <li><strong>Native binaries (C/x86)</strong>: stack/heap overflows, DEP/NX bypass (ret2libc/ret2syscall), unsafe unlink on heap.</li>
              <li><strong>Web apps (HTML/JS/SQL)</strong>: SQL Injection, CSRF, and persistent XSS with stealth, spying, and robustness across filters.</li>
            </ul>
          </Section>

          {/* Part A */}
          <Section title="Part A — Native Binary Exploitation (C/x86)">
            <h3 className="text-2xl font-bold text-white mt-8 mb-4">Tools & Setup</h3>
            <p>
              <code className="text-purple-400">gdb</code> (disassembly, breakpoints, memory maps), <code className="text-purple-400">objdump/readelf/strings</code> (gadgets, symbol offsets), <code className="text-purple-400">Python</code> (payload generators with struct.pack), and careful control of ASLR/DEP/PIE to understand constraints.
            </p>

            {/* Stack Overflow */}
            <h3 className="text-2xl font-bold text-white mt-8 mb-4">1) Stack Overflow 101: measure → build → verify</h3>
            <p className="text-gray-300 mb-4">
              <strong>Concept:</strong> Overwrite the saved return address (RET) on the stack by copying more bytes than a local buffer can hold.
            </p>
            
            <h4 className="text-xl font-semibold text-white mt-6 mb-3">Steps</h4>
            
            <div className="mb-6">
              <p className="text-gray-300 mb-2"><strong>Find buffer size & offset</strong></p>
              <p className="text-gray-400 mb-3">In <code className="text-purple-400">vulnerable()</code> you&apos;ll see something like:</p>
              <CodeBlock code="sub $0x64, %esp  → buf = 0x64 = 100 bytes" />
              <p className="text-gray-400 mt-2">Offset to RET = buf size (100) + saved EBP (4) = 104.</p>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 mb-2"><strong>Craft payload</strong></p>
              <CodeBlock code={`Layout = b"A"*100 + b"B"*4 + <new RET>.\nInitially, use a NOP sled + shellcode and point RET into the sled.`} />
            </div>

            <div className="mb-6">
              <p className="text-gray-300 mb-2"><strong>Verify in gdb</strong></p>
              <CodeBlock code={`Break at vulnerable, run with payload, then x/i $eip after crash/stop\nto ensure EIP lands where you expect.`} />
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 my-6">
              <p className="text-sm text-gray-400 mb-2"><strong className="text-white">Why it works:</strong></p>
              <p className="text-gray-400">strcpy/gets/sprintf do no bounds check; exceeding the local buffer overwrites control data.</p>
              <p className="text-sm text-gray-400 mt-3 mb-2"><strong className="text-white">Defenses:</strong></p>
              <p className="text-gray-400">Use -fstack-protector-strong, safe functions (snprintf, strlcpy), PIE+ASLR, W^X.</p>
            </div>

            {/* Safer Copy Bug */}
            <h3 className="text-2xl font-bold text-white mt-8 mb-4">2) &quot;Safer copy&quot; bug + indirect write</h3>
            <p className="text-gray-300 mb-4">
              <strong>Concept:</strong> Even &quot;safer&quot; functions can be dangerous if used incorrectly (e.g., copying <code className="text-purple-400">sizeof(buf) + k</code>). Combine that with an accidental write (<code className="text-purple-400">*p = a</code>) to redirect control indirectly.
            </p>

            <h4 className="text-xl font-semibold text-white mt-6 mb-3">Steps</h4>
            
            <div className="mb-6">
              <p className="text-gray-300 mb-3"><strong>Read the code path:</strong></p>
              <CodeBlock code={`If strncpy(buf, arg, sizeof(buf)+8) writes past the buffer,\nit corrupts adjacent locals (like p/a).`} />
            </div>

            <p className="text-gray-400 mb-3"><strong>Turn it into control:</strong> Arrange values so the later write <code className="text-purple-400">*p = a</code> stores a chosen address into a chosen location (write-what-where).</p>
            <p className="text-gray-400 mb-3"><strong>Target:</strong> Overwrite the saved RET or a function pointer with the address of your sled/shellcode.</p>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 my-6">
              <p className="text-sm text-gray-400"><strong className="text-white">Defenses:</strong> Correct length math, remove unsafe post-copy writes, compiler hardening, and bounds-checked APIs.</p>
            </div>

            {/* File-driven overflow */}
            <h3 className="text-2xl font-bold text-white mt-8 mb-4">3) Beyond Strings: file-driven overflow using alloca(count*4) wrap</h3>
            <p className="text-gray-300 mb-4">
              <strong>Concept:</strong> The program reads a 32-bit count then allocates <code className="text-purple-400">count*4</code> bytes on the stack with <code className="text-purple-400">alloca</code>. If <code className="text-purple-400">count*4</code> overflows, the allocation becomes tiny but the read loop still writes count integers → a deterministic overflow.
            </p>

            <h4 className="text-xl font-semibold text-white mt-6 mb-3">Steps</h4>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-gray-300 mb-2">Choose count to force wrap:</p>
                <CodeBlock code="0x40000001 → count*4 == 4" />
              </div>
              
              <div>
                <p className="text-gray-300 mb-2">Lay out the file:</p>
                <CodeBlock code="[count][NOP sled + shellcode][padding to saved RET][RET overwrite]" />
              </div>

              <div>
                <p className="text-gray-300 mb-2">Run so the reader loop overwrites saved RET with your sled address.</p>
              </div>

              <div>
                <p className="text-gray-300 mb-2">Verify:</p>
                <CodeBlock code={`In gdb, break after allocation, measure buf address and delta to RET,\nthen size the file accordingly.`} />
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 my-6">
              <p className="text-sm text-gray-400"><strong className="text-white">Defenses:</strong> Validate count and multiplication overflow; prefer heap with checks; add canaries.</p>
            </div>

            {/* DEP/NX Bypass */}
            <h3 className="text-2xl font-bold text-white mt-8 mb-4">4) DEP/NX Bypass: ret2libc or ret2syscall</h3>
            <p className="text-gray-300 mb-4">
              <strong>Problem:</strong> With DEP/NX, the stack is non-executable, so injected shellcode won&apos;t run.
            </p>

            <h4 className="text-xl font-semibold text-white mt-6 mb-3">4a) ret2libc (dynamic binaries)</h4>
            <p className="text-gray-300 mb-4">
              <strong>Idea:</strong> Don&apos;t execute stack bytes—return into libc and call existing functions.
            </p>

            <ul className="space-y-3 mb-6 text-gray-400">
              <li>Find offset (e.g., 104).</li>
              <li>
                Addresses needed: <code className="text-purple-400">system</code>, <code className="text-purple-400">exit</code>, and{' '}
                <code className="text-purple-400">&quot;/bin/sh&quot;</code>.
              </li>
              <li>
                If symbols available: <CodeBlock code={'p system, find ... "/bin/sh"'} inline />
              </li>
              <li>If stripped: libc base (from <code className="text-purple-400">info proc mappings</code>) + offsets → absolute addresses.</li>
            </ul>

            <CodeBlock code={'Payload: A*100 + B*4 + system + exit + "/bin/sh"'} />

            <p className="text-gray-400 mt-4">
              <strong>Variation:</strong> Use <code className="text-purple-400">exit@plt</code> from your binary via <code className="text-purple-400">objdump -d | grep @plt</code>.
            </p>

            <h4 className="text-xl font-semibold text-white mt-8 mb-3">4b) ret2syscall (static binaries, no libc)</h4>
            <p className="text-gray-300 mb-4">
              <strong>Idea:</strong> ROP to set registers and trigger <code className="text-purple-400">int 0x80</code> →{' '}
              <code className="text-purple-400">execve(&quot;/bin/sh&quot;,0,0)</code>.
            </p>

            <ul className="space-y-3 mb-6 text-gray-400">
              <li>Find gadgets (pop/pop/ret, int 0x80) with objdump.</li>
              <li>
                Chain sets <code className="text-purple-400">eax=11</code> (execve), <code className="text-purple-400">ebx=addr(&quot;/bin/sh&quot;)</code>,{' '}
                <code className="text-purple-400">ecx=0</code>, <code className="text-purple-400">edx=0</code> → <code className="text-purple-400">int 0x80</code>.
              </li>
            </ul>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 my-6">
              <p className="text-sm text-gray-400"><strong className="text-white">Defenses:</strong> Full ASLR, PIE, CFI, RELRO, and syscall filtering (seccomp).</p>
            </div>

            {/* Heap Unlink */}
            <h3 className="text-2xl font-bold text-white mt-8 mb-4">5) Heap Unlink Exploitation (doubly-linked list)</h3>
            <p className="text-gray-300 mb-4">
              <strong>Concept:</strong> A manual doubly-linked list performs:
            </p>

            <CodeBlock code={`if (node->prev) node->prev->next = node->next;\nif (node->next) node->next->prev = node->prev;`} language="c" />

            <p className="text-gray-400 mt-4 mb-6">
              If you can overflow data to corrupt prev/next, deleting the node becomes a write-what-where.
            </p>

            <h4 className="text-xl font-semibold text-white mt-6 mb-3">Steps</h4>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-gray-300 mb-2"><strong>Layout:</strong></p>
                <CodeBlock code="struct node { prev; next; data[32]; }. Strings go into data via strcpy." language="c" />
              </div>

              <div>
                <p className="text-gray-300 mb-2"><strong>Overflow forward</strong> from node B into node C to set:</p>
                <CodeBlock code="c->prev = TARGET-4, c->next = VALUE" />
              </div>

              <div>
                <p className="text-gray-300 mb-2"><strong>Delete(C)</strong> → writes <code className="text-purple-400">*(TARGET) = VALUE</code> (4-byte arbitrary write).</p>
              </div>

              <div>
                <p className="text-gray-300 mb-2"><strong>Target</strong> a function pointer called at exit (e.g., <code className="text-purple-400">.fini_array/.dtors</code>), set it to a heap trampoline: a short <code className="text-purple-400">jmp +N</code> that lands in your real shellcode stored in A→data.</p>
              </div>

              <div>
                <p className="text-gray-300 mb-2"><strong>Verify:</strong></p>
                <CodeBlock code={`Inspect heap node addresses in gdb (finish after list_insert),\nconfirm pointer overwrite, then observe control at process exit.`} />
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 my-6">
              <p className="text-sm text-gray-400"><strong className="text-white">Defenses:</strong> Safe unlink checks, hardened allocators, RELRO, no raw strcpy into heap structs.</p>
            </div>
          </Section>

          {/* Reliability & Hygiene */}
          <Section title="Reliability & Hygiene">
            <ul className="space-y-3 text-gray-400">
              <li><strong className="text-white">NUL-safe bytes</strong> in argv/file payloads (avoid <code className="text-purple-400">\x00</code> in addresses when passing via argv).</li>
              <li>
                <strong className="text-white">Endianness:</strong> pack addresses little-endian (
                <code className="text-purple-400">&quot;&lt;I&quot;</code>).
              </li>
              <li><strong className="text-white">Repeatability:</strong> control ASLR in the lab (<code className="text-purple-400">set disable-randomization on</code>) while you learn; test with ASLR to understand real-world stability.</li>
              <li><strong className="text-white">Gating:</strong> Always verify where EIP lands (<code className="text-purple-400">x/i $eip</code>), and prove overwrite distance with controlled patterns before dropping full chains.</li>
            </ul>
          </Section>
        </motion.article>
      </div>
    </div>
  )
}

// Section Component
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-white mb-6 border-b border-zinc-800 pb-3">
        {title}
      </h2>
      <div className="text-gray-300 space-y-4">
        {children}
      </div>
    </div>
  )
}

// CodeBlock Component for terminal-style code display
function CodeBlock({ code, language, inline }: { code: string; language?: string; inline?: boolean }) {
  if (inline) {
    return <code className="px-2 py-1 bg-zinc-900 text-purple-400 rounded text-sm font-mono">{code}</code>
  }

  return (
    <div className="my-4 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex items-center gap-2 ml-3">
          <TerminalIcon className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-500 font-mono">{language || 'bash'}</span>
        </div>
      </div>
      {/* Terminal Content */}
      <div className="p-4 font-mono text-sm">
        <pre className="text-green-400 whitespace-pre-wrap">{code}</pre>
      </div>
    </div>
  )
}

