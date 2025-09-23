import React, { useState, useEffect } from 'react';
import { Settings, Camera, Home, Users, Map, MessageSquare, Heart, ShoppingCart, LogIn, LogOut, User } from 'lucide-react';
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
import { HeaderAIButton } from './components/HeaderAIButton';
import { FloatingAIAssistant } from './components/FloatingAIAssistant';
import { LoginForm } from './components/LoginForm';
import { UserService, UserProfile, AccessibilityAdapter } from './components/services/UserService';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

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
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [adaptationSettings, setAdaptationSettings] = useState({
    showVisualElements: true,
    showAudioElements: true,
    showTextElements: true,
    useHighContrast: false,
    useLargeFonts: false,
    enableScreenReader: false,
    simplifyInterface: false,
    autoPlayAudio: false,
    showDescriptions: true
  });

  // التحقق من الجلسة عند بدء التطبيق
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { user, profile, error } = await UserService.getCurrentSession();
        if (user && profile) {
          setIsLoggedIn(true);
          setUserProfile(profile);
          setDisabilityType(profile.disabilityType || 'none');
          
          // تطبيق إعدادات التكييف
          const settings = AccessibilityAdapter.getAdaptationSettings(profile.disabilityType, language);
          setAdaptationSettings(settings);
          
          // تطبيق الأنماط
          if (profile.disabilityType !== 'none') {
            AccessibilityAdapter.applyStyles(profile.disabilityType);
          }
          
          // تطبيق تفضيلات المستخدم
          if (profile.preferences) {
            if (profile.preferences.largeFonts) {
              setFontSize(20);
            }
            if (profile.preferences.highContrast) {
              setIsDarkMode(true);
            }
          }
        }
      } catch (error) {
        console.error('خطأ في فحص الجلسة:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [language]);

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

  // تطبيق إعدادات التكييف عند تغيير نوع الإعاقة
  useEffect(() => {
    const settings = AccessibilityAdapter.getAdaptationSettings(disabilityType, language);
    setAdaptationSettings(settings);
    
    // تطبيق الأنماط المرئية
    AccessibilityAdapter.applyStyles(disabilityType);
    
    // تحديث إعدادات التبسيط
    setIsSimpleMode(settings.simplifyInterface);
    
    // تحديث إعدادات الخط
    if (settings.useLargeFonts && fontSize < 20) {
      setFontSize(20);
    }
    
    // تحديث إعدادات التباين العالي
    if (settings.useHighContrast) {
      setIsDarkMode(true);
    }
  }, [disabilityType, language]);

  // وظيفة تسجيل الخروج
  const handleLogout = async () => {
    try {
      await UserService.signOut();
      setIsLoggedIn(false);
      setUserProfile(null);
      setDisabilityType('none');
      
      // إعادة تعيين إعدادات التكييف
      const defaultSettings = AccessibilityAdapter.getAdaptationSettings('none', language);
      setAdaptationSettings(defaultSettings);
      
      // إزالة أنماط التكييف
      AccessibilityAdapter.applyStyles('none');
      
      toast.success(language === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully');
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
      toast.error(language === 'ar' ? 'فشل في تسجيل الخروج' : 'Failed to log out');
    }
  };

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
      className={`min-h-screen ${isSimpleMode ? 'bg-white dark:bg-gray-900' : 'bg-gradient-to-br from-purple-100 via-orange-100 to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'}`}
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
      <header className="header-new-style bg-purple-50/95 dark:bg-gray-900/95 border-b border-purple-200/50 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-green-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-purple-600 dark:text-purple-100">{t('appTitle')}</h1>
                <p className="text-sm font-body text-green-600 dark:text-green-300">{t('appSubtitle')}</p>
              </div>
            </div>

            {/* Navigation, AI Assistant and Login */}
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
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
                          ? 'bg-[var(--color-dark-purple)] text-white hover:bg-[var(--color-dark-purple)]' 
                          : 'text-[var(--color-dark-purple)] dark:text-[var(--color-pastel-purple)] hover:bg-[var(--color-pastel-purple)] dark:hover:bg-[var(--color-dark-purple)]'
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

              {/* Separator */}
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-purple-300/50 to-transparent dark:via-purple-600/30"></div>

              {/* AI Assistant Button */}
              <HeaderAIButton 
                onClick={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
                isActive={isAIAssistantOpen}
              />

              {/* Separator */}
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-purple-300/50 to-transparent dark:via-purple-600/30"></div>

              {/* Login/Profile Button */}
              {!isLoggedIn ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLoginOpen(true)}
                  className={`login-button-mini flex items-center font-body ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'} 
                    border-[var(--color-dark-purple)] text-[var(--color-dark-purple)] 
                    hover:bg-[var(--color-pastel-purple)] dark:border-[var(--color-pastel-purple)] 
                    dark:text-[var(--color-pastel-purple)] dark:hover:bg-[var(--color-dark-purple)]
                    text-xs px-2 py-1`}
                  aria-label={t('login')}
                >
                  <LogIn className="w-3 h-3" />
                  <span className="font-body text-xs">{t('login')}</span>
                </Button>
              ) : (
                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} text-[var(--color-dark-purple)] dark:text-[var(--color-pastel-purple)]`}>
                    <User className="w-4 h-4 user-profile-icon" />
                    <span className="font-body text-sm">
                      {userProfile?.name || t('user')}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="login-button-mini border-[var(--color-vibrant-orange)] text-[var(--color-vibrant-orange)] hover:bg-[var(--color-light-orange)] px-1.5 py-1"
                    aria-label={t('logout')}
                  >
                    <LogOut className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
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
        onAudioToggle={() => {
          // Toggle audio functionality
          const newAudioState = !adaptationSettings.autoPlayAudio;
          setAdaptationSettings(prev => ({
            ...prev,
            autoPlayAudio: newAudioState
          }));
          toast.success(
            language === 'ar' 
              ? newAudioState ? 'تم تفعيل الصوت' : 'تم إيقاف الصوت'
              : newAudioState ? 'Audio enabled' : 'Audio disabled'
          );
        }}
        isAudioEnabled={adaptationSettings.autoPlayAudio}
        isDarkMode={isDarkMode}
        onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Floating AI Assistant */}
      <FloatingAIAssistant 
        isOpen={isAIAssistantOpen}
        onToggle={() => setIsAIAssistantOpen(false)}
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

      {/* Login Form */}
      <LoginForm
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={(profile) => {
          setIsLoggedIn(true);
          setUserProfile(profile);
          setDisabilityType(profile.disabilityType || 'none');
        }}
      />

      {/* Footer */}
      <footer className="bg-purple-50/95 dark:bg-gray-900 border-t border-purple-200/50 dark:border-gray-700 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="font-heading font-bold text-purple-600 dark:text-purple-100 mb-2">
              {t('footerTitle')}
            </p>
            <p className="text-sm font-body text-gray-600 dark:text-gray-400">
              {t('footerDesc')}
            </p>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <Toaster 
        position={isRTL ? 'top-left' : 'top-right'}
        expand={false}
        richColors
        closeButton
      />
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