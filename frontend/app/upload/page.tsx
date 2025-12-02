'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader from '@/components/ImageUploader'

export default function UploadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleConversion = async (latexCode: string) => {
    // Navigate to results page with LaTeX code
    router.push(`/result?latex=${encodeURIComponent(latexCode)}`)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-800 mb-3">
            Upload Image
          </h1>
          <p className="text-neutral-600">
            Upload an image containing equations, diagrams, or tables
          </p>
        </div>

        <ImageUploader onConversionComplete={handleConversion} />
      </div>
    </div>
  )
}
