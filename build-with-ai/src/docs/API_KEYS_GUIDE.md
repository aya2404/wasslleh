# 🔐 دليل إعداد مفاتيح APIs - تطبيق وصلة

هذا الدليل الشامل يوضح كيفية الحصول على وإعداد جميع مفاتيح APIs المطلوبة لتطبيق "وصلة".

## 📋 جدول المحتويات

1. [📍 الإعداد السريع](#الإعداد-السريع)
2. [🗺️ Google Maps API](#google-maps-api)
3. [💼 LinkedIn API](#linkedin-api)
4. [🗣️ Azure Text-to-Speech](#azure-text-to-speech)
5. [🌐 Google Translate API](#google-translate-api)
6. [👁️ OCR API](#ocr-api)
7. [🤖 Gemini AI API](#gemini-ai-api)
8. [🛒 Amazon Product API](#amazon-product-api)
9. [🗄️ Supabase](#supabase)
10. [⚠️ نصائح الأمان](#نصائح-الأمان)
11. [🛠️ استكشاف الأخطاء](#استكشاف-الأخطاء)

---

## 📍 الإعداد السريع

### الخطوة 1: نسخ ملف البيئة
```bash
cp .env.example .env
```

### الخطوة 2: تحرير الملف
```bash
nano .env
# أو استخدم محرر النصوص المفضل لديك
```

### الخطوة 3: التحقق من الإعداد
```bash
npm run validate-env
# أو افتح التطبيق وانتقل لإدارة APIs
```

---

## 🗺️ Google Maps API

### الغرض:
- عرض الخرائط التفاعلية
- توجيه المسارات الآمنة لذوي الاحتياجات الخاصة
- البحث عن الأماكن والخدمات

### كيفية الحصول على المفتاح:

#### الخطوة 1: إنشاء مشروع في Google Cloud
1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. قم بإنشاء مشروع جديد أو اختر مشروع موجود
3. تأكد من تفعيل الفوترة (Billing) للمشروع

#### الخطوة 2: تفعيل APIs المطلوبة
انتقل إلى **APIs & Services > Library** وفعل:
- Maps JavaScript API
- Places API
- Directions API
- Geocoding API
- Distance Matrix API

#### الخطوة 3: إنشاء مفتاح API
1. اذهب إلى **APIs & Services > Credentials**
2. انقر **Create Credentials > API key**
3. انسخ المفتاح

#### الخطوة 4: تقييد المفتاح (مهم للأمان)
1. انقر على المفتاح الذي أنشأته
2. في **Application restrictions**:
   - اختر **HTTP referrers**
   - أضف نطاقك: `https://yourdomain.com/*`
   - للتطوير أضف: `http://localhost:5173/*`
3. في **API restrictions**:
   - اختر **Restrict key**
   - حدد APIs المطلوبة فقط

#### إعداد ملف .env:
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuvwx
VITE_GOOGLE_MAPS_ID=your-map-id (اختياري)
```

### 💰 التكلفة المتوقعة:
- الاستخدام المجاني: 28,000 طلب شهرياً
- بعد ذلك: $7 لكل 1000 طلب إضافي

---

## 💼 LinkedIn API

### الغرض:
- البحث عن الفرص الوظيفية
- ربط المستخدمين بأصحاب العمل
- عرض وظائف مناسبة لذوي الاحتياجات الخاصة

### كيفية الحصول على المفتاح:

#### الخطوة 1: إنشاء تطبيق LinkedIn
1. اذهب إلى [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. انقر **Create App**
3. املأ معلومات التطبيق:
   - **App name**: وصلة - Waslah
   - **LinkedIn Page**: صفحة شركتك أو منظمتك
   - **Privacy policy URL**: رابط سياسة الخصوصية
   - **App logo**: شعار التطبيق

#### الخطوة 2: تكوين المنتجات
1. في صفحة التطبيق، انتقل إلى **Products**
2. أضف المنتجات المطلوبة:
   - **Sign In with LinkedIn**
   - **Share on LinkedIn** (إذا أردت)

#### الخطوة 3: الحصول على المفاتيح
1. انتقل إلى تبويب **Auth**
2. انسخ **Client ID** و **Client Secret**

#### الخطوة 4: إعداد Redirect URLs
أضف هذه الروابط في **Authorized redirect URLs**:
```
http://localhost:5173/auth/linkedin/callback
https://yourdomain.com/auth/linkedin/callback
```

#### إعداد ملف .env:
```env
VITE_LINKEDIN_CLIENT_ID=86x1xl1234567890
VITE_LINKEDIN_CLIENT_SECRET=abcDEF123456
```

### 💰 التكلفة:
- مجاني للاستخدام الأساسي
- للاستخدام التجاري: $59.95/شهر

---

## 🗣️ Azure Text-to-Speech

### الغرض:
- تحويل النص إلى كلام باللهجة الأردنية
- دعم المستخدمين ذوي الإعاقة البصرية
- توفير تجربة صوتية محسنة

### كيفية الحصول على المفتاح:

#### الخطوة 1: إنشاء حساب Azure
1. اذهب إلى [Azure Portal](https://portal.azure.com/)
2. قم بإنشاء حساب جديد أو سجل الدخول

#### الخطوة 2: إنشاء Speech Service
1. انقر **Create a resource**
2. ابحث عن **Speech**
3. انقر **Create** تحت **Speech**
4. املأ التفاصيل:
   - **Subscription**: اختر اشتراكك
   - **Resource group**: أنشئ مجموعة جديدة
   - **Region**: اختر **East US** (أفضل دعم للعربية)
   - **Name**: اختر اسماً مميزاً
   - **Pricing tier**: ابدأ بـ **Free F0**

#### الخطوة 3: الحصول على المفاتيح
1. بعد إنشاء الخدمة، اذهب إليها
2. انتقل إلى **Keys and Endpoint**
3. انسخ **Key 1** و **Region**

#### إعداد ملف .env:
```env
VITE_AZURE_TTS_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
VITE_AZURE_TTS_REGION=eastus
```

### 🎤 الأصوات المدعومة للعربية:
- **ar-JO-TaimNeural** (ذكر أردني)
- **ar-JO-SanaNeural** (أنثى أردنية)
- **ar-SA-HamedNeural** (ذكر سعودي)
- **ar-SA-ZariyahNeural** (أنثى سعودية)

### 💰 التكلفة:
- المجاني: 500,000 حرف شهرياً
- المدفوع: $4 لكل مليون حرف

---

## 🌐 Google Translate API

### الغرض:
- ترجمة المحتوى بين العربية والإنجليزية
- دعم المستخدمين متعددي اللغات
- ترجمة فورية للنصوص

### كيفية الحصول على المفتاح:

#### الخطوة 1: تفعيل Translation API
1. في [Google Cloud Console](https://console.cloud.google.com/)
2. انتقل إلى **APIs & Services > Library**
3. ابحث عن **Cloud Translation API**
4. انقر **Enable**

#### الخطوة 2: إنشاء مفتاح API
1. اذهب إلى **APIs & Services > Credentials**
2. انقر **Create Credentials > API key**
3. انسخ المفتاح

#### الخطوة 3: تقييد المفتاح
1. انقر على المفتاح
2. في **API restrictions**: اختر **Cloud Translation API**
3. في **Application restrictions**: أضف نطاقك

#### إعداد ملف .env:
```env
VITE_GOOGLE_TRANSLATE_API_KEY=AIzaSyB9876543210zyxwvutsrqponmlkjihgfed
```

### 💰 التكلفة:
- $20 لكل مليون حرف
- الشهر الأول: $300 رصيد مجاني

---

## 👁️ OCR API

### الغرض:
- تحليل النصوص من الصور
- مساعدة ذوي الإعاقة البصرية في قراءة المحتوى المرئي
- استخراج النص من المستندات

### الخيارات المتاحة:

#### الخيار 1: OCR.Space (الأسهل)
1. اذهب إلى [OCR.Space](https://ocr.space/ocrapi)
2. قم بالتسجيل مجاناً
3. احصل على مفتاح API من لوحة التحكم

```env
VITE_OCR_API_KEY=K87654321
VITE_OCR_API_URL=https://api.ocr.space/parse/image
```

#### الخيار 2: Google Vision API
1. في Google Cloud Console، فعل **Vision API**
2. استخدم نفس مفتاح Google Cloud

```env
VITE_OCR_API_KEY=نفس_مفتاح_جوجل_كلاود
VITE_OCR_API_URL=https://vision.googleapis.com/v1/images:annotate
```

### 💰 التكلفة:
- **OCR.Space**: 25,000 طلب مجاني شهرياً، ثم $60/شهر
- **Google Vision**: 1,000 طلب مجاني شهرياً، ثم $1.50 لكل 1000 طلب

---

## 🤖 Gemini AI API

### الغرض:
- تشغيل الشات بوت الذكي
- تقديم المساعدة والإرشاد
- الإجابة على الأسئلة المتعلقة بالإعاقة

### كيفية الحصول على المفتاح:

#### الخطوة 1: الذهاب إلى Google AI Studio
1. اذهب إلى [Google AI Studio](https://makersuite.google.com/)
2. سجل الدخول بحساب Google

#### الخطوة 2: إنشاء مفتاح API
1. انقر **Get API key**
2. اختر **Create API key in new project** أو اختر مشروع موجود
3. انسخ المفتاح

#### إعداد ملف .env:
```env
VITE_GEMINI_API_KEY=AIzaSyG1234567890abcdefghijklmnopqrstuvwx
```

### 💰 التكلفة:
- 60 طلب مجاني في الدقيقة
- 1,500 طلب مجاني في اليوم
- المدفوع: يبدأ من $0.50 لكل مليون توكن

---

## 🛒 Amazon Product API

### الغرض:
- عرض منتجات مساعدة لذوي الاحتياجات الخاصة
- ربط المستخدمين بالمنتجات المناسبة
- كسب عمولة من المبيعات

### كيفية الحصول على المفتاح:

#### الخطوة 1: التسجيل في برنامج Amazon Associates
1. اذهب إلى [Amazon Associate Program](https://affiliate-program.amazon.com/)
2. قم بالتسجيل وإنشاء حساب
3. أضف معلومات موقعك
4. انتظر الموافقة

#### الخطوة 2: الحصول على Product Advertising API
1. بعد الموافقة على Associates، اطلب الوصول لـ PA-API
2. اذهب إلى [Product Advertising API](https://webservices.amazon.com/paapi5/documentation/)
3. اطلب الوصول للAPI

#### الخطوة 3: إنشاء المفاتيح
1. في لوحة Associates، اذهب إلى **Tools > Product Advertising API**
2. أنشئ **Access Key** و **Secret Key**

#### إعداد ملف .env:
```env
VITE_AMAZON_ACCESS_KEY=AKIA1234567890ABCDEF
VITE_AMAZON_SECRET_KEY=abcDEF123456789ghiJKL098765mnoPQR
VITE_AMAZON_ASSOCIATE_TAG=your-tag-20
```

### 💰 العمولة:
- تختلف حسب فئة المنتج (1-10%)
- يجب تحقيق 3 مبيعات في 180 يوماً للاحتفاظ بالحساب

---

## 🗄️ Supabase

### الغرض:
- قاعدة بيانات للمستخدمين والمحتوى
- نظام المصادقة والتسجيل
- تخزين ملفات التطبيق

### كيفية الحصول على المفتاح:

#### الخطوة 1: إنشاء حساب
1. اذهب إلى [Supabase](https://supabase.com/)
2. انقر **Start your project**
3. قم بالتسجيل

#### الخطوة 2: إنشاء مشروع جديد
1. انقر **New Project**
2. اختر منظمة أو أنشئ واحدة جديدة
3. املأ معلومات المشروع:
   - **Name**: وصلة - Waslah
   - **Database Password**: كلمة مرور قوية
   - **Region**: اختر أقرب منطقة

#### الخطوة 3: الحصول على المفاتيح
1. بعد إنشاء المشروع، اذهب إلى **Settings > API**
2. انسخ:
   - **Project URL**
   - **anon public key**
   - **service_role secret key** (للخادم فقط)

#### إعداد ملف .env:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # للخادم فقط
```

### 💰 التكلفة:
- المجاني: قاعدة بيانات 500MB، 50,000 مستخدم شهرياً
- Pro: $25/شهر لكل مشروع

---

## ⚠️ نصائح الأمان

### 🔒 حماية المفاتيح:

#### 1. لا تشارك المفاتيح أبداً
```bash
# تأكد من وجود .env في .gitignore
echo ".env" >> .gitignore
```

#### 2. استخدم متغيرات البيئة في الإنتاج
```bash
# في Vercel
vercel env add VITE_GOOGLE_MAPS_API_KEY

# في Netlify
netlify env:set VITE_GOOGLE_MAPS_API_KEY your-key-here
```

#### 3. قيد المفاتيح بالنطاق
- أضف نطاقك فقط في إعدادات API
- لا تسمح بالوصول من أي نطاق

#### 4. راقب الاستخدام
- تحقق من استخدام APIs بانتظام
- ضع تنبيهات للاستخدام الزائد

### 🚨 علامات التحذير:
- مفاتيح تحتوي على "YOUR_" أو "_HERE"
- استخدام مفرط غير متوقع
- طلبات من نطاقات غير مسموحة

---

## 🛠️ استكشاف الأخطاء

### المشكلة: مفتاح Google Maps لا يعمل
```javascript
// تحقق من تفعيل APIs المطلوبة
console.error('Google Maps API key issues:');
console.log('1. Check if Maps JavaScript API is enabled');
console.log('2. Verify API key restrictions');
console.log('3. Check billing is enabled');
```

**الحلول:**
1. تأكد من تفعيل جميع APIs المطلوبة
2. تحقق من صحة تقييدات المفتاح
3. تأكد من تفعيل الفوترة

### المشكلة: Azure TTS لا يعمل
```javascript
// فحص مفتاح Azure
fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
  headers: {
    'Ocp-Apim-Subscription-Key': apiKey
  }
}).then(response => {
  if (!response.ok) {
    console.error('Azure TTS key invalid');
  }
});
```

**الحلول:**
1. تحقق من صحة المنطقة (Region)
2. تأكد من صحة مفتاح API
3. تحقق من حدود الاستخدام

### المشكلة: Gemini AI غير متاح
```javascript
// تحقق من توفر Gemini في منطقتك
if (import.meta.env.VITE_GEMINI_API_KEY) {
  console.log('Gemini API configured');
} else {
  console.warn('Gemini API not configured - using fallback');
}
```

**الحلول:**
1. تحقق من توفر Gemini في بلدك
2. استخدم VPN إذا لم يكن متاحاً
3. استخدم ChatGPT API كبديل

### أداة التحقق السريع:
```bash
# فحص جميع متغيرات البيئة
npm run check-env

# أو في التطبيق
# اذهب إلى Settings → API Management → Validation
```

---

## 📞 الدعم والمساعدة

### إذا واجهت مشاكل:

1. **تحقق من التوثيق الرسمي** لكل خدمة
2. **استخدم أداة التحقق** في التطبيق
3. **راجع السجلات** في وحدة تحكم المتصفح
4. **اطلب المساعدة** من مجتمع المطورين

### روابط مفيدة:
- [Google Cloud Support](https://cloud.google.com/support)
- [Azure Support](https://azure.microsoft.com/support/)
- [LinkedIn Developer Support](https://www.linkedin.com/help/linkedin)
- [Supabase Documentation](https://supabase.com/docs)

---

## 🎯 الخطوات التالية

بعد إعداد جميع المفاتيح:

1. **اختبر كل خدمة** باستخدام أداة التحقق
2. **ضع حدود للاستخدام** لتجنب التكاليف الزائدة
3. **راقب الأداء** والاستخدام بانتظام
4. **احتفظ بنسخة احتياطية** من المفاتيح في مكان آمن

---

**✨ مبروك! تطبيق وصلة جاهز الآن للاستخدام مع جميع الخدمات المتقدمة! ✨**