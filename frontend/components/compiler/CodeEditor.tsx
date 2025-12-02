'use client';

import { useEffect, useRef } from 'react';
import { type LatexFile } from '@/lib/compiler-api';
import { AlertCircle } from 'lucide-react';

interface CodeEditorProps {
  file: LatexFile | null;
  onChange: (content: string) => void;
  compilationError?: string | null;
}

export default function CodeEditor({ file, onChange, compilationError }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Load MathJax for LaTeX preview
    if (typeof window !== 'undefined' && !(window as any).MathJax) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const value = e.currentTarget.value;
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      e.currentTarget.value = newValue;
      e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
      onChange(newValue);
    }
  };

  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center bg-neutral-50">
        <div className="text-center text-neutral-500">
          <p className="text-lg mb-2">No file selected</p>
          <p className="text-sm">Select a file from the tree to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white border-r border-neutral-200">
      {/* Editor Header */}
      <div className="px-4 py-2 border-b border-neutral-200 flex items-center justify-between">
        <div>
          <h3 className="font-medium text-neutral-800">{file.full_name}</h3>
          <p className="text-xs text-neutral-500">{file.path}</p>
        </div>
        <div className="text-xs text-neutral-500">
          {file.content.length} characters
        </div>
      </div>

      {/* Compilation Error */}
      {compilationError && (
        <div className="px-4 py-3 bg-red-50 border-b border-red-200 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-red-800 mb-1">Compilation Error</h4>
            <pre className="text-xs text-red-700 whitespace-pre-wrap font-mono">
              {compilationError}
            </pre>
          </div>
        </div>
      )}

      {/* Code Editor */}
      <div className="flex-1 overflow-hidden">
        <textarea
          ref={textareaRef}
          value={file.content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none"
          style={{
            lineHeight: '1.5',
            tabSize: 4,
          }}
          spellCheck={false}
          placeholder="Start typing your LaTeX code..."
        />
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
        <div className="flex items-center space-x-4">
          <span>Lines: {file.content.split('\n').length}</span>
          <span>Type: {file.file_type.toUpperCase()}</span>
          {file.is_main && (
            <span className="bg-primary-200 text-primary-700 px-2 py-0.5 rounded">
              Main Document
            </span>
          )}
        </div>
        <div>
          Last updated: {new Date(file.updated_at).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
