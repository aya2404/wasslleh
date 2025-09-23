// تكوين APIs قابل للتخصيص - نسخة محدثة وآمنة

// دالة مساعدة للحصول على متغيرات البيئة بأمان
const getEnvVar = (key: string, fallback: string = ''): string => {
  try {
    // في بيئة Vite، استخدم import.meta.env
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env[key] || fallback;
    }
    
    // في بيئة Node.js، استخدم process.env
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || fallback;
    }

    // كـ fallback، تحقق من window.__ENV__
    if (typeof window !== 'undefined' && (window as any).__ENV__) {
      return (window as any).__ENV__[key] || fallback;
    }
    
    return fallback;
  } catch (error) {
    console.warn(`خطأ في قراءة متغير البيئة ${key}:`, error);
    return fallback;
  }
};
export interface APIConfig {
  // خرائط Google للتنقل والمسارات الآمنة
  googleMaps: {
    apiKey: string;
    mapId: string;
    libraries: string[];
    region: string;
    language: string;
  };
  
  // LinkedIn API للفرص الوظيفية
  linkedin: {
    clientId: string;
    clientSecret: string;
    scope: string[];
    redirectUri: string;
  };
  
  // Azure TTS للنطق باللهجة الأردنية
  azure: {
    ttsKey: string;
    ttsRegion: string;
    translatorKey: string;
    translatorRegion: string;
  };
  
  // Google Translate API للترجمة
  googleTranslate: {
    apiKey: string;
    supportedLanguages: string[];
  };
  
  // OCR API لتحليل النصوص من الصور
  ocr: {
    apiKey: string;
    apiUrl: string;
    supportedFormats: string[];
  };
  
  // Gemini AI للشات بوت
  gemini: {
    apiKey: string;
    model: string;
    maxTokens: number;
  };
  
  // Amazon Product API للمتجر
  amazon: {
    accessKey: string;
    secretKey: string;
    associateTag: string;
    region: string;
  };
  
  // Supabase للمصادقة وقاعدة البيانات
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey: string;
  };
  
  // الإعدادات العامة
  general: {
    region: 'jordan' | 'saudi' | 'uae' | 'egypt';
    primaryLanguage: 'ar' | 'en';
    fallbackLanguage: 'ar' | 'en';
    environment: 'development' | 'production';
    version: string;
    baseUrl: string;
  };
}

// الإعدادات الافتراضية
export const defaultAPIConfig: APIConfig = {
  googleMaps: {
    apiKey: getEnvVar('VITE_GOOGLE_MAPS_API_KEY'),
    mapId: getEnvVar('VITE_GOOGLE_MAPS_ID'),
    libraries: ['places', 'geometry', 'drawing', 'visualization'],
    region: 'JO', // الأردن
    language: 'ar'
  },
  
  linkedin: {
    clientId: getEnvVar('VITE_LINKEDIN_CLIENT_ID'),
    clientSecret: getEnvVar('VITE_LINKEDIN_CLIENT_SECRET'),
    scope: ['r_liteprofile', 'r_emailaddress', 'w_member_social'],
    redirectUri: `${getEnvVar('VITE_APP_BASE_URL', 'http://localhost:5173')}/auth/linkedin/callback`
  },
  
  azure: {
    ttsKey: getEnvVar('VITE_AZURE_TTS_API_KEY'),
    ttsRegion: getEnvVar('VITE_AZURE_TTS_REGION', 'eastus'),
    translatorKey: getEnvVar('VITE_AZURE_TRANSLATOR_KEY'),
    translatorRegion: getEnvVar('VITE_AZURE_TRANSLATOR_REGION', 'eastus')
  },
  
  googleTranslate: {
    apiKey: getEnvVar('VITE_GOOGLE_TRANSLATE_API_KEY'),
    supportedLanguages: ['ar', 'en', 'fr', 'es']
  },
  
  ocr: {
    apiKey: getEnvVar('VITE_OCR_API_KEY'),
    apiUrl: getEnvVar('VITE_OCR_API_URL', 'https://api.ocr.space/parse/image'),
    supportedFormats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'bmp']
  },
  
  gemini: {
    apiKey: getEnvVar('VITE_GEMINI_API_KEY'),
    model: 'gemini-1.5-flash',
    maxTokens: 2048
  },
  
  amazon: {
    accessKey: getEnvVar('VITE_AMAZON_ACCESS_KEY'),
    secretKey: getEnvVar('VITE_AMAZON_SECRET_KEY'),
    associateTag: getEnvVar('VITE_AMAZON_ASSOCIATE_TAG'),
    region: 'us-east-1'
  },
  
  supabase: {
    url: getEnvVar('VITE_SUPABASE_URL'),
    anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY'),
    serviceRoleKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY')
  },
  
  general: {
    region: 'jordan',
    primaryLanguage: 'ar',
    fallbackLanguage: 'en',
    environment: getEnvVar('VITE_APP_ENV', 'development') as 'development' | 'production',
    version: getEnvVar('VITE_APP_VERSION', '1.0.0'),
    baseUrl: getEnvVar('VITE_APP_BASE_URL', 'http://localhost:5173')
  }
};

