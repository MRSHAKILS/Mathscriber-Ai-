import Link from 'next/link'
import { FileText } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-black z-50 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white hover:text-primary-400 transition-colors">
            <FileText className="w-6 h-6" />
            <span>Mathscriber AI</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link 
              href="/upload" 
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium"
            >
              Upload
            </Link>
            <Link 
              href="/scan" 
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium"
            >
              Scan
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}