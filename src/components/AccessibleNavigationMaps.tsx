import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Route, Clock, AlertCircle, Star, Accessibility, Car, User, Bus, Info, Phone, Heart, Building, Eye, Volume2, Brain } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { GoogleMapsService } from './services/GoogleMapsService';
import { useTranslation } from './services/TranslationService';

export function AccessibleNavigationMaps() {
  const { t, language } = useTranslation();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [travelMode, setTravelMode] = useState('walking');
  const [accessibilityNeeds, setAccessibilityNeeds] = useState('none');
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [nearbyFacilities, setNearbyFacilities] = useState([]);

  // Mock route data with accessibility information
  const mockRoutes = [
    {
      id: 1,
      name: language === 'ar' ? 'الطريق الرئيسي المتاح' : 'Main Accessible Route',
      duration: language === 'ar' ? '15 دقيقة' : '15 minutes',
      distance: '1.2 كم',
      accessibility: {
        wheelchairAccessible: true,
        visuallyImpairedFriendly: true,
        hearingImpairedFriendly: true,
        cognitiveAccessible: true
      },
      features: [
        language === 'ar' ? 'مصاعد متوفرة' : 'Elevators available',
        language === 'ar' ? 'أسطح مستوية' : 'Level surfaces',
        language === 'ar' ? 'إنارة جيدة' : 'Good lighting',
        language === 'ar' ? 'لافتات واضحة' : 'Clear signage'
      ],
      warnings: [],
      rating: 4.8,
      reviews: 245,
      difficulty: 'easy'
    },
    {
      id: 2,
      name: language === 'ar' ? 'الطريق البديل السريع' : 'Alternative Fast Route',
      duration: language === 'ar' ? '12 دقيقة' : '12 minutes',
      distance: '1.0 كم',
      accessibility: {
        wheelchairAccessible: false,
        visuallyImpairedFriendly: true,
        hearingImpairedFriendly: true,
        cognitiveAccessible: false
      },
      features: [
        language === 'ar' ? 'طريق مختصر' : 'Shorter path',
        language === 'ar' ? 'أقل ازدحاماً' : 'Less crowded'
      ],
      warnings: [
        language === 'ar' ? 'يحتوي على درجات' : 'Contains stairs',
        language === 'ar' ? 'سطح غير مستوٍ في بعض الأجزاء' : 'Uneven surface in some parts'
      ],
      rating: 4.2,
      reviews: 156,
      difficulty: 'moderate'
    },
    {
      id: 3,
      name: language === 'ar' ? 'طريق الحديقة المريح' : 'Comfortable Park Route',
      duration: language === 'ar' ? '20 دقيقة' : '20 minutes',
      distance: '1.5 كم',
      accessibility: {
        wheelchairAccessible: true,
        visuallyImpairedFriendly: true,
        hearingImpairedFriendly: true,
        cognitiveAccessible: true
      },
      features: [
        language === 'ar' ? 'مسار عبر الحديقة' : 'Path through park',
        language === 'ar' ? 'مقاعد للراحة' : 'Rest benches',
        language === 'ar' ? 'بيئة هادئة' : 'Quiet environment',
        language === 'ar' ? 'مرافق صحية متاحة' : 'Accessible restrooms'
      ],
      warnings: [],
      rating: 4.9,
      reviews: 189,
      difficulty: 'easy'
    }
  ];

  const mockFacilities = [
    {
      id: 1,
      name: language === 'ar' ? 'مستشفى الأردن' : 'Jordan Hospital',
      type: language === 'ar' ? 'مستشفى' : 'Hospital',
      distance: '200 م',
      accessibility: {
        wheelchairAccessible: true,
        signLanguage: true,
        braille: true
      },
      phone: '+962-6-123-4567',
      rating: 4.7
    },
    {
      id: 2,
      name: language === 'ar' ? 'صيدلية النور' : 'Al-Noor Pharmacy',
      type: language === 'ar' ? 'صيدلية' : 'Pharmacy',
      distance: '150 م',
      accessibility: {
        wheelchairAccessible: true,
        signLanguage: false,
        braille: false
      },
      phone: '+962-6-234-5678',
      rating: 4.4
    },
    {
      id: 3,
      name: language === 'ar' ? 'محطة حافلات الجامعة' : 'University Bus Station',
      type: language === 'ar' ? 'محطة حافلات' : 'Bus Station',
      distance: '300 م',
      accessibility: {
        wheelchairAccessible: true,
        signLanguage: true,
        braille: true
      },
      phone: '+962-6-345-6789',
      rating: 4.1
    }
  ];

  const travelModes = [
    { value: 'walking', label: language === 'ar' ? 'مشي' : 'Walking', icon: User },
    { value: 'wheelchair', label: language === 'ar' ? 'كرسي متحرك' : 'Wheelchair', icon: Accessibility },
    { value: 'transit', label: language === 'ar' ? 'مواصلات عامة' : 'Public Transit', icon: Bus },
    { value: 'driving', label: language === 'ar' ? 'قيادة' : 'Driving', icon: Car }
  ];

  const accessibilityOptions = [
    { value: 'none', label: language === 'ar' ? 'بدون متطلبات خاصة' : 'No special requirements' },
    { value: 'wheelchair', label: language === 'ar' ? 'مناسب للكراسي المتحركة' : 'Wheelchair accessible' },
    { value: 'visual', label: language === 'ar' ? 'مناسب للمكفوفين' : 'Visually impaired friendly' },
    { value: 'hearing', label: language === 'ar' ? 'مناسب لضعاف السمع' : 'Hearing impaired friendly' },
    { value: 'cognitive', label: language === 'ar' ? 'مناسب لصعوبات التعلم' : 'Cognitive accessible' }
  ];

  useEffect(() => {
    // Load nearby facilities
    setNearbyFacilities(mockFacilities);
  }, [language]);

  const handleSearch = () => {
    if (!origin || !destination) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setRoutes(mockRoutes);
      setLoading(false);
    }, 1500);
  };

  const getAccessibilityIcon = (type, accessible) => {
    const icons = {
      wheelchairAccessible: Accessibility,
      visuallyImpairedFriendly: Eye,
      hearingImpairedFriendly: Volume2,
      cognitiveAccessible: Brain
    };
    
    const Icon = icons[type];
    return Icon ? (
      <Icon className={`w-4 h-4 ${accessible ? 'text-green-600' : 'text-gray-400'}`} />
    ) : null;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-orange-600 bg-orange-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-500 bg-clip-text text-transparent">
          {language === 'ar' ? 'المسارات الآمنة والمتاحة' : 'Safe and Accessible Paths'}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {language === 'ar' 
            ? 'اكتشف أفضل الطرق للتنقل بأمان وراحة مع معلومات مفصلة عن إمكانية الوصول'
            : 'Discover the best routes to travel safely and comfortably with detailed accessibility information'}
        </p>
      </div>

      {/* Search Section */}
      <Card className="border-green-200 dark:border-green-700">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
          <CardTitle className="flex items-center space-x-reverse space-x-2">
            <Navigation className="w-5 h-5 text-green-600" />
            <span>{language === 'ar' ? 'خطط رحلتك' : 'Plan Your Journey'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === 'ar' ? 'من' : 'From'}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={language === 'ar' ? 'أدخل نقطة البداية' : 'Enter starting point'}
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="pl-10 border-green-200 focus:border-green-400"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === 'ar' ? 'إلى' : 'To'}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={language === 'ar' ? 'أدخل الوجهة' : 'Enter destination'}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-10 border-green-200 focus:border-green-400"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={travelMode} onValueChange={setTravelMode}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? 'وسيلة التنقل' : 'Travel Mode'} />
              </SelectTrigger>
              <SelectContent>
                {travelModes.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <SelectItem key={mode.value} value={mode.value}>
                      <div className="flex items-center space-x-reverse space-x-2">
                        <Icon className="w-4 h-4" />
                        <span>{mode.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Select value={accessibilityNeeds} onValueChange={setAccessibilityNeeds}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? 'متطلبات الوصولية' : 'Accessibility Needs'} />
              </SelectTrigger>
              <SelectContent>
                {accessibilityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleSearch}
            disabled={!origin || !destination || loading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <div className="flex items-center space-x-reverse space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{language === 'ar' ? 'جاري البحث...' : 'Searching...'}</span>
              </div>
            ) : (
              <>
                <Route className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'ابحث عن المسارات' : 'Find Routes'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Routes Results */}
        <div className="lg:col-span-2 space-y-4">
          {routes.length > 0 && (
            <>
              <h2 className="text-xl font-semibold">
                {language === 'ar' ? 'المسارات المقترحة' : 'Suggested Routes'}
              </h2>
              
              {routes.map((route) => (
                <Card 
                  key={route.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg border-l-4 ${
                    selectedRoute?.id === route.id 
                      ? 'border-l-green-500 bg-green-50 dark:bg-green-900/20' 
                      : 'border-l-gray-300'
                  }`}
                  onClick={() => setSelectedRoute(route)}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Route Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{route.name}</h3>
                          <div className="flex items-center space-x-reverse space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-reverse space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{route.duration}</span>
                            </div>
                            <div className="flex items-center space-x-reverse space-x-1">
                              <Route className="w-4 h-4" />
                              <span>{route.distance}</span>
                            </div>
                            <div className="flex items-center space-x-reverse space-x-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>{route.rating}</span>
                              <span>({route.reviews})</span>
                            </div>
                          </div>
                        </div>
                        
                        <Badge className={getDifficultyColor(route.difficulty)}>
                          {language === 'ar' 
                            ? route.difficulty === 'easy' ? 'سهل' : route.difficulty === 'moderate' ? 'متوسط' : 'صعب'
                            : route.difficulty}
                        </Badge>
                      </div>

                      {/* Accessibility Indicators */}
                      <div className="flex items-center space-x-reverse space-x-4">
                        <span className="text-sm font-medium">
                          {language === 'ar' ? 'إمكانية الوصول:' : 'Accessibility:'}
                        </span>
                        <div className="flex items-center space-x-reverse space-x-2">
                          {Object.entries(route.accessibility).map(([key, value]) => (
                            <div key={key} className="flex items-center space-x-reverse space-x-1">
                              {getAccessibilityIcon(key, value)}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-green-700">
                          {language === 'ar' ? 'المميزات:' : 'Features:'}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {route.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="border-green-200 text-green-700">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Warnings */}
                      {route.warnings.length > 0 && (
                        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                          <AlertCircle className="h-4 w-4 text-orange-600" />
                          <AlertDescription>
                            <strong>{language === 'ar' ? 'تنبيهات:' : 'Warnings:'}</strong>
                            <ul className="mt-1 space-y-1">
                              {route.warnings.map((warning, index) => (
                                <li key={index} className="text-sm">• {warning}</li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-reverse space-x-2 pt-2 border-t">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Navigation className="w-4 h-4 mr-1" />
                          {language === 'ar' ? 'ابدأ التنقل' : 'Start Navigation'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Heart className="w-4 h-4 mr-1" />
                          {language === 'ar' ? 'حفظ' : 'Save'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Info className="w-4 h-4 mr-1" />
                          {language === 'ar' ? 'تفاصيل' : 'Details'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {routes.length === 0 && !loading && (
            <Card>
              <CardContent className="p-12 text-center">
                <Navigation className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {language === 'ar' ? 'لا توجد مسارات' : 'No routes found'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'ar' 
                    ? 'أدخل نقطة البداية والوجهة للبحث عن المسارات المتاحة'
                    : 'Enter starting point and destination to search for available routes'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Map Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-reverse space-x-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span>{language === 'ar' ? 'الخريطة التفاعلية' : 'Interactive Map'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="w-12 h-12 mx-auto text-blue-500" />
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'ستظهر الخريطة هنا' : 'Map will appear here'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nearby Facilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-reverse space-x-2">
                <Building className="w-5 h-5 text-purple-600" />
                <span>{language === 'ar' ? 'المرافق القريبة' : 'Nearby Facilities'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {nearbyFacilities.map((facility) => (
                <div key={facility.id} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">{facility.name}</h4>
                      <p className="text-xs text-muted-foreground">{facility.type} • {facility.distance}</p>
                      <div className="flex items-center space-x-reverse space-x-2">
                        {facility.accessibility.wheelchairAccessible && (
                          <Accessibility className="w-3 h-3 text-green-600" />
                        )}
                        {facility.accessibility.signLanguage && (
                          <Volume2 className="w-3 h-3 text-blue-600" />
                        )}
                        {facility.accessibility.braille && (
                          <Eye className="w-3 h-3 text-purple-600" />
                        )}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-reverse space-x-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{facility.rating}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Phone className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-reverse space-x-2">
                <Info className="w-5 h-5 text-orange-600" />
                <span>{language === 'ar' ? 'نصائح للتنقل' : 'Navigation Tips'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• {language === 'ar' ? 'تأكد من شحن هاتفك قبل الخروج' : 'Make sure your phone is charged before leaving'}</li>
                <li>• {language === 'ar' ? 'احفظ أرقام الطوارئ' : 'Save emergency numbers'}</li>
                <li>• {language === 'ar' ? 'شارك موقعك مع أحد الأقارب' : 'Share your location with a family member'}</li>
                <li>• {language === 'ar' ? 'تحقق من حالة الطقس' : 'Check weather conditions'}</li>
                <li>• {language === 'ar' ? 'احمل المياه وأدوية الطوارئ' : 'Carry water and emergency medications'}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}