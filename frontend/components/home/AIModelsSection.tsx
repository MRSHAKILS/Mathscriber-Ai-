'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, Zap, Brain, Table2, Calculator, GitBranch, CheckCircle2 } from 'lucide-react';

const aiModels = [
  {
    name: 'Google Gemini',
    logo: '✨',
    gradient: 'from-blue-500 via-purple-500 to-pink-500',
    bgGradient: 'from-blue-500/10 to-purple-500/10',
    description: 'Advanced multimodal AI for complex mathematical recognition',
    capabilities: ['Equations', 'Tables', 'Diagrams'],
    accuracy: '99.2%',
    speed: '< 1.5s',
  },
  {
    name: 'Groq',
    logo: '⚡',
    gradient: 'from-orange-500 via-red-500 to-pink-500',
    bgGradient: 'from-orange-500/10 to-red-500/10',
    description: 'Ultra-fast inference for real-time LaTeX conversion',
    capabilities: ['Equations', 'Quick Convert'],
    accuracy: '97.8%',
    speed: '< 0.5s',
  },
  {
    name: 'Mistral AI',
    logo: '🌀',
    gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
    bgGradient: 'from-cyan-500/10 to-blue-500/10',
    description: 'European AI excellence for precise mathematical parsing',
    capabilities: ['Equations', 'Tables'],
    accuracy: '98.1%',
    speed: '< 1.2s',
  },
  {
    name: 'OpenAI GPT-4',
    logo: '🧠',
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    bgGradient: 'from-green-500/10 to-emerald-500/10',
    description: 'Industry-leading AI for comprehensive math understanding',
    capabilities: ['Equations', 'Tables', 'Diagrams', 'Proofs'],
    accuracy: '99.5%',
    speed: '< 2s',
  },
  {
    name: 'DeepSeek',
    logo: '🔍',
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    bgGradient: 'from-violet-500/10 to-purple-500/10',
    description: 'Deep learning specialist for intricate mathematical notation',
    capabilities: ['Equations', 'Complex Notation'],
    accuracy: '98.4%',
    speed: '< 1.8s',
  },
];

const conversionTypes = [
  { icon: Calculator, name: 'Equations', color: 'text-red-400' },
  { icon: Table2, name: 'Tables', color: 'text-orange-400' },
  { icon: GitBranch, name: 'Diagrams', color: 'text-yellow-400' },
];

export default function AIModelsSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="models" ref={sectionRef} className="relative py-24 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full border border-red-500/20 mb-6"
          >
            <Brain className="w-4 h-4 text-red-400" />
            <span className="text-sm font-semibold text-red-400">AI-Powered Conversion</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            <span className="text-white">Powered by </span>
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Leading AI Models
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We leverage multiple state-of-the-art AI models to ensure the highest accuracy 
            in converting your handwritten math to LaTeX code.
          </p>
        </motion.div>

        {/* Conversion Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {conversionTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all"
              >
                <Icon className={`w-5 h-5 ${type.color}`} />
                <span className="text-white font-medium">{type.name}</span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* AI Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiModels.map((model, index) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              {/* Glow Effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${model.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-all duration-500`} />
              
              {/* Card */}
              <div className={`relative h-full bg-gradient-to-br ${model.bgGradient} bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${model.gradient} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {model.logo}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{model.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Zap className="w-3 h-3 text-yellow-400" />
                        <span>{model.speed}</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 bg-green-500/20 rounded-full">
                    <span className="text-xs font-semibold text-green-400">{model.accuracy}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">{model.description}</p>

                {/* Capabilities */}
                <div className="flex flex-wrap gap-2">
                  {model.capabilities.map((cap) => (
                    <div key={cap} className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-gray-300">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 mb-6">
            Our intelligent system automatically selects the best model for your content
          </p>
          <motion.a
            href="/upload"
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(239,68,68,0.4)' }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all"
          >
            <Sparkles className="w-5 h-5" />
            Try All Models Free
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
