
import React from 'react';
import { Download, ExternalLink } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  image_url?: string;
  download_link?: string;
  live_link?: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  return (
    <div 
      className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
      style={{
        animationDelay: `${index * 0.1}s`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
    >
      {/* Project Image */}
      <div className="relative overflow-hidden h-48">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
            <span className="text-white text-4xl">📊</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-slate-300 text-sm mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech_stack.map((tech, techIndex) => (
            <span
              key={techIndex}
              className="px-3 py-1 bg-blue-600/30 text-blue-300 text-xs rounded-full border border-blue-500/30"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {project.download_link && (
            <a
              href={project.download_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </a>
          )}
          {project.live_link && (
            <a
              href={project.live_link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-700/50 hover:bg-slate-600/50 text-white py-2.5 px-3 rounded-xl transition-all duration-300 flex items-center justify-center hover:shadow-lg"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
