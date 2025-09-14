// خدمة لغة الإشارة الرئيسية - معالجة النصوص وتحويلها إلى إشارات
// Main Sign Language Service - Text Processing and Gesture Conversion

import React, { useState, useEffect, useCallback } from 'react';
import { RobotAvatar } from '../ui/RobotAvatar';
import { useTranslation } from './TranslationService';
import { 
  SignLanguageConfig,
  SignLanguageConfigManager,
  arabicSignGestures,
  commonAppPhrases,
  SignGesture,
  AvatarAnimation,
  defaultSignLanguageConfig
} from '../../config/signLanguageConfig';

interface SignLanguageServiceProps {
  text?: string;
  isVisible?: boolean;
  disabilityType?: string;
  onTranslationComplete?: () => void;
  className?: string;
}

interface SignLanguageState {
  isEnabled: boolean;
  isTranslating: boolean;
  currentGesture: string | null;
  gestureQueue: SignGesture[];
  animationSequence: AvatarAnimation[];
  error: string | null;
}

export function SignLanguageService({
  text = '',
  isVisible = false,
  disabilityType = 'none',
  onTranslationComplete,
  className = ''
}: SignLanguageServiceProps) {
  const { t, language } = useTranslation();
  
  const [config, setConfig] = useState<SignLanguageConfig>(defaultSignLanguageConfig);
  const [state, setState] = useState<SignLanguageState>({
    isEnabled: false,
    isTranslating: false,
    currentGesture: null,
    gestureQueue: [],
    animationSequence: [],
    error: null
  });

  // تحميل إعدادات لغة الإشارة
  useEffect(() => {
    const loadedConfig = SignLanguageConfigManager.loadConfig();
    setConfig(loadedConfig);
    
    // تفعيل تلقائي لذوي الإعاقة السمعية
    const shouldAutoEnable = SignLanguageConfigManager.shouldAutoShow(disabilityType);
    if (shouldAutoEnable || loadedConfig.enabled) {
      setState(prev => ({ ...prev, isEnabled: true }));
    }
  }, [disabilityType]);

  // معالجة النص الجديد
  useEffect(() => {
    if (text && state.isEnabled && !state.isTranslating) {
      translateTextToSignLanguage(text);
    }
  }, [text, state.isEnabled]);

  // تحليل النص وتحويله إلى إشارات
  const translateTextToSignLanguage = useCallback(async (inputText: string) => {
    if (!inputText.trim()) return;

    setState(prev => ({ ...prev, isTranslating: true, error: null }));

    try {
      const gestures = await processTextToGestures(inputText);
      
      if (gestures.length > 0) {
        setState(prev => ({
          ...prev,
          gestureQueue: gestures,
          animationSequence: combineGestureAnimations(gestures)
        }));
        
        // بدء تشغيل الإشارات
        await playGestureSequence(gestures);
      } else {
        setState(prev => ({
          ...prev,
          error: language === 'ar' ? 'لا توجد إشارات متاحة لهذا النص' : 'No gestures available for this text'
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: language === 'ar' ? 'خطأ في ترجمة النص' : 'Error translating text'
      }));
    } finally {
      setState(prev => ({ ...prev, isTranslating: false }));
    }
  }, [language]);

  // معالجة النص وتحويله إلى قائمة إشارات
  const processTextToGestures = async (inputText: string): Promise<SignGesture[]> => {
    const words = inputText.toLowerCase().trim().split(/\s+/);
    const gestures: SignGesture[] = [];
    
    // البحث في العبارات الشائعة أولاً
    const commonPhrase = commonAppPhrases.find(phrase => 
      (language === 'ar' ? phrase.arabicText : phrase.englishText)
        .toLowerCase().includes(inputText.toLowerCase())
    );
    
    if (commonPhrase) {
      gestures.push(commonPhrase);
      return gestures;
    }

    // البحث عن الكلمات المفردة
    for (const word of words) {
      const matchingGesture = arabicSignGestures.find(gesture => 
        (language === 'ar' ? gesture.arabicText : gesture.englishText)
          .toLowerCase().includes(word)
      );
      
      if (matchingGesture) {
        gestures.push(matchingGesture);
      } else {
        // إنشاء إشارة افتراضية للكلمات غير المعروفة
        gestures.push(createDefaultGesture(word));
      }
    }

    return gestures;
  };

  // إنشاء إشارة افتراضية للكلمات غير المعروفة
  const createDefaultGesture = (word: string): SignGesture => {
    return {
      id: `default_${word}`,
      arabicText: word,
      englishText: word,
      gestureSequence: [
        {
          timestamp: 0,
          bodyPart: 'rightHand',
          position: { x: 0, y: 0.1, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          gesture: 'point_forward'
        },
        {
          timestamp: 500,
          bodyPart: 'face',
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          gesture: 'speak'
        }
      ],
      duration: 1000,
      complexity: 'basic'
    };
  };

  // دمج رسوم متحركة متعددة
  const combineGestureAnimations = (gestures: SignGesture[]): AvatarAnimation[] => {
    const combined: AvatarAnimation[] = [];
    let currentTime = 0;

    gestures.forEach((gesture, index) => {
      gesture.gestureSequence.forEach(animation => {
        combined.push({
          ...animation,
          timestamp: currentTime + animation.timestamp
        });
      });
      
      currentTime += gesture.duration + 200; // فاصل زمني بين الإشارات
    });

    return combined;
  };

  // تشغيل تسلسل الإشارات
  const playGestureSequence = async (gestures: SignGesture[]): Promise<void> => {
    for (let i = 0; i < gestures.length; i++) {
      const gesture = gestures[i];
      
      setState(prev => ({ ...prev, currentGesture: gesture.id }));
      
      // انتظار انتهاء الإشارة الحالية
      await new Promise(resolve => 
        setTimeout(resolve, gesture.duration * config.animationSpeed)
      );
      
      // فاصل بين الإشارات
      if (i < gestures.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    setState(prev => ({ ...prev, currentGesture: null }));
    onTranslationComplete?.();
  };

  // تفعيل/إلغاء تفعيل لغة الإشارة
  const toggleSignLanguage = () => {
    const newEnabled = !state.isEnabled;
    setState(prev => ({ ...prev, isEnabled: newEnabled }));
    
    const newConfig = { ...config, enabled: newEnabled };
    setConfig(newConfig);
    SignLanguageConfigManager.saveConfig(newConfig);
  };

  // تحديث إعدادات لغة الإشارة
  const updateConfig = (updates: Partial<SignLanguageConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    SignLanguageConfigManager.saveConfig(newConfig);
  };

  // تشغيل إشارة ترحيبية
  const playWelcomeGesture = () => {
    const welcomePhrase = commonAppPhrases.find(phrase => phrase.id === 'waslah_welcome');
    if (welcomePhrase) {
      setState(prev => ({
        ...prev,
        gestureQueue: [welcomePhrase],
        animationSequence: welcomePhrase.gestureSequence
      }));
    }
  };

  // تشغيل إشارة وصف التطبيق
  const playAppDescriptionGesture = () => {
    const descriptionPhrase = commonAppPhrases.find(phrase => phrase.id === 'app_description');
    if (descriptionPhrase) {
      setState(prev => ({
        ...prev,
        gestureQueue: [descriptionPhrase],
        animationSequence: descriptionPhrase.gestureSequence
      }));
    }
  };

  const shouldShowAvatar = isVisible && state.isEnabled && 
    (state.animationSequence.length > 0 || state.currentGesture);

  return (
    <div className={`sign-language-service ${className}`}>
      {/* الروبوت الافتار */}
      <RobotAvatar
        isVisible={shouldShowAvatar}
        currentGesture={state.currentGesture || ''}
        animationSequence={state.animationSequence}
        config={config}
        quality="medium"
        onAnimationComplete={() => {
          setState(prev => ({ 
            ...prev, 
            animationSequence: [], 
            currentGesture: null 
          }));
        }}
      />

      {/* رسالة خطأ */}
      {state.error && (
        <div className="fixed bottom-20 right-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg p-3 max-w-sm z-40">
          <p className="text-red-700 dark:text-red-300 text-sm">{state.error}</p>
          <button
            onClick={() => setState(prev => ({ ...prev, error: null }))}
            className="mt-2 text-xs text-red-600 dark:text-red-400 hover:underline"
          >
            {t('close')}
          </button>
        </div>
      )}

      {/* مؤشر حالة الترجمة */}
      {state.isTranslating && (
        <div className="fixed bottom-4 right-40 bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 rounded-full px-3 py-1 z-40">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-xs text-blue-700 dark:text-blue-300">
              {language === 'ar' ? 'جاري الترجمة...' : 'Translating...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Hook لاستخدام خدمة لغة الإشارة
export function useSignLanguage() {
  const [config, setConfig] = useState<SignLanguageConfig>(defaultSignLanguageConfig);

  useEffect(() => {
    const loadedConfig = SignLanguageConfigManager.loadConfig();
    setConfig(loadedConfig);
  }, []);

  const updateConfig = (updates: Partial<SignLanguageConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    SignLanguageConfigManager.saveConfig(newConfig);
  };

  const translateText = (text: string) => {
    // يتم استدعاء هذه الدالة لترجمة النص
    // التنفيذ الفعلي يتم في مكون SignLanguageService
    return Promise.resolve();
  };

  return {
    config,
    updateConfig,
    translateText,
    isEnabled: config.enabled
  };
}

export default SignLanguageService;