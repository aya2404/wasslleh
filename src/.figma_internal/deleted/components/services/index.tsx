// Services Export Index
// تجميع جميع الخدمات في ملف واحد لتسهيل الاستيراد

// Google Maps Service
export { GoogleMapsComponent, MiniMap } from './GoogleMapsService';

// Text-to-Speech Service
export { TTSService, QuickTTS } from './TTSService';

// Translation Service
export { TranslationService, QuickTranslation } from './TranslationService';

// Sign Language Services
export { SignLanguageService, useSignLanguage } from './SignLanguageService';
export { SignLanguageTranslationService } from './SignLanguageTranslationService';

// OCR (Optical Character Recognition) Service
export { OCRService } from './OCRService';

// Location/Geolocation Service
export { LocationService, QuickLocation } from './LocationService';

// Types for better TypeScript support
export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  address?: string;
  timestamp: number;
}

export interface AccessiblePlace {
  id: string;
  name: string;
  type: string;
  accessibility: string;
  coordinates: { lat: number; lng: number };
  features: string[];
}

export interface OCRResult {
  text: string;
  confidence: number;
  blocks: OCRBlock[];
  processingTime: number;
}

export interface OCRBlock {
  text: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface Voice {
  name: string;
  lang: string;
  gender: 'male' | 'female';
  localName: string;
}

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  rtl: boolean;
}

export interface SignLanguageGesture {
  id: string;
  arabicText: string;
  englishText: string;
  complexity: 'basic' | 'intermediate' | 'advanced';
  duration: number;
  bodyParts: string[];
}

export interface SignLanguageTranslation {
  originalText: string;
  gestures: SignLanguageGesture[];
  accuracy: number;
  language: 'arabic-sign' | 'asl' | 'international';
  timestamp: string;
}

// Utility functions for services
export const serviceUtils = {
  // TTS utilities
  speak: (text: string, lang: string = 'ar', rate: number = 0.8) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      speechSynthesis.speak(utterance);
    }
  },

  // Location utilities
  formatCoordinates: (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  },

  getDistanceBetweenPoints: (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  },

  // OCR utilities
  getConfidenceLevel: (confidence: number) => {
    if (confidence >= 90) return { level: 'ممتاز', color: 'text-green-600' };
    if (confidence >= 70) return { level: 'جيد', color: 'text-yellow-600' };
    return { level: 'منخفض', color: 'text-red-600' };
  },

  // Translation utilities
  detectLanguage: (text: string): string => {
    // Simple language detection based on script
    const arabicRegex = /[\u0600-\u06FF]/;
    const englishRegex = /[a-zA-Z]/;
    
    if (arabicRegex.test(text)) return 'ar';
    if (englishRegex.test(text)) return 'en';
    return 'unknown';
  },

  // Accessibility utilities
  getAccessibilityScore: (features: string[]) => {
    const scores: Record<string, number> = {
      'مصاعد': 20,
      'منحدرات': 15,
      'مواقف مخصصة': 10,
      'ممرات واسعة': 15,
      'مترجم إشارة': 25,
      'أجهزة قراءة صوتية': 20,
      'حمامات متاحة': 10,
      'إضاءة جيدة': 5,
      'مقاعد مريحة': 5
    };

    const totalScore = features.reduce((sum, feature) => {
      return sum + (scores[feature] || 0);
    }, 0);

    if (totalScore >= 80) return 'ممتاز';
    if (totalScore >= 60) return 'جيد جداً';
    if (totalScore >= 40) return 'جيد';
    return 'محدود';
  }
};

// Constants for API keys and configurations
export const SERVICE_CONFIG = {
  GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY',
  GOOGLE_TRANSLATE_API_KEY: 'YOUR_GOOGLE_TRANSLATE_API_KEY',
  DEFAULT_LANGUAGE: 'ar',
  DEFAULT_LOCATION: { lat: 24.7136, lng: 46.6753 }, // Riyadh
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  OCR_TIMEOUT: 30000, // 30 seconds
  LOCATION_TIMEOUT: 10000, // 10 seconds
  TTS_RATE_RANGE: { min: 0.5, max: 2.0 },
  TTS_PITCH_RANGE: { min: 0.5, max: 2.0 }
};

// Error messages in Arabic
export const ERROR_MESSAGES = {
  CAMERA_ACCESS_DENIED: 'لا يمكن الوصول إلى الكاميرا. تأكد من منح الإذن للتطبيق.',
  LOCATION_ACCESS_DENIED: 'تم رفض الإذن للوصول إلى الموقع. يرجى منح الإذن في إعدادات المتصفح.',
  MICROPHONE_ACCESS_DENIED: 'لا يمكن الوصول إلى المايكروفون. تأكد من منح الإذن للتطبيق.',
  UNSUPPORTED_BROWSER: 'المتصفح لا يدعم هذه الميزة.',
  NETWORK_ERROR: 'خطأ في الشبكة. تأكد من اتصالك بالإنترنت.',
  FILE_TOO_LARGE: 'حجم الملف كبير جداً. الحد الأقصى 5MB.',
  INVALID_FILE_TYPE: 'نوع الملف غير مدعوم. يرجى اختيار صورة صالحة.',
  TRANSLATION_FAILED: 'فشلت الترجمة. يرجى المحاولة مرة أخرى.',
  OCR_FAILED: 'فشل في استخراج النص من الصورة.',
  TTS_FAILED: 'فشل في تشغيل القراءة الصوتية.',
  LOCATION_TIMEOUT: 'انتهت مهلة طلب الموقع. يرجى المحاولة مرة أخرى.',
  MAPS_LOAD_FAILED: 'فشل في تحميل الخريطة.'
};