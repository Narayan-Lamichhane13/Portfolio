'use client'

import { motion } from 'framer-motion'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-black pt-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Resume</h1>
            <a
              href={`${basePath}/resume.pdf`}
              download
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Download PDF
            </a>
          </div>
          <div className="w-full bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden" style={{ height: 'calc(100vh - 180px)' }}>
            <iframe
              src={`${basePath}/resume.pdf`}
              className="w-full h-full"
              title="Resume"
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
