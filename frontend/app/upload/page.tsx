'use client';

import { useState, useRef, DragEvent, ChangeEvent, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
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
  Clock,
  FileUp,
  CloudUpload,
  BarChart3,
  Cpu,
  Globe,
  MousePointerClick,
  ChevronRight
} from 'lucide-react';
import type { Container, Engine } from '@tsparticles/engine';
import Navbar from '@/components/home/NavbarNew';
import Footer from '@/components/home/Footer';

type FileWithPreview = {
  file: File;
  preview: string;
  id: string;
};

const taskOptions = [
  { value: 'equation', label: 'Equation Recognition', icon: '∑', color: 'from-red-500 to-orange-500' },
  { value: 'table', label: 'Table Recognition', icon: '⊞', color: 'from-orange-500 to-amber-500' },
  { value: 'diagram', label: 'Diagram to TikZ', icon: '◇', color: 'from-amber-500 to-red-500' },
  { value: 'mixed', label: 'Mixed Content', icon: '⎔', color: 'from-purple-500 to-pink-500' },
];

export default function UploadPage() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [task, setTask] = useState('equation');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    console.log('Particles loaded', container);
  }, []);

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
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      alert('Files processed! (This is a demo)');
    }, 3000);
  };

  return (
    <>
      {/* Particle Background */}
      <div className="fixed inset-0 -z-10">
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={{
            background: {
              color: {
                value: "#000000",
              },
            },
            fpsLimit: 120,
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
              },
              modes: {
                repulse: {
                  distance: 100,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: ["#ff0000", "#ff6b00", "#ffa500"],
              },
              links: {
                color: "#ff0000",
                distance: 150,
                enable: true,
                opacity: 0.1,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 1,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                },
                value: 80,
              },
              opacity: {
                value: 0.1,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 3 },
              },
            },
            detectRetina: true,
          }}
        />
      </div>

      {/* Animated Gradient Overlays */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-orange-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-1/4 w-1/3 h-1/3 bg-purple-600/5 rounded-full blur-[80px] animate-pulse delay-500" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      </div>

      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-black via-black to-black pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-gradient-to-r from-red-600/20 to-orange-600/20 backdrop-blur-sm border border-red-500/30 rounded-full"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-300 text-sm font-medium tracking-wider">ADVANCED LATEX CONVERSION</span>
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight">
              <span className="text-white">Professional </span>
              <span className="relative">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-red-400 animate-gradient">
                  LaTeX Conversion
                </span>
                <span className="absolute inset-0 blur-xl opacity-60 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-red-400">
                  LaTeX Conversion
                </span>
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Transform handwritten equations, academic papers, and technical documents into flawless LaTeX code with our enterprise-grade AI platform
            </p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {[
                { value: '97.3%', label: 'Accuracy Rate', color: 'from-emerald-500 to-green-500' },
                { value: '2.4s', label: 'Avg Processing', color: 'from-blue-500 to-cyan-500' },
                { value: '11', label: 'AI Models', color: 'from-purple-500 to-pink-500' },
                { value: '500+', label: 'Institutions', color: 'from-orange-500 to-red-500' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="relative group"
                >
                  <div className="relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity rounded-xl`} />
                    <div className="relative">
                      <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Left Panel - Features */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1 space-y-6"
            >
              {[
                { 
                  icon: Cpu, 
                  title: 'Multi-Model AI Engine', 
                  description: '11 specialized AI models for different content types',
                  gradient: 'from-red-500/20 to-orange-500/20'
                },
                { 
                  icon: BarChart3, 
                  title: 'Real-time Analytics', 
                  description: 'Monitor conversion accuracy and processing metrics',
                  gradient: 'from-blue-500/20 to-cyan-500/20'
                },
                { 
                  icon: Shield, 
                  title: 'Enterprise Security', 
                  description: 'End-to-end encryption and automatic file deletion',
                  gradient: 'from-green-500/20 to-emerald-500/20'
                },
                { 
                  icon: Globe, 
                  title: 'Global Infrastructure', 
                  description: 'Low-latency processing across 12 regions',
                  gradient: 'from-purple-500/20 to-pink-500/20'
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 10 }}
                  className={`p-5 rounded-2xl bg-gradient-to-br ${feature.gradient} backdrop-blur-sm border border-white/5`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-black/40">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Center Panel - Upload Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="relative">
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute -top-6 -right-6 w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-2xl"
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>

                <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
                  {/* Task Selection */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 text-white font-semibold mb-4">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-red-600/40 to-orange-600/40">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-lg">Content Type</div>
                        <div className="text-sm text-gray-400">Select what you want to convert</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {taskOptions.map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setTask(option.value)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            task === option.value
                              ? `border-red-500 bg-gradient-to-br ${option.color} bg-opacity-20`
                              : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                          }`}
                        >
                          <div className="text-2xl font-bold mb-2">{option.icon}</div>
                          <div className="text-sm text-white font-medium">{option.label}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Upload Area */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative mb-8 border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                      isDragging
                        ? 'border-red-500 bg-red-500/10 scale-[1.02]'
                        : 'border-gray-800 bg-gray-900/50 hover:border-red-500/50 hover:bg-red-500/5'
                    }`}
                  >
                    <div className="pointer-events-none">
                      <motion.div
                        animate={{ y: isDragging ? [0, -5, 0] : 0 }}
                        transition={{ repeat: isDragging ? Infinity : 0, duration: 0.5 }}
                        className="mb-8"
                      >
                        <div className="relative w-32 h-32 mx-auto">
                          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur-xl opacity-50" />
                          <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-2xl">
                            {isDragging ? (
                              <CloudUpload className="w-12 h-12 text-white" />
                            ) : (
                              <FileUp className="w-12 h-12 text-white" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                      
                      <h3 className="text-2xl font-bold text-white mb-4">
                        {isDragging ? 'Release to Upload' : 'Drag & Drop Files Here'}
                      </h3>
                      
                      <p className="text-gray-400 mb-8 text-lg">
                        Supports JPG, PNG, PDF • Max 20MB per file
                      </p>
                      
                      <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-xl text-white font-semibold"
                    >
                      <MousePointerClick className="w-5 h-5" />
                      Browse Files
                    </motion.div>
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
                        className="mb-8"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-green-600/40 to-emerald-600/40">
                              <CheckCircle2 className="w-5 h-5 text-green-300" />
                            </div>
                            <div>
                              <div className="text-white font-semibold">Selected Files ({files.length})</div>
                              <div className="text-sm text-gray-400">Ready for conversion</div>
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <button
                              onClick={clearAll}
                              className="px-4 py-2 text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800 transition-all flex items-center gap-2"
                            >
                              <X className="w-4 h-4" />
                              Clear All
                            </button>
                            
                            <button
                              onClick={handleSubmit}
                              disabled={isProcessing}
                              className="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-500 hover:to-orange-500 disabled:opacity-50 transition-all flex items-center gap-2"
                            >
                              {isProcessing ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Processing
                                </>
                              ) : (
                                <>
                                  Convert All
                                  <ChevronRight className="w-4 h-4" />
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {files.map((file, index) => (
                            <motion.div
                              key={file.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="relative group"
                            >
                              <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-gray-800 group-hover:border-red-500/50 transition-colors">
                                {file.preview ? (
                                  <img 
                                    src={file.preview} 
                                    alt={file.file.name} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <FileText className="w-12 h-12 text-red-400" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <button
                                  onClick={() => removeFile(file.id)}
                                  className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-500 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="mt-2 px-1">
                                <div className="text-xs text-gray-300 truncate font-medium">{file.file.name}</div>
                                <div className="text-xs text-gray-500">
                                  {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  {files.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center pt-6 border-t border-gray-800"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSubmit}
                        disabled={isProcessing}
                        className="relative group w-full max-w-md mx-auto"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity" />
                        <div className="relative px-12 py-6 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xl font-bold rounded-2xl hover:shadow-2xl hover:shadow-red-500/30 transition-all flex items-center justify-center gap-4">
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-6 h-6 animate-spin" />
                              Processing {files.length} File{files.length > 1 ? 's' : ''}...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-6 h-6" />
                              Convert to LaTeX
                              <Zap className="w-5 h-5" />
                            </>
                          )}
                        </div>
                      </motion.button>
                      
                      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Shield className="w-4 h-4 text-green-400" />
                          Secure Processing
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="w-4 h-4 text-blue-400" />
                          ~2.4s average
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Supported Institutions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-20 pt-12 border-t border-gray-800"
          >
            <div className="text-center mb-8">
              <div className="text-sm text-gray-400 font-medium mb-2">TRUSTED BY RESEARCHERS AT</div>
              <div className="text-2xl font-bold text-white">Leading Academic Institutions</div>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
              {['Stanford', 'MIT', 'Cambridge', 'ETH Zurich', 'Harvard', 'Oxford'].map((uni, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-gray-400 text-lg font-medium px-4 py-2 border border-gray-800 rounded-lg backdrop-blur-sm"
                >
                  {uni}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 6s ease infinite;
        }
      `}</style>
    </>
  );
}