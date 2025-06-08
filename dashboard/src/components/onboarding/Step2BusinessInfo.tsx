import React from 'react';
import { Building, Briefcase, Users } from 'lucide-react';
import { BusinessInfo, ValidationErrors } from '../../types';

interface Step2BusinessInfoProps {
  data: BusinessInfo;
  errors: ValidationErrors;
  onChange: (data: BusinessInfo) => void;
}

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Marketing',
  'Consulting',
  'Real Estate',
  'Other'
];

const companySizes = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '500+ employees'
];

export const Step2BusinessInfo: React.FC<Step2BusinessInfoProps> = ({ data, errors, onChange }) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your business</h2>
        <p className="text-gray-600">Help us customize the experience for your industry and team size</p>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
            Company Name *
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              id="company"
              value={data.company}
              onChange={(e) => onChange({ ...data, company: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.company ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Enter your company name"
            />
          </div>
          {errors.company && (
            <p className="mt-1 text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">
              {errors.company}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
            Industry *
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              id="industry"
              value={data.industry}
              onChange={(e) => onChange({ ...data, industry: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white ${
                errors.industry ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <option value="">Select your industry</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>
          {errors.industry && (
            <p className="mt-1 text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">
              {errors.industry}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
            Company Size *
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              id="size"
              value={data.size}
              onChange={(e) => onChange({ ...data, size: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white ${
                errors.size ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <option value="">Select company size</option>
              {companySizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          {errors.size && (
            <p className="mt-1 text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">
              {errors.size}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};