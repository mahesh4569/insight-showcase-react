
import React, { useState } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';

interface ProjectUploadFormProps {
  onSubmit: (projectData: any) => void;
  onClose: () => void;
}

const ProjectUploadForm: React.FC<ProjectUploadFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    downloadLink: '',
    liveLink: '',
    techStack: ['']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedData = {
      ...formData,
      techStack: formData.techStack.filter(tech => tech.trim() !== '')
    };
    onSubmit(cleanedData);
  };

  const addTechStackItem = () => {
    setFormData({
      ...formData,
      techStack: [...formData.techStack, '']
    });
  };

  const removeTechStackItem = (index: number) => {
    const newTechStack = formData.techStack.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      techStack: newTechStack.length === 0 ? [''] : newTechStack
    });
  };

  const updateTechStackItem = (index: number, value: string) => {
    const newTechStack = [...formData.techStack];
    newTechStack[index] = value;
    setFormData({
      ...formData,
      techStack: newTechStack
    });
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

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Download Link (Google Drive)
            </label>
            <input
              type="url"
              value={formData.downloadLink}
              onChange={(e) => setFormData({...formData, downloadLink: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              placeholder="https://drive.google.com/..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Live Demo Link (Optional)
            </label>
            <input
              type="url"
              value={formData.liveLink}
              onChange={(e) => setFormData({...formData, liveLink: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tech Stack
            </label>
            <div className="space-y-3">
              {formData.techStack.map((tech, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={tech}
                    onChange={(e) => updateTechStackItem(index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    placeholder="e.g., Python, Excel, Power BI"
                  />
                  {formData.techStack.length > 1 && (
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
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectUploadForm;
