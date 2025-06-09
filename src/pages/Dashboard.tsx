import React, { useState, useEffect } from 'react';
import { Upload, Plus, Eye, Trash2, Edit3, LogOut, Star } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import { useNavigate } from 'react-router-dom';
import ProjectUploadForm from '../components/ProjectUploadForm';
import FileUploadForm from '../components/FileUploadForm';
import { getProfilePicUrl } from '../hooks/useFileUpload';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { useEducations } from '../hooks/useEducations';
import { useExperiences } from '../hooks/useExperiences';
import EducationForm from '../components/EducationForm';
import ExperienceForm from '../components/ExperienceForm';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { projects, loading, deleteProject, updateProject } = useProjects();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const navigate = useNavigate();
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const { educations, loading: loadingEdu, addEducation, updateEducation, deleteEducation } = useEducations();
  const { experiences, loading: loadingExp, addExperience, updateExperience, deleteExperience } = useExperiences();
  const [showEduForm, setShowEduForm] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);
  const [showExpForm, setShowExpForm] = useState(false);
  const [editingExp, setEditingExp] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      // For demo, assume jpg
      setProfilePicUrl(getProfilePicUrl(user.id, 'jpg'));
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(projectId);
    }
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setShowUploadForm(true);
  };

  const handleCloseForm = () => {
    setShowUploadForm(false);
    setEditingProject(null);
  };

  const handleToggleFeatured = async (project: any) => {
    await updateProject(project.id, { featured: !project.featured });
  };

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-fadeInUp">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 animate-scale-in">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              Mahesh
            </div>
            <div className="border-l border-white/30 pl-4">
              <h1 className="text-2xl font-bold text-white">Project Dashboard</h1>
              <p className="text-slate-300 text-sm">Welcome back, {user.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowUploadForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 hover:scale-105 transform"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 hover:scale-105 transform"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="projects">
          <TabsList className="mb-8">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
          </TabsList>
          <TabsContent value="projects">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
                <h3 className="text-lg font-semibold text-white mb-2">Total Projects</h3>
                <p className="text-3xl font-bold text-blue-400 animate-pulse">{projects.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                <h3 className="text-lg font-semibold text-white mb-2">Technologies Used</h3>
                <p className="text-3xl font-bold text-purple-400 animate-pulse">
                  {new Set(projects.flatMap(p => p.tech_stack)).size}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
                <h3 className="text-lg font-semibold text-white mb-2">Published</h3>
                <p className="text-3xl font-bold text-green-400 animate-pulse">{projects.length}</p>
              </div>
            </div>

            {/* Profile Picture Upload Section */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8 animate-fadeInUp">
              <h2 className="text-lg font-bold text-white mb-2">Profile Picture</h2>
              <div className="flex items-center gap-6">
                <div>
                  {profilePicUrl ? (
                    <img src={profilePicUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-blue-400" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center text-3xl text-white">👤</div>
                  )}
                </div>
                <FileUploadForm
                  onFileUploaded={(url) => setProfilePicUrl(url)}
                  accept="image/*"
                  bucket="profile-pics"
                  label="Upload Profile Picture"
                />
              </div>
            </div>

            {/* Resume Upload Section */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8 animate-fadeInUp">
              <h2 className="text-lg font-bold text-white mb-2">Upload Resume</h2>
              <FileUploadForm
                onFileUploaded={(url) => setResumeUrl(url)}
                accept=".pdf,.doc,.docx"
                bucket="resumes"
                label="Resume File (PDF, DOC, DOCX)"
              />
              {resumeUrl && (
                <div className="mt-4">
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">View Uploaded Resume</a>
                </div>
              )}
            </div>

            {/* Projects Table */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden animate-fadeInUp" style={{animationDelay: '0.4s'}}>
              <div className="p-6 border-b border-white/20">
                <h2 className="text-xl font-bold text-white">Manage Projects</h2>
              </div>
              
              {loading ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-400 animate-pulse">Loading projects...</p>
                </div>
              ) : projects.length === 0 ? (
                <div className="p-8 text-center animate-fadeInUp">
                  <p className="text-slate-400 mb-4">No projects found</p>
                  <button
                    onClick={() => setShowUploadForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 transform"
                  >
                    Add Your First Project
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left p-4 text-slate-300 font-medium">Project</th>
                        <th className="text-left p-4 text-slate-300 font-medium">Tech Stack</th>
                        <th className="text-left p-4 text-slate-300 font-medium">Status</th>
                        <th className="text-left p-4 text-slate-300 font-medium">Featured</th>
                        <th className="text-left p-4 text-slate-300 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project, index) => (
                        <tr key={project.id} className="border-b border-white/10 hover:bg-white/5 transition-all duration-300 animate-fadeInUp" style={{animationDelay: `${0.1 * (index + 1)}s`}}>
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              {project.image_url && (
                                <img
                                  src={project.image_url}
                                  alt={project.title}
                                  className="w-12 h-12 rounded-lg object-cover transition-transform duration-300 hover:scale-110"
                                />
                              )}
                              <div>
                                <h3 className="text-white font-medium">{project.title}</h3>
                                <p className="text-slate-400 text-sm">{project.description.slice(0, 50)}...</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {project.tech_stack.slice(0, 3).map((tech, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-600/30 text-blue-300 text-xs rounded-full transition-all duration-300 hover:bg-blue-600/50 hover:scale-105"
                                >
                                  {tech}
                                </span>
                              ))}
                              {project.tech_stack.length > 3 && (
                                <span className="px-2 py-1 bg-slate-600/30 text-slate-300 text-xs rounded-full transition-all duration-300 hover:bg-slate-600/50 hover:scale-105">
                                  +{project.tech_stack.length - 3}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-3 py-1 bg-green-600/30 text-green-300 text-sm rounded-full animate-pulse">
                              Published
                            </span>
                          </td>
                          <td className="p-4">
                            <button onClick={() => handleToggleFeatured(project)} className="text-yellow-400 hover:text-yellow-500">
                              {project.featured ? <Star fill="currentColor" /> : <Star />}
                            </button>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              {project.live_link && (
                                <a
                                  href={project.live_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-slate-400 hover:text-blue-400 transition-all duration-300 hover:scale-125 transform"
                                >
                                  <Eye className="w-4 h-4" />
                                </a>
                              )}
                              <button 
                                onClick={() => handleEditProject(project)}
                                className="p-2 text-slate-400 hover:text-green-400 transition-all duration-300 hover:scale-125 transform"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProject(project.id)}
                                className="p-2 text-slate-400 hover:text-red-400 transition-all duration-300 hover:scale-125 transform"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="education">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Manage Education</h2>
              <button onClick={() => { setShowEduForm(true); setEditingEdu(null); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Add Education</button>
            </div>
            {showEduForm && (
              <div className="mb-6">
                <EducationForm
                  initialData={editingEdu}
                  onSave={async (data) => {
                    if (editingEdu) await updateEducation(editingEdu.id, data);
                    else await addEducation(data);
                    setShowEduForm(false);
                    setEditingEdu(null);
                  }}
                  onCancel={() => { setShowEduForm(false); setEditingEdu(null); }}
                />
              </div>
            )}
            <div className="mt-6">
              {loadingEdu ? <div className="text-slate-300">Loading...</div> : (
                <ul className="space-y-4">
                  {educations.map(edu => (
                    <li key={edu.id} className="bg-white/10 p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="font-bold text-white">{edu.school} - {edu.degree} ({edu.field})</div>
                        <div className="text-slate-300 text-sm">{edu.start_date} - {edu.end_date || 'Present'}</div>
                        {edu.description && <div className="text-slate-400 text-sm mt-1">{edu.description}</div>}
                      </div>
                      <div className="flex gap-2 mt-2 md:mt-0">
                        <button onClick={() => { setEditingEdu(edu); setShowEduForm(true); }} className="px-3 py-1 bg-green-600 text-white rounded">Edit</button>
                        <button onClick={() => deleteEducation(edu.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </TabsContent>
          <TabsContent value="experience">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Manage Experience</h2>
              <button onClick={() => { setShowExpForm(true); setEditingExp(null); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Add Experience</button>
            </div>
            {showExpForm && (
              <div className="mb-6">
                <ExperienceForm
                  initialData={editingExp}
                  onSave={async (data) => {
                    if (editingExp) await updateExperience(editingExp.id, data);
                    else await addExperience(data);
                    setShowExpForm(false);
                    setEditingExp(null);
                  }}
                  onCancel={() => { setShowExpForm(false); setEditingExp(null); }}
                />
              </div>
            )}
            <div className="mt-6">
              {loadingExp ? <div className="text-slate-300">Loading...</div> : (
                <ul className="space-y-4">
                  {experiences.map(exp => (
                    <li key={exp.id} className="bg-white/10 p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="font-bold text-white">{exp.company} - {exp.title}</div>
                        <div className="text-slate-300 text-sm">{exp.start_date} - {exp.end_date || 'Present'}</div>
                        {exp.description && <div className="text-slate-400 text-sm mt-1">{exp.description}</div>}
                      </div>
                      <div className="flex gap-2 mt-2 md:mt-0">
                        <button onClick={() => { setEditingExp(exp); setShowExpForm(true); }} className="px-3 py-1 bg-green-600 text-white rounded">Edit</button>
                        <button onClick={() => deleteExperience(exp.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="animate-fadeInUp">
          <ProjectUploadForm
            onClose={handleCloseForm}
            project={editingProject}
            isEditing={!!editingProject}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
