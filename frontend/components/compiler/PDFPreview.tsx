'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader, FileX } from 'lucide-react';

interface PDFPreviewProps {
  pdfUrl: string | null;
  isCompiling: boolean;
  error?: string | null;
}

export default function PDFPreview({ pdfUrl, isCompiling, error }: PDFPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    // Clean up previous blob URL
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
    }

    if (pdfUrl && iframeRef.current) {
      // If it's already a blob URL, use it directly
      if (pdfUrl.startsWith('blob:')) {
        setBlobUrl(pdfUrl);
        iframeRef.current.src = pdfUrl;
      } else {
        // Fetch the PDF and convert to blob URL
        const fullUrl = pdfUrl.startsWith('http') ? pdfUrl : `http://localhost:8000${pdfUrl}`;
        
        fetch(fullUrl)
          .then(response => response.blob())
          .then(blob => {
            const url = URL.createObjectURL(blob);
            setBlobUrl(url);
            if (iframeRef.current) {
              iframeRef.current.src = url + '#toolbar=0';
            }
          })
          .catch(err => {
            console.error('Error loading PDF:', err);
          });
      }
    }

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [pdfUrl]);

  return (
    <div className="flex-1 flex flex-col bg-black/95 backdrop-blur-xl">
      {/* Preview Header */}
      <div className="px-4 py-3 bg-black/50 border-b border-white/10">
        <h3 className="font-semibold text-white">PDF Preview</h3>
      </div>

      {/* Preview Content */}
      <div className="flex-1 flex items-center justify-center p-4 bg-black">
        {isCompiling && (
          <div className="text-center">
            <Loader className="w-12 h-12 text-red-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-300 font-semibold">Compiling LaTeX...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
          </div>
        )}

        {!isCompiling && error && (
          <div className="text-center max-w-md">
            <FileX className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">Compilation Failed</h4>
            <p className="text-sm text-gray-400">
              There was an error compiling your LaTeX document. Check the error message in the editor.
            </p>
          </div>
        )}

        {!isCompiling && !error && !pdfUrl && (
          <div className="text-center">
            <svg
              className="w-20 h-20 text-gray-600 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-300 font-semibold mb-2">No PDF preview available</p>
            <p className="text-sm text-gray-500">
              Click "Compile" to generate a PDF from your LaTeX code
            </p>
          </div>
        )}

        {!isCompiling && !error && pdfUrl && (
          <iframe
            ref={iframeRef}
            className="w-full h-full bg-white rounded-lg shadow-2xl shadow-red-500/10"
            title="PDF Preview"
          />
        )}
      </div>
    </div>
  );
}
