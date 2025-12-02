'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Pencil, Eraser, Loader2, Trash2 } from 'lucide-react';

export default function CanvasPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [isConverting, setIsConverting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'pen') {
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
    } else {
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 20;
    }

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

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleConvert = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsConverting(true);
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append('image', blob, 'canvas.png');

      try {
        console.log('Sending canvas conversion request...');
        const response = await fetch('http://localhost:8000/api/convert/canvas', {
          method: 'POST',
          body: formData,
        });
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.error) {
          setError(data.error);
        } else {
          setResult(data);
        }
      } catch (err) {
        console.error('Conversion error:', err);
        setError('Failed to convert drawing: ' + (err instanceof Error ? err.message : 'Unknown error'));
      } finally {
        setIsConverting(false);
      }
    });
  };

  const handleInsert = () => {
    if (result && window.opener) {
      window.opener.postMessage({ type: 'INSERT_LATEX', latex: result.latex }, 'http://localhost:8000');
      window.close();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-b from-gray-900/95 to-gray-900/90 backdrop-blur-2xl border border-red-500/20 rounded-2xl shadow-[0_8px_32px_rgba(239,68,68,0.3)] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-red-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600 to-red-600 flex items-center justify-center">
                <Pencil size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Draw Canvas</h2>
                <p className="text-sm text-gray-400">Draw math equations</p>
              </div>
            </div>
            <button onClick={() => window.close()} className="w-8 h-8 rounded-lg bg-red-600/10 hover:bg-red-600/20 flex items-center justify-center transition-colors">
              <X size={18} className="text-red-400" />
            </button>
          </div>

          <div className="p-6">
            {!result ? (
              <>
                <div className="mb-4 flex gap-2">
                  <button onClick={() => setTool('pen')} className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${tool === 'pen' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                    <Pencil size={18} />
                    Draw
                  </button>
                  <button onClick={() => setTool('eraser')} className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${tool === 'eraser' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                    <Eraser size={18} />
                    Erase
                  </button>
                  <button onClick={clearCanvas} className="px-4 py-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>

                <canvas
                  ref={canvasRef}
                  width={700}
                  height={400}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full border-2 border-red-500/30 rounded-xl cursor-crosshair mb-4"
                />

                {error && (
                  <div className="p-4 bg-red-600/10 border border-red-500/20 rounded-lg text-red-400 text-sm mb-4">
                    {error}
                  </div>
                )}

                <button onClick={handleConvert} disabled={isConverting} className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {isConverting ? <><Loader2 size={20} className="animate-spin" />Converting...</> : 'Convert to LaTeX'}
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">Generated LaTeX:</p>
                  <pre className="text-sm text-green-400 whitespace-pre-wrap">{result.latex}</pre>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setResult(null); clearCanvas(); }} className="flex-1 px-4 py-3 rounded-lg border border-red-500/30 text-gray-300 hover:bg-red-600/10 transition-colors">
                    New Drawing
                  </button>
                  <button onClick={handleInsert} className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold hover:shadow-lg transition-all">
                    Insert at Cursor
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
