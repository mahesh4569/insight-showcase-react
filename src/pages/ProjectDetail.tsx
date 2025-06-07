
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Download, Github, Calendar, User } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { useProjectScreenshots } from '../hooks/useProjectScreenshots';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { projects, loading: projectsLoading } = useProjects();
  const { screenshots, loading: screenshotsLoading } = useProjectScreenshots(id);

  const project = projects.find(p => p.id === id);

  if (projectsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center animate-fadeInUp">
          <div className="w-12 h-12 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg animate-pulse">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center animate-fadeInUp">
          <h1 className="text-4xl font-bold text-white mb-4">Project Not Found</h1>
          <Link to="/" className="text-blue-400 hover:text-blue-300 transition-colors">
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 animate-scale-in">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              Mahesh
            </div>
            <div className="border-l border-white/30 pl-4">
              <Link
                to="/"
                className="flex items-center space-x-2 text-slate-300 hover:text-white transition-all duration-300 hover:scale-105 transform"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Projects</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Project Header */}
        <div className="mb-12 animate-fadeInUp">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Image */}
            {project.image_url && (
              <div className="lg:w-1/2">
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full rounded-2xl shadow-2xl object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            )}

            {/* Project Info */}
            <div className="lg:w-1/2 space-y-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 animate-pulse">
                  {project.title}
                </h1>
                <p className="text-slate-300 text-lg leading-relaxed animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                  {project.description}
                </p>
              </div>

              {/* Tech Stack */}
              <div className="animate-fadeInUp" style={{animationDelay: '0.3s'}}>
                <h3 className="text-xl font-semibold text-white mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-600/30 text-blue-300 rounded-full text-sm font-medium transition-all duration-300 hover:bg-blue-600/50 hover:scale-110 transform"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Links */}
              <div className="flex flex-wrap gap-4 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                {project.live_link && (
                  <a
                    href={project.live_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-all duration-300 flex items-center space-x-2 hover:scale-110 transform"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Live Demo</span>
                  </a>
                )}
                {project.download_link && (
                  <a
                    href={project.download_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full transition-all duration-300 flex items-center space-x-2 hover:scale-110 transform"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </a>
                )}
              </div>

              {/* Project Meta */}
              <div className="text-slate-400 text-sm space-y-2 animate-fadeInUp" style={{animationDelay: '0.5s'}}>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>By Mahesh</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Notes */}
        {project.kpi_notes && (
          <div className="mb-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 animate-fadeInUp" style={{animationDelay: '0.6s'}}>
            <h2 className="text-2xl font-bold text-white mb-6 animate-pulse">Key Performance Insights</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                {project.kpi_notes}
              </p>
            </div>
          </div>
        )}

        {/* Screenshots Gallery */}
        {screenshots.length > 0 && (
          <div className="mb-12 animate-fadeInUp" style={{animationDelay: '0.7s'}}>
            <h2 className="text-2xl font-bold text-white mb-8 animate-pulse">Project Screenshots</h2>
            {screenshotsLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400 animate-pulse">Loading screenshots...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {screenshots.map((screenshot, index) => (
                  <div key={screenshot.id} className="group animate-fadeInUp" style={{animationDelay: `${0.1 * index}s`}}>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/15 hover:scale-105 transform">
                      <img
                        src={screenshot.image_url}
                        alt={screenshot.caption || `Screenshot ${index + 1}`}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {screenshot.caption && (
                        <div className="p-4">
                          <p className="text-slate-300 text-sm">{screenshot.caption}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Back to Projects */}
        <div className="text-center animate-fadeInUp" style={{animationDelay: '0.8s'}}>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-8 py-4 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 transform"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>View All Projects</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
