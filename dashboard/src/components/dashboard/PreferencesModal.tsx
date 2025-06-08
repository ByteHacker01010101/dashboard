import React, { useState } from 'react';
import { X, Sun, Moon, Monitor, Layout, Grid, Minimize2 } from 'lucide-react';
import { UserData } from '../../types';
import { Button } from '../common/Button';

interface PreferencesModalProps {
  userData: UserData;
  onClose: () => void;
  onSave: (userData: UserData) => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({ userData, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    theme: userData.preferences.theme,
    dashboardLayout: userData.preferences.dashboardLayout
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedUserData: UserData = {
      ...userData,
      preferences: {
        theme: formData.theme,
        dashboardLayout: formData.dashboardLayout
      }
    };
    
    onSave(updatedUserData);
    onClose();
  };

  const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun, description: 'Clean and bright interface' },
    { id: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes' },
    { id: 'auto', label: 'Auto', icon: Monitor, description: 'Matches your system' }
  ];

  const layoutOptions = [
    { id: 'compact', label: 'Compact', icon: Grid, description: 'Information-dense layout' },
    { id: 'detailed', label: 'Detailed', icon: Layout, description: 'Spacious with rich details' },
    { id: 'minimal', label: 'Minimal', icon: Minimize2, description: 'Clean and focused' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Preferences</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theme Preference</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, theme: option.id as any }))}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 text-left hover:shadow-md ${
                      formData.theme === option.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${formData.theme === option.id ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'}`} />
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">{option.label}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dashboard Layout</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {layoutOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, dashboardLayout: option.id as any }))}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 text-left hover:shadow-md ${
                      formData.dashboardLayout === option.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${formData.dashboardLayout === option.id ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'}`} />
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">{option.label}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Preferences
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};