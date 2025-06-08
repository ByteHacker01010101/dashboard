import { ValidationErrors, PersonalInfo, BusinessInfo, Preferences } from '../types';

export const validatePersonalInfo = (data: PersonalInfo): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  return errors;
};

export const validateBusinessInfo = (data: BusinessInfo): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.company.trim()) {
    errors.company = 'Company name is required';
  } else if (data.company.trim().length < 2) {
    errors.company = 'Company name must be at least 2 characters';
  }

  if (!data.industry) {
    errors.industry = 'Please select an industry';
  }

  if (!data.size) {
    errors.size = 'Please select company size';
  }

  return errors;
};

export const validatePreferences = (data: Preferences): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.theme) {
    errors.theme = 'Please select a theme preference';
  }

  if (!data.dashboardLayout) {
    errors.dashboardLayout = 'Please select a dashboard layout';
  }

  return errors;
};