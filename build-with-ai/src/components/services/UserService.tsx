import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

// إنشاء عميل Supabase
const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  disabilityType: 'none' | 'visual' | 'auditory' | 'motor' | 'cognitive';
  preferences: {
    language: string;
    adaptiveInterface: boolean;
    highContrast?: boolean;
    largeFonts?: boolean;
    audioDescriptions?: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

export class UserService {
  // تسجيل مستخدم جديد
  static async signUp(userData: {
    email: string;
    password: string;
    name: string;
    disabilityType: string;
    language: string;
  }): Promise<{ user: any; profile: UserProfile | null; error: any }> {
    try {
      // إرسال طلب تسجيل إلى الخادم
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-14712447/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(userData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to sign up');
      }

      // إنشاء ملف المستخدم
      const profile: UserProfile = {
        id: result.user.id,
        name: userData.name,
        email: userData.email,
        disabilityType: userData.disabilityType as any,
        preferences: {
          language: userData.language,
          adaptiveInterface: userData.disabilityType !== 'none',
          highContrast: userData.disabilityType === 'visual',
          largeFonts: userData.disabilityType === 'visual' || userData.disabilityType === 'cognitive',
          audioDescriptions: userData.disabilityType === 'visual'
        }
      };

      // حفظ ملف المستخدم في قاعدة البيانات
      await this.saveUserProfile(profile);

      return { user: result.user, profile, error: null };
    } catch (error) {
      console.error('خطأ في تسجيل المستخدم:', error);
      return { user: null, profile: null, error };
    }
  }

  // تسجيل دخول المستخدم
  static async signIn(email: string, password: string): Promise<{ user: any; profile: UserProfile | null; error: any }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      // جلب ملف المستخدم
      const profile = await this.getUserProfile(data.user.id);

      return { user: data.user, profile, error: null };
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error);
      return { user: null, profile: null, error };
    }
  }

  // تسجيل خروج المستخدم
  static async signOut(): Promise<{ error: any }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
      return { error };
    }
  }

  // جلب الجلسة الحالية
  static async getCurrentSession(): Promise<{ user: any; profile: UserProfile | null; error: any }> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return { user: null, profile: null, error };
      }

      const profile = await this.getUserProfile(session.user.id);
      return { user: session.user, profile, error: null };
    } catch (error) {
      console.error('خطأ في جلب الجلسة:', error);
      return { user: null, profile: null, error };
    }
  }

  // حفظ ملف المستخدم
  static async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-14712447/user-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(profile)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'فشل في حفظ بيانات المستخدم');
      }
    } catch (error) {
      console.error('خطأ في حفظ ملف المستخدم:', error);
      throw error;
    }
  }

  // جلب ملف المستخدم
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-14712447/user-profile/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (!response.ok) {
        return null;
      }

      const profile = await response.json();
      return profile;
    } catch (error) {
      console.error('خطأ في جلب ملف المستخدم:', error);
      return null;
    }
  }

  // تحديث ملف المستخدم
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-14712447/user-profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'فشل في تحديث بيانات المستخدم');
      }
    } catch (error) {
      console.error('خطأ في تحديث ملف المستخدم:', error);
      throw error;
    }
  }
}

// خدمة لتكييف الواجهة حسب نوع الإعاقة
export class AccessibilityAdapter {
  static getAdaptationSettings(disabilityType: string, language: string) {
    const settings = {
      showVisualElements: true,
      showAudioElements: true,
      showTextElements: true,
      useHighContrast: false,
      useLargeFonts: false,
      enableScreenReader: false,
      simplifyInterface: false,
      autoPlayAudio: false,
      showDescriptions: true
    };

    switch (disabilityType) {
      case 'visual':
        return {
          ...settings,
          showVisualElements: false,
          enableScreenReader: true,
          autoPlayAudio: true,
          useHighContrast: true,
          useLargeFonts: true,
          showDescriptions: true
        };

      case 'auditory':
        return {
          ...settings,
          showAudioElements: false,
          showTextElements: true,
          showDescriptions: true
        };

      case 'cognitive':
        return {
          ...settings,
          simplifyInterface: true,
          useLargeFonts: true,
          showDescriptions: true,
          autoPlayAudio: false
        };

      case 'motor':
        return {
          ...settings,
          // إعدادات خاصة بالإعاقة الحركية يمكن إضافتها لاحقاً
        };

      default:
        return settings;
    }
  }

  static applyStyles(disabilityType: string) {
    const body = document.body;
    
    // إزالة الفئات السابقة
    body.classList.remove('visual-impairment', 'auditory-impairment', 'cognitive-impairment', 'motor-impairment');
    
    switch (disabilityType) {
      case 'visual':
        body.classList.add('visual-impairment');
        break;
      case 'auditory':
        body.classList.add('auditory-impairment');
        break;
      case 'cognitive':
        body.classList.add('cognitive-impairment');
        break;
      case 'motor':
        body.classList.add('motor-impairment');
        break;
    }
  }
}