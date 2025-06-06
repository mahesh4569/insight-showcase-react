
import React, { useState } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import FileUploadForm from './FileUploadForm';

interface ProjectUploadFormProps {
  onClose: () => void;
}

const ProjectUploadForm: React.FC<ProjectUploadFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    download_link: '',
    live_link: '',
    tech_stack: ['']
  });
  const [loading, setLoading] = useState(false);
  const { createProject } = useProjects();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const cleanedData = {
        ...formData,
        tech_stack: formData.tech_stack.filter(tech => tech.trim() !== '')
      };
      await createProject(cleanedData);
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/20 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Upload New Project</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Project Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
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
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none"
              placeholder="Describe your project..."
              required
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
                className="w-full h-32 object-cover rounded-lg"
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
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
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
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    placeholder="e.g., Python, Excel, Power BI"
                  />
                  {formData.tech_stack.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTechStackItem(index)}
                      className="p-3 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTechStackItem}
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Add Technology</span>
              </button>
            </div>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Upload Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectUploadForm;
