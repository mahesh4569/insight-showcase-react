
import React, { useState } from 'react';
import { Upload, X, Image, File } from 'lucide-react';
import { useFileUpload } from '../hooks/useFileUpload';

interface FileUploadFormProps {
  onFileUploaded: (url: string, type: 'image' | 'file') => void;
  accept?: string;
  bucket: 'project-images' | 'project-files';
  folder?: string;
  label: string;
}

const FileUploadForm: React.FC<FileUploadFormProps> = ({
  onFileUploaded,
  accept,
  bucket,
  folder,
  label
}) => {
  const [dragActive, setDragActive] = useState(false);
  const { uploadFile, uploading } = useFileUpload();

  // Set default accept based on bucket type if not provided
  const acceptTypes = accept || (bucket === 'project-images' ? 'image/*' : '*/*');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    try {
      const url = await uploadFile(file, bucket, folder);
      const type = file.type.startsWith('image/') ? 'image' : 'file';
      onFileUploaded(url, type);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const getFileTypeDescription = () => {
    if (bucket === 'project-images') {
      return 'Images only (PNG, JPG, GIF, etc.)';
    }
    return 'Any file type (PDF, Excel, Word, PowerBI, MP4, etc.)';
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
          dragActive
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-slate-600/50 bg-slate-800/30 hover:border-slate-500/50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={acceptTypes}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <div className="flex flex-col items-center space-y-2">
          {bucket === 'project-images' ? (
            <Image className="w-8 h-8 text-slate-400" />
          ) : (
            <File className="w-8 h-8 text-slate-400" />
          )}
          
          {uploading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-slate-300">Uploading...</span>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-300">
                Drop files here or click to browse
              </p>
              <p className="text-xs text-slate-400">
                {getFileTypeDescription()}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadForm;
