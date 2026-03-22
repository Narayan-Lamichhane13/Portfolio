'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, ExternalLink, FileText } from 'lucide-react'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
const resumeSrc = `${basePath}/resume/Narayan_Lamichhane_PM_Resume_new25.pdf`

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to About
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-gray-400 font-medium">Resume</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Recruiter-ready <span className="gradient-text">Resume</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl">
            View the PDF inline, open it in a new tab, or download it in one click.
          </p>
        </motion.div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 md:p-5 border-b border-zinc-800 bg-gradient-to-r from-purple-600/10 to-blue-600/10">
            <div className="min-w-0">
              <p className="text-white font-semibold truncate">
                Narayan_Lamichhane_PM_Resume_new25.pdf
              </p>
              <p className="text-gray-400 text-sm">Tip: use your browser’s zoom for readability.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={resumeSrc}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 text-gray-200 hover:border-purple-500 hover:bg-purple-500/10 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Open
              </a>
              <a
                href={resumeSrc}
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          </div>

          <div className="bg-black">
            <div className="aspect-[8.5/11] w-full">
              <iframe
                title="Narayan Lamichhane Resume"
                src={`${resumeSrc}#view=FitH`}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          If the embedded PDF viewer doesn’t render in your browser, use the <span className="text-gray-300">Open</span> button.
        </p>
      </div>
    </div>
  )
}
