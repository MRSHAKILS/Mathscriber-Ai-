'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { getConversionHistory, ConversionHistoryItem } from '@/lib/api';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export default function HistoryPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [history, setHistory] = useState<ConversionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'all' | 'upload' | 'canvas' | 'capture'>('all');
  const [selectedItem, setSelectedItem] = useState<ConversionHistoryItem | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setIsLoggedIn(true);
    
    // Load history
    loadHistory();
  }, [router, selectedType]);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const type = selectedType === 'all' ? undefined : selectedType;
      const result = await getConversionHistory(50, 0, type);
      
      if (result.success) {
        setHistory(result.data);
      } else {
        setError(result.message || 'Failed to load history');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'upload':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'canvas':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'capture':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('LaTeX code copied to clipboard!');
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      
      <div className="flex-1 ml-0 lg:ml-64">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Conversion History</h1>
            <p className="text-gray-400">View and manage your previous conversions</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {(['all', 'upload', 'canvas', 'capture'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedType === type
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && history.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">No conversion history found</div>
              <p className="text-gray-600 mb-6">
                Start converting images to LaTeX to see your history here
              </p>
              <button
                onClick={() => router.push('/upload')}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Convert Now
              </button>
            </div>
          )}

          {/* History Grid */}
          {!loading && !error && history.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden cursor-pointer hover:border-indigo-600/50 transition-all"
                >
                  {/* Image Preview */}
                  <div className="relative h-48 bg-gray-800">
                    <img
                      src={item.image_url}
                      alt={item.original_filename}
                      className="w-full h-full object-contain"
                    />
                    <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(item.conversion_type)}`}>
                      {item.conversion_type}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="text-sm text-gray-400 mb-2 truncate">
                      {item.original_filename}
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      {formatDate(item.created_at)}
                    </div>
                    
                    {/* LaTeX Preview */}
                    <div className="bg-gray-950 border border-gray-800 rounded-lg p-3 mb-3 max-h-24 overflow-hidden">
                      <div className="text-gray-300 text-sm font-mono line-clamp-3">
                        {item.latex_code.substring(0, 100)}
                        {item.latex_code.length > 100 && '...'}
                      </div>
                    </div>

                    {/* Accuracy */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Accuracy</span>
                      <span className="text-sm text-green-400 font-medium">
                        {(item.accuracy * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-gray-900 border border-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedItem.original_filename}</h2>
                <p className="text-sm text-gray-400">{formatDate(selectedItem.created_at)}</p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Image */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Original Image</h3>
                <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                  <img
                    src={selectedItem.image_url}
                    alt={selectedItem.original_filename}
                    className="max-w-full h-auto mx-auto"
                  />
                </div>
              </div>

              {/* LaTeX Code */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">LaTeX Code</h3>
                  <button
                    onClick={() => copyToClipboard(selectedItem.latex_code)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                  >
                    Copy Code
                  </button>
                </div>
                <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                  <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap">
                    {selectedItem.latex_code}
                  </pre>
                </div>
              </div>

              {/* Rendered LaTeX */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Rendered Output</h3>
                <div className="bg-white border border-gray-800 rounded-lg p-6">
                  <BlockMath math={selectedItem.latex_code} />
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Conversion Type</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(selectedItem.conversion_type)}`}>
                    {selectedItem.conversion_type}
                  </div>
                </div>
                <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Accuracy</div>
                  <div className="text-lg text-green-400 font-semibold">
                    {(selectedItem.accuracy * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
