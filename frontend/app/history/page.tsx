'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Clock, FileText } from 'lucide-react'

interface ConversionHistory {
  id: number
  image_url: string
  latex_code: string
  created_at: string
}

export default function HistoryPage() {
  const [history, setHistory] = useState<ConversionHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/history/')
      const data = await response.json()
      
      if (data.success) {
        setHistory(data.results)
      } else {
        setError('Failed to load history')
      }
    } catch (err) {
      setError('Error connecting to server')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateLatex = (latex: string, maxLength = 100) => {
    if (latex.length <= maxLength) return latex
    return latex.substring(0, maxLength) + '...'
  }

  const handleViewResult = (item: ConversionHistory) => {
    router.push(`/result?id=${item.id}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-neutral-600">Loading history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-800 mb-3">
            Conversion History
          </h1>
          <p className="text-neutral-600">
            View all your previous conversions
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* History Grid */}
        {history.length === 0 ? (
          <div className="text-center neumorphic p-12 rounded-2xl">
            <FileText className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">
              No History Yet
            </h3>
            <p className="text-neutral-500">
              Start converting images to LaTeX to see them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => handleViewResult(item)}
                className="neumorphic p-4 rounded-2xl cursor-pointer hover:shadow-lg transition-shadow"
              >
                {/* Image Preview */}
                <div className="relative w-full h-48 bg-neutral-100 rounded-xl overflow-hidden mb-4">
                  <Image
                    src={item.image_url}
                    alt={`Conversion ${item.id}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* LaTeX Preview */}
                <div className="bg-neutral-50 p-3 rounded-lg mb-3">
                  <code className="text-xs text-neutral-700 font-mono break-all">
                    {truncateLatex(item.latex_code)}
                  </code>
                </div>

                {/* Metadata */}
                <div className="flex items-center text-sm text-neutral-500">
                  <Clock className="w-4 h-4 mr-2" />
                  {formatDate(item.created_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
