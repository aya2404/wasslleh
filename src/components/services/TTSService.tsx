import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play, RotateCcw, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { useTranslation } from './TranslationService';
import { APIConfigManager, voiceConfigs } from '../../config/apiConfig';

interface TTSServiceProps {
  text: string;
  autoPlay?: boolean;
  showControls?: boolean;
  language?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

interface Voice {
  name: string;
  lang: string;
  gender: 'male' | 'female';
  localName: string;
  isAzure?: boolean;
}

export function TTSService({
  text,
  autoPlay = false,
  showControls = true,
  language,
  onStart,
  onEnd,
  onError,
  className = ""
}: TTSServiceProps) {
  const { t, language: currentLang } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState(0.8);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isSupported, setIsSupported] = useState(false);
  const [useAzureVoices, setUseAzureVoices] = useState(false);

  const speechLang = language || (currentLang === 'ar' ? 'ar-JO' : 'en-US');

  // تحميل الأصوات المحسنة للأردن
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      setIsSupported(false);
      if (onError) {
        onError(t('error') + ': ' + 'Speech synthesis not supported');
      }
    }
  }, [currentLang]);

  const loadVoices = () => {
    const regionConfig = APIConfigManager.getRegionConfig();
    const voiceConfig = APIConfigManager.getVoiceConfig();
    const hasAzureKey = APIConfigManager.hasValidAzureKeys();

    const availableVoices: Voice[] = [];

    // إضافة الأصوات المحسنة للمنطقة الحالية
    if (currentLang === 'ar') {
      // أصوات Azure المحسنة (إذا كان المفتاح متاح)
      if (hasAzureKey && voiceConfig) {
        availableVoices.push({
          name: voiceConfig.male.name,
          lang: voiceConfig.male.locale,
          gender: 'male',
          localName: `${t('maleVoice')} (${regionConfig?.country || 'محسن'})`,
          isAzure: true
        });
        
        availableVoices.push({
          name: voiceConfig.female.name,
          lang: voiceConfig.female.locale,
          gender: 'female',
          localName: `${t('femaleVoice')} (${regionConfig?.country || 'محسن'})`,
          isAzure: true
        });
        
        setUseAzureVoices(true);
      }

      // أصوات النظام العربية
      const systemVoices = speechSynthesis.getVoices();
      const arabicSystemVoices = systemVoices
        .filter(voice => voice.lang.startsWith('ar'))
        .map(voice => ({
          name: voice.name,
          lang: voice.lang,
          gender: (voice.name.toLowerCase().includes('female') || 
                  voice.name.toLowerCase().includes('woman') ||
                  voice.name.toLowerCase().includes('زينب') ||
                  voice.name.toLowerCase().includes('فاطمة')) ? 'female' as const : 'male' as const,
          localName: voice.name,
          isAzure: false
        }));

      availableVoices.push(...arabicSystemVoices);

      // أصوات افتراضية إذا لم تتوفر أصوات أخرى
      if (availableVoices.length === 0) {
        availableVoices.push(
          {
            name: 'ar-JO-default-male',
            lang: 'ar-JO',
            gender: 'male',
            localName: `${t('maleVoice')} - ${t('jordanianAccent')}`,
            isAzure: false
          },
          {
            name: 'ar-JO-default-female',
            lang: 'ar-JO',
            gender: 'female',
            localName: `${t('femaleVoice')} - ${t('jordanianAccent')}`,
            isAzure: false
          }
        );
      }
    } else {
      // أصوات إنجليزية
      const systemVoices = speechSynthesis.getVoices();
      const englishSystemVoices = systemVoices
        .filter(voice => voice.lang.startsWith('en'))
        .map(voice => ({
          name: voice.name,
          lang: voice.lang,
          gender: (voice.name.toLowerCase().includes('female') || 
                  voice.name.toLowerCase().includes('woman')) ? 'female' as const : 'male' as const,
          localName: voice.name,
          isAzure: false
        }));

      availableVoices.push(...englishSystemVoices);
    }

    setVoices(availableVoices);
    
    if (availableVoices.length > 0 && !selectedVoice) {
      // اختيار صوت أنثوي افتراضياً للعربية، ذكوري للإنجليزية
      const preferredGender = currentLang === 'ar' ? 'female' : 'male';
      const preferredVoice = availableVoices.find(voice => voice.gender === preferredGender);
      setSelectedVoice(preferredVoice?.name || availableVoices[0].name);
    }
  };

  // تشغيل تلقائي
  useEffect(() => {
    if (autoPlay && text && isSupported) {
      handlePlay();
    }
  }, [autoPlay, text, isSupported]);

  const createUtterance = async (textToSpeak: string): Promise<SpeechSynthesisUtterance> => {
    // إذا كان صوت Azure متاح، حاول استخدامه
    if (useAzureVoices && selectedVoice.includes('Neural')) {
      return await createAzureUtterance(textToSpeak);
    }
    
    // استخدام Web Speech API العادي
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    utterance.lang = speechLang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    // اختيار الصوت
    const systemVoices = speechSynthesis.getVoices();
    const selectedSystemVoice = systemVoices.find(voice => 
      voice.name === selectedVoice || voice.lang.startsWith(speechLang.split('-')[0])
    );
    
    if (selectedSystemVoice) {
      utterance.voice = selectedSystemVoice;
    }

    // تحسينات خاصة للعربية
    if (speechLang.startsWith('ar')) {
      // تحسين النطق للأردنية
      const enhancedText = enhanceArabicText(textToSpeak);
      utterance.text = enhancedText;
      
      // سرعة أبطأ للعربية لوضوح أفضل
      utterance.rate = Math.max(0.6, rate * 0.8);
    }

    // معالجات الأحداث
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      if (onStart) onStart();
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentUtterance(null);
      if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentUtterance(null);
      if (onError) {
        onError(`${t('error')}: ${event.error}`);
      }
    };

    utterance.onpause = () => setIsPaused(true);
    utterance.onresume = () => setIsPaused(false);

    return utterance;
  };

  // إنشاء utterance باستخدام Azure (محسن مع إمكانية استخدام API حقيقي)
  const createAzureUtterance = async (textToSpeak: string): Promise<SpeechSynthesisUtterance> => {
    const azureConfig = APIConfigManager.getAzureConfig();
    
    if (azureConfig && APIConfigManager.hasValidAzureKeys()) {
      try {
        // محاولة استخدام Azure Speech Services
        const audioBlob = await callAzureSpeechAPI(textToSpeak, selectedVoice, rate, pitch);
        if (audioBlob) {
          return createUtteranceFromAudioBlob(audioBlob);
        }
      } catch (error) {
        console.warn('Azure TTS failed, falling back to Web Speech API:', error);
      }
    }
    
    // Fallback إلى Web Speech API مع تحسينات
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = speechLang;
    utterance.rate = rate * 0.9;
    utterance.pitch = pitch;
    utterance.volume = volume;

    if (speechLang.startsWith('ar')) {
      utterance.text = enhanceArabicText(textToSpeak);
    }

    return utterance;
  };

  // استدعاء Azure Speech API الحقيقي
  const callAzureSpeechAPI = async (text: string, voice: string, rate: number, pitch: number): Promise<Blob | null> => {
    const azureConfig = APIConfigManager.getAzureConfig();
    if (!azureConfig) return null;

    try {
      const ssml = createSSML(text, voice, rate, pitch);
      
      const response = await fetch(`https://${azureConfig.region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': azureConfig.key,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3'
        },
        body: ssml
      });

      if (response.ok) {
        return await response.blob();
      }
    } catch (error) {
      console.error('Azure TTS API call failed:', error);
    }
    
    return null;
  };

  // إنشاء SSML للصوت المحسن
  const createSSML = (text: string, voice: string, rate: number, pitch: number): string => {
    const voiceConfig = APIConfigManager.getVoiceConfig();
    const actualVoice = voiceConfig?.male.name || 'ar-JO-TaimNeural';
    
    return `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${speechLang}">
        <voice name="${actualVoice}">
          <prosody rate="${rate}" pitch="${pitch > 1 ? '+' : ''}${((pitch - 1) * 50).toFixed(0)}%">
            ${enhanceArabicText(text)}
          </prosody>
        </voice>
      </speak>
    `;
  };

  // إنشاء utterance من audio blob
  const createUtteranceFromAudioBlob = (audioBlob: Blob): SpeechSynthesisUtterance => {
    const utterance = new SpeechSynthesisUtterance();
    
    // في هذه الحالة، نحتاج لتشغيل الصوت بطريقة مختلفة
    // لأن Web Speech API لا يدعم audio blobs مباشرة
    const audioURL = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioURL);
    
    // محاكاة events السـ utterance
    audio.onplay = () => utterance.onstart?.(new SpeechSynthesisEvent('start', { utterance }));
    audio.onended = () => {
      utterance.onend?.(new SpeechSynthesisEvent('end', { utterance }));
      URL.revokeObjectURL(audioURL);
    };
    audio.onerror = () => utterance.onerror?.(new SpeechSynthesisErrorEvent('error', { utterance, error: 'network' }));
    
    // تخصيص طريقة التشغيل
    const originalSpeak = speechSynthesis.speak;
    speechSynthesis.speak = function(utteranceToSpeak) {
      if (utteranceToSpeak === utterance) {
        audio.play();
      } else {
        originalSpeak.call(this, utteranceToSpeak);
      }
    };
    
    return utterance;
  };

  // تحسين النص العربي للنطق
  const enhanceArabicText = (text: string): string => {
    let enhanced = text;
    
    // إضافة تشكيل أساسي للكلمات الشائعة
    const commonWords: { [key: string]: string } = {
      'وصال': 'وِصال',
      'مرحبا': 'مَرحَباً',
      'مرحباً': 'مَرحَباً',
      'اهلا': 'أَهلاً',
      'أهلا': 'أَهلاً',
      'الاردن': 'الأُردُن',
      'الأردن': 'الأُردُن',
      'عمان': 'عَمّان',
      'خدمات': 'خِدْمات',
      'مجتمع': 'مُجتَمَع',
      'شامل': 'شامِل',
      'الفرص': 'الفُرَص',
      'المسارات': 'المَسارات',
      'الآمنة': 'الآمِنَة'
    };

    for (const [word, enhanced_word] of Object.entries(commonWords)) {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      enhanced = enhanced.replace(regex, enhanced_word);
    }

    // إضافة فواصل للنطق الأفضل
    enhanced = enhanced.replace(/([.!?])/g, '$1 ');
    enhanced = enhanced.replace(/([،:])/g, '$1 ');

    return enhanced;
  };

  const handlePlay = async () => {
    if (!isSupported || !text) return;

    speechSynthesis.cancel();

    try {
      const utterance = await createUtterance(text);
      setCurrentUtterance(utterance);
      speechSynthesis.speak(utterance);
    } catch (error) {
      if (onError) {
        onError(`${t('error')}: ${error}`);
      }
    }
  };

  const handlePause = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
    }
  };

  const handleResume = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
    }
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentUtterance(null);
  };

  const handleRestart = () => {
    handleStop();
    setTimeout(handlePlay, 100);
  };

  if (!isSupported) {
    return (
      <Card className={className}>
        <CardContent className="p-4 text-center">
          <VolumeX className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {t('error')}: Speech synthesis not supported
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!showControls) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePlay}
        disabled={!text || isPlaying}
        className={className}
        aria-label={t('play')}
      >
        {isPlaying ? (
          <Volume2 className="w-4 h-4 animate-pulse" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </Button>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium flex items-center space-x-reverse space-x-2">
            <Volume2 className="w-4 h-4" />
            <span>{t('audioSettings')}</span>
          </h4>
          {isPlaying && (
            <Badge variant="secondary" className="animate-pulse">
              {t('loading')}
            </Badge>
          )}
        </div>

        {/* أزرار التحكم الرئيسية */}
        <div className="flex items-center justify-center space-x-reverse space-x-2">
          {!isPlaying ? (
            <Button onClick={handlePlay} disabled={!text}>
              <Play className="w-4 h-4 ml-2" />
              {t('play')}
            </Button>
          ) : (
            <>
              {isPaused ? (
                <Button onClick={handleResume}>
                  <Play className="w-4 h-4 ml-2" />
                  {t('resume')}
                </Button>
              ) : (
                <Button onClick={handlePause} variant="outline">
                  <Pause className="w-4 h-4 ml-2" />
                  {t('pause')}
                </Button>
              )}
            </>
          )}
          
          <Button 
            onClick={handleStop} 
            variant="outline"
            disabled={!isPlaying && !isPaused}
          >
            <VolumeX className="w-4 h-4 ml-2" />
            {t('stop')}
          </Button>
          
          <Button 
            onClick={handleRestart} 
            variant="outline"
            disabled={!text}
          >
            <RotateCcw className="w-4 h-4 ml-2" />
            إعادة
          </Button>
        </div>

        {/* إعدادات متقدمة */}
        <div className="space-y-3 pt-3 border-t">
          <h5 className="text-sm font-medium flex items-center space-x-reverse space-x-1">
            <Settings className="w-3 h-3" />
            <span>{t('voiceSettings')}</span>
          </h5>

          {/* اختيار الصوت */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">{t('voiceType')}:</label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice) => (
                  <SelectItem key={voice.name} value={voice.name}>
                    <div className="flex items-center space-x-reverse space-x-2">
                      {voice.isAzure && <Badge variant="secondary" className="text-xs">Azure</Badge>}
                      <span>{voice.localName}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* سرعة القراءة */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs text-muted-foreground">{t('voiceSpeed')}:</label>
              <span className="text-xs text-muted-foreground">{rate.toFixed(1)}x</span>
            </div>
            <Slider
              value={[rate]}
              onValueChange={(value) => setRate(value[0])}
              max={2}
              min={0.5}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* نبرة الصوت */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs text-muted-foreground">نبرة الصوت:</label>
              <span className="text-xs text-muted-foreground">{pitch.toFixed(1)}</span>
            </div>
            <Slider
              value={[pitch]}
              onValueChange={(value) => setPitch(value[0])}
              max={2}
              min={0.5}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* مستوى الصوت */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs text-muted-foreground">{t('voiceVolume')}:</label>
              <span className="text-xs text-muted-foreground">{Math.round(volume * 100)}%</span>
            </div>
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>

        {/* معلومات النص */}
        {text && (
          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              طول النص: {text.length} حرف (~{Math.ceil(text.length / 10)} ثانية)
            </p>
            {useAzureVoices && (
              <p className="text-xs text-green-600 mt-1">
                ✓ أصوات محسنة للهجة الأردنية متاحة
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// مكون مبسط لتشغيل سريع
export function QuickTTS({ 
  text, 
  className = "", 
  size = "sm" 
}: { 
  text: string; 
  className?: string; 
  size?: "sm" | "lg" 
}) {
  const { t, language } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    if (!text || isPlaying) return;

    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'ar' ? 'ar-JO' : 'en-US';
    utterance.rate = 0.8;
    
    // تحسين للأردنية
    if (language === 'ar') {
      utterance.rate = 0.7;
      utterance.text = text.replace(/الاردن/g, 'الأُردُن').replace(/وصال/g, 'وِصال');
    }
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    speechSynthesis.speak(utterance);
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleSpeak}
      disabled={!text || isPlaying}
      className={className}
      aria-label={t('play')}
    >
      {isPlaying ? (
        <Volume2 className={`${size === "lg" ? "w-5 h-5" : "w-4 h-4"} animate-pulse`} />
      ) : (
        <Volume2 className={`${size === "lg" ? "w-5 h-5" : "w-4 h-4"}`} />
      )}
    </Button>
  );
}