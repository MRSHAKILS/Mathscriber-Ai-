'use client';

import { useEffect, useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Loader } from 'lucide-react';

interface LaTeX2JSPreviewProps {
  content: string;
  isCompiling: boolean;
  error: string | null;
  onPDFGenerated?: (pdfBlob: Blob) => void;
}

export default function LaTeX2JSPreview({ content, isCompiling, error, onPDFGenerated }: LaTeX2JSPreviewProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load LaTeX2JS library from npm package
  useEffect(() => {
    const loadLibrary = async () => {
      try {
        // Import the latex2html5 package
        const latex2html5Module = await import('latex2html5');
        const latex2html5 = latex2html5Module.default || latex2html5Module;
        
        // Store in window for access
        (window as any).latex2html5 = latex2html5;
        
        // Also load the CSS
        if (!document.querySelector('link[href*="latex2html5.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdn.jsdelivr.net/npm/latex2html5@latest/css/latex2html5.css';
          document.head.appendChild(link);
        }
        
        setIsLibraryLoaded(true);
      } catch (err) {
        console.error('Failed to load latex2html5:', err);
        setRenderError('Failed to load LaTeX2JS library. Using fallback rendering.');
        setIsLibraryLoaded(false);
      }
    };

    loadLibrary();
  }, []);

  // Render LaTeX content
  useEffect(() => {
    if (!content || !containerRef.current) return;

    try {
      if (isLibraryLoaded && (window as any).latex2html5) {
        // Use LaTeX2JS if available
        const latex2html5 = (window as any).latex2html5;
        containerRef.current.innerHTML = '';
        
        new latex2html5(content, {
          target: containerRef.current,
          mathjax: true,
        });
      } else {
        // Fallback: basic HTML rendering
        containerRef.current.innerHTML = `<div class="p-8 font-serif text-base leading-relaxed">${preprocessLatex(content)}</div>`;
      }

      // Generate PDF after rendering
      setTimeout(() => {
        if (!isCompiling) {
          generatePDF();
        }
      }, 2000);
    } catch (err: any) {
      console.error('LaTeX rendering error:', err);
      setRenderError(err.message || 'Failed to render LaTeX');
    }
  }, [content, isLibraryLoaded, isCompiling]);

  const preprocessLatex = (latex: string): string => {
    // Extract document body
    const docMatch = latex.match(/\\begin{document}([\s\S]*?)\\end{document}/);
    let body = docMatch ? docMatch[1] : latex;

    // Convert common LaTeX commands to HTML
    body = body
      .replace(/\\documentclass[\s\S]*?\\begin{document}/, '')
      .replace(/\\end{document}/, '')
      .replace(/\\usepackage\{.*?\}/g, '')
      .replace(/\\title\{(.*?)\}/g, '<h1 class="text-3xl font-bold text-center mb-6">$1</h1>')
      .replace(/\\author\{(.*?)\}/g, '<p class="text-center text-gray-600 mb-2">$1</p>')
      .replace(/\\date\{(.*?)\}/g, '<p class="text-center text-gray-500 mb-6">$1</p>')
      .replace(/\\maketitle/g, '')
      .replace(/\\chapter\*?\{(.*?)\}/g, '<h1 class="text-4xl font-bold mt-8 mb-6 border-b-2 pb-2">$1</h1>')
      .replace(/\\section\*?\{(.*?)\}/g, '<h2 class="text-2xl font-bold mt-6 mb-4">$1</h2>')
      .replace(/\\subsection\*?\{(.*?)\}/g, '<h3 class="text-xl font-semibold mt-4 mb-3">$1</h3>')
      .replace(/\\subsubsection\*?\{(.*?)\}/g, '<h4 class="text-lg font-medium mt-3 mb-2">$1</h4>')
      .replace(/\\textbf\{(.*?)\}/g, '<strong>$1</strong>')
      .replace(/\\textit\{(.*?)\}/g, '<em>$1</em>')
      .replace(/\\emph\{(.*?)\}/g, '<em>$1</em>')
      .replace(/\\underline\{(.*?)\}/g, '<u>$1</u>')
      .replace(/\\\\(?!\[)/g, '<br/>')
      .replace(/\\par\b/g, '<br/><br/>')
      .replace(/\\tableofcontents/g, '<div class="border-l-4 border-blue-500 pl-4 my-6 italic">Table of contents</div>')
      .replace(/\\begin\{tikzpicture\}[\s\S]*?\\end\{tikzpicture\}/g, '<div class="border-2 border-amber-400 bg-amber-50 p-4 my-4 rounded text-center">TikZ graphics (requires LaTeX2JS)</div>')
      .replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, (_, items) => {
        const listItems = items.split(/\\item\s+/).filter((i: string) => i.trim()).map((i: string) => `<li class="mb-2">${i.trim()}</li>`).join('');
        return `<ol class="list-decimal list-inside my-4 ml-6">${listItems}</ol>`;
      })
      .replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, (_, items) => {
        const listItems = items.split(/\\item\s+/).filter((i: string) => i.trim()).map((i: string) => `<li class="mb-2">${i.trim()}</li>`).join('');
        return `<ul class="list-disc list-inside my-4 ml-6">${listItems}</ul>`;
      });

    return body;
  };

  const generatePDF = async () => {
    if (!contentRef.current) return;

    setIsGeneratingPDF(true);
    setRenderError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
      });

      if (canvas.width === 0 || canvas.height === 0) {
        console.error('Canvas is empty');
        setIsGeneratingPDF(false);
        return;
      }

      const imgData = canvas.toDataURL('image/png');
      
      if (!imgData || imgData === 'data:,' || !imgData.startsWith('data:image/png')) {
        console.error('Invalid image data');
        setIsGeneratingPDF(false);
        return;
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const pdfBlob = pdf.output('blob');
      const pdfBlobUrl = URL.createObjectURL(pdfBlob);
      
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      
      setPdfUrl(pdfBlobUrl);
      
      if (onPDFGenerated) {
        onPDFGenerated(pdfBlob);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      setRenderError('Failed to generate PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full border-l border-neutral-200">
      <div className="h-12 border-b border-neutral-200 flex items-center justify-between px-4 bg-white">
        <span className="text-sm font-medium text-neutral-600">
          PDF Preview (LaTeX2JS {!isLibraryLoaded && '- Fallback Mode'})
        </span>
        {(isCompiling || isGeneratingPDF) && (
          <span className="text-xs text-primary-500 flex items-center">
            <Loader className="w-4 h-4 animate-spin mr-2" />
            {isGeneratingPDF ? 'Generating PDF...' : 'Rendering...'}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-auto bg-neutral-100">
        {error || renderError ? (
          <div className="p-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600 font-mono whitespace-pre-wrap">
              {error || renderError}
            </div>
          </div>
        ) : (
          <>
            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
              <div
                ref={contentRef}
                className="bg-white p-8"
                style={{ width: '210mm', minHeight: '297mm' }}
              >
                <div ref={containerRef}></div>
              </div>
            </div>

            {pdfUrl ? (
              <div className="h-full">
                <iframe
                  src={pdfUrl}
                  className="w-full h-full"
                  title="PDF Preview"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
                  <p className="text-neutral-600">Generating PDF preview...</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
