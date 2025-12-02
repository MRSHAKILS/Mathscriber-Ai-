'use client';

import { useState, useEffect } from 'react';
import { X, Search, Clock, Copy, Trash2 } from 'lucide-react';

interface HistoryItem {
  id: number;
  latex_code: string;
  created_at: string;
  input_image_data: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/history');
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.error('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = (latex: string) => {
    if (window.opener) {
      window.opener.postMessage({ type: 'INSERT_LATEX', latex }, 'http://localhost:8000');
      window.close();
    }
  };

  const handleCopy = (latex: string) => {
    navigator.clipboard.writeText(latex);
    alert('LaTeX copied to clipboard!');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this conversion?')) return;

    try {
      await fetch(`http://localhost:8000/api/history/${id}`, { method: 'DELETE' });
      setHistory(history.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const filteredHistory = history.filter(item =>
    item.latex_code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-b from-gray-900/95 to-gray-900/90 backdrop-blur-2xl border border-red-500/20 rounded-2xl shadow-[0_8px_32px_rgba(239,68,68,0.3)] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-red-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center">
                <Clock size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Conversion History</h2>
                <p className="text-sm text-gray-400">Browse past conversions</p>
              </div>
            </div>
            <button onClick={() => window.close()} className="w-8 h-8 rounded-lg bg-red-600/10 hover:bg-red-600/20 flex items-center justify-center transition-colors">
              <X size={18} className="text-red-400" />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search LaTeX code..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-red-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50"
              />
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-400">Loading...</div>
            ) : filteredHistory.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No conversions found</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                {filteredHistory.map((item) => (
                  <div key={item.id} className="bg-gray-800/50 border border-red-500/10 rounded-xl p-4 hover:border-red-500/30 transition-colors">
                    {item.input_image_data && (
                      <div className="mb-3 aspect-video rounded-lg overflow-hidden bg-gray-900">
                        <img src={`data:image/png;base64,${item.input_image_data}`} alt="Input" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                      <div className="p-2 bg-gray-900/50 rounded text-sm text-green-400 font-mono overflow-x-auto">
                        {item.latex_code.substring(0, 100)}
                        {item.latex_code.length > 100 && '...'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(item.latex_code)}
                        className="flex-1 px-3 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <Copy size={16} />
                        Copy
                      </button>
                      <button
                        onClick={() => handleInsert(item.latex_code)}
                        className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white hover:shadow-lg transition-all text-sm"
                      >
                        Insert
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-2 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