// إعدادات خاصة بالدولة/المنطقة
export const regionConfigs = {
  jordan: {
    country: 'الأردن',
    currency: 'JOD',
    timezone: 'Asia/Amman',
    coordinates: { lat: 31.9522, lng: 35.9104 }, // عمان
    language: 'ar-JO',
    places: [
      'مستشفى الجامعة الأردنية',
      'مول العبدلي',
      'الجامعة الأردنية',
      'مطار الملكة علياء الدولي',
      'دائرة الأشغال العامة'
    ]
  },
  saudi: {
    country: 'السعودية',
    currency: 'SAR',
    timezone: 'Asia/Riyadh',
    coordinates: { lat: 24.7136, lng: 46.6753 }, // الرياض
    language: 'ar-SA',
    places: [
      'مستشفى الملك فيصل التخصصي',
      'مول الرياض جاليري',
      'جامعة الملك سعود',
      'مطار الملك خالد الدولي'
    ]
  },
  uae: {
    country: 'الإمارات',
    currency: 'AED',
    timezone: 'Asia/Dubai',
    coordinates: { lat: 25.2048, lng: 55.2708 }, // دبي
    language: 'ar-AE',
    places: [
      'مستشفى دبي',
      'مول الإمارات',
      'الجامعة الأمريكية في دبي',
      'مطار دبي الدولي'
    ]
  },
  egypt: {
    country: 'مصر',
    currency: 'EGP',
    timezone: 'Africa/Cairo',
    coordinates: { lat: 30.0444, lng: 31.2357 }, // القاهرة
    language: 'ar-EG',
    places: [
      'مستشفى القصر العيني',
      'سيتي ستارز',
      'جامعة القاهرة',
      'مطار القاهرة الدولي'
    ]
  }
};

// أصوات TTS خاصة بكل منطقة
export const voiceConfigs = {
  jordan: {
    male: {
      name: 'ar-JO-TaimNeural',
      gender: 'Male',
      locale: 'ar-JO'
    },
    female: {
      name: 'ar-JO-SanaNeural',
      gender: 'Female', 
      locale: 'ar-JO'
    }
  },
  saudi: {
    male: {
      name: 'ar-SA-HamedNeural',
      gender: 'Male',
      locale: 'ar-SA'
    },
    female: {
      name: 'ar-SA-ZariyahNeural',
      gender: 'Female',
      locale: 'ar-SA'
    }
  },
  uae: {
    male: {
      name: 'ar-AE-HamadNeural',
      gender: 'Male',
      locale: 'ar-AE'
    },
    female: {
      name: 'ar-AE-FatimaNeural',
      gender: 'Female',
      locale: 'ar-AE'
    }
  },
  egypt: {
    male: {
      name: 'ar-EG-ShakirNeural',
      gender: 'Male',
      locale: 'ar-EG'
    },
    female: {
      name: 'ar-EG-SalmaNeural',
      gender: 'Female',
      locale: 'ar-EG'
    }
  }
};

// حفظ وتحميل الإعدادات من localStorage
export class APIConfigManager {
  private static STORAGE_KEY = 'waslah_api_config';

  static saveConfig(config: Partial<APIConfig>): boolean {
    try {
      // التحقق من توفر localStorage
      if (typeof Storage === 'undefined') {
        console.warn('localStorage is not available');
        return false;
      }

      const currentConfig = this.loadConfig();
      const updatedConfig = { ...currentConfig, ...config };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedConfig));
      return true;
    } catch (error) {
      console.error('Error saving API config:', error);
      return false;
    }
  }

  static loadConfig(): APIConfig {
    try {
      // التحقق من توفر localStorage
      if (typeof Storage === 'undefined') {
        return defaultAPIConfig;
      }

      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // دمج الإعدادات المحفوظة مع الافتراضية لضمان وجود جميع الخصائص
        return {
          googleMaps: { ...defaultAPIConfig.googleMaps, ...parsed.googleMaps },
          azure: { ...defaultAPIConfig.azure, ...parsed.azure },
          general: { ...defaultAPIConfig.general, ...parsed.general }
        };
      }
    } catch (error) {
      console.error('Error loading API config:', error);
    }
    return defaultAPIConfig;
  }

  static resetConfig(): boolean {
    try {
      if (typeof Storage === 'undefined') {
        return false;
      }
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error resetting API config:', error);
      return false;
    }
  }

  static hasValidGoogleMapsKey(): boolean {
    try {
      const config = this.loadConfig();
      return config.googleMaps.apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY' && 
             config.googleMaps.apiKey.length > 10;
    } catch {
      return false;
    }
  }

  static hasValidAzureKeys(): boolean {
    try {
      const config = this.loadConfig();
      return config.azure.speechKey !== 'YOUR_AZURE_SPEECH_KEY' && 
             config.azure.speechKey.length > 10;
    } catch {
      return false;
    }
  }

  static getRegionConfig() {
    try {
      const config = this.loadConfig();
      return regionConfigs[config.general.region] || regionConfigs.jordan;
    } catch {
      return regionConfigs.jordan;
    }
  }

  static getVoiceConfig() {
    try {
      const config = this.loadConfig();
      return voiceConfigs[config.general.region] || voiceConfigs.jordan;
    } catch {
      return voiceConfigs.jordan;
    }
  }

  static getAzureConfig() {
    try {
      const config = this.loadConfig();
      if (this.hasValidAzureKeys()) {
        return {
          key: config.azure.speechKey,
          region: config.azure.speechRegion,
          translatorKey: config.azure.translatorKey,
          translatorRegion: config.azure.translatorRegion
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  static updateGoogleMapsKey(apiKey: string): boolean {
    try {
      const config = this.loadConfig();
      config.googleMaps.apiKey = apiKey;
      return this.saveConfig(config);
    } catch {
      return false;
    }
  }

  static updateAzureKeys(speechKey: string, speechRegion: string, translatorKey?: string, translatorRegion?: string): boolean {
    try {
      const config = this.loadConfig();
      config.azure.speechKey = speechKey;
      config.azure.speechRegion = speechRegion;
      if (translatorKey) config.azure.translatorKey = translatorKey;
      if (translatorRegion) config.azure.translatorRegion = translatorRegion;
      return this.saveConfig(config);
    } catch {
      return false;
    }
  }

  // دالة للتحقق من توفر البيئة المناسبة
  static isBrowserEnvironment(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // دالة للتحقق من توفر APIs المتصفح
  static checkBrowserAPIs() {
    return {
      localStorage: typeof Storage !== 'undefined',
      geolocation: typeof navigator !== 'undefined' && 'geolocation' in navigator,
      speechSynthesis: typeof window !== 'undefined' && 'speechSynthesis' in window,
      webRTC: typeof navigator !== 'undefined' && 'mediaDevices' in navigator
    };
  }
}

export default APIConfigManager;