
import React, { useState } from 'react';
import { Search, Download, Mail, Github, Linkedin, ExternalLink } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import ContactButton from '../components/ContactButton';
import { mockProjects } from '../data/projects';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState(mockProjects);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = mockProjects.filter(project => 
      project.title.toLowerCase().includes(term.toLowerCase()) ||
      project.description.toLowerCase().includes(term.toLowerCase()) ||
      project.techStack.some(tech => tech.toLowerCase().includes(term.toLowerCase()))
    );
    setFilteredProjects(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative container mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            📊 My Data Analysis
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Projects
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            Explore my collection of data-driven insights and analytical solutions that transform complex datasets into actionable business intelligence.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects or tools..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">No projects found matching your search.</p>
          </div>
        )}
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Let's Connect</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Interested in collaborating or discussing data analysis opportunities? I'd love to hear from you.
          </p>
          <div className="flex justify-center space-x-6">
            <a href="mailto:your.email@example.com" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-colors duration-300 flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Email Me</span>
            </a>
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-full transition-colors duration-300 flex items-center space-x-2">
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
            <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="bg-blue-700 hover:bg-blue-600 text-white px-6 py-3 rounded-full transition-colors duration-300 flex items-center space-x-2">
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>

      <ContactButton />
    </div>
  );
};

export default Index;
