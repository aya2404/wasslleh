import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Accessibility, Camera, Route, Clock, Info, Volume2, Navigation2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { GoogleMapsService } from './services/GoogleMapsService';
import { QuickTTS } from './services/TTSService';

export function SafePathsPage() {
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [routePreference, setRoutePreference] = useState<'shortest' | 'safest' | 'accessible'>('accessible');
  const [isAREnabled, setIsAREnabled] = useState(false);
  const [isVoiceGuidanceEnabled, setIsVoiceGuidanceEnabled] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);

  const accessibilityFeatures = [
    { id: 'elevators', label: 'مصاعد', enabled: true },
    { id: 'ramps', label: 'منحدرات', enabled: true },
    { id: 'accessible-transport', label: 'مواصلات متاحة', enabled: true },
    { id: 'audio-signals', label: 'إشارات صوتية', enabled: false },
    { id: 'tactile-paths', label: 'مسارات لمسية', enabled: false },
    { id: 'wide-paths', label: 'ممرات واسعة', enabled: true }
  ];

  const mockRoutes = [
    {
      id: 1,
      name: 'المسار الأكثر أماناً',
      duration: '25 دقيقة',
      distance: '2.3 كم',
      accessibility: ['مصاعد متاحة', 'منحدرات', 'إضاءة جيدة'],
      difficulty: 'سهل',
      transport: ['مترو', 'حافلة مجهزة'],
      description: 'مسار آمن مع جميع المرافق المطلوبة لذوي الاحتياجات الخاصة'
    },
    {
      id: 2,
      name: 'المسار الأسرع',
      duration: '18 دقيقة',
      distance: '1.8 كم',
      accessibility: ['منحدرات', 'مواصلات محدودة'],
      difficulty: 'متوسط',
      transport: ['مشي', 'تاكسي'],
      description: 'مسار أسرع مع بعض التحديات البسيطة'
    },
    {
      id: 3,
      name: 'المسار الشامل',
      duration: '30 دقيقة',
      distance: '2.7 كم',
      accessibility: ['جميع المرافق متاحة', 'مساعدة متوفرة', 'استراحات'],
      difficulty: 'سهل جداً',
      transport: ['مترو مجهز', 'حافلة مجهزة', 'مساعدة شخصية'],
      description: 'مسار مصمم خصيصاً لضمان الراحة والأمان الكاملين'
    }
  ];

  const nearbyAccessiblePlaces = [
    { name: 'مستشفى الجامعة الأردنية', type: 'صحي', accessibility: 'ممتاز', distance: '0.5 كم' },
    { name: 'مول العبدلي', type: 'تسوق', accessibility: 'جيد جداً', distance: '1.2 كم' },
    { name: 'المكتبة الهاشمية', type: 'تعليمي', accessibility: 'ممتاز', distance: '0.8 كم' },
    { name: 'متحف الأردن', type: 'ثقافي', accessibility: 'جيد جداً', distance: '1.0 كم' },
    { name: 'حدائق الحسين', type: 'ترفيهي', accessibility: 'جيد', distance: '1.5 كم' }
  ];

  useEffect(() => {
    // Mock getting user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation('شارع الجامعة، عمان');
        },
        (error) => {
          setCurrentLocation('عمان، الأردن');
        }
      );
    }
  }, []);

  const handleRouteSelection = (route: any) => {
    setSelectedRoute(route);
    if (isVoiceGuidanceEnabled) {
      speakRouteInfo(route);
    }
  };

  const speakRouteInfo = (route: any) => {
    if ('speechSynthesis' in window) {
      const message = `تم اختيار ${route.name}. المدة المتوقعة ${route.duration}. المسافة ${route.distance}. مستوى الصعوبة ${route.difficulty}.`;
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'ar';
      speechSynthesis.speak(utterance);
    }
  };

  const startARNavigation = () => {
    if (selectedRoute) {
      alert('سيتم تشغيل الواقع المعزز قريباً. ستظهر الإرشادات على الشاشة مع توجيهات صوتية.');
    } else {
      alert('يرجى اختيار مسار أولاً');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'سهل جداً': return 'bg-green-100 text-green-800';
      case 'سهل': return 'bg-blue-100 text-blue-800';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800';
      case 'صعب': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
          المسارات الآمنة
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          اعثر على أفضل المسارات الآمنة والمتاحة للوصول إلى وجهتك بأمان وراحة
        </p>
      </div>

      {/* Navigation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-reverse space-x-2">
            <Navigation className="w-5 h-5" />
            <span>التنقل والإعدادات</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Location Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current-location">الموقع الحالي</Label>
              <div className="relative">
                <MapPin className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="current-location"
                  placeholder="الموقع الحالي..."
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">الوجهة</Label>
              <div className="relative">
                <Navigation2 className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="destination"
                  placeholder="أدخل وجهتك..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
          </div>

          {/* Route Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>تفضيل المسار</Label>
              <Select value={routePreference} onValueChange={(value: any) => setRoutePreference(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accessible">الأكثر إتاحة</SelectItem>
                  <SelectItem value="shortest">الأقصر</SelectItem>
                  <SelectItem value="safest">الأكثر أماناً</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between space-y-2 md:space-y-0">
              <Label htmlFor="voice-guidance">التوجيه الصوتي</Label>
              <Switch
                id="voice-guidance"
                checked={isVoiceGuidanceEnabled}
                onCheckedChange={setIsVoiceGuidanceEnabled}
              />
            </div>

            <div className="flex items-center justify-between space-y-2 md:space-y-0">
              <Label htmlFor="ar-mode">الواقع المعزز</Label>
              <Switch
                id="ar-mode"
                checked={isAREnabled}
                onCheckedChange={setIsAREnabled}
              />
            </div>
          </div>

          <Button className="w-full" size="lg" disabled={!destination.trim()}>
            <Route className="w-5 h-5 ml-2" />
            البحث عن المسارات
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Results */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-semibold">المسارات المقترحة</h2>
          
          {mockRoutes.map((route) => (
            <Card 
              key={route.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedRoute?.id === route.id ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
              onClick={() => handleRouteSelection(route)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{route.name}</h3>
                    <p className="text-sm text-muted-foreground">{route.description}</p>
                  </div>
                  <Badge className={getDifficultyColor(route.difficulty)}>
                    {route.difficulty}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-reverse space-x-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{route.duration}</span>
                  </div>
                  <div className="flex items-center space-x-reverse space-x-2">
                    <Navigation className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{route.distance}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-2">المرافق المتاحة:</p>
                    <div className="flex flex-wrap gap-2">
                      {route.accessibility.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Accessibility className="w-3 h-3 ml-1" />
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">وسائل النقل:</p>
                    <div className="flex flex-wrap gap-2">
                      {route.transport.map((transport, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {transport}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedRoute?.id === route.id && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <div className="flex space-x-reverse space-x-3">
                      <Button size="sm" className="flex-1">
                        <Navigation className="w-4 h-4 ml-2" />
                        ابدأ التنقل
                      </Button>
                      {isAREnabled && (
                        <Button size="sm" variant="outline" onClick={startARNavigation}>
                          <Camera className="w-4 h-4 ml-2" />
                          واقع معزز
                        </Button>
                      )}
                      {isVoiceGuidanceEnabled && (
                        <Button size="sm" variant="outline" onClick={() => speakRouteInfo(route)}>
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Map */}
          <Card>
            <CardHeader>
              <CardTitle>الخريطة التفاعلية</CardTitle>
            </CardHeader>
            <CardContent>
              <GoogleMapsService 
                showAccessiblePlaces={true}
                onLocationSelect={(location) => {
                  setDestination(location.address);
                  console.log('Selected destination:', location);
                }}
                className="h-80"
              />
              {selectedRoute && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">المسار المحدد:</p>
                      <p className="text-sm text-muted-foreground">{selectedRoute.name}</p>
                    </div>
                    <QuickTTS 
                      text={`المسار المحدد: ${selectedRoute.name}. المدة: ${selectedRoute.duration}. المسافة: ${selectedRoute.distance}`}
                      className="h-6 w-6 p-0"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Nearby Accessible Places */}
          <Card>
            <CardHeader>
              <CardTitle>أماكن متاحة قريبة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {nearbyAccessiblePlaces.map((place, index) => (
                <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{place.name}</h4>
                      <p className="text-xs text-muted-foreground">{place.type}</p>
                    </div>
                    <div className="text-left space-y-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          place.accessibility === 'ممتاز' ? 'border-green-500 text-green-700' :
                          place.accessibility === 'جيد جداً' ? 'border-blue-500 text-blue-700' :
                          'border-yellow-500 text-yellow-700'
                        }`}
                      >
                        {place.accessibility}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{place.distance}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Accessibility Features */}
          <Card>
            <CardHeader>
              <CardTitle>المرافق المطلوبة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {accessibilityFeatures.map((feature) => (
                <div key={feature.id} className="flex items-center justify-between">
                  <Label htmlFor={feature.id} className="text-sm">
                    {feature.label}
                  </Label>
                  <Switch
                    id={feature.id}
                    checked={feature.enabled}
                    onCheckedChange={() => {}}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AR Info */}
          {isAREnabled && (
            <Alert>
              <Camera className="w-4 h-4" />
              <AlertDescription>
                ميزة الواقع المعزز ستعرض الإرشادات على شاشة الكاميرا مع التوجيهات الصوتية. تأكد من منح إذن الكاميرا للتطبيق.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}