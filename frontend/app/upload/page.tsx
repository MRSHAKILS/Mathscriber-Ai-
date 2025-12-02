'use client';

import { useState, useRef, DragEvent, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Sparkles,
  Zap,
  Shield,
  Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/home/NavbarNew';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/home/Footer';
import { convertImageToLatex } from '@/lib/api';
import { useAuth } from '@/lib/auth/auth-context';

type FileWithPreview = {
  file: File;
  preview: string;
  id: string;
};

export default function UploadPage() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [task, setTask] = useState('equation');
  const [isProcessing, setIsProcessing] = useState(false);
  const [latexResult, setLatexResult] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(
      file => file.type.startsWith('image/') || file.type === 'application/pdf'
    );

    const filesWithPreview = validFiles.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      id: Math.random().toString(36).substring(7),
    }));

    setFiles(prev => [...prev, ...filesWithPreview]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file && file.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const clearAll = () => {
    files.forEach(f => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    setFiles([]);
  };

  const handleSubmit = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setError('');
    setLatexResult('');

    try {
      // For now, convert only the first file
      const result = await convertImageToLatex(files[0].file);

      if (result.success) {
        setLatexResult(result.latex_code);
      } else {
        setError(result.message || 'Conversion failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during conversion');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyLatex = () => {
    navigator.clipboard.writeText(latexResult);
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen bg-black items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black">
      {user && <Sidebar />}
      <div className="flex-1 flex flex-col">
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-black via-red-950/10 to-black pt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4 px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-full">
              <span className="text-red-400 text-sm font-semibold">LATEX OCR CONVERTER</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Transform </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-red-400">
                Math to LaTeX
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-8">
              Upload handwritten equations, tables, and diagrams to convert them into perfect LaTeX code with 97%+ accuracy using our multi-model AI
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {[
                { icon: Sparkles, text: '11 AI Models', color: 'text-green-400' },
                { icon: Zap, text: '97%+ Accuracy', color: 'text-blue-400' },
                { icon: Clock, text: '2.4s Avg Time', color: 'text-purple-400' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="flex items-center gap-2"
                >
                  <div className={`w-2 h-2 rounded-full ${stat.color.replace('text-', 'bg-')} animate-pulse`} />
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-gray-300">{stat.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {[
              { icon: '∑', title: 'Equations', desc: 'Convert handwritten math to LaTeX', color: 'from-red-600/20 to-orange-600/20' },
              { icon: '⊞', title: 'Tables', desc: 'Transform tables to LaTeX format', color: 'from-orange-600/20 to-yellow-600/20' },
              { icon: '◇', title: 'Diagrams', desc: 'Convert diagrams to TikZ code', color: 'from-yellow-600/20 to-red-600/20' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`bg-gradient-to-br ${feature.color} backdrop-blur-xl border border-red-700/30 rounded-2xl p-6 text-center`}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center text-3xl text-white font-bold shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Upload Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-gray-900 via-red-950/30 to-black border border-red-800/40 rounded-3xl p-8 shadow-2xl backdrop-blur-xl"
          >
            {/* Task Selection */}
            <div className="mb-8">
              <label className="flex items-center gap-3 text-white font-semibold mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600/40 to-orange-600/40 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-orange-300" />
                </div>
                Content Type
              </label>
              <select
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="w-full px-4 py-4 bg-black/50 border-2 border-red-700/30 rounded-xl text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/50 outline-none transition-all"
              >
                <option value="equation">Equation Recognition</option>
                <option value="table">Table Recognition</option>
                <option value="diagram">Diagram to TikZ</option>
                <option value="mixed">Mixed Content</option>
              </select>
              <p className="mt-3 text-sm text-gray-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Choose the type of content you want to convert
              </p>
            </div>

            {/* Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragging
                  ? 'border-red-500 bg-red-500/10 scale-105'
                  : 'border-red-700/30 bg-black/30 hover:border-red-500/50 hover:bg-red-500/5'
              }`}
            >
              <div className="pointer-events-none">
                <motion.div
                  animate={{ y: isDragging ? -10 : 0 }}
                  className="mb-6"
                >
                  <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-2xl">
                    <Upload className="w-12 h-12 text-white" />
                  </div>
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {isDragging ? 'Drop files here!' : 'Drag & Drop Files'}
                </h3>
                <p className="text-gray-400 mb-6">
                  or click to browse • JPG, PNG, PDF supported
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-lg">
                  <ImageIcon className="w-5 h-5" />
                  Choose Files
                </div>
                <p className="text-xs text-gray-500 mt-4">Maximum file size: 10MB per file</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* File Preview */}
            <AnimatePresence>
              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3 text-white font-semibold">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600/40 to-emerald-600/40 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-300" />
                      </div>
                      Selected Files ({files.length})
                    </div>
                    <button
                      onClick={clearAll}
                      className="px-4 py-2 text-red-400 border border-red-700/30 rounded-lg hover:bg-red-600/20 transition-all flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Clear All
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {files.map((file) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative group"
                      >
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-black/50 border border-red-700/30">
                          {file.preview ? (
                            <img src={file.preview} alt={file.file.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="w-12 h-12 text-red-400" />
                            </div>
                          )}
                          <button
                            onClick={() => removeFile(file.id)}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 truncate">{file.file.name}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center"
            >
              <button
                onClick={handleSubmit}
                disabled={files.length === 0 || isProcessing}
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-red-600 to-orange-600 text-white text-lg font-bold rounded-xl hover:from-red-500 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xl hover:shadow-red-500/50 hover:scale-105 active:scale-95"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    Convert {files.length > 0 ? `${files.length} File${files.length > 1 ? 's' : ''}` : ''} to LaTeX
                  </>
                )}
              </button>
              <p className="text-sm text-gray-400 mt-4 flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                Files are processed securely and deleted after conversion
              </p>
            </motion.div>
          </motion.div>

          {/* Feature Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: Zap, title: 'Lightning Fast', desc: 'Average processing time of 2.4 seconds' },
              { icon: Sparkles, title: 'Multi-Model AI', desc: 'Choose from 11 different AI models' },
              { icon: Shield, title: 'Secure & Private', desc: 'Your files are deleted after processing' },
              { icon: CheckCircle2, title: '97%+ Accuracy', desc: 'Industry-leading conversion accuracy' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="p-6 rounded-xl bg-gradient-to-br from-gray-900/50 to-red-950/20 border border-red-800/20 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-red-600/30 to-orange-600/30 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* LaTeX Result Section */}
          {latexResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">LaTeX Output</h2>
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap break-all">
                    {latexResult}
                  </pre>
                </div>
                <button
                  onClick={copyLatex}
                  className="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-lg hover:from-red-500 hover:to-orange-500 transition-all"
                >
                  Copy LaTeX
                </button>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
                <p className="text-red-400">{error}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
      </div>
    </div>
  );
}
