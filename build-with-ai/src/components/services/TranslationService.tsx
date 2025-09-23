import React, { createContext, useContext, useState, useEffect } from 'react';

// تعريف الترجمات
const translations = {
  ar: {
    // Navigation
    home: 'الرئيسية',
    opportunities: 'الفرص',
    safePaths: 'المسارات الآمنة',
    community: 'المجتمع',
    
    // Main App
    appTitle: 'وصلة',
    appSubtitle: 'جسرٌ نحوَ مجتمع شامل',
    skipToContent: 'انتقل إلى المحتوى الرئيسي',
    mainNavigation: 'التنقل الرئيسي',
    mainContent: 'المحتوى الرئيسي',
    quickAccess: 'أزرار الوصول السريع',
    
    // Settings
    settings: 'الإعدادات',
    accessibilitySettings: 'إعدادات الوصولية',
    closeSettings: 'إغلاق الإعدادات',
    saveSettings: 'حفظ الإعدادات',
    resetSettings: 'إعادة تعيين',
    
    // Language Settings
    language: 'اللغة',
    selectLanguage: 'اختر اللغة',
    arabic: 'العربية',
    english: 'English',
    
    // Disability Types
    disabilityType: 'نوع الإعاقة',
    selectDisabilityType: 'اختر نوع الإعاقة',
    noDisability: 'لا يوجد',
    visualImpairment: 'إعاقة بصرية',
    hearingImpairment: 'إعاقة سمعية',
    motorImpairment: 'إعاقة حركية',
    cognitiveImpairment: 'إعاقة إدراكية',
    
    // Visual Settings
    visualSettings: 'الإعدادات البصرية',
    darkMode: 'الوضع الداكن',
    darkModeDesc: 'يقلل من إجهاد العين في الإضاءة المنخفضة',
    simpleMode: 'الوضع البسيط',
    simpleModeDesc: 'يزيل العناصر المعقدة لتجربة أبسط',
    fontSize: 'حجم الخط',
    decreaseFont: 'تصغير الخط',
    increaseFont: 'تكبير الخط',
    
    // Audio Settings
    audioSettings: 'الإعدادات الصوتية',
    testTTS: 'مرحباً بك في وصلة، المنصة الشاملة لذوي الاحتياجات الخاصة',
    ttsDescription: 'انقر لسماع نموذج من القراءة الصوتية المحسنة',
    
    // TTS Settings
    voiceSettings: 'إعدادات الصوت',
    voiceType: 'نوع الصوت',
    maleVoice: 'صوت ذكر',
    femaleVoice: 'صوت أنثى',
    voiceSpeed: 'سرعة الصوت',
    voiceVolume: 'مستوى الصوت',
    jordanianAccent: 'اللهجة الأردنية',
    classicArabic: 'العربية الفصحى',
    
    // Common Actions
    play: 'تشغيل',
    stop: 'إيقاف',
    pause: 'توقف',
    resume: 'استكمال',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    
    // Home Page
    welcomeTitle: 'مرحباً بك في وصلة',
    welcomeSubtitle: 'منصتك الشاملة لذوي الاحتياجات الخاصة',
    watchVideo: 'شاهد الفيديو',
    nearbyServices: 'الخدمات القريبة',
    findNearbyServices: 'اعثر على الخدمات المتاحة في منطقتك',
    
    // Quick Access Cards
    quickAccess: 'الوصول السريع',
    jobOpportunities: 'الفرص الوظيفية',
    jobOpportunitiesDesc: 'اكتشف الوظائف المناسبة لك',
    safeRoutes: 'المسارات الآمنة',
    safeRoutesDesc: 'خطط لرحلاتك بأمان',
    communitySupport: 'الدعم المجتمعي',
    communitySupportDesc: 'تواصل مع مجتمع داعم',
    
    // Footer
    footerTitle: 'وصلة - منصة شاملة لذوي الاحتياجات الخاصة',
    footerDesc: 'نحو مجتمع يدعم ذوي الاحتياجات الخاصة في الفرص والتنقل والمجتمع',
    
    // Contribute & Shop Section
    contributeShop: 'المتجر',
    contributeShopDesc: 'متجر أدوات مساعدة ومنصة للمساهمة',
    shop: 'المتجر',
    contribute: 'ساهم',
    advertise: 'اعلن معنا',
    assistiveTools: 'أدوات مساعدة',
    wheelchairs: 'كراسي متحركة',
    hearingAids: 'سماعات طبية',
    visualAids: 'أدوات بصرية',
    mobilityAids: 'أدوات حركية',
    communicationDevices: 'أجهزة تواصل',
    homeAccessibility: 'إمكانيات منزلية',
    viewProduct: 'عرض المنتج',
    addToCart: 'أضف للسلة',
    cart: 'السلة',
    checkout: 'الدفع',
    donation: 'تبرع',
    volunteer: 'تطوع',
    sponsorship: 'رعاية',
    adSubmission: 'تقديم إعلان',
    businessPartnership: 'شراكة تجارية',
    
    // Floating Buttons
    openAccessibilitySettings: 'فتح إعدادات الوصولية',
    openTextAnalysis: 'فتح تحليل النصوص بالكاميرا',
    openSettings: 'فتح الإعدادات',
    openCamera: 'فتح الكاميرا',
    lightMode: 'الوضع النهاري',
    showControls: 'إظهار التحكم',
    hideControls: 'إخفاء التحكم',
    
    // Location Services
    getCurrentLocation: 'الحصول على الموقع الحالي',
    gettingLocation: 'جاري التحديد...',
    tracking: 'يتابع',
    startTracking: 'تتبع',
    stopTracking: 'إيقاف التتبع',
    locationAccuracy: 'دقة الموقع',
    highAccuracy: 'دقة عالية',
    mediumAccuracy: 'دقة متوسطة',
    lowAccuracy: 'دقة منخفضة',
    
    // API Settings
    apiSettings: 'إعدادات APIs',
    googleMapsKey: 'مفتاح Google Maps',
    azureKey: 'مفتاح Azure',
    saveApiKeys: 'حفظ المفاتيح',
    apiKeysDesc: 'أدخل مفاتيح APIs للحصول على الوظائف الكاملة',
    
    // Camera and OCR
    cameraTextAnalysis: 'تحليل النصوص بالكاميرا',
    extractedText: 'النص المُستخرج',
    textSummary: 'الملخص',
    captureOrUpload: 'التقط صورة أو ارفع ملف لبدء استخراج النص',
    extractTextFirst: 'استخرج النص أولاً',
    accuracy: 'دقة',
    
    // Translation
    translationService: 'خدمة الترجمة',
    originalText: 'النص الأصلي',
    translatedText: 'النص المترجم',
    translateButton: 'ترجم',
    translating: 'جاري الترجمة...',
    fromLanguage: 'من',
    toLanguage: 'إلى',
    swapLanguages: 'تبديل اللغات',
    copyText: 'نسخ النص',
    
    // Tabs
    textTab: 'نص',
    audioTab: 'صوتي',
    translateTab: 'ترجمة',
    
    // Authentication
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    register: 'تسجيل جديد',
    user: 'المستخدم',
    welcomeToWasla: 'أهلًا بكُم في وصّلة- جسرٌ نحوَ مجتمع شامل',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    fullName: 'الاسم الكامل',
    confirmPassword: 'تأكيد كلمة المرور',
    createAccount: 'إنشاء حساب',
    enterEmail: 'أدخل البريد الإلكتروني',
    enterPassword: 'أدخل كلمة المرور',
    enterFullName: 'أدخل الاسم الكامل',
    accessibilityAdaptation: 'التكييف حسب الإعاقة',
    close: 'إغلاق',
    
    // New Welcome Messages
    welcomeHeroTitle: 'أهلًا بكُم في وصّلة- جسرٌ نحوَ مجتمع شامل',
    welcomeHeroSubtitle: 'جسرٌ نحوَ مجتمع شامل',
    communityBridge: 'معاً نبني جسراً نحو مجتمع شامل',
    everyoneMatters: 'حيث كل فرد له مكانه وقيمته في المجتمع',
    
    // Audio Controls
    enableAudio: 'تفعيل الصوت',
    disableAudio: 'إيقاف الصوت',
    audioEnabled: 'تم تفعيل الصوت',
    audioDisabled: 'تم إيقاف الصوت',
    
    // Floating Controls
    showControls: 'إظهار عناصر التحكم',
    hideControls: 'إخفاء عناصر التحكم',
    lightMode: 'الوضع النهاري',
    darkMode: 'الوضع الليلي'
  },
  
  en: {
    // Navigation
    home: 'Home',
    opportunities: 'Opportunities',
    safePaths: 'Safe Paths',
    community: 'Community',
    
    // Main App
    appTitle: 'Waslah',
    appSubtitle: 'A Bridge Towards an Inclusive Community',
    skipToContent: 'Skip to main content',
    mainNavigation: 'Main navigation',
    mainContent: 'Main content',
    quickAccess: 'Quick access buttons',
    
    // Settings
    settings: 'Settings',
    accessibilitySettings: 'Accessibility Settings',
    closeSettings: 'Close Settings',
    saveSettings: 'Save Settings',
    resetSettings: 'Reset',
    
    // Language Settings
    language: 'Language',
    selectLanguage: 'Select Language',
    arabic: 'العربية',
    english: 'English',
    
    // Disability Types
    disabilityType: 'Disability Type',
    selectDisabilityType: 'Select Disability Type',
    noDisability: 'None',
    visualImpairment: 'Visual Impairment',
    hearingImpairment: 'Hearing Impairment',
    motorImpairment: 'Motor Impairment',
    cognitiveImpairment: 'Cognitive Impairment',
    
    // Visual Settings
    visualSettings: 'Visual Settings',
    darkMode: 'Dark Mode',
    darkModeDesc: 'Reduces eye strain in low light conditions',
    simpleMode: 'Simple Mode',
    simpleModeDesc: 'Removes complex elements for a simpler experience',
    fontSize: 'Font Size',
    decreaseFont: 'Decrease Font',
    increaseFont: 'Increase Font',
    
    // Audio Settings
    audioSettings: 'Audio Settings',
    testTTS: 'Welcome to Waslah, a comprehensive platform for people with special needs',
    ttsDescription: 'Click to hear a sample of enhanced text-to-speech',
    
    // TTS Settings
    voiceSettings: 'Voice Settings',
    voiceType: 'Voice Type',
    maleVoice: 'Male Voice',
    femaleVoice: 'Female Voice',
    voiceSpeed: 'Voice Speed',
    voiceVolume: 'Voice Volume',
    jordanianAccent: 'Jordanian Accent',
    classicArabic: 'Classical Arabic',
    
    // Common Actions
    play: 'Play',
    stop: 'Stop',
    pause: 'Pause',
    resume: 'Resume',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Home Page
    welcomeTitle: 'Welcome to Waslah',
    welcomeSubtitle: 'Your comprehensive platform for people with special needs',
    watchVideo: 'Watch Video',
    nearbyServices: 'Nearby Services',
    findNearbyServices: 'Find available services in your area',
    
    // Quick Access Cards
    quickAccess: 'Quick Access',
    jobOpportunities: 'Job Opportunities',
    jobOpportunitiesDesc: 'Discover jobs that suit you',
    safeRoutes: 'Safe Routes',
    safeRoutesDesc: 'Plan your trips safely',
    communitySupport: 'Community Support',
    communitySupportDesc: 'Connect with a supportive community',
    
    // Footer
    footerTitle: 'Waslah - Comprehensive Platform for Special Needs',
    footerDesc: 'Towards a community that supports people with special needs in opportunities, mobility, and community',
    
    // Contribute & Shop Section
    contributeShop: 'Shop',
    contributeShopDesc: 'Assistive tools store and contribution platform',
    shop: 'Shop',
    contribute: 'Contribute',
    advertise: 'Advertise with us',
    assistiveTools: 'Assistive Tools',
    wheelchairs: 'Wheelchairs',
    hearingAids: 'Hearing Aids',
    visualAids: 'Visual Aids',
    mobilityAids: 'Mobility Aids',
    communicationDevices: 'Communication Devices',
    homeAccessibility: 'Home Accessibility',
    viewProduct: 'View Product',
    addToCart: 'Add to Cart',
    cart: 'Cart',
    checkout: 'Checkout',
    donation: 'Donate',
    volunteer: 'Volunteer',
    sponsorship: 'Sponsorship',
    adSubmission: 'Submit Ad',
    businessPartnership: 'Business Partnership',
    
    // Floating Buttons
    openAccessibilitySettings: 'Open Accessibility Settings',
    openTextAnalysis: 'Open Camera Text Analysis',
    openSettings: 'Open Settings',
    openCamera: 'Open Camera',
    lightMode: 'Light Mode',
    showControls: 'Show Controls',
    hideControls: 'Hide Controls',
    
    // Location Services
    getCurrentLocation: 'Get Current Location',
    gettingLocation: 'Getting location...',
    tracking: 'Tracking',
    startTracking: 'Track',
    stopTracking: 'Stop Tracking',
    locationAccuracy: 'Location Accuracy',
    highAccuracy: 'High Accuracy',
    mediumAccuracy: 'Medium Accuracy',
    lowAccuracy: 'Low Accuracy',
    
    // API Settings
    apiSettings: 'API Settings',
    googleMapsKey: 'Google Maps Key',
    azureKey: 'Azure Key',
    saveApiKeys: 'Save Keys',
    apiKeysDesc: 'Enter API keys to get full functionality',
    
    // Camera and OCR
    cameraTextAnalysis: 'Camera Text Analysis',
    extractedText: 'Extracted Text',
    textSummary: 'Summary',
    captureOrUpload: 'Capture image or upload file to start text extraction',
    extractTextFirst: 'Extract text first',
    accuracy: 'Accuracy',
    
    // Translation
    translationService: 'Translation Service',
    originalText: 'Original Text',
    translatedText: 'Translated Text',
    translateButton: 'Translate',
    translating: 'Translating...',
    fromLanguage: 'From',
    toLanguage: 'To',
    swapLanguages: 'Swap Languages',
    copyText: 'Copy Text',
    
    // Tabs
    textTab: 'Text',
    audioTab: 'Audio',
    translateTab: 'Translate',
    
    // Authentication
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    user: 'User',
    welcomeToWasla: 'Welcome to Waslah - A Bridge Towards an Inclusive Community',
    email: 'Email',
    password: 'Password',
    fullName: 'Full Name',
    confirmPassword: 'Confirm Password',
    createAccount: 'Create Account',
    enterEmail: 'Enter Email',
    enterPassword: 'Enter Password',
    enterFullName: 'Enter Full Name',
    accessibilityAdaptation: 'Accessibility Adaptation',
    close: 'Close',
    
    // New Welcome Messages
    welcomeHeroTitle: 'Welcome to Waslah - A Bridge Towards an Inclusive Community',
    welcomeHeroSubtitle: 'A Bridge Towards an Inclusive Community',
    communityBridge: 'Together We Build a Bridge to an Inclusive Community',
    everyoneMatters: 'Where every individual has their place and value in society',
    
    // Audio Controls
    enableAudio: 'Enable Audio',
    disableAudio: 'Disable Audio',
    audioEnabled: 'Audio enabled',
    audioDisabled: 'Audio disabled',
    
    // Floating Controls
    showControls: 'Show Controls',
    hideControls: 'Hide Controls',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode'
  }
};

type Language = 'ar' | 'en';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  const isRTL = language === 'ar';

  // تحديث اتجاه الصفحة والـ HTML lang attribute
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language, isRTL]);

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}