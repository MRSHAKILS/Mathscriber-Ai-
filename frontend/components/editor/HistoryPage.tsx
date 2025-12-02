'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, History as HistoryIcon, Copy, Download, Plus, Trash2, Search } from 'lucide-react';

interface HistoryPageProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertAtCursor: (latex: string) => void;
}

interface HistoryItem {
  id: number;
  input: string;
  latex: string;
  convertedOutput: string;
  timestamp: string;
}

export default function HistoryPage({ isOpen, onClose, onInsertAtCursor }: HistoryPageProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/history');
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (latex: string) => {
    await navigator.clipboard.writeText(latex);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/api/history/${id}`, {
        method: 'DELETE',
      });
      setHistory(history.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const filteredHistory = history.filter(item =>
    item.latex.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] pointer-events-auto"
          />

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl max-h-[90vh] overflow-hidden mx-4 z-[10000] pointer-events-auto"
          >
            <div className="bg-gradient-to-b from-gray-900/95 to-gray-900/90 backdrop-blur-2xl border border-red-500/20 rounded-2xl shadow-[0_8px_32px_rgba(239,68,68,0.3)] h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-red-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center">
                    <HistoryIcon size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Conversion History</h2>
                    <p className="text-sm text-gray-400">{history.length} items saved</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-lg bg-red-600/10 hover:bg-red-600/20 flex items-center justify-center transition-colors"
                >
                  <X size={20} className="text-red-400" />
                </button>
              </div>

              {/* Search */}
              <div className="p-6 border-b border-red-500/10">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search LaTeX code..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-red-500/20 rounded-lg text-white placeholder-gray-500 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-400">Loading history...</div>
                  </div>
                ) : filteredHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <HistoryIcon size={48} className="mb-4 opacity-50" />
                    <p>{searchQuery ? 'No results found' : 'No conversion history yet'}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredHistory.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group relative bg-gradient-to-b from-gray-900/90 to-gray-900/50 border border-red-500/10 rounded-xl p-4 hover:border-red-500/30 transition-all cursor-pointer"
                        onClick={() => setSelectedItem(item)}
                      >
                        {/* Preview */}
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-black/50 mb-3">
                          <img
                            src={item.input}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* LaTeX Preview */}
                        <div className="mb-3">
                          <code className="text-xs text-gray-400 line-clamp-2">
                            {item.latex}
                          </code>
                        </div>

                        {/* Meta */}
                        <div className="text-xs text-gray-500 mb-3">
                          {new Date(item.timestamp).toLocaleString()}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(item.latex);
                            }}
                            className="flex-1 px-3 py-2 rounded-lg bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600/20 transition-colors flex items-center justify-center gap-1 text-xs"
                          >
                            <Copy size={14} />
                            Copy
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onInsertAtCursor(item.latex);
                              onClose();
                            }}
                            className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 text-red-400 hover:from-red-600/30 hover:to-orange-600/30 transition-colors flex items-center justify-center gap-1 text-xs"
                          >
                            <Plus size={14} />
                            Insert
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                            className="px-3 py-2 rounded-lg bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Detail Modal */}
          <AnimatePresence>
            {selectedItem && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedItem(null)}
                className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gray-900 border border-red-500/20 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                >
                  <img src={selectedItem.input} alt="Full" className="w-full rounded-lg mb-4" />
                  <pre className="bg-black/50 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
                    {selectedItem.latex}
                  </pre>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="mt-4 w-full py-2 px-4 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 transition-colors"
                  >
                    Close
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
