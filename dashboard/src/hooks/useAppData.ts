import { useState, useEffect } from 'react';
import { AppData, UserData, Project, TeamMember, Notification } from '../types';

const initialAppData: AppData = {
  userData: {
    personal: { name: '', email: '' },
    business: { company: '', industry: '', size: '' },
    preferences: { theme: 'light', dashboardLayout: 'detailed' },
    onboardingCompleted: false
  },
  projects: [],
  teamMembers: [],
  notifications: []
};

export function useAppData() {
  const [appData, setAppData] = useState<AppData>(() => {
    try {
      const stored = localStorage.getItem('appData');
      return stored ? JSON.parse(stored) : initialAppData;
    } catch {
      return initialAppData;
    }
  });

  useEffect(() => {
    localStorage.setItem('appData', JSON.stringify(appData));
  }, [appData]);

  const updateUserData = (userData: UserData) => {
    setAppData(prev => ({ ...prev, userData }));
  };

  const addProject = (project: Project) => {
    setAppData(prev => ({
      ...prev,
      projects: [...prev.projects, project]
    }));
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setAppData(prev => ({
      ...prev,
      projects: prev.projects.map(p => 
        p.id === projectId ? { ...p, ...updates } : p
      )
    }));
  };

  const deleteProject = (projectId: string) => {
    setAppData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== projectId)
    }));
  };

  const addTeamMember = (member: TeamMember) => {
    setAppData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, member]
    }));
  };

  const updateTeamMember = (memberId: string, updates: Partial<TeamMember>) => {
    setAppData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map(m => 
        m.id === memberId ? { ...m, ...updates } : m
      )
    }));
  };

  const addNotification = (notification: Notification) => {
    setAppData(prev => ({
      ...prev,
      notifications: [notification, ...prev.notifications]
    }));
  };

  const markNotificationRead = (notificationId: string) => {
    setAppData(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    }));
  };

  const generateSampleData = (userData: UserData) => {
    const companySizeMap = {
      '1-10 employees': { teamMembers: 5, projects: 3 },
      '11-50 employees': { teamMembers: 25, projects: 8 },
      '51-200 employees': { teamMembers: 120, projects: 15 },
      '201-500 employees': { teamMembers: 350, projects: 25 },
      '500+ employees': { teamMembers: 750, projects: 40 }
    };

    const sizeData = companySizeMap[userData.business.size as keyof typeof companySizeMap] || 
                     { teamMembers: 10, projects: 5 };

    // Generate sample team members
    const sampleMembers: TeamMember[] = Array.from({ length: Math.min(sizeData.teamMembers, 20) }, (_, i) => ({
      id: `member-${i + 1}`,
      name: `Team Member ${i + 1}`,
      email: `member${i + 1}@${userData.business.company.toLowerCase().replace(/\s+/g, '')}.com`,
      role: ['Developer', 'Designer', 'Manager', 'Analyst', 'Coordinator'][i % 5],
      avatar: `https://images.unsplash.com/photo-${1500000000000 + i}?w=100&h=100&fit=crop&crop=face`,
      joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: Math.random() > 0.1 ? 'active' : 'inactive'
    }));

    // Generate sample projects
    const projectNames = [
      'Website Redesign', 'Mobile App Development', 'Data Analytics Platform',
      'Customer Portal', 'Marketing Campaign', 'Product Launch', 'System Integration',
      'User Experience Audit', 'Security Enhancement', 'Performance Optimization'
    ];

    const sampleProjects: Project[] = Array.from({ length: sizeData.projects }, (_, i) => ({
      id: `project-${i + 1}`,
      name: projectNames[i % projectNames.length],
      description: `Strategic ${userData.business.industry.toLowerCase()} project for ${userData.business.company}`,
      status: ['planning', 'in-progress', 'completed', 'on-hold'][Math.floor(Math.random() * 4)] as any,
      priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
      startDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progress: Math.floor(Math.random() * 100),
      teamMembers: sampleMembers.slice(0, Math.floor(Math.random() * 5) + 2).map(m => m.name),
      budget: Math.floor(Math.random() * 100000) + 10000,
      spent: Math.floor(Math.random() * 50000) + 5000,
      tasks: [],
      createdAt: new Date().toISOString()
    }));

    // Generate sample notifications
    const sampleNotifications: Notification[] = [
      {
        id: 'notif-1',
        title: 'Welcome to your dashboard!',
        message: `Your ${userData.business.company} workspace is ready`,
        type: 'success',
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'notif-2',
        title: 'New team member joined',
        message: 'A new team member has been added to your workspace',
        type: 'info',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ];

    setAppData(prev => ({
      ...prev,
      teamMembers: sampleMembers,
      projects: sampleProjects,
      notifications: sampleNotifications
    }));
  };

  return {
    appData,
    updateUserData,
    addProject,
    updateProject,
    deleteProject,
    addTeamMember,
    updateTeamMember,
    addNotification,
    markNotificationRead,
    generateSampleData
  };
}