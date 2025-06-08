import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart, ComposedChart } from 'recharts';
import { Project, UserData, ChartData, TeamMember } from '../../types';
import { Calendar, TrendingUp, DollarSign, Clock, Filter, Users, Target, Award, UserCheck, UserX, Building } from 'lucide-react';
import { Button } from '../common/Button';

interface ReportsViewProps {
  projects: Project[];
  userData: UserData;
  teamMembers: TeamMember[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ projects, userData, teamMembers }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedChart, setSelectedChart] = useState<'overview' | 'progress' | 'budget' | 'timeline' | 'team'>('overview');

  // Filter projects based on timeframe
  const filteredProjects = useMemo(() => {
    const now = new Date();
    const timeframes = {
      week: 7,
      month: 30,
      quarter: 90,
      year: 365
    };
    
    const daysBack = timeframes[selectedTimeframe];
    const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
    
    return projects.filter(project => {
      const projectDate = new Date(project.createdAt);
      return projectDate >= cutoffDate;
    });
  }, [projects, selectedTimeframe]);

  // Calculate project statistics
  const projectStats = {
    total: filteredProjects.length,
    completed: filteredProjects.filter(p => p.status === 'completed').length,
    inProgress: filteredProjects.filter(p => p.status === 'in-progress').length,
    planning: filteredProjects.filter(p => p.status === 'planning').length,
    onHold: filteredProjects.filter(p => p.status === 'on-hold').length
  };

  const budgetStats = {
    totalBudget: filteredProjects.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: filteredProjects.reduce((sum, p) => sum + p.spent, 0),
    avgProgress: filteredProjects.length > 0 ? filteredProjects.reduce((sum, p) => sum + p.progress, 0) / filteredProjects.length : 0
  };

  // Team statistics
  const teamStats = {
    total: teamMembers.length,
    active: teamMembers.filter(m => m.status === 'active').length,
    inactive: teamMembers.filter(m => m.status === 'inactive').length,
    roles: teamMembers.reduce((acc, member) => {
      acc[member.role] = (acc[member.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  // Chart data based on real project inputs
  const statusData: ChartData[] = [
    { name: 'Completed', value: projectStats.completed, color: '#10B981' },
    { name: 'In Progress', value: projectStats.inProgress, color: '#3B82F6' },
    { name: 'Planning', value: projectStats.planning, color: '#F59E0B' },
    { name: 'On Hold', value: projectStats.onHold, color: '#EF4444' }
  ].filter(item => item.value > 0);

  const progressData: ChartData[] = filteredProjects.map(p => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    value: p.progress,
    budget: p.budget,
    spent: p.spent,
    status: p.status
  }));

  const budgetData: ChartData[] = filteredProjects.map(p => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    budget: p.budget,
    spent: p.spent,
    remaining: p.budget - p.spent,
    progress: p.progress
  }));

  // Team role distribution
  const teamRoleData: ChartData[] = Object.entries(teamStats.roles).map(([role, count]) => ({
    name: role,
    value: count,
    percentage: Math.round((count / teamStats.total) * 100)
  }));

  // Team status data
  const teamStatusData: ChartData[] = [
    { name: 'Active', value: teamStats.active, color: '#10B981' },
    { name: 'Inactive', value: teamStats.inactive, color: '#EF4444' }
  ].filter(item => item.value > 0);

  // Timeline data based on actual project dates and timeframe
  const timelineData: ChartData[] = useMemo(() => {
    const now = new Date();
    const data = [];
    
    if (selectedTimeframe === 'week') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayProjects = projects.filter(p => {
          const pDate = new Date(p.createdAt);
          return pDate.toDateString() === date.toDateString();
        });
        
        data.push({
          name: date.toLocaleDateString('en-US', { weekday: 'short' }),
          projects: dayProjects.length,
          completed: dayProjects.filter(p => p.status === 'completed').length,
          revenue: dayProjects.reduce((sum, p) => sum + (p.budget - p.spent), 0),
          budget: dayProjects.reduce((sum, p) => sum + p.budget, 0)
        });
      }
    } else if (selectedTimeframe === 'month') {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
        const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        
        const weekProjects = projects.filter(p => {
          const pDate = new Date(p.createdAt);
          return pDate >= weekStart && pDate < weekEnd;
        });
        
        data.push({
          name: `Week ${4 - i}`,
          projects: weekProjects.length,
          completed: weekProjects.filter(p => p.status === 'completed').length,
          revenue: weekProjects.reduce((sum, p) => sum + (p.budget - p.spent), 0),
          budget: weekProjects.reduce((sum, p) => sum + p.budget, 0)
        });
      }
    } else if (selectedTimeframe === 'quarter') {
      // Last 3 months
      for (let i = 2; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        
        const monthProjects = projects.filter(p => {
          const pDate = new Date(p.createdAt);
          return pDate >= monthDate && pDate < nextMonth;
        });
        
        data.push({
          name: monthDate.toLocaleDateString('en-US', { month: 'short' }),
          projects: monthProjects.length,
          completed: monthProjects.filter(p => p.status === 'completed').length,
          revenue: monthProjects.reduce((sum, p) => sum + (p.budget - p.spent), 0),
          budget: monthProjects.reduce((sum, p) => sum + p.budget, 0)
        });
      }
    } else {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        
        const monthProjects = projects.filter(p => {
          const pDate = new Date(p.createdAt);
          return pDate >= monthDate && pDate < nextMonth;
        });
        
        data.push({
          name: monthDate.toLocaleDateString('en-US', { month: 'short' }),
          projects: monthProjects.length,
          completed: monthProjects.filter(p => p.status === 'completed').length,
          revenue: monthProjects.reduce((sum, p) => sum + (p.budget - p.spent), 0),
          budget: monthProjects.reduce((sum, p) => sum + p.budget, 0)
        });
      }
    }
    
    return data;
  }, [projects, selectedTimeframe]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  const renderChart = () => {
    switch (selectedChart) {
      case 'progress':
        return (
          <ResponsiveContainer width="100%\" height={400}>
            <ComposedChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'Progress') return [`${value}%`, name];
                  return [`$${value?.toLocaleString()}`, name];
                }}
              />
              <Bar yAxisId="left" dataKey="value" fill="#3B82F6" name="Progress" />
              <Line yAxisId="right" type="monotone" dataKey="budget" stroke="#10B981" strokeWidth={2} name="Budget" />
            </ComposedChart>
          </ResponsiveContainer>
        );
      
      case 'budget':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={budgetData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value?.toLocaleString()}`, '']} />
              <Bar dataKey="budget" fill="#10B981" name="Budget" />
              <Bar dataKey="spent" fill="#EF4444" name="Spent" />
              <Bar dataKey="remaining" fill="#3B82F6" name="Remaining" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'timeline':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'Revenue' || name === 'Budget') {
                    return [`$${value?.toLocaleString()}`, name];
                  }
                  return [value, name];
                }}
              />
              <Area yAxisId="left" type="monotone" dataKey="projects" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Total Projects" />
              <Area yAxisId="left" type="monotone" dataKey="completed" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Completed" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={3} name="Revenue" />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'team':
        return (
          <div className="space-y-6">
            {/* Team Settings Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Settings</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{userData.business.company} Team Overview</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{teamStats.total}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{teamStats.active}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Active</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <UserX className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{teamStats.inactive}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Inactive</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{Object.keys(teamStats.roles).length}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Roles</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {teamStats.total > 0 ? Math.round((teamStats.active / teamStats.total) * 100) : 0}%
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Active Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Role Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={teamRoleData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percentage }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {teamRoleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Status</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={teamStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {teamStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Role Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Role Breakdown</h4>
              <div className="space-y-3">
                {teamRoleData.map((role, index) => (
                  <div key={role.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium text-gray-900 dark:text-white">{role.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {role.value} member{role.value !== 1 ? 's' : ''}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {role.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [typeof value === 'number' && value > 1000 ? `$${value.toLocaleString()}` : value, '']} />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Revenue" />
                <Line type="monotone" dataKey="budget" stroke="#3B82F6" strokeWidth={2} name="Budget" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Project Reports</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Analytics and insights for {userData.business.company} ({selectedTimeframe})
          </p>
        </div>
        
        <div className="flex space-x-2">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{projectStats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Team Members</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{teamStats.active}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {projectStats.total > 0 ? Math.round((projectStats.completed / projectStats.total) * 100) : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${budgetStats.totalBudget.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(budgetStats.avgProgress)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedChart === 'overview' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedChart('overview')}
          >
            Overview
          </Button>
          <Button
            variant={selectedChart === 'progress' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedChart('progress')}
          >
            Progress
          </Button>
          <Button
            variant={selectedChart === 'budget' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedChart('budget')}
          >
            Budget
          </Button>
          <Button
            variant={selectedChart === 'timeline' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedChart('timeline')}
          >
            Timeline
          </Button>
          <Button
            variant={selectedChart === 'team' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedChart('team')}
          >
            Team Analytics
          </Button>
        </div>

        {renderChart()}
      </div>

      {/* Project Details Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Project Details ({selectedTimeframe})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3">Project</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Progress</th>
                <th className="px-6 py-3">Budget</th>
                <th className="px-6 py-3">Spent</th>
                <th className="px-6 py-3">Team</th>
                <th className="px-6 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {project.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      project.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      project.status === 'planning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                    }`}>
                      {project.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    ${project.budget.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    ${project.spent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {project.teamMembers.length} members
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProjects.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No projects found for the selected timeframe
            </div>
          )}
        </div>
      </div>
    </div>
  );
};