
import React, { useState } from 'react';
import { Search, Download, Mail, Github, Linkedin, ExternalLink, Filter, User, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import ContactButton from '../components/ContactButton';
import FilterDropdown from '../components/FilterDropdown';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../hooks/useAuth';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const { projects, loading } = useProjects();
  const { user } = useAuth();

  React.useEffect(() => {
    filterProjects(searchTerm, selectedCategory);
  }, [projects, searchTerm, selectedCategory]);

  // Get unique categories from projects
  const categories = ['all', ...new Set(projects.flatMap(project => project.tech_stack))];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterProjects(term, selectedCategory);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    filterProjects(searchTerm, category);
  };

  const filterProjects = (searchTerm: string, category: string) => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tech_stack.some((tech: string) => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(project => 
        project.tech_stack.some((tech: string) => tech.toLowerCase() === category.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  };

  const handleEmailClick = () => {
    const subject = encodeURIComponent('Opportunity for Data Analyst Role');
    const body = encodeURIComponent(`Hi Mahesh,

I came across your data portfolio and was impressed by your projects and skills.

We are currently looking for a Data Analyst to join our team at [Company Name]. Your experience with Excel, Power BI, Python, and dashboard development aligns well with what we're seeking.

If you're interested, I'd love to schedule a call to discuss the role and next steps.

Best regards,
[Recruiter's Name]
[Designation]
[Company Name]`);
    
    window.open(`mailto:maheshvadla06@gmail.com?subject=${subject}&body=${body}`, '_blank');
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Hi Mahesh, I just saw your data portfolio – really impressive work! We're currently hiring for a Data Analyst role at [Company Name]. Let me know if you're open to a quick chat.

– [Recruiter's Name], [Designation]`);
    
    window.open(`https://wa.me/919014644400?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-fadeInUp">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
        <div className="relative container mx-auto px-6 py-16 text-center">
          {/* Name in top left */}
          <div className="absolute top-4 left-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              Mahesh
            </div>
          </div>

          {/* Auth Button */}
          <div className="absolute top-4 right-4">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 text-white hover:bg-white/20 transition-all duration-300 flex items-center space-x-2 hover:scale-105 transform animate-scale-in"
              >
                <User className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/auth"
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 text-white hover:bg-white/20 transition-all duration-300 flex items-center space-x-2 hover:scale-105 transform animate-scale-in"
              >
                <User className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight animate-fadeInUp">
            📊 My Data Analysis
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              Projects
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            Explore my collection of data-driven insights and analytical solutions that transform complex datasets into actionable business intelligence.
          </p>
          
          {/* Search and Filter Bar */}
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center animate-fadeInUp" style={{animationDelay: '0.4s'}}>
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects or tools..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 focus:scale-105 transform"
              />
            </div>
            
            {/* Filter Dropdown */}
            <div className="animate-scale-in">
              <FilterDropdown 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryFilter}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-6 py-16">
        {loading ? (
          <div className="text-center py-16 animate-fadeInUp">
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 text-lg animate-pulse">Loading projects...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <div key={project.id} className="animate-fadeInUp hover:scale-105 transition-transform duration-300" style={{animationDelay: `${0.1 * index}s`}}>
                  <ProjectCard project={project} index={index} />
                </div>
              ))}
            </div>
            
            {filteredProjects.length === 0 && !loading && (
              <div className="text-center py-16 animate-fadeInUp">
                <p className="text-slate-400 text-lg">No projects found matching your search.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm animate-fadeInUp">
        <div className="container mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 animate-pulse">Let's Connect</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            Interested in collaborating or discussing data analysis opportunities? I'd love to hear from you.
          </p>
          <div className="flex justify-center space-x-6 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
            <button 
              onClick={handleEmailClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-all duration-300 flex items-center space-x-2 hover:scale-110 transform"
            >
              <Mail className="w-5 h-5" />
              <span>Email Me</span>
            </button>
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-full transition-all duration-300 flex items-center space-x-2 hover:scale-110 transform">
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/mahesh-vadla-432579246/" target="_blank" rel="noopener noreferrer" className="bg-blue-700 hover:bg-blue-600 text-white px-6 py-3 rounded-full transition-all duration-300 flex items-center space-x-2 hover:scale-110 transform">
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </a>
            <button 
              onClick={handleWhatsAppClick}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full transition-all duration-300 flex items-center space-x-2 hover:scale-110 transform"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      <ContactButton />
    </div>
  );
};

export default Index;
