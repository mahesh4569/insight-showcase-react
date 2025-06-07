
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink, Calendar, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/hooks/useProjects';

interface ProjectScreenshot {
  id: string;
  image_url: string;
  caption?: string;
  display_order: number;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [screenshots, setScreenshots] = useState<ProjectScreenshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      // Fetch project details
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);

      // Fetch screenshots
      const { data: screenshotsData, error: screenshotsError } = await supabase
        .from('project_screenshots')
        .select('*')
        .eq('project_id', id)
        .order('display_order', { ascending: true });

      if (screenshotsError) throw screenshotsError;
      setScreenshots(screenshotsData || []);
    } catch (error) {
      console.error('Error fetching project details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
          <Link to="/" className="text-blue-400 hover:text-blue-300">← Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-slate-300 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">{project.title}</h1>
          <div className="flex items-center space-x-4 mt-2 text-slate-400 text-sm">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(project.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            {project.image_url && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-64 object-cover cursor-pointer"
                  onClick={() => setSelectedImage(project.image_url!)}
                />
              </div>
            )}

            {/* Description */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Description</h2>
              <p className="text-slate-300 leading-relaxed">{project.description}</p>
            </div>

            {/* KPI Notes */}
            {project.kpi_notes && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Key Performance Insights</h2>
                <div className="text-slate-300 whitespace-pre-wrap">{project.kpi_notes}</div>
              </div>
            )}

            {/* Screenshots Gallery */}
            {screenshots.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Project Screenshots</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {screenshots.map((screenshot) => (
                    <div key={screenshot.id} className="space-y-2">
                      <img
                        src={screenshot.image_url}
                        alt={screenshot.caption || 'Project screenshot'}
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedImage(screenshot.image_url)}
                      />
                      {screenshot.caption && (
                        <p className="text-sm text-slate-400">{screenshot.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tech Stack */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-600/30 text-blue-300 text-sm rounded-full border border-blue-500/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
              <div className="space-y-3">
                {project.download_link && (
                  <a
                    href={project.download_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 font-medium"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Project</span>
                  </a>
                )}
                {project.live_link && (
                  <a
                    href={project.live_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-slate-700/50 hover:bg-slate-600/50 text-white py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 font-medium"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>View Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
