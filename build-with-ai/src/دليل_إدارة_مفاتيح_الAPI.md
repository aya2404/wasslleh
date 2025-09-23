# دليل إدارة مفاتيح API
## موقع وصلة - جسرٌ نحو مجتمع شامل

---

## 📋 نظرة عامة

هذا الدليل يوضح كيفية إعداد وإدارة مفاتيح API المطلوبة لتشغيل موقع وصلة بكامل ميزاته. جميع المفاتيح محفوظة بشكل آمن في الخادم الخلفي وليس في الكود الأمامي.

---

## 🔐 الأمان وأفضل الممارسات

### مبادئ الأمان
- ✅ **لا تضع المفاتيح في الكود الأمامي أبداً**
- ✅ **استخدم متغيرات البيئة**
- ✅ **قم بتشفير المفاتيح الحساسة**
- ✅ **راجع الصلاحيات بانتظام**
- ✅ **استخدم مستويات وصول محدودة**

### بنية التخزين الآمن
```
📁 config/
├── 🔒 apiKeysManager.ts      # مدير المفاتيح الآمن
├── 🔒 envValidation.ts       # التحقق من المتغيرات
└── 🔒 apiConfig.ts           # إعدادات API العامة
```

---

## 🗝️ مفاتيح API المطلوبة

### 1. 🗺️ Google Maps API

#### الخدمات المطلوبة:
- **Maps JavaScript API**: للخرائط التفاعلية
- **Places API**: للبحث عن الأماكن
- **Directions API**: لحساب المسارات
- **Geocoding API**: لتحويل العناوين إلى إحداثيات

#### موقع التخزين:
```typescript
// 📁 config/apiKeysManager.ts
const GOOGLE_MAPS_API_KEYS = {
  development: process.env.GOOGLE_MAPS_API_KEY_DEV || '',
  production: process.env.GOOGLE_MAPS_API_KEY_PROD || '',
  staging: process.env.GOOGLE_MAPS_API_KEY_STAGING || ''
};
```

#### متغيرات البيئة:
```env
# في ملف .env
GOOGLE_MAPS_API_KEY_DEV=YOUR_DEVELOPMENT_KEY_HERE
GOOGLE_MAPS_API_KEY_PROD=YOUR_PRODUCTION_KEY_HERE
GOOGLE_MAPS_API_KEY_STAGING=YOUR_STAGING_KEY_HERE
```

---

### 2. 💼 LinkedIn API

#### الخدمات المطلوبة:
- **LinkedIn API v2**: للوصول للوظائف
- **OAuth 2.0**: للمصادقة
- **Partner Jobs API**: للوظائف المختصة

#### موقع التخزين:
```typescript
// 📁 config/linkedinApiConfig.ts
const LINKEDIN_API_CONFIG = {
  clientId: process.env.LINKEDIN_CLIENT_ID || '',
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
  redirectUri: process.env.LINKEDIN_REDIRECT_URI || '',
  scopes: ['r_liteprofile', 'r_emailaddress', 'w_member_social']
};
```

#### متغيرات البيئة:
```env
LINKEDIN_CLIENT_ID=YOUR_LINKEDIN_CLIENT_ID_HERE
LINKEDIN_CLIENT_SECRET=YOUR_LINKEDIN_CLIENT_SECRET_HERE
LINKEDIN_REDIRECT_URI=https://yoursite.com/auth/linkedin/callback
```

---

### 3. 🛒 Amazon API

#### الخدمات المطلوبة:
- **Product Advertising API**: للمنتجات
- **Associate Program**: للعمولات

#### موقع التخزين:
```typescript
// 📁 config/amazonApiConfig.ts
const AMAZON_API_CONFIG = {
  accessKey: process.env.AMAZON_ACCESS_KEY || '',
  secretKey: process.env.AMAZON_SECRET_KEY || '',
  associateTag: process.env.AMAZON_ASSOCIATE_TAG || '',
  region: process.env.AMAZON_REGION || 'us-east-1'
};
```

#### متغيرات البيئة:
```env
AMAZON_ACCESS_KEY=YOUR_AMAZON_ACCESS_KEY_HERE
AMAZON_SECRET_KEY=YOUR_AMAZON_SECRET_KEY_HERE
AMAZON_ASSOCIATE_TAG=YOUR_ASSOCIATE_TAG_HERE
AMAZON_REGION=us-east-1  # أو المنطقة المناسبة
```

---

### 4. 🤖 Gemini AI API

#### الخدمات المطلوبة:
- **Gemini Pro API**: للذكاء الاصطناعي
- **Text Generation**: لإنتاج النصوص
- **Chat Completion**: للمحادثات

#### موقع التخزين:
```typescript
// 📁 config/geminiApiConfig.ts
const GEMINI_API_CONFIG = {
  apiKey: process.env.GEMINI_API_KEY || '',
  model: process.env.GEMINI_MODEL || 'gemini-pro',
  endpoint: process.env.GEMINI_ENDPOINT || 'https://generativelanguage.googleapis.com'
};
```

#### متغيرات البيئة:
```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
GEMINI_MODEL=gemini-pro
GEMINI_ENDPOINT=https://generativelanguage.googleapis.com
```

---

### 5. 🔊 Text-to-Speech API

#### الخدمات المطلوبة:
- **Google Cloud Text-to-Speech**: للقراءة الصوتية
- **Azure Cognitive Services**: بديل للقراءة الصوتية

#### موقع التخزين:
```typescript
// 📁 config/ttsApiConfig.ts
const TTS_API_CONFIG = {
  google: {
    apiKey: process.env.GOOGLE_TTS_API_KEY || '',
    projectId: process.env.GOOGLE_PROJECT_ID || ''
  },
  azure: {
    subscriptionKey: process.env.AZURE_TTS_SUBSCRIPTION_KEY || '',
    region: process.env.AZURE_TTS_REGION || 'eastus'
  }
};
```

#### متغيرات البيئة:
```env
# Google TTS
GOOGLE_TTS_API_KEY=YOUR_GOOGLE_TTS_API_KEY_HERE
GOOGLE_PROJECT_ID=YOUR_GOOGLE_PROJECT_ID_HERE

# Azure TTS (البديل)
AZURE_TTS_SUBSCRIPTION_KEY=YOUR_AZURE_TTS_KEY_HERE
AZURE_TTS_REGION=eastus
```

---

### 6. 🗄️ Supabase

#### الخدمات المطلوبة:
- **Database**: قاعدة البيانات
- **Authentication**: المصادقة
- **Storage**: تخزين الملفات
- **Edge Functions**: الوظائف الخلفية

#### موقع التخزين:
```typescript
// 📁 config/supabaseConfig.ts
const SUPABASE_CONFIG = {
  url: process.env.SUPABASE_URL || '',
  anonKey: process.env.SUPABASE_ANON_KEY || '',
  serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
};
```

#### متغيرات البيئة:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_KEY_HERE
```

---

## 📁 هيكل ملفات إدارة المفاتيح

### 1. مدير المفاتيح الرئيسي
```typescript
// 📁 config/apiKeysManager.ts
export class APIKeysManager {
  private static instance: APIKeysManager;
  private keys: Map<string, string> = new Map();
  
  // طرق آمنة لإدارة المفاتيح
  public static getInstance(): APIKeysManager { /* ... */ }
  public setKey(service: string, key: string): void { /* ... */ }
  public getKey(service: string): string { /* ... */ }
  public validateKeys(): boolean { /* ... */ }
  public encryptKey(key: string): string { /* ... */ }
  public decryptKey(encryptedKey: string): string { /* ... */ }
}
```

### 2. التحقق من صحة المتغيرات
```typescript
// 📁 config/envValidation.ts
export interface EnvironmentVariables {
  // Google Maps
  GOOGLE_MAPS_API_KEY_DEV: string;
  GOOGLE_MAPS_API_KEY_PROD: string;
  
  // LinkedIn
  LINKEDIN_CLIENT_ID: string;
  LINKEDIN_CLIENT_SECRET: string;
  
  // Amazon
  AMAZON_ACCESS_KEY: string;
  AMAZON_SECRET_KEY: string;
  
  // Gemini AI
  GEMINI_API_KEY: string;
  
  // TTS
  GOOGLE_TTS_API_KEY: string;
  
  // Supabase
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

export function validateEnvironmentVariables(): void { /* ... */ }
```

### 3. إعدادات API العامة
```typescript
// 📁 config/apiConfig.ts
export const API_CONFIG = {
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  baseHeaders: {
    'Content-Type': 'application/json',
    'User-Agent': 'Waslah-Platform/1.0'
  }
};
```

---

## 🔧 إعداد متغيرات البيئة

### 1. ملف .env للتطوير
```env
# ================================================
# متغيرات البيئة لموقع وصلة
# ================================================

# --- Google Maps API ---
GOOGLE_MAPS_API_KEY_DEV=YOUR_DEVELOPMENT_KEY_HERE
GOOGLE_MAPS_API_KEY_PROD=YOUR_PRODUCTION_KEY_HERE
GOOGLE_MAPS_API_KEY_STAGING=YOUR_STAGING_KEY_HERE

# --- LinkedIn API ---
LINKEDIN_CLIENT_ID=YOUR_LINKEDIN_CLIENT_ID_HERE
LINKEDIN_CLIENT_SECRET=YOUR_LINKEDIN_CLIENT_SECRET_HERE
LINKEDIN_REDIRECT_URI=http://localhost:3000/auth/linkedin/callback

# --- Amazon API ---
AMAZON_ACCESS_KEY=YOUR_AMAZON_ACCESS_KEY_HERE
AMAZON_SECRET_KEY=YOUR_AMAZON_SECRET_KEY_HERE
AMAZON_ASSOCIATE_TAG=YOUR_ASSOCIATE_TAG_HERE
AMAZON_REGION=us-east-1

# --- Gemini AI API ---
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
GEMINI_MODEL=gemini-pro
GEMINI_ENDPOINT=https://generativelanguage.googleapis.com

# --- Text-to-Speech APIs ---
GOOGLE_TTS_API_KEY=YOUR_GOOGLE_TTS_API_KEY_HERE
GOOGLE_PROJECT_ID=YOUR_GOOGLE_PROJECT_ID_HERE
AZURE_TTS_SUBSCRIPTION_KEY=YOUR_AZURE_TTS_KEY_HERE
AZURE_TTS_REGION=eastus

# --- Supabase ---
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_KEY_HERE

# --- إعدادات إضافية ---
NODE_ENV=development
APP_ENV=development
```

### 2. ملف .env.production للإنتاج
```env
# نفس المتغيرات مع القيم الخاصة بالإنتاج
NODE_ENV=production
APP_ENV=production
# ... باقي المتغيرات بقيم الإنتاج
```

---

## 🛡️ إعدادات الأمان المتقدمة

### 1. تشفير المفاتيح
```typescript
// 📁 utils/encryption.ts
import CryptoJS from 'crypto-js';

export class KeyEncryption {
  private static readonly SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY || 'default-secret-key';
  
  public static encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.SECRET_KEY).toString();
  }
  
  public static decrypt(encryptedText: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedText, this.SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
```

### 2. إدارة الصلاحيات
```typescript
// 📁 config/permissions.ts
export const API_PERMISSIONS = {
  GOOGLE_MAPS: {
    allowedOrigins: ['https://waslah.com', 'http://localhost:3000'],
    rateLimits: {
      requestsPerMinute: 100,
      requestsPerDay: 25000
    }
  },
  LINKEDIN: {
    scopes: ['r_liteprofile', 'r_emailaddress'],
    rateLimits: {
      requestsPerHour: 500
    }
  }
  // ... باقي الصلاحيات
};
```

---

## 📊 مراقبة ومتابعة الاستخدام

### 1. مراقبة المفاتيح
```typescript
// 📁 utils/apiMonitoring.ts
export class APIMonitoring {
  public static async checkAPIHealth(): Promise<APIHealthStatus> {
    // فحص حالة جميع APIs
  }
  
  public static async trackUsage(apiName: string, requestCount: number): Promise<void> {
    // تتبع الاستخدام
  }
  
  public static async checkRateLimits(): Promise<RateLimitStatus> {
    // فحص حدود الاستخدام
  }
}
```

### 2. تسجيل الأخطاء
```typescript
// 📁 utils/errorLogging.ts
export class APIErrorLogger {
  public static logAPIError(apiName: string, error: Error): void {
    console.error(`[${apiName}] API Error:`, {
      message: error.message,
      timestamp: new Date().toISOString(),
      stack: error.stack
    });
  }
}
```

---

## 🔄 إجراءات التحديث والصيانة

### خطة الصيانة الدورية
1. **أسبوعياً**: فحص حدود الاستخدام
2. **شهرياً**: مراجعة الصلاحيات
3. **ربع سنوياً**: تجديد المفاتيح
4. **سنوياً**: مراجعة شاملة للأمان

### إجراءات الطوارئ
- خطة النسخ الاحتياطي للمفاتيح
- إجراءات استرداد الخدمة
- تفعيل الخدمات البديلة
- إشعارات الأخطاء الفورية

---

## 📞 الدعم والمساعدة

### في حالة مشاكل المفاتيح:
1. تحقق من صحة المفاتيح
2. راجع حدود الاستخدام
3. تأكد من الصلاحيات
4. اتصل بالدعم التقني

### معلومات الاتصال:
- **البريد الإلكتروني**: tech-support@waslah.com
- **الهاتف**: +962-X-XXXX-XXXX
- **الدعم الطارئ**: متوفر 24/7

---

*تم إعداد هذا الدليل بتاريخ: سبتمبر 2024*
*آخر تحديث: سبتمبر 2024*

---

© 2024 وصلة - جسرٌ نحو مجتمع شامل. جميع الحقوق محفوظة.