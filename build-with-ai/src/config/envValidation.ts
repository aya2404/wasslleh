/**
 * 🔍 تحقق من صحة متغيرات البيئة
 * يتأكد من أن جميع مفاتيح APIs المطلوبة موجودة ومُكونة بشكل صحيح
 */

export interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingKeys: string[];
  validKeys: string[];
}

export interface RequiredEnvVar {
  key: string;
  description: string;
  required: boolean;
  pattern?: RegExp;
  minLength?: number;
  example?: string;
}

/**
 * 📋 قائمة متغيرات البيئة المطلوبة
 */
export const REQUIRED_ENV_VARS: RequiredEnvVar[] = [
  // Google Maps API
  {
    key: 'VITE_GOOGLE_MAPS_API_KEY',
    description: 'مفتاح Google Maps API للخرائط والمسارات',
    required: true,
    pattern: /^AIza[0-9A-Za-z-_]{35}$/,
    minLength: 39,
    example: 'AIzaSyC...'
  },
  {
    key: 'VITE_GOOGLE_MAPS_ID',
    description: 'معرف خريطة Google Maps',
    required: false,
    minLength: 10
  },

  // LinkedIn API
  {
    key: 'VITE_LINKEDIN_CLIENT_ID',
    description: 'معرف عميل LinkedIn للفرص الوظيفية',
    required: true,
    minLength: 10,
    example: '86x1xl...'
  },
  {
    key: 'VITE_LINKEDIN_CLIENT_SECRET',
    description: 'سر عميل LinkedIn',
    required: true,
    minLength: 16
  },

  // Azure Text-to-Speech
  {
    key: 'VITE_AZURE_TTS_API_KEY',
    description: 'مفتاح Azure TTS للنطق باللهجة الأردنية',
    required: true,
    minLength: 32,
    example: 'a1b2c3d4...'
  },
  {
    key: 'VITE_AZURE_TTS_REGION',
    description: 'منطقة خدمة Azure TTS',
    required: true,
    pattern: /^[a-z]+[a-z0-9]*$/,
    example: 'eastus'
  },

  // Google Translate API
  {
    key: 'VITE_GOOGLE_TRANSLATE_API_KEY',
    description: 'مفتاح Google Translate للترجمة',
    required: true,
    pattern: /^AIza[0-9A-Za-z-_]{35}$/,
    minLength: 39,
    example: 'AIzaSyB...'
  },

  // OCR API
  {
    key: 'VITE_OCR_API_KEY',
    description: 'مفتاح OCR لتحليل النصوص من الصور',
    required: true,
    minLength: 8
  },
  {
    key: 'VITE_OCR_API_URL',
    description: 'رابط خدمة OCR',
    required: false,
    pattern: /^https?:\/\/.+/,
    example: 'https://api.ocr.space/parse/image'
  },

  // Gemini AI
  {
    key: 'VITE_GEMINI_API_KEY',
    description: 'مفتاح Gemini AI للشات بوت',
    required: true,
    pattern: /^AIza[0-9A-Za-z-_]{35}$/,
    minLength: 39,
    example: 'AIzaSyG...'
  },

  // Amazon Product API
  {
    key: 'VITE_AMAZON_ACCESS_KEY',
    description: 'مفتاح الوصول لـ Amazon Product API',
    required: false,
    minLength: 16
  },
  {
    key: 'VITE_AMAZON_SECRET_KEY',
    description: 'المفتاح السري لـ Amazon',
    required: false,
    minLength: 32
  },
  {
    key: 'VITE_AMAZON_ASSOCIATE_TAG',
    description: 'تاج الشراكة مع Amazon',
    required: false,
    minLength: 5
  },

  // Supabase
  {
    key: 'VITE_SUPABASE_URL',
    description: 'رابط مشروع Supabase',
    required: true,
    pattern: /^https:\/\/[a-z0-9]+\.supabase\.co$/,
    example: 'https://your-project.supabase.co'
  },
  {
    key: 'VITE_SUPABASE_ANON_KEY',
    description: 'المفتاح العام لـ Supabase',
    required: true,
    minLength: 100
  },
  {
    key: 'SUPABASE_SERVICE_ROLE_KEY',
    description: 'مفتاح دور الخدمة لـ Supabase (للخادم فقط)',
    required: false,
    minLength: 100
  },

  // إعدادات عامة
  {
    key: 'VITE_APP_ENV',
    description: 'بيئة التطبيق',
    required: false,
    pattern: /^(development|production|staging)$/,
    example: 'development'
  },
  {
    key: 'VITE_APP_VERSION',
    description: 'رقم إصدار التطبيق',
    required: false,
    pattern: /^\d+\.\d+\.\d+$/,
    example: '1.0.0'
  },
  {
    key: 'VITE_APP_BASE_URL',
    description: 'الرابط الأساسي للتطبيق',
    required: false,
    pattern: /^https?:\/\/.+/,
    example: 'http://localhost:5173'
  }
];

