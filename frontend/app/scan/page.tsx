'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eraser, Trash2 } from 'lucide-react'
import { convertImageToLatex } from '@/lib/api'

export default function ScanPage() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas background to white
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.lineTo(x, y)
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const handleConvert = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    setLoading(true)
    setError('')

    try {
      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error('Failed to convert canvas to image')
        }

        // Create file from blob
        const file = new File([blob], 'canvas-drawing.png', { type: 'image/png' })

        // Send to API
        const result = await convertImageToLatex(file)

        if (result.success) {
          router.push(`/result?latex=${encodeURIComponent(result.latex_code)}`)
        } else {
          setError(result.message || 'Failed to convert image')
        }
      }, 'image/png')
    } catch (err) {
      setError('An error occurred during conversion')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-800 mb-3">
            Canvas Scanner
          </h1>
          <p className="text-neutral-600">
            Draw your equation or diagram on the canvas below
          </p>
        </div>

        <div className="bg-neutral-100 rounded-3xl p-8 shadow-neu">
          {/* Canvas */}
          <div className="mb-6 flex justify-center">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="border-2 border-neutral-300 rounded-xl cursor-crosshair bg-white shadow-neu-inset"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center mb-4">
            <button
              onClick={clearCanvas}
              className="px-6 py-3 bg-neutral-100 text-neutral-700 rounded-xl shadow-neu hover:shadow-neu-lg transition-all flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Clear Canvas
            </button>
            <button
              onClick={handleConvert}
              disabled={loading}
              className="px-8 py-3 bg-primary-500 text-white rounded-xl shadow-neu hover:shadow-neu-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Converting...' : 'Convert to LaTeX'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-xl">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
