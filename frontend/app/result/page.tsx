'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import LatexResult from '@/components/LatexResult'
import LatexRenderer from '@/components/LatexRenderer'
import Image from 'next/image'

function ResultContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const latexCode = searchParams.get('latex') || ''
  const imageUrl = searchParams.get('image') || ''
  
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id) {
      // Fetch full conversion details from API
      setLoading(true)
      fetch(`http://localhost:8000/api/history/${id}/`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setResult(data.result)
          }
          setLoading(false)
        })
        .catch(err => {
          console.error('Error fetching result:', err)
          setLoading(false)
        })
    } else {
      // Use query params for immediate display
      setResult({
        latex_code: decodeURIComponent(latexCode),
        image_url: decodeURIComponent(imageUrl)
      })
    }
  }, [id, latexCode, imageUrl])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-neutral-600">Loading result...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-800 mb-3">
            Conversion Result
          </h1>
          <p className="text-neutral-600">
            Your LaTeX code is ready!
          </p>
        </div>

        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Uploaded Image */}
            {result.image_url && (
              <div className="neumorphic p-6 rounded-2xl">
                <h2 className="text-xl font-semibold text-neutral-800 mb-4">
                  Uploaded Image
                </h2>
                <div className="relative w-full h-96 bg-neutral-100 rounded-xl overflow-hidden">
                  <Image
                    src={result.image_url}
                    alt="Uploaded image"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
            )}

            {/* Rendered LaTeX */}
            <div className="neumorphic p-6 rounded-2xl">
              <h2 className="text-xl font-semibold text-neutral-800 mb-4">
                Rendered Output
              </h2>
              <div className="bg-white p-6 rounded-xl min-h-96 flex items-center justify-center overflow-auto">
                <LatexRenderer latex={result.latex_code} />
              </div>
            </div>
          </div>
        )}

        {/* LaTeX Code Result */}
        {result && <LatexResult latexCode={result.latex_code} />}
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
