import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import MouseTrail from '@/components/MouseTrail'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Your Name - Cybersecurity Professional & Developer',
  description: 'Professional portfolio showcasing cybersecurity research, software development projects, and technical expertise.',
  keywords: ['cybersecurity', 'software development', 'portfolio', 'security researcher', 'developer'],
  authors: [{ name: 'Your Name' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <MouseTrail />
        {children}
      </body>
    </html>
  )
}
