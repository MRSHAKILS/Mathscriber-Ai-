'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eraser, Trash2, Download, Loader2, RefreshCw, Pencil } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { convertImageToLatex } from '@/lib/api';

export default function CanvasPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(3);
  const [color, setColor] = useState('#000000');
  const [isErasing, setIsErasing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [latexResult, setLatexResult] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.strokeStyle = isErasing ? '#FFFFFF' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setLatexResult('');
    setError('');
  };

  const handleConvert = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setLoading(true);
    setError('');

    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to convert canvas to image'));
        }, 'image/png');
      });

      // Create file from blob
      const file = new File([blob], 'canvas-drawing.png', { type: 'image/png' });

      // Send to API with canvas conversion type
      const result = await convertImageToLatex(file, 'canvas');

      if (result.success) {
        setLatexResult(result.latex_code);
      } else {
        setError(result.message || 'Conversion failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during conversion');
    } finally {
      setLoading(false);
    }
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'canvas-drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const copyLatex = () => {
    navigator.clipboard.writeText(latexResult);
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Canvas Drawing</h1>
            <p className="text-gray-400">Draw mathematical expressions and convert them to LaTeX</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Canvas Section */}
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsErasing(!isErasing)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isErasing
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {isErasing ? <Eraser className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                    {isErasing ? 'Eraser' : 'Pen'}
                  </button>

                  <div className="flex items-center gap-2">
                    <label className="text-gray-400 text-sm">Size:</label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="w-24"
                    />
                    <span className="text-white text-sm w-8">{brushSize}</span>
                  </div>

                  {!isErasing && (
                    <div className="flex items-center gap-2">
                      <label className="text-gray-400 text-sm">Color:</label>
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={clearCanvas}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </button>
                  <button
                    onClick={downloadCanvas}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>

              {/* Canvas */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-[500px] bg-white rounded-lg cursor-crosshair touch-none"
                  style={{ touchAction: 'none' }}
                />
              </div>

              {/* Convert Button */}
              <button
                onClick={handleConvert}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl hover:from-red-500 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Convert to LaTeX
                  </>
                )}
              </button>
            </div>

            {/* Result Section */}
            <div className="space-y-4">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">LaTeX Output</h2>
                
                {error && (
                  <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-4">
                    <p className="text-red-400">{error}</p>
                  </div>
                )}

                {latexResult ? (
                  <div className="space-y-4">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap break-all">
                        {latexResult}
                      </pre>
                    </div>
                    <button
                      onClick={copyLatex}
                      className="w-full py-2 bg-gray-800 text-white hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Copy LaTeX
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Draw something and click convert to see LaTeX output</p>
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-3">Tips</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>• Draw equations clearly with proper spacing</li>
                  <li>• Use the eraser to fix mistakes</li>
                  <li>• Adjust brush size for better control</li>
                  <li>• Works best with mathematical expressions</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
