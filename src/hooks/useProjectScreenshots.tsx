
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ProjectScreenshot {
  id: string;
  project_id: string;
  image_url: string;
  caption?: string;
  display_order: number;
  created_at: string;
}

export const useProjectScreenshots = (projectId?: string) => {
  const [screenshots, setScreenshots] = useState<ProjectScreenshot[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchScreenshots = async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('project_screenshots')
        .select('*')
        .eq('project_id', projectId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setScreenshots(data || []);
    } catch (error) {
      console.error('Error fetching screenshots:', error);
    } finally {
      setLoading(false);
    }
  };

  const addScreenshot = async (projectId: string, imageUrl: string, caption?: string) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      const maxOrder = screenshots.length > 0 ? Math.max(...screenshots.map(s => s.display_order)) : -1;
      
      const { data, error } = await supabase
        .from('project_screenshots')
        .insert([{
          project_id: projectId,
          image_url: imageUrl,
          caption,
          display_order: maxOrder + 1
        }])
        .select()
        .single();

      if (error) throw error;
      setScreenshots(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error adding screenshot:', error);
      throw error;
    }
  };

  const deleteScreenshot = async (id: string) => {
    try {
      const { error } = await supabase
        .from('project_screenshots')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setScreenshots(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting screenshot:', error);
      throw error;
    }
  };

  const updateScreenshotCaption = async (id: string, caption: string) => {
    try {
      const { data, error } = await supabase
        .from('project_screenshots')
        .update({ caption })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setScreenshots(prev => prev.map(s => s.id === id ? data : s));
      return data;
    } catch (error) {
      console.error('Error updating screenshot caption:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchScreenshots();
  }, [projectId]);

  return {
    screenshots,
    loading,
    addScreenshot,
    deleteScreenshot,
    updateScreenshotCaption,
    refetch: fetchScreenshots
  };
};
