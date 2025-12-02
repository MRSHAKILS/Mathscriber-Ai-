import { Github, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-neutral-100 border-t border-neutral-200 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-neutral-600 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> for hackathon
          </div>
          
          <div className="text-neutral-600 text-sm">
            Powered by Gemini AI & Next.js
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
