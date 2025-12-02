'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import LatexResult from '@/components/LatexResult'

function ResultContent() {
  const searchParams = useSearchParams()
  const latexCode = searchParams.get('latex') || ''

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-800 mb-3">
            Conversion Result
          </h1>
          <p className="text-neutral-600">
            Your LaTeX code is ready!
          </p>
        </div>

        <LatexResult latexCode={decodeURIComponent(latexCode)} />
      </div>
    </div>
  )
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-neutral-600">Loading result...</p>
        </div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  )
}
