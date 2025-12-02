'use client'

import { useState, useRef } from 'react'
import { Upload, Image as ImageIcon, X } from 'lucide-react'
import { convertImageToLatex } from '@/lib/api'

interface ImageUploaderProps {
  onConversionComplete: (latexCode: string) => void
}

export default function ImageUploader({ onConversionComplete }: ImageUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be under 10MB')
      return
    }

    setSelectedImage(file)
    setError('')

    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      setError('')

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const clearImage = () => {
    setSelectedImage(null)
    setPreviewUrl('')
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleConvert = async () => {
    if (!selectedImage) return

    setLoading(true)
    setError('')

    try {
      const result = await convertImageToLatex(selectedImage)

      if (result.success) {
        onConversionComplete(result.latex_code)
      } else {
        setError(result.message || 'Failed to convert image')
      }
    } catch (err) {
      setError('An error occurred during conversion')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-neutral-100 rounded-3xl p-8 shadow-neu">
      {/* Drop Zone */}
      {!selectedImage ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="border-3 border-dashed border-neutral-300 rounded-2xl p-12 text-center cursor-pointer hover:border-primary-400 transition-colors shadow-neu-inset"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-primary-500 rounded-2xl flex items-center justify-center shadow-neu-sm">
              <Upload className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="text-lg font-semibold text-neutral-800 mb-2">
                Drop your image here or click to browse
              </p>
              <p className="text-sm text-neutral-600">
                Supports JPEG, PNG, GIF, WebP (max 10MB)
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div>
          {/* Image Preview */}
          <div className="relative mb-6">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full max-h-96 mx-auto rounded-xl shadow-neu"
            />
            <button
              onClick={clearImage}
              className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-neu hover:shadow-neu-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* File Info */}
          <div className="mb-6 p-4 bg-neutral-50 rounded-xl flex items-center gap-3">
            <ImageIcon className="w-5 h-5 text-primary-600" />
            <div className="flex-grow">
              <p className="text-sm font-medium text-neutral-800">{selectedImage.name}</p>
              <p className="text-xs text-neutral-600">
                {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          {/* Convert Button */}
          <button
            onClick={handleConvert}
            disabled={loading}
            className="w-full py-4 bg-primary-500 text-white rounded-xl shadow-neu hover:shadow-neu-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
          >
            {loading ? 'Converting...' : 'Convert to LaTeX'}
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-xl">
          {error}
        </div>
      )}
    </div>
  )
}
