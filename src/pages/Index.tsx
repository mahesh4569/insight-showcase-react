import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import { useFileUpload, getProfilePicUrl } from '../hooks/useFileUpload';
import ProjectCard from '../components/ProjectCard';
import SplashScreen from '../components/SplashScreen';
import ContactButton from '../components/ContactButton';
import { useNavigate } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const { projects, loading } = useProjects();
  const [showSplash, setShowSplash] = useState(true);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [profilePicTimestamp, setProfilePicTimestamp] = useState(Date.now());
  const [profilePicExtension, setProfilePicExtension] = useState('jpg');
  const navigate = useNavigate();
  const projectsRef = useRef<HTMLDivElement>(null);
  const { getVerifiedResumeUrl } = useFileUpload();

  useEffect(() => {
    if (!loading) {
      const featured = projects.filter(project => project.featured);
      setFeaturedProjects(featured.length > 0 ? featured : projects.slice(0, 3));
    }
  }, [projects, loading]);

  useEffect(() => {
    const updateProfilePic = () => {
      const url = getProfilePicUrl('1', profilePicExtension, profilePicTimestamp);
      setProfilePicUrl(url);
    };
    updateProfilePic();

    // Listen for profile picture updates
    const handleProfilePicUpdate = (event: CustomEvent) => {
      console.log('Index: Profile picture updated event received:', event.detail);
      setProfilePicTimestamp(event.detail.timestamp);
      // Update extension if provided
      if (event.detail.extension) {
        setProfilePicExtension(event.detail.extension);
      }
    };
    window.addEventListener('profilePicUpdated', handleProfilePicUpdate as EventListener);
    return () => {
      window.removeEventListener('profilePicUpdated', handleProfilePicUpdate as EventListener);
    };
  }, [profilePicTimestamp, profilePicExtension]);

  const scrollToProjects = () => {
    projectsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {showSplash && <SplashScreen onAnimationComplete={() => setShowSplash(false)} />}
      
      {!showSplash && (
        <>
          {/* Navigation */}
          <nav className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  {profilePicUrl ? (
                    <img 
                      key={`nav-${profilePicTimestamp}-${profilePicExtension}`}
                      src={profilePicUrl} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full object-cover border-2 border-blue-400/50"
                      onLoad={() => console.log('Navigation profile image loaded successfully')}
                      onError={(e) => {
                        console.log('Navigation profile image failed to load, trying different extensions');
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        
                        // Try different extensions
                        const extensions = ['png', 'jpg', 'jpeg', 'webp'];
                        const currentIndex = extensions.indexOf(profilePicExtension);
                        const nextIndex = (currentIndex + 1) % extensions.length;
                        if (nextIndex !== currentIndex) {
                          setTimeout(() => {
                            setProfilePicExtension(extensions[nextIndex]);
                          }, 100);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">M</span>
                    </div>
                  )}
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Mahesh
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <a 
                  href="#projects" 
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToProjects();
                  }}
                  className="text-slate-300 hover:text-white transition-colors duration-300 hover:scale-105 transform"
                >
                  Projects
                </a>
                <a 
                  href="#"
                  onClick={async (e) => {
                    e.preventDefault();
                    if (user?.id) {
                      const resumeUrl = await getVerifiedResumeUrl(user.id);
                      if (resumeUrl) {
                        window.open(resumeUrl, '_blank');
                      } else {
                        alert('Resume not found. Please upload a resume from the dashboard.');
                      }
                    } else {
                      alert('Please sign in to download the resume.');
                    }
                  }}
                  className="text-slate-300 hover:text-white transition-colors duration-300 hover:scale-105 transform"
                >
                  Resume
                </a>
                <ContactButton />
                <a 
                  href="/dashboard" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 transform"
                >
                  Dashboard
                </a>
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="min-h-screen flex items-center justify-center px-6 pt-20">
            <div className="text-center max-w-4xl mx-auto">
              <div className="mb-6 inline-block">
                {profilePicUrl ? (
                  <img 
                    key={`hero-${profilePicTimestamp}-${profilePicExtension}`}
                    src={profilePicUrl} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-400/50 mx-auto"
                    onLoad={() => console.log('Hero profile image loaded successfully')}
                    onError={(e) => {
                      console.log('Hero profile image failed to load, trying different extensions');
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = 'none';
                      
                      // Try different extensions
                      const extensions = ['png', 'jpg', 'jpeg', 'webp'];
                      const currentIndex = extensions.indexOf(profilePicExtension);
                      const nextIndex = (currentIndex + 1) % extensions.length;
                      if (nextIndex !== currentIndex) {
                        setTimeout(() => {
                          setProfilePicExtension(extensions[nextIndex]);
                        }, 100);
                      }
                    }}
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center mx-auto">
                    <span className="text-white font-bold text-4xl">M</span>
                  </div>
                )}
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fadeInUp">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Mahesh Gaddam
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-8 animate-fadeInUp animation-delay-200 max-w-2xl mx-auto">
                Data Analyst & Business Intelligence Specialist
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fadeInUp animation-delay-300">
                <a 
                  href="#projects" 
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToProjects();
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 transform flex items-center space-x-2"
                >
                  <span>View Projects</span>
                  <ArrowDown className="w-4 h-4" />
                </a>
                <ContactButton variant="secondary" />
              </div>
              <div className="flex flex-wrap justify-center gap-6 animate-fadeInUp animation-delay-400">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 text-slate-300">
                  Power BI
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 text-slate-300">
                  Excel
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 text-slate-300">
                  SQL
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 text-slate-300">
                  Python
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 text-slate-300">
                  Tableau
                </div>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div id="projects" ref={projectsRef} className="py-20 px-6">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4 animate-fadeInUp">
                  Featured Projects
                </h2>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto animate-fadeInUp animation-delay-100">
                  Explore my data analysis and visualization projects
                </p>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredProjects.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                  ))}
                </div>
              )}

              <div className="text-center mt-12">
                <a 
                  href="/projects" 
                  className="inline-block bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 transform"
                >
                  View All Projects
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-white/5 backdrop-blur-md border-t border-white/10 py-8">
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-slate-300 mb-4 md:mb-0">
                  © 2023 Mahesh Gaddam. All rights reserved.
                </div>
                <div className="flex space-x-6">
                  <a href="#" className="text-slate-300 hover:text-white transition-colors">
                    LinkedIn
                  </a>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors">
                    GitHub
                  </a>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors">
                    Twitter
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default Index;
