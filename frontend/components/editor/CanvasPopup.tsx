'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pencil, Eraser, Trash2, Loader2 } from 'lucide-react';

interface CanvasPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConversionComplete: (result: ConversionResult) => void;
}

interface ConversionResult {
  input: string;
  latex: string;
  convertedOutput: string;
  timestamp: string;
}

export default function CanvasPopup({ isOpen, onClose, onConversionComplete }: CanvasPopupProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEraser, setIsEraser] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string>('');

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  }, []);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineWidth = isEraser ? 20 : 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = isEraser ? '#000000' : '#ffffff';
    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
    
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing, isEraser]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const handleConvert = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsConverting(true);
    setError('');

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) throw new Error('Failed to create image');

        const formData = new FormData();
        formData.append('image', blob, 'drawing.png');

        const response = await fetch('http://localhost:8000/api/convert/canvas', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Conversion failed');
        }

        const result = await response.json();
        onConversionComplete(result);
        onClose();
        clearCanvas();
      }, 'image/png');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setIsConverting(false);
    }
  };

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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl mx-4 z-[10000] pointer-events-auto"
          >
            <div className="bg-gradient-to-b from-gray-900/95 to-gray-900/90 backdrop-blur-2xl border border-red-500/20 rounded-2xl shadow-[0_8px_32px_rgba(239,68,68,0.3)] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-red-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600 to-red-600 flex items-center justify-center">
                    <Pencil size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Draw Canvas</h2>
                    <p className="text-sm text-gray-400">Handwrite math equations</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-red-600/10 hover:bg-red-600/20 flex items-center justify-center transition-colors"
                >
                  <X size={18} className="text-red-400" />
                </button>
              </div>

              <div className="p-6">
                {/* Toolbar */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setIsEraser(false)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                      !isEraser
                        ? 'bg-red-600/20 border border-red-500/30 text-red-400'
                        : 'border border-red-500/20 text-gray-400 hover:bg-red-600/10'
                    }`}
                  >
                    <Pencil size={18} />
                    Draw
                  </button>
                  <button
                    onClick={() => setIsEraser(true)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                      isEraser
                        ? 'bg-red-600/20 border border-red-500/30 text-red-400'
                        : 'border border-red-500/20 text-gray-400 hover:bg-red-600/10'
                    }`}
                  >
                    <Eraser size={18} />
                    Erase
                  </button>
                  <button
                    onClick={clearCanvas}
                    className="px-4 py-2 rounded-lg border border-red-500/20 text-gray-400 hover:bg-red-600/10 transition-colors flex items-center gap-2 ml-auto"
                  >
                    <Trash2 size={18} />
                    Clear
                  </button>
                </div>

                {/* Canvas */}
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={400}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full rounded-xl border border-red-500/20 bg-black touch-none cursor-crosshair"
                  style={{ touchAction: 'none' }}
                />

                {/* Actions */}
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleConvert}
                    disabled={isConverting}
                    className="flex-1 relative px-6 py-3 rounded-xl font-semibold text-white overflow-hidden group disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 bg-[length:200%_100%] animate-gradient" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isConverting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Converting...
                        </>
                      ) : (
                        <>
                          <Pencil size={18} />
                          Convert to LaTeX
                        </>
                      )}
                    </span>
                  </button>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-600/10 border border-red-500/30 rounded-lg text-sm text-red-400">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
