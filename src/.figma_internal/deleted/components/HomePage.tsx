import React, { useEffect, useState } from 'react';
import { Play, MapPin, Heart, Users, ArrowDown, Volume2, Hand, Bot } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { GoogleMapsService } from './services/GoogleMapsService';
import { QuickTTS } from './services/TTSService';
import { QuickLocation } from './services/LocationService';
import { useTranslation } from './services/TranslationService';
import { SignLanguageService } from './services/SignLanguageService';
import { SignLanguageConfigManager } from '../config/signLanguageConfig';

export function HomePage() {
  const { t, language, isRTL } = useTranslation();
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [showSignLanguage, setShowSignLanguage] = useState(false);
  const [welcomeText, setWelcomeText] = useState('');
  const [nearbyOpportunities, setNearbyOpportunities] = useState(() => {
    if (language === 'ar') {
      return [
        { id: 1, title: 'ورشة عمل للتصميم الرقمي - الجامعة الأردنية', type: 'تعليمية', distance: '0.5 كم', accessible: true },
        { id: 2, title: 'وظيفة مطور ويب - شركة أرامكس', type: 'وظيفية', distance: '2.1 كم', accessible: true },
        { id: 3, title: 'فعالية رياضية للجميع - نادي الفيصلي', type: 'مجتمعية', distance: '1.8 كم', accessible: true },
        { id: 4, title: 'دورة لغة الإشارة - جمعية المعوقين الأردنية', type: 'تعليمية', distance: '3.2 كم', accessible: true },
        { id: 5, title: 'معرض التوظيف السنوي - مركز الملكة رانيا', type: 'وظيفية', distance: '2.5 كم', accessible: true }
      ];
    } else {
      return [
        { id: 1, title: 'Digital Design Workshop - University of Jordan', type: 'Educational', distance: '0.5 km', accessible: true },
        { id: 2, title: 'Web Developer Position - Aramex', type: 'Job', distance: '2.1 km', accessible: true },
        { id: 3, title: 'Inclusive Sports Event - Al Faisaly Club', type: 'Community', distance: '1.8 km', accessible: true },
        { id: 4, title: 'Sign Language Course - Jordan Disability Association', type: 'Educational', distance: '3.2 km', accessible: true },
        { id: 5, title: 'Annual Job Fair - Queen Rania Center', type: 'Job', distance: '2.5 km', accessible: true }
      ];
    }
  });

  const handleLocationUpdate = (location: any) => {
    if (location.address) {
      setCurrentLocation(location.address);
    } else {
      setCurrentLocation(`${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`);
    }
  };
  
  const speakWelcomeMessage = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(t('testTTS'));
      utterance.lang = language === 'ar' ? 'ar-JO' : 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (typeof document !== 'undefined') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-8" role="banner">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
            {t('welcomeTitle')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('welcomeSubtitle')}
          </p>
        </div>

        {/* Welcome Video Section */}
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 rounded-lg relative overflow-hidden mb-4">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1749353709979-7f169131254e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWduJTIwbGFuZ3VhZ2UlMjBpbnRlcnByZXRlciUyMGhhbmRzJTIwY29tbXVuaWNhdGlvbnxlbnwxfHx8fDE3NTc0Mzc4Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="مترجم لغة الإشارة يرحب بالزوار"
                className="w-full h-full object-cover"
              />
              
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="space-y-4">
                  <Button
                    size="lg"
                    className="bg-white/90 text-gray-900 hover:bg-white"
                    onClick={() => {
                      speakWelcomeMessage();
                      setWelcomeText(t('welcomeTitle') + '. ' + t('welcomeSubtitle'));
                      setShowSignLanguage(true);
                    }}
                    aria-label="تشغيل الرسالة الترحيبية"
                  >
                    <Play className="w-6 h-6 ml-2" />
                    {language === 'ar' ? 'تشغيل الترحيب' : 'Play Welcome'}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-blue-600/90 text-white hover:bg-blue-700/90 ml-3"
                    onClick={() => {
                      setWelcomeText(t('welcomeTitle') + '. ' + t('welcomeSubtitle'));
                      setShowSignLanguage(true);
                    }}
                    aria-label="عرض مترجم لغة الإشارة"
                  >
                    <Bot className="w-4 h-4 ml-1" />
                    {language === 'ar' ? 'لغة الإشارة' : 'Sign Language'}
                  </Button>
                </div>
              </div>
              
              {/* مؤشر دعم لغة الإشارة */}
              <div className="absolute top-4 right-4 flex items-center space-x-2 bg-blue-600/80 text-white px-3 py-1 rounded-full text-sm">
                <Bot className="w-4 h-4" />
                <span>{language === 'ar' ? 'متوفر بلغة الإشارة' : 'Sign Language Available'}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="secondary" className="flex items-center space-x-reverse space-x-1">
                <Hand className="w-3 h-3" />
                <span>لغة الإشارة</span>
              </Badge>
              <Badge variant="secondary" className="flex items-center space-x-reverse space-x-1">
                <Volume2 className="w-3 h-3" />
                <span>قراءة صوتية</span>
              </Badge>
              <Badge variant="secondary">
                ترجمة نصية
              </Badge>
              <QuickTTS text={t('testTTS')} className="h-6 w-6 p-0" />
            </div>
            
            <p className="text-sm text-muted-foreground mt-3 text-center">
              {t('testTTS')}
            </p>
          </CardContent>
        </Card>

        {/* Navigation to Sections */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => scrollToSection('opportunities-preview')}
            className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
          >
            <Heart className="w-4 h-4" />
            <span>{t('jobOpportunities')}</span>
            <ArrowDown className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => scrollToSection('location-services')}
            className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
          >
            <MapPin className="w-4 h-4" />
            <span>{t('nearbyServices')}</span>
            <ArrowDown className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Location Services */}
      <section id="location-services" className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            {t('nearbyServices')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t('findNearbyServices')}
          </p>
          <div className="flex items-center justify-center space-x-reverse space-x-2">
            {currentLocation && (
              <p className="text-sm text-muted-foreground flex items-center space-x-reverse space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{language === 'ar' ? 'موقعك الحالي' : 'Your location'}: {currentLocation}</span>
              </p>
            )}
            <QuickLocation 
              onLocationUpdate={handleLocationUpdate}
              className="h-6"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Interactive Map */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">{language === 'ar' ? 'الخريطة التفاعلية' : 'Interactive Map'}</h3>
              <GoogleMapsService 
                showAccessiblePlaces={true}
                onLocationSelect={(location) => {
                  console.log('Selected location:', location);
                }}
                className="h-96"
              />
            </CardContent>
          </Card>

          {/* Nearby Opportunities */}
          <div className="space-y-4">
            <h3 className="font-semibold">{language === 'ar' ? 'الفرص القريبة' : 'Nearby Opportunities'}</h3>
            <div className="space-y-3">
              {nearbyOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">{opportunity.title}</h4>
                        <div className="flex items-center space-x-reverse space-x-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {opportunity.type}
                          </Badge>
                          <span className="flex items-center space-x-reverse space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{opportunity.distance}</span>
                          </span>
                        </div>
                      </div>
                      {opportunity.accessible && (
                        <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          {language === 'ar' ? 'متاح' : 'Available'}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button variant="outline" className="w-full">
              {language === 'ar' ? 'عرض جميع الفرص القريبة' : 'View All Nearby Opportunities'}
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section id="opportunities-preview" className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            {language === 'ar' ? 'ابدأ رحلتك معنا' : 'Start Your Journey'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {language === 'ar' ? 'اختر المجال الذي يناسبك وابدأ في استكشاف الفرص المتاحة' : 'Choose your area of interest and start exploring available opportunities'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">الفرص الوظيفية</h3>
                <p className="text-sm text-muted-foreground">
                  اكتشف وظائف مناسبة وفرص عمل تدعم ذوي الاحتياجات الخاصة
                </p>
              </div>
              <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white">
                استكشف الآن
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">المسارات الآمنة</h3>
                <p className="text-sm text-muted-foreground">
                  اعثر على أفضل المسارات الآمنة والمتاحة للوصول لوجهتك
                </p>
              </div>
              <Button variant="outline" className="w-full group-hover:bg-green-600 group-hover:text-white">
                اعرض الخريطة
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">المجتمع</h3>
                <p className="text-sm text-muted-foreground">
                  انضم إلى مجتمعنا وشارك تجاربك واحصل على الدعم
                </p>
              </div>
              <Button variant="outline" className="w-full group-hover:bg-purple-600 group-hover:text-white">
                انضم الآن
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* خدمة لغة الإشارة */}
      <SignLanguageService
        text={welcomeText}
        isVisible={showSignLanguage}
        disabilityType="auditory"
        onTranslationComplete={() => {
          console.log('Sign language translation completed');
        }}
      />
    </div>
  );
}