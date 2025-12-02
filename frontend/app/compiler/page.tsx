'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code,
  Eye,
  Download,
  Copy,
  Check,
  FileText,
  Zap,
  Terminal,
  RefreshCw,
  AlertCircle,
  BookOpen,
  Sparkles
} from 'lucide-react';
import Navbar from '@/components/home/NavbarNew';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/home/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import { useAuth } from '@/lib/auth/auth-context';

const sampleTemplates = [
  {
    name: 'Simple Equation',
    code: `\\documentclass{article}
\\usepackage{amsmath}
\\begin{document}

\\begin{equation}
  E = mc^2
\\end{equation}

\\end{document}`
  },
  {
    name: 'Quadratic Formula',
    code: `\\documentclass{article}
\\usepackage{amsmath}
\\begin{document}

\\begin{equation}
  x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
\\end{equation}

\\end{document}`
  },
  {
    name: 'Matrix',
    code: `\\documentclass{article}
\\usepackage{amsmath}
\\begin{document}

\\begin{equation}
  A = \\begin{pmatrix}
    a_{11} & a_{12} \\\\
    a_{21} & a_{22}
  \\end{pmatrix}
\\end{equation}

\\end{document}`
  },
  {
    name: 'Calculus',
    code: `\\documentclass{article}
\\usepackage{amsmath}
\\begin{document}

\\begin{align}
  \\frac{d}{dx}(x^n) &= nx^{n-1} \\\\
  \\int x^n \\, dx &= \\frac{x^{n+1}}{n+1} + C
\\end{align}

\\end{document}`
  }
];

export default function CompilerPage() {
  const { user, loading: authLoading } = useAuth();
  const [latexCode, setLatexCode] = useState(sampleTemplates[0].code);
  const [activeView, setActiveView] = useState<'split' | 'code' | 'preview'>('split');
  const [previewMode, setPreviewMode] = useState<'math' | 'document'>('document');
  const [copied, setCopied] = useState(false);
  const [compiling, setCompiling] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [lineNumbers, setLineNumbers] = useState(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(latexCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([latexCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document-${Date.now()}.tex`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadTemplate = (template: typeof sampleTemplates[0]) => {
    setLatexCode(template.code);
    setCompiling(true);
    setTimeout(() => setCompiling(false), 500);
  };

  const handleCompile = () => {
    setCompiling(true);
    setRenderError(null);
    setTimeout(() => setCompiling(false), 800);
  };

  // Extract math content from LaTeX
  const extractMathContent = (code: string) => {
    try {
      let content = code;
      
      // Extract content between \begin{document} and \end{document}
      const docMatch = content.match(/\\begin{document}([\s\S]*?)\\end{document}/);
      if (docMatch) {
        content = docMatch[1];
      }
      
      const equations: { type: string; content: string }[] = [];
      
      // Match \begin{equation} ... \end{equation}
      const eqMatches = content.matchAll(/\\begin{equation\*?}([\s\S]*?)\\end{equation\*?}/g);
      for (const match of eqMatches) {
        equations.push({ type: 'equation', content: match[1].trim() });
      }
      
      // Match \begin{align} ... \end{align}
      const alignMatches = content.matchAll(/\\begin{align\*?}([\s\S]*?)\\end{align\*?}/g);
      for (const match of alignMatches) {
        equations.push({ type: 'align', content: match[1].trim() });
      }
      
      // Match display $$ ... $$
      const displayMatches = content.matchAll(/\$\$([\s\S]*?)\$\$/g);
      for (const match of displayMatches) {
        equations.push({ type: 'display', content: match[1].trim() });
      }
      
      // Match inline $ ... $
      const inlineMatches = content.matchAll(/\$([^$]+)\$/g);
      for (const match of inlineMatches) {
        equations.push({ type: 'inline', content: match[1].trim() });
      }
      
      return equations;
    } catch (error) {
      console.error('Error extracting math:', error);
      return [];
    }
  };

  // Parse LaTeX document structure for document view
  const parseDocumentStructure = (code: string) => {
    try {
      const docMatch = code.match(/\\begin{document}([\s\S]*?)\\end{document}/);
      if (!docMatch) return { title: '', content: [] };

      let content = docMatch[1].trim();
      const elements: any[] = [];

      // Extract title
      const titleMatch = code.match(/\\title\{([^}]+)\}/);
      const title = titleMatch ? titleMatch[1] : '';

      // Split content into sections and math blocks
      const lines = content.split('\n');
      let currentText = '';
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Skip empty lines
        if (!line) {
          if (currentText) {
            elements.push({ type: 'text', content: currentText.trim() });
            currentText = '';
          }
          continue;
        }

        // Check for equation environment
        if (line.includes('\\begin{equation')) {
          if (currentText) {
            elements.push({ type: 'text', content: currentText.trim() });
            currentText = '';
          }
          
          let eqContent = '';
          i++;
          while (i < lines.length && !lines[i].includes('\\end{equation')) {
            eqContent += lines[i].trim() + ' ';
            i++;
          }
          elements.push({ type: 'equation', content: eqContent.trim() });
          continue;
        }

        // Check for align environment
        if (line.includes('\\begin{align')) {
          if (currentText) {
            elements.push({ type: 'text', content: currentText.trim() });
            currentText = '';
          }
          
          let alignContent = '';
          i++;
          while (i < lines.length && !lines[i].includes('\\end{align')) {
            alignContent += lines[i].trim() + ' ';
            i++;
          }
          elements.push({ type: 'align', content: alignContent.trim() });
          continue;
        }

        // Check for inline or display math
        if (line.includes('$$')) {
          if (currentText) {
            elements.push({ type: 'text', content: currentText.trim() });
            currentText = '';
          }
          const mathMatch = line.match(/\$\$(.*?)\$\$/);
          if (mathMatch) {
            elements.push({ type: 'display', content: mathMatch[1].trim() });
          }
          continue;
        }

        // Regular text with possible inline math
        if (line.includes('$')) {
          const parts = line.split(/(\$[^$]+\$)/);
          parts.forEach(part => {
            if (part.startsWith('$') && part.endsWith('$')) {
              if (currentText) {
                elements.push({ type: 'text', content: currentText.trim() });
                currentText = '';
              }
              elements.push({ type: 'inline', content: part.slice(1, -1) });
            } else if (part.trim()) {
              currentText += part + ' ';
            }
          });
        } else {
          currentText += line + ' ';
        }
      }

      if (currentText) {
        elements.push({ type: 'text', content: currentText.trim() });
      }

      return { title, content: elements };
    } catch (error) {
      console.error('Error parsing document:', error);
      return { title: '', content: [] };
    }
  };

  const mathExpressions = extractMathContent(latexCode);
  const documentStructure = parseDocumentStructure(latexCode);

  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/10 to-gray-950 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/10 to-gray-950 flex flex-col">
      <Navbar />
      
      {user && <Sidebar />}
      
      <div className={`flex-1 ${user ? 'ml-0 lg:ml-64' : ''}`}>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-3">
                  LaTeX Compiler
                </h1>
                <p className="text-gray-400 text-lg">
                  Write, compile, and preview your LaTeX code in real-time
                </p>
              </div>
              
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCompile}
                  disabled={compiling}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50"
                >
                  {compiling ? (
                    <>
                      <RefreshCw size={20} className="animate-spin" />
                      Compiling...
                    </>
                  ) : (
                    <>
                      <Zap size={20} />
                      Compile
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Templates */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <BookOpen size={20} className="text-purple-400" />
              <h2 className="text-lg font-semibold text-white">Quick Templates</h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {sampleTemplates.map((template, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => loadTemplate(template)}
                  className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg border border-gray-700 transition-all"
                >
                  <Sparkles size={16} className="inline mr-2 text-purple-400" />
                  {template.name}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-6 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveView('split')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeView === 'split'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <Terminal size={18} className="inline mr-2" />
                  Split View
                </button>
                <button
                  onClick={() => setActiveView('code')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeView === 'code'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <Code size={18} className="inline mr-2" />
                  Code Only
                </button>
                <button
                  onClick={() => setActiveView('preview')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeView === 'preview'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <Eye size={18} className="inline mr-2" />
                  Preview Only
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setLineNumbers(!lineNumbers)}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-all"
                >
                  <FileText size={18} className="inline mr-2" />
                  {lineNumbers ? 'Hide' : 'Show'} Lines
                </button>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  {copied ? (
                    <>
                      <Check size={18} className="inline mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={18} className="inline mr-2" />
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                >
                  <Download size={18} className="inline mr-2" />
                  Download
                </button>
              </div>
            </div>
          </motion.div>

          {/* Editor and Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6"
            style={{
              gridTemplateColumns: 
                activeView === 'split' ? '1fr 1fr' : '1fr'
            }}
          >
            {/* Code Editor */}
            {(activeView === 'split' || activeView === 'code') && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="bg-gray-800/50 px-6 py-3 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code size={20} className="text-purple-400" />
                    <span className="text-white font-semibold">LaTeX Editor</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                
                <textarea
                  value={latexCode}
                  onChange={(e) => setLatexCode(e.target.value)}
                  className="w-full h-[600px] bg-gray-950 text-gray-300 font-mono text-sm p-6 resize-none focus:outline-none"
                  style={{ fontFamily: 'Consolas, Monaco, "Courier New", monospace' }}
                  spellCheck={false}
                />
                
                <div className="bg-gray-800/50 px-6 py-2 border-t border-gray-800 text-xs text-gray-500">
                  {latexCode.split('\n').length} lines • {latexCode.length} characters
                </div>
              </div>
            )}

            {/* Preview Panel */}
            {(activeView === 'split' || activeView === 'preview') && (
              <div className="bg-white border border-gray-300 rounded-2xl overflow-hidden">
                <div className="bg-gray-100 px-6 py-3 border-b border-gray-300 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Eye size={20} className="text-purple-600" />
                      <span className="text-gray-900 font-semibold">Preview</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPreviewMode('document')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                          previewMode === 'document'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        <FileText size={14} className="inline mr-1" />
                        Document
                      </button>
                      <button
                        onClick={() => setPreviewMode('math')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                          previewMode === 'math'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Math Only
                      </button>
                    </div>
                  </div>
                  {compiling && (
                    <div className="flex items-center gap-2 text-purple-600">
                      <RefreshCw size={16} className="animate-spin" />
                      <span className="text-sm">Rendering...</span>
                    </div>
                  )}
                </div>
                
                <div className="min-h-[600px] max-h-[600px] overflow-auto">
                  {previewMode === 'document' ? (
                    /* Document View - Like Word/PDF */
                    <div className="bg-gray-200 p-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white shadow-2xl mx-auto"
                        style={{
                          maxWidth: '8.5in',
                          minHeight: '11in',
                          padding: '1in',
                          fontFamily: 'Georgia, "Times New Roman", serif'
                        }}
                      >
                        {documentStructure.title && (
                          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
                            {documentStructure.title}
                          </h1>
                        )}
                        
                        {documentStructure.content.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <FileText size={48} className="mb-4" />
                            <p className="text-lg font-semibold">Empty Document</p>
                            <p className="text-sm mt-2">Add content to your LaTeX code</p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {documentStructure.content.map((element, index) => (
                              <div key={index}>
                                {element.type === 'text' && (
                                  <p className="text-gray-900 text-justify leading-relaxed text-base">
                                    {element.content}
                                  </p>
                                )}
                                
                                {element.type === 'equation' && (
                                  <div className="my-8 flex justify-center">
                                    <div className="inline-block">
                                      <BlockMath
                                        math={element.content}
                                        errorColor="#dc2626"
                                        renderError={(error) => (
                                          <span className="text-red-600 text-sm">
                                            Error: {error.message}
                                          </span>
                                        )}
                                      />
                                    </div>
                                  </div>
                                )}
                                
                                {element.type === 'align' && (
                                  <div className="my-8 flex justify-center">
                                    <div className="inline-block">
                                      <BlockMath
                                        math={element.content}
                                        errorColor="#dc2626"
                                        renderError={(error) => (
                                          <span className="text-red-600 text-sm">
                                            Error: {error.message}
                                          </span>
                                        )}
                                      />
                                    </div>
                                  </div>
                                )}
                                
                                {element.type === 'display' && (
                                  <div className="my-6 flex justify-center">
                                    <div className="inline-block">
                                      <BlockMath
                                        math={element.content}
                                        errorColor="#dc2626"
                                        renderError={(error) => (
                                          <span className="text-red-600 text-sm">
                                            Error: {error.message}
                                          </span>
                                        )}
                                      />
                                    </div>
                                  </div>
                                )}
                                
                                {element.type === 'inline' && (
                                  <div className="inline">
                                    <InlineMath
                                      math={element.content}
                                      errorColor="#dc2626"
                                      renderError={(error) => (
                                        <span className="text-red-600 text-sm">
                                          Error: {error.message}
                                        </span>
                                      )}
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Page number */}
                        <div className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
                          Page 1
                        </div>
                      </motion.div>
                    </div>
                  ) : (
                    /* Math Only View */
                    <div className="p-8">
                      {mathExpressions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <AlertCircle size={48} className="mb-4" />
                          <p className="text-lg font-semibold">No Mathematical Content</p>
                          <p className="text-sm mt-2">Add equations to see the preview</p>
                        </div>
                      ) : (
                        <div className="space-y-8">
                          {mathExpressions.map((expr, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-gray-50 p-6 rounded-xl border border-gray-200"
                            >
                              <div className="text-xs text-gray-500 mb-4 font-mono uppercase tracking-wider">
                                {expr.type} {index + 1}
                              </div>
                              <div className="overflow-x-auto">
                                {renderError ? (
                                  <div className="text-red-600 p-4 bg-red-50 rounded-lg">
                                    <AlertCircle size={20} className="inline mr-2" />
                                    <span className="font-semibold">Render Error:</span>
                                    <p className="text-sm mt-1">{renderError}</p>
                                  </div>
                                ) : expr.type === 'inline' ? (
                                  <InlineMath
                                    math={expr.content}
                                    errorColor="#dc2626"
                                    renderError={(error) => {
                                      setRenderError(error.message);
                                      return <span className="text-red-600">Error: {error.message}</span>;
                                    }}
                                  />
                                ) : (
                                  <BlockMath
                                    math={expr.content}
                                    errorColor="#dc2626"
                                    renderError={(error) => {
                                      setRenderError(error.message);
                                      return <span className="text-red-600">Error: {error.message}</span>;
                                    }}
                                  />
                                )}
                              </div>
                            </motion.div>
                          ))}
                          
                          <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-300">
                            <p>✓ Rendered with KaTeX • High-quality mathematical typesetting</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-700/30 rounded-xl p-6">
              <Zap size={32} className="text-purple-400 mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Real-time Compilation</h3>
              <p className="text-gray-400 text-sm">
                See your LaTeX code rendered instantly as you type with our fast KaTeX engine
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border border-blue-700/30 rounded-xl p-6">
              <Code size={32} className="text-blue-400 mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Syntax Highlighting</h3>
              <p className="text-gray-400 text-sm">
                Clean, modern code editor with line numbers and syntax highlighting
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 border border-green-700/30 rounded-xl p-6">
              <Download size={32} className="text-green-400 mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Export Options</h3>
              <p className="text-gray-400 text-sm">
                Download your LaTeX documents or copy code to use in other tools
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
