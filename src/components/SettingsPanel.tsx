import React, { useState } from 'react';
import { X, Settings, Volume2, Eye, Hand, Brain, Sun, Moon, Type, Minus, Plus, Globe, Bot } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { QuickTTS } from './services/TTSService';
import { useTranslation } from './services/TranslationService';
import { SignLanguageConfigManager, defaultSignLanguageConfig, SignLanguageConfig } from '../config/signLanguageConfig';
import { useSignLanguage } from './services/SignLanguageService';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  isSimpleMode: boolean;
  setIsSimpleMode: (value: boolean) => void;
  fontSize: number;
  setFontSize: (value: number) => void;
  disabilityType: string;
  setDisabilityType: (value: string) => void;
}

export function SettingsPanel({
  isOpen,
  onClose,
  isDarkMode,
  setIsDarkMode,
  isSimpleMode,
  setIsSimpleMode,
  fontSize,
  setFontSize,
  disabilityType,
  setDisabilityType
}: SettingsPanelProps) {
  const { t, language, setLanguage } = useTranslation();
  const { config: signConfig, updateConfig: updateSignConfig } = useSignLanguage();

  const disabilityTypes = [
    { value: 'none', label: t('noDisability'), icon: null },
    { value: 'visual', label: t('visualImpairment'), icon: Eye },
    { value: 'auditory', label: t('hearingImpairment'), icon: Volume2 },
    { value: 'motor', label: t('motorImpairment'), icon: Hand },
    { value: 'cognitive', label: t('cognitiveImpairment'), icon: Brain }
  ];

  const handleResetSettings = () => {
    setIsDarkMode(false);
    setIsSimpleMode(false);
    setFontSize(16);
    setDisabilityType('none');
    setLanguage('ar');
    console.log('Settings reset successfully');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <Card 
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle id="settings-title" className="flex items-center space-x-reverse space-x-2">
            <Settings className="w-5 h-5" />
            <span>{t('accessibilitySettings')}</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label={t('closeSettings')}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="accessibility" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="accessibility">{t('accessibilitySettings')}</TabsTrigger>
              <TabsTrigger value="language">{t('language')}</TabsTrigger>
              <TabsTrigger value="signlanguage" className="flex items-center space-x-1">
                <Bot className="w-3 h-3" />
                <span>{t('signTab')}</span>
              </TabsTrigger>
            </TabsList>

            {/* تبويب إعدادات الوصولية */}
            <TabsContent value="accessibility" className="space-y-6 mt-6">
              {/* Disability Type Selection */}
              <div className="space-y-3">
                <Label className="text-base">{t('disabilityType')}</Label>
                <Select value={disabilityType} onValueChange={setDisabilityType}>
                  <SelectTrigger aria-label={t('selectDisabilityType')}>
                    <SelectValue placeholder={t('selectDisabilityType')} />
                  </SelectTrigger>
                  <SelectContent>
                    {disabilityTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-reverse space-x-2">
                            {Icon && <Icon className="w-4 h-4" />}
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Visual Settings */}
              <div className="space-y-4">
                <h3 className="font-medium flex items-center space-x-reverse space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>{t('visualSettings')}</span>
                </h3>
                
                {/* Dark Mode */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode" className="flex items-center space-x-reverse space-x-2">
                    {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    <span>{t('darkMode')}</span>
                  </Label>
                  <Switch
                    id="dark-mode"
                    checked={isDarkMode}
                    onCheckedChange={setIsDarkMode}
                    aria-describedby="dark-mode-description"
                  />
                </div>
                <p id="dark-mode-description" className="text-sm text-muted-foreground">
                  {t('darkModeDesc')}
                </p>

                {/* Simple Mode */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="simple-mode" className="flex items-center space-x-reverse space-x-2">
                    <Type className="w-4 h-4" />
                    <span>{t('simpleMode')}</span>
                  </Label>
                  <Switch
                    id="simple-mode"
                    checked={isSimpleMode}
                    onCheckedChange={setIsSimpleMode}
                    aria-describedby="simple-mode-description"
                  />
                </div>
                <p id="simple-mode-description" className="text-sm text-muted-foreground">
                  {t('simpleModeDesc')}
                </p>

                {/* Font Size */}
                <div className="space-y-3">
                  <Label className="flex items-center space-x-reverse space-x-2">
                    <Type className="w-4 h-4" />
                    <span>{t('fontSize')}: {fontSize}px</span>
                  </Label>
                  <div className="flex items-center space-x-reverse space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                      aria-label={t('decreaseFont')}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Slider
                      value={[fontSize]}
                      onValueChange={(value) => setFontSize(value[0])}
                      max={24}
                      min={12}
                      step={1}
                      className="flex-1"
                      aria-label={t('fontSize')}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                      aria-label={t('increaseFont')}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Audio Settings */}
              <div className="space-y-4">
                <h3 className="font-medium flex items-center space-x-reverse space-x-2">
                  <Volume2 className="w-4 h-4" />
                  <span>{t('audioSettings')}</span>
                </h3>
                
                <div className="space-y-2">
                  <QuickTTS 
                    text={t('testTTS')}
                    className="w-full justify-center"
                    size="lg"
                  />
                  <p className="text-sm text-muted-foreground">
                    {t('ttsDescription')}
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* تبويب اللغة */}
            <TabsContent value="language" className="space-y-6 mt-6">
              <div className="space-y-4">
                <h3 className="font-medium flex items-center space-x-reverse space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>{t('language')}</span>
                </h3>

                <div className="space-y-3">
                  <Label className="text-base">{t('selectLanguage')}</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">
                        <div className="flex items-center space-x-reverse space-x-2">
                          <span>🇯🇴</span>
                          <span>{t('arabic')}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="en">
                        <div className="flex items-center space-x-reverse space-x-2">
                          <span>🇺🇸</span>
                          <span>{t('english')}</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium mb-2">{t('jordanianAccent')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' 
                      ? 'تم تحسين النطق والأصوات خصيصاً للهجة الأردنية مع دعم أفضل للكلمات المحلية.'
                      : 'Speech and pronunciation have been optimized specifically for the Jordanian dialect with better support for local words.'
                    }
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* تبويب إعدادات لغة الإشارة */}
            <TabsContent value="signlanguage" className="space-y-6 mt-6">
              <div className="space-y-4">
                <h3 className="font-medium flex items-center space-x-reverse space-x-2">
                  <Bot className="w-4 h-4" />
                  <span>{t('signLanguageSettings')}</span>
                </h3>

                {/* تفعيل لغة الإشارة */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-sign" className="flex items-center space-x-reverse space-x-2">
                    <Bot className="w-4 h-4" />
                    <span>{t('enableSignLanguage')}</span>
                  </Label>
                  <Switch
                    id="enable-sign"
                    checked={signConfig.enabled}
                    onCheckedChange={(enabled) => updateSignConfig({ enabled })}
                  />
                </div>

                {signConfig.enabled && (
                  <>
                    {/* نوع لغة الإشارة */}
                    <div className="space-y-2">
                      <Label>{t('signLanguageType')}</Label>
                      <Select 
                        value={signConfig.language} 
                        onValueChange={(language: 'asl' | 'arabic-sign' | 'international') => 
                          updateSignConfig({ language })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="arabic-sign">{t('arabicSignLanguage')}</SelectItem>
                          <SelectItem value="asl">{t('americanSignLanguage')}</SelectItem>
                          <SelectItem value="international">{t('internationalSignLanguage')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* نوع الأفتار */}
                    <div className="space-y-2">
                      <Label>{t('avatarType')}</Label>
                      <Select 
                        value={signConfig.avatarType} 
                        onValueChange={(avatarType: 'robot' | 'human' | 'cartoon') => 
                          updateSignConfig({ avatarType })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="robot">{t('robotAvatar')} 🤖</SelectItem>
                          <SelectItem value="human">{t('humanAvatar')} 👤</SelectItem>
                          <SelectItem value="cartoon">{t('cartoonAvatar')} 🎭</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* حجم الأفتار */}
                    <div className="space-y-2">
                      <Label>{t('avatarSize')}</Label>
                      <Select 
                        value={signConfig.avatarSize} 
                        onValueChange={(avatarSize: 'small' | 'medium' | 'large') => 
                          updateSignConfig({ avatarSize })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">{language === 'ar' ? 'صغير' : 'Small'}</SelectItem>
                          <SelectItem value="medium">{language === 'ar' ? 'متوسط' : 'Medium'}</SelectItem>
                          <SelectItem value="large">{language === 'ar' ? 'كبير' : 'Large'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* موضع الأفتار */}
                    <div className="space-y-2">
                      <Label>{t('avatarPosition')}</Label>
                      <Select 
                        value={signConfig.position} 
                        onValueChange={(position: any) => updateSignConfig({ position })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bottom-right">{language === 'ar' ? 'أسفل يمين' : 'Bottom Right'}</SelectItem>
                          <SelectItem value="bottom-left">{language === 'ar' ? 'أسفل يسار' : 'Bottom Left'}</SelectItem>
                          <SelectItem value="top-right">{language === 'ar' ? 'أعلى يمين' : 'Top Right'}</SelectItem>
                          <SelectItem value="top-left">{language === 'ar' ? 'أعلى يسار' : 'Top Left'}</SelectItem>
                          <SelectItem value="center">{language === 'ar' ? 'وسط' : 'Center'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* سرعة الحركة */}
                    <div className="space-y-3">
                      <Label className="flex items-center space-x-reverse space-x-2">
                        <span>{t('animationSpeed')}: {signConfig.animationSpeed}x</span>
                      </Label>
                      <Slider
                        value={[signConfig.animationSpeed]}
                        onValueChange={(value) => updateSignConfig({ animationSpeed: value[0] })}
                        max={2}
                        min={0.5}
                        step={0.1}
                        className="flex-1"
                      />
                    </div>

                    {/* إظهار تلقائي */}
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-show-sign" className="flex items-center space-x-reverse space-x-2">
                        <span>{t('autoShowForHearing')}</span>
                      </Label>
                      <Switch
                        id="auto-show-sign"
                        checked={signConfig.autoShow}
                        onCheckedChange={(autoShow) => updateSignConfig({ autoShow })}
                      />
                    </div>

                    {/* زر اختبار */}
                    <Button 
                      onClick={() => {
                        // تشغيل إشارة ترحيبية للاختبار
                        console.log('Playing welcome gesture...');
                      }}
                      className="w-full"
                      variant="outline"
                    >
                      {t('playWelcomeGesture')} 👋
                    </Button>
                  </>
                )}

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium mb-2">{language === 'ar' ? 'حول الأفتار الروبوت' : 'About Robot Avatar'}</h4>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' 
                      ? 'الأفتار الروبوت ثلاثي الأبعاد مصمم خصيصاً لتقديم ترجمة دقيقة ومفهومة للغة الإشارة العربية مع دعم كامل للهجة الأردنية.'
                      : 'The 3D robot avatar is specifically designed to provide accurate and understandable Arabic sign language translation with full support for Jordanian dialect.'
                    }
                  </p>
                </div>
              </div>
            </TabsContent>


          </Tabs>

          {/* Action Buttons */}
          <div className="flex space-x-reverse space-x-3 pt-6 border-t mt-6">
            <Button
              onClick={onClose}
              className="flex-1"
            >
              {t('saveSettings')}
            </Button>
            <Button
              variant="outline"
              onClick={handleResetSettings}
            >
              {t('resetSettings')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}