'use client'

import { useState } from 'react'
import { Copy, Check, FileText, Home } from 'lucide-react'
import Link from 'next/link'

interface LatexResultProps {
  latexCode: string
}

export default function LatexResult({ latexCode }: LatexResultProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(latexCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* LaTeX Code Display */}
      <div className="bg-neutral-100 rounded-3xl p-8 shadow-neu">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-neutral-800">LaTeX Code</h2>
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-primary-500 text-white rounded-xl shadow-neu hover:shadow-neu-lg transition-all flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>

        <div className="bg-neutral-50 rounded-xl p-6 shadow-neu-inset">
          <pre className="text-sm text-neutral-800 whitespace-pre-wrap break-words font-mono">
            {latexCode}
          </pre>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Link 
          href="/upload"
          className="px-6 py-3 bg-neutral-100 text-neutral-700 rounded-xl shadow-neu hover:shadow-neu-lg transition-all font-semibold"
        >
          Convert Another Image
        </Link>
        <Link 
          href="/"
          className="px-6 py-3 bg-neutral-100 text-neutral-700 rounded-xl shadow-neu hover:shadow-neu-lg transition-all font-semibold flex items-center gap-2"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </div>

      {/* Usage Note */}
      <div className="bg-blue-50 rounded-2xl p-6 shadow-neu-sm">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">How to use this LaTeX code:</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Copy the code above and paste it into your LaTeX editor</li>
          <li>For inline math, wrap with $ ... $</li>
          <li>For display math, wrap with $$ ... $$</li>
          <li>For documents, use the appropriate LaTeX environment</li>
        </ul>
      </div>
    </div>
  )
}
