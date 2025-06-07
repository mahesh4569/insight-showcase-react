
import React, { useState } from 'react';
import { Upload, Trash2, Edit3, Plus, X } from 'lucide-react';
import { useProjectScreenshots } from '@/hooks/useProjectScreenshots';
import { useFileUpload } from '@/hooks/useFileUpload';

interface ScreenshotManagerProps {
  projectId: string;
}

const ScreenshotManager: React.FC<ScreenshotManagerProps> = ({ projectId }) => {
  const { screenshots, addScreenshot, deleteScreenshot, updateScreenshotCaption } = useProjectScreenshots(projectId);
  const { uploadFile, uploading } = useFileUpload();
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [captionText, setCaptionText] = useState('');

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadFile(file, 'project-images', `screenshots/${projectId}`);
      await addScreenshot(projectId, url);
    } catch (error) {
      console.error('Error uploading screenshot:', error);
    }
  };

  const handleDeleteScreenshot = async (id: string) => {
    if (confirm('Are you sure you want to delete this screenshot?')) {
      await deleteScreenshot(id);
    }
  };

  const handleCaptionEdit = (screenshot: any) => {
    setEditingCaption(screenshot.id);
    setCaptionText(screenshot.caption || '');
  };

  const handleCaptionSave = async () => {
    if (editingCaption) {
      await updateScreenshotCaption(editingCaption, captionText);
      setEditingCaption(null);
      setCaptionText('');
    }
  };

  const handleCaptionCancel = () => {
    setEditingCaption(null);
    setCaptionText('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-300">Project Screenshots</h3>
        <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2 cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Add Screenshot</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleScreenshotUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {uploading && (
        <div className="flex items-center space-x-2 text-blue-400">
          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Uploading screenshot...</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {screenshots.map((screenshot) => (
          <div key={screenshot.id} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            <img
              src={screenshot.image_url}
              alt={screenshot.caption || 'Project screenshot'}
              className="w-full h-32 object-cover"
            />
            <div className="p-3 space-y-2">
              {editingCaption === screenshot.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={captionText}
                    onChange={(e) => setCaptionText(e.target.value)}
                    placeholder="Enter caption..."
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCaptionSave}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCaptionCancel}
                      className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <p className="text-sm text-slate-300 flex-1">
                    {screenshot.caption || 'No caption'}
                  </p>
                  <div className="flex space-x-1 ml-2">
                    <button
                      onClick={() => handleCaptionEdit(screenshot)}
                      className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteScreenshot(screenshot.id)}
                      className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {screenshots.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <p>No screenshots uploaded yet</p>
        </div>
      )}
    </div>
  );
};

export default ScreenshotManager;
