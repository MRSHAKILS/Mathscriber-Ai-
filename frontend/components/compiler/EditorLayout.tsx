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
    <div className="flex flex-col h-screen bg-neutral-50">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-neutral-800">{project.name}</h1>
          {currentFile && (
            <span className="text-sm text-neutral-600">
              {currentFile.path}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* Auto-compile Toggle */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoCompile}
              onChange={(e) => onAutoCompileToggle(e.target.checked)}
              className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-neutral-700">Auto-compile</span>
          </label>

          {/* Compile Button */}
          <button
            onClick={onCompile}
            disabled={isCompiling || !currentFile}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isCompiling || !currentFile
                ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                : 'bg-primary-500 text-white hover:bg-primary-600 shadow-neu-sm'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>{isCompiling ? 'Compiling...' : 'Compile'}</span>
          </button>

          {/* Download PDF Button */}
          <button
            onClick={onDownloadPDF}
            disabled={!hasPDF}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              !hasPDF
                ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600 shadow-neu-sm'
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
