import React, { useState, useEffect } from 'react';
import { Play, Volume2, Bot, Heart, Accessibility, Users, Map, Briefcase, ShoppingCart, Sparkles, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useTranslation } from './services/TranslationService';
import { QuickTTS } from './services/TTSService';
import { ImageWithFallback } from './figma/ImageWithFallback';
import communityImage from 'figma:asset/7e0158c16f92c94b81e9b1f3814ce8eb18767b21.png';

interface WelcomePageProps {}

export function WelcomePage({}: WelcomePageProps = {}) {
  const { t, language } = useTranslation();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [disabilityType, setDisabilityType] = useState('none');

 const features = [
  {
    icon: Bot,
    title: language === 'ar' ? 'المساعد الذكي المتطور' : 'Advanced AI Assistant',
    description: language === 'ar' 
      ? 'مساعد ذكي متطور بالذكاء الاصطناعي مع محادثة تفاعلية وإرشادات شخصية ومساعدة فورية'
      : 'Advanced AI assistant with interactive chat, personalized guidance, and instant help',
    color: 'from-[var(--color-dark-purple)] to-[var(--color-vibrant-orange)]'
  },
  {
    icon: Briefcase,
    title: language === 'ar' ? 'الفرص الوظيفية' : 'Job Opportunities',
    description: language === 'ar' 
      ? 'وظائف مخصصة لذوي الاحتياجات الخاصة مع ربط ذكي بـ LinkedIn'
      : 'Specialized jobs for people with disabilities with smart LinkedIn integration',
    color: 'from-[var(--color-dark-purple)] to-[var(--color-dark-purple)]'
  },
  {
    icon: Map,
    title: language === 'ar' ? 'المسارات الآمنة' : 'Safe Paths',
    description: language === 'ar'
      ? 'خرائط تفاعلية بتقنية Google Maps لأفضل طرق التنقل الآمن'
      : 'Interactive maps with Google Maps technology for the best safe navigation routes',
    color: 'from-[var(--color-calm-green)] to-[var(--color-calm-green)]'
  },
  {
    icon: Users,
    title: language === 'ar' ? 'المجتمع الداعم' : 'Supportive Community',
    description: language === 'ar'
      ? 'منصة تفاعلية لتبادل الخبرات والحصول على الدعم والمساعدة'
      : 'Interactive platform for sharing experiences and getting support and assistance',
    color: 'from-[var(--color-vibrant-orange)] to-[var(--color-vibrant-orange)]'
  },
  {
    icon: ShoppingCart,
    title: language === 'ar' ? 'المتجر والمساهمة' : 'Shop & Contribute',
    description: language === 'ar'
      ? 'أدوات مساعدة متخصصة وإمكانية المساهمة في تطوير المجتمع'
      : 'Specialized assistive tools and the ability to contribute to community development',
    color: 'from-[var(--color-dark-purple)] to-[var(--color-vibrant-orange)]'
  },
  {
    icon: Volume2,
    title: language === 'ar' ? 'القراءة الصوتية المتقدمة' : 'Advanced Text-to-Speech',
    description: language === 'ar'
      ? 'تقنية نطق متطورة باللهجة الأردنية لتجربة استماع طبيعية'
      : 'Advanced pronunciation technology in Jordanian dialect for a natural listening experience',
    color: 'from-[var(--color-calm-green)] to-[var(--color-dark-purple)]'
  }
];

  const testimonials = [
    {
      name: language === 'ar' ? 'سارة علي' : 'Sarah Ahmed',
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

  // تحديد نوع الإعاقة من localStorage أو من المستخدم المسجل
  useEffect(() => {
    const savedDisabilityType = localStorage.getItem('disabilityType') || 'none';
    setDisabilityType(savedDisabilityType);
  }, []);

  const welcomeMessage = language === 'ar' 
    ? 'أهلًا بكُم في وصّلة- جسرٌ نحوَ مجتمع شامل'
    : 'Welcome to Waslah - A Bridge Towards an Inclusive Community';

  // الحصول على إعدادات التكييف حسب نوع الإعاقة
  const getAccessibilitySettings = (type: string) => {
    switch (type) {
      case 'visual':
        return {
          showLargerButtons: true,
          useHighContrast: true,
          showAudioControls: true,
          fontSize: '1.2em',
          buttonPadding: '16px 24px'
        };
      case 'auditory':
        return {
          emphasizeVisualContent: true,
          showCaptions: true,
          useVisualIndicators: true,
          hideAudioOnlyContent: true
        };
      case 'cognitive':
        return {
          simplifyLayout: true,
          useLargerFonts: true,
          showClearInstructions: true,
          useCalmColors: true,
          fontSize: '1.15em',
          buttonPadding: '20px 32px'
        };
      case 'motor':
        return {
          increaseTouchTargets: true,
          showLargerButtons: true,
          addMoreSpacing: true,
          buttonMinSize: '48px',
          buttonPadding: '20px 32px'
        };
      default:
        return {
          fontSize: '1em',
          buttonPadding: '12px 20px'
        };
    }
  };

  const accessibilitySettings = getAccessibilitySettings(disabilityType);

  return (
    <div 
      className={`space-y-12 ${disabilityType}-impairment ${disabilityType === 'cognitive' ? 'simplified-grid' : ''} accessibility-enhanced`}
      style={{
        fontSize: accessibilitySettings.fontSize,
        lineHeight: disabilityType === 'cognitive' ? '1.8' : '1.6'
      }}
      role="main"
      aria-label={language === 'ar' ? 'صفحة الترحيب' : 'Welcome page'}
    >
      {/* Hero Section */}
      <section className="text-center space-y-8" aria-labelledby="hero-title">
        <div className="relative">
          <h1 
            id="hero-title"
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold bg-gradient-to-r from-[var(--color-dark-purple)] via-[var(--color-vibrant-orange)] to-[var(--color-calm-green)] bg-clip-text text-transparent mb-6 welcome-hero-title readable-text"
            style={{
              fontSize: disabilityType === 'visual' || disabilityType === 'cognitive' ? '3.5rem' : undefined
            }}
            tabIndex={0}
          >
            {welcomeMessage}
          </h1>
          <div className="absolute -top-4 -right-4 animate-bounce" aria-hidden="true">
            <Sparkles 
              className="w-8 h-8 text-[var(--color-vibrant-orange)] icon-decorative" 
              aria-hidden="true"
              focusable="false"
            />
          </div>
        </div>
        
        <p 
          className="text-lg md:text-xl lg:text-2xl font-body text-[var(--color-dark-purple)] dark:text-[var(--color-pastel-purple)] max-w-4xl mx-auto leading-relaxed readable-text"
          style={{
            fontSize: disabilityType === 'visual' || disabilityType === 'cognitive' ? '1.3em' : undefined
          }}
          role="text"
          aria-describedby="hero-title"
        >
          {language === 'ar' 
            ? 'فرصٌ مُتاحة للجميع' 
            : 'A Bridge Towards an Inclusive Community'}
        </p>

        {/* Hero Section - الصورة المرفقة */}
        <div className="relative max-w-6xl mx-auto mb-20 welcome-hero-section">
          {/* Community Image - Direct on Background */}
          <div className="hero-image-direct">
            <div className="relative group">
              <img
                src={communityImage}
                alt={language === 'ar' ? 'مجتمع متنوع من الأشخاص متضمناً شخص في كرسي متحرك يقفون على يدين داعمتين محاطين بالأوراق الخضراء، يرمز للتنوع والشمولية والدعم المجتمعي' : 'Diverse community of people including person in wheelchair standing on supportive hands surrounded by green leaves, symbolizing diversity, inclusion and community support'}
                className="w-full max-w-3xl h-auto object-contain welcome-main-image"
                role="img"
                loading="eager"
                decoding="async"
              />
              
              {/* Decorative Elements */}
              <div className="hero-decorative-elements" aria-hidden="true">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-[var(--color-vibrant-orange)] to-[var(--color-light-orange)] rounded-full animate-bounce opacity-80" aria-hidden="true"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-[var(--color-calm-green)] to-[var(--color-light-beige)] rounded-full animate-pulse opacity-70" aria-hidden="true"></div>
                <div className="absolute top-8 -left-8 w-4 h-4 bg-gradient-to-br from-[var(--color-pastel-purple)] to-[var(--color-dark-purple)] rounded-full animate-ping opacity-60" aria-hidden="true"></div>
              </div>
            </div>
          </div>

          {/* Supporting Text Below Image */}
          <div className="welcome-vision-section text-center space-y-8 mt-12" role="region" aria-labelledby="vision-section">
            <div className="welcome-divider">
              <div className="welcome-vision-badge">
                <span 
                  id="vision-section"
                  className="text-[var(--color-dark-purple)] dark:text-[var(--color-pastel-purple)] font-heading font-semibold text-sm"
                  role="heading"
                  aria-level="2"
                >
                  {language === 'ar' ? 'رؤيتنا' : 'Our Vision'}
                </span>
              </div>
            </div>
            
            <p 
              className="welcome-vision-text text-lg md:text-xl font-body max-w-5xl mx-auto readable-text"
              style={{
                fontSize: disabilityType === 'visual' || disabilityType === 'cognitive' ? '1.3em' : undefined,
                lineHeight: disabilityType === 'cognitive' ? '1.8' : '1.7'
              }}
              role="text"
              aria-describedby="vision-section"
            >
              {language === 'ar' 
                ? 'نؤمن بأن التنوع قوة، والشمولية حق و طريق نحو مجتمع أفضل. في وصلة، نسعى لكسر الحواجز وبناء الجسور نحو عالم يحتضن الجميع بكرامة ومحبة.'
                : 'We believe that diversity is strength, inclusion is a right and  the path to a better society. At Waslah, we strive to break barriers and build bridges toward a world that embraces everyone with dignity and love.'
              }
            </p>
          </div>
        </div>
      </section>

{/* Features Showcase */}
<section className="space-y-8" aria-labelledby="features-title">
  <div className="text-center">
    <h2 
      id="features-title"
      className="text-3xl font-heading font-bold mb-4"
      tabIndex={0}
    >
      {language === 'ar' ? 'ميزاتنا المتطورة' : 'Our Advanced Features'}
    </h2>
    <p 
      className="font-body text-gray-600 dark:text-gray-300 max-w-2xl mx-auto readable-text"
      role="text"
      aria-describedby="features-title"
    >
      {language === 'ar'
        ? 'اكتشف كيف يمكن لوصلة أن تحسن من جودة حياتك اليومية'
        : 'Discover how Waslah can improve your daily quality of life'}
    </p>
  </div>

  <div 
    className={`grid gap-6 ${
      disabilityType === 'cognitive' 
        ? 'grid-cols-1 md:grid-cols-2' 
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }`}
    role="list"
    aria-label={language === 'ar' ? 'قائمة الميزات المتاحة' : 'List of available features'}
  >
    {features.map((feature, index) => {
      const Icon = feature.icon;
      return (
        <Card 
          key={index} 
          className={`accessibility-card accessibility-transition hover:shadow-lg border-2 interactive-content ${
            currentFeature === index 
              ? 'border-[var(--color-pastel-purple)] shadow-lg scale-105' 
              : 'border-[var(--color-pastel-purple)]/50 dark:border-[var(--color-dark-purple)]/50'
          } ${disabilityType === 'cognitive' ? 'simplified-card' : ''}`}
          style={{
            minHeight: disabilityType === 'motor' ? '200px' : undefined,
            padding: accessibilitySettings.showLargerButtons ? '24px' : undefined
          }}
          role="listitem"
          tabIndex={0}
          aria-label={`${feature.title}: ${feature.description}`}
        >
          <CardHeader>
            <div 
              className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 feature-icon`}
              style={{
                width: disabilityType === 'motor' ? '60px' : '48px',
                height: disabilityType === 'motor' ? '60px' : '48px'
              }}
              aria-hidden="true"
              role="img"
              aria-label={feature.title}
            >
              <Icon 
                className="text-white icon-decorative" 
                size={disabilityType === 'motor' ? 32 : 24}
                aria-hidden="true"
                focusable="false"
              />
            </div>
            <CardTitle 
              className="text-lg font-heading"
              style={{
                fontSize: disabilityType === 'visual' || disabilityType === 'cognitive' ? '1.3em' : undefined
              }}
              role="heading"
              aria-level="3"
            >
              {feature.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p 
              className="text-[var(--color-dark-purple)] dark:text-[var(--color-pastel-purple)] leading-relaxed font-body readable-text"
              style={{
                fontSize: disabilityType === 'visual' || disabilityType === 'cognitive' ? '1.1em' : undefined,
                lineHeight: disabilityType === 'cognitive' ? '1.8' : '1.6'
              }}
              role="text"
            >
              {feature.description}
            </p>
          </CardContent>
        </Card>
      );
    })}
  </div>
</section>

      {/* Quick Access 
      <section aria-labelledby="quick-access-title">
        <Card className="bg-gradient-to-r from-[var(--color-dark-purple)] to-[var(--color-vibrant-orange)] text-white">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <h2 
                id="quick-access-title"
                className="text-2xl md:text-3xl font-heading font-bold"
                style={{
                  fontSize: disabilityType === 'visual' || disabilityType === 'cognitive' ? '2.5rem' : undefined
                }}
                tabIndex={0}
                role="heading"
                aria-level="2"
              >
                {language === 'ar' ? 'ابدأ رحلتك معنا' : 'Start Your Journey With Us'}
              </h2>
              <p 
                className="text-lg md:text-xl font-body opacity-90 max-w-2xl mx-auto readable-text"
                style={{
                  fontSize: disabilityType === 'visual' || disabilityType === 'cognitive' ? '1.3em' : undefined
                }}
                role="text"
                aria-describedby="quick-access-title"
              >
                {language === 'ar'
                  ? 'اختر الخدمة التي تحتاجها واستمتع بتجربة مصممة خصيصاً لك'
                  : 'Choose the service you need and enjoy an experience designed specifically for you'}
              </p>
              
              <div className={`grid gap-4 mt-8 ${
                disabilityType === 'cognitive' 
                  ? 'grid-cols-1 md:grid-cols-2' 
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
              }`}>
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
                      className="h-auto bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm welcome-action-button enhanced-focus"
                      style={{
                        padding: accessibilitySettings.buttonPadding,
                        minHeight: accessibilitySettings.buttonMinSize || '60px',
                        fontSize: disabilityType === 'visual' || disabilityType === 'cognitive' ? '1.1em' : undefined
                      }}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Icon 
                          className="text-white"
                          size={disabilityType === 'motor' ? 32 : 24}
                        />
                        <span className="font-body">{item.label}</span>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
*/}
      {/* Testimonials */}
      <section className="space-y-8" aria-labelledby="testimonials-title">
        <div className="text-center">
          <h2 
            id="testimonials-title"
            className="text-3xl font-heading font-bold mb-4"
            tabIndex={0}
          >
            {language === 'ar' ? 'قصص نجاح ملهمة' : 'Inspiring Success Stories'}
          </h2>
          <p 
            className="font-body text-gray-600 dark:text-gray-300 max-w-2xl mx-auto readable-text"
            role="text"
            aria-describedby="testimonials-title"
          >
            {language === 'ar'
              ? 'اكتشف كيف غيّرت وصلة حياة الآلاف من المستخدمين'
              : 'Discover how Waslah has changed the lives of thousands of users'}
          </p>
        </div>

        <div 
          className={`grid gap-6 ${
            disabilityType === 'cognitive' 
              ? 'grid-cols-1' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}
          role="list"
          aria-label={language === 'ar' ? 'قائمة الشهادات' : 'List of testimonials'}
        >
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
            className="border-2 border-lightPurple/30 accessibility-card
                      bg-gradient-to-br from-lightPurple/5 via-lighterPurple/10 to-lightestPurple/5
                      dark:from-lightPurple/20 dark:via-lighterPurple/15 dark:to-lightestPurple/10"

              style={{
                padding: disabilityType === 'motor' ? '24px' : undefined
              }}
              role="listitem"
              tabIndex={0}
              aria-label={`شهادة من ${testimonial.name}, ${testimonial.role}`}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div 
                    className="flex items-center space-x-1 rtl:space-x-reverse"
                    role="img"
                    aria-label={`تقييم ${testimonial.rating} من 5 نجوم`}
                  >
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Heart 
                        key={i} 
                        className="fill-[var(--color-vibrant-orange)] text-[var(--color-vibrant-orange)]"
                        size={disabilityType === 'visual' || disabilityType === 'motor' ? 20 : 16}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  
                  <p 
                    className="text-[var(--color-dark-purple)] dark:text-[var(--color-pastel-purple)] italic leading-relaxed font-body readable-text"
                    style={{
                      fontSize: disabilityType === 'visual' || disabilityType === 'cognitive' ? '1.1em' : undefined,
                      lineHeight: disabilityType === 'cognitive' ? '1.8' : '1.6'
                    }}
                    role="text"
                  >
                    "{testimonial.content}"
                  </p>
                  
                  <div className="border-t border-[var(--color-pastel-purple)]/30 pt-4">
                    <p 
                      className="font-semibold font-heading text-[var(--color-dark-purple)] dark:text-[var(--color-pastel-purple)]"
                      style={{
                        fontSize: disabilityType === 'visual' || disabilityType === 'cognitive' ? '1.1em' : undefined
                      }}
                    >
                      {testimonial.name}
                    </p>
                    <p 
                      className="text-sm text-[var(--color-dark-purple)]/70 dark:text-[var(--color-pastel-purple)]/70 font-body"
                      style={{
                        fontSize: disabilityType === 'visual' || disabilityType === 'cognitive' ? '1em' : undefined
                      }}
                    >
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Accessibility Notice */}
      <section aria-labelledby="accessibility-notice-title">
        <Card className="bg-[var(--color-calm-green)]/10 dark:bg-[var(--color-calm-green)]/20 border-[var(--color-calm-green)]/30 dark:border-[var(--color-calm-green)]">
          <CardContent 
            className="p-6"
            style={{
              padding: disabilityType === 'motor' ? '32px' : '24px'
            }}
          >
            <div className={`flex items-start ${language === 'ar' ? 'space-x-reverse' : ''} space-x-4`}>
              <Accessibility 
                className="text-[var(--color-calm-green)] mt-1 flex-shrink-0" 
                size={disabilityType === 'visual' || disabilityType === 'motor' ? 32 : 24}
                aria-hidden="true"
              />
              <div className="w-full text-center">
                <h3 
                  id="accessibility-notice-title"
                  className="font-heading font-semibold text-[var(--color-calm-green)] mb-2"
                  style={{
                    color: "var(--color-calm-green)",
                    filter: "brightness(0.7)" ,
                    fontSize: disabilityType === 'visual' || disabilityType === 'cognitive' ? '1.3em' : '1.125rem'
                  }}
                  role="heading"
                  aria-level="2"
                >
                  {language === 'ar' ? 'ملتزمون بالوصولية الرقمية' : 'Committed to Digital Accessibility'}
                </h3>
                <p 
                  className="w-full text-center whitespace-nowrap font-body text-[var(--color-calm-green)] leading-relaxed readable-text"
                  style={{
                    color: "var(--color-calm-green)",
                    filter: "brightness(0.7)" ,
                    fontSize: disabilityType === 'visual' || disabilityType === 'cognitive' ? '1.1em' : undefined,
                    lineHeight: disabilityType === 'cognitive' ? '1.8' : '1.6'
                  }}
                  role="text"
                >
                  {language === 'ar'
                    ? 'تم تصميم موقع وصلة وفقاً لأعلى معايير الوصولية الرقمية لضمان تجربة سلسة ومريحة لجميع المستخدمين. يمكنك تخصيص الموقع ليناسب احتياجاتك الخاصة من خلال لوحة الإعدادات.'
                    : 'The Waslah website has been designed according to the highest digital accessibility standards to ensure a smooth and comfortable experience for all users. You can customize the site to suit your specific needs through the settings panel.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
