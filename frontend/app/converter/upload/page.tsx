'use client';

import { useState, useCallback, useEffect } from 'react';
import { X, Upload, FileImage, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<any>(null);

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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const event = { target: { files: [file] } } as any;
      handleFileSelect(event);
    }
  }, [handleFileSelect]);

  const handleConvert = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    setError('');

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      console.log('Sending conversion request...');
      const response = await fetch('http://localhost:8000/api/convert/upload', {
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
      window.opener.postMessage({
        type: 'INSERT_LATEX',
        latex: result.latex
      }, 'http://localhost:8000');
      window.close();
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.latex);
      alert('LaTeX copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
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
              onClick={() => window.close()}
              className="w-8 h-8 rounded-lg bg-red-600/10 hover:bg-red-600/20 flex items-center justify-center transition-colors"
            >
              <X size={18} className="text-red-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {!result ? (
              <>
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
                        Supports JPG, PNG, GIF
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800">
                      <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                    {error && (
                      <div className="p-4 bg-red-600/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {error}
                      </div>
                    )}
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setPreview('');
                          setError('');
                        }}
                        className="flex-1 px-4 py-3 rounded-lg border border-red-500/30 text-gray-300 hover:bg-red-600/10 transition-colors"
                      >
                        Choose Different Image
                      </button>
                      <button
                        onClick={handleConvert}
                        disabled={isConverting}
                        className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isConverting ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            Converting...
                          </>
                        ) : (
                          'Convert to LaTeX'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">Generated LaTeX:</p>
                  <pre className="text-sm text-green-400 whitespace-pre-wrap">{result.latex}</pre>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setResult(null)}
                    className="flex-1 px-4 py-3 rounded-lg border border-red-500/30 text-gray-300 hover:bg-red-600/10 transition-colors"
                  >
                    New Conversion
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex-1 px-4 py-3 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 transition-colors"
                  >
                    Copy LaTeX
                  </button>
                  <button
                    onClick={handleInsert}
                    className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all"
                  >
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
