import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MathScriber AI - Transform Math to LaTeX',
  description: 'Convert handwritten equations, diagrams, and tables to LaTeX with 97%+ accuracy using advanced AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black antialiased">
        {children}
      </body>
    </html>
  )
}
