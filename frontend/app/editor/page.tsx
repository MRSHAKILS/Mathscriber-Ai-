'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import EditorLayout from '@/components/compiler/EditorLayout';
import FileTree from '@/components/compiler/FileTree';
import CodeEditor, { type CodeEditorRef } from '@/components/compiler/CodeEditor';
import PDFPreview from '@/components/compiler/PDFPreview';
import LatexToolbar from '@/components/compiler/LatexToolbar';
import { compilerApi, type Project, type LatexFile, type ProjectTree } from '@/lib/compiler-api';

export default function EditorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams?.get('project');
  const codeEditorRef = useRef<CodeEditorRef>(null);

  const [project, setProject] = useState<Project | null>(null);
  const [projectTree, setProjectTree] = useState<ProjectTree | null>(null);
  const [currentFile, setCurrentFile] = useState<LatexFile | null>(null);
  const [autoCompile, setAutoCompile] = useState(false);
  const [compilationId, setCompilationId] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [compilationError, setCompilationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load project and tree
  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    } else {
      // No project ID provided, stop loading
      setLoading(false);
    }
  }, [projectId]);

  const loadProject = async (id: string) => {
    try {
      setLoading(true);
      const [projectData, treeData] = await Promise.all([
        compilerApi.getProject(id),
        compilerApi.getProjectTree(id),
      ]);
      
      setProject(projectData);
      setProjectTree(treeData);

      // Select first file or main file
      const mainFile = treeData.root_files.find(f => f.is_main);
      const firstFile = mainFile || treeData.root_files[0];
      
      if (firstFile) {
        setCurrentFile(firstFile);
      }
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (fileId: string) => {
    try {
      const file = await compilerApi.getFile(fileId);
      setCurrentFile(file);
      setPdfUrl(null);
      setCompilationError(null);
    } catch (error) {
      console.error('Error loading file:', error);
    }
  };

  const handleFileContentChange = async (content: string) => {
    if (!currentFile) return;

    const updatedFile = { ...currentFile, content };
    setCurrentFile(updatedFile);

    // Auto-save to server (debounced)
    try {
      await compilerApi.updateFile(currentFile.id, { content });
    } catch (error) {
      console.error('Error saving file:', error);
    }

    // Auto-compile if enabled
    if (autoCompile) {
      handleCompile();
    }
  };

  const handleCompile = async () => {
    if (!currentFile || isCompiling) return;

    try {
      setIsCompiling(true);
      setCompilationError(null);

      const result = await compilerApi.compileFile(currentFile.id);

      if (result.status === 'success' && result.pdf_url) {
        setPdfUrl(result.pdf_url);
        setCompilationId(result.id.toString());
        setCompilationError(null);
      } else if (result.status === 'error') {
        setCompilationError(result.error_log || 'Compilation failed');
        setPdfUrl(null);
        setCompilationId(null);
      }
    } catch (error: any) {
      console.error('Compilation error:', error);
      setCompilationError(error.response?.data?.error_log || 'Compilation failed');
      setPdfUrl(null);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!compilationId) return;

    try {
      const blob = await compilerApi.downloadPDF(compilationId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentFile?.name || 'document'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
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

  const handleCreateFile = async (name: string, folderId?: string) => {
    if (!projectId) return;

    try {
      const newFile = await compilerApi.createFileFromTemplate({
        project: projectId,
        folder: folderId,
        name,
        file_type: 'tex',
      });

      // Reload tree
      if (projectId) {
        loadProject(projectId);
      }

      // Select new file
      setCurrentFile(newFile);
    } catch (error) {
      console.error('Error creating file:', error);
    }
  };

  const handleCreateFolder = async (name: string, parentId?: string) => {
    if (!projectId) return;

    try {
      await compilerApi.createFolder({
        project: projectId,
        parent: parentId,
        name,
      });

      // Reload tree
      if (projectId) {
        loadProject(projectId);
      }
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await compilerApi.deleteFile(fileId);

      // Clear current file if it was deleted
      if (currentFile?.id === fileId) {
        setCurrentFile(null);
        setPdfUrl(null);
      }

      // Reload tree
      if (projectId) {
        loadProject(projectId);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      await compilerApi.deleteFolder(folderId);

      // Reload tree
      if (projectId) {
        loadProject(projectId);
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/10 mx-auto"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500 absolute top-0 left-1/2 -ml-8"></div>
          </div>
          <p className="text-gray-400 text-lg font-medium">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!projectId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12">
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 inline-block">
            <svg className="w-20 h-20 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">No Project Selected</h2>
          <p className="text-gray-400 mb-8 text-lg">Please select a project to start editing LaTeX documents.</p>
          <button
            onClick={() => router.push('/projects')}
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-red-500/50 transition-all hover:scale-105"
          >
            Browse Projects
          </button>
        </div>
      </div>
    );
  }

  if (!project || !projectTree) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12">
          <div className="mb-8 p-6 rounded-2xl bg-red-500/20 inline-block">
            <svg className="w-20 h-20 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Project not found</h2>
          <p className="text-gray-400 mb-8 text-lg">The project you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/projects')}
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-red-500/50 transition-all hover:scale-105"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <EditorLayout
      project={project}
      currentFile={currentFile}
      autoCompile={autoCompile}
      onAutoCompileToggle={setAutoCompile}
      onCompile={handleCompile}
      isCompiling={isCompiling}
      onDownloadPDF={handleDownloadPDF}
      hasPDF={!!pdfUrl}
    >
      <div className="flex h-full">
        {/* File Tree Sidebar */}
        <FileTree
          projectTree={projectTree}
          currentFileId={currentFile?.id}
          onFileSelect={handleFileSelect}
          onCreateFile={handleCreateFile}
          onCreateFolder={handleCreateFolder}
          onDeleteFile={handleDeleteFile}
          onDeleteFolder={handleDeleteFolder}
        />

        {/* Code Editor */}
        <CodeEditor
          ref={codeEditorRef}
          file={currentFile}
          onChange={handleFileContentChange}
          compilationError={compilationError}
        />

        {/* PDF Preview */}
        <PDFPreview
          pdfUrl={pdfUrl}
          isCompiling={isCompiling}
          error={compilationError}
        />

        {/* LaTeX Tools Sidebar */}
        <LatexToolbar onInsertCode={handleInsertLatex} />
      </div>
    </EditorLayout>
  );
}
