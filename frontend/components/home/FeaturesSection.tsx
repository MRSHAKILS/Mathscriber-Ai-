'use client';

import { motion } from 'framer-motion';
import { Upload, Zap, History, Code, Palette, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Upload,
    title: 'Image Upload',
    description: 'Drag and drop or click to upload images containing mathematical equations, diagrams, or tables',
    gradient: 'from-red-500 to-orange-500',
  },
  {
    icon: Zap,
    title: 'AI-Powered',
    description: 'Uses Gemini 2.0 Flash model for accurate and instant conversion with high precision',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Code,
    title: 'LaTeX Output',
    description: 'Get clean, properly formatted LaTeX code ready to use in your documents and papers',
    gradient: 'from-red-600 to-rose-500',
  },
  {
    icon: History,
    title: 'Conversion History',
    description: 'Access all your previous conversions anytime with our comprehensive history feature',
    gradient: 'from-rose-500 to-red-600',
  },
  {
    icon: Palette,
    title: 'LaTeX Editor',
    description: 'Edit and customize your LaTeX code with our built-in editor with live preview',
    gradient: 'from-red-500 to-pink-500',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Track your usage, accuracy rates, and conversion statistics with detailed insights',
    gradient: 'from-pink-500 to-red-500',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(220, 38, 38) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to convert mathematical content to LaTeX efficiently
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 hover:border-red-900/50 transition-all duration-300 overflow-hidden"
              >
                {/* Hover gradient effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`relative inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 relative">
                  {feature.title}
                </h3>
                <p className="text-gray-400 relative">
                  {feature.description}
                </p>

                {/* Corner decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500/10 to-transparent rounded-bl-full" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
