'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import EditorLayout from '@/components/compiler/EditorLayout';
import FileTree from '@/components/compiler/FileTree';
import CodeEditor from '@/components/compiler/CodeEditor';
import PDFPreview from '@/components/compiler/PDFPreview';
import { compilerApi, type Project, type LatexFile, type ProjectTree } from '@/lib/compiler-api';

export default function EditorPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams?.get('project');

  const [project, setProject] = useState<Project | null>(null);
  const [projectTree, setProjectTree] = useState<ProjectTree | null>(null);
  const [currentFile, setCurrentFile] = useState<LatexFile | null>(null);
  const [autoCompile, setAutoCompile] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [compilationError, setCompilationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load project and tree
  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
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
        setCompilationError(null);
      } else if (result.status === 'error') {
        setCompilationError(result.error_log || 'Compilation failed');
        setPdfUrl(null);
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
    if (!pdfUrl) return;

    try {
      // Extract compilation ID from URL
      const compilationId = pdfUrl.split('/').filter(Boolean).pop()?.split('.')[0];
      if (!compilationId) return;

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project || !projectTree) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Project not found</h2>
          <p className="text-neutral-600">The project you're looking for doesn't exist.</p>
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
      </div>
    </EditorLayout>
  );
}
