'use client';

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { type LatexFile } from '@/lib/compiler-api';
import { AlertCircle, FileText } from 'lucide-react';

// Support both full LatexFile and simplified file structure
type SimpleFile = {
  name: string;
  content: string;
};

interface CodeEditorProps {
  file: LatexFile | SimpleFile | null;
  onChange: (content: string) => void;
  compilationError?: string | null;
  aiSuggestions?: string | null;
}

export interface CodeEditorRef {
  insertAtCursor: (text: string, cursorOffset?: number) => void;
}

const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>(({ file, onChange, compilationError, aiSuggestions }, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    insertAtCursor: (text: string, cursorOffset: number = 0) => {
      if (!textareaRef.current || !file) return;
      
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentValue = file.content;
      
      const newValue = currentValue.substring(0, start) + text + currentValue.substring(end);
      onChange(newValue);
      
      // Set cursor position after insertion
      setTimeout(() => {
        const newCursorPos = start + text.length + cursorOffset;
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    },
  }));

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
      <div className="flex-1 flex items-center justify-center bg-black">
        <div className="text-center text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg mb-2 text-gray-400 font-semibold">No file selected</p>
          <p className="text-sm text-gray-600">Select a file from the tree to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-black/95 backdrop-blur-xl border-r border-white/10">
      {/* Editor Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white font-mono">
            {'full_name' in file ? file.full_name : file.name}
          </h3>
          {'path' in file && (
            <p className="text-xs text-gray-500 font-mono">{file.path}</p>
          )}
        </div>
        <div className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">
          {file.content.length} characters
        </div>
      </div>

      {/* Compilation Error */}
      {compilationError && (
        <div className="px-4 py-3 bg-red-500/10 border-b border-red-500/30 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-red-400 mb-1">Compilation Error</h4>
            <pre className="text-xs text-red-300 whitespace-pre-wrap font-mono bg-black/30 p-2 rounded max-h-32 overflow-y-auto">
              {compilationError}
            </pre>
          </div>
        </div>
      )}

      {/* AI Suggestions */}
      {aiSuggestions && (
        <div className="px-4 py-3 bg-blue-500/10 border-b border-blue-500/30 flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
              AI Suggestions
              <span className="px-2 py-0.5 text-xs bg-blue-500/20 rounded-full">Powered by Gemini</span>
            </h4>
            <div className="text-sm text-blue-200 whitespace-pre-wrap bg-black/30 p-3 rounded max-h-64 overflow-y-auto">
              {aiSuggestions}
            </div>
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
          className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none bg-black text-gray-300 caret-red-400"
          style={{
            lineHeight: '1.6',
            tabSize: 4,
          }}
          spellCheck={false}
          placeholder="Start typing your LaTeX code..."
        />
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-black/50 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <span className="font-mono">Lines: {file.content.split('\n').length}</span>
          <span className="font-mono">Type: {file.name.split('.').pop()?.toUpperCase() || 'TEX'}</span>
          {'is_main' in file && file.is_main && (
            <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-semibold">
              Main Document
            </span>
          )}
        </div>
        {'updated_at' in file && file.updated_at && (
          <div className="font-mono">
            Last updated: {new Date(file.updated_at).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
});

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;
