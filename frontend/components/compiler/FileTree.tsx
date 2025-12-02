'use client';

import { useState } from 'react';
import { type ProjectTree, type Folder, type LatexFile } from '@/lib/compiler-api';
import {
  Folder as FolderIcon,
  FolderOpen,
  File,
  FileText,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
} from 'lucide-react';

interface FileTreeProps {
  projectTree: ProjectTree;
  currentFileId?: string;
  onFileSelect: (fileId: string) => void;
  onCreateFile: (name: string, folderId?: string) => void;
  onCreateFolder: (name: string, parentId?: string) => void;
  onDeleteFile: (fileId: string) => void;
  onDeleteFolder: (folderId: string) => void;
}

export default function FileTree({
  projectTree,
  currentFileId,
  onFileSelect,
  onCreateFile,
  onCreateFolder,
  onDeleteFile,
  onDeleteFolder,
}: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [creatingFile, setCreatingFile] = useState<{ folderId?: string } | null>(null);
  const [creatingFolder, setCreatingFolder] = useState<{ parentId?: string } | null>(null);
  const [newItemName, setNewItemName] = useState('');

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleCreateFile = () => {
    if (newItemName.trim()) {
      onCreateFile(newItemName.trim(), creatingFile?.folderId);
      setCreatingFile(null);
      setNewItemName('');
    }
  };

  const handleCreateFolder = () => {
    if (newItemName.trim()) {
      onCreateFolder(newItemName.trim(), creatingFolder?.parentId);
      setCreatingFolder(null);
      setNewItemName('');
    }
  };

  const renderFolder = (folder: Folder, depth: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const hasChildren = folder.subfolders.length > 0 || folder.files_count > 0;

    return (
      <div key={folder.id}>
        <div
          className={`flex items-center space-x-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          <button onClick={() => toggleFolder(folder.id)} className="hover:text-primary-500">
            {hasChildren && (isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
            {!hasChildren && <div className="w-4" />}
          </button>
          
          {isExpanded ? <FolderOpen className="w-4 h-4 text-primary-500" /> : <FolderIcon className="w-4 h-4 text-primary-500" />}
          
          <span className="flex-1 text-sm text-neutral-700">{folder.name}</span>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCreatingFile({ folderId: folder.id });
              }}
              className="p-1 hover:bg-neutral-200 rounded"
              title="New file"
            >
              <Plus className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete folder "${folder.name}"?`)) {
                  onDeleteFolder(folder.id);
                }
              }}
              className="p-1 hover:bg-red-100 rounded text-red-500"
              title="Delete folder"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {isExpanded && (
          <>
            {/* Render subfolders */}
            {folder.subfolders.map((subfolder) => renderFolder(subfolder, depth + 1))}
            
            {/* Render files in folder - would need to fetch from API */}
          </>
        )}
      </div>
    );
  };

  const renderFile = (file: LatexFile, depth: number = 0) => {
    const isSelected = file.id === currentFileId;

    return (
      <div
        key={file.id}
        className={`flex items-center space-x-2 px-2 py-1.5 rounded cursor-pointer group ${
          isSelected ? 'bg-primary-100 text-primary-700' : 'hover:bg-neutral-100'
        }`}
        style={{ paddingLeft: `${depth * 16 + 24}px` }}
        onClick={() => onFileSelect(file.id)}
      >
        <FileText className="w-4 h-4" />
        <span className="flex-1 text-sm">{file.full_name}</span>
        {file.is_main && (
          <span className="text-xs bg-primary-200 text-primary-700 px-1.5 py-0.5 rounded">Main</span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`Delete file "${file.full_name}"?`)) {
              onDeleteFile(file.id);
            }
          }}
          className="p-1 hover:bg-red-100 rounded text-red-500 opacity-0 group-hover:opacity-100"
          title="Delete file"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-neutral-200 overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
        <h3 className="font-semibold text-neutral-800">Files</h3>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCreatingFile({})}
            className="p-1.5 hover:bg-neutral-100 rounded"
            title="New file"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCreatingFolder({})}
            className="p-1.5 hover:bg-neutral-100 rounded"
            title="New folder"
          >
            <FolderIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* File Tree */}
      <div className="p-2">
        {/* Creating new file */}
        {creatingFile && (
          <div className="mb-2 px-2">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFile();
                if (e.key === 'Escape') setCreatingFile(null);
              }}
              placeholder="File name..."
              className="w-full px-2 py-1 text-sm border border-primary-500 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
            <div className="flex space-x-2 mt-1">
              <button
                onClick={handleCreateFile}
                className="text-xs bg-primary-500 text-white px-2 py-1 rounded hover:bg-primary-600"
              >
                Create
              </button>
              <button
                onClick={() => setCreatingFile(null)}
                className="text-xs bg-neutral-200 text-neutral-700 px-2 py-1 rounded hover:bg-neutral-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Creating new folder */}
        {creatingFolder && (
          <div className="mb-2 px-2">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFolder();
                if (e.key === 'Escape') setCreatingFolder(null);
              }}
              placeholder="Folder name..."
              className="w-full px-2 py-1 text-sm border border-primary-500 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
            <div className="flex space-x-2 mt-1">
              <button
                onClick={handleCreateFolder}
                className="text-xs bg-primary-500 text-white px-2 py-1 rounded hover:bg-primary-600"
              >
                Create
              </button>
              <button
                onClick={() => setCreatingFolder(null)}
                className="text-xs bg-neutral-200 text-neutral-700 px-2 py-1 rounded hover:bg-neutral-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Root folders */}
        {projectTree.folders.map((folder) => renderFolder(folder))}

        {/* Root files */}
        {projectTree.root_files.map((file) => renderFile(file))}

        {/* Empty state */}
        {projectTree.folders.length === 0 && projectTree.root_files.length === 0 && (
          <div className="text-center py-8 text-neutral-500 text-sm">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No files yet</p>
            <p className="text-xs">Click + to create a file</p>
          </div>
        )}
      </div>
    </div>
  );
}
