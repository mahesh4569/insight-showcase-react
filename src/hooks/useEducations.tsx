import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Education {
  id: string;
  user_id: string;
  school: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
  description?: string;
  created_at: string;
}

export const useEducations = (userId?: string) => {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchEducations = async () => {
    setLoading(true);
    try {
      const id = userId || user?.id;
      if (!id) {
        setEducations([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('educations')
        .select('*')
        .eq('user_id', id)
        .order('start_date', { ascending: false });
      if (error) throw error;
      setEducations(data || []);
    } catch (error) {
      console.error('Error fetching educations:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEducation = async (edu: Omit<Education, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) throw new Error('User must be authenticated');
    const { data, error } = await supabase
      .from('educations')
      .insert([{ ...edu, user_id: user.id }])
      .select()
      .single();
    if (error) throw error;
    setEducations(prev => [data, ...prev]);
    return data;
  };

  const updateEducation = async (id: string, updates: Partial<Education>) => {
    const { data, error } = await supabase
      .from('educations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    setEducations(prev => prev.map(e => e.id === id ? data : e));
    return data;
  };

  const deleteEducation = async (id: string) => {
    const { error } = await supabase
      .from('educations')
      .delete()
      .eq('id', id);
    if (error) throw error;
    setEducations(prev => prev.filter(e => e.id !== id));
  };

  useEffect(() => {
    fetchEducations();
  }, [userId, user]);

  return { educations, loading, addEducation, updateEducation, deleteEducation, refetch: fetchEducations };
}; 