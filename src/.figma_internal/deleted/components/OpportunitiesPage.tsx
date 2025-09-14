import React, { useState } from 'react';
import { Search, Filter, Briefcase, GraduationCap, Users, MapPin, Clock, Eye, Ear, Hand, Brain, ExternalLink, Linkedin } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LinkedInJobsService } from './services/LinkedInJobsService';
import { useTranslation } from './services/TranslationService';

export function OpportunitiesPage() {
  const { t, language } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisability, setSelectedDisability] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const jobOpportunities = [
    {
      id: 1,
      title: 'مطور ويب متخصص في الوصولية',
      company: 'شركة التكنولوجيا الشاملة',
      location: 'الرياض - عن بُعد',
      type: 'دوام كامل',
      accessibility: ['visual', 'motor'],
      salary: '8,000 - 12,000 ريال',
      description: 'نبحث عن مطور ويب متخصص في تطوير مواقع قابلة للوصول',
      requirements: ['خبرة في React', 'معرفة بمعايير WCAG', 'إتقان اللغة الإنجليزية']
    },
    {
      id: 2,
      title: 'مترجم لغة الإشارة',
      company: 'مستشفى الملك فيصل',
      location: 'الرياض',
      type: 'دوام جزئي',
      accessibility: ['auditory'],
      salary: '4,000 - 6,000 ريال',
      description: 'مترجم لغة الإشارة لمساعدة المرضى في التواصل',
      requirements: ['شهادة في لغة الإشارة', 'خبرة سنتين على الأقل']
    },
    {
      id: 3,
      title: 'مصمم تجربة مستخدم شامل',
      company: 'وكالة التصميم الحديث',
      location: 'جدة - هجين',
      type: 'دوام كامل',
      accessibility: ['visual', 'cognitive'],
      salary: '10,000 - 15,000 ريال',
      description: 'تصميم تجارب مستخدم تدعم جميع المستخدمين',
      requirements: ['خبرة في Figma', 'فهم مبادئ التصميم الشامل']
    }
  ];

  const educationalOpportunities = [
    {
      id: 1,
      title: 'دورة البرمجة للمبتدئين',
      provider: 'أكاديمية الكود',
      duration: '3 أشهر',
      level: 'مبتدئ',
      accessibility: ['visual', 'auditory', 'motor', 'cognitive'],
      price: 'مجاني',
      description: 'تعلم أساسيات البرمجة مع دعم كامل لذوي الاحتياجات الخاصة',
      features: ['محتوى صوتي', 'ترجمة إشارة', 'واجهة مبسطة']
    },
    {
      id: 2,
      title: 'ورشة عمل في التصميم الجرافيكي',
      provider: 'معهد الفنون التطبيقية',
      duration: '6 أسابيع',
      level: 'متوسط',
      accessibility: ['auditory', 'motor'],
      price: '500 ريال',
      description: 'تعلم أساسيات التصميم الجرافيكي مع أدوات متخصصة',
      features: ['أدوات مساعدة', 'دعم فردي', 'مشاريع عملية']
    },
    {
      id: 3,
      title: 'كورس إدارة الأعمال الرقمية',
      provider: 'جامعة الأعمال الذكية',
      duration: '4 أشهر',
      level: 'متقدم',
      accessibility: ['visual', 'cognitive'],
      price: '1,200 ريال',
      description: 'دبلوم في إدارة الأعمال الرقمية مع تركيز على الشمولية',
      features: ['شهادة معتمدة', 'تدريب عملي', 'إرشاد مهني']
    }
  ];

  const communityEvents = [
    {
      id: 1,
      title: 'ملتقى ذوي الاحتياجات الخاصة في التكنولوجيا',
      organizer: 'جمعية التكنولوجيا الشاملة',
      date: '15 مارس 2024',
      time: '10:00 ص - 4:00 م',
      location: 'مركز الرياض للمؤتمرات',
      accessibility: ['visual', 'auditory', 'motor', 'cognitive'],
      type: 'مؤتمر',
      description: 'ملتقى سنوي لمناقشة أحدث التطورات في التكنولوجيا المساعدة'
    },
    {
      id: 2,
      title: 'ورشة عمل لتعلم لغة الإشارة',
      organizer: 'مركز التأهيل الشامل',
      date: '22 مارس 2024',
      time: '6:00 م - 8:00 م',
      location: 'مركز الحي - الرياض',
      accessibility: ['auditory'],
      type: 'ورشة عمل',
      description: 'تعلم أساسيات لغة الإشارة مع مترجمين معتمدين'
    },
    {
      id: 3,
      title: 'نشاط رياضي شامل في الحديقة',
      organizer: 'نادي الرياضة للجميع',
      date: '30 مارس 2024',
      time: '8:00 ص - 12:00 م',
      location: 'حديقة الملك عبدالله',
      accessibility: ['visual', 'auditory', 'motor'],
      type: 'نشاط رياضي',
      description: 'فعالية رياضية مصممة لتناسب جميع القدرات'
    }
  ];

  const disabilityIcons = {
    visual: Eye,
    auditory: Ear,
    motor: Hand,
    cognitive: Brain
  };

  const disabilityLabels = {
    visual: 'إعاقة بصرية',
    auditory: 'إعاقة سمعية',
    motor: 'إعاقة حركية',
    cognitive: 'إعاقة إدراكية'
  };

  const filterByDisability = (items: any[]) => {
    if (selectedDisability === 'all') return items;
    return items.filter(item => 
      item.accessibility.includes(selectedDisability)
    );
  };

  const filterBySearch = (items: any[]) => {
    if (!searchTerm) return items;
    return items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const applyFilters = (items: any[]) => {
    return filterBySearch(filterByDisability(items));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
          الفرص المتاحة
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          اكتشف الوظائف والدورات التدريبية والفعاليات المصممة لدعم ذوي الاحتياجات الخاصة
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ابحث في الفرص..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
                aria-label="البحث في الفرص المتاحة"
              />
            </div>

            {/* Disability Filter */}
            <Select value={selectedDisability} onValueChange={setSelectedDisability}>
              <SelectTrigger aria-label="تصفية حسب نوع الإعاقة">
                <SelectValue placeholder="تصفية حسب نوع الإعاقة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="visual">إعاقة بصرية</SelectItem>
                <SelectItem value="auditory">إعاقة سمعية</SelectItem>
                <SelectItem value="motor">إعاقة حركية</SelectItem>
                <SelectItem value="cognitive">إعاقة إدراكية</SelectItem>
              </SelectContent>
            </Select>

            {/* Location Filter */}
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger aria-label="تصفية حسب الموقع">
                <SelectValue placeholder="تصفية حسب الموقع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المواقع</SelectItem>
                <SelectItem value="riyadh">الرياض</SelectItem>
                <SelectItem value="jeddah">جدة</SelectItem>
                <SelectItem value="dammam">الدمام</SelectItem>
                <SelectItem value="remote">عن بُعد</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities Tabs */}
      <Tabs defaultValue="linkedin" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="linkedin" className="flex items-center space-x-reverse space-x-2">
            <Linkedin className="w-4 h-4" />
            <span>{language === 'ar' ? 'LinkedIn' : 'LinkedIn'}</span>
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center space-x-reverse space-x-2">
            <Briefcase className="w-4 h-4" />
            <span>{language === 'ar' ? 'الوظائف' : 'Jobs'}</span>
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center space-x-reverse space-x-2">
            <GraduationCap className="w-4 h-4" />
            <span>{language === 'ar' ? 'التعليم' : 'Education'}</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center space-x-reverse space-x-2">
            <Users className="w-4 h-4" />
            <span>{language === 'ar' ? 'الفعاليات' : 'Events'}</span>
          </TabsTrigger>
        </TabsList>

        {/* LinkedIn Jobs Tab */}
        <TabsContent value="linkedin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-reverse space-x-2">
                <Linkedin className="w-5 h-5 text-blue-600" />
                <span>{language === 'ar' ? 'فرص LinkedIn المناسبة لذوي الاحتياجات الخاصة' : 'LinkedIn Opportunities for People with Special Needs'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LinkedInJobsService 
                location={selectedLocation === 'all' ? 'Jordan' : selectedLocation}
                keywords={searchTerm}
                disabilityType={selectedDisability}
                maxJobs={10}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Job Opportunities */}
        <TabsContent value="jobs" className="space-y-4">
          <div className="grid gap-6">
            {applyFilters(jobOpportunities).map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <p className="text-muted-foreground">{job.company}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {job.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="flex items-center space-x-reverse space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{job.location}</span>
                    </Badge>
                    <Badge variant="secondary">
                      {job.salary}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">مناسب لـ:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.accessibility.map((type) => {
                        const Icon = disabilityIcons[type as keyof typeof disabilityIcons];
                        return (
                          <Badge key={type} variant="outline" className="flex items-center space-x-reverse space-x-1">
                            <Icon className="w-3 h-3" />
                            <span>{disabilityLabels[type as keyof typeof disabilityLabels]}</span>
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">المتطلبات:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-start space-x-reverse space-x-2">
                          <span className="text-blue-600">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex space-x-reverse space-x-3">
                    <Button className="flex-1">
                      <ExternalLink className="w-4 h-4 ml-2" />
                      تقدم الآن
                    </Button>
                    <Button variant="outline">
                      حفظ
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Educational Opportunities */}
        <TabsContent value="education" className="space-y-4">
          <div className="grid gap-6">
            {applyFilters(educationalOpportunities).map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <p className="text-muted-foreground">{course.provider}</p>
                    </div>
                    <Badge variant={course.price === 'مجاني' ? 'default' : 'secondary'}>
                      {course.price}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{course.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="flex items-center space-x-reverse space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{course.duration}</span>
                    </Badge>
                    <Badge variant="outline">
                      {course.level}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">مناسب لـ:</p>
                    <div className="flex flex-wrap gap-2">
                      {course.accessibility.map((type) => {
                        const Icon = disabilityIcons[type as keyof typeof disabilityIcons];
                        return (
                          <Badge key={type} variant="outline" className="flex items-center space-x-reverse space-x-1">
                            <Icon className="w-3 h-3" />
                            <span>{disabilityLabels[type as keyof typeof disabilityLabels]}</span>
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">المميزات:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {course.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-reverse space-x-2">
                          <span className="text-green-600">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex space-x-reverse space-x-3">
                    <Button className="flex-1">
                      سجل الآن
                    </Button>
                    <Button variant="outline">
                      المزيد
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Community Events */}
        <TabsContent value="events" className="space-y-4">
          <div className="grid gap-6">
            {applyFilters(communityEvents).map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <p className="text-muted-foreground">{event.organizer}</p>
                    </div>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700">
                      {event.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="flex items-center space-x-reverse space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{event.date} - {event.time}</span>
                    </Badge>
                    <Badge variant="secondary" className="flex items-center space-x-reverse space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">مناسب لـ:</p>
                    <div className="flex flex-wrap gap-2">
                      {event.accessibility.map((type) => {
                        const Icon = disabilityIcons[type as keyof typeof disabilityIcons];
                        return (
                          <Badge key={type} variant="outline" className="flex items-center space-x-reverse space-x-1">
                            <Icon className="w-3 h-3" />
                            <span>{disabilityLabels[type as keyof typeof disabilityLabels]}</span>
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex space-x-reverse space-x-3">
                    <Button className="flex-1">
                      احجز مكانك
                    </Button>
                    <Button variant="outline">
                      شارك
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}