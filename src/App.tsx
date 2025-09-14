import React, { useState, useEffect } from 'react';
import { Settings, Camera, Home, Users, Map, MessageSquare, Heart, ShoppingCart } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { WelcomePage } from './components/WelcomePage';
import { JobOpportunitiesExplorer } from './components/JobOpportunitiesExplorer';
import { AccessibleNavigationMaps } from './components/AccessibleNavigationMaps';
import { CommunitySupport } from './components/CommunitySupport';
import { ContributeShopMarketplace } from './components/ContributeShopMarketplace';
import { AccessibilitySettingsPanel } from './components/AccessibilitySettingsPanel';
import { CameraOCRPanel } from './components/CameraOCRPanel';
import { FloatingAccessibilityControls } from './components/FloatingAccessibilityControls';

import { TranslationProvider, useTranslation } from './components/services/TranslationService';

function AppContent() {
  const { t, language, isRTL } = useTranslation();
  const [currentPage, setCurrentPage] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSimpleMode, setIsSimpleMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [disabilityType, setDisabilityType] = useState('none');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Apply dark mode class to document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  // Apply font size
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
    }
  }, [fontSize]);

  const navigationItems = [
    { id: 'home', label: t('home'), icon: Home, ariaLabel: t('home') },
    { id: 'opportunities', label: t('opportunities'), icon: Heart, ariaLabel: t('jobOpportunities') },
    { id: 'safepaths', label: t('safePaths'), icon: Map, ariaLabel: t('safeRoutes') },
    { id: 'community', label: t('community'), icon: MessageSquare, ariaLabel: t('communitySupport') },
    { id: 'shop', label: t('contributeShop'), icon: ShoppingCart, ariaLabel: t('contributeShop') }
  ];

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <WelcomePage />;
      case 'opportunities':
        return <JobOpportunitiesExplorer />;
      case 'safepaths':
        return <AccessibleNavigationMaps />;
      case 'community':
        return <CommunitySupport />;
      case 'shop':
        return <ContributeShopMarketplace />;
      default:
        return <WelcomePage />;
    }
  };

  return (
    <div 
      className={`min-h-screen ${isSimpleMode ? 'bg-white dark:bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-orange-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={language}
    >
      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50"
        tabIndex={0}
      >
        {t('skipToContent')}
      </a>

      {/* Header */}
      <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-blue-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-blue-900 dark:text-blue-100">{t('appTitle')}</h1>
                <p className="text-sm font-body text-green-700 dark:text-green-300">{t('appSubtitle')}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className={`flex ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`} role="navigation" aria-label={t('mainNavigation')}>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? "default" : "ghost"}
                    onClick={() => setCurrentPage(item.id)}
                    className={`flex items-center font-body ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} ${
                      currentPage === item.id 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'text-blue-800 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900'
                    }`}
                    aria-label={item.ariaLabel}
                    aria-current={currentPage === item.id ? 'page' : undefined}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-body">{item.label}</span>
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main 
        id="main-content" 
        className="container mx-auto px-4 py-8"
        role="main"
        aria-label={t('mainContent')}
      >
        {renderCurrentPage()}
      </main>

      {/* Floating Accessibility Controls */}
      <FloatingAccessibilityControls
        onSettingsClick={() => setIsSettingsOpen(true)}
        onCameraClick={() => setIsCameraOpen(true)}
        isDarkMode={isDarkMode}
        onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Settings Panel */}
      <AccessibilitySettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isSimpleMode={isSimpleMode}
        setIsSimpleMode={setIsSimpleMode}
        fontSize={fontSize}
        setFontSize={setFontSize}
        disabilityType={disabilityType}
        setDisabilityType={setDisabilityType}
      />

      {/* Camera OCR Panel */}
      <CameraOCRPanel
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
      />



      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-blue-200 dark:border-gray-700 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="font-heading font-bold text-blue-800 dark:text-blue-200 mb-2">
              {t('footerTitle')}
            </p>
            <p className="text-sm font-body text-gray-600 dark:text-gray-400">
              {t('footerDesc')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <TranslationProvider>
      <AppContent />
    </TranslationProvider>
  );
}