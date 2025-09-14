// تكوين لغة الإشارة والأفتار ثلاثي الأبعاد
// Sign Language Configuration and 3D Avatar Setup

export interface SignLanguageConfig {
  enabled: boolean;
  language: 'asl' | 'arabic-sign' | 'international';
  avatarType: 'robot' | 'human' | 'cartoon';
  animationSpeed: number; // 0.5 to 2.0
  avatarSize: 'small' | 'medium' | 'large';
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  autoShow: boolean; // Show automatically for hearing impaired users
}

export interface SignGesture {
  id: string;
  arabicText: string;
  englishText: string;
  gestureSequence: AvatarAnimation[];
  duration: number; // in milliseconds
  complexity: 'basic' | 'intermediate' | 'advanced';
}

export interface AvatarAnimation {
  timestamp: number; // milliseconds from start
  bodyPart: 'rightHand' | 'leftHand' | 'face' | 'body';
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  gesture: string; // gesture name/id
}

// الإعدادات الافتراضية لنظام لغة الإشارة
export const defaultSignLanguageConfig: SignLanguageConfig = {
  enabled: false,
  language: 'arabic-sign',
  avatarType: 'robot',
  animationSpeed: 1.0,
  avatarSize: 'medium',
  position: 'bottom-right',
  autoShow: false
};

