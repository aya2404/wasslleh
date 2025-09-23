import React, { useState } from 'react';
import { X, Camera, Languages, Volume2, FileText, Hand } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { OCRService } from './services/OCRService';
import { TTSService } from './services/TTSService';
import { useTranslation } from './services/TranslationService';
import { TranslationService } from './services/TranslationServiceComponent';

interface CameraPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CameraPanel({ isOpen, onClose }: CameraPanelProps) {
  const { t, language } = useTranslation();
  const [extractedText, setExtractedText] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [outputMode, setOutputMode] = useState<'text' | 'audio' | 'sign' | 'translate'>('text');

  const handleTextExtracted = (text: string, textConfidence: number) => {
    setExtractedText(text);
    setConfidence(textConfidence);
    
    // Auto-play based on output mode
    if (outputMode === 'audio') {
      speakText(text);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const generateSummary = (text: string) => {
    const words = text.split(' ');
    if (words.length <= 10) return text;
    
    const summary = words.slice(0, 10).join(' ') + '...';
    return `ملخص: ${summary}`;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="camera-title"
    >
      <Card 
        className="w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle id="camera-title" className="flex items-center space-x-reverse space-x-2">
            <Camera className="w-5 h-5" />
            <span>{t('openTextAnalysis')}</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="{t('closeSettings')}"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* OCR Section */}
            <div className="space-y-4">
              <OCRService 
                onTextExtracted={handleTextExtracted}
                onError={(error) => console.error('OCR Error:', error)}
                language="ara"
              />
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              <h3 className="font-medium">النتائج والخيارات</h3>

              <Tabs value={outputMode} onValueChange={(value) => setOutputMode(value as any)}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="text" className="flex items-center space-x-reverse space-x-1">
                    <FileText className="w-4 h-4" />
                    <span>نص</span>
                  </TabsTrigger>
                  <TabsTrigger value="audio" className="flex items-center space-x-reverse space-x-1">
                    <Volume2 className="w-4 h-4" />
                    <span>صوتي</span>
                  </TabsTrigger>
                  <TabsTrigger value="translate" className="flex items-center space-x-reverse space-x-1">
                    <Languages className="w-4 h-4" />
                    <span>ترجمة</span>
                  </TabsTrigger>
                  <TabsTrigger value="sign" className="flex items-center space-x-reverse space-x-1">
                    <Hand className="w-4 h-4" />
                    <span>إشارة</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-3">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg min-h-[200px]">
                    {extractedText ? (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">النص المُستخرج:</h4>
                          {confidence > 0 && (
                            <span className={`text-sm px-2 py-1 rounded ${
                              confidence >= 90 ? 'bg-green-100 text-green-800' :
                              confidence >= 70 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              دقة: {confidence}%
                            </span>
                          )}
                        </div>
                        <p className="mb-3 leading-relaxed">{extractedText}</p>
                        <div className="border-t pt-3">
                          <p className="text-sm text-muted-foreground font-medium mb-1">الملخص:</p>
                          <p className="text-sm">{generateSummary(extractedText)}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center flex items-center justify-center h-full">
                        التقط صورة أو ارفع ملف لبدء استخراج النص
                      </p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="audio" className="space-y-3">
                  {extractedText ? (
                    <TTSService 
                      text={extractedText}
                      showControls={true}
                      language="ar"
                      onStart={() => console.log('TTS Started')}
                      onEnd={() => console.log('TTS Ended')}
                    />
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center min-h-[200px] flex items-center justify-center">
                      <div>
                        <Volume2 className="w-12 h-12 mx-auto text-blue-600 mb-3" />
                        <p className="text-muted-foreground">
                          استخرج النص أولاً لتشغيل القراءة الصوتية
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="translate" className="space-y-3">
                  {extractedText ? (
                    <TranslationService 
                      text={extractedText}
                      sourceLang="ar"
                      targetLang="en"
                      showSignLanguage={true}
                      onTranslation={(translatedText, targetLang) => {
                        console.log('Translated:', translatedText, 'to', targetLang);
                      }}
                    />
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center min-h-[200px] flex items-center justify-center">
                      <div>
                        <Languages className="w-12 h-12 mx-auto text-purple-600 mb-3" />
                        <p className="text-muted-foreground">
                          استخرج النص أولاً لبدء الترجمة
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="sign" className="space-y-3">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center min-h-[200px]">
                    <Hand className="w-12 h-12 mx-auto text-green-600 mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">
                      ترجمة لغة الإشارة (قريباً)
                    </p>
                    {extractedText ? (
                      <div className="space-y-3">
                        <p className="text-sm">النص: {extractedText.substring(0, 100)}...</p>
                        <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded">
                          <p className="text-sm">
                            🤟 سيتم عرض ترجمة لغة الإشارة هنا قريباً
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            تقنية الذكاء الاصطناعي لتحويل النص إلى لغة الإشارة
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        استخرج النص أولاً لعرض ترجمة لغة الإشارة
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}