import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Heart, 
  Megaphone, 
  Filter,
  Star,
  MapPin,
  Truck,
  Shield,
  CreditCard,
  Users,
  HandHeart,
  Building2
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useTranslation } from './services/TranslationService';

interface Product {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  seller: string;
  location: string;
  features: string[];
  inStock: boolean;
  accessibility: string[];
}

interface ContributionOption {
  id: string;
  type: 'donation' | 'volunteer' | 'sponsor' | 'advertise';
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: React.ComponentType<any>;
  color: string;
  benefits: string[];
  benefitsEn: string[];
}

export function ContributeShopPage() {
  const { t, language, isRTL } = useTranslation();
  const [activeTab, setActiveTab] = useState('shop');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<string[]>([]);

  // منتجات وهمية للأدوات المساعدة
  const products: Product[] = [
    {
      id: '1',
      name: 'كرسي متحرك كهربائي متطور',
      nameEn: 'Advanced Electric Wheelchair',
      description: 'كرسي متحرك كهربائي قابل للطي مع تحكم ذكي وبطارية طويلة المدى',
      descriptionEn: 'Foldable electric wheelchair with smart controls and long-lasting battery',
      price: 2500,
      originalPrice: 3000,
      category: 'mobility',
      rating: 4.8,
      reviews: 156,
      imageUrl: '',
      seller: 'مركز الأدوات الطبية',
      location: 'عمان، الأردن',
      features: ['قابل للطي', 'تحكم ذكي', 'بطارية 8 ساعات', 'وزن خفيف'],
      inStock: true,
      accessibility: ['مناسب للاستخدام الداخلي والخارجي', 'سهولة التحكم', 'آمان عالي']
    },
    {
      id: '2',
      name: 'سماعة طبية رقمية',
      nameEn: 'Digital Hearing Aid',
      description: 'سماعة طبية رقمية بتقنية إلغاء الضوضاء وتطبيق ذكي للتحكم',
      descriptionEn: 'Digital hearing aid with noise cancellation and smart app control',
      price: 800,
      originalPrice: 1000,
      category: 'hearing',
      rating: 4.6,
      reviews: 89,
      imageUrl: '',
      seller: 'عيادة السمع المتخصصة',
      location: 'إربد، الأردن',
      features: ['إلغاء الضوضاء', 'تحكم بالتطبيق', 'بطارية قابلة للشحن', 'مقاوم للماء'],
      inStock: true,
      accessibility: ['سهل الاستخدام', 'تصميم مريح', 'جودة صوت عالية']
    },
    {
      id: '3',
      name: 'جهاز نطق إلكتروني',
      nameEn: 'Electronic Speech Device',
      description: 'جهاز نطق إلكتروني مع شاشة تعمل باللمس وأصوات طبيعية باللغة العربية',
      descriptionEn: 'Electronic speech device with touchscreen and natural Arabic voices',
      price: 1200,
      category: 'communication',
      rating: 4.9,
      reviews: 42,
      imageUrl: '',
      seller: 'مركز التأهيل الشامل',
      location: 'الزرقاء، الأردن',
      features: ['شاشة لمس 10 بوصة', 'أصوات عربية طبيعية', 'قاموس شامل', 'تخصيص الرسائل'],
      inStock: true,
      accessibility: ['واجهة بسيطة', 'أزرار كبيرة', 'تخصيص شخصي']
    },
    {
      id: '4',
      name: 'نظارة قراءة إلكترونية',
      nameEn: 'Electronic Reading Glasses',
      description: 'نظارة ذكية تقرأ النصوص بصوت عالٍ وتتعرف على الوجوه والأشياء',
      descriptionEn: 'Smart glasses that read text aloud and recognize faces and objects',
      price: 1800,
      category: 'visual',
      rating: 4.4,
      reviews: 67,
      imageUrl: '',
      seller: 'تكنولوجيا الرؤية',
      location: 'عمان، الأردن',
      features: ['تعرف على النصوص', 'تحديد الوجوه', 'ترجمة فورية', 'تنقل ذكي'],
      inStock: false,
      accessibility: ['سهل الارتداء', 'صوت واضح', 'تحكم صوتي']
    },
    {
      id: '5',
      name: 'حصيرة توازن ذكية',
      nameEn: 'Smart Balance Mat',
      description: 'حصيرة تدريب ذكية لتحسين التوازن مع تطبيق للمتابعة والتمارين',
      descriptionEn: 'Smart training mat to improve balance with app for tracking and exercises',
      price: 350,
      category: 'mobility',
      rating: 4.3,
      reviews: 123,
      imageUrl: '',
      seller: 'مركز العلاج الطبيعي',
      location: 'إربد، الأردن',
      features: ['حساسات دقيقة', 'تمارين مخصصة', 'تتبع التقدم', 'مواد آمنة'],
      inStock: true,
      accessibility: ['آمن للاستخدام', 'تعليمات صوتية', 'مناسب لجميع الأعمار']
    },
    {
      id: '6',
      name: 'مقبض باب ذكي',
      nameEn: 'Smart Door Handle',
      description: 'مقبض باب ذكي يفتح بالبصمة أو الكارت للأشخاص ذوي الإعاقة الحركية',
      descriptionEn: 'Smart door handle that opens with fingerprint or card for people with mobility impairments',
      price: 180,
      category: 'home',
      rating: 4.7,
      reviews: 94,
      imageUrl: '',
      seller: 'منازل ذكية',
      location: 'عمان، الأردن',
      features: ['فتح بالبصمة', 'تحكم عن بُعد', 'بطارية طويلة', 'تركيب سهل'],
      inStock: true,
      accessibility: ['لا يحتاج قوة', 'فتح سريع', 'آمن ومحمي']
    }
  ];

  // خيارات المساهمة
  const contributionOptions: ContributionOption[] = [
    {
      id: 'donation',
      type: 'donation',
      title: 'تبرع الآن',
      titleEn: 'Donate Now',
      description: 'ساهم في دعم ذوي الاحتياجات الخاصة من خلال التبرع المباشر',
      descriptionEn: 'Support people with special needs through direct donations',
      icon: Heart,
      color: 'bg-red-500',
      benefits: [
        'دعم برامج التأهيل',
        'توفير أدوات مساعدة مجانية',
        'تمويل ورش تدريبية',
        'بناء مراكز متخصصة'
      ],
      benefitsEn: [
        'Support rehabilitation programs',
        'Provide free assistive tools',
        'Fund training workshops',
        'Build specialized centers'
      ]
    },
    {
      id: 'volunteer',
      type: 'volunteer',
      title: 'تطوع معنا',
      titleEn: 'Volunteer With Us',
      description: 'انضم لفريق المتطوعين وساهم بوقتك ومهاراتك',
      descriptionEn: 'Join our volunteer team and contribute your time and skills',
      icon: Users,
      color: 'bg-blue-500',
      benefits: [
        'تدريب مجاني متخصص',
        'شهادات معتمدة',
        'شبكة علاقات واسعة',
        'تطوير المهارات الشخصية'
      ],
      benefitsEn: [
        'Free specialized training',
        'Certified certificates',
        'Wide network',
        'Personal skill development'
      ]
    },
    {
      id: 'sponsor',
      type: 'sponsor',
      title: 'كن راعياً',
      titleEn: 'Be a Sponsor',
      description: 'رعاية الفعاليات والبرامج لدعم المجتمع',
      descriptionEn: 'Sponsor events and programs to support the community',
      icon: HandHeart,
      color: 'bg-green-500',
      benefits: [
        'ظهور علامتك التجارية',
        'تقارير تأثير مفصلة',
        'شراكة طويلة المدى',
        'مسؤولية اجتماعية'
      ],
      benefitsEn: [
        'Brand visibility',
        'Detailed impact reports',
        'Long-term partnership',
        'Social responsibility'
      ]
    },
    {
      id: 'advertise',
      type: 'advertise',
      title: 'اعلن معنا',
      titleEn: 'Advertise With Us',
      description: 'اعرض خدماتك ومنتجاتك المناسبة لذوي الاحتياجات الخاصة',
      descriptionEn: 'Showcase your services and products suitable for people with special needs',
      icon: Megaphone,
      color: 'bg-purple-500',
      benefits: [
        'وصول لجمهور متخصص',
        'حملات إعلانية مستهدفة',
        'تسويق أخلاقي',
        'شراكة تجارية مربحة'
      ],
      benefitsEn: [
        'Reach specialized audience',
        'Targeted advertising campaigns',
        'Ethical marketing',
        'Profitable business partnership'
      ]
    }
  ];

  const categories = {
    all: language === 'ar' ? 'الكل' : 'All',
    mobility: language === 'ar' ? 'أدوات حركية' : 'Mobility Aids',
    hearing: language === 'ar' ? 'أدوات سمعية' : 'Hearing Aids',
    visual: language === 'ar' ? 'أدوات بصرية' : 'Visual Aids',
    communication: language === 'ar' ? 'أجهزة تواصل' : 'Communication',
    home: language === 'ar' ? 'إمكانيات منزلية' : 'Home Accessibility'
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const addToCart = (productId: string) => {
    setCart(prev => [...prev, productId]);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(id => id !== productId));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {t('contributeShop')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t('contributeShopDesc')}
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="shop" className="flex items-center space-x-reverse space-x-2">
            <ShoppingCart className="w-4 h-4" />
            <span>{t('shop')}</span>
          </TabsTrigger>
          <TabsTrigger value="contribute" className="flex items-center space-x-reverse space-x-2">
            <Heart className="w-4 h-4" />
            <span>{t('contribute')}</span>
          </TabsTrigger>
          <TabsTrigger value="advertise" className="flex items-center space-x-reverse space-x-2">
            <Megaphone className="w-4 h-4" />
            <span>{t('advertise')}</span>
          </TabsTrigger>
        </TabsList>

        {/* Shop Tab */}
        <TabsContent value="shop" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center space-x-reverse space-x-4">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categories).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" className="flex items-center space-x-reverse space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>{t('cart')} ({cart.length})</span>
            </Button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-t-lg relative overflow-hidden">
                    <ImageWithFallback
                      src={`https://images.unsplash.com/photo-1559134203-d2c7df0a3f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZXF1aXBtZW50JTIwYXNzaXN0aXZlJTIwdG9vbHN8ZW58MXx8fHwxNzU3NDM3ODc4fDA&ixlib=rb-4.1.0&q=80&w=1080`}
                      alt={language === 'ar' ? product.name : product.nameEn}
                      className="w-full h-full object-cover"
                    />
                    {product.originalPrice && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </Badge>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive">
                          {language === 'ar' ? 'نفد المخزون' : 'Out of Stock'}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold line-clamp-1">
                      {language === 'ar' ? product.name : product.nameEn}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {language === 'ar' ? product.description : product.descriptionEn}
                    </p>
                  </div>

                  <div className="flex items-center space-x-reverse space-x-2">
                    <div className="flex items-center space-x-reverse space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviews})
                    </span>
                  </div>

                  <div className="flex items-center space-x-reverse space-x-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{product.seller}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {product.features.slice(0, 2).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-reverse space-x-2">
                        <span className="font-bold text-lg">
                          {product.price} {language === 'ar' ? 'د.أ' : 'JOD'}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {product.originalPrice} {language === 'ar' ? 'د.أ' : 'JOD'}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      disabled={!product.inStock}
                      onClick={() => addToCart(product.id)}
                      className="flex items-center space-x-reverse space-x-1"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span>{t('addToCart')}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Contribute Tab */}
        <TabsContent value="contribute" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contributionOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Card key={option.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-reverse space-x-3">
                      <div className={`w-12 h-12 ${option.color} rounded-full flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle>{language === 'ar' ? option.title : option.titleEn}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {language === 'ar' ? option.description : option.descriptionEn}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">
                        {language === 'ar' ? 'المميزات:' : 'Benefits:'}
                      </h4>
                      <ul className="space-y-1">
                        {(language === 'ar' ? option.benefits : option.benefitsEn).map((benefit, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center space-x-reverse space-x-2">
                            <div className="w-1 h-1 bg-current rounded-full"></div>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button className="w-full">
                      {language === 'ar' ? 'ابدأ الآن' : 'Get Started'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Advertise Tab */}
        <TabsContent value="advertise" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-reverse space-x-2">
                <Building2 className="w-5 h-5" />
                <span>{language === 'ar' ? 'تقديم طلب إعلان' : 'Submit Advertisement Request'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {language === 'ar' ? 'اسم الشركة' : 'Company Name'}
                  </label>
                  <Input placeholder={language === 'ar' ? 'اسم شركتك' : 'Your company name'} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </label>
                  <Input type="email" placeholder={language === 'ar' ? 'email@company.com' : 'email@company.com'} />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {language === 'ar' ? 'نوع الخدمة أو المنتج' : 'Service or Product Type'}
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'ar' ? 'اختر النوع' : 'Select type'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assistive-tech">{language === 'ar' ? 'تقنيات مساعدة' : 'Assistive Technology'}</SelectItem>
                    <SelectItem value="healthcare">{language === 'ar' ? 'رعاية صحية' : 'Healthcare'}</SelectItem>
                    <SelectItem value="education">{language === 'ar' ? 'تعليم' : 'Education'}</SelectItem>
                    <SelectItem value="employment">{language === 'ar' ? 'توظيف' : 'Employment'}</SelectItem>
                    <SelectItem value="accessibility">{language === 'ar' ? 'إمكانية الوصول' : 'Accessibility'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {language === 'ar' ? 'وصف الخدمة' : 'Service Description'}
                </label>
                <Textarea 
                  rows={4}
                  placeholder={language === 'ar' 
                    ? 'اكتب وصفاً مفصلاً عن خدمتك أو منتجك وكيف يساعد ذوي الاحتياجات الخاصة'
                    : 'Write a detailed description of your service or product and how it helps people with special needs'
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {language === 'ar' ? 'الميزانية المطلوبة' : 'Requested Budget'}
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? 'اختر الميزانية' : 'Select budget'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">100-500 JOD</SelectItem>
                      <SelectItem value="standard">500-1500 JOD</SelectItem>
                      <SelectItem value="premium">1500-5000 JOD</SelectItem>
                      <SelectItem value="enterprise">5000+ JOD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {language === 'ar' ? 'مدة الحملة' : 'Campaign Duration'}
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? 'اختر المدة' : 'Select duration'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1month">{language === 'ar' ? 'شهر واحد' : '1 Month'}</SelectItem>
                      <SelectItem value="3months">{language === 'ar' ? '3 أشهر' : '3 Months'}</SelectItem>
                      <SelectItem value="6months">{language === 'ar' ? '6 أشهر' : '6 Months'}</SelectItem>
                      <SelectItem value="1year">{language === 'ar' ? 'سنة كاملة' : '1 Year'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button className="w-full">
                {language === 'ar' ? 'إرسال طلب الإعلان' : 'Submit Advertisement Request'}
              </Button>
            </CardContent>
          </Card>

          {/* Advertisement Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center space-y-2">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-medium">
                  {language === 'ar' ? 'جمهور متخصص' : 'Specialized Audience'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' 
                    ? 'وصول مباشر لذوي الاحتياجات الخاصة وأسرهم'
                    : 'Direct access to people with special needs and their families'
                  }
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center space-y-2">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-medium">
                  {language === 'ar' ? 'ثقة عالية' : 'High Trust'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' 
                    ? 'منصة موثوقة تضمن جودة الخدمات المعلن عنها'
                    : 'Trusted platform ensuring quality of advertised services'
                  }
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center space-y-2">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                  <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-medium">
                  {language === 'ar' ? 'عائد استثمار عالي' : 'High ROI'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' 
                    ? 'حملات إعلانية مستهدفة تحقق نتائج ممتازة'
                    : 'Targeted campaigns achieving excellent results'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}