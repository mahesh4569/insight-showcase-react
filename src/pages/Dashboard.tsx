
import React, { useState } from 'react';
import { Upload, Plus, Eye, Trash2, Edit3, LogOut } from 'lucide-react';
import DashboardAuth from '../components/DashboardAuth';
import ProjectUploadForm from '../components/ProjectUploadForm';
import { mockProjects } from '../data/projects';

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [projects, setProjects] = useState(mockProjects);

  const handleLogin = (credentials: { username: string; password: string }) => {
    // Simple authentication check (in real app, this would be server-side)
    if (credentials.username === 'admin' && credentials.password === 'password123') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleProjectUpload = (projectData: any) => {
    const newProject = {
      ...projectData,
      id: projects.length + 1,
    };
    setProjects([...projects, newProject]);
    setShowUploadForm(false);
  };

  const handleDeleteProject = (projectId: number) => {
    setProjects(projects.filter(project => project.id !== projectId));
  };

  if (!isAuthenticated) {
    return <DashboardAuth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Project Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowUploadForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Total Projects</h3>
            <p className="text-3xl font-bold text-blue-400">{projects.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Technologies Used</h3>
            <p className="text-3xl font-bold text-purple-400">
              {new Set(projects.flatMap(p => p.techStack)).size}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Published</h3>
            <p className="text-3xl font-bold text-green-400">{projects.length}</p>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <h2 className="text-xl font-bold text-white">Manage Projects</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-4 text-slate-300 font-medium">Project</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Tech Stack</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Status</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="text-white font-medium">{project.title}</h3>
                          <p className="text-slate-400 text-sm">{project.description.slice(0, 50)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {project.techStack.slice(0, 3).map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-600/30 text-blue-300 text-xs rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="px-2 py-1 bg-slate-600/30 text-slate-300 text-xs rounded-full">
                            +{project.techStack.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-green-600/30 text-green-300 text-sm rounded-full">
                        Published
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-slate-400 hover:text-blue-400 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-green-400 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <ProjectUploadForm
          onSubmit={handleProjectUpload}
          onClose={() => setShowUploadForm(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
