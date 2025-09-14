import React, { useState } from 'react';
import { ShoppingCart, Heart, Star, Plus, Filter, Search, Package, Users, Award, DollarSign, Eye, Volume2, Hand, Brain, Truck, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useTranslation } from './services/TranslationService';

export function ContributeShopMarketplace() {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState('shop');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [cart, setCart] = useState([]);

  const products = [
    {
      id: 1,
      name: language === 'ar' ? 'عصا ذكية للمكفوفين' : 'Smart Cane for the Blind',
      description: language === 'ar' 
        ? 'عصا ذكية مزودة بأجهزة استشعار للكشف عن العوائق وتقنية GPS للملاحة'
        : 'Smart cane equipped with sensors for obstacle detection and GPS technology for navigation',
      price: 450,
      originalPrice: 520,
      rating: 4.8,
      reviews: 89,
      category: 'visual',
      seller: language === 'ar' ? 'متجر التقنيات المساعدة' : 'Assistive Tech Store',
      image: '/api/placeholder/300/200',
      features: [
        language === 'ar' ? 'كشف العوائق' : 'Obstacle detection',
        language === 'ar' ? 'تقنية GPS' : 'GPS technology',
        language === 'ar' ? 'إنذار صوتي' : 'Audio alerts',
        language === 'ar' ? 'مقاوم للماء' : 'Water resistant'
      ],
      inStock: true,
      fastShipping: true,
      contribution: 15 // Percentage that goes to community support
    },
    {
      id: 2,
      name: language === 'ar' ? 'سماعات تقوية الصوت' : 'Sound Amplification Headphones',
      description: language === 'ar'
        ? 'سماعات متطورة لتقوية الصوت مع تقنية إلغاء الضوضاء وتحسين الكلام'
        : 'Advanced sound amplification headphones with noise cancellation and speech enhancement technology',
      price: 280,
      originalPrice: 320,
      rating: 4.6,
      reviews: 156,
      category: 'hearing',
      seller: language === 'ar' ? 'عالم السمعيات' : 'Audio World',
      image: '/api/placeholder/300/200',
      features: [
        language === 'ar' ? 'تقوية الصوت' : 'Sound amplification',
        language === 'ar' ? 'إلغاء الضوضاء' : 'Noise cancellation',
        language === 'ar' ? 'تحسين الكلام' : 'Speech enhancement',
        language === 'ar' ? 'قابلة للشحن' : 'Rechargeable'
      ],
      inStock: true,
      fastShipping: false,
      contribution: 20
    },
    {
      id: 3,
      name: language === 'ar' ? 'وسادة مريحة للظهر' : 'Ergonomic Back Support Cushion',
      description: language === 'ar'
        ? 'وسادة طبية مصممة خصيصاً لدعم الظهر وتحسين الوضعية أثناء الجلوس'
        : 'Medical cushion specially designed to support the back and improve posture while sitting',
      price: 85,
      originalPrice: 110,
      rating: 4.4,
      reviews: 203,
      category: 'mobility',
      seller: language === 'ar' ? 'مركز الراحة الطبي' : 'Medical Comfort Center',
      image: '/api/placeholder/300/200',
      features: [
        language === 'ar' ? 'دعم طبي للظهر' : 'Medical back support',
        language === 'ar' ? 'مواد عالية الجودة' : 'High-quality materials',
        language === 'ar' ? 'قابلة للغسل' : 'Washable',
        language === 'ar' ? 'مناسبة لجميع الكراسي' : 'Fits all chairs'
      ],
      inStock: true,
      fastShipping: true,
      contribution: 10
    },
    {
      id: 4,
      name: language === 'ar' ? 'لوحة مفاتيح كبيرة الحروف' : 'Large Print Keyboard',
      description: language === 'ar'
        ? 'لوحة مفاتيح بحروف كبيرة وألوان متباينة لسهولة الاستخدام'
        : 'Large print keyboard with high contrast colors for easy use',
      price: 65,
      originalPrice: 85,
      rating: 4.7,
      reviews: 134,
      category: 'cognitive',
      seller: language === 'ar' ? 'تقنيات الوصولية' : 'Accessibility Tech',
      image: '/api/placeholder/300/200',
      features: [
        language === 'ar' ? 'حروف كبيرة' : 'Large print',
        language === 'ar' ? 'ألوان متباينة' : 'High contrast colors',
        language === 'ar' ? 'سهولة الاستخدام' : 'Easy to use',
        language === 'ar' ? 'متوافقة مع الكمبيوتر' : 'Computer compatible'
      ],
      inStock: true,
      fastShipping: true,
      contribution: 12
    },
    {
      id: 5,
      name: language === 'ar' ? 'جهاز قراءة النصوص' : 'Text Reading Device',
      description: language === 'ar'
        ? 'جهاز متطور لقراءة النصوص المطبوعة بصوت واضح ومفهوم'
        : 'Advanced device for reading printed texts with clear and understandable voice',
      price: 680,
      originalPrice: 750,
      rating: 4.9,
      reviews: 67,
      category: 'visual',
      seller: language === 'ar' ? 'الرؤية الذكية' : 'Smart Vision',
      image: '/api/placeholder/300/200',
      features: [
        language === 'ar' ? 'قراءة النصوص' : 'Text reading',
        language === 'ar' ? 'صوت واضح' : 'Clear voice',
        language === 'ar' ? 'سهل النقل' : 'Portable',
        language === 'ar' ? 'بطارية طويلة المدى' : 'Long battery life'
      ],
      inStock: false,
      fastShipping: false,
      contribution: 25
    },
    {
      id: 6,
      name: language === 'ar' ? 'مقبض خاص للأدوات' : 'Special Tool Grip',
      description: language === 'ar'
        ? 'مقبض مساعد لتسهيل استخدام الأدوات اليومية لذوي الإعاقة الحركية'
        : 'Assistive grip to facilitate the use of daily tools for people with mobility disabilities',
      price: 25,
      originalPrice: 35,
      rating: 4.3,
      reviews: 89,
      category: 'mobility',
      seller: language === 'ar' ? 'حلول الحياة اليومية' : 'Daily Life Solutions',
      image: '/api/placeholder/300/200',
      features: [
        language === 'ar' ? 'سهولة الاستخدام' : 'Easy to use',
        language === 'ar' ? 'مواد مرنة' : 'Flexible materials',
        language === 'ar' ? 'متين وقوي' : 'Durable and strong',
        language === 'ar' ? 'متعدد الاستخدامات' : 'Multi-purpose'
      ],
      inStock: true,
      fastShipping: true,
      contribution: 8
    }
  ];

  const categories = [
    { value: 'all', label: language === 'ar' ? 'جميع المنتجات' : 'All Products', icon: Package },
    { value: 'visual', label: language === 'ar' ? 'مساعدات بصرية' : 'Visual Aids', icon: Eye },
    { value: 'hearing', label: language === 'ar' ? 'مساعدات سمعية' : 'Hearing Aids', icon: Volume2 },
    { value: 'mobility', label: language === 'ar' ? 'مساعدات حركية' : 'Mobility Aids', icon: Hand },
    { value: 'cognitive', label: language === 'ar' ? 'مساعدات معرفية' : 'Cognitive Aids', icon: Brain }
  ];

  const priceRanges = [
    { value: 'all', label: language === 'ar' ? 'جميع الأسعار' : 'All Prices' },
    { value: '0-50', label: language === 'ar' ? 'أقل من 50 دينار' : 'Under 50 JOD' },
    { value: '50-200', label: '50-200 ' + (language === 'ar' ? 'دينار' : 'JOD') },
    { value: '200-500', label: '200-500 ' + (language === 'ar' ? 'دينار' : 'JOD') },
    { value: '500+', label: language === 'ar' ? 'أكثر من 500 دينار' : 'Over 500 JOD' }
  ];

  const contributions = [
    {
      id: 1,
      title: language === 'ar' ? 'دعم البرامج التعليمية' : 'Support Educational Programs',
      description: language === 'ar'
        ? 'ساهم في تطوير برامج تعليمية متخصصة لذوي الاحتياجات الخاصة'
        : 'Contribute to developing specialized educational programs for people with special needs',
      target: 10000,
      raised: 7500,
      contributors: 156,
      category: language === 'ar' ? 'تعليم' : 'Education',
      image: '/api/placeholder/400/200'
    },
    {
      id: 2,
      title: language === 'ar' ? 'تطوير تطبيقات الوصولية' : 'Develop Accessibility Apps',
      description: language === 'ar'
        ? 'ساعد في تطوير تطبيقات وأدوات تقنية لتحسين الوصولية الرقمية'
        : 'Help develop technical applications and tools to improve digital accessibility',
      target: 25000,
      raised: 18200,
      contributors: 298,
      category: language === 'ar' ? 'تقنية' : 'Technology',
      image: '/api/placeholder/400/200'
    },
    {
      id: 3,
      title: language === 'ar' ? 'مركز التأهيل المجتمعي' : 'Community Rehabilitation Center',
      description: language === 'ar'
        ? 'دعم إنشاء مركز تأهيل متخصص في منطقتك'
        : 'Support the establishment of a specialized rehabilitation center in your area',
      target: 50000,
      raised: 32100,
      contributors: 445,
      category: language === 'ar' ? 'مجتمعي' : 'Community',
      image: '/api/placeholder/400/200'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    let matchesPrice = true;
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(p => p.replace('+', ''));
      if (max) {
        matchesPrice = product.price >= parseInt(min) && product.price <= parseInt(max);
      } else {
        matchesPrice = product.price >= parseInt(min);
      }
    }
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
          {language === 'ar' ? 'المتجر والمساهمة' : 'Shop & Contribute'}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {language === 'ar' 
            ? 'تسوق أدوات مساعدة عالية الجودة أو ساهم في مشاريع تطوير المجتمع'
            : 'Shop for high-quality assistive tools or contribute to community development projects'}
        </p>
      </div>

      {/* Navigation Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="shop" className="flex items-center space-x-reverse space-x-2">
                <ShoppingCart className="w-4 h-4" />
                <span>{language === 'ar' ? 'المتجر' : 'Shop'}</span>
                {getCartItemsCount() > 0 && (
                  <Badge className="bg-orange-500 text-white ml-2">
                    {getCartItemsCount()}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="contribute" className="flex items-center space-x-reverse space-x-2">
                <Heart className="w-4 h-4" />
                <span>{language === 'ar' ? 'المساهمة' : 'Contribute'}</span>
              </TabsTrigger>
            </TabsList>

            {/* Shop Tab */}
            <TabsContent value="shop" className="space-y-6 mt-6">
              {/* Search and Filters */}
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={language === 'ar' ? 'ابحث عن المنتجات...' : 'Search products...'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder={language === 'ar' ? 'الفئة' : 'Category'} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center space-x-reverse space-x-2">
                              <Icon className="w-4 h-4" />
                              <span>{category.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder={language === 'ar' ? 'السعر' : 'Price'} />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' 
                      ? `عرض ${filteredProducts.length} من ${products.length} منتج`
                      : `Showing ${filteredProducts.length} of ${products.length} products`}
                  </p>
                  
                  {cart.length > 0 && (
                    <div className="flex items-center space-x-reverse space-x-4">
                      <span className="text-sm font-medium">
                        {language === 'ar' ? 'إجمالي السلة:' : 'Cart Total:'} {getCartTotal()} {language === 'ar' ? 'دينار' : 'JOD'}
                      </span>
                      <Button variant="outline" size="sm">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {language === 'ar' ? 'عرض السلة' : 'View Cart'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <div className="h-48 bg-gray-100 rounded-t-lg relative overflow-hidden">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge className="bg-red-500">
                              {language === 'ar' ? 'نفد المخزون' : 'Out of Stock'}
                            </Badge>
                          </div>
                        )}
                        {product.fastShipping && (
                          <Badge className="absolute top-2 right-2 bg-green-500">
                            <Truck className="w-3 h-3 mr-1" />
                            {language === 'ar' ? 'شحن سريع' : 'Fast Shipping'}
                          </Badge>
                        )}
                        <Badge className="absolute top-2 left-2 bg-orange-500">
                          {product.contribution}% {language === 'ar' ? 'للمجتمع' : 'to community'}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {language === 'ar' ? 'البائع:' : 'Seller:'} {product.seller}
                          </p>
                        </div>

                        <div className="flex items-center space-x-reverse space-x-2">
                          <div className="flex items-center space-x-reverse space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{product.rating}</span>
                            <span className="text-sm text-muted-foreground">({product.reviews})</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {product.features.slice(0, 2).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {product.features.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{product.features.length - 2} {language === 'ar' ? 'المزيد' : 'more'}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-reverse space-x-2">
                              <span className="text-lg font-bold text-green-600">
                                {product.price} {language === 'ar' ? 'دينار' : 'JOD'}
                              </span>
                              {product.originalPrice > product.price && (
                                <span className="text-sm line-through text-gray-500">
                                  {product.originalPrice} {language === 'ar' ? 'دينار' : 'JOD'}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-reverse space-x-1 text-xs text-orange-600">
                              <Heart className="w-3 h-3" />
                              <span>
                                {product.contribution}% {language === 'ar' ? 'يذهب للمساهمة المجتمعية' : 'goes to community contribution'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-reverse space-x-2">
                          <Button 
                            onClick={() => addToCart(product)}
                            disabled={!product.inStock}
                            className="flex-1 bg-orange-600 hover:bg-orange-700"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                          </Button>
                          <Button variant="outline" size="icon">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {language === 'ar' ? 'لا توجد منتجات' : 'No products found'}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === 'ar' 
                        ? 'جرب تعديل معايير البحث أو الفلاتر'
                        : 'Try adjusting your search criteria or filters'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Contribute Tab */}
            <TabsContent value="contribute" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {contributions.map((contribution) => (
                  <Card key={contribution.id} className="hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-100 rounded-t-lg relative overflow-hidden">
                      <ImageWithFallback
                        src={contribution.image}
                        alt={contribution.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-purple-500">
                        {contribution.category}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{contribution.title}</h3>
                          <p className="text-muted-foreground">{contribution.description}</p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{language === 'ar' ? 'المبلغ المحصل:' : 'Raised:'}</span>
                            <span className="font-medium">
                              {contribution.raised} / {contribution.target} {language === 'ar' ? 'دينار' : 'JOD'}
                            </span>
                          </div>
                          
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-600 to-orange-600 h-2 rounded-full transition-all"
                              style={{ width: `${(contribution.raised / contribution.target) * 100}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>
                              {Math.round((contribution.raised / contribution.target) * 100)}% {language === 'ar' ? 'مكتمل' : 'complete'}
                            </span>
                            <div className="flex items-center space-x-reverse space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{contribution.contributors} {language === 'ar' ? 'مساهم' : 'contributors'}</span>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="flex space-x-reverse space-x-2">
                          <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                            <Heart className="w-4 h-4 mr-2" />
                            {language === 'ar' ? 'ساهم الآن' : 'Contribute Now'}
                          </Button>
                          <Button variant="outline">
                            {language === 'ar' ? 'تفاصيل' : 'Details'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Call to Action */}
              <Card className="bg-gradient-to-r from-purple-600 to-orange-600 text-white">
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-reverse space-x-2 mb-4">
                      <Award className="w-8 h-8" />
                      <h2 className="text-2xl font-bold">
                        {language === 'ar' ? 'كن جزءاً من التغيير' : 'Be Part of the Change'}
                      </h2>
                    </div>
                    
                    <p className="text-lg opacity-90 max-w-2xl mx-auto">
                      {language === 'ar'
                        ? 'مساهمتك تصنع فرقاً حقيقياً في حياة آلاف الأشخاص ذوي الاحتياجات الخاصة'
                        : 'Your contribution makes a real difference in the lives of thousands of people with special needs'}
                    </p>
                    
                    <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-reverse md:space-x-4 mt-6">
                      <Button variant="secondary" size="lg" className="text-purple-600">
                        <Plus className="w-5 h-5 mr-2" />
                        {language === 'ar' ? 'اقترح مشروعاً جديداً' : 'Suggest New Project'}
                      </Button>
                      <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                        <Shield className="w-5 h-5 mr-2" />
                        {language === 'ar' ? 'ضمان الشفافية' : 'Transparency Guarantee'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}