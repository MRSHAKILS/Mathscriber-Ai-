'use client'

import { useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface LatexRendererProps {
  latex: string
  displayMode?: boolean
  className?: string
}

export default function LatexRenderer({ 
  latex, 
  displayMode = true,
  className = '' 
}: LatexRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current && latex) {
      try {
        // Clear previous content
        containerRef.current.innerHTML = ''
        
        // Check if latex contains display math delimiters
        const cleanLatex = latex
          .replace(/^\$\$\s*/, '')
          .replace(/\s*\$\$$/g, '')
          .replace(/^\\\[\s*/, '')
          .replace(/\s*\\\]$/g, '')
          .replace(/^\$\s*/, '')
          .replace(/\s*\$$/g, '')
        
        katex.render(cleanLatex, containerRef.current, {
          displayMode: displayMode,
          throwOnError: false,
          errorColor: '#cc0000',
          trust: true,
          strict: false,
          output: 'html',
          fleqn: false,
          macros: {
            "\\f": "#1f(#2)"
          }
        })
      } catch (error) {
        console.error('KaTeX rendering error:', error)
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="text-red-600">Error rendering LaTeX: ${error}</div>`
        }
      }
    }
  }, [latex, displayMode])

  return (
    <div 
      ref={containerRef} 
      className={`katex-container ${className}`}
      style={{ fontSize: '1.2em', lineHeight: '1.5' }}
    />
  )
}
