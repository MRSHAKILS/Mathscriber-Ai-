'use client';

import { useEffect, useRef } from 'react';
import { Loader, FileX } from 'lucide-react';

interface PDFPreviewProps {
  pdfUrl: string | null;
  isCompiling: boolean;
  error?: string | null;
}

export default function PDFPreview({ pdfUrl, isCompiling, error }: PDFPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (pdfUrl && iframeRef.current) {
      iframeRef.current.src = pdfUrl;
    }
  }, [pdfUrl]);

  return (
    <div className="flex-1 flex flex-col bg-neutral-50">
      {/* Preview Header */}
      <div className="px-4 py-2 bg-white border-b border-neutral-200">
        <h3 className="font-medium text-neutral-800">PDF Preview</h3>
      </div>

      {/* Preview Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        {isCompiling && (
          <div className="text-center">
            <Loader className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
            <p className="text-neutral-600">Compiling LaTeX...</p>
            <p className="text-sm text-neutral-500 mt-2">This may take a few seconds</p>
          </div>
        )}

        {!isCompiling && error && (
          <div className="text-center max-w-md">
            <FileX className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-neutral-800 mb-2">Compilation Failed</h4>
            <p className="text-sm text-neutral-600">
              There was an error compiling your LaTeX document. Check the error message in the editor.
            </p>
          </div>
        )}

        {!isCompiling && !error && !pdfUrl && (
          <div className="text-center">
            <svg
              className="w-16 h-16 text-neutral-400 mx-auto mb-4"
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
            <p className="text-neutral-600 mb-2">No PDF preview available</p>
            <p className="text-sm text-neutral-500">
              Click "Compile" to generate a PDF from your LaTeX code
            </p>
          </div>
        )}

        {!isCompiling && !error && pdfUrl && (
          <iframe
            ref={iframeRef}
            className="w-full h-full bg-white rounded-lg shadow-lg"
            title="PDF Preview"
          />
        )}
      </div>
    </div>
  );
}
