
import React, { useState } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import FileUploadForm from './FileUploadForm';
import ScreenshotManager from './ScreenshotManager';

interface ProjectUploadFormProps {
  onClose: () => void;
  project?: any;
  isEditing?: boolean;
}

const ProjectUploadForm: React.FC<ProjectUploadFormProps> = ({ onClose, project, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    image_url: project?.image_url || '',
    download_link: project?.download_link || '',
    live_link: project?.live_link || '',
    kpi_notes: project?.kpi_notes || '',
    tech_stack: project?.tech_stack || ['']
  });
  const [loading, setLoading] = useState(false);
  const [showScreenshotManager, setShowScreenshotManager] = useState(false);
  const { createProject, updateProject } = useProjects();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const cleanedData = {
        ...formData,
        tech_stack: formData.tech_stack.filter(tech => tech.trim() !== '')
      };
      
      if (isEditing && project) {
        await updateProject(project.id, cleanedData);
      } else {
        const newProject = await createProject(cleanedData);
        if (newProject && cleanedData.image_url) {
          setShowScreenshotManager(true);
          return; // Don't close the form yet if we want to add screenshots
        }
      }
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTechStackItem = () => {
    setFormData({
      ...formData,
      tech_stack: [...formData.tech_stack, '']
    });
  };

  const removeTechStackItem = (index: number) => {
    const newTechStack = formData.tech_stack.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      tech_stack: newTechStack.length === 0 ? [''] : newTechStack
    });
  };

  const updateTechStackItem = (index: number, value: string) => {
    const newTechStack = [...formData.tech_stack];
    newTechStack[index] = value;
    setFormData({
      ...formData,
      tech_stack: newTechStack
    });
  };

  const handleImageUpload = (url: string) => {
    setFormData({ ...formData, image_url: url });
  };

  const handleFileUpload = (url: string) => {
    setFormData({ ...formData, download_link: url });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-[9999] animate-fadeInUp">
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/50">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Edit Project' : 'Upload New Project'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 bg-slate-900/50">
          {showScreenshotManager && project ? (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Project Created Successfully!</h3>
                <p className="text-slate-300 mb-6">Now you can add screenshots and manage your project.</p>
              </div>
              <ScreenshotManager projectId={project.id} />
              <div className="flex justify-center">
                <button
                  onClick={onClose}
                  className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  Finish
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Enter project title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
                  placeholder="Describe your project..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  KPI Notes & Key Insights
                </label>
                <textarea
                  value={formData.kpi_notes}
                  onChange={(e) => setFormData({...formData, kpi_notes: e.target.value})}
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
                  placeholder="Add key performance indicators, insights, results, impact metrics, or any important notes about this project..."
                />
              </div>

              <FileUploadForm
                onFileUploaded={handleImageUpload}
                accept="image/*"
                bucket="project-images"
                folder="thumbnails"
                label="Project Thumbnail"
              />

              {formData.image_url && (
                <div className="mt-2">
                  <img 
                    src={formData.image_url} 
                    alt="Preview" 
                    className="w-full h-32 object-cover rounded-lg border border-slate-600/50"
                  />
                </div>
              )}

              <FileUploadForm
                onFileUploaded={handleFileUpload}
                bucket="project-files"
                folder="downloads"
                label="Project Files"
              />

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Live Demo Link (Optional)
                </label>
                <input
                  type="url"
                  value={formData.live_link}
                  onChange={(e) => setFormData({...formData, live_link: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tech Stack
                </label>
                <div className="space-y-3">
                  {formData.tech_stack.map((tech, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={tech}
                        onChange={(e) => updateTechStackItem(index, e.target.value)}
                        className="flex-1 px-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        placeholder="e.g., Python, Excel, Power BI"
                      />
                      {formData.tech_stack.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTechStackItem(index)}
                          className="p-3 text-red-400 hover:text-red-300 hover:bg-slate-700/50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTechStackItem}
                    className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors px-2 py-1 hover:bg-slate-700/30 rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Add Technology</span>
                  </button>
                </div>
              </div>

              {isEditing && project && (
                <div className="border-t border-slate-700/50 pt-6">
                  <ScreenshotManager projectId={project.id} />
                </div>
              )}

              <div className="flex space-x-4 pt-6 border-t border-slate-700/50">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg transition-colors duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 font-medium"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>{isEditing ? 'Update Project' : 'Upload Project'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectUploadForm;
