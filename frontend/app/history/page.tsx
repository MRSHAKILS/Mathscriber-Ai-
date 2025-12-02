'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import 'katex/dist/katex.min.css';

interface DetectedContent {
  primary: string;
  has_equations: boolean;
  has_tables: boolean;
  has_diagrams: boolean;
  raw_response?: string;
}

interface ConversionHistoryItem {
  id: string;
  original_filename: string;
  image_url: string;
  latex_code: string;
  task_type: 'equation' | 'table' | 'diagram' | 'auto';
  detected_content?: DetectedContent;
  created_at: string;
}

interface HistoryResponse {
  success: boolean;
  data: ConversionHistoryItem[];
  total: number;
  limit: number;
  offset: number;
  message?: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [history, setHistory] = useState<ConversionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'all' | 'equation' | 'table' | 'diagram' | 'auto'>('all');
  const [selectedItem, setSelectedItem] = useState<ConversionHistoryItem | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    setIsLoggedIn(true);
    
    // Load history from cache immediately
    loadHistory();
  }, [selectedType, sortBy]);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load from localStorage cache
      const cachedHistory = localStorage.getItem('conversion_history');
      let historyData: ConversionHistoryItem[] = [];
      
      if (cachedHistory) {
        try {
          historyData = JSON.parse(cachedHistory);
        } catch (e) {
          console.error('Failed to parse cached history:', e);
        }
      }
      
      // Try API in background (non-blocking)
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const params = new URLSearchParams({
            limit: '50',
            offset: '0',
          });
          
          if (selectedType !== 'all') {
            params.append('type', selectedType);
          }

          const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
          const response = await fetch(`${API_BASE_URL}/history/?${params.toString()}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const result: HistoryResponse = await response.json();
            
            if (result.success && result.data.length > 0) {
              historyData = result.data;
              localStorage.setItem('conversion_history', JSON.stringify(historyData));
            }
          }
        } catch (apiError) {
          console.log('API not available, using cache');
        }
      }
      
      // Filter by type
      let filteredData = historyData;
      if (selectedType !== 'all') {
        filteredData = historyData.filter(item => item.task_type === selectedType);
      }
      
      // Apply sorting
      const sortedData = [...filteredData].sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
      });
      
      setHistory(sortedData);
      setError(null);
    } catch (err: any) {
      console.error('Error loading history:', err);
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case 'equation':
        return 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/50';
      case 'table':
        return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/50';
      case 'diagram':
        return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/50';
      case 'auto':
        return 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/50';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'equation': return '📐';
      case 'table': return '📊';
      case 'diagram': return '🎨';
      case 'auto': return '🔮';
      default: return '📄';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Create a temporary toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    toast.textContent = '✓ Copied to clipboard!';
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 2000);
  };

  const renderDetectionBadges = (detected: DetectedContent | undefined) => {
    if (!detected) return null;
    
    const badges = [];
    if (detected.has_equations) {
      badges.push({ 
        label: 'Equations', 
        icon: '📐', 
        className: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      });
    }
    if (detected.has_tables) {
      badges.push({ 
        label: 'Tables', 
        icon: '📊', 
        className: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      });
    }
    if (detected.has_diagrams) {
      badges.push({ 
        label: 'Diagrams', 
        icon: '🎨', 
        className: 'bg-green-500/20 text-green-300 border-green-500/30'
      });
    }

    return (
      <div className="flex flex-wrap gap-1">
        {badges.map((badge, idx) => (
          <span
            key={idx}
            className={`px-2 py-0.5 rounded-full text-xs font-medium border ${badge.className}`}
          >
            {badge.icon} {badge.label}
          </span>
        ))}
      </div>
    );
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/10 to-gray-950">
      <Sidebar />
      
      <div className="flex-1 ml-0 lg:ml-64">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-3">
              Your History
            </h1>
            <p className="text-gray-400 text-lg">
              {history.length > 0 ? `${history.length} conversion${history.length !== 1 ? 's' : ''} saved` : 'View and manage your conversions'}
            </p>
          </motion.div>

          {/* Filters and Sort */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            {/* Task Type Filter */}
            <div className="flex gap-2">
              <span className="text-gray-400 text-sm self-center mr-2">Filter:</span>
              {(['all', 'equation', 'table', 'diagram', 'auto'] as const).map((type) => (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedType === type
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700'
                  }`}
                >
                  {type === 'all' ? '🌟 All' : `${getTaskTypeIcon(type)} ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                </motion.button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex gap-2 ml-auto">
              <span className="text-gray-400 text-sm self-center mr-2">Sort:</span>
              {(['newest', 'oldest'] as const).map((sort) => (
                <motion.button
                  key={sort}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSortBy(sort)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    sortBy === sort
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700'
                  }`}
                >
                  {sort === 'newest' ? '🕐 Newest' : '⏳ Oldest'}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col justify-center items-center py-20"
            >
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
                <div className="animate-ping absolute inset-0 rounded-full h-16 w-16 border-4 border-purple-400 opacity-20"></div>
              </div>
              <p className="text-gray-400 mt-4">Loading your history...</p>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/30 text-red-300 px-6 py-4 rounded-xl mb-6 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-semibold">Error loading history</p>
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !error && history.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="text-8xl mb-6">📚</div>
              <h2 className="text-3xl font-bold text-white mb-3">No conversions yet</h2>
              <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                Start converting your handwritten math, tables, and diagrams to LaTeX code
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/upload')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all text-lg font-semibold"
              >
                🚀 Start Converting
              </motion.button>
            </motion.div>
          )}

          {/* History Grid */}
          {!loading && !error && history.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {history.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    onClick={() => router.push(`/result/${item.id}`)}
                    className="group relative bg-gradient-to-br from-gray-900/90 to-gray-800/50 border border-gray-700/50 rounded-2xl overflow-hidden cursor-pointer hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all backdrop-blur-sm"
                  >
                    {/* Task Type Badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <div className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 backdrop-blur-md ${getTaskTypeColor(item.task_type)} shadow-lg`}>
                        {getTaskTypeIcon(item.task_type)} {item.task_type.toUpperCase()}
                      </div>
                    </div>

                    {/* Image Preview */}
                    <div className="relative h-52 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.original_filename}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      {/* Filename */}
                      <div className="text-white font-semibold mb-2 truncate group-hover:text-purple-400 transition-colors">
                        {item.original_filename || 'Untitled'}
                      </div>
                      
                      {/* Detection Badges */}
                      {item.detected_content && (
                        <div className="mb-3">
                          {renderDetectionBadges(item.detected_content)}
                        </div>
                      )}
                      
                      {/* LaTeX Preview */}
                      <div className="bg-gray-950/80 border border-gray-800 rounded-lg p-3 mb-3 max-h-20 overflow-hidden">
                        <div className="text-gray-400 text-xs font-mono line-clamp-2">
                          {item.latex_code.substring(0, 80)}
                          {item.latex_code.length > 80 && '...'}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          🕐 {formatDate(item.created_at)}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/result/${item.id}`);
                          }}
                          className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1"
                        >
                          View <span className="text-lg">→</span>
                        </motion.button>
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10"></div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
