import React from 'react';
import { Settings, Sun, Moon, Monitor, Layout, Grid, Minimize2 } from 'lucide-react';
import { Preferences, ValidationErrors } from '../../types';

interface Step3PreferencesProps {
  data: Preferences;
  errors: ValidationErrors;
  onChange: (data: Preferences) => void;
}

export const Step3Preferences: React.FC<Step3PreferencesProps> = ({ data, errors, onChange }) => {
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
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Customize your experience</h2>
        <p className="text-gray-600">Set your preferences to make the dashboard feel just right</p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme Preference</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onChange({ ...data, theme: option.id as any })}
                  className={`p-4 border-2 rounded-lg transition-all duration-200 text-left hover:shadow-md ${
                    data.theme === option.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-2 ${data.theme === option.id ? 'text-blue-600' : 'text-gray-600'}`} />
                  <h4 className="font-medium text-gray-900 mb-1">{option.label}</h4>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </button>
              );
            })}
          </div>
          {errors.theme && (
            <p className="mt-2 text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">
              {errors.theme}
            </p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Layout</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {layoutOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onChange({ ...data, dashboardLayout: option.id as any })}
                  className={`p-4 border-2 rounded-lg transition-all duration-200 text-left hover:shadow-md ${
                    data.dashboardLayout === option.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-2 ${data.dashboardLayout === option.id ? 'text-blue-600' : 'text-gray-600'}`} />
                  <h4 className="font-medium text-gray-900 mb-1">{option.label}</h4>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </button>
              );
            })}
          </div>
          {errors.dashboardLayout && (
            <p className="mt-2 text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">
              {errors.dashboardLayout}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};