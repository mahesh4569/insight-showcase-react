import React, { useState, useEffect } from 'react';
import { Search, Download, Mail, Github, Linkedin, ExternalLink, User, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import ContactButton from '../components/ContactButton';
import BubbleFilter from '../components/BubbleFilter';
import ProjectPagination from '../components/ProjectPagination';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../hooks/useAuth';
import { useFileUpload, getProfilePicUrl } from '../hooks/useFileUpload';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { useEducations } from '../hooks/useEducations';
import { useExperiences } from '../hooks/useExperiences';

const PROJECTS_PER_PAGE = 6;
const PUBLIC_USER_ID = '9c79042f-de02-46a8-b0f8-e0606a9b8cd4';

const ProjectsSection = ({ projects, loading }) => (
  loading ? (
    <div className="text-center text-slate-300">Loading projects...</div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  )
);

const EducationSection = ({ educations, loadingEdu }) => (
  loadingEdu ? (
    <div className="text-center text-slate-300">Loading education...</div>
  ) : (
    <ul className="space-y-4">
      {educations.map(edu => (
        <li key={edu.id} className="bg-white/10 p-4 rounded-lg">
          <div className="font-bold text-white">{edu.school} - {edu.degree} ({edu.field})</div>
          <div className="text-slate-300 text-sm">{edu.start_date} - {edu.end_date || 'Present'}</div>
          {edu.description && <div className="text-slate-400 text-sm mt-1">{edu.description}</div>}
        </li>
      ))}
    </ul>
  )
);

const ExperienceSection = ({ experiences, loadingExp }) => (
  loadingExp ? (
    <div className="text-center text-slate-300">Loading experience...</div>
  ) : (
    <ul className="space-y-4">
      {experiences.map(exp => (
        <li key={exp.id} className="bg-white/10 p-4 rounded-lg">
          <div className="font-bold text-white">{exp.company} - {exp.title}</div>
          <div className="text-slate-300 text-sm">{exp.start_date} - {exp.end_date || 'Present'}</div>
          {exp.description && <div className="text-slate-400 text-sm mt-1">{exp.description}</div>}
        </li>
      ))}
    </ul>
  )
);

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { projects, loading } = useProjects(PUBLIC_USER_ID);
  const { user } = useAuth();
  const { getResumeUrl } = useFileUpload();
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [profilePicTimestamp, setProfilePicTimestamp] = useState(Date.now());
  const { educations, loading: loadingEdu } = useEducations(PUBLIC_USER_ID);
  const { experiences, loading: loadingExp } = useExperiences(PUBLIC_USER_ID);
  const [activeTab, setActiveTab] = useState('Projects');

  React.useEffect(() => {
    filterProjects(searchTerm, selectedCategories);
  }, [projects, searchTerm, selectedCategories]);

  React.useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategories]);

  // Always fetch the public resume
  React.useEffect(() => {
    const url = getResumeUrl(PUBLIC_USER_ID, 'resume.pdf');
    setResumeUrl(url);
  }, []);

  // Always fetch the public profile pic with timestamp for cache busting
  React.useEffect(() => {
    const updateProfilePic = () => {
      const url = getProfilePicUrl(PUBLIC_USER_ID, 'jpg', profilePicTimestamp);
      setProfilePicUrl(url);
    };
    
    updateProfilePic();

    // Listen for profile picture updates
    const handleProfilePicUpdate = (event: CustomEvent) => {
      console.log('Profile picture updated event received:', event.detail);
      setProfilePicTimestamp(event.detail.timestamp);
    };

    window.addEventListener('profilePicUpdated', handleProfilePicUpdate as EventListener);
    
    return () => {
      window.removeEventListener('profilePicUpdated', handleProfilePicUpdate as EventListener);
    };
  }, [profilePicTimestamp]);

  // Get unique categories from projects with better skill extraction
  const categories = ['all', ...new Set(projects.flatMap(project => 
    Array.isArray(project.tech_stack) ? project.tech_stack : []
  ))].filter(Boolean);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterProjects(term, selectedCategories);
  };

  const handleCategoryToggle = (category: string) => {
    let newSelectedCategories;
    
    if (selectedCategories.includes(category)) {
      // Remove category if already selected
      newSelectedCategories = selectedCategories.filter(cat => cat !== category);
    } else {
      // Add category if not selected
      newSelectedCategories = [...selectedCategories, category];
    }
    
    setSelectedCategories(newSelectedCategories);
    filterProjects(searchTerm, newSelectedCategories);
  };

  const handleClearAllFilters = () => {
    setSelectedCategories([]);
    filterProjects(searchTerm, []);
  };

  const filterProjects = (searchTerm: string, categories: string[]) => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(project.tech_stack) && project.tech_stack.some((tech: string) => 
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    // Filter by categories/skills (multi-select)
    if (categories.length > 0) {
      filtered = filtered.filter(project => 
        Array.isArray(project.tech_stack) && categories.some(category =>
          project.tech_stack.some((tech: string) => 
            tech.toLowerCase() === category.toLowerCase()
          )
        )
      );
    }

    setFilteredProjects(filtered);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const endIndex = startIndex + PROJECTS_PER_PAGE;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  // Featured Projects
  const featuredProjects = filteredProjects.filter(p => p.featured);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top of projects section
    document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' });
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

  const handleDownloadResume = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      alert('No resume uploaded yet.');
    }
  };

  // Reset project filters when switching away from Projects tab
  useEffect(() => {
    if (activeTab !== 'Projects') {
      setSelectedCategories([]);
      setSearchTerm('');
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-fadeInUp">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        {/* --- Animated Background Layer --- */}
        <div className="pointer-events-none absolute inset-0 z-0">
          {/* Floating SQL Snippets */}
          <div className="absolute left-10 top-10 animate-float-slow text-xs md:text-base font-mono text-white/10 select-none" style={{animationDelay: '0s'}}>
            SELECT * FROM insights
          </div>
          <div className="absolute right-16 top-32 animate-float-slower text-xs md:text-base font-mono text-blue-200/10 select-none" style={{animationDelay: '1.5s'}}>
            WHERE sales &gt; 1000
          </div>
          <div className="absolute left-1/3 bottom-24 animate-float-slower text-xs md:text-base font-mono text-purple-200/10 select-none" style={{animationDelay: '2.5s'}}>
            JOIN customers ON id
          </div>
          <div className="absolute right-1/4 bottom-10 animate-float-slow text-xs md:text-base font-mono text-green-200/10 select-none" style={{animationDelay: '3.5s'}}>
            GROUP BY region
          </div>
          {/* Floating Data Analytics Icons */}
          <div className="absolute left-1/4 top-1/4 animate-float-slower opacity-5 motion-safe:animate-float-slower">
            <svg width="60" height="60" fill="none" viewBox="0 0 24 24" className="w-16 h-16 text-blue-400/10"><rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2"/><rect x="7" y="7" width="2" height="10" rx="1" fill="currentColor"/><rect x="11" y="11" width="2" height="6" rx="1" fill="currentColor"/><rect x="15" y="9" width="2" height="8" rx="1" fill="currentColor"/></svg>
          </div>
          <div className="absolute right-1/5 top-1/3 animate-float-slow opacity-10 motion-safe:animate-float-slow">
            <svg width="60" height="60" fill="none" viewBox="0 0 24 24" className="w-16 h-16 text-green-400/10"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 12L12 6" stroke="currentColor" strokeWidth="2"/><path d="M12 12L18 12" stroke="currentColor" strokeWidth="2"/></svg>
          </div>
          <div className="absolute left-1/6 bottom-1/4 animate-float-slower opacity-5 motion-safe:animate-float-slower">
            <svg width="60" height="60" fill="none" viewBox="0 0 24 24" className="w-16 h-16 text-yellow-400/10"><rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2"/><rect x="8" y="8" width="8" height="8" rx="2" fill="currentColor"/></svg>
          </div>
          <div className="absolute right-10 bottom-1/5 animate-float-slow opacity-5 motion-safe:animate-float-slower">
            <svg width="60" height="60" fill="none" viewBox="0 0 24 24" className="w-16 h-16 text-purple-400/10"><path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2"/></svg>
          </div>
          {/* Example: Python logo (simple circle for subtlety) */}
          <div className="absolute left-1/2 top-1/5 animate-float-slower opacity-5 motion-safe:animate-float-slower">
            <svg width="60" height="60" fill="none" viewBox="0 0 24 24" className="w-16 h-16 text-yellow-300/10"><circle cx="12" cy="12" r="10" fill="currentColor"/></svg>
          </div>
          {/* Example: Excel icon (simple rectangle for subtlety) */}
          <div className="absolute left-1/3 bottom-1/6 animate-float-slow opacity-5 motion-safe:animate-float-slower">
            <svg width="60" height="60" fill="none" viewBox="0 0 24 24" className="w-16 h-16 text-green-600/10"><rect x="5" y="5" width="14" height="14" rx="3" fill="currentColor"/></svg>
          </div>
        </div>
        {/* --- End Animated Background Layer --- */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse z-10"></div>
        <div className="relative container mx-auto px-6 py-16 text-center z-20">
          {/* Name and Profile Pic in top left */}
          <div className="absolute top-4 left-4 flex items-center gap-3">
            {profilePicUrl ? (
              <img 
                key={profilePicTimestamp} // Force re-render when timestamp changes
                src={profilePicUrl} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-400"
                onError={(e) => {
                  console.log('Profile image failed to load, showing fallback');
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div 
              className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xl text-white"
              style={{ display: profilePicUrl ? 'none' : 'flex' }}
            >
              👤
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              Mahesh
            </div>
          </div>

          {/* Auth Button */}
          <div className="absolute top-4 right-4 flex gap-2">
            {resumeUrl && (
              <button
                onClick={handleDownloadResume}
                className="bg-green-600/80 hover:bg-green-700 text-white px-6 py-3 rounded-full transition-all duration-300 flex items-center space-x-2 hover:scale-105 transform animate-scale-in"
              >
                <Download className="w-5 h-5" />
                <span>Resume</span>
              </button>
            )}
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
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto animate-fadeInUp" style={{animationDelay: '0.3s'}}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects or skills..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 focus:scale-105 transform"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pt-8">
        {/* Tab Navigation */}
        <div className="mb-8 flex justify-center items-center w-full max-w-2xl mx-auto
            backdrop-blur-md bg-white/10 border border-white/20 shadow-md rounded-full
            p-1 h-14 transition-all duration-300 ease-in-out"
            role="tablist">
          {['Projects', 'Education', 'Experience'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-full px-6 py-2 text-base font-semibold transition-all duration-300 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:z-10
                ${activeTab === tab ? 'bg-white/30 shadow-lg text-white' : 'opacity-70 grayscale'}
                hover:bg-white/20 hover:shadow-md`}
              role="tab"
              aria-selected={activeTab === tab}
              tabIndex={activeTab === tab ? 0 : -1}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300 ease-in-out">
          {/* Projects Tab */}
          {activeTab === 'Projects' && (
            <div id="projects-section">
              {loading ? (
                <div className="text-center py-16">
                  <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-400 text-lg">Loading projects...</p>
                </div>
              ) : (
                <>
                  <BubbleFilter
                    categories={categories}
                    selectedCategories={selectedCategories}
                    onCategoryToggle={handleCategoryToggle}
                    onClearAll={handleClearAllFilters}
                  />
                  {/* Featured Projects Section */}
                  {featuredProjects.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-white mb-4">🌟 Featured Projects</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredProjects.map((project, index) => (
                          <div key={project.id} className="animate-fadeInUp hover:scale-105 transition-transform duration-300" style={{animationDelay: `${0.1 * index}s`}}>
                            <ProjectCard project={project} index={index} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Main Projects Grid (excluding featured) */}
                  {(() => {
                    const nonFeaturedProjects = filteredProjects.filter(p => !p.featured);
                    const totalPagesNonFeatured = Math.ceil(nonFeaturedProjects.length / PROJECTS_PER_PAGE);
                    const startIndexNonFeatured = (currentPage - 1) * PROJECTS_PER_PAGE;
                    const endIndexNonFeatured = startIndexNonFeatured + PROJECTS_PER_PAGE;
                    const currentNonFeaturedProjects = nonFeaturedProjects.slice(startIndexNonFeatured, endIndexNonFeatured);
                    return (
                      <>
                        {nonFeaturedProjects.length > 0 && (
                          <div className="mb-8 text-center">
                            <p className="text-slate-300">
                              Showing {currentNonFeaturedProjects.length} of {nonFeaturedProjects.length} projects
                            </p>
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {currentNonFeaturedProjects.map((project, index) => (
                            <div key={project.id} className="animate-fadeInUp hover:scale-105 transition-transform duration-300" style={{animationDelay: `${0.1 * index}s`}}>
                              <ProjectCard project={project} index={index} />
                            </div>
                          ))}
                        </div>
                        {nonFeaturedProjects.length === 0 && !loading && (
                          <div className="text-center py-16">
                            <div className="text-6xl mb-4">🔍</div>
                            <p className="text-slate-400 text-lg mb-2">No projects found matching your search.</p>
                            <p className="text-slate-500 text-sm">Try adjusting your search terms or filters.</p>
                          </div>
                        )}
                        {nonFeaturedProjects.length > 0 && (
                          <ProjectPagination
                            currentPage={currentPage}
                            totalPages={totalPagesNonFeatured}
                            onPageChange={handlePageChange}
                          />
                        )}
                      </>
                    );
                  })()}
                </>
              )}
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'Education' && (
            <div id="education-section">
              <EducationSection educations={educations} loadingEdu={loadingEdu} />
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'Experience' && (
            <div id="experience-section">
              <ExperienceSection experiences={experiences} loadingExp={loadingExp} />
            </div>
          )}
        </div>
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
