import Link from 'next/link'
import { Upload, Scan, FileText } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <h1 className="text-5xl md:text-6xl font-bold text-neutral-800 mb-6">
          Mathscriber AI
        </h1>
        <p className="text-xl text-neutral-600 mb-12">
          Convert mathematical equations, diagrams, and tables from images to LaTeX code instantly using AI
        </p>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Upload Card */}
          <Link href="/upload">
            <div className="bg-neutral-100 rounded-3xl p-8 shadow-neu hover:shadow-neu-lg transition-all duration-300 cursor-pointer group">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary-500 rounded-2xl flex items-center justify-center shadow-neu-sm group-hover:scale-110 transition-transform">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-neutral-800 mb-3">
                Upload Image
              </h2>
              <p className="text-neutral-600">
                Upload an image of equations, diagrams, or tables and get LaTeX code
              </p>
            </div>
          </Link>

          {/* Scan Card */}
          <Link href="/scan">
            <div className="bg-neutral-100 rounded-3xl p-8 shadow-neu hover:shadow-neu-lg transition-all duration-300 cursor-pointer group">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary-500 rounded-2xl flex items-center justify-center shadow-neu-sm group-hover:scale-110 transition-transform">
                <Scan className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-neutral-800 mb-3">
                Canvas Scanner
              </h2>
              <p className="text-neutral-600">
                Draw or sketch your equation on a digital canvas
              </p>
            </div>
          </Link>

          {/* LaTeX Editor Card */}
          <Link href="/projects">
            <div className="bg-neutral-100 rounded-3xl p-8 shadow-neu hover:shadow-neu-lg transition-all duration-300 cursor-pointer group">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-2xl flex items-center justify-center shadow-neu-sm group-hover:scale-110 transition-transform">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-neutral-800 mb-3">
                LaTeX Editor
              </h2>
              <p className="text-neutral-600">
                Write, compile, and preview your LaTeX documents with live PDF generation
              </p>
            </div>
          </Link>
        </div>

        {/* Features List */}
        <div className="bg-neutral-100 rounded-3xl p-8 shadow-neu">
          <h3 className="text-2xl font-semibold text-neutral-800 mb-6">
            Key Features
          </h3>
          <div className="grid md:grid-cols-4 gap-6 text-left">
            <div>
              <div className="text-primary-600 font-semibold mb-2">⚡ Fast Conversion</div>
              <p className="text-neutral-600 text-sm">
                Get LaTeX code in seconds using Gemini AI
              </p>
            </div>
            <div>
              <div className="text-primary-600 font-semibold mb-2">📐 Multiple Formats</div>
              <p className="text-neutral-600 text-sm">
                Supports equations, diagrams, and tables
              </p>
            </div>
            <div>
              <div className="text-primary-600 font-semibold mb-2">📋 Easy Copy</div>
              <p className="text-neutral-600 text-sm">
                Copy LaTeX code with a single click
              </p>
            </div>
            <div>
              <div className="text-green-600 font-semibold mb-2">📝 Live Editor</div>
              <p className="text-neutral-600 text-sm">
                Write and compile LaTeX with instant PDF preview
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
