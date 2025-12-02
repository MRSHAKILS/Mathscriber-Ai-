import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/compiler';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  owner: string;
  owner_username: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  files_count?: number;
  folders_count?: number;
}

export interface Folder {
  id: string;
  project: string;
  parent: string | null;
  name: string;
  path: string;
  depth: number;
  subfolders: Folder[];
  files_count: number;
  created_at: string;
  updated_at: string;
}

export interface LatexFile {
  id: string;
  project: string;
  folder: string | null;
  name: string;
  file_type: 'tex' | 'bib' | 'cls' | 'sty' | 'txt';
  content: string;
  is_main: boolean;
  full_name: string;
  path: string;
  folder_name: string;
  last_compiled?: string;
  created_at: string;
  updated_at: string;
}

export interface CompilationResult {
  id: string;
  project: string;
  file: string;
  file_name: string;
  status: 'pending' | 'compiling' | 'success' | 'error';
  pdf_file: string | null;
  pdf_url: string | null;
  pdf_data?: string; // Base64 encoded PDF for direct compilation
  error_log: string | null;
  compiled_at: string;
  compilation_time: number | null;
}

export interface FileVersion {
  id: string;
  file: string;
  content: string;
  message: string;
  created_by: string | null;
  created_by_username: string;
  created_at: string;
}

export interface ProjectTree {
  project: Project;
  folders: Folder[];
  root_files: LatexFile[];
}

// API Methods
export const compilerApi = {
  // Projects
  getProjects: async (): Promise<Project[]> => {
    const response = await api.get('/projects/');
    return response.data;
  },

  getProject: async (id: string): Promise<Project> => {
    const response = await api.get(`/projects/${id}/`);
    return response.data;
  },

  createProject: async (data: { name: string; description?: string; is_public?: boolean }): Promise<Project> => {
    const response = await api.post('/projects/', data);
    return response.data;
  },

  updateProject: async (id: string, data: Partial<Project>): Promise<Project> => {
    const response = await api.patch(`/projects/${id}/`, data);
    return response.data;
  },

  deleteProject: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}/`);
  },

  getProjectTree: async (id: string): Promise<ProjectTree> => {
    const response = await api.get(`/projects/${id}/tree/`);
    return response.data;
  },

  cloneProject: async (id: string): Promise<Project> => {
    const response = await api.post(`/projects/${id}/clone/`);
    return response.data;
  },

  // Folders
  getFolders: async (projectId?: string): Promise<Folder[]> => {
    const params = projectId ? { project: projectId } : {};
    const response = await api.get('/folders/', { params });
    return response.data;
  },

  createFolder: async (data: { project: string; parent?: string; name: string }): Promise<Folder> => {
    const response = await api.post('/folders/', data);
    return response.data;
  },

  updateFolder: async (id: string, data: Partial<Folder>): Promise<Folder> => {
    const response = await api.patch(`/folders/${id}/`, data);
    return response.data;
  },

  deleteFolder: async (id: string): Promise<void> => {
    await api.delete(`/folders/${id}/`);
  },

  moveFolder: async (id: string, parentId: string | null): Promise<Folder> => {
    const response = await api.post(`/folders/${id}/move/`, { parent_id: parentId });
    return response.data;
  },

  // Files
  getFiles: async (projectId?: string, folderId?: string): Promise<LatexFile[]> => {
    const params: any = {};
    if (projectId) params.project = projectId;
    if (folderId) params.folder = folderId;
    const response = await api.get('/files/', { params });
    return response.data;
  },

  getFile: async (id: string): Promise<LatexFile> => {
    const response = await api.get(`/files/${id}/`);
    return response.data;
  },

  createFile: async (data: {
    project: string;
    folder?: string;
    name: string;
    file_type?: string;
    content?: string;
    is_main?: boolean;
  }): Promise<LatexFile> => {
    const response = await api.post('/files/', data);
    return response.data;
  },

  createFileFromTemplate: async (data: {
    project: string;
    folder?: string;
    name: string;
    file_type?: string;
  }): Promise<LatexFile> => {
    const response = await api.post('/files/create_from_template/', data);
    return response.data;
  },

  updateFile: async (id: string, data: Partial<LatexFile>, versionMessage?: string): Promise<LatexFile> => {
    const payload = versionMessage ? { ...data, version_message: versionMessage } : data;
    const response = await api.patch(`/files/${id}/`, payload);
    return response.data;
  },

  deleteFile: async (id: string): Promise<void> => {
    await api.delete(`/files/${id}/`);
  },

  moveFile: async (id: string, folderId: string | null): Promise<LatexFile> => {
    const response = await api.post(`/files/${id}/move/`, { folder_id: folderId });
    return response.data;
  },

  compileFile: async (id: string): Promise<CompilationResult> => {
    const response = await api.post(`/files/${id}/compile/`);
    return response.data;
  },

  // Direct compilation without file ID
  compileDirect: async (content: string, name: string = 'document'): Promise<CompilationResult> => {
    const response = await api.post('/compile/', {
      content,
      name
    });
    return response.data;
  },

  getFileVersions: async (id: string): Promise<FileVersion[]> => {
    const response = await api.get(`/files/${id}/versions/`);
    return response.data;
  },

  restoreFileVersion: async (id: string, versionId: string): Promise<LatexFile> => {
    const response = await api.post(`/files/${id}/restore_version/`, { version_id: versionId });
    return response.data;
  },

  // Compilations
  getCompilations: async (projectId?: string): Promise<CompilationResult[]> => {
    const params = projectId ? { project: projectId } : {};
    const response = await api.get('/compilations/', { params });
    return response.data;
  },

  getCompilation: async (id: string): Promise<CompilationResult> => {
    const response = await api.get(`/compilations/${id}/`);
    return response.data;
  },

  downloadPDF: async (id: string): Promise<Blob> => {
    const response = await api.get(`/compilations/${id}/download/`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default compilerApi;
