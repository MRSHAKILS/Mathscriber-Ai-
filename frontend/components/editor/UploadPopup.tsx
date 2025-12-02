'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileImage, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface UploadPopupProps {
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

export default function UploadPopup({ isOpen, onClose, onConversionComplete }: UploadPopupProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setSelectedFile(file);
      setError('');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleConvert = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('http://localhost:8000/api/convert/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Conversion failed');
      }

      const result = await response.json();
      onConversionComplete(result);
      onClose();
      setSelectedFile(null);
      setPreview('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setIsConverting(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError('');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] pointer-events-auto"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl mx-4 z-[10000] pointer-events-auto"
          >
            <div className="bg-gradient-to-b from-gray-900/95 to-gray-900/90 backdrop-blur-2xl border border-red-500/20 rounded-2xl shadow-[0_8px_32px_rgba(239,68,68,0.3)] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-red-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center">
                    <Upload size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Upload Image</h2>
                    <p className="text-sm text-gray-400">Convert math images to LaTeX</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-red-600/10 hover:bg-red-600/20 flex items-center justify-center transition-colors"
                >
                  <X size={18} className="text-red-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {!preview ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-red-500/30 rounded-xl p-12 text-center hover:border-red-500/50 transition-colors cursor-pointer"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <FileImage size={48} className="mx-auto mb-4 text-red-400" />
                      <p className="text-lg font-semibold text-white mb-2">
                        Drop your image here or click to browse
                      </p>
                      <p className="text-sm text-gray-400">
                        Supports PNG, JPG, JPEG
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Preview */}
                    <div className="relative rounded-xl overflow-hidden bg-gray-900/50 border border-red-500/20">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-auto max-h-96 object-contain"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setPreview('');
                        }}
                        className="px-4 py-2 rounded-lg border border-red-500/20 text-gray-300 hover:bg-red-600/10 transition-colors"
                      >
                        Change Image
                      </button>
                      <button
                        onClick={handleConvert}
                        disabled={isConverting}
                        className="flex-1 relative px-6 py-3 rounded-xl font-semibold text-white overflow-hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 bg-[length:200%_100%] animate-gradient" />
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {isConverting ? (
                            <>
                              <Loader2 size={18} className="animate-spin" />
                              Converting...
                            </>
                          ) : (
                            <>
                              <Upload size={18} />
                              Convert to LaTeX
                            </>
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Error */}
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
