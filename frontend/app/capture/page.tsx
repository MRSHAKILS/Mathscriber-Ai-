'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, RefreshCw, Loader2, X, Check } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { convertImageToLatex } from '@/lib/api';

export default function CapturePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [latexResult, setLatexResult] = useState('');
  const [error, setError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    return () => {
      // Cleanup: stop camera when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

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
    const canvas = canvasRef.current;
    
    if (!video || !canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data URL
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(imageDataUrl);
    
    // Stop camera after capture
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
      const result = await convertImageToLatex(file, 'capture');

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
            <h1 className="text-4xl font-bold text-white mb-2">Camera Capture</h1>
            <p className="text-gray-400">Capture mathematical expressions with your camera and convert to LaTeX</p>
          </div>

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
                  <canvas ref={canvasRef} className="hidden" />
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
        </motion.div>
      </div>
    </div>
  );
}
