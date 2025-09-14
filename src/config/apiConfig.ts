// تكوين APIs قابل للتخصيص

// دالة مساعدة للحصول على متغيرات البيئة بأمان
const getEnvVar = (key: string, fallback: string): string => {
  try {
    // محاولة الحصول على متغير البيئة إذا كان متاحاً
    if (typeof window !== 'undefined' && (window as any).__ENV__) {
      return (window as any).__ENV__[key] || fallback;
    }
    return fallback;
  } catch {
    return fallback;
  }
};
export interface APIConfig {
  googleMaps: {
    apiKey: string;
    libraries: string[];
    region: string;
    language: string;
  };
  azure: {
    speechKey: string;
    speechRegion: string;
    translatorKey: string;
    translatorRegion: string;
  };
  general: {
    region: 'jordan' | 'saudi' | 'uae' | 'egypt';
    primaryLanguage: 'ar' | 'en';
    fallbackLanguage: 'ar' | 'en';
  };
}

// الإعدادات الافتراضية
export const defaultAPIConfig: APIConfig = {
  googleMaps: {
    apiKey: getEnvVar('GOOGLE_MAPS_API_KEY', 'YOUR_GOOGLE_MAPS_API_KEY'),
    libraries: ['places', 'geometry', 'drawing'],
    region: 'JO', // الأردن
    language: 'ar'
  },
  azure: {
    speechKey: getEnvVar('AZURE_SPEECH_KEY', 'YOUR_AZURE_SPEECH_KEY'),
    speechRegion: getEnvVar('AZURE_SPEECH_REGION', 'westus2'),
    translatorKey: getEnvVar('AZURE_TRANSLATOR_KEY', 'YOUR_AZURE_TRANSLATOR_KEY'),
    translatorRegion: getEnvVar('AZURE_TRANSLATOR_REGION', 'westus2')
  },
  general: {
    region: 'jordan',
    primaryLanguage: 'ar',
    fallbackLanguage: 'en'
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