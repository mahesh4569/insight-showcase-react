
import { useState, useCallback, useMemo } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth';

export const getResumeUrl = (userId: string, fileName: string) => {
  try {
    const { data } = supabase.storage
      .from('resumes')
      .getPublicUrl(`${userId}/${fileName}`);
    return data.publicUrl;
  } catch (error) {
    console.error('Error generating resume URL:', error);
    return null;
  }
};

export const getProfilePicUrl = (userId: string, ext: string = 'jpg', timestamp?: number) => {
  try {
    // Try both jpg and png extensions
    const extensions = ['jpg', 'jpeg', 'png', 'webp'];
    const extension = extensions.includes(ext.toLowerCase()) ? ext : 'jpg';
    
    const { data } = supabase.storage
      .from('profile-pics')
      .getPublicUrl(`${userId}/profile.${extension}`);
    
    // Add timestamp to prevent caching issues
    const cacheBuster = timestamp || Date.now();
    const finalUrl = `${data.publicUrl}?t=${cacheBuster}`;
    console.log('Generated profile pic URL:', finalUrl);
    return finalUrl;
  } catch (error) {
    console.error('Error generating profile picture URL:', error);
    return null;
  }
};

// Helper function to check if a file exists in storage
const fileExists = async (bucket: string, filePath: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(filePath.split('/').slice(0, -1).join('/'), {
        search: filePath.split('/').pop(),
        limit: 1
      });
    
    if (error) throw error;
    return (data?.length ?? 0) > 0;
  } catch (error) {
    console.error(`Error checking if file exists in ${bucket}:`, error);
    return false;
  }
};

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [profilePicTimestamp, setProfilePicTimestamp] = useState(Date.now());
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const { user } = useAuth();

  // Function to get the correct file path based on bucket type
  const getFilePath = useCallback((bucket: string, originalName: string, fileExt: string) => {
    if (!user) throw new Error('User must be authenticated');
    
    if (bucket === 'profile-pics') {
      return `${user.id}/profile.${fileExt}`;
    } else if (bucket === 'resumes') {
      return `${user.id}/resume.${fileExt}`;
    }
    return `${user.id}/${originalName}`;
  }, [user]);

  // Function to check if a file exists
  const checkFileExists = useCallback(async (bucket: string, filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(filePath.split('/')[0], {
          search: filePath.split('/')[1],
          limit: 1
        });

      if (error) throw error;
      return (data?.length ?? 0) > 0;
    } catch (error) {
      console.error('Error checking file existence:', error);
      return false;
    }
  }, []);

  const uploadFile = useCallback(async (file: File, bucket: 'project-images' | 'project-files' | 'resumes' | 'profile-pics', folder?: string) => {
    if (!user) throw new Error('User must be authenticated');

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
      const fileName = getFilePath(bucket, file.name, fileExt);

      console.log('Uploading file:', { bucket, fileName, fileType: file.type, fileSize: file.size });

      // Check if file exists first
      const exists = await checkFileExists(bucket, fileName);
      if (exists) {
        console.log('File exists, removing...');
        const { error: removeError } = await supabase.storage
          .from(bucket)
          .remove([fileName]);
        
        if (removeError) {
          console.warn('Error removing existing file:', removeError);
        }
      }

      // Upload the new file
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { 
          upsert: true,
          cacheControl: '0' // Disable caching to ensure fresh images
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Update timestamp for profile pics to force refresh
      if (bucket === 'profile-pics') {
        const newTimestamp = Date.now();
        setProfilePicTimestamp(newTimestamp);
        
        console.log('Profile picture uploaded successfully, triggering refresh event');
        
        // Trigger a custom event to notify other components
        window.dispatchEvent(new CustomEvent('profilePicUpdated', { 
          detail: { userId: user.id, timestamp: newTimestamp, extension: fileExt } 
        }));
      }

      // Store resume file name for future reference
      if (bucket === 'resumes') {
        const resumeFileNameWithExt = `resume.${fileExt}`;
        setResumeFileName(resumeFileNameWithExt);
        console.log('Resume uploaded successfully:', resumeFileNameWithExt);
        
        // Store in localStorage for persistence
        localStorage.setItem(`resume_filename_${user.id}`, resumeFileNameWithExt);
        
        // Trigger a custom event to notify other components
        window.dispatchEvent(new CustomEvent('resumeUpdated', { 
          detail: { userId: user.id, fileName: resumeFileNameWithExt } 
        }));
      }

      // Get the public URL with a cache-busting query parameter
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      // Add a timestamp to the URL to prevent caching
      const publicUrl = `${data.publicUrl}?t=${Date.now()}`;
      console.log('File uploaded successfully. Public URL:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  }, [user, getFilePath, checkFileExists]);

  const deleteFile = async (url: string, bucket: 'project-images' | 'project-files' | 'resumes' | 'profile-pics') => {
    try {
      const fileName = url.split('/').pop()?.split('?')[0];
      if (!fileName) throw new Error('Invalid file URL');

      const { error } = await supabase.storage
        .from(bucket)
        .remove([fileName]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  };

  // Function to get the actual resume file name with correct extension
  const getResumeFileName = useCallback(() => {
    if (!user) return null;
    
    // First check if we have it in state
    if (resumeFileName) return resumeFileName;
    
    // Then check localStorage
    const storedFileName = localStorage.getItem(`resume_filename_${user.id}`);
    if (storedFileName) {
      setResumeFileName(storedFileName);
      return storedFileName;
    }
    
    // Default fallback
    return 'resume.pdf';
  }, [user, resumeFileName]);

  // Function to get a verified resume URL with correct extension
  const getVerifiedResumeUrl = useCallback(async (userId: string) => {
    try {
      // Get the actual file name with correct extension
      const fileName = getResumeFileName();
      if (!fileName) return null;
      
      const filePath = `${userId}/${fileName}`;
      
      const exists = await checkFileExists('resumes', filePath);
      if (!exists) {
        console.log('Resume file does not exist at path:', filePath);
        
        // Try to find any resume file with different extensions
        const { data: files } = await supabase.storage
          .from('resumes')
          .list(userId);
        
        if (files && files.length > 0) {
          const resumeFile = files.find(file => file.name.startsWith('resume.'));
          if (resumeFile) {
            console.log('Found resume file:', resumeFile.name);
            localStorage.setItem(`resume_filename_${userId}`, resumeFile.name);
            setResumeFileName(resumeFile.name);
            
            const url = getResumeUrl(userId, resumeFile.name);
            return url ? `${url}?t=${Date.now()}` : null;
          }
        }
        
        return null;
      }
      
      const url = getResumeUrl(userId, fileName);
      if (!url) return null;
      
      // Add cache-busting parameter
      return `${url}?t=${Date.now()}`;
    } catch (error) {
      console.error('Error verifying resume URL:', error);
      return null;
    }
  }, [checkFileExists, getResumeFileName]);

  // Function to get current profile pic URL with latest timestamp
  const getCurrentProfilePicUrl = useCallback((userId: string, ext: string = 'jpg') => {
    return getProfilePicUrl(userId, ext, profilePicTimestamp);
  }, [profilePicTimestamp]);

  return {
    uploadFile,
    deleteFile,
    uploading,
    getResumeUrl,
    getProfilePicUrl,
    getCurrentProfilePicUrl,
    getVerifiedResumeUrl,
    checkFileExists,
    profilePicTimestamp,
    getResumeFileName
  };
};