/**
 * 🔧 فئة التحقق من متغيرات البيئة
 */
export class EnvironmentValidator {
  
  /**
   * قراءة متغير البيئة
   */
  private static getEnvVar(key: string): string | undefined {
    try {
      // في بيئة Vite
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        return import.meta.env[key];
      }
      
      // في بيئة Node.js
      if (typeof process !== 'undefined' && process.env) {
        return process.env[key];
      }
      
      return undefined;
    } catch (error) {
      console.warn(`خطأ في قراءة متغير البيئة ${key}:`, error);
      return undefined;
    }
  }

  /**
   * التحقق من صحة متغير واحد
   */
  private static validateSingleVar(envVar: RequiredEnvVar): {
    isValid: boolean;
    error?: string;
    warning?: string;
  } {
    const value = this.getEnvVar(envVar.key);

    // التحقق من الوجود للمتغيرات المطلوبة
    if (envVar.required && (!value || value.trim() === '')) {
      return {
        isValid: false,
        error: `المتغير ${envVar.key} مطلوب ولكنه غير محدد`
      };
    }

    // إذا كان المتغير غير مطلوب وغير موجود، فهذا مقبول
    if (!envVar.required && (!value || value.trim() === '')) {
      return { isValid: true };
    }

    // التحقق من القيم الافتراضية
    if (value && (
      value.includes('YOUR_') || 
      value.includes('_HERE') || 
      value === 'your_api_key_here' ||
      value === 'YOUR_API_KEY_HERE'
    )) {
      return {
        isValid: false,
        error: `المتغير ${envVar.key} يحتوي على قيمة افتراضية ويحتاج لمفتاح حقيقي`
      };
    }

    // التحقق من الطول الأدنى
    if (value && envVar.minLength && value.length < envVar.minLength) {
      return {
        isValid: false,
        error: `المتغير ${envVar.key} قصير جداً (الحد الأدنى ${envVar.minLength} أحرف)`
      };
    }

    // التحقق من النمط المطلوب
    if (value && envVar.pattern && !envVar.pattern.test(value)) {
      return {
        isValid: false,
        error: `المتغير ${envVar.key} لا يتطابق مع النمط المطلوب`
      };
    }

    return { isValid: true };
  }

  /**
   * التحقق من جميع متغيرات البيئة
   */
  static validateEnvironment(): EnvValidationResult {
    const result: EnvValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      missingKeys: [],
      validKeys: []
    };

    REQUIRED_ENV_VARS.forEach(envVar => {
      const validation = this.validateSingleVar(envVar);
      
      if (!validation.isValid) {
        result.isValid = false;
        if (validation.error) {
          result.errors.push(validation.error);
          result.missingKeys.push(envVar.key);
        }
      } else {
        const value = this.getEnvVar(envVar.key);
        if (value && value.trim() !== '') {
          result.validKeys.push(envVar.key);
        }
      }

      if (validation.warning) {
        result.warnings.push(validation.warning);
      }
    });

    return result;
  }

  /**
   * التحقق من مجموعة معينة من المتغيرات
   */
  static validateServiceKeys(serviceKeys: string[]): EnvValidationResult {
    const result: EnvValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      missingKeys: [],
      validKeys: []
    };

    const relevantVars = REQUIRED_ENV_VARS.filter(envVar => 
      serviceKeys.some(key => envVar.key.includes(key.toUpperCase()))
    );

    relevantVars.forEach(envVar => {
      const validation = this.validateSingleVar(envVar);
      
      if (!validation.isValid && validation.error) {
        result.isValid = false;
        result.errors.push(validation.error);
        result.missingKeys.push(envVar.key);
      } else {
        result.validKeys.push(envVar.key);
      }

      if (validation.warning) {
        result.warnings.push(validation.warning);
      }
    });

    return result;
  }

  /**
   * إنشاء تقرير مفصل عن حالة البيئة
   */
  static generateReport(): string {
    const validation = this.validateEnvironment();
    
    let report = '🔍 تقرير فحص متغيرات البيئة\n';
    report += '=' .repeat(50) + '\n\n';

    // الحالة العامة
    report += `📊 الحالة العامة: ${validation.isValid ? '✅ صالحة' : '❌ غير صالحة'}\n\n`;

    // المفاتيح الصالحة
    if (validation.validKeys.length > 0) {
      report += '✅ المفاتيح المُكونة بشكل صحيح:\n';
      validation.validKeys.forEach(key => {
        report += `   • ${key}\n`;
      });
      report += '\n';
    }

    // المفاتيح المفقودة أو الخاطئة
    if (validation.errors.length > 0) {
      report += '❌ المشاكل الموجودة:\n';
      validation.errors.forEach(error => {
        report += `   • ${error}\n`;
      });
      report += '\n';
    }

    // التحذيرات
    if (validation.warnings.length > 0) {
      report += '⚠️ التحذيرات:\n';
      validation.warnings.forEach(warning => {
        report += `   • ${warning}\n`;
      });
      report += '\n';
    }

    // إرشادات الإصلاح
    if (!validation.isValid) {
      report += '🔧 كيفية الإصلاح:\n';
      report += '1. تأكد من إنشاء ملف .env في جذر المشروع\n';
      report += '2. انسخ محتوى .env.example إلى .env\n';
      report += '3. استبدل القيم الافتراضية بمفاتيحك الحقيقية\n';
      report += '4. أعد تشغيل التطبيق\n\n';
    }

    // إحصائيات
    const totalVars = REQUIRED_ENV_VARS.length;
    const configuredVars = validation.validKeys.length;
    const requiredVars = REQUIRED_ENV_VARS.filter(v => v.required).length;
    const configuredRequiredVars = validation.validKeys.filter(key => 
      REQUIRED_ENV_VARS.find(v => v.key === key)?.required
    ).length;

    report += '📈 الإحصائيات:\n';
    report += `   • إجمالي المتغيرات: ${totalVars}\n`;
    report += `   • المُكونة: ${configuredVars}/${totalVars}\n`;
    report += `   • المطلوبة: ${requiredVars}\n`;
    report += `   • المطلوبة المُكونة: ${configuredRequiredVars}/${requiredVars}\n`;

    return report;
  }

  /**
   * فحص سريع للحد الأدنى من المتغيرات المطلوبة
   */
  static quickCheck(): boolean {
    const criticalKeys = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY'
    ];

    return criticalKeys.every(key => {
      const value = this.getEnvVar(key);
      return value && value.trim() !== '' && !value.includes('YOUR_');
    });
  }

  /**
   * الحصول على معلومات متغير معين
   */
  static getVarInfo(key: string): RequiredEnvVar | undefined {
    return REQUIRED_ENV_VARS.find(envVar => envVar.key === key);
  }

  /**
   * تجميع المتغيرات حسب الخدمة
   */
  static getVarsByService(): Record<string, RequiredEnvVar[]> {
    const services: Record<string, RequiredEnvVar[]> = {};

    REQUIRED_ENV_VARS.forEach(envVar => {
      let service = 'عام';
      
      if (envVar.key.includes('GOOGLE_MAPS')) service = 'خرائط Google';
      else if (envVar.key.includes('LINKEDIN')) service = 'LinkedIn';
      else if (envVar.key.includes('AZURE')) service = 'Azure';
      else if (envVar.key.includes('TRANSLATE')) service = 'ترجمة Google';
      else if (envVar.key.includes('OCR')) service = 'تحليل النصوص';
      else if (envVar.key.includes('GEMINI')) service = 'Gemini AI';
      else if (envVar.key.includes('AMAZON')) service = 'Amazon';
      else if (envVar.key.includes('SUPABASE')) service = 'Supabase';

      if (!services[service]) {
        services[service] = [];
      }
      services[service].push(envVar);
    });

    return services;
  }
}

export default EnvironmentValidator;