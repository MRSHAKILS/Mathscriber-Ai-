'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  RefreshCw, 
  Loader2, 
  X, 
  Check, 
  Pencil,
  Eraser,
  Trash2,
  Download,
  Copy,
  Sparkles,
  Zap
} from 'lucide-react';
import Navbar from '@/components/home/NavbarNew';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/home/Footer';
import { useAuth } from '@/lib/auth/auth-context';
import ConversionResult from '@/components/ConversionResult';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function CapturePage() {
  const { user, loading: authLoading } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [activeTab, setActiveTab] = useState<'camera' | 'draw'>('camera');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [latexResult, setLatexResult] = useState('');
  const [conversionId, setConversionId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(3);
  const [color, setColor] = useState('#000000');
  const [isErasing, setIsErasing] = useState(false);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Initialize drawing canvas
  useEffect(() => {
    if (activeTab === 'draw') {
      const canvas = drawCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [activeTab]);

  const startCamera = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      setStream(mediaStream);
      setCameraActive(true);
      setCapturedImage(null);
      setLatexResult('');
    } catch (err: any) {
      setError('Failed to access camera. Please grant camera permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = captureCanvasRef.current;
    
    if (!video || !canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(imageDataUrl);
    stopCamera();
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setLatexResult('');
    setError('');
    startCamera();
  };

  const handleConvert = async () => {
    if (!capturedImage) return;

    setLoading(true);
    setError('');

    try {
      // Convert data URL to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();

      // Create file from blob
      const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });

      // Send to API with capture conversion type
      const formData = new FormData();
      formData.append('image', file);
      formData.append('task_type', 'equation');

      const apiResponse = await fetch(`${API_BASE_URL}/api/convert-image/`, {
        method: 'POST',
        body: formData,
      });

      const result = await apiResponse.json();

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

  const copyLatex = () => {
    navigator.clipboard.writeText(latexResult);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-950">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 ml-0 lg:ml-64">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl lg:text-4xl font-black text-white mb-2 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                Camera & Drawing Capture
              </h1>
              <p className="text-gray-400 text-lg">Capture math with camera or draw equations by hand</p>
            </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Camera Section */}
            <div className="space-y-4">
              {/* Camera View */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
                  {!cameraActive && !capturedImage && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500">Camera not started</p>
                      </div>
                    </div>
                  )}

                  {cameraActive && (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  )}

                  {capturedImage && (
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Hidden canvas for capture */}
                  <canvas ref={captureCanvasRef} className="hidden" />
                </div>
              </div>

              {/* Controls */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                {!cameraActive && !capturedImage && (
                  <button
                    onClick={startCamera}
                    className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl hover:from-red-500 hover:to-orange-500 transition-all flex items-center justify-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Start Camera
                  </button>
                )}

                {cameraActive && (
                  <div className="flex gap-2">
                    <button
                      onClick={captureImage}
                      className="flex-1 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl hover:from-red-500 hover:to-orange-500 transition-all flex items-center justify-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      Capture
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-6 py-4 bg-gray-800 text-white hover:bg-gray-700 rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {capturedImage && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleConvert}
                      disabled={loading}
                      className="flex-1 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl hover:from-red-500 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                    <button
                      onClick={retakePhoto}
                      className="px-6 py-4 bg-gray-800 text-white hover:bg-gray-700 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      Retake
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
                  <p className="text-red-400">{error}</p>
                </div>
              )}
            </div>

            {/* Result Section */}
            <div className="space-y-4">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">LaTeX Output</h2>
                
                {latexResult ? (
                  <div className="space-y-4">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap break-all">
                        {latexResult}
                      </pre>
                    </div>
                    <button
                      onClick={copyLatex}
                      className="w-full py-2 bg-gray-800 text-white hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Copy LaTeX
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Capture an image and click convert to see LaTeX output</p>
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-3">Tips for Best Results</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>• Ensure good lighting for clear images</li>
                  <li>• Keep the camera steady when capturing</li>
                  <li>• Position the equation in the center</li>
                  <li>• Avoid shadows and reflections</li>
                  <li>• Make sure text is in focus</li>
                </ul>
              </div>

              {/* Stats */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">AI Model Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Model:</span>
                    <span className="text-white font-semibold">Gemini 2.0 Flash</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Accuracy:</span>
                    <span className="text-green-400 font-semibold">97%+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Time:</span>
                    <span className="text-blue-400 font-semibold">2.4s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </main>
      </div>

      <Footer />

      {showResult && conversionId && latexResult && (
        <ConversionResult
          conversionId={conversionId}
          latexCode={latexResult}
          onClose={() => setShowResult(false)}
        />
      )}
    </div>
  );
}
