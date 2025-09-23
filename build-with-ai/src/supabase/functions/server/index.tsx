import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// إعداد CORS والسجلات
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*'],
}));

app.use('*', logger(console.log));

// إعداد Supabase للخادم
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// تسجيل مستخدم جديد
app.post('/make-server-14712447/signup', async (c) => {
  try {
    const { email, password, name, disabilityType, language } = await c.req.json();

    console.log('محاولة تسجيل مستخدم جديد:', { email, name, disabilityType });

    // إنشاء المستخدم في Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        disabilityType,
        language
      },
      // تأكيد البريد الإلكتروني تلقائياً لأنه لم يتم إعداد خادم بريد إلكتروني
      email_confirm: true
    });

    if (error) {
      console.error('خطأ في إنشاء المستخدم:', error);
      return c.json({ error: error.message }, 400);
    }

    console.log('تم إنشاء المستخدم بنجاح:', data.user.id);

    return c.json({ 
      user: data.user,
      message: 'تم إنشاء الحساب بنجاح'
    });

  } catch (error) {
    console.error('خطأ في تسجيل المستخدم:', error);
    return c.json({ error: 'خطأ داخلي في الخادم' }, 500);
  }
});

// حفظ ملف المستخدم
app.post('/make-server-14712447/user-profile', async (c) => {
  try {
    const profile = await c.req.json();
    
    console.log('حفظ ملف المستخدم:', profile.id);

    // حفظ البيانات في قاعدة البيانات KV
    const userKey = `user_profile:${profile.id}`;
    await kv.set(userKey, profile);

    // حفظ فهرس البريد الإلكتروني للبحث السريع
    const emailKey = `user_email:${profile.email}`;
    await kv.set(emailKey, profile.id);

    console.log('تم حفظ ملف المستخدم بنجاح');

    return c.json({ message: 'تم حفظ ملف المستخدم بنجاح' });

  } catch (error) {
    console.error('خطأ في حفظ ملف المستخدم:', error);
    return c.json({ error: 'فشل في حفظ ملف المستخدم' }, 500);
  }
});

// جلب ملف المستخدم
app.get('/make-server-14712447/user-profile/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    console.log('جلب ملف المستخدم:', userId);

    const userKey = `user_profile:${userId}`;
    const profile = await kv.get(userKey);

    if (!profile) {
      return c.json({ error: 'ملف المستخدم غير موجود' }, 404);
    }

    return c.json(profile);

  } catch (error) {
    console.error('خطأ في جلب ملف المستخدم:', error);
    return c.json({ error: 'فشل في جلب ملف المستخدم' }, 500);
  }
});

// تحديث ملف المستخدم
app.put('/make-server-14712447/user-profile/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const updates = await c.req.json();
    
    console.log('تحديث ملف المستخدم:', userId);

    // جلب الملف الحالي
    const userKey = `user_profile:${userId}`;
    const currentProfile = await kv.get(userKey);

    if (!currentProfile) {
      return c.json({ error: 'ملف المستخدم غير موجود' }, 404);
    }

    // دمج التحديثات
    const updatedProfile = {
      ...currentProfile,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // حفظ الملف المحدث
    await kv.set(userKey, updatedProfile);

    console.log('تم تحديث ملف المستخدم بنجاح');

    return c.json({ 
      message: 'تم تحديث ملف المستخدم بنجاح',
      profile: updatedProfile
    });

  } catch (error) {
    console.error('خطأ في تحديث ملف المستخدم:', error);
    return c.json({ error: 'فشل في تحديث ملف المستخدم' }, 500);
  }
});

// حذف ملف المستخدم
app.delete('/make-server-14712447/user-profile/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    console.log('حذف ملف المستخدم:', userId);

    // جلب الملف أولاً للحصول على البريد الإلكتروني
    const userKey = `user_profile:${userId}`;
    const profile = await kv.get(userKey);

    if (profile) {
      // حذف فهرس البريد الإلكتروني
      const emailKey = `user_email:${profile.email}`;
      await kv.del(emailKey);
    }

    // حذف ملف المستخدم
    await kv.del(userKey);

    console.log('تم حذف ملف المستخدم بنجاح');

    return c.json({ message: 'تم حذف ملف المستخدم بنجاح' });

  } catch (error) {
    console.error('خطأ في حذف ملف المستخدم:', error);
    return c.json({ error: 'فشل في حذف ملف المستخدم' }, 500);
  }
});

// البحث عن مستخدم بالبريد الإلكتروني
app.get('/make-server-14712447/user-by-email/:email', async (c) => {
  try {
    const email = c.req.param('email');
    
    console.log('البحث عن مستخدم بالبريد الإلكتروني:', email);

    const emailKey = `user_email:${email}`;
    const userId = await kv.get(emailKey);

    if (!userId) {
      return c.json({ error: 'المستخدم غير موجود' }, 404);
    }

    // جلب ملف المستخدم
    const userKey = `user_profile:${userId}`;
    const profile = await kv.get(userKey);

    return c.json(profile);

  } catch (error) {
    console.error('خطأ في البحث عن المستخدم:', error);
    return c.json({ error: 'فشل في البحث عن المستخدم' }, 500);
  }
});

// جلب إحصائيات المستخدمين
app.get('/make-server-14712447/user-stats', async (c) => {
  try {
    console.log('جلب إحصائيات المستخدمين');

    // جلب جميع ملفات المستخدمين
    const userProfiles = await kv.getByPrefix('user_profile:');
    
    const stats = {
      totalUsers: userProfiles.length,
      disabilityTypes: {
        none: 0,
        visual: 0,
        auditory: 0,
        motor: 0,
        cognitive: 0
      },
      languages: {
        ar: 0,
        en: 0
      }
    };

    userProfiles.forEach(profile => {
      if (profile.disabilityType) {
        stats.disabilityTypes[profile.disabilityType]++;
      }
      if (profile.preferences?.language) {
        stats.languages[profile.preferences.language]++;
      }
    });

    return c.json(stats);

  } catch (error) {
    console.error('خطأ في جلب الإحصائيات:', error);
    return c.json({ error: 'فشل في جلب الإحصائيات' }, 500);
  }
});

// صفحة الصحة
app.get('/make-server-14712447/health', (c) => {
  return c.json({ 
    status: 'ok', 
    message: 'خادم وصلة يعمل بشكل طبيعي',
    timestamp: new Date().toISOString()
  });
});

console.log('بدء تشغيل خادم وصلة...');
Deno.serve(app.fetch);