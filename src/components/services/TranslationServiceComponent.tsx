import React, { useState, useEffect } from 'react';
import { Languages, Volume2, Copy, Download, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { QuickTTS } from './TTSService';
import { useTranslation } from './TranslationService';
import { APIConfigManager } from '../../config/apiConfig';

interface TranslationServiceComponentProps {
  text: string;
  sourceLang?: string;
  targetLang?: string;
  showSignLanguage?: boolean;
  onTranslation?: (translatedText: string, targetLang: string) => void;
  className?: string;
}

export function TranslationService({
  text,
  sourceLang = 'ar',
  targetLang = 'en',
  showSignLanguage = false,
  onTranslation,
  className = ""
}: TranslationServiceComponentProps) {
  const { t, language } = useTranslation();
  const [translatedText, setTranslatedText] = useState('');
  const [selectedSourceLang, setSelectedSourceLang] = useState(sourceLang);
  const [selectedTargetLang, setSelectedTargetLang] = useState(targetLang);
  const [isTranslating, setIsTranslating] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState('');

  const hasAzureKey = APIConfigManager.hasValidAzureKeys();

  const supportedLanguages = [
    { code: 'ar', name: language === 'ar' ? 'العربية' : 'Arabic', nativeName: 'العربية' },
    { code: 'en', name: language === 'ar' ? 'الإنجليزية' : 'English', nativeName: 'English' },
    { code: 'es', name: language === 'ar' ? 'الإسبانية' : 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: language === 'ar' ? 'الفرنسية' : 'French', nativeName: 'Français' },
    { code: 'de', name: language === 'ar' ? 'الألمانية' : 'German', nativeName: 'Deutsch' },
    { code: 'it', name: language === 'ar' ? 'الإيطالية' : 'Italian', nativeName: 'Italiano' },
    { code: 'ru', name: language === 'ar' ? 'الروسية' : 'Russian', nativeName: 'Русский' },
    { code: 'zh', name: language === 'ar' ? 'الصينية' : 'Chinese', nativeName: '中文' },
    { code: 'ja', name: language === 'ar' ? 'اليابانية' : 'Japanese', nativeName: '日本語' },
    { code: 'ko', name: language === 'ar' ? 'الكورية' : 'Korean', nativeName: '한국어' }
  ];

  // Mock translations for demonstration
  const mockTranslations: { [key: string]: { [key: string]: string } } = {
    'ar': {
      'en': 'This is a mock translation from Arabic to English. In a real application, this would use Azure Translator or Google Translate API.',
      'es': 'Esta es una traducción simulada del árabe al español. En una aplicación real, esto usaría Azure Translator o Google Translate API.',
      'fr': 'Ceci est une traduction simulée de l\'arabe vers le français. Dans une vraie application, cela utiliserait Azure Translator ou l\'API Google Translate.'
    },
    'en': {
      'ar': 'هذه ترجمة محاكية من الإنجليزية إلى العربية. في التطبيق الحقيقي، سيتم استخدام Azure Translator أو Google Translate API.',
      'es': 'Esta es una traducción simulada del inglés al español.',
      'fr': 'Ceci est une traduction simulée de l\'anglais vers le français.'
    }
  };

  useEffect(() => {
    if (text && text.trim()) {
      handleTranslate();
    }
  }, [text, selectedSourceLang, selectedTargetLang]);

  const handleTranslate = async () => {
    if (!text.trim() || selectedSourceLang === selectedTargetLang) {
      setTranslatedText('');
      return;
    }

    setIsTranslating(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (hasAzureKey) {
        // في التطبيق الحقيقي، استدعاء Azure Translator API
        const mockResult = mockTranslations[selectedSourceLang]?.[selectedTargetLang] || 
                          `Translated: ${text} (${selectedSourceLang} → ${selectedTargetLang})`;
        
        setTranslatedText(mockResult);
        setConfidence(85 + Math.random() * 10); // Mock confidence score
        
        if (onTranslation) {
          onTranslation(mockResult, selectedTargetLang);
        }
      } else {
        // Fallback translation
        const fallbackResult = `[${language === 'ar' ? 'ترجمة محاكية' : 'Mock Translation'}] ${text}`;
        setTranslatedText(fallbackResult);
        setConfidence(70);
        
        if (onTranslation) {
          onTranslation(fallbackResult, selectedTargetLang);
        }
      }
    } catch (err) {
      setError(language === 'ar' ? 'خطأ في الترجمة' : 'Translation error');
      setTranslatedText('');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopyText = async () => {
    if (translatedText) {
      try {
        await navigator.clipboard.writeText(translatedText);
        // يمكن إضافة toast notification هنا
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };

  const swapLanguages = () => {
    const newSource = selectedTargetLang;
    const newTarget = selectedSourceLang;
    setSelectedSourceLang(newSource);
    setSelectedTargetLang(newTarget);
  };

  const getLanguageName = (code: string) => {
    const lang = supportedLanguages.find(l => l.code === code);
    return lang ? lang.name : code;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-reverse space-x-2">
          <Languages className="w-5 h-5" />
          <span>{language === 'ar' ? 'خدمة الترجمة' : 'Translation Service'}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!hasAzureKey && (
          <Alert>
            <Languages className="w-4 h-4" />
            <AlertDescription>
              {language === 'ar' 
                ? 'للحصول على ترجمة محسنة، يرجى إضافة مفتاح Azure Translator في الإعدادات'
                : 'For enhanced translation, please add Azure Translator key in settings'
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Language Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {language === 'ar' ? 'من' : 'From'}
            </label>
            <Select value={selectedSourceLang} onValueChange={setSelectedSourceLang}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {supportedLanguages.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center space-x-reverse space-x-2">
                      <span>{lang.name}</span>
                      <span className="text-xs text-muted-foreground">({lang.nativeName})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={swapLanguages}
              className="w-12 h-12 rounded-full"
              aria-label={language === 'ar' ? 'تبديل اللغات' : 'Swap languages'}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {language === 'ar' ? 'إلى' : 'To'}
            </label>
            <Select value={selectedTargetLang} onValueChange={setSelectedTargetLang}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {supportedLanguages.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center space-x-reverse space-x-2">
                      <span>{lang.name}</span>
                      <span className="text-xs text-muted-foreground">({lang.nativeName})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Original Text */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              {language === 'ar' ? 'النص الأصلي' : 'Original Text'}
            </label>
            <Badge variant="outline" className="text-xs">
              {getLanguageName(selectedSourceLang)}
            </Badge>
          </div>
          <Textarea
            value={text}
            readOnly
            className="min-h-24 resize-none"
            placeholder={language === 'ar' ? 'النص المراد ترجمته...' : 'Text to translate...'}
          />
        </div>

        {/* Translated Text */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              {language === 'ar' ? 'النص المترجم' : 'Translated Text'}
            </label>
            <div className="flex items-center space-x-reverse space-x-2">
              {confidence > 0 && (
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    confidence >= 90 ? 'border-green-500 text-green-700' :
                    confidence >= 75 ? 'border-blue-500 text-blue-700' :
                    'border-yellow-500 text-yellow-700'
                  }`}
                >
                  {Math.round(confidence)}%
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {getLanguageName(selectedTargetLang)}
              </Badge>
            </div>
          </div>
          
          <div className="relative">
            <Textarea
              value={isTranslating ? (language === 'ar' ? 'جاري الترجمة...' : 'Translating...') : translatedText}
              readOnly
              className="min-h-24 resize-none pr-20"
              placeholder={language === 'ar' ? 'النص المترجم...' : 'Translated text...'}
            />
            
            {translatedText && (
              <div className="absolute top-2 left-2 flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyText}
                  className="h-8 w-8 p-0"
                  aria-label={language === 'ar' ? 'نسخ النص' : 'Copy text'}
                >
                  <Copy className="w-3 h-3" />
                </Button>
                
                <QuickTTS 
                  text={translatedText}
                  className="h-8 w-8 p-0"
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-reverse space-x-3">
          <Button
            onClick={handleTranslate}
            disabled={!text.trim() || isTranslating || selectedSourceLang === selectedTargetLang}
            className="flex-1"
          >
            {isTranslating ? (
              <>
                <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                {language === 'ar' ? 'جاري الترجمة...' : 'Translating...'}
              </>
            ) : (
              <>
                <Languages className="w-4 h-4 ml-2" />
                {language === 'ar' ? 'ترجم' : 'Translate'}
              </>
            )}
          </Button>
        </div>

        {/* Sign Language Section */}
        {showSignLanguage && translatedText && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium mb-3 flex items-center space-x-reverse space-x-2">
              <span>🤟</span>
              <span>{language === 'ar' ? 'ترجمة لغة الإشارة' : 'Sign Language Translation'}</span>
            </h4>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {language === 'ar' 
                  ? 'تقنية الذكاء الاصطناعي لتحويل النص المترجم إلى لغة الإشارة (قيد التطوير)'
                  : 'AI technology for converting translated text to sign language (in development)'
                }
              </p>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border-2 border-dashed border-blue-300 dark:border-blue-700">
                <p className="text-center text-sm text-muted-foreground">
                  {language === 'ar' 
                    ? '🎥 سيتم عرض فيديو لغة الإشارة هنا'
                    : '🎥 Sign language video will be displayed here'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Translation Stats */}
        {translatedText && (
          <div className="pt-4 border-t text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>
                {language === 'ar' 
                  ? `الأصلي: ${text.length} حرف`
                  : `Original: ${text.length} chars`
                }
              </span>
              <span>
                {language === 'ar' 
                  ? `المترجم: ${translatedText.length} حرف`
                  : `Translated: ${translatedText.length} chars`
                }
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}