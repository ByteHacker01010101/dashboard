export interface PersonalInfo {
  name: string;
  email: string;
}

export interface BusinessInfo {
  company: string;
  industry: string;
  size: string;
}

export interface Preferences {
  theme: 'light' | 'dark' | 'auto';
  dashboardLayout: 'compact' | 'detailed' | 'minimal';
}

export interface UserData {
  personal: PersonalInfo;
  business: BusinessInfo;
  preferences: Preferences;
  onboardingCompleted: boolean;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface DashboardStats {
  teamMembers: number;
  activeProjects: number;
  notifications: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high';
  startDate: string;
  endDate: string;
  progress: number;
  teamMembers: string[];
  budget: number;
  spent: number;
  tasks: Task[];
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  assignee: string;
  dueDate: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface AppData {
  userData: UserData;
  projects: Project[];
  teamMembers: TeamMember[];
  notifications: Notification[];
}

export interface ChartData {
  name: string;
  value: number;
  projects?: number;
  completed?: number;
  revenue?: number;
}