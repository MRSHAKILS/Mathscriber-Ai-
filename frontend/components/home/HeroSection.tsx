'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Zap, Check } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Fixed particle positions to avoid hydration mismatch
const particles = [
  { width: 120, height: 100, top: 10, left: 5, delay: 0, duration: 4 },
  { width: 80, height: 80, top: 25, left: 85, delay: 0.5, duration: 3.5 },
  { width: 100, height: 90, top: 60, left: 15, delay: 1, duration: 5 },
  { width: 70, height: 70, top: 80, left: 70, delay: 1.5, duration: 4.5 },
  { width: 90, height: 85, top: 40, left: 50, delay: 0.3, duration: 3.8 },
  { width: 110, height: 95, top: 15, left: 35, delay: 0.8, duration: 4.2 },
  { width: 85, height: 75, top: 70, left: 90, delay: 1.2, duration: 3.6 },
  { width: 95, height: 105, top: 50, left: 25, delay: 0.6, duration: 4.8 },
  { width: 75, height: 65, top: 35, left: 75, delay: 1.8, duration: 3.2 },
  { width: 105, height: 88, top: 85, left: 45, delay: 0.2, duration: 5.2 },
];

const HeroSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Handwritten Equation',
      before: '∫x² dx',
      after: '\\int x^{2} \\, dx',
      type: 'equation'
    },
    {
      title: 'Table Structure',
      before: 'x | f(x)\n1 | 2\n2 | 4',
      after: '\\begin{tabular}{c|c}\nx & f(x) \\\\\n1 & 2\n\\end{tabular}',
      type: 'table'
    },
    {
      title: 'Diagram',
      before: '⬢',
      after: '\\begin{tikzpicture}\n\\draw (0,0) -- (1,1);\n\\end{tikzpicture}',
      type: 'diagram'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-red-950 to-black">
      {/* Animated Background Pattern - Using fixed positions */}
      <div className="absolute inset-0 opacity-10">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-red-500"
            style={{
              width: particle.width,
              height: particle.height,
              top: `${particle.top}%`,
              left: `${particle.left}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Column */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-white z-10"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-red-500/20 backdrop-blur-sm mb-6 border border-red-500/30"
            >
              <span className="flex h-2 w-2 mr-2">
                <span className="absolute h-2 w-2 rounded-full bg-green-400 opacity-75 animate-ping"></span>
                <span className="relative h-2 w-2 rounded-full bg-green-400"></span>
              </span>
              <span className="text-sm font-medium">AI-Powered LaTeX Conversion</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              From <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Scribble</span> to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">LaTeX</span> in Seconds
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-red-100 mb-8 max-w-xl"
            >
              Transform handwritten math, tables, and diagrams into perfect LaTeX code with 97%+ accuracy using our multi-model AI.
            </motion.p>

            {/* Key Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10"
            >
              {[
                '11 AI Models to Choose From',
                'Handwriting & Diagram Support',
                'Live Camera & Drawing Tools',
                'Free Tier & Academic Pricing'
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center"
                >
                  <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-red-50">{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/upload">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Try Converter Now
                </motion.button>
              </Link>
              <Link href="/#how-it-works">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 backdrop-blur-sm transition duration-300"
                >
                  How It Works
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1.1 }}
              className="mt-12 pt-6 border-t border-red-300/30"
            >
              <p className="text-red-100 text-sm mb-4">Trusted by researchers and students at:</p>
              <div className="flex flex-wrap gap-6 items-center opacity-80">
                {['Stanford', 'MIT', 'Cambridge', 'ETH Zurich', '+500 institutions'].map((inst, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1.2 + i * 0.1 }}
                    className="text-red-50 font-medium"
                  >
                    {inst}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Visual Column - Conversion Demo Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative z-10"
          >
            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                  MathScriber AI
                </span>
              </div>

              {/* Conversion Preview */}
              <div className="mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Before */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      {slides[currentSlide].title}
                    </h3>
                    <div className="bg-gray-900 rounded p-3 h-32 flex items-center justify-center border border-gray-700">
                      <div className="text-center">
                        <div className="text-3xl font-serif text-white whitespace-pre-wrap">
                          {slides[currentSlide].before}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* After */}
                  <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-lg p-4 border border-red-700/50">
                    <h3 className="text-sm font-semibold text-red-300 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      LaTeX Output
                    </h3>
                    <div className="bg-gray-900 rounded p-3 h-32 border border-red-700/50 font-mono text-sm overflow-auto">
                      <code className="text-green-400 whitespace-pre-wrap">
                        {slides[currentSlide].after}
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversion Stats */}
              <div className="mt-6 bg-gradient-to-r from-red-900/40 to-orange-900/40 rounded-lg p-4 border border-red-700/30">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs text-red-300 font-medium">Conversion Accuracy</div>
                    <div className="text-2xl font-bold text-white">97.3%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-red-300 font-medium">Avg. Time</div>
                    <div className="text-2xl font-bold text-white">2.4s</div>
                  </div>
                </div>
                <div className="mt-3 w-full bg-red-950 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '97.3%' }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                  ></motion.div>
                </div>
              </div>

              {/* Slide Indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'w-8 bg-red-500' : 'w-2 bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 1,
              }}
              className="absolute -top-4 -left-4 w-24 h-24 bg-red-500/20 rounded-2xl blur-xl"
            />
            <motion.div
              animate={{
                y: [0, -25, 0],
                rotate: [0, -5, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                delay: 2,
              }}
              className="absolute -bottom-4 -right-4 w-20 h-20 bg-orange-500/20 rounded-2xl blur-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
