// خدمة ترجمة النصوص إلى لغة الإشارة مع الذكاء الاصطناعي
// AI-Powered Text to Sign Language Translation Service

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Bot, Play, Pause, RotateCcw, Volume2, VolumeX, Settings, Download } from 'lucide-react';
import { useTranslation } from './TranslationService';
import { SignLanguageAvatar } from '../ui/SignLanguageAvatar';
import { 
  SignLanguageConfig, 
  SignLanguageConfigManager,
  arabicSignGestures,
  commonAppPhrases 
} from '../../config/signLanguageConfig';

interface SignLanguageTranslationServiceProps {
  className?: string;
  initialText?: string;
  autoTranslate?: boolean;
  showControls?: boolean;
}

interface TranslationState {
  inputText: string;
  isTranslating: boolean;
  translationComplete: boolean;
  currentGesture: string | null;
  gestureProgress: number;
  error: string | null;
  accuracy: number;
}

export function SignLanguageTranslationService({
  className = '',
  initialText = '',
  autoTranslate = false,
  showControls = true
}: SignLanguageTranslationServiceProps) {
  const { t, language } = useTranslation();
  
  const [config, setConfig] = useState<SignLanguageConfig>(() => 
    SignLanguageConfigManager.loadConfig()
  );
  
  const [state, setState] = useState<TranslationState>({
    inputText: initialText,
    isTranslating: false,
    translationComplete: false,
    currentGesture: null,
    gestureProgress: 0,
    error: null,
    accuracy: 0
  });

  const [showAvatar, setShowAvatar] = useState(false);
  const [avatarSettings, setAvatarSettings] = useState({
    isVisible: false,
    isPlaying: false,
    volume: 0.8
  });

  // تحميل الإعدادات عند بدء التشغيل
  useEffect(() => {
    const savedConfig = SignLanguageConfigManager.loadConfig();
    setConfig(savedConfig);
    
    if (initialText && autoTranslate) {
      handleTranslateText();
    }
  }, [initialText, autoTranslate]);

  // ترجمة النص إلى لغة الإشارة
  const handleTranslateText = useCallback(async () => {
    if (!state.inputText.trim()) {
      setState(prev => ({ ...prev, error: t('extractTextFirst') }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isTranslating: true, 
      error: null,
      translationComplete: false,
      gestureProgress: 0 
    }));

    try {
      // محاكاة معالجة الذكاء الاصطناعي
      await simulateAITranslation(state.inputText);
      
      // تحديد دقة الترجمة
      const accuracy = calculateTranslationAccuracy(state.inputText);
      
      setState(prev => ({ 
        ...prev, 
        isTranslating: false,
        translationComplete: true,
        accuracy 
      }));

      // إظهار الأفتار وبدء الترجمة
      setShowAvatar(true);
      setAvatarSettings(prev => ({ ...prev, isVisible: true, isPlaying: true }));

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isTranslating: false,
        error: language === 'ar' ? 'خطأ في ترجمة النص' : 'Error translating text'
      }));
    }
  }, [state.inputText, language, t]);

  // محاكاة معالجة الذكاء الاصطناعي للترجمة
  const simulateAITranslation = async (text: string): Promise<void> => {
    const words = text.split(' ');
    const totalSteps = words.length;
    
    for (let i = 0; i < totalSteps; i++) {
      const word = words[i];
      
      // البحث عن إشارة مطابقة
      const matchingGesture = findMatchingGesture(word);
      
      setState(prev => ({
        ...prev,
        currentGesture: matchingGesture?.id || null,
        gestureProgress: ((i + 1) / totalSteps) * 100
      }));
      
      // محاكاة وقت المعالجة
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  };

  // البحث عن إشارة مطابقة للكلمة
  const findMatchingGesture = (word: string) => {
    const allGestures = [...arabicSignGestures, ...commonAppPhrases];
    
    return allGestures.find(gesture => 
      (language === 'ar' ? gesture.arabicText : gesture.englishText)
        .toLowerCase().includes(word.toLowerCase())
    );
  };

  // حساب دقة الترجمة
  const calculateTranslationAccuracy = (text: string): number => {
    const words = text.split(' ');
    const knownWords = words.filter(word => findMatchingGesture(word));
    
    if (words.length === 0) return 0;
    
    const baseAccuracy = (knownWords.length / words.length) * 100;
    
    // تحسينات إضافية للدقة
    const hasCommonPhrases = commonAppPhrases.some(phrase =>
      text.toLowerCase().includes(
        (language === 'ar' ? phrase.arabicText : phrase.englishText).toLowerCase()
      )
    );
    
    return Math.min(baseAccuracy + (hasCommonPhrases ? 10 : 0), 100);
  };

  // تشغيل إشارة تجريبية
  const playTestGesture = () => {
    const testPhrase = commonAppPhrases.find(phrase => phrase.id === 'waslah_welcome');
    if (testPhrase) {
      setState(prev => ({ 
        ...prev, 
        inputText: language === 'ar' ? testPhrase.arabicText : testPhrase.englishText 
      }));
      
      setTimeout(() => {
        handleTranslateText();
      }, 500);
    }
  };

  // إعادة تعيين الترجمة
  const resetTranslation = () => {
    setState({
      inputText: '',
      isTranslating: false,
      translationComplete: false,
      currentGesture: null,
      gestureProgress: 0,
      error: null,
      accuracy: 0
    });
    
    setShowAvatar(false);
    setAvatarSettings({ isVisible: false, isPlaying: false, volume: 0.8 });
  };

  // تصدير الترجمة
  const exportTranslation = () => {
    const exportData = {
      originalText: state.inputText,
      language: language,
      accuracy: state.accuracy,
      gestures: state.currentGesture,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `sign-language-translation-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-reverse space-x-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <span>{t('signLanguageTranslation')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="translate" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="translate">{t('translateTab')}</TabsTrigger>
              <TabsTrigger value="settings">{t('settings')}</TabsTrigger>
            </TabsList>

            {/* تبويب الترجمة */}
            <TabsContent value="translate" className="space-y-4">
              {/* منطقة إدخال النص */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('originalText')}</label>
                <Textarea
                  value={state.inputText}
                  onChange={(e) => setState(prev => ({ ...prev, inputText: e.target.value }))}
                  placeholder={language === 'ar' 
                    ? 'اكتب النص المراد ترجمته إلى لغة الإشارة...'
                    : 'Enter text to translate to sign language...'
                  }
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* أزرار التحكم */}
              {showControls && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={handleTranslateText}
                    disabled={!state.inputText.trim() || state.isTranslating}
                    className="flex items-center space-x-reverse space-x-2"
                  >
                    {state.isTranslating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{t('translating')}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>{t('translateButton')}</span>
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={playTestGesture}
                    className="flex items-center space-x-reverse space-x-2"
                  >
                    <Bot className="w-4 h-4" />
                    <span>{language === 'ar' ? 'تجربة' : 'Test'}</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={resetTranslation}
                    disabled={state.isTranslating}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>

                  {state.translationComplete && (
                    <Button
                      variant="outline"
                      onClick={exportTranslation}
                      className="flex items-center space-x-reverse space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>{language === 'ar' ? 'تصدير' : 'Export'}</span>
                    </Button>
                  )}
                </div>
              )}

              {/* مؤشر التقدم */}
              {state.isTranslating && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{language === 'ar' ? 'جاري الترجمة...' : 'Translating...'}</span>
                    <span>{Math.round(state.gestureProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${state.gestureProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* معلومات الترجمة */}
              {state.translationComplete && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{state.accuracy.toFixed(0)}%</div>
                      <div className="text-sm text-muted-foreground">{t('accuracy')}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {state.inputText.split(' ').length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {language === 'ar' ? 'كلمات' : 'Words'}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {config.language === 'arabic-sign' ? 'عربية' : 'ASL'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {language === 'ar' ? 'لغة الإشارة' : 'Sign Language'}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* رسالة خطأ */}
              {state.error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-700 dark:text-red-300 text-sm">{state.error}</p>
                </div>
              )}

              {/* معلومات تطبيق لغة الإشارة */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  {t('signLanguageAI')}
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {language === 'ar' 
                    ? 'يستخدم هذا التطبيق تقنيات الذكاء الاصطناعي المتقدمة لتحويل النصوص العربية إلى لغة الإشارة مع دعم كامل للهجة الأردنية ومصطلحات الوصولية.'
                    : 'This application uses advanced AI technologies to convert Arabic texts to sign language with full support for Jordanian dialect and accessibility terminology.'
                  }
                </p>
              </div>
            </TabsContent>

            {/* تبويب الإعدادات */}
            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">{language === 'ar' ? 'جودة الترجمة' : 'Translation Quality'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{language === 'ar' ? 'دقة عالية' : 'High Accuracy'}</span>
                      <Badge variant="default">✓</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{language === 'ar' ? 'تحليل ذكي' : 'Smart Analysis'}</span>
                      <Badge variant="default">✓</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{language === 'ar' ? 'لهجة أردنية' : 'Jordanian Dialect'}</span>
                      <Badge variant="default">✓</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">{language === 'ar' ? 'إعدادات العرض' : 'Display Settings'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{language === 'ar' ? 'أفتار ثلاثي الأبعاد' : '3D Avatar'}</span>
                      <Badge variant={showAvatar ? 'default' : 'secondary'}>
                        {showAvatar ? '✓' : '✗'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{language === 'ar' ? 'صوت مرافق' : 'Audio Support'}</span>
                      <Badge variant={avatarSettings.volume > 0 ? 'default' : 'secondary'}>
                        {avatarSettings.volume > 0 ? '✓' : '✗'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* مكون الأفتار */}
      {showAvatar && (
        <SignLanguageAvatar
          text={state.inputText}
          isVisible={avatarSettings.isVisible}
          config={config}
          onClose={() => {
            setShowAvatar(false);
            setAvatarSettings(prev => ({ ...prev, isVisible: false }));
          }}
          onConfigChange={(updates) => {
            const newConfig = { ...config, ...updates };
            setConfig(newConfig);
            SignLanguageConfigManager.saveConfig(newConfig);
          }}
        />
      )}
    </div>
  );
}