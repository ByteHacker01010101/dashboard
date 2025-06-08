import React, { useState } from 'react';
import { Users, FolderOpen, Bell, Settings, LogOut, User, Building, Plus, BarChart3, FileText, Edit, Trash2, ChevronDown } from 'lucide-react';
import { UserData } from '../../types';
import { InfoCard } from './InfoCard';
import { Button } from '../common/Button';
import { ProjectModal } from './ProjectModal';
import { ReportsView } from './ReportsView';
import { TeamSettings } from './TeamSettings';
import { PreferencesModal } from './PreferencesModal';
import { NotificationsPanel } from './NotificationsPanel';
import { useAppData } from '../../hooks/useAppData';
import { useTheme } from '../../hooks/useTheme';

interface DashboardProps {
  userData: UserData;
  onLogout: () => void;
  onUpdateUserData: (userData: UserData) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ userData, onLogout, onUpdateUserData }) => {
  const { appData, addProject, updateProject, deleteProject, addTeamMember, updateTeamMember, markNotificationRead } = useAppData();
  const [activeView, setActiveView] = useState<'dashboard' | 'reports' | 'team'>('dashboard');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);

  useTheme(userData);

  // Real-time stats that update when data changes
  const stats = {
    teamMembers: appData.teamMembers.filter(m => m.status === 'active').length,
    activeProjects: appData.projects.filter(p => p.status === 'in-progress').length,
    notifications: appData.notifications.filter(n => !n.read).length
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleUpdatePreferences = (newUserData: UserData) => {
    onUpdateUserData(newUserData);
  };

  const handleProjectAdd = (project: any) => {
    addProject(project);
    setShowProjectModal(false);
  };

  const handleProjectEdit = (project: any) => {
    updateProject(project.id, project);
    setShowProjectModal(false);
    setEditingProject(null);
  };

  const handleProjectRemove = (projectId: string) => {
    if (confirm('Are you sure you want to remove this project?')) {
      deleteProject(projectId);
    }
  };

  const handleStatusChange = (projectId: string, newStatus: string) => {
    updateProject(projectId, { status: newStatus as any });
  };

  const openEditModal = (project: any) => {
    setEditingProject(project.id);
    setShowProjectModal(true);
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'reports':
        return (
          <ReportsView 
            projects={appData.projects} 
            userData={userData} 
            teamMembers={appData.teamMembers}
          />
        );
      case 'team':
        return (
          <TeamSettings 
            teamMembers={appData.teamMembers}
            onAddMember={addTeamMember}
            onUpdateMember={updateTeamMember}
          />
        );
      default:
        return (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {getGreeting()}, {userData.personal.name.split(' ')[0]}!
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Welcome to your {userData.business.company} dashboard. Here's what's happening today.
              </p>
            </div>

            {/* Stats Cards - Real-time updates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <InfoCard
                title="Team Members"
                value={stats.teamMembers}
                icon={Users}
                color="blue"
                trend={{ value: 12.5, isPositive: true }}
              />
              <InfoCard
                title="Active Projects"
                value={stats.activeProjects}
                icon={FolderOpen}
                color="green"
                trend={{ value: 8.2, isPositive: true }}
              />
              <InfoCard
                title="Notifications"
                value={stats.notifications}
                icon={Bell}
                color="amber"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowProjectModal(true)}
                className="h-20 text-lg"
              >
                <Plus className="w-6 h-6 mr-3" />
                New Project
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setActiveView('reports')}
                className="h-20 text-lg"
              >
                <BarChart3 className="w-6 h-6 mr-3" />
                View Reports
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setActiveView('team')}
                className="h-20 text-lg"
              >
                <Users className="w-6 h-6 mr-3" />
                Team Settings
              </Button>
            </div>

            {/* Recent Projects */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Projects</h3>
                <Button variant="ghost" size="sm" onClick={() => setActiveView('reports')}>
                  <FileText className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {appData.projects.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No projects yet. Create your first project to get started!</p>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => setShowProjectModal(true)}
                      className="mt-4"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Project
                    </Button>
                  </div>
                ) : (
                  appData.projects.slice(0, 5).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg group hover:shadow-md transition-all duration-200">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">{project.name}</h4>
                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              onClick={() => openEditModal(project)}
                              className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                              title="Edit project"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleProjectRemove(project.id)}
                              className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                              title="Remove project"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{project.description}</p>
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <select
                              value={project.status}
                              onChange={(e) => handleStatusChange(project.id, e.target.value)}
                              className={`px-2 py-1 text-xs rounded-full border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                                project.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                project.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                project.status === 'planning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                              }`}
                            >
                              <option value="planning">Planning</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="on-hold">On Hold</option>
                            </select>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {project.progress}% complete
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ${project.budget.toLocaleString()} budget
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {project.teamMembers.length} members
                          </span>
                        </div>
                      </div>
                      <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2 ml-4">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* User Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Info Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center mb-4">
                  <User className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Name</span>
                    <p className="font-medium text-gray-900 dark:text-white">{userData.personal.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
                    <p className="font-medium text-gray-900 dark:text-white">{userData.personal.email}</p>
                  </div>
                </div>
              </div>

              {/* Business Info Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center mb-4">
                  <Building className="w-5 h-5 text-indigo-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Business Information</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Company</span>
                    <p className="font-medium text-gray-900 dark:text-white">{userData.business.company}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Industry</span>
                    <p className="font-medium text-gray-900 dark:text-white">{userData.business.industry}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Size</span>
                    <p className="font-medium text-gray-900 dark:text-white">{userData.business.size}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  const currentProject = editingProject ? appData.projects.find(p => p.id === editingProject) : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              </div>
              
              <nav className="hidden md:flex space-x-4">
                <button
                  onClick={() => setActiveView('dashboard')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeView === 'dashboard' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveView('reports')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeView === 'reports' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  Reports
                </button>
                <button
                  onClick={() => setActiveView('team')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeView === 'team' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  Team
                </button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <User className="w-4 h-4" />
                <span>{userData.personal.name}</span>
              </div>
              
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative"
                >
                  <Bell className="w-4 h-4" />
                  {stats.notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {stats.notifications}
                    </span>
                  )}
                </Button>
                {showNotifications && (
                  <NotificationsPanel
                    notifications={appData.notifications}
                    onMarkRead={markNotificationRead}
                    onClose={() => setShowNotifications(false)}
                  />
                )}
              </div>
              
              <Button variant="ghost" size="sm" onClick={() => setShowPreferences(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderMainContent()}
      </main>

      {/* Modals */}
      {showProjectModal && (
        <ProjectModal
          onClose={() => {
            setShowProjectModal(false);
            setEditingProject(null);
          }}
          onSave={editingProject ? handleProjectEdit : handleProjectAdd}
          teamMembers={appData.teamMembers}
          project={currentProject}
        />
      )}

      {showPreferences && (
        <PreferencesModal
          userData={userData}
          onClose={() => setShowPreferences(false)}
          onSave={handleUpdatePreferences}
        />
      )}
    </div>
  );
};