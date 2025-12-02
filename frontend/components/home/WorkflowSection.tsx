'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Pencil, 
  Camera, 
  Sparkles, 
  Code, 
  Eye, 
  Copy, 
  Check,
  ArrowRight,
  Play,
  Pause
} from 'lucide-react';

const workflowSteps = [
  {
    id: 1,
    title: 'Input Your Math',
    description: 'Upload an image, draw on canvas, or use your camera to capture handwritten equations',
    icon: Upload,
    color: 'from-red-500 to-orange-500',
    features: ['Image Upload', 'Drawing Canvas', 'Camera Scan'],
    demo: 'upload'
  },
  {
    id: 2,
    title: 'AI Processing',
    description: 'Our multi-model AI system analyzes and recognizes your mathematical content',
    icon: Sparkles,
    color: 'from-orange-500 to-yellow-500',
    features: ['5 AI Models', 'Auto Selection', 'High Accuracy'],
    demo: 'process'
  },
  {
    id: 3,
    title: 'Get LaTeX Code',
    description: 'Receive accurate, formatted LaTeX code ready for your documents',
    icon: Code,
    color: 'from-yellow-500 to-green-500',
    features: ['Clean Output', 'Copy to Clipboard', 'Download'],
    demo: 'output'
  },
  {
    id: 4,
    title: 'Live Preview',
    description: 'Preview rendered math with our built-in LaTeX compiler',
    icon: Eye,
    color: 'from-green-500 to-cyan-500',
    features: ['Real-time Render', 'LaTeX Compiler', 'Export Options'],
    demo: 'preview'
  },
];

const demoContent = {
  upload: {
    title: 'Multiple Input Methods',
    items: [
      { icon: Upload, label: 'Drag & Drop Images', desc: 'PNG, JPG, PDF supported' },
      { icon: Pencil, label: 'Drawing Canvas', desc: 'Write with mouse or stylus' },
      { icon: Camera, label: 'Camera Capture', desc: 'Real-time scanning' },
    ]
  },
  process: {
    title: 'AI Model Pipeline',
    models: ['Gemini', 'GPT-4', 'Groq', 'Mistral', 'DeepSeek'],
  },
  output: {
    latex: '\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}',
    label: 'Quadratic Formula'
  },
  preview: {
    title: 'Live LaTeX Compiler',
    rendered: true
  }
};

export default function WorkflowSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [copied, setCopied] = useState(false);

  // Auto-advance steps with slower transition
  useState(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % workflowSteps.length);
      }, 5000); // Changed from 3000 to 5000 for slower transitions
      return () => clearInterval(interval);
    }
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(demoContent.output.latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="how-it-works" ref={sectionRef} className="relative py-24 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-red-950/20 via-transparent to-orange-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.08),transparent_50%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-full border border-orange-500/20 mb-6"
          >
            <Play className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-semibold text-orange-400">See It In Action</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            <span className="text-white">How </span>
            <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              MathScriber Works
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            From handwritten math to perfect LaTeX in seconds. Experience our seamless workflow.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;
              
              return (
                <motion.div
                  key={step.id}
                  onClick={() => { setActiveStep(index); setIsPlaying(false); }}
                  whileHover={{ x: 8 }}
                  className={`relative cursor-pointer p-5 rounded-2xl border transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-white/10 to-white/5 border-white/20 shadow-lg' 
                      : 'bg-white/5 border-white/10 hover:border-white/15'
                  }`}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className={`absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b ${step.color}`}
                    />
                  )}

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg ${isActive ? 'scale-110' : ''} transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-500">STEP {step.id}</span>
                        {isActive && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="px-2 py-0.5 bg-green-500/20 rounded-full text-xs font-semibold text-green-400"
                          >
                            Active
                          </motion.span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                      <p className="text-sm text-gray-400 mb-3">{step.description}</p>
                      
                      {/* Features */}
                      <div className="flex flex-wrap gap-2">
                        {step.features.map((feature) => (
                          <span key={feature} className="text-xs px-2 py-1 bg-white/5 rounded-lg text-gray-300">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Arrow */}
                    <ArrowRight className={`w-5 h-5 transition-all ${isActive ? 'text-white translate-x-1' : 'text-gray-600'}`} />
                  </div>
                </motion.div>
              );
            })}

            {/* Play/Pause */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span className="text-sm">{isPlaying ? 'Pause' : 'Play'} Animation</span>
              </button>
            </div>
          </motion.div>

          {/* Demo Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-red-600/20 via-orange-600/20 to-yellow-600/20 rounded-3xl blur-2xl" />
            
            <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              {/* Window Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-sm text-gray-400">MathScriber - Live Demo</span>
              </div>

              {/* Demo Content */}
              <div className="p-6 min-h-[400px]">
                <AnimatePresence mode="wait">
                  {activeStep === 0 && (
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <h4 className="text-lg font-bold text-white mb-4">Choose Input Method</h4>
                      {demoContent.upload.items.map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-red-500/30 transition-all cursor-pointer group"
                          >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-white">{item.label}</p>
                              <p className="text-sm text-gray-400">{item.desc}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}

                  {activeStep === 1 && (
                    <motion.div
                      key="process"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <h4 className="text-lg font-bold text-white mb-4">AI Processing Pipeline</h4>
                      <div className="relative">
                        {/* Processing Animation */}
                        <div className="flex items-center justify-center gap-2 mb-8">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <motion.div
                              key={i}
                              animate={{ 
                                scale: [1, 1.2, 1],
                                backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#ef4444']
                              }}
                              transition={{ 
                                duration: 2.5, 
                                repeat: Infinity, 
                                delay: i * 0.3 
                              }}
                              className="w-3 h-3 rounded-full"
                            />
                          ))}
                        </div>
                        
                        {/* Models */}
                        <div className="grid grid-cols-3 gap-3">
                          {demoContent.process.models.map((model, i) => (
                            <motion.div
                              key={model}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.15 }}
                              className="p-3 bg-gradient-to-br from-white/10 to-white/5 rounded-xl text-center border border-white/10"
                            >
                              <p className="text-sm font-semibold text-white">{model}</p>
                              <motion.div
                                animate={{ width: ['0%', '100%'] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="h-1 mt-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeStep === 2 && (
                    <motion.div
                      key="output"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <h4 className="text-lg font-bold text-white mb-4">Generated LaTeX Code</h4>
                      <div className="relative">
                        <div className="bg-zinc-900 rounded-xl p-4 border border-white/10 font-mono text-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-500">// {demoContent.output.label}</span>
                            <button
                              onClick={handleCopy}
                              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                            >
                              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                              {copied ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <motion.code
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-green-400 break-all"
                          >
                            {demoContent.output.latex}
                          </motion.code>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeStep === 3 && (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <h4 className="text-lg font-bold text-white mb-4">Live Preview</h4>
                      <div className="bg-white rounded-xl p-8 text-center">
                        <div className="text-3xl text-black font-serif">
                          x = <span className="inline-block border-b border-black">−b ± √(b² − 4ac)</span>
                          <div className="text-xl mt-1">2a</div>
                        </div>
                      </div>
                      <div className="flex justify-center gap-3 mt-4">
                        <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg text-sm font-semibold">
                          Export PDF
                        </button>
                        <button className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-semibold border border-white/10">
                          Edit Code
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}