'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { compilerApi, type Project } from '@/lib/compiler-api';
import { Plus, Folder, Clock, Trash2, Copy, ExternalLink } from 'lucide-react';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await compilerApi.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    try {
      const project = await compilerApi.createProject({
        name: newProjectName.trim(),
        description: newProjectDesc.trim(),
        is_public: false,
      });

      setProjects([project, ...projects]);
      setCreating(false);
      setNewProjectName('');
      setNewProjectDesc('');

      // Navigate to editor
      router.push(`/editor?project=${project.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    }
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (!confirm(`Delete project "${name}"? This cannot be undone.`)) return;

    try {
      await compilerApi.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project.');
    }
  };

  const handleCloneProject = async (id: string) => {
    try {
      const cloned = await compilerApi.cloneProject(id);
      setProjects([cloned, ...projects]);
    } catch (error) {
      console.error('Error cloning project:', error);
      alert('Failed to clone project.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-neutral-800 mb-2">LaTeX Projects</h1>
            <p className="text-neutral-600">Create and manage your LaTeX documents</p>
          </div>
          <button
            onClick={() => setCreating(true)}
            className="flex items-center space-x-2 bg-primary-500 text-white px-6 py-3 rounded-xl shadow-neu hover:shadow-neu-lg transition-all hover:bg-primary-600"
          >
            <Plus className="w-5 h-5" />
            <span>New Project</span>
          </button>
        </div>

        {/* Create Project Modal */}
        {creating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">Create New Project</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="My Thesis"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                    placeholder="A brief description of your project..."
                    rows={3}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={handleCreateProject}
                    disabled={!newProjectName.trim()}
                    className="flex-1 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Create Project
                  </button>
                  <button
                    onClick={() => {
                      setCreating(false);
                      setNewProjectName('');
                      setNewProjectDesc('');
                    }}
                    className="flex-1 bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <Folder className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">No projects yet</h3>
            <p className="text-neutral-600 mb-6">Create your first LaTeX project to get started</p>
            <button
              onClick={() => setCreating(true)}
              className="inline-flex items-center space-x-2 bg-primary-500 text-white px-6 py-3 rounded-xl shadow-neu hover:shadow-neu-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Create Project</span>
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-neutral-100 rounded-2xl p-6 shadow-neu hover:shadow-neu-lg transition-all cursor-pointer group"
              >
                <div
                  onClick={() => router.push(`/editor?project=${project.id}`)}
                  className="mb-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Folder className="w-8 h-8 text-primary-500" />
                    <span className="text-xs bg-neutral-200 text-neutral-600 px-2 py-1 rounded">
                      {project.files_count || 0} files
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2 group-hover:text-primary-600 transition-colors">
                    {project.name}
                  </h3>
                  
                  {project.description && (
                    <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  <div className="flex items-center text-xs text-neutral-500 space-x-4">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(project.updated_at).toLocaleDateString()}</span>
                    </span>
                    {project.is_public && (
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        Public
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-3 border-t border-neutral-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/editor?project=${project.id}`);
                    }}
                    className="flex-1 flex items-center justify-center space-x-1 bg-primary-500 text-white px-3 py-2 rounded-lg hover:bg-primary-600 transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open</span>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloneProject(project.id);
                    }}
                    className="p-2 bg-neutral-200 hover:bg-neutral-300 rounded-lg transition-colors"
                    title="Clone project"
                  >
                    <Copy className="w-4 h-4 text-neutral-700" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id, project.name);
                    }}
                    className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
