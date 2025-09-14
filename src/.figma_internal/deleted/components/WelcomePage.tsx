import React, { useState, useEffect } from 'react';
import { Play, Volume2, Bot, Heart, Accessibility, Users, Map, Briefcase, ShoppingCart, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useTranslation } from './services/TranslationService';
import { QuickTTS } from './services/TTSService';
import { SignLanguageAvatar } from './ui/SignLanguageAvatar';

export function WelcomePage() {
  const { t, language } = useTranslation();
  const [showWelcomeVideo, setShowWelcomeVideo] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: Briefcase,
      title: language === 'ar' ? 'الفرص الوظيفية' : 'Job Opportunities',
      description: language === 'ar' 
        ? 'وظائف مخصصة لذوي الاحتياجات الخاصة مع ربط ذكي بـ LinkedIn'
        : 'Specialized jobs for people with disabilities with smart LinkedIn integration',
      color: 'from-brand-purple to-brand-purple'
    },
    {
      icon: Map,
      title: language === 'ar' ? 'المسارات الآمنة' : 'Safe Paths',
      description: language === 'ar'
        ? 'خرائط تفاعلية بتقنية Google Maps لأفضل طرق التنقل الآمن'
        : 'Interactive maps with Google Maps technology for the best safe navigation routes',
      color: 'from-brand-green to-brand-green'
    },
    {
      icon: Users,
      title: language === 'ar' ? 'المجتمع الداعم' : 'Supportive Community',
      description: language === 'ar'
        ? 'منصة تفاعلية لتبادل الخبرات والحصول على الدعم والمساعدة'
        : 'Interactive platform for sharing experiences and getting support and assistance',
      color: 'from-brand-orange to-brand-orange'
    },
    {
      icon: ShoppingCart,
      title: language === 'ar' ? 'المتجر والمساهمة' : 'Shop & Contribute',
      description: language === 'ar'
        ? 'أدوات مساعدة متخصصة وإمكانية المساهمة في تطوير المجتمع'
        : 'Specialized assistive tools and the ability to contribute to community development',
      color: 'from-brand-purple to-brand-orange'
    },
    {
      icon: Bot,
      title: language === 'ar' ? 'لغة الإشارة الذكية' : 'Smart Sign Language',
      description: language === 'ar'
        ? 'أفتار ثلاثي الأبعاد متطور لترجمة فورية ودقيقة للغة الإشارة'
        : 'Advanced 3D avatar for instant and accurate sign language translation',
      color: 'from-brand-green to-brand-purple'
    },
    {
      icon: Volume2,
      title: language === 'ar' ? 'القراءة الصوتية المتقدمة' : 'Advanced Text-to-Speech',
      description: language === 'ar'
        ? 'تقنية نطق متطورة باللهجة الأردنية لتجربة استماع طبيعية'
        : 'Advanced pronunciation technology in Jordanian dialect for a natural listening experience',
      color: 'from-green-600 to-blue-600'
    }
  ];

  const testimonials = [
    {
      name: language === 'ar' ? 'سارة أحمد' : 'Sarah Ahmed',
      role: language === 'ar' ? 'مهندسة برمجيات' : 'Software Engineer',
      content: language === 'ar'
        ? 'وصلة غيّر حياتي تماماً. وجدت وظيفة أحلامي وتواصلت مع مجتمع رائع يفهم تحدياتي.'
        : 'Waslah completely changed my life. I found my dream job and connected with an amazing community that understands my challenges.',
      rating: 5
    },
    {
      name: language === 'ar' ? 'محمد خالد' : 'Mohammed Khalid',
      role: language === 'ar' ? 'مصمم جرافيك' : 'Graphic Designer',
      content: language === 'ar'
        ? 'المسارات الآمنة ساعدتني كثيراً في التنقل بثقة. التطبيق سهل الاستخدام ودقيق جداً.'
        : 'Safe Paths helped me a lot in navigating with confidence. The app is user-friendly and very accurate.',
      rating: 5
    },
    {
      name: language === 'ar' ? 'ليلى حسن' : 'Layla Hassan',
      role: language === 'ar' ? 'معلمة' : 'Teacher',
      content: language === 'ar'
        ? 'أحب ميزة لغة الإشارة والمجتمع الداعم. أخيراً وجدت مكاناً أشعر فيه بالانتماء.'
        : 'I love the sign language feature and the supportive community. I finally found a place where I feel I belong.',
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  const welcomeMessage = language === 'ar' 
    ? 'مرحباً بك في وصلة - منصتك الشاملة لدعم ذوي الاحتياجات الخاصة. اكتشف الفرص، تواصل مع المجتمع، واحصل على الدعم الذي تحتاجه.'
    : 'Welcome to Waslah - your comprehensive platform for supporting people with special needs. Discover opportunities, connect with the community, and get the support you need.';

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-8">
        <div className="relative">
          <h1 className="text-5xl md:text-6xl font-heading font-bold bg-gradient-to-r from-brand-purple via-brand-orange to-brand-green bg-clip-text text-transparent mb-6">
            {language === 'ar' ? 'مرحباً بك في وصلة' : 'Welcome to Waslah'}
          </h1>
          <div className="absolute -top-4 -right-4 animate-bounce">
            <Sparkles className="w-8 h-8 text-brand-orange" />
          </div>
        </div>
        
        <p className="text-xl md:text-2xl font-body text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
          {language === 'ar' 
            ? 'منصتك الشاملة لدعم ذوي الاحتياجات الخاصة في الأردن' 
            : 'Your comprehensive platform for supporting people with special needs in Jordan'}
        </p>

        {/* Welcome Video/Message */}
        <Card className="max-w-4xl mx-auto border-2 border-brand-purple-light dark:border-brand-purple shadow-lg">
          <CardContent className="p-8">
            {!showWelcomeVideo ? (
              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-4">
                  <Button 
                    size="lg"
                    onClick={() => setShowWelcomeVideo(true)}
                    className="bg-gradient-to-r from-brand-purple to-brand-orange hover:from-brand-purple hover:to-brand-orange text-white px-8 py-6 text-lg"
                  >
                    <Play className="w-6 h-6 mr-3" />
                    {language === 'ar' ? 'شاهد الفيديو الترحيبي' : 'Watch Welcome Video'}
                  </Button>
                  
                  <QuickTTS 
                    text={welcomeMessage}
                    size="lg"
                    className="bg-brand-green hover:bg-brand-green px-8 py-6"
                  >
                    <Volume2 className="w-6 h-6 mr-3" />
                    {language === 'ar' ? 'استمع للترحيب' : 'Listen to Welcome'}
                  </QuickTTS>
                </div>

                <div className="p-6 bg-gradient-to-r from-brand-purple-light to-brand-orange-light dark:from-brand-purple/20 dark:to-brand-orange/20 rounded-lg">
                  <p className="text-lg leading-relaxed">
                    {welcomeMessage}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">
                    {language === 'ar' ? 'مرحباً بك في وصلة!' : 'Welcome to Waslah!'}
                  </h3>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowWelcomeVideo(false)}
                  >
                    {language === 'ar' ? 'إغلاق' : 'Close'}
                  </Button>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
                  <SignLanguageAvatar 
                    text={welcomeMessage}
                    className="mx-auto mb-4"
                  />
                  <p className="text-lg leading-relaxed">
                    {welcomeMessage}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Features Showcase */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">
            {language === 'ar' ? 'ميزاتنا المتطورة' : 'Our Advanced Features'}
          </h2>
          <p className="font-body text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {language === 'ar'
              ? 'اكتشف كيف يمكن لوصلة أن تحسن من جودة حياتك اليومية'
              : 'Discover how Waslah can improve your daily quality of life'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className={`transition-all duration-300 hover:shadow-lg border-2 ${
                  currentFeature === index 
                    ? 'border-purple-400 shadow-lg scale-105' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Access */}
      <Card className="bg-gradient-to-r from-purple-600 to-orange-600 text-white">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-heading font-bold">
              {language === 'ar' ? 'ابدأ رحلتك معنا' : 'Start Your Journey With Us'}
            </h2>
            <p className="text-xl font-body opacity-90 max-w-2xl mx-auto">
              {language === 'ar'
                ? 'اختر الخدمة التي تحتاجها واستمتع بتجربة مصممة خصيصاً لك'
                : 'Choose the service you need and enjoy an experience designed specifically for you'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {[
                { icon: Briefcase, label: language === 'ar' ? 'الفرص' : 'Opportunities' },
                { icon: Map, label: language === 'ar' ? 'المسارات' : 'Paths' },
                { icon: Users, label: language === 'ar' ? 'المجتمع' : 'Community' },
                { icon: ShoppingCart, label: language === 'ar' ? 'المتجر' : 'Shop' }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={index}
                    variant="secondary"
                    size="lg"
                    className="h-auto py-6 bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Icon className="w-8 h-8" />
                      <span>{item.label}</span>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">
            {language === 'ar' ? 'قصص نجاح ملهمة' : 'Inspiring Success Stories'}
          </h2>
          <p className="font-body text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {language === 'ar'
              ? 'اكتشف كيف غيّرت وصلة حياة الآلاف من المستخدمين'
              : 'Discover how Waslah has changed the lives of thousands of users'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-2 border-green-200 dark:border-green-700">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Heart key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                    ))}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="border-t pt-4">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Accessibility Notice */}
      <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <Accessibility className="w-8 h-8 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-heading font-semibold text-green-800 dark:text-green-200 mb-2">
                {language === 'ar' ? 'ملتزمون بالوصولية الرقمية' : 'Committed to Digital Accessibility'}
              </h3>
              <p className="font-body text-green-700 dark:text-green-300 leading-relaxed">
                {language === 'ar'
                  ? 'تم تصميم موقع وصلة وفقاً لأعلى معايير الوصولية الرقمية لضمان تجربة سلسة ومريحة لجميع المستخدمين. يمكنك تخصيص الموقع ليناسب احتياجاتك الخاصة من خلال لوحة الإعدادات.'
                  : 'The Waslah website has been designed according to the highest digital accessibility standards to ensure a smooth and comfortable experience for all users. You can customize the site to suit your specific needs through the settings panel.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}