// قاموس الإشارات العربية الأساسية
export const arabicSignGestures: SignGesture[] = [
  {
    id: 'welcome',
    arabicText: 'مرحباً',
    englishText: 'Welcome',
    gestureSequence: [
      {
        timestamp: 0,
        bodyPart: 'rightHand',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        gesture: 'wave'
      },
      {
        timestamp: 500,
        bodyPart: 'face',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        gesture: 'smile'
      }
    ],
    duration: 1000,
    complexity: 'basic'
  },
  {
    id: 'thank_you',
    arabicText: 'شكراً',
    englishText: 'Thank you',
    gestureSequence: [
      {
        timestamp: 0,
        bodyPart: 'rightHand',
        position: { x: 0, y: 0.2, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        gesture: 'flat_hand_to_mouth'
      },
      {
        timestamp: 300,
        bodyPart: 'rightHand',
        position: { x: 0.2, y: 0.1, z: 0.1 },
        rotation: { x: 10, y: 0, z: 0 },
        gesture: 'hand_forward'
      }
    ],
    duration: 800,
    complexity: 'basic'
  },
  {
    id: 'help',
    arabicText: 'مساعدة',
    englishText: 'Help',
    gestureSequence: [
      {
        timestamp: 0,
        bodyPart: 'leftHand',
        position: { x: -0.1, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        gesture: 'fist'
      },
      {
        timestamp: 200,
        bodyPart: 'rightHand',
        position: { x: 0.1, y: 0.1, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        gesture: 'support_under'
      }
    ],
    duration: 1000,
    complexity: 'intermediate'
  },
  {
    id: 'good',
    arabicText: 'جيد',
    englishText: 'Good',
    gestureSequence: [
      {
        timestamp: 0,
        bodyPart: 'rightHand',
        position: { x: 0, y: 0.1, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        gesture: 'thumbs_up'
      }
    ],
    duration: 600,
    complexity: 'basic'
  },
  {
    id: 'accessibility',
    arabicText: 'إمكانية الوصول',
    englishText: 'Accessibility',
    gestureSequence: [
      {
        timestamp: 0,
        bodyPart: 'rightHand',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        gesture: 'letter_a'
      },
      {
        timestamp: 400,
        bodyPart: 'rightHand',
        position: { x: 0.1, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        gesture: 'open_hands'
      }
    ],
    duration: 1200,
    complexity: 'advanced'
  }
];

// الكلمات الشائعة في التطبيق
export const commonAppPhrases: SignGesture[] = [
  {
    id: 'waslah_welcome',
    arabicText: 'مرحباً بك في وصلة',
    englishText: 'Welcome to Waslah',
    gestureSequence: [
      {
        timestamp: 0,
        bodyPart: 'rightHand',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        gesture: 'wave'
      },
      {
        timestamp: 800,
        bodyPart: 'leftHand',
        position: { x: -0.1, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        gesture: 'letter_w'
      },
      {
        timestamp: 1200,
        bodyPart: 'face',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        gesture: 'smile'
      }
    ],
    duration: 2000,
    complexity: 'intermediate'
  },
  {
    id: 'app_description',
    arabicText: 'منصتك الشاملة لذوي الاحتياجات الخاصة',
    englishText: 'Your comprehensive platform for people with special needs',
    gestureSequence: [
      {
        timestamp: 0,
        bodyPart: 'rightHand',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        gesture: 'platform_gesture'
      },
      {
        timestamp: 1000,
        bodyPart: 'leftHand',
        position: { x: -0.2, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        gesture: 'inclusive_circle'
      },
      {
        timestamp: 2000,
        bodyPart: 'body',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        gesture: 'caring_gesture'
      }
    ],
    duration: 3500,
    complexity: 'advanced'
  }
];

// تكوين الروبوت الافتار
export const robotAvatarConfig = {
  // الألوان
  colors: {
    primary: '#2563eb', // أزرق
    secondary: '#16a34a', // أخضر
    accent: '#9333ea', // بنفسجي
    metal: '#64748b', // رمادي معدني
    light: '#ffffff',
    glow: '#60a5fa'
  },
  
  // أبعاد الروبوت
  dimensions: {
    head: { width: 1, height: 1, depth: 0.8 },
    body: { width: 1.2, height: 1.8, depth: 0.6 },
    arms: { length: 1.5, width: 0.3 },
    hands: { size: 0.4 },
    legs: { length: 1.8, width: 0.4 }
  },
  
  // إعدادات الإضاءة
  lighting: {
    ambient: { intensity: 0.4, color: '#ffffff' },
    directional: { intensity: 0.6, color: '#ffffff', position: [2, 2, 2] },
    point: { intensity: 0.8, color: '#60a5fa', position: [0, 2, 1] }
  },
  
  // إعدادات الرسوم المتحركة
  animations: {
    idle: {
      duration: 3000,
      movements: ['gentle_breathing', 'eye_blink', 'subtle_head_movement']
    },
    speaking: {
      duration: 1000,
      movements: ['mouth_movement', 'eye_animation', 'slight_gestures']
    },
    greeting: {
      duration: 2000,
      movements: ['wave_hand', 'nod_head', 'smile_led']
    }
  }
};

// إعدادات جودة العرض
export const renderQuality = {
  low: {
    resolution: { width: 200, height: 300 },
    polygons: 'low',
    shadows: false,
    reflections: false
  },
  medium: {
    resolution: { width: 400, height: 600 },
    polygons: 'medium',
    shadows: true,
    reflections: false
  },
  high: {
    resolution: { width: 600, height: 900 },
    polygons: 'high',
    shadows: true,
    reflections: true
  }
};

// مدير إعدادات لغة الإشارة
export class SignLanguageConfigManager {
  private static STORAGE_KEY = 'waslah_sign_language_config';

  static saveConfig(config: Partial<SignLanguageConfig>): boolean {
    try {
      if (typeof localStorage === 'undefined') {
        return false;
      }

      const currentConfig = this.loadConfig();
      const updatedConfig = { ...currentConfig, ...config };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedConfig));
      return true;
    } catch (error) {
      console.error('Error saving sign language config:', error);
      return false;
    }
  }

  static loadConfig(): SignLanguageConfig {
    try {
      if (typeof localStorage === 'undefined') {
        return defaultSignLanguageConfig;
      }

      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultSignLanguageConfig, ...parsed };
      }
    } catch (error) {
      console.error('Error loading sign language config:', error);
    }
    return defaultSignLanguageConfig;
  }

  static resetConfig(): boolean {
    try {
      if (typeof localStorage === 'undefined') {
        return false;
      }
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error resetting sign language config:', error);
      return false;
    }
  }

  static isSignLanguageEnabled(): boolean {
    try {
      const config = this.loadConfig();
      return config.enabled;
    } catch {
      return false;
    }
  }

  static shouldAutoShow(disabilityType: string): boolean {
    try {
      const config = this.loadConfig();
      return config.autoShow && (disabilityType === 'auditory' || disabilityType === 'hearing');
    } catch {
      return false;
    }
  }
}

export default {
  defaultSignLanguageConfig,
  arabicSignGestures,
  commonAppPhrases,
  robotAvatarConfig,
  renderQuality,
  SignLanguageConfigManager
};