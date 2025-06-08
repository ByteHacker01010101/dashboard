import React from 'react';
import { User, Mail } from 'lucide-react';
import { PersonalInfo, ValidationErrors } from '../../types';

interface Step1PersonalInfoProps {
  data: PersonalInfo;
  errors: ValidationErrors;
  onChange: (data: PersonalInfo) => void;
}

export const Step1PersonalInfo: React.FC<Step1PersonalInfoProps> = ({ data, errors, onChange }) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome! Let's get to know you</h2>
        <p className="text-gray-600">Tell us a bit about yourself to personalize your experience</p>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              id="name"
              value={data.name}
              onChange={(e) => onChange({ ...data, name: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Enter your full name"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              id="email"
              value={data.email}
              onChange={(e) => onChange({ ...data, email: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Enter your email address"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">
              {errors.email}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};