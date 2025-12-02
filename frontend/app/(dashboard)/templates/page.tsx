'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FileText,
  Search,
  Star,
  Copy,
  Eye,
  Download,
  TrendingUp,
  BookOpen,
  Zap,
  Sparkles,
  Code,
  Calculator,
  Sigma,
  PieChart,
  Triangle,
  Grid3x3,
} from 'lucide-react';
import Navbar from '@/components/home/NavbarNew';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/home/Footer';

const categories = ['All', 'Algebra', 'Calculus', 'Geometry', 'Statistics', 'Trigonometry', 'Linear Algebra', 'Physics'];

const templates = [
  {
    id: 1,
    title: 'Quadratic Formula',
    description: 'Standard quadratic equation template with solutions',
    category: 'Algebra',
    uses: 1234,
    code: '\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    icon: Calculator,
    color: 'from-blue-500 to-cyan-500',
    difficulty: 'Beginner',
  },
  {
    id: 2,
    title: 'Derivative Rules',
    description: 'Common derivative formulas and chain rule',
    category: 'Calculus',
    uses: 2105,
    code: '\\frac{d}{dx}[f(g(x))] = f\'(g(x)) \\cdot g\'(x)',
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500',
    difficulty: 'Intermediate',
  },
  {
    id: 3,
    title: 'Pythagorean Theorem',
    description: 'Right triangle relationship formula',
    category: 'Geometry',
    uses: 1876,
    code: 'a^2 + b^2 = c^2',
    icon: Triangle,
    color: 'from-green-500 to-emerald-500',
    difficulty: 'Beginner',
  },
  {
    id: 4,
    title: 'Normal Distribution',
    description: 'Gaussian probability density function',
    category: 'Statistics',
    uses: 987,
    code: 'f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{1}{2}(\\frac{x-\\mu}{\\sigma})^2}',
    icon: PieChart,
    color: 'from-orange-500 to-red-500',
    difficulty: 'Advanced',
  },
  {
    id: 5,
    title: 'Trigonometric Identities',
    description: 'Essential sine, cosine, tangent formulas',
    category: 'Trigonometry',
    uses: 1543,
    code: '\\sin^2(\\theta) + \\cos^2(\\theta) = 1',
    icon: Sigma,
    color: 'from-pink-500 to-rose-500',
    difficulty: 'Intermediate',
  },
  {
    id: 6,
    title: 'Matrix Multiplication',
    description: 'Standard matrix product formula',
    category: 'Linear Algebra',
    uses: 756,
    code: '(AB)_{ij} = \\sum_{k=1}^{n} A_{ik}B_{kj}',
    icon: Grid3x3,
    color: 'from-indigo-500 to-purple-500',
    difficulty: 'Intermediate',
  },
  {
    id: 7,
    title: 'Integration by Parts',
    description: 'Product rule for integration',
    category: 'Calculus',
    uses: 1321,
    code: '\\int u\\,dv = uv - \\int v\\,du',
    icon: Zap,
    color: 'from-cyan-500 to-blue-500',
    difficulty: 'Advanced',
  },
  {
    id: 8,
    title: 'Distance Formula',
    description: 'Calculate distance between two points',
    category: 'Geometry',
    uses: 1098,
    code: 'd = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}',
    icon: BookOpen,
    color: 'from-emerald-500 to-teal-500',
    difficulty: 'Beginner',
  },
  {
    id: 9,
    title: 'Binomial Theorem',
    description: 'Expansion of binomial expressions',
    category: 'Algebra',
    uses: 892,
    code: '(x+y)^n = \\sum_{k=0}^{n} \\binom{n}{k}x^{n-k}y^k',
    icon: Calculator,
    color: 'from-violet-500 to-purple-500',
    difficulty: 'Advanced',
  },
];

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (code: string, id: number) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-rose-950 to-slate-950">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 ml-0 lg:ml-64">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl lg:text-4xl font-black text-white mb-2 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                Template Library
              </h1>
              <p className="text-gray-400 text-lg">
                Browse and use professional LaTeX templates for your equations
              </p>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-all"
                />
              </div>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 flex gap-2 flex-wrap"
            >
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-500/30'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </motion.div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template, index) => {
                const Icon = template.icon;
                return (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="relative group"
                  >
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${template.color} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`} />
                    <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:border-white/20 transition-all">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${getDifficultyColor(template.difficulty)}`}>
                            {template.difficulty}
                          </span>
                          <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                            <Star className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-white mb-2">{template.title}</h3>
                      <p className="text-gray-400 text-sm mb-3">{template.description}</p>
                      
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-gradient-to-r ${template.color} bg-opacity-20 text-white`}>
                        {template.category}
                      </span>

                      {/* LaTeX Code Preview */}
                      <div className="bg-black/60 border border-white/10 rounded-xl p-3 mb-4 font-mono text-sm text-gray-300 overflow-x-auto">
                        {template.code}
                      </div>

                      {/* Stats and Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Eye className="w-4 h-4" />
                          <span>{template.uses.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Link href={`/playground?template=${template.id}`}>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold text-sm transition-all flex items-center gap-1"
                            >
                              <Code className="w-4 h-4" />
                              Use
                            </motion.button>
                          </Link>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCopy(template.code, template.id)}
                            className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-1 ${
                              copiedId === template.id
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white'
                            }`}
                          >
                            <Copy className="w-4 h-4" />
                            {copiedId === template.id ? 'Copied!' : 'Copy'}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* No Results */}
            {filteredTemplates.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-30" />
                <h3 className="text-xl font-bold text-white mb-2">No templates found</h3>
                <p className="text-gray-400">Try adjusting your search or filter</p>
              </motion.div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
