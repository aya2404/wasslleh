import React, { useState } from 'react';
import { X, Settings, Volume2, Eye, Hand, Brain, Sun, Moon, Type, Minus, Plus, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { QuickTTS } from './services/TTSService';
import { useTranslation } from './services/TranslationService';

interface AccessibilitySettingsPanelProps {
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

export function AccessibilitySettingsPanel({
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
}: AccessibilitySettingsPanelProps) {
  const { t, language, setLanguage } = useTranslation();

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
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto border-purple-200 dark:border-purple-700"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-[var(--color-pastel-purple)] to-[var(--color-light-orange)] dark:from-[var(--color-dark-purple)]/20 dark:to-[var(--color-vibrant-orange)]/20">
          <CardTitle id="settings-title" className="flex items-center space-x-reverse space-x-2">
            <Settings className="w-5 h-5 text-[var(--color-dark-purple)] dark:text-white" />
            <span className="text-[var(--color-dark-purple)] dark:text-white">{t('accessibilitySettings')}</span>
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
            <TabsList className="grid w-full grid-cols-2 bg-[var(--color-light-beige)] dark:bg-[var(--color-dark-purple)]">
              <TabsTrigger 
                value="accessibility"
                className="data-[state=active]:bg-[var(--color-dark-purple)] data-[state=active]:text-white"
              >
                {t('accessibilitySettings')}
              </TabsTrigger>
              <TabsTrigger 
                value="language"
                className="data-[state=active]:bg-[var(--color-calm-green)] data-[state=active]:text-white"
              >
                {t('language')}
              </TabsTrigger>
            </TabsList>

            {/* تبويب إعدادات الوصولية */}
            <TabsContent value="accessibility" className="space-y-6 mt-6">
              {/* Disability Type Selection */}
              <div className="space-y-3">
                <Label className="text-base">{t('disabilityType')}</Label>
                <Select value={disabilityType} onValueChange={setDisabilityType}>
                  <SelectTrigger aria-label={t('selectDisabilityType')} className="border-[var(--color-pastel-purple)] focus:border-[var(--color-dark-purple)]">
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
                  <Eye className="w-4 h-4 text-[var(--color-dark-purple)]" />
                  <span className="text-[var(--color-dark-purple)] dark:text-[var(--color-pastel-purple)]">{t('visualSettings')}</span>
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
                      className="border-[var(--color-pastel-purple)] hover:bg-[var(--color-pastel-purple)]/20"
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
                      className="border-[var(--color-pastel-purple)] hover:bg-[var(--color-pastel-purple)]/20"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Audio Settings */}
              <div className="space-y-4">
                <h3 className="font-medium flex items-center space-x-reverse space-x-2">
                  <Volume2 className="w-4 h-4 text-[var(--color-vibrant-orange)]" />
                  <span className="text-[var(--color-dark-purple)] dark:text-[var(--color-pastel-purple)]">{t('audioSettings')}</span>
                </h3>
                
                <div className="space-y-2">
                  <QuickTTS 
                    text={t('testTTS')}
                    className="w-full justify-center bg-orange-600 hover:bg-orange-700"
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
                  <Globe className="w-4 h-4 text-green-600" />
                  <span>{t('language')}</span>
                </h3>

                <div className="space-y-3">
                  <Label className="text-base">{t('selectLanguage')}</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="border-green-200 focus:border-green-400">
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

                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200">
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
          </Tabs>

          {/* Action Buttons */}
          <div className="flex space-x-reverse space-x-3 pt-6 border-t mt-6">
            <Button
              onClick={onClose}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {t('saveSettings')}
            </Button>
            <Button
              variant="outline"
              onClick={handleResetSettings}
              className="border-orange-200 text-orange-700 hover:bg-orange-50"
            >
              {t('resetSettings')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}