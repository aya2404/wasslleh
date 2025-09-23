# 📁 مجلد التكوين (Config)

هذا المجلد يحتوي على جميع ملفات التكوين وإدارة مفاتيح APIs لتطبيق "وصلة".

## 📋 قائمة الملفات:

### 🔧 `apiConfig.ts`
**الوظيفة:** ملف التكوين الرئيسي لجميع APIs
**يحتوي على:**
- واجهة `APIConfig` التي تحدد هيكل جميع مفاتيح APIs
- الإعدادات الافتراضية لكل خدمة
- إعدادات خاصة بكل منطقة جغرافية (الأردن، السعودية، الإمارات، مصر)
- أصوات TTS لكل لهجة محلية
- كلاس `APIConfigManager` لإدارة حفظ وتحميل الإعدادات

**الخدمات المشمولة:**
- Google Maps (للخرائط والمسارات)
- LinkedIn (للفرص الوظيفية)
- Azure TTS (للنطق باللهجة المحلية)
- Google Translate (للترجمة)
- OCR (لتحليل النصوص من الصور)
- Gemini AI (للشات بوت)
- Amazon (للمتجر)
- Supabase (قاعدة البيانات والمصادقة)

### 🔐 `apiKeysManager.ts`
**الوظيفة:** إدارة آمنة لمفاتيح APIs
**المميزات:**
- تشفير بسيط للمفاتيح قبل التخزين
- التحقق من صحة المفاتيح
- كاش للنتائج لتحسين الأداء
- إمكانية تصدير واستيراد المفاتيح
- إحصائيات شاملة عن حالة المفاتيح

**الوظائف الرئيسية:**
- `setApiKey()` - حفظ مفتاح API
- `getApiKey()` - استرداد مفتاح API
- `validateApiKey()` - التحقق من صحة المفتاح
- `getApiKeysStatus()` - حالة جميع المفاتيح

### 🔍 `envValidation.ts`
**الوظيفة:** التحقق من صحة متغيرات البيئة
**المميزات:**
- قائمة شاملة بجميع متغيرات البيئة المطلوبة
- التحقق من الأنماط والطول الأدنى
- تقارير مفصلة عن المشاكل
- فحص سريع للمتغيرات الحرجة
- تجميع المتغيرات حسب الخدمة

**الوظائف الرئيسية:**
- `validateEnvironment()` - فحص شامل
- `generateReport()` - إنشاء تقرير مفصل
- `quickCheck()` - فحص سريع
- `getVarsByService()` - تجميع حسب الخدمة

### 🔗 `linkedinApiConfig.ts`
**الوظيفة:** إعدادات خاصة بـ LinkedIn API
**يحتوي على:**
- روابط endpoints للوظائف
- إعدادات OAuth
- أنواع البيانات المطلوبة

### 🗣️ `signLanguageConfig.ts`
**الوظيفة:** إعدادات لغة الإشارة (تم إيقافها)
**الحالة:** غير مستخدم حالياً

## 🚀 كيفية الاستخدام:

### 1. إعداد متغيرات البيئة:
```bash
# انسخ ملف المثال
cp .env.example .env

# اضبط المفاتيح في ملف .env
nano .env
```

### 2. التحقق من صحة الإعدادات:
```typescript
import { EnvironmentValidator } from './config/envValidation';

// فحص شامل
const validation = EnvironmentValidator.validateEnvironment();
console.log(validation);

// إنشاء تقرير
const report = EnvironmentValidator.generateReport();
console.log(report);
```

### 3. إدارة المفاتيح:
```typescript
import { SecureAPIKeysManager } from './config/apiKeysManager';

// حفظ مفتاح
SecureAPIKeysManager.setApiKey('googleMaps', 'your-key-here', 'apiKey');

// استرداد مفتاح
const key = SecureAPIKeysManager.getApiKey('googleMaps', 'apiKey');

// التحقق من صحة المفتاح
const validation = await SecureAPIKeysManager.validateApiKey('googleMaps', 'apiKey');
```

### 4. استخدام التكوين:
```typescript
import { defaultAPIConfig, APIConfigManager } from './config/apiConfig';

// تحميل الإعدادات
const config = APIConfigManager.loadConfig();

// التحقق من وجود مفتاح Google Maps
if (APIConfigManager.hasValidGoogleMapsKey()) {
  // استخدم خدمة الخرائط
}
```

## ⚠️ ملاحظات أمنية:

### 🔒 المفاتيح الآمنة:
- **لا تضع المفاتيح مباشرة في الكود**
- **استخدم متغيرات البيئة دائماً**
- **تأكد من أن `.env` في `.gitignore`**

### 🌐 بيئة الإنتاج:
- ضع المفاتيح في متغيرات البيئة للخادم
- استخدم خدمات إدارة الأسرار مثل AWS Secrets Manager
- قم بتشفير المفاتيح الحساسة

### 📊 المراقبة:
- راقب استخدام APIs للتحكم في التكلفة
- ضع حدود لمعدل الطلبات
- راجع السجلات بانتظام

## 🛠️ استكشاف الأخطاء:

### المشكلة: مفتاح API لا يعمل
```typescript
// فحص المفتاح
const validation = await SecureAPIKeysManager.validateApiKey('serviceName', 'keyName');
if (!validation.isValid) {
  console.error('خطأ في المفتاح:', validation.error);
}
```

### المشكلة: متغير البيئة مفقود
```typescript
// فحص متغيرات البيئة
const envCheck = EnvironmentValidator.validateEnvironment();
if (!envCheck.isValid) {
  console.error('متغيرات مفقودة:', envCheck.missingKeys);
}
```

### المشكلة: إعدادات خاطئة
```typescript
// إعادة تعيين الإعدادات
APIConfigManager.resetConfig();

// إعادة تحميل الإعدادات الافتراضية
const defaultConfig = APIConfigManager.loadConfig();
```

## 📈 إحصائيات الاستخدام:

يمكنك مراقبة حالة APIs باستخدام:

```typescript
// الحصول على إحصائيات المفاتيح
const status = SecureAPIKeysManager.getApiKeysStatus();

// عرض التقرير
const report = EnvironmentValidator.generateReport();
console.log(report);
```

## 🔄 التحديثات المستقبلية:

- [ ] إضافة المزيد من خدمات التحقق
- [ ] تحسين نظام التشفير
- [ ] إضافة مراقبة استخدام APIs
- [ ] دعم متغيرات البيئة المشروطة
- [ ] واجهة إدارة مرئية للمفاتيح