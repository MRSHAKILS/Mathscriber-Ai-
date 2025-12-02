'use client';

import { useState, useRef, useCallback } from 'react';
import { X, Camera, Loader2 } from 'lucide-react';

export default function CapturePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captured, setCaptured] = useState(false);
  const [preview, setPreview] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Failed to access camera');
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      setPreview(canvas.toDataURL('image/png'));
      setCaptured(true);
      stream?.getTracks().forEach(track => track.stop());
    }
  };

  const retake = () => {
    setCaptured(false);
    setPreview('');
    setResult(null);
    startCamera();
  };

  const handleConvert = async () => {
    if (!preview) return;

    setIsConverting(true);
    const blob = await (await fetch(preview)).blob();
    const formData = new FormData();
    formData.append('image', blob, 'capture.png');

    try {
      console.log('Sending capture conversion request...');
      const response = await fetch('http://localhost:8000/api/convert/capture', {
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
      setError('Failed to convert image: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsConverting(false);
    }
  };

  const handleInsert = () => {
    if (result && window.opener) {
      window.opener.postMessage({ type: 'INSERT_LATEX', latex: result.latex }, 'http://localhost:8000');
      window.close();
    }
  };

  useState(() => {
    startCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-b from-gray-900/95 to-gray-900/90 backdrop-blur-2xl border border-red-500/20 rounded-2xl shadow-[0_8px_32px_rgba(239,68,68,0.3)] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-red-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-yellow-600 flex items-center justify-center">
                <Camera size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Capture Image</h2>
                <p className="text-sm text-gray-400">Take a photo of math equations</p>
              </div>
            </div>
            <button onClick={() => window.close()} className="w-8 h-8 rounded-lg bg-red-600/10 hover:bg-red-600/20 flex items-center justify-center transition-colors">
              <X size={18} className="text-red-400" />
            </button>
          </div>

          <div className="p-6">
            {!result ? (
              <>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800 mb-4">
                  {!captured ? (
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  ) : (
                    <img src={preview} alt="Captured" className="w-full h-full object-contain" />
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>

                {error && (
                  <div className="p-4 bg-red-600/10 border border-red-500/20 rounded-lg text-red-400 text-sm mb-4">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  {!captured ? (
                    <button onClick={captureImage} className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-semibold hover:shadow-lg transition-all">
                      <Camera size={20} className="inline mr-2" />
                      Capture
                    </button>
                  ) : (
                    <>
                      <button onClick={retake} className="flex-1 px-4 py-3 rounded-lg border border-red-500/30 text-gray-300 hover:bg-red-600/10 transition-colors">
                        Retake
                      </button>
                      <button onClick={handleConvert} disabled={isConverting} className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        {isConverting ? <><Loader2 size={20} className="animate-spin" />Converting...</> : 'Convert to LaTeX'}
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">Generated LaTeX:</p>
                  <pre className="text-sm text-green-400 whitespace-pre-wrap">{result.latex}</pre>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setResult(null); retake(); }} className="flex-1 px-4 py-3 rounded-lg border border-red-500/30 text-gray-300 hover:bg-red-600/10 transition-colors">
                    New Capture
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
