import React, { useState, useMemo } from 'react';
import { ShoppingCart, Heart, Star, Plus, Minus, Filter, Search, Package, Users, Award, DollarSign, Eye, Volume2, Hand, Brain, Truck, Shield, X, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useTranslation } from './services/TranslationService';
// import './ContributeShopMarketplace.css'; // تأكد من تعديل المسار حسب هيكلة ملفاتك

// تحديد أنواع البيانات
type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  category?: string;
  seller?: string;
  image?: string;
  features?: string[];
  inStock?: boolean;
  fastShipping?: boolean;
  contribution?: number;
};
type CartItem = Product & { quantity: number };

// إضافة نوع لحالة الترتيب
type SortOption = 'ai_smart' | 'price_asc' | 'rating_desc' | 'default';

export function ContributeShopMarketplace() {
  const { t, language } = useTranslation();

  const [activeTab, setActiveTab] = useState<string>('shop');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('ai_smart');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [showCartPanel, setShowCartPanel] = useState<boolean>(false);
  const [showFavoritesPanel, setShowFavoritesPanel] = useState<boolean>(false);

  // تحديث المنتجات بصور حقيقية باستخدام مسارات محلية
  const products: Product[] = useMemo(() => [
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
      image: '/image/عصا الكترونيه.jpg', // 👈 مسار صورة محلية
      features: [
        language === 'ar' ? 'كشف العوائق' : 'Obstacle detection',
        language === 'ar' ? 'تقنية GPS' : 'GPS technology',
        language === 'ar' ? 'إنذار صوتي' : 'Audio alerts',
        language === 'ar' ? 'مقاوم للماء' : 'Water resistant'
      ],
      inStock: true,
      fastShipping: true,
      contribution: 15
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
      image: '/image/سماعه.webp', // 👈 مسار صورة محلية
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
      price: 15,
      originalPrice: 25,
      rating: 4.4,
      reviews: 203,
      category: 'mobility',
      seller: language === 'ar' ? 'مركز الراحة الطبي' : 'Medical Comfort Center',
      image: '/image/وساده.jpg', // 👈 مسار صورة محلية
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
 name: language === 'ar' ? ' مؤقتات زمنية بصرية ' : 'Visual Time Timer',
      description: language === 'ar'
        ? 'أداة مساعدة تعرض الوقت المتبقي على شكل قرص لوني يتلاشى تدريجياً. مثالي لدعم التركيز، إدارة الوقت، والانتقال السلس بين المهام لذوي الإعاقة العقلية والاحتياجات الخاصة.         '
        : 'An assistive tool that displays the remaining time as a colored disc that gradually disappears. Ideal for supporting focus, time management, and smooth transitions between tasks for individuals with intellectual disabilities and special needs.',
      price: 5,
      originalPrice: 10,
      rating: 4.7,
      reviews: 134,
      category: 'cognitive',
      seller: language === 'ar' ? 'تقنيات الوصولية' : 'Accessibility Tech',
      image: '/image/مؤقت_.jpg', // 👈 مسار صورة محلية
      features: [
            language === 'ar' ? '  تمثيل بصري للوقت' : 'Visual Time Display',
        language === 'ar' ? 'مواد عالية الجودة' : 'High-quality materials',
        language === 'ar' ? ' قرص لوني متناقص' : 'Gradually Disappearing Colored Disc',
      
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
      price: 50,
      originalPrice: 70,
      rating: 4.9,
      reviews: 67,
      category: 'visual',
      seller: language === 'ar' ? 'الرؤية الذكية' : 'Smart Vision',
      image: '/image/جهاز قارئ نصوص_.jpg', // 👈 مسار صورة محلية
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
      image: '/image/مقبض.jpg', // 👈 مسار صورة محلية
      features: [
        language === 'ar' ? 'سهولة الاستخدام' : 'Easy to use',
        language === 'ar' ? 'مواد مرنة' : 'Flexible materials',
        language === 'ar' ? 'متين وقوي' : 'Durable and strong',
        language === 'ar' ? 'متعدد الاستخدامات' : 'Multi-purpose'
      ],
      inStock: true,
      fastShipping: true,
      contribution: 8
    },
    {
      id: 7,
      name: language === 'ar' ? ' نظارات عمى الألوان ' : 'Filter Color Blindness Glasses  ',
      description: language === 'ar'
        ? '       تزيد التباين بين الأحمر والأخضر باستخدام فلاتر بصرية لتحسين تمييز الألوان لمرضى الديوتيرانوماليا والبروتانوماليا.'
        : 'Increase the contrast between red and green using specialized optical filters to improve color distinction for those with Deuteranomaly and Protanomaly..',
      price: 100,
      originalPrice: 130,
      rating: 5.0,
      reviews: 55,
      category: 'visual',
      seller: language === 'ar' ? 'تقنيات الوصولية' : 'Accessibility Tech',
      image: '/image/نظاره.jpg', // 👈 مسار صورة محلية
      features: [
        language === 'ar' ? ' تحسين رؤية اللون الأحمر والأخضر' : 'Enhanced Red-Green Color Vision ',
        language === 'ar' ? 'عدسات ذات طلاء فلتر انتقائي ' : 'Selective Filter Coated Lenses ',
        language === 'ar' ? 'خفيف الوزن' : 'Lightweight'
      ],
      inStock: true,
      fastShipping: false,
      contribution: 30
    },
  ], [language]); // اعتماد المنتجات على اللغة

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

  const sortOptions = [
    { value: 'ai_smart', label: language === 'ar' ? 'ترتيب ذكي (جودة و سعر و قرب)' : 'AI Smart Sort (Quality, Price & Nearness)', icon: Zap },
    { value: 'price_asc', label: language === 'ar' ? 'السعر: الأرخص أولاً' : 'Price: Lowest First', icon: DollarSign },
    { value: 'rating_desc', label: language === 'ar' ? 'التقييم: الأفضل أولاً' : 'Rating: Highest First', icon: Star },
    { value: 'default', label: language === 'ar' ? 'الافتراضي' : 'Default', icon: Filter }
  ];

  // دالة الترتيب الذكي (محاكاة لمنطق AI)
  const aiSmartSort = (a: Product, b: Product): number => {
    // 1. عامل السعر (السعر الأرخص أفضل): تطبيع السعر (بافتراض أقصى سعر 2000 JOD)
    const priceWeightA = 1 - (a.price / 2000);
    const priceWeightB = 1 - (b.price / 2000);

    // 2. عامل الجودة/التقييم (التقييم الأحسن أفضل): تطبيع التقييم (بافتراض أقصى تقييم 5.0)
    const ratingWeightA = (a.rating || 0) / 5.0;
    const ratingWeightB = (b.rating || 0) / 5.0;

    // 3. عامل القرب/الشحن (الشحن الأسرع أفضل): يحاكي "المكان الأقرب"
    const shippingWeightA = a.fastShipping ? 0.3 : 0; 
    const shippingWeightB = b.fastShipping ? 0.3 : 0;

    // دمج الأوزان: 40% للسعر، 40% للتقييم، 20% للشحن
    const scoreA = (priceWeightA * 0.4) + (ratingWeightA * 0.4) + (shippingWeightA * 0.2);
    const scoreB = (priceWeightB * 0.4) + (ratingWeightB * 0.4) + (shippingWeightB * 0.2);

    // الترتيب تنازليًا حسب النقاط
    if (scoreB === scoreA) {
      // كسر التعادل بالتقييم
      return (b.rating || 0) - (a.rating || 0);
    }
    return scoreB - scoreA;
  };


  // استخدام useMemo لتطبيق الفلترة والترتيب بكفاءة
  const filteredAndSortedProducts = useMemo(() => {
    let currentProducts = products.filter((product: Product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(searchTerm.toLowerCase());
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

    // تطبيق الترتيب بناءً على الاختيار
    if (sortBy === 'ai_smart') {
      currentProducts.sort(aiSmartSort);
    } else if (sortBy === 'price_asc') {
      currentProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'rating_desc') {
      currentProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return currentProducts;
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);


  const addToCart = (product: Product) => {
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

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleFavorite = (product: Product) => {
    setFavorites(prev => {
      const isFavorite = prev.some(item => item.id === product.id);
      if (isFavorite) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const removeFromFavorites = (productId: number) => {
    setFavorites(prev => prev.filter(item => item.id !== productId));
  };

  const addToCartFromFavorites = (product: Product) => {
    addToCart(product);
    removeFromFavorites(product.id);
  };

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getFavoritesCount = () => {
    return favorites.length;
  };

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
      image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400&h=200'
    },
    {
      id: 2,
      title: language === 'ar' ? 'تطوير تطبيقات الوصولية' : 'Develop Accessibility Apps',
      description: language === 'ar'
        ? 'ساعد في تطوير تطبيقات وأدوات تقنية لتحسين الوصولية الرقمية'
        : 'Help develop apps and tools to improve digital accessibility',
      target: 15000,
      raised: 9000,
      contributors: 230,
      category: language === 'ar' ? 'تقنية' : 'Technology',
      image: 'https://images.pexels.com/photos/1181674/pexels-photo-1181674.jpeg?auto=compress&cs=tinysrgb&w=400&h=200'
    }
  ];

  return (
    <div className="space-y-6">

      {/* 🛠️ الكود الجديد: شريط أيقونات ثابت في الأسفل - تم تعديل الترتيب واللون */}
      <div className="fixed bottom-4 right-4 z-50 bg-transparent">
        <div className="flex flex-col space-y-4"> {/* 🛠️ التعديل هنا: flex-col و space-y-4 للترتيب العمودي */}
          <button
            type="button"
            onClick={() => setShowFavoritesPanel(true)}
            title={language === 'ar' ? 'عرض المفضلة' : 'Open favorites'}
            aria-label={language === 'ar' ? 'عرض المفضلة' : 'Open favorites'}
            // 🛠️ تم تعديل اللون: خلفية بيضاء، حدود بلون الموقع، ظل واضح
            className="relative p-3 bg-white dark:bg-gray-800 text-[var(--color-dark-purple)] hover:text-[var(--color-vibrant-orange)] transition-colors rounded-full shadow-xl border-2 border-[var(--color-pastel-purple)] dark:border-[var(--color-dark-purple)]"
          >
            <Heart className="w-6 h-6" />
            {getFavoritesCount() > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white">
                {getFavoritesCount()}
              </Badge>
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowCartPanel(true)}
            title={language === 'ar' ? 'عرض السلة' : 'Open cart'}
            aria-label={language === 'ar' ? 'عرض السلة' : 'Open cart'}
            // 🛠️ تم تعديل اللون: خلفية بيضاء، حدود بلون الموقع، ظل واضح
            className="relative p-3 bg-white dark:bg-gray-800 text-[var(--color-dark-purple)] hover:text-[var(--color-vibrant-orange)] transition-colors rounded-full shadow-xl border-2 border-[var(--color-vibrant-orange)]"
          >
            <ShoppingCart className="w-6 h-6" />
            {getCartItemsCount() > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-[var(--color-vibrant-orange)] text-white">
                {getCartItemsCount()}
              </Badge>
            )}
          </button>
        </div>
      </div>
      {/* نهاية كتلة الأيقونات الثابتة */}


      {/* Cart Panel (اللوحة الجانبية للسلة) */}
      {showCartPanel && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCartPanel(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">
                  {language === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCartPanel(false)}
                  title={language === 'ar' ? 'إغلاق السلة' : 'Close cart'}
                  aria-label={language === 'ar' ? 'إغلاق السلة' : 'Close cart'}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">
                      {language === 'ar' ? 'سلة التسوق فارغة' : 'Cart is empty'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-reverse space-x-3 p-3 border rounded-lg">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium line-clamp-1">{item.name}</h4>
                          <p className="text-sm text-gray-500">
                            {item.price} {language === 'ar' ? 'دينار' : 'JOD'}
                          </p>
                          <div className="flex items-center space-x-reverse space-x-2 mt-2">
                            <button
                              type="button"
                              title={language === 'ar' ? 'تقليل الكمية' : 'Decrease quantity'}
                              aria-label={language === 'ar' ? 'تقليل الكمية' : 'Decrease quantity'}
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              type="button"
                              title={language === 'ar' ? 'زيادة الكمية' : 'Increase quantity'}
                              aria-label={language === 'ar' ? 'زيادة الكمية' : 'Increase quantity'}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <button
                          type="button"
                          title={language === 'ar' ? 'إزالة من السلة' : 'Remove from cart'}
                          aria-label={language === 'ar' ? 'إزالة من السلة' : 'Remove from cart'}
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cart.length > 0 && (
                <div className="border-t p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">
                      {language === 'ar' ? 'الإجمالي:' : 'Total:'}
                    </span>
                    <span className="font-bold text-lg">
                      {getCartTotal()} {language === 'ar' ? 'دينار' : 'JOD'}
                    </span>
                  </div>
                  <div className="flex space-x-reverse space-x-2">
                    <Button
                      onClick={clearCart}
                      variant="outline"
                      className="flex-1 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      {language === 'ar' ? 'إفراغ السلة' : 'Clear Cart'}
                    </Button>
                    <Button className="flex-1 bg-[var(--color-vibrant-orange)] hover:bg-[var(--color-vibrant-orange)]/90 text-white">
                      {language === 'ar' ? 'الدفع' : 'Checkout'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Favorites Panel (اللوحة الجانبية للمفضلة) */}
      {showFavoritesPanel && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFavoritesPanel(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">
                  {language === 'ar' ? 'المفضلة' : 'Favorites'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowFavoritesPanel(false)}
                  title={language === 'ar' ? 'إغلاق المفضلة' : 'Close favorites'}
                  aria-label={language === 'ar' ? 'إغلاق المفضلة' : 'Close favorites'}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {favorites.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">
                      {language === 'ar' ? 'قائمة المفضلة فارغة' : 'Favorites list is empty'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {favorites.map((item) => (
                      <div key={item.id} className="flex items-center space-x-reverse space-x-3 p-3 border rounded-lg">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium line-clamp-1">{item.name}</h4>
                          <p className="text-sm text-gray-500">
                            {item.price} {language === 'ar' ? 'دينار' : 'JOD'}
                          </p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button
                            type="button"
                            title={language === 'ar' ? 'أضف إلى السلة' : 'Add to cart'}
                            aria-label={language === 'ar' ? 'أضف إلى السلة' : 'Add to cart'}
                            onClick={() => addToCartFromFavorites(item)}
                            className="p-1 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            title={language === 'ar' ? 'إزالة من المفضلة' : 'Remove from favorites'}
                            aria-label={language === 'ar' ? 'إزالة من المفضلة' : 'Remove from favorites'}
                            onClick={() => removeFromFavorites(item.id)}
                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--color-vibrant-orange)] to-[var(--color-dark-purple)] bg-clip-text text-transparent">
            {language === 'ar' ? 'المتجر والمساهمة' : 'Shop & Contribute'}
          </h1>
          <p className="text-xl text-[var(--color-dark-purple)] dark:text-[var(--color-pastel-purple)] max-w-3xl mx-auto">
            {language === 'ar'
              ? 'تسوق أدوات مساعدة عالية الجودة أو ساهم في مشاريع تطوير المجتمع'
              : 'Shop for high-quality assistive tools or contribute to community development projects'}
          </p>
        </div>

        {/* Navigation Tabs */}
        <Card className="border-[var(--color-pastel-purple)] dark:border-[var(--color-dark-purple)]">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 bg-[var(--color-light-beige)] dark:bg-[var(--color-dark-purple)]">
                <TabsTrigger
                  value="shop"
                  className="flex items-center space-x-reverse space-x-2 data-[state=active]:bg-[var(--color-vibrant-orange)] data-[state=active]:text-white"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{language === 'ar' ? 'المتجر' : 'Shop'}</span>
                  {getCartItemsCount() > 0 && (
                    <Badge className="bg-[var(--color-light-orange)] text-[var(--color-dark-purple)] ml-2">
                      {getCartItemsCount()}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="contribute"
                  className="flex items-center space-x-reverse space-x-2 data-[state=active]:bg-[var(--color-dark-purple)] data-[state=active]:text-white"
                >
                  <Heart className="w-4 h-4" />
                  <span>{language === 'ar' ? 'المساهمة' : 'Contribute'}</span>
                </TabsTrigger>
              </TabsList>

              {/* Shop Tab */}
              <TabsContent value="shop" className="space-y-6 mt-6">
                {/* Search and Filters & Sorting */}
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
                    {/* فلتر الإعاقة (Category) */}
                    <Select value={selectedCategory} onValueChange={(value: string) => setSelectedCategory(value)}> 
                      <SelectTrigger className="w-full md:w-48 border-[var(--color-dark-purple)]">
                        <SelectValue placeholder={language === 'ar' ? 'نوع الإعاقة (الفئة)' : 'Disability Type (Category)'} />
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
                    {/* فلتر السعر */}
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder={language === 'ar' ? 'نطاق السعر' : 'Price Range'} />
                      </SelectTrigger>
                      <SelectContent>
                        {priceRanges.map((range) => (
                          <SelectItem key={range.value} value={range.value}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* الترتيب (Sort By) */}
                    <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                      <SelectTrigger className="w-full md:w-48 border-[var(--color-vibrant-orange)]">
                        <SelectValue placeholder={language === 'ar' ? 'ترتيب حسب' : 'Sort By'} />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => {
                          const Icon = option.icon;
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center space-x-reverse space-x-2">
                                <Icon className={`w-4 h-4 ${option.value === 'ai_smart' ? 'text-green-500' : ''}`} />
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[var(--color-dark-purple)]/70 dark:text-[var(--color-pastel-purple)]/70">
                      {language === 'ar'
                        ? `عرض ${filteredAndSortedProducts.length} من ${products.length} منتج`
                        : `Showing ${filteredAndSortedProducts.length} of ${products.length} products`}
                    </p>
                    {cart.length > 0 && (
                      <div className="flex items-center space-x-reverse space-x-4">
                        <span className="text-sm font-medium text-[var(--color-calm-green)]">
                          {language === 'ar' ? 'إجمالي السلة:' : 'Cart Total:'} {getCartTotal()} {language === 'ar' ? 'دينار' : 'JOD'}
                        </span>
                        <Button
                          onClick={() => setShowCartPanel(true)}
                          variant="outline"
                          size="sm"
                          className="border-[var(--color-vibrant-orange)] text-[var(--color-vibrant-orange)] hover:bg-[var(--color-vibrant-orange)] hover:text-white"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {language === 'ar' ? 'عرض السلة' : 'View Cart'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedProducts.map((product) => (
                    <Card key={product.id} className="hover:shadow-lg transition-shadow border-[var(--color-pastel-purple)] hover:border-[var(--color-vibrant-orange)]">
                      <div className="relative">
                        {/* 💡 تم تغيير الارتفاع إلى h-56 */}
                        <div className="h-56 bg-[var(--color-light-beige)] dark:bg-[var(--color-dark-purple)]/20 rounded-t-lg relative overflow-hidden">
                          <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Badge className="bg-red-500 text-white">
                                {language === 'ar' ? 'نفد المخزون' : 'Out of Stock'}
                              </Badge>
                            </div>
                          )}
                          {product.fastShipping && (
                            <Badge className="absolute top-2 right-2 bg-[var(--color-calm-green)] text-white">
                              <Truck className="w-3 h-3 mr-1" />
                              {language === 'ar' ? 'شحن سريع (مكان قريب)' : 'Fast Shipping (Near)'}
                            </Badge>
                          )}
                          <Badge className="absolute top-2 left-2 bg-[var(--color-vibrant-orange)] text-white">
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
                          {/* 💡 التصحيح: استخدام (product.features || []) لضمان عدم ظهور خطأ undefined */}
                          <div className="flex flex-wrap gap-1">
                            {(product.features || []).slice(0, 2).map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {(product.features || []).length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{((product.features || []).length - 2)} {language === 'ar' ? 'المزيد' : 'more'}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-reverse space-x-2">
                                <span className="text-lg font-bold text-[var(--color-calm-green)]">
                                  {product.price} {language === 'ar' ? 'دينار' : 'JOD'}
                                </span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <span className="text-sm line-through text-[var(--color-dark-purple)]/50">
                                    {product.originalPrice} {language === 'ar' ? 'دينار' : 'JOD'}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-reverse space-x-1 text-xs text-[var(--color-vibrant-orange)]">
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
                              className="flex-1 bg-[var(--color-vibrant-orange)] hover:bg-[var(--color-vibrant-orange)]/90 text-white"
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                            </Button>
                            <Button
                              variant={favorites.some(item => item.id === product.id) ? "default" : "outline"}
                              size="icon"
                              onClick={() => toggleFavorite(product)}
                              className={favorites.some(item => item.id === product.id)
                                ? "bg-red-500 hover:bg-red-600 text-white border-red-500"
                                : "border-[var(--color-dark-purple)] text-[var(--color-dark-purple)] hover:bg-[var(--color-dark-purple)] hover:text-white"
                              }
                            >
                              <Heart className="w-4 h-4" fill={favorites.some(item => item.id === product.id) ? "currentColor" : "none"} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredAndSortedProducts.length === 0 && (
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
                            {/* شريط التقدم: النمط المخصص يُفترض أنه موجود في ContributeShopMarketplace.css */}
                            <div className="contribution-progress-bar-container">
                              <div
                                className="contribution-progress-bar-fill"
                                style={{ '--progress-width': `${(contribution.raised / contribution.target) * 100}%` } as React.CSSProperties}
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
                            <Button className="flex-1 bg-[var(--color-dark-purple)] hover:bg-[var(--color-dark-purple)]/90 text-white">
                              <Heart className="w-4 h-4 mr-2" />
                              {language === 'ar' ? 'ساهم الآن' : 'Contribute Now'}
                            </Button>
                            <Button
                              variant="outline"
                              className="border-[var(--color-calm-green)] text-[var(--color-calm-green)] hover:bg-[var(--color-calm-green)] hover:text-white"
                            >
                              {language === 'ar' ? 'تفاصيل' : 'Details'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Call to Action */}
                <Card className="bg-gradient-to-r from-[var(--color-dark-purple)] to-[var(--color-vibrant-orange)] text-white">
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
                        <Button variant="secondary" size="lg" className="text-[var(--color-dark-purple)] bg-white hover:bg-[var(--color-light-beige)]">
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
    </div>
  );
};
