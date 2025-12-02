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
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-3">
                LaTeX Projects
              </h1>
              <p className="text-gray-400 text-lg">Create and manage your LaTeX documents</p>
            </div>
            <button
              onClick={() => setCreating(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/50 transition-all hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">New Project</span>
            </button>
          </div>

          {/* Create Project Modal */}
          {creating && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4">
                  Create New Project
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newProjectName.trim()) handleCreateProject();
                        if (e.key === 'Escape') setCreating(false);
                      }}
                      placeholder="My Thesis"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description (optional)
                    </label>
                    <textarea
                      value={newProjectDesc}
                      onChange={(e) => setNewProjectDesc(e.target.value)}
                      placeholder="A brief description of your project..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={handleCreateProject}
                      disabled={!newProjectName.trim()}
                      className="flex-1 bg-gradient-to-r from-red-600 to-orange-500 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-red-500/30 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed disabled:shadow-none transition-all font-semibold"
                    >
                      Create Project
                    </button>
                    <button
                      onClick={() => {
                        setCreating(false);
                        setNewProjectName('');
                        setNewProjectDesc('');
                      }}
                      className="flex-1 bg-white/10 text-gray-300 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
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
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/10"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500 absolute top-0 left-0"></div>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl">
              <Folder className="w-20 h-20 text-red-400/50 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-3">No projects yet</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Create your first LaTeX project to start compiling beautiful documents
              </p>
              <button
                onClick={() => setCreating(true)}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-4 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/50 transition-all hover:scale-105 font-semibold"
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
                  className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-6 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/20 transition-all cursor-pointer group"
                >
                  <div
                    onClick={() => router.push(`/editor?project=${project.id}`)}
                    className="mb-4"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 group-hover:from-red-500/30 group-hover:to-orange-500/30 transition-all">
                        <Folder className="w-7 h-7 text-red-400" />
                      </div>
                      <span className="text-xs bg-white/10 text-gray-300 px-3 py-1.5 rounded-full font-medium">
                        {project.files_count || 0} files
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors line-clamp-1">
                      {project.name}
                    </h3>
                    
                    {project.description && (
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2 min-h-[2.5rem]">
                        {project.description}
                      </p>
                    )}

                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                      <span className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(project.updated_at).toLocaleDateString()}</span>
                      </span>
                      {project.is_public && (
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded font-medium">
                          Public
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-4 border-t border-white/10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/editor?project=${project.id}`);
                      }}
                      className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-3 py-2.5 rounded-lg hover:shadow-lg hover:shadow-red-500/30 transition-all text-sm font-semibold"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open</span>
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloneProject(project.id);
                      }}
                      className="p-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      title="Clone project"
                    >
                      <Copy className="w-4 h-4 text-gray-300" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id, project.name);
                      }}
                      className="p-2.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
