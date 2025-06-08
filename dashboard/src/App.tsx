import React, { useEffect } from 'react';
import { UserData } from './types';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { Dashboard } from './components/dashboard/Dashboard';
import { useAppData } from './hooks/useAppData';

const initialUserData: UserData = {
  personal: { name: '', email: '' },
  business: { company: '', industry: '', size: '' },
  preferences: { theme: 'light', dashboardLayout: 'detailed' },
  onboardingCompleted: false
};

function App() {
  const { appData, updateUserData, generateSampleData } = useAppData();

  const handleOnboardingComplete = (completedUserData: UserData) => {
    updateUserData(completedUserData);
    // Generate sample data based on user input
    generateSampleData(completedUserData);
  };

  const handleLogout = () => {
    updateUserData(initialUserData);
  };

  const handleUpdateUserData = (newUserData: UserData) => {
    updateUserData(newUserData);
  };

  // Show onboarding if not completed
  if (!appData.userData.onboardingCompleted) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  // Show dashboard if onboarding is completed
  return (
    <Dashboard 
      userData={appData.userData} 
      onLogout={handleLogout}
      onUpdateUserData={handleUpdateUserData}
    />
  );
}

export default App;