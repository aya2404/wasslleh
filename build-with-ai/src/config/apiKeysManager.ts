/**
 * 🔐 مدير مفاتيح APIs الآمن
 * يوفر طرق آمنة لإدارة وتخزين مفاتيح APIs
 */

import { defaultAPIConfig, APIConfig } from './apiConfig';

// أنواع الاستجابة للتحقق من صحة المفاتيح
export interface ApiKeyValidation {
  isValid: boolean;
  error?: string;
  lastChecked?: Date;
  rateLimitRemaining?: number;
}

// إعدادات التشفير البسيط (للتطوير فقط)
class SimpleEncryption {
  private static key = 'waslah_2024_secure_key';
  
  static encrypt(text: string): string {
    try {
      // تشفير بسيط للتطوير - في الإنتاج استخدم مكتبة تشفير حقيقية
      return btoa(encodeURIComponent(text));
    } catch (error) {
      console.error('خطأ في التشفير:', error);
      return text;
    }
  }
  
  static decrypt(encryptedText: string): string {
    try {
      return decodeURIComponent(atob(encryptedText));
    } catch (error) {
      console.error('خطأ في فك التشفير:', error);
      return encryptedText;
    }
  }
}

/**
 * 🔒 مدير مفاتيح APIs الآمن
 */
export class SecureAPIKeysManager {
  private static readonly STORAGE_KEY = 'waslah_secure_api_keys';
  private static readonly VALIDATION_CACHE_KEY = 'waslah_api_validation_cache';
  private static validationCache = new Map<string, ApiKeyValidation>();

  /**
   * حفظ مفتاح API بشكل آمن
   */
  static setApiKey(service: keyof APIConfig, key: string, subKey?: string): boolean {
    try {
      const storedKeys = this.getAllStoredKeys();
      
      if (subKey) {
        if (!storedKeys[service]) {
          storedKeys[service] = {};
        }
        (storedKeys[service] as any)[subKey] = SimpleEncryption.encrypt(key);
      } else {
        storedKeys[service] = SimpleEncryption.encrypt(key);
      }
      
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storedKeys));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('خطأ في حفظ مفتاح API:', error);
      return false;
    }
  }

  /**
   * استرداد مفتاح API
   */
  static getApiKey(service: keyof APIConfig, subKey?: string): string {
    try {
      const storedKeys = this.getAllStoredKeys();
      
      if (subKey && storedKeys[service] && typeof storedKeys[service] === 'object') {
        const encryptedKey = (storedKeys[service] as any)[subKey];
        return encryptedKey ? SimpleEncryption.decrypt(encryptedKey) : '';
      }
      
      if (!subKey && typeof storedKeys[service] === 'string') {
        return SimpleEncryption.decrypt(storedKeys[service] as string);
      }
      
      // إذا لم يتم العثور على المفتاح في التخزين، اطلبه من متغيرات البيئة
      return this.getEnvApiKey(service, subKey);
      
    } catch (error) {
      console.error('خطأ في استرداد مفتاح API:', error);
      return this.getEnvApiKey(service, subKey);
    }
  }

  /**
   * الحصول على مفتاح من متغيرات البيئة
   */
  private static getEnvApiKey(service: keyof APIConfig, subKey?: string): string {
    try {
      const envMapping: Record<string, string> = {
        'googleMaps.apiKey': 'VITE_GOOGLE_MAPS_API_KEY',
        'googleMaps.mapId': 'VITE_GOOGLE_MAPS_ID',
        'linkedin.clientId': 'VITE_LINKEDIN_CLIENT_ID',
        'linkedin.clientSecret': 'VITE_LINKEDIN_CLIENT_SECRET',
        'azure.ttsKey': 'VITE_AZURE_TTS_API_KEY',
        'azure.ttsRegion': 'VITE_AZURE_TTS_REGION',
        'googleTranslate.apiKey': 'VITE_GOOGLE_TRANSLATE_API_KEY',
        'ocr.apiKey': 'VITE_OCR_API_KEY',
        'gemini.apiKey': 'VITE_GEMINI_API_KEY',
        'amazon.accessKey': 'VITE_AMAZON_ACCESS_KEY',
        'amazon.secretKey': 'VITE_AMAZON_SECRET_KEY',
        'amazon.associateTag': 'VITE_AMAZON_ASSOCIATE_TAG',
        'supabase.url': 'VITE_SUPABASE_URL',
        'supabase.anonKey': 'VITE_SUPABASE_ANON_KEY'
      };

      const envKey = subKey ? `${service}.${subKey}` : service;
      const envVar = envMapping[envKey];
      
      if (envVar) {
        if (typeof import.meta !== 'undefined' && import.meta.env) {
          return import.meta.env[envVar] || '';
        }
        if (typeof process !== 'undefined' && process.env) {
          return process.env[envVar] || '';
        }
      }
      
      return '';
    } catch (error) {
      console.error('خطأ في قراءة متغيرات البيئة:', error);
      return '';
    }
  }

  /**
   * الحصول على جميع المفاتيح المحفوظة
   */
  private static getAllStoredKeys(): Record<string, any> {
    try {
      if (typeof localStorage === 'undefined') {
        return {};
      }
      
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('خطأ في قراءة المفاتيح المحفوظة:', error);
      return {};
    }
  }

  /**
   * حذف مفتاح API
   */
  static removeApiKey(service: keyof APIConfig, subKey?: string): boolean {
    try {
      const storedKeys = this.getAllStoredKeys();
      
      if (subKey && storedKeys[service] && typeof storedKeys[service] === 'object') {
        delete (storedKeys[service] as any)[subKey];
      } else if (!subKey) {
        delete storedKeys[service];
      }
      
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storedKeys));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('خطأ في حذف مفتاح API:', error);
      return false;
    }
  }

  /**
   * مسح جميع المفاتيح المحفوظة
   */
  static clearAllKeys(): boolean {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.VALIDATION_CACHE_KEY);
        this.validationCache.clear();
        return true;
      }
      return false;
    } catch (error) {
      console.error('خطأ في مسح المفاتيح:', error);
      return false;
    }
  }

  /**
   * التحقق من صحة مفتاح API
   */
  static async validateApiKey(service: keyof APIConfig, subKey?: string): Promise<ApiKeyValidation> {
    const cacheKey = subKey ? `${service}.${subKey}` : service;
    
    // التحقق من الكاش أولاً
    const cached = this.validationCache.get(cacheKey);
    if (cached && cached.lastChecked && 
        (Date.now() - cached.lastChecked.getTime()) < 300000) { // 5 دقائق
      return cached;
    }

    const apiKey = this.getApiKey(service, subKey);
    
    if (!apiKey || apiKey.includes('YOUR_') || apiKey.includes('_HERE')) {
      const result: ApiKeyValidation = {
        isValid: false,
        error: 'مفتاح API غير محدد أو يحتوي على قيمة افتراضية',
        lastChecked: new Date()
      };
      this.validationCache.set(cacheKey, result);
      return result;
    }

    try {
      let isValid = false;
      let error = '';

      switch (service) {
        case 'googleMaps':
          isValid = await this.validateGoogleMapsKey(apiKey);
          break;
        case 'azure':
          isValid = await this.validateAzureKey(apiKey, subKey);
          break;
        case 'googleTranslate':
          isValid = await this.validateGoogleTranslateKey(apiKey);
          break;
        case 'gemini':
          isValid = await this.validateGeminiKey(apiKey);
          break;
        default:
          isValid = apiKey.length >= 10; // تحقق أساسي من طول المفتاح
      }

      const result: ApiKeyValidation = {
        isValid,
        error: isValid ? undefined : 'فشل في التحقق من صحة المفتاح',
        lastChecked: new Date()
      };

      this.validationCache.set(cacheKey, result);
      return result;

    } catch (error) {
      const result: ApiKeyValidation = {
        isValid: false,
        error: `خطأ في التحقق: ${error}`,
        lastChecked: new Date()
      };
      this.validationCache.set(cacheKey, result);
      return result;
    }
  }

  /**
   * التحقق من صحة مفتاح Google Maps
   */
  private static async validateGoogleMapsKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=Amman,Jordan&key=${apiKey}`
      );
      const data = await response.json();
      return data.status === 'OK' || data.status === 'ZERO_RESULTS';
    } catch {
      return false;
    }
  }

  /**
   * التحقق من صحة مفتاح Azure
   */
  private static async validateAzureKey(apiKey: string, subKey?: string): Promise<boolean> {
    // للتطوير، نتحقق فقط من وجود المفتاح وطوله
    return apiKey.length >= 32;
  }

  /**
   * التحقق من صحة مفتاح Google Translate
   */
  private static async validateGoogleTranslateKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=hello&target=ar`
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * التحقق من صحة مفتاح Gemini
   */
  private static async validateGeminiKey(apiKey: string): Promise<boolean> {
    // للتطوير، نتحقق فقط من تنسيق المفتاح
    return apiKey.startsWith('AIza') && apiKey.length >= 39;
  }

  /**
   * الحصول على إحصائيات المفاتيح
   */
  static getApiKeysStatus(): Record<string, { configured: boolean; valid?: boolean }> {
    const status: Record<string, { configured: boolean; valid?: boolean }> = {};

    const services = [
      { key: 'googleMaps', subKeys: ['apiKey', 'mapId'] },
      { key: 'linkedin', subKeys: ['clientId', 'clientSecret'] },
      { key: 'azure', subKeys: ['ttsKey'] },
      { key: 'googleTranslate', subKeys: ['apiKey'] },
      { key: 'ocr', subKeys: ['apiKey'] },
      { key: 'gemini', subKeys: ['apiKey'] },
      { key: 'amazon', subKeys: ['accessKey', 'secretKey', 'associateTag'] },
      { key: 'supabase', subKeys: ['url', 'anonKey'] }
    ];

    services.forEach(service => {
      service.subKeys.forEach(subKey => {
        const fullKey = `${service.key}.${subKey}`;
        const apiKey = this.getApiKey(service.key as keyof APIConfig, subKey);
        const cached = this.validationCache.get(fullKey);
        
        status[fullKey] = {
          configured: !!(apiKey && !apiKey.includes('YOUR_') && !apiKey.includes('_HERE')),
          valid: cached?.isValid
        };
      });
    });

    return status;
  }

  /**
   * تصدير المفاتيح (للنسخ الاحتياطي)
   */
  static exportKeys(): string {
    try {
      const keys = this.getAllStoredKeys();
      return JSON.stringify(keys, null, 2);
    } catch (error) {
      console.error('خطأ في تصدير المفاتيح:', error);
      return '{}';
    }
  }

  /**
   * استيراد المفاتيح (من النسخ الاحتياطي)
   */
  static importKeys(keysJson: string): boolean {
    try {
      const keys = JSON.parse(keysJson);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(keys));
        return true;
      }
      return false;
    } catch (error) {
      console.error('خطأ في استيراد المفاتيح:', error);
      return false;
    }
  }
}

export default SecureAPIKeysManager;