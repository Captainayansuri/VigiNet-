import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import MobileShell from './components/layout/MobileShell';
import HomeScreen from './components/screens/HomeScreen';
import ReportFlow from './components/screens/ReportFlow';
import MyReportsScreen from './components/screens/MyReportsScreen';
import SafetyScreen from './components/screens/SafetyScreen';
import SosScreen from './components/screens/SosScreen';
import SplashScreen from './components/screens/SplashScreen';
import OnboardingModal from './components/modals/OnboardingModal';

function MainAppContent() {
  const { activeTab, showOnboarding, setShowOnboarding } = useApp();
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <>
      <MobileShell>
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'report' && <ReportFlow />}
        {activeTab === 'my_reports' && <MyReportsScreen />}
        {activeTab === 'safety' && <SafetyScreen />}
        {activeTab === 'sos' && <SosScreen />}
      </MobileShell>

      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
      />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
