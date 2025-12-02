import Link from 'next/link'
import { FileText } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-neutral-100 shadow-neu">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-neutral-800 hover:text-primary-600 transition-colors">
            <FileText className="w-6 h-6" />
            <span>Mathscriber AI</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-neutral-700 hover:text-primary-600 transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link 
              href="/upload" 
              className="px-4 py-2 text-neutral-700 hover:text-primary-600 transition-colors font-medium"
            >
              Upload
            </Link>
            <Link 
              href="/scan" 
              className="px-4 py-2 text-neutral-700 hover:text-primary-600 transition-colors font-medium"
            >
              Scan
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
