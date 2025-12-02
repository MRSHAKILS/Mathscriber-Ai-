'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Download, FileText, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ResultPageProps {
  isOpen: boolean;
  onClose: () => void;
  result: ConversionResult | null;
  onInsertAtCursor: (latex: string) => void;
}

interface ConversionResult {
  input: string;
  latex: string;
  convertedOutput: string;
  timestamp: string;
}

export default function ResultPage({ isOpen, onClose, result, onInsertAtCursor }: ResultPageProps) {
  const [copied, setCopied] = useState(false);
  const [inserting, setInserting] = useState(false);

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTex = async () => {
    if (!result) return;
    
    const response = await fetch('http://localhost:8000/api/download/tex', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latex: result.latex }),
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.tex';
    a.click();
  };

  const handleDownloadPdf = async () => {
    if (!result) return;
    
    const response = await fetch('http://localhost:8000/api/download/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latex: result.latex }),
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.pdf';
    a.click();
  };

  const handleInsert = async () => {
    if (!result) return;
    setInserting(true);
    await onInsertAtCursor(result.latex);
    setInserting(false);
    onClose();
  };

  if (!result) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] pointer-events-auto"
          />

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl max-h-[90vh] overflow-y-auto mx-4 z-[10000] pointer-events-auto"
          >
            <div className="bg-gradient-to-b from-gray-900/95 to-gray-900/90 backdrop-blur-2xl border border-red-500/20 rounded-2xl shadow-[0_8px_32px_rgba(239,68,68,0.3)] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-red-500/10 sticky top-0 bg-gray-900/95 backdrop-blur-xl z-10">
                <div>
                  <h2 className="text-2xl font-bold text-white">Conversion Result</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(result.timestamp).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-lg bg-red-600/10 hover:bg-red-600/20 flex items-center justify-center transition-colors"
                >
                  <X size={20} className="text-red-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Input Preview */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600/20 to-orange-600/20 border border-red-500/20 flex items-center justify-center">
                      <FileText size={16} className="text-red-400" />
                    </div>
                    Input Image
                  </h3>
                  <div className="rounded-xl overflow-hidden bg-black/50 border border-red-500/10 p-4">
                    <img src={result.input} alt="Input" className="max-w-full h-auto rounded-lg" />
                  </div>
                </div>

                {/* LaTeX Output */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600/20 to-orange-600/20 border border-red-500/20 flex items-center justify-center">
                        <FileText size={16} className="text-red-400" />
                      </div>
                      LaTeX Code
                    </h3>
                    <button
                      onClick={handleCopy}
                      className="px-3 py-1.5 rounded-lg bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600/20 transition-colors flex items-center gap-2 text-sm"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-red-500/10">
                    <SyntaxHighlighter
                      language="latex"
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        padding: '1rem',
                        background: 'rgba(0, 0, 0, 0.5)',
                      }}
                    >
                      {result.latex}
                    </SyntaxHighlighter>
                  </div>
                </div>

                {/* Converted Output */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600/20 to-orange-600/20 border border-red-500/20 flex items-center justify-center">
                      <FileText size={16} className="text-red-400" />
                    </div>
                    Rendered Output
                  </h3>
                  <div className="rounded-xl bg-white p-6 text-center">
                    <div dangerouslySetInnerHTML={{ __html: result.convertedOutput }} />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                  <button
                    onClick={handleCopy}
                    className="px-4 py-3 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-red-500/20 text-white hover:border-red-500/40 transition-all flex items-center justify-center gap-2"
                  >
                    <Copy size={18} />
                    Copy
                  </button>
                  <button
                    onClick={handleDownloadTex}
                    className="px-4 py-3 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-red-500/20 text-white hover:border-red-500/40 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    .tex
                  </button>
                  <button
                    onClick={handleDownloadPdf}
                    className="px-4 py-3 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-red-500/20 text-white hover:border-red-500/40 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    .pdf
                  </button>
                  <button
                    onClick={handleInsert}
                    disabled={inserting}
                    className="relative px-4 py-3 rounded-xl font-semibold text-white overflow-hidden group disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 bg-[length:200%_100%] animate-gradient" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Plus size={18} />
                      {inserting ? 'Inserting...' : 'Insert'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
