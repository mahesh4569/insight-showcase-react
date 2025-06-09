import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Experience {
  id: string;
  user_id: string;
  company: string;
  title: string;
  start_date: string;
  end_date: string;
  description?: string;
  created_at: string;
}

export const useExperiences = (userId?: string) => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const id = userId || user?.id;
      if (!id) {
        setExperiences([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('user_id', id)
        .order('start_date', { ascending: false });
      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const addExperience = async (exp: Omit<Experience, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) throw new Error('User must be authenticated');
    const { data, error } = await supabase
      .from('experiences')
      .insert([{ ...exp, user_id: user.id }])
      .select()
      .single();
    if (error) throw error;
    setExperiences(prev => [data, ...prev]);
    return data;
  };

  const updateExperience = async (id: string, updates: Partial<Experience>) => {
    const { data, error } = await supabase
      .from('experiences')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    setExperiences(prev => prev.map(e => e.id === id ? data : e));
    return data;
  };

  const deleteExperience = async (id: string) => {
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id);
    if (error) throw error;
    setExperiences(prev => prev.filter(e => e.id !== id));
  };

  useEffect(() => {
    fetchExperiences();
  }, [userId, user]);

  return { experiences, loading, addExperience, updateExperience, deleteExperience, refetch: fetchExperiences };
}; 