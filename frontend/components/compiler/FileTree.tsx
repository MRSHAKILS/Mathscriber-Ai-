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
          className={`flex items-center space-x-2 px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer transition-all group`}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
        >
          <button onClick={() => toggleFolder(folder.id)} className="hover:text-red-400 text-gray-400">
            {hasChildren && (isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
            {!hasChildren && <div className="w-4" />}
          </button>
          
          {isExpanded ? <FolderOpen className="w-4 h-4 text-red-400" /> : <FolderIcon className="w-4 h-4 text-red-400" />}
          
          <span className="flex-1 text-sm text-gray-300">{folder.name}</span>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCreatingFile({ folderId: folder.id });
              }}
              className="p-1 hover:bg-white/10 rounded"
              title="New file"
            >
              <Plus className="w-3 h-3 text-gray-400" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete folder "${folder.name}"?`)) {
                  onDeleteFolder(folder.id);
                }
              }}
              className="p-1 hover:bg-red-500/20 rounded text-red-400"
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
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer group transition-all ${
          isSelected ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-white border-l-2 border-red-400' : 'hover:bg-white/5 text-gray-300'
        }`}
        style={{ paddingLeft: `${depth * 16 + 32}px` }}
        onClick={() => onFileSelect(file.id)}
      >
        <FileText className="w-4 h-4" />
        <span className="flex-1 text-sm font-mono">{file.full_name}</span>
        {file.is_main && (
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-semibold">Main</span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`Delete file "${file.full_name}"?`)) {
              onDeleteFile(file.id);
            }
          }}
          className="p-1 hover:bg-red-500/20 rounded text-red-400 opacity-0 group-hover:opacity-100"
          title="Delete file"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    );
  };

  return (
    <div className="w-72 bg-black/95 backdrop-blur-xl border-r border-white/10 overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="font-bold text-white">Project Files</h3>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCreatingFile({})}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
            title="New file"
          >
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={() => setCreatingFolder({})}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
            title="New folder"
          >
            <FolderIcon className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* File Tree */}
      <div className="p-2">
        {/* Creating new file */}
        {creatingFile && (
          <div className="mb-3 px-2">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFile();
                if (e.key === 'Escape') setCreatingFile(null);
              }}
              placeholder="File name..."
              className="w-full px-3 py-2 text-sm bg-white/5 border border-red-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              autoFocus
            />
            <div className="flex space-x-2 mt-2">
              <button
                onClick={handleCreateFile}
                className="text-xs bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 py-1.5 rounded-lg hover:shadow-lg hover:shadow-red-500/30 font-semibold"
              >
                Create
              </button>
              <button
                onClick={() => setCreatingFile(null)}
                className="text-xs bg-white/10 text-gray-300 px-3 py-1.5 rounded-lg hover:bg-white/20"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Creating new folder */}
        {creatingFolder && (
          <div className="mb-3 px-2">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFolder();
                if (e.key === 'Escape') setCreatingFolder(null);
              }}
              placeholder="Folder name..."
              className="w-full px-3 py-2 text-sm bg-white/5 border border-red-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              autoFocus
            />
            <div className="flex space-x-2 mt-2">
              <button
                onClick={handleCreateFolder}
                className="text-xs bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 py-1.5 rounded-lg hover:shadow-lg hover:shadow-red-500/30 font-semibold"
              >
                Create
              </button>
              <button
                onClick={() => setCreatingFolder(null)}
                className="text-xs bg-white/10 text-gray-300 px-3 py-1.5 rounded-lg hover:bg-white/20"
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
          <div className="text-center py-12 text-gray-500 text-sm">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30 text-gray-600" />
            <p className="text-gray-400 font-semibold mb-1">No files yet</p>
            <p className="text-xs text-gray-600">Click + to create your first file</p>
          </div>
        )}
      </div>
    </div>
  );
}
