import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { UserData, PersonalInfo, BusinessInfo, Preferences, ValidationErrors } from '../../types';
import { validatePersonalInfo, validateBusinessInfo, validatePreferences } from '../../utils/validation';
import { Button } from '../common/Button';
import { ProgressBar } from './ProgressBar';
import { Step1PersonalInfo } from './Step1PersonalInfo';
import { Step2BusinessInfo } from './Step2BusinessInfo';
import { Step3Preferences } from './Step3Preferences';

interface OnboardingWizardProps {
  onComplete: (userData: UserData) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    email: ''
  });

  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    company: '',
    industry: '',
    size: ''
  });

  const [preferences, setPreferences] = useState<Preferences>({
    theme: 'light',
    dashboardLayout: 'detailed'
  });

  const totalSteps = 3;

  const validateCurrentStep = (): boolean => {
    let stepErrors: ValidationErrors = {};

    switch (currentStep) {
      case 1:
        stepErrors = validatePersonalInfo(personalInfo);
        break;
      case 2:
        stepErrors = validateBusinessInfo(businessInfo);
        break;
      case 3:
        stepErrors = validatePreferences(preferences);
        break;
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const userData: UserData = {
      personal: personalInfo,
      business: businessInfo,
      preferences,
      onboardingCompleted: true
    };

    onComplete(userData);
    setIsSubmitting(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1PersonalInfo
            data={personalInfo}
            errors={errors}
            onChange={setPersonalInfo}
          />
        );
      case 2:
        return (
          <Step2BusinessInfo
            data={businessInfo}
            errors={errors}
            onChange={setBusinessInfo}
          />
        );
      case 3:
        return (
          <Step3Preferences
            data={preferences}
            errors={errors}
            onChange={setPreferences}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>

            {currentStep < totalSteps ? (
              <Button
                variant="primary"
                onClick={handleNext}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                loading={isSubmitting}
                className="flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Complete Setup</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};