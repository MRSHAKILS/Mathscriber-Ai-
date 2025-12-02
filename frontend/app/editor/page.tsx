'use client';

import { useState, useRef, useEffect } from 'react';
import CodeEditor, { type CodeEditorRef } from '@/components/compiler/CodeEditor';
import PDFPreview from '@/components/compiler/PDFPreview';
import LatexToolbar from '@/components/compiler/LatexToolbar';
import { compilerApi } from '@/lib/compiler-api';
import { FileText, Folder, ChevronRight, ChevronDown } from 'lucide-react';

const DEFAULT_CONTENT = `\\documentclass{article}

% Math packages for equations
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{amsfonts}
\\usepackage{mathtools}

% Table packages
\\usepackage{array}
\\usepackage{tabularx}
\\usepackage{booktabs}
\\usepackage{multirow}
\\usepackage{longtable}

% Graphics and diagrams
\\usepackage{graphicx}
\\usepackage{tikz}
\\usetikzlibrary{shapes,arrows,positioning,calc,patterns,decorations.pathmorphing,decorations.markings}

% Other useful packages
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{xcolor}
\\usepackage{hyperref}

\\title{My Document}
\\author{Your Name}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Introduction}

Welcome to your LaTeX document! This template includes support for:
\\begin{itemize}
    \\item Advanced mathematical equations
    \\item Complex tables
    \\item TikZ diagrams
    \\item And much more!
\\end{itemize}

\\section{Example Equation}

Einstein's famous equation:
\\begin{equation}
    E = mc^2
\\end{equation}

\\section{Example Table}

\\begin{table}[h]
\\centering
\\begin{tabular}{lcc}
\\toprule
Item & Quantity & Price \\\\
\\midrule
Apples & 5 & \\$2.50 \\\\
Oranges & 3 & \\$1.80 \\\\
\\bottomrule
\\end{tabular}
\\caption{Sample table}
\\end{table}

\\end{document}`;

type FileNode = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
};

export default function EditorPage() {
  const codeEditorRef = useRef<CodeEditorRef>(null);

  const [currentFile, setCurrentFile] = useState({ 
    name: 'document.tex', 
    content: DEFAULT_CONTENT 
  });
  const [isCompiling, setIsCompiling] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [compilationError, setCompilationError] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);
  const [files, setFiles] = useState<FileNode[]>([
    { id: '1', name: 'document.tex', type: 'file', content: DEFAULT_CONTENT },
    { id: '2', name: 'references.bib', type: 'file', content: '% Bibliography\n' },
    { 
      id: '3', 
      name: 'chapters', 
      type: 'folder', 
      children: [
        { id: '3-1', name: 'introduction.tex', type: 'file', content: '\\chapter{Introduction}\n' },
        { id: '3-2', name: 'conclusion.tex', type: 'file', content: '\\chapter{Conclusion}\n' }
      ]
    }
  ]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['3']));
  
  // Resizable panels state
  const [fileTreeWidth, setFileTreeWidth] = useState(256); // 256px = w-64
  const [isResizingFileTree, setIsResizingFileTree] = useState(false);
  const [editorWidth, setEditorWidth] = useState(45); // percentage
  const [isResizingEditor, setIsResizingEditor] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isToolbarOpen, setIsToolbarOpen] = useState(true);

  // Function to clean LaTeX code from API responses
  const cleanLatexCode = (code: string): string => {
    let cleaned = code;
    
    // Remove markdown code blocks
    cleaned = cleaned.replace(/```latex\n?/gi, '');
    cleaned = cleaned.replace(/```tex\n?/gi, '');
    cleaned = cleaned.replace(/```\n?/g, '');
    
    // Remove common markdown formatting
    cleaned = cleaned.replace(/^#+\s+.+$/gm, ''); // Remove markdown headers
    cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, '$1'); // Remove bold
    cleaned = cleaned.replace(/\*(.+?)\*/g, '$1'); // Remove italic
    
    // Remove "Here's the LaTeX code" type phrases
    cleaned = cleaned.replace(/^(Here'?s?|This is|The) (the )?LaTeX( code)?:?\s*/gim, '');
    cleaned = cleaned.replace(/^LaTeX code:?\s*/gim, '');
    
    // Remove HTML tags if any
    cleaned = cleaned.replace(/<[^>]+>/g, '');
    
    // Clean up extra whitespace
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n'); // Max 2 consecutive newlines
    cleaned = cleaned.trim();
    
    return cleaned;
  };

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check for LaTeX code from upload page
  useEffect(() => {
    const latexToInsert = sessionStorage.getItem('latexToInsert');
    if (latexToInsert) {
      // Clear it immediately
      sessionStorage.removeItem('latexToInsert');
      
      // Clean the LaTeX code before inserting
      const cleanedLatex = cleanLatexCode(latexToInsert);
      
      // Wait for editor to be ready, then insert
      setTimeout(() => {
        if (codeEditorRef.current && cleanedLatex) {
          codeEditorRef.current.insertAtCursor(cleanedLatex, 0);
        }
      }, 500);
    }
  }, []);

  // Handle file tree resize
  const handleFileTreeMouseDown = () => {
    setIsResizingFileTree(true);
  };

  const handleFileTreeMouseMove = (e: MouseEvent) => {
    if (isResizingFileTree) {
      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 400) {
        setFileTreeWidth(newWidth);
      }
    }
  };

  const handleFileTreeMouseUp = () => {
    setIsResizingFileTree(false);
  };

  // Handle editor/pdf resize
  const handleEditorMouseDown = () => {
    setIsResizingEditor(true);
  };

  const handleEditorMouseMove = (e: MouseEvent) => {
    if (isResizingEditor) {
      const container = document.getElementById('editor-container');
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const newPercentage = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        if (newPercentage >= 30 && newPercentage <= 70) {
          setEditorWidth(newPercentage);
        }
      }
    }
  };

  const handleEditorMouseUp = () => {
    setIsResizingEditor(false);
  };

  // Add/remove event listeners for resizing
  useEffect(() => {
    if (isResizingFileTree) {
      document.addEventListener('mousemove', handleFileTreeMouseMove as any);
      document.addEventListener('mouseup', handleFileTreeMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleFileTreeMouseMove as any);
      document.removeEventListener('mouseup', handleFileTreeMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleFileTreeMouseMove as any);
      document.removeEventListener('mouseup', handleFileTreeMouseUp);
    };
  }, [isResizingFileTree]);

  useEffect(() => {
    if (isResizingEditor) {
      document.addEventListener('mousemove', handleEditorMouseMove as any);
      document.addEventListener('mouseup', handleEditorMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleEditorMouseMove as any);
      document.removeEventListener('mouseup', handleEditorMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleEditorMouseMove as any);
      document.removeEventListener('mouseup', handleEditorMouseUp);
    };
  }, [isResizingEditor]);

  const handleFileContentChange = (content: string) => {
    setCurrentFile(prev => ({ ...prev, content }));
  };

  const handleCompile = async () => {
    if (!currentFile?.content || isCompiling) return;

    try {
      setIsCompiling(true);
      setCompilationError(null);

      console.log('Compiling LaTeX...');
      console.log('Content length:', currentFile.content.length);
      console.log('File name:', currentFile.name);

      // Use direct compile endpoint
      const result = await compilerApi.compileDirect(currentFile.content, currentFile.name || 'document');

      console.log('Compilation result:', result);

      if (result.status === 'success' && result.pdf_data) {
        // Convert base64 to blob URL
        const pdfBlob = base64ToBlob(result.pdf_data, 'application/pdf');
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
        setCompilationError(null);
        setAiSuggestions(null);
      } else if (result.status === 'error') {
        console.error('Compilation error:', result.error_log);
        setCompilationError(result.error_log || 'Compilation failed');
        setAiSuggestions(result.ai_suggestions || null);
        setPdfUrl(null);
      }
    } catch (error: any) {
      console.error('Compilation error:', error);
      console.error('Error response:', error.response?.data);
      const errorMsg = error.response?.data?.error_log 
        || error.response?.data?.error
        || error.response?.data?.errors?.join('\n')
        || error.message 
        || 'Compilation failed';
      setCompilationError(errorMsg);
      setAiSuggestions(error.response?.data?.ai_suggestions || null);
      setPdfUrl(null);
    } finally {
      setIsCompiling(false);
    }
  };

  const base64ToBlob = (base64: string, contentType: string = ''): Blob => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  };

  const handleDownloadPDF = async () => {
    if (!pdfUrl) return;

    try {
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = 'document.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const handleInsertLatex = (code: string, cursorOffset?: number) => {
    if (codeEditorRef.current) {
      codeEditorRef.current.insertAtCursor(code, cursorOffset);
    }
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const handleFileSelect = (file: FileNode) => {
    if (file.type === 'file' && file.content !== undefined) {
      setCurrentFile({ name: file.name, content: file.content });
      setPdfUrl(null);
      setCompilationError(null);
      setAiSuggestions(null);
    }
  };

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map(node => (
      <div key={node.id}>
        {node.type === 'folder' ? (
          <>
            <button
              onClick={() => toggleFolder(node.id)}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
              style={{ paddingLeft: `${depth * 12 + 12}px` }}
            >
              {expandedFolders.has(node.id) ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
              <Folder className="w-4 h-4 text-yellow-500" />
              <span>{node.name}</span>
            </button>
            {expandedFolders.has(node.id) && node.children && (
              <div>{renderFileTree(node.children, depth + 1)}</div>
            )}
          </>
        ) : (
          <button
            onClick={() => handleFileSelect(node)}
            className={`w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
              currentFile.name === node.name
                ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-white'
                : 'text-gray-300 hover:bg-white/5'
            }`}
            style={{ paddingLeft: `${depth * 12 + 36}px` }}
          >
            <FileText className="w-4 h-4 text-gray-500" />
            <span>{node.name}</span>
          </button>
        )}
      </div>
    ));
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-6 py-3 sm:py-4 bg-black border-b border-white/10 gap-3 sm:gap-0">
        <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
          <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            LaTeX Editor
          </h1>
          <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-400 bg-white/5 rounded-lg truncate max-w-[150px] sm:max-w-none">
            {currentFile.name}
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          <button
            onClick={() => setIsToolbarOpen(!isToolbarOpen)}
            className="px-3 py-2 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center space-x-2"
            title={isToolbarOpen ? 'Hide LaTeX Tools' : 'Show LaTeX Tools'}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="hidden sm:inline">{isToolbarOpen ? 'Hide' : 'Show'} Tools</span>
          </button>
          
          <button
            onClick={handleCompile}
            disabled={isCompiling}
            className="px-3 sm:px-6 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base flex-1 sm:flex-initial justify-center"
          >
            {isCompiling ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span className="hidden sm:inline">Compiling...</span>
                <span className="sm:hidden">...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Compile</span>
              </>
            )}
          </button>

          {pdfUrl && (
            <button
              onClick={handleDownloadPDF}
              className="px-3 sm:px-6 py-2 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base flex-1 sm:flex-initial justify-center"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* File Tree Sidebar - Resizable - Hidden on mobile */}
        <div 
          className="hidden lg:flex bg-black/50 border-r border-white/10 flex-col"
          style={{ width: `${fileTreeWidth}px`, minWidth: '200px', maxWidth: '400px' }}
        >
          <div className="px-4 py-3 border-b border-white/10">
            <h3 className="text-sm font-semibold text-white">Project Files</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {renderFileTree(files)}
          </div>
        </div>

        {/* File Tree Resize Handle - Hidden on mobile */}
        <div
          className="hidden lg:block w-1 bg-white/5 hover:bg-red-500/50 cursor-col-resize transition-colors flex-shrink-0 relative group"
          onMouseDown={handleFileTreeMouseDown}
        >
          <div className="absolute inset-y-0 -left-1 -right-1" />
        </div>

        {/* Editor and PDF Container - Stack on mobile, side-by-side on larger screens */}
        <div id="editor-container" className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Code Editor - Full width on mobile, resizable on desktop */}
          <div 
            className="flex flex-col min-w-0 w-full md:w-auto"
            style={{ width: isMobile ? '100%' : `${editorWidth}%` }}
          >
            <CodeEditor
              ref={codeEditorRef}
              file={currentFile}
              onChange={handleFileContentChange}
              compilationError={compilationError}
              aiSuggestions={aiSuggestions}
            />
          </div>

          {/* Editor/PDF Resize Handle - Hidden on mobile */}
          <div
            className="hidden md:block w-1 bg-white/5 hover:bg-red-500/50 cursor-col-resize transition-colors flex-shrink-0 relative group"
            onMouseDown={handleEditorMouseDown}
          >
            <div className="absolute inset-y-0 -left-1 -right-1" />
          </div>

          {/* PDF Preview - Hidden on small mobile, shown on medium+ */}
          <div 
            className="hidden md:flex border-l border-white/10 flex-col w-full md:w-auto"
            style={{ width: isMobile ? '100%' : `${100 - editorWidth}%` }}
          >
            <PDFPreview
              pdfUrl={pdfUrl}
              isCompiling={isCompiling}
              error={compilationError}
            />
          </div>
        </div>

        {/* LaTeX Toolbar Sidebar - Right side, toggleable */}
        {isToolbarOpen && (
          <div className="hidden md:block">
            <LatexToolbar onInsertCode={handleInsertLatex} />
          </div>
        )}
      </div>
    </div>
  );
}
