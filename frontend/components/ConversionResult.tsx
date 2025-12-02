'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Download,
  Edit3,
  Save,
  X,
  Check,
  FileText,
  Code,
  Eye,
  Share2,
  RefreshCw
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

interface ConversionResultProps {
  latexCode: string;
  conversionId: string;
  detectedContent?: {
    primary: string;
    has_equations: boolean;
    has_tables: boolean;
    has_diagrams: boolean;
  };
  onClose?: () => void;
  onSave?: (newCode: string) => void;
}

export default function ConversionResult({
  latexCode,
  conversionId,
  detectedContent,
  onClose,
  onSave
}: ConversionResultProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState(latexCode);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditedCode(latexCode);
  }, [latexCode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([editedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mathscriber-${conversionId.slice(0, 8)}.tex`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editedCode);
    }
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <FileText className="w-8 h-8" />
                Conversion Complete!
              </h2>
              {detectedContent && (
                <div className="flex gap-2 flex-wrap">
                  {detectedContent.has_equations && (
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      📐 Equations
                    </span>
                  )}
                  {detectedContent.has_tables && (
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      📊 Tables
                    </span>
                  )}
                  {detectedContent.has_diagrams && (
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      🎨 Diagrams
                    </span>
                  )}
                  <span className="px-3 py-1 bg-white/30 rounded-full text-sm font-semibold">
                    Primary: {detectedContent.primary.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'code'
                ? 'bg-gray-800 text-white border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <Code size={18} />
            LaTeX Code
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'preview'
                ? 'bg-gray-800 text-white border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <Eye size={18} />
            Preview
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            {activeTab === 'code' && (
              <motion.div
                key="code"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {isEditing ? (
                  <textarea
                    ref={textareaRef}
                    value={editedCode}
                    onChange={(e) => setEditedCode(e.target.value)}
                    className="w-full h-96 bg-gray-950 text-gray-100 p-4 rounded-lg font-mono text-sm border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none resize-none"
                    spellCheck={false}
                  />
                ) : (
                  <div className="relative rounded-lg overflow-hidden">
                    <SyntaxHighlighter
                      language="latex"
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        borderRadius: '0.5rem',
                        maxHeight: '400px'
                      }}
                      showLineNumbers
                    >
                      {editedCode}
                    </SyntaxHighlighter>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-8 rounded-lg border border-gray-300 overflow-auto"
              >
                <LaTeXPreview code={editedCode} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-800/50 p-6 flex justify-between items-center border-t border-gray-800">
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Save size={18} />
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedCode(latexCode);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  <X size={18} />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Edit3 size={18} />
                Edit Code
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check size={18} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={18} />
                  Copy
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Download size={18} />
              Download
            </button>
          </div>
        </div>

        {/* Save Success Message */}
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute bottom-20 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
            >
              <Check size={20} />
              Changes saved successfully!
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// LaTeX Preview Component
function LaTeXPreview({ code }: { code: string }) {
  const [renderError, setRenderError] = useState<string | null>(null);

  // Extract math content from LaTeX document
  const extractMathContent = (latexCode: string) => {
    try {
      // Remove document class and preamble
      let content = latexCode;
      
      // Extract content between \begin{document} and \end{document}
      const docMatch = content.match(/\\begin{document}([\s\S]*?)\\end{document}/);
      if (docMatch) {
        content = docMatch[1];
      }
      
      // Extract equations
      const equations: string[] = [];
      
      // Match \begin{equation} ... \end{equation}
      const eqMatches = content.matchAll(/\\begin{equation\*?}([\s\S]*?)\\end{equation\*?}/g);
      for (const match of eqMatches) {
        equations.push(match[1].trim());
      }
      
      // Match \begin{align} ... \end{align}
      const alignMatches = content.matchAll(/\\begin{align\*?}([\s\S]*?)\\end{align\*?}/g);
      for (const match of alignMatches) {
        equations.push(match[1].trim());
      }
      
      // Match inline $ ... $
      const inlineMatches = content.matchAll(/\$([^$]+)\$/g);
      for (const match of inlineMatches) {
        equations.push(match[1].trim());
      }
      
      // Match display $$ ... $$
      const displayMatches = content.matchAll(/\$\$([\s\S]*?)\$\$/g);
      for (const match of displayMatches) {
        equations.push(match[1].trim());
      }
      
      // If no structured equations found, try to render the whole content
      if (equations.length === 0) {
        // Remove common LaTeX commands that might cause issues
        content = content
          .replace(/\\documentclass.*?\n/g, '')
          .replace(/\\usepackage.*?\n/g, '')
          .replace(/\\begin{document}/g, '')
          .replace(/\\end{document}/g, '')
          .trim();
        
        if (content) {
          equations.push(content);
        }
      }
      
      return equations;
    } catch (error) {
      console.error('Error extracting math:', error);
      return [];
    }
  };

  const mathExpressions = extractMathContent(code);

  if (mathExpressions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Eye className="mx-auto mb-4" size={48} />
        <p className="text-lg">No mathematical content to preview</p>
        <p className="text-sm mt-2">Make sure your LaTeX contains equations or math expressions</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {mathExpressions.map((expr, index) => (
        <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="text-xs text-gray-500 mb-3 font-mono">Expression {index + 1}</div>
          <div className="overflow-x-auto">
            {renderError ? (
              <div className="text-red-600 p-4 bg-red-50 rounded">
                <p className="font-semibold">Render Error:</p>
                <p className="text-sm mt-1">{renderError}</p>
              </div>
            ) : (
              <BlockMath 
                math={expr} 
                errorColor="#dc2626"
                renderError={(error) => {
                  setRenderError(error.message);
                  return (
                    <span className="text-red-600">
                      Failed to render: {error.message}
                    </span>
                  );
                }}
              />
            )}
          </div>
        </div>
      ))}
      
      <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-300">
        <p>✓ Rendered with KaTeX - High-quality mathematical typesetting</p>
      </div>
    </div>
  );
}
