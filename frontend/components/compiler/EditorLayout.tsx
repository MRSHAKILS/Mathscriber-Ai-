'use client';

import { type Project, type LatexFile } from '@/lib/compiler-api';
import { Play, Download, Settings, Save } from 'lucide-react';

interface EditorLayoutProps {
  project: Project;
  currentFile: LatexFile | null;
  autoCompile: boolean;
  onAutoCompileToggle: (enabled: boolean) => void;
  onCompile: () => void;
  isCompiling: boolean;
  onDownloadPDF: () => void;
  hasPDF: boolean;
  children: React.ReactNode;
}

export default function EditorLayout({
  project,
  currentFile,
  autoCompile,
  onAutoCompileToggle,
  onCompile,
  isCompiling,
  onDownloadPDF,
  hasPDF,
  children,
}: EditorLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Top Toolbar */}
      <div className="bg-black/95 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            {project.name}
          </h1>
          {currentFile && (
            <span className="text-sm text-gray-400 font-mono">
              {currentFile.path}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* Auto-compile Toggle */}
          <label className="flex items-center space-x-2 cursor-pointer bg-white/5 px-3 py-2 rounded-xl hover:bg-white/10 transition-all">
            <input
              type="checkbox"
              checked={autoCompile}
              onChange={(e) => onAutoCompileToggle(e.target.checked)}
              className="w-4 h-4 text-red-500 rounded focus:ring-red-500"
            />
            <span className="text-sm text-gray-300">Auto-compile</span>
          </label>

          {/* Compile Button */}
          <button
            onClick={onCompile}
            disabled={isCompiling || !currentFile}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold transition-all ${
              isCompiling || !currentFile
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white hover:shadow-lg hover:shadow-red-500/50 hover:scale-105'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>{isCompiling ? 'Compiling...' : 'Compile'}</span>
          </button>

          {/* Download PDF Button */}
          <button
            onClick={onDownloadPDF}
            disabled={!hasPDF}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold transition-all ${
              !hasPDF
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/50 hover:scale-105'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
