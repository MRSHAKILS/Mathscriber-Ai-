'use client';

import { motion } from 'framer-motion';
import { Loader2, Sparkles, Zap, Brain } from 'lucide-react';

interface ProcessingLoaderProps {
  stage?: 'uploading' | 'detecting' | 'converting' | 'finalizing';
}

export default function ProcessingLoader({ stage = 'converting' }: ProcessingLoaderProps) {
  const stages = {
    uploading: {
      icon: Zap,
      title: 'Uploading Image',
      subtitle: 'Preparing your image for analysis...',
      color: 'text-blue-500'
    },
    detecting: {
      icon: Brain,
      title: 'Detecting Content',
      subtitle: 'AI is analyzing your image...',
      color: 'text-purple-500'
    },
    converting: {
      icon: Sparkles,
      title: 'Converting to LaTeX',
      subtitle: 'Generating beautiful LaTeX code...',
      color: 'text-green-500'
    },
    finalizing: {
      icon: Loader2,
      title: 'Finalizing',
      subtitle: 'Almost done! Preparing your results...',
      color: 'text-yellow-500'
    }
  };

  const currentStage = stages[stage];
  const Icon = currentStage.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
      >
        {/* Animated Icon */}
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: stage === 'converting' ? [0, 360] : 0
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`${currentStage.color}`}
          >
            <Icon size={64} />
          </motion.div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-center text-white mb-2">
          {currentStage.title}
        </h3>

        {/* Subtitle */}
        <p className="text-gray-400 text-center mb-6">
          {currentStage.subtitle}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-800 rounded-full h-2 mb-4 overflow-hidden">
          <motion.div
            className={`h-full ${currentStage.color.replace('text-', 'bg-')}`}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Stage Indicators */}
        <div className="flex justify-between text-xs text-gray-500 mt-4">
          {Object.keys(stages).map((key, index) => (
            <div
              key={key}
              className={`flex flex-col items-center ${
                key === stage ? 'text-white' : 'text-gray-600'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mb-1 ${
                  key === stage
                    ? currentStage.color.replace('text-', 'bg-')
                    : 'bg-gray-700'
                }`}
              />
              <span className="capitalize">{key}</span>
            </div>
          ))}
        </div>

        {/* Fun Loading Messages */}
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-6 text-sm text-gray-500 italic"
        >
          {stage === 'uploading' && "📤 Transmitting pixels..."}
          {stage === 'detecting' && "🔍 Scanning for equations, tables & diagrams..."}
          {stage === 'converting' && "✨ Crafting perfect LaTeX code..."}
          {stage === 'finalizing' && "🎉 Polishing the final result..."}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
