import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Accessibility, AlertCircle, Star, Clock, Phone, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useTranslation } from './TranslationService';
import { APIConfigManager, regionConfigs } from '../../config/apiConfig';

interface GoogleMapsComponentProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  showAccessiblePlaces?: boolean;
  className?: string;
}

interface AccessiblePlace {
  id: string;
  name: string;
  type: string;
  location: { lat: number; lng: number };
  address: string;
  rating: number;
  accessibility: {
    wheelchair: boolean;
    parking: boolean;
    restroom: boolean;
    entrance: boolean;
  };
  contact?: {
    phone?: string;
    website?: string;
  };
  openHours?: string;
}

export function GoogleMapsService({
  center,
  zoom = 13,
  onLocationSelect,
  showAccessiblePlaces = true,
  className = ""
}: GoogleMapsComponentProps) {
  const { t, language } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [places, setPlaces] = useState<AccessiblePlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<AccessiblePlace | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [placeType, setPlaceType] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);

  const regionConfig = APIConfigManager.getRegionConfig();
  const apiConfig = APIConfigManager.loadConfig();
  const hasValidApiKey = APIConfigManager.hasValidGoogleMapsKey();

  // Default center based on current region
  const defaultCenter = center || regionConfig?.coordinates || { lat: 31.9522, lng: 35.9104 };

  // Place types for Jordan
  const placeTypes = [
    { value: 'all', label: language === 'ar' ? 'جميع الأماكن' : 'All Places' },
    { value: 'hospital', label: language === 'ar' ? 'مستشفيات' : 'Hospitals' },
    { value: 'school', label: language === 'ar' ? 'مدارس ومراكز' : 'Schools & Centers' },
    { value: 'government', label: language === 'ar' ? 'مؤسسات حكومية' : 'Government' },
    { value: 'shopping', label: language === 'ar' ? 'تسوق' : 'Shopping' },
    { value: 'transport', label: language === 'ar' ? 'نقل' : 'Transportation' },
    { value: 'recreation', label: language === 'ar' ? 'ترفيه' : 'Recreation' }
  ];

  // Mock accessible places data for Jordan
  const mockJordanianPlaces: AccessiblePlace[] = [
    {
      id: '1',
      name: 'مستشفى الجامعة الأردنية',
      type: 'hospital',
      location: { lat: 32.0118, lng: 35.8728 },
      address: 'الجبيهة، عمان، الأردن',
      rating: 4.2,
      accessibility: {
        wheelchair: true,
        parking: true,
        restroom: true,
        entrance: true
      },
      contact: {
        phone: '+962-6-5353444',
        website: 'http://www.juh.edu.jo'
      },
      openHours: '24 ساعة'
    },
    {
      id: '2',
      name: 'مول العبدلي',
      type: 'shopping',
      location: { lat: 31.9515, lng: 35.9239 },
      address: 'العبدلي، عمان، الأردن',
      rating: 4.5,
      accessibility: {
        wheelchair: true,
        parking: true,
        restroom: true,
        entrance: true
      },
      contact: {
        phone: '+962-6-5006000',
        website: 'http://www.abdali.jo'
      },
      openHours: '10:00 - 23:00'
    },
    {
      id: '3',
      name: 'مركز وصال للتأهيل',
      type: 'school',
      location: { lat: 31.9454, lng: 35.9284 },
      address: 'جبل عمان، عمان، الأردن',
      rating: 4.8,
      accessibility: {
        wheelchair: true,
        parking: true,
        restroom: true,
        entrance: true
      },
      contact: {
        phone: '+962-6-5555555'
      },
      openHours: '08:00 - 16:00'
    },
    {
      id: '4',
      name: 'دائرة الأشغال العامة والإسكان',
      type: 'government',
      location: { lat: 31.9500, lng: 35.9333 },
      address: 'وسط البلد، عمان، الأردن',
      rating: 3.8,
      accessibility: {
        wheelchair: true,
        parking: false,
        restroom: true,
        entrance: true
      },
      contact: {
        phone: '+962-6-4641393'
      },
      openHours: '08:00 - 15:00'
    },
    {
      id: '5',
      name: 'مطار الملكة علياء الدولي',
      type: 'transport',
      location: { lat: 31.7226, lng: 35.9911 },
      address: 'الزرقاء، الأردن',
      rating: 4.3,
      accessibility: {
        wheelchair: true,
        parking: true,
        restroom: true,
        entrance: true
      },
      contact: {
        phone: '+962-6-4451300',
        website: 'http://www.qaia.gov.jo'
      },
      openHours: '24 ساعة'
    }
  ];

  // Load Google Maps
  useEffect(() => {
    if (!hasValidApiKey) {
      setError(language === 'ar' ? 'يتم العمل بالوضع التجريبي - لتفعيل الخرائط التفاعلية، أضف مفتاح Google Maps في الإعدادات' : 'Working in demo mode - For interactive maps, add Google Maps API key in settings');
      setPlaces(mockJordanianPlaces);
      return;
    }

    loadGoogleMaps();
  }, [hasValidApiKey, language]);

  const loadGoogleMaps = async () => {
    try {
      if (hasValidApiKey && apiConfig.googleMaps?.apiKey) {
        // تحميل Google Maps API الحقيقي
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiConfig.googleMaps.apiKey}&libraries=places&language=${language}&region=${regionConfig?.country || 'JO'}`;
        script.onload = () => {
          initializeMap();
          searchNearbyPlaces();
        };
        script.onerror = () => {
          setError(language === 'ar' ? 'خطأ في تحميل Google Maps API' : 'Error loading Google Maps API');
          setPlaces(mockJordanianPlaces);
        };
        document.head.appendChild(script);
      } else {
        // استخدام البيانات المحاكية
        setIsLoaded(true);
        setPlaces(mockJordanianPlaces);
      }
    } catch (error) {
      setError(language === 'ar' ? 'خطأ في تحميل الخريطة' : 'Error loading map');
      setPlaces(mockJordanianPlaces);
    }
  };

  const searchNearbyPlaces = () => {
    if (!map || !hasValidApiKey) return;

    const service = new google.maps.places.PlacesService(map);
    const request = {
      location: defaultCenter,
      radius: 5000, // 5 km radius
      type: ['hospital', 'school', 'government_office', 'shopping_mall', 'transit_station']
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const accessiblePlaces: AccessiblePlace[] = results.slice(0, 10).map((place, index) => ({
          id: place.place_id || index.toString(),
          name: place.name || 'Unknown',
          type: place.types?.[0] || 'general',
          location: {
            lat: place.geometry?.location?.lat() || defaultCenter.lat,
            lng: place.geometry?.location?.lng() || defaultCenter.lng
          },
          address: place.vicinity || 'No address available',
          rating: place.rating || 0,
          accessibility: {
            wheelchair: Math.random() > 0.5, // Random for demo
            parking: Math.random() > 0.3,
            restroom: Math.random() > 0.4,
            entrance: Math.random() > 0.2
          },
          openHours: place.opening_hours?.isOpen() ? 
            (language === 'ar' ? 'مفتوح الآن' : 'Open now') : 
            (language === 'ar' ? 'مغلق الآن' : 'Closed now')
        }));

        setPlaces([...mockJordanianPlaces, ...accessiblePlaces]);
      }
    });
  };

  const initializeMap = () => {
    if (!mapRef.current) return;

    const googleMap = new google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: zoom,
      gestureHandling: 'cooperative',
      accessibilityEnabled: true
    });

    setMap(googleMap);

    // إضافة العلامات للأماكن المتاحة
    places.forEach(place => {
      const marker = new google.maps.Marker({
        position: place.location,
        map: googleMap,
        title: place.name,
        icon: getMarkerIcon(place.type)
      });

      marker.addListener('click', () => {
        setSelectedPlace(place);
        if (onLocationSelect) {
          onLocationSelect({
            lat: place.location.lat,
            lng: place.location.lng,
            address: place.address
          });
        }
      });
    });
  };

  const getMarkerIcon = (type: string) => {
    // إرجاع أيقونات مختلفة حسب نوع المكان
    const iconColors: { [key: string]: string } = {
      hospital: '#dc2626', // أحمر
      school: '#2563eb',   // أزرق
      government: '#7c3aed', // بنفسجي
      shopping: '#059669',  // أخضر
      transport: '#ea580c', // برتقالي
      recreation: '#db2777' // وردي
    };

    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: iconColors[type] || '#6b7280',
      fillOpacity: 1,
      scale: 8,
      strokeColor: '#ffffff',
      strokeWeight: 2
    };
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    // محاكاة البحث
    setTimeout(() => {
      const filteredPlaces = mockJordanianPlaces.filter(place => {
        const matchesQuery = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           place.address.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = placeType === 'all' || place.type === placeType;
        return matchesQuery && matchesType;
      });
      
      setPlaces(filteredPlaces);
      setIsSearching(false);
    }, 1000);
  };

  const getAccessibilityScore = (accessibility: AccessiblePlace['accessibility']) => {
    const features = Object.values(accessibility);
    const score = features.filter(Boolean).length;
    return (score / features.length) * 100;
  };

  const getAccessibilityBadge = (score: number) => {
    if (score >= 75) return { text: language === 'ar' ? 'ممتاز' : 'Excellent', color: 'bg-green-500' };
    if (score >= 50) return { text: language === 'ar' ? 'جيد' : 'Good', color: 'bg-blue-500' };
    if (score >= 25) return { text: language === 'ar' ? 'متوسط' : 'Fair', color: 'bg-yellow-500' };
    return { text: language === 'ar' ? 'محدود' : 'Limited', color: 'bg-red-500' };
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className={`flex items-center ${language === 'ar' ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
          <MapPin className="w-5 h-5" />
          <span>{t('nearbyServices')}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!hasValidApiKey && (
          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              {language === 'ar' 
                ? 'للحصول على خرائط تفاعلية، يرجى إضافة مفتاح Google Maps في الإعدادات'
                : 'For interactive maps, please add Google Maps API key in settings'
              }
            </AlertDescription>
          </Alert>
        )}

        {/* أدوات البحث */}
        <div className="space-y-3">
          <div className={`flex ${language === 'ar' ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
            <Input
              placeholder={language === 'ar' ? 'ابحث عن مكان...' : 'Search for a place...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? <Navigation className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>

          <Select value={placeType} onValueChange={setPlaceType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {placeTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* خريطة محاكية */}
        <div className="space-y-4">
          <div 
            ref={mapRef}
            className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600"
          >
            {hasValidApiKey ? (
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'خريطة تفاعلية' : 'Interactive Map'}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'خريطة محاكية' : 'Mock Map'}
                </p>
              </div>
            )}
          </div>

          {/* قائمة الأماكن */}
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {places.map((place) => {
              const accessibilityScore = getAccessibilityScore(place.accessibility);
              const badge = getAccessibilityBadge(accessibilityScore);
              
              return (
                <Card 
                  key={place.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedPlace?.id === place.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedPlace(place)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{place.name}</h4>
                          <p className="text-sm text-muted-foreground">{place.address}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge className={`${badge.color} text-white text-xs`}>
                            {badge.text}
                          </Badge>
                          <div className={`flex items-center ${language === 'ar' ? 'space-x-reverse space-x-1' : 'space-x-1'}`}>
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{place.rating}</span>
                          </div>
                        </div>
                      </div>

                      {/* ميزات الوصولية */}
                      <div className="flex flex-wrap gap-1">
                        {place.accessibility.wheelchair && (
                          <Badge variant="outline" className="text-xs">
                            <Accessibility className={`w-3 h-3 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} />
                            {language === 'ar' ? 'كرسي متحرك' : 'Wheelchair'}
                          </Badge>
                        )}
                        {place.accessibility.parking && (
                          <Badge variant="outline" className="text-xs">
                            🅿️ {language === 'ar' ? 'موقف' : 'Parking'}
                          </Badge>
                        )}
                        {place.accessibility.restroom && (
                          <Badge variant="outline" className="text-xs">
                            🚻 {language === 'ar' ? 'مرافق' : 'Restroom'}
                          </Badge>
                        )}
                      </div>

                      {/* معلومات إضافية */}
                      <div className={`flex items-center ${language === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'} text-xs text-muted-foreground`}>
                        {place.openHours && (
                          <div className={`flex items-center ${language === 'ar' ? 'space-x-reverse space-x-1' : 'space-x-1'}`}>
                            <Clock className="w-3 h-3" />
                            <span>{place.openHours}</span>
                          </div>
                        )}
                        {place.contact?.phone && (
                          <div className={`flex items-center ${language === 'ar' ? 'space-x-reverse space-x-1' : 'space-x-1'}`}>
                            <Phone className="w-3 h-3" />
                            <span>{place.contact.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {places.length === 0 && !isSearching && (
            <div className="text-center py-8">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">
                {language === 'ar' ? 'لا توجد أماكن تطابق البحث' : 'No places match your search'}
              </p>
            </div>
          )}
        </div>

        {/* معلومات المنطقة */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            {language === 'ar' 
              ? `يتم عرض الأماكن في ${regionConfig?.country || 'الأردن'}`
              : `Showing places in ${regionConfig?.country || 'Jordan'}`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// مكون مبسط للخريطة
export function QuickMap({ 
  className = "",
  onLocationSelect 
}: {
  className?: string;
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
}) {
  const { t } = useTranslation();
  
  return (
    <Button
      variant="outline"
      className={className}
      onClick={() => {
        const regionConfig = APIConfigManager.getRegionConfig();
        const center = regionConfig?.coordinates || { lat: 31.9522, lng: 35.9104 };
        if (onLocationSelect) {
          onLocationSelect({
            ...center,
            address: regionConfig?.places?.[0] || 'الموقع الحالي'
          });
        }
      }}
    >
      <MapPin className={`w-4 h-4 ${useTranslation().language === 'ar' ? 'ml-2' : 'mr-2'}`} />
      {t('nearbyServices')}
    </Button>
  );
}