'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code,
  Eye,
  Copy,
  Check,
  Download,
  Sparkles,
  Calculator,
  Wand2,
  BookOpen,
  Zap,
  ChevronRight,
  Terminal
} from 'lucide-react';
import Navbar from '@/components/home/NavbarNew';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/home/Footer';
import { useAuth } from '@/lib/auth/auth-context';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

const quickSymbols = [
  { label: 'Fraction', latex: '\\frac{a}{b}' },
  { label: 'Square Root', latex: '\\sqrt{x}' },
  { label: 'Power', latex: 'x^{n}' },
  { label: 'Subscript', latex: 'x_{n}' },
  { label: 'Integral', latex: '\\int_{a}^{b} f(x) \\, dx' },
  { label: 'Sum', latex: '\\sum_{i=1}^{n} i' },
  { label: 'Product', latex: '\\prod_{i=1}^{n} i' },
  { label: 'Limit', latex: '\\lim_{x \\to \\infty} f(x)' },
  { label: 'Matrix', latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
  { label: 'Greek α', latex: '\\alpha' },
  { label: 'Greek β', latex: '\\beta' },
  { label: 'Greek θ', latex: '\\theta' },
];

const exampleEquations = [
  {
    name: 'Quadratic Formula',
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}',
    description: 'Solve ax² + bx + c = 0'
  },
  {
    name: 'Pythagorean Theorem',
    latex: 'a^2 + b^2 = c^2',
    description: 'Right triangle relation'
  },
  {
    name: "Euler's Identity",
    latex: 'e^{i\\pi} + 1 = 0',
    description: 'Most beautiful equation'
  },
  {
    name: 'Derivative',
    latex: '\\frac{d}{dx}(x^n) = nx^{n-1}',
    description: 'Power rule'
  },
  {
    name: 'Area of Circle',
    latex: 'A = \\pi r^2',
    description: 'Circle area formula'
  },
];

export default function PlaygroundPage() {
  const { user, loading: authLoading } = useAuth();
  const [latex, setLatex] = useState('\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}');
  const [copied, setCopied] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([latex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `equation-${Date.now()}.tex`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const insertSymbol = (symbol: string) => {
    setLatex(prev => prev + ' ' + symbol);
  };

  const loadExample = (example: string) => {
    setLatex(example);
    setRenderError(null);
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-blue-950/10 to-gray-950 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950/10 to-gray-950 flex flex-col">
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent mb-3">
                  LaTeX Playground
                </h1>
                <p className="text-gray-400 text-lg">
                  Experiment with LaTeX math equations in real-time
                </p>
              </div>
              
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                >
                  {copied ? (
                    <>
                      <Check size={20} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={20} />
                      Copy
                    </>
                  )}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all"
                >
                  <Download size={20} />
                  Download
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Example Equations */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <Sparkles size={20} className="text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Quick Examples</h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {exampleEquations.map((example, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => loadExample(example.latex)}
                  className="px-4 py-3 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 hover:from-blue-800/60 hover:to-cyan-800/60 text-gray-200 rounded-xl border border-blue-700/30 transition-all backdrop-blur-sm"
                  title={example.description}
                >
                  <div className="flex items-center gap-2">
                    <Wand2 size={16} className="text-blue-400" />
                    <span className="font-medium">{example.name}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{example.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Main Editor and Preview Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
          >
            {/* Editor Panel */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm">
              <div className="bg-gray-800/50 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code size={20} className="text-blue-400" />
                  <span className="text-white font-semibold">LaTeX Editor</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              
              <textarea
                value={latex}
                onChange={(e) => {
                  setLatex(e.target.value);
                  setRenderError(null);
                }}
                className="w-full h-[400px] bg-gray-950 text-gray-300 font-mono text-base p-6 resize-none focus:outline-none border-0"
                style={{ fontFamily: 'Consolas, Monaco, "Courier New", monospace' }}
                placeholder="Enter your LaTeX equation here..."
                spellCheck={false}
              />
              
              <div className="bg-gray-800/50 px-6 py-2 border-t border-gray-700 text-xs text-gray-500 flex items-center justify-between">
                <span>{latex.length} characters</span>
                <div className="flex items-center gap-2">
                  <Terminal size={14} />
                  <span>LaTeX Mode</span>
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="bg-white border border-gray-300 rounded-2xl overflow-hidden">
              <div className="bg-gray-100 px-6 py-4 border-b border-gray-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye size={20} className="text-blue-600" />
                  <span className="text-gray-900 font-semibold">Live Preview</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Zap size={16} className="text-blue-600" />
                  <span>Real-time</span>
                </div>
              </div>
              
              <div className="p-8 min-h-[400px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
                {renderError ? (
                  <div className="text-red-600 p-6 bg-red-50 rounded-lg border border-red-200">
                    <p className="font-semibold mb-2">Render Error:</p>
                    <p className="text-sm">{renderError}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <BlockMath
                      math={latex}
                      errorColor="#dc2626"
                      renderError={(error) => {
                        setRenderError(error.message);
                        return <span className="text-red-600">Error: {error.message}</span>;
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="bg-gray-100 px-6 py-3 border-t border-gray-300 text-xs text-gray-600">
                ✓ Rendered with KaTeX • High-quality mathematical typesetting
              </div>
            </div>
          </motion.div>

          {/* Symbol Palette */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <Calculator size={20} className="text-cyan-400" />
                <h2 className="text-lg font-semibold text-white">Quick Insert Symbols</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {quickSymbols.map((symbol, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => insertSymbol(symbol.latex)}
                    className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl border border-gray-700 transition-all group"
                  >
                    <div className="text-sm font-medium mb-1">{symbol.label}</div>
                    <div className="text-xs font-mono text-gray-500 group-hover:text-gray-400">
                      {symbol.latex.length > 15 ? symbol.latex.slice(0, 15) + '...' : symbol.latex}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border border-blue-700/30 rounded-xl p-6 backdrop-blur-sm">
              <BookOpen size={32} className="text-blue-400 mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Learning Mode</h3>
              <p className="text-gray-400 text-sm">
                Click on any example equation to load it instantly and start experimenting
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-900/20 to-cyan-800/20 border border-cyan-700/30 rounded-xl p-6 backdrop-blur-sm">
              <Sparkles size={32} className="text-cyan-400 mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Live Preview</h3>
              <p className="text-gray-400 text-sm">
                See your LaTeX rendered in real-time as you type with KaTeX rendering
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-900/20 to-teal-800/20 border border-teal-700/30 rounded-xl p-6 backdrop-blur-sm">
              <Wand2 size={32} className="text-teal-400 mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Quick Symbols</h3>
              <p className="text-gray-400 text-sm">
                Insert common mathematical symbols and expressions with one click
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
