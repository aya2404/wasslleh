import React, { useState, useEffect } from 'react';
import { Search, Filter, Briefcase, MapPin, Clock, Heart, ExternalLink, Users, Star, TrendingUp, Building, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LinkedInJobsService } from './services/LinkedInJobsService';
import { useTranslation } from './services/TranslationService';

export function JobOpportunitiesExplorer() {
  const { t, language } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisability, setSelectedDisability] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedField, setSelectedField] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock job data - would be replaced with API calls
  const mockJobs = [
    {
      id: 1,
      title: language === 'ar' ? 'مطور ويب للمواقع المتاحة' : 'Accessible Web Developer',
      company: language === 'ar' ? 'شركة التقنيات المتقدمة' : 'Advanced Tech Solutions',
      location: language === 'ar' ? 'عمان، الأردن' : 'Amman, Jordan',
      type: language === 'ar' ? 'دوام كامل' : 'Full-time',
      salary: language === 'ar' ? '800-1200 دينار' : '800-1200 JOD',
      description: language === 'ar' 
        ? 'نبحث عن مطور ويب متخصص في تطوير المواقع المتاحة لذوي الاحتياجات الخاصة. خبرة في HTML, CSS, JavaScript والمعايير الدولية للوصولية.'
        : 'We are looking for a web developer specialized in developing accessible websites for people with special needs. Experience in HTML, CSS, JavaScript and international accessibility standards.',
      requirements: [
        language === 'ar' ? 'خبرة في تطوير الويب' : 'Web development experience',
        language === 'ar' ? 'معرفة بمعايير الوصولية' : 'Knowledge of accessibility standards',
        language === 'ar' ? 'إجادة React أو Vue.js' : 'Proficiency in React or Vue.js'
      ],
      accommodations: [
        language === 'ar' ? 'بيئة عمل مرنة' : 'Flexible work environment',
        language === 'ar' ? 'إمكانية العمل عن بُعد' : 'Remote work possibility',
        language === 'ar' ? 'أدوات مساعدة متوفرة' : 'Assistive tools available'
      ],
      suitableFor: ['visual', 'mobility'],
      category: language === 'ar' ? 'تقنية' : 'Technology',
      postedDate: language === 'ar' ? 'منذ 3 أيام' : '3 days ago',
      applicants: 25,
      rating: 4.8,
      remote: true,
      urgent: false
    },
    {
      id: 2,
      title: language === 'ar' ? 'مصمم جرافيك إبداعي' : 'Creative Graphic Designer',
      company: language === 'ar' ? 'استوديو الإبداع الرقمي' : 'Digital Creativity Studio',
      location: language === 'ar' ? 'إربد، الأردن' : 'Irbid, Jordan',
      type: language === 'ar' ? 'دوام جزئي' : 'Part-time',
      salary: language === 'ar' ? '400-600 دينار' : '400-600 JOD',
      description: language === 'ar'
        ? 'فرصة رائعة للمصممين المبدعين للانضمام لفريقنا. نرحب بالأشخاص ذوي الإعاقة السمعية ونوفر بيئة عمل داعمة ومتفهمة.'
        : 'Great opportunity for creative designers to join our team. We welcome people with hearing disabilities and provide a supportive and understanding work environment.',
      requirements: [
        language === 'ar' ? 'إجادة Adobe Creative Suite' : 'Proficiency in Adobe Creative Suite',
        language === 'ar' ? 'خبرة في التصميم الرقمي' : 'Digital design experience',
        language === 'ar' ? 'إبداع وابتكار' : 'Creativity and innovation'
      ],
      accommodations: [
        language === 'ar' ? 'تواصل بصري ونصي' : 'Visual and text communication',
        language === 'ar' ? 'مترجم لغة إشارة متوفر' : 'Sign language interpreter available',
        language === 'ar' ? 'اجتماعات مرئية' : 'Video meetings'
      ],
      suitableFor: ['hearing'],
      category: language === 'ar' ? 'تصميم' : 'Design',
      postedDate: language === 'ar' ? 'منذ يوم' : '1 day ago',
      applicants: 18,
      rating: 4.6,
      remote: false,
      urgent: true
    },
    {
      id: 3,
      title: language === 'ar' ? 'محاسب مالي' : 'Financial Accountant',
      company: language === 'ar' ? 'مكتب المحاسبة المتخصص' : 'Specialized Accounting Office',
      location: language === 'ar' ? 'عمان، الأردن' : 'Amman, Jordan',
      type: language === 'ar' ? 'دوام كامل' : 'Full-time',
      salary: language === 'ar' ? '600-900 دينار' : '600-900 JOD',
      description: language === 'ar'
        ? 'نبحث عن محاسب مالي دقيق ومنظم. نوفر بيئة عمل مناسبة لذوي الإعاقة الحركية مع جميع التسهيلات اللازمة.'
        : 'We are looking for an accurate and organized financial accountant. We provide a suitable work environment for people with mobility disabilities with all necessary facilities.',
      requirements: [
        language === 'ar' ? 'شهادة في المحاسبة' : 'Accounting degree',
        language === 'ar' ? 'خبرة في البرامج المحاسبية' : 'Experience in accounting software',
        language === 'ar' ? 'دقة والتزام' : 'Accuracy and commitment'
      ],
      accommodations: [
        language === 'ar' ? 'مكتب قابل للتعديل' : 'Adjustable office',
        language === 'ar' ? 'مداخل ومرافق متاحة' : 'Accessible entrances and facilities',
        language === 'ar' ? 'مواقف سيارات مخصصة' : 'Dedicated parking spaces'
      ],
      suitableFor: ['mobility'],
      category: language === 'ar' ? 'محاسبة' : 'Accounting',
      postedDate: language === 'ar' ? 'منذ 5 أيام' : '5 days ago',
      applicants: 32,
      rating: 4.7,
      remote: false,
      urgent: false
    },
    {
      id: 4,
      title: language === 'ar' ? 'مدرس تربية خاصة' : 'Special Education Teacher',
      company: language === 'ar' ? 'مدرسة الأمل التخصصية' : 'Al-Amal Specialized School',
      location: language === 'ar' ? 'الزرقاء، الأردن' : 'Zarqa, Jordan',
      type: language === 'ar' ? 'دوام كامل' : 'Full-time',
      salary: language === 'ar' ? '500-750 دينار' : '500-750 JOD',
      description: language === 'ar'
        ? 'فرصة مميزة للمعلمين المتخصصين في التربية الخاصة. نقدر التنوع ونرحب بالمعلمين من ذوي الخبرة الشخصية مع الإعاقة.'
        : 'Distinguished opportunity for teachers specialized in special education. We value diversity and welcome teachers with personal experience with disability.',
      requirements: [
        language === 'ar' ? 'شهادة في التربية الخاصة' : 'Special education degree',
        language === 'ar' ? 'خبرة مع ذوي الاحتياجات الخاصة' : 'Experience with people with special needs',
        language === 'ar' ? 'صبر وتفهم' : 'Patience and understanding'
      ],
      accommodations: [
        language === 'ar' ? 'بيئة تعليمية شاملة' : 'Inclusive educational environment',
        language === 'ar' ? 'فريق دعم متخصص' : 'Specialized support team',
        language === 'ar' ? 'تدريب مستمر' : 'Continuous training'
      ],
      suitableFor: ['all'],
      category: language === 'ar' ? 'تعليم' : 'Education',
      postedDate: language === 'ar' ? 'منذ أسبوع' : '1 week ago',
      applicants: 45,
      rating: 4.9,
      remote: false,
      urgent: false
    }
  ];

  const disabilityTypes = [
    { value: 'all', label: language === 'ar' ? 'جميع الأنواع' : 'All Types' },
    { value: 'visual', label: language === 'ar' ? 'إعاقة بصرية' : 'Visual Impairment' },
    { value: 'hearing', label: language === 'ar' ? 'إعاقة سمعية' : 'Hearing Impairment' },
    { value: 'mobility', label: language === 'ar' ? 'إعاقة حركية' : 'Mobility Impairment' },
    { value: 'cognitive', label: language === 'ar' ? 'صعوبات تعلم' : 'Learning Difficulties' }
  ];

  const locations = [
    { value: 'all', label: language === 'ar' ? 'جميع المواقع' : 'All Locations' },
    { value: 'amman', label: language === 'ar' ? 'عمان' : 'Amman' },
    { value: 'irbid', label: language === 'ar' ? 'إربد' : 'Irbid' },
    { value: 'zarqa', label: language === 'ar' ? 'الزرقاء' : 'Zarqa' },
    { value: 'remote', label: language === 'ar' ? 'عمل عن بُعد' : 'Remote Work' }
  ];

  const fields = [
    { value: 'all', label: language === 'ar' ? 'جميع المجالات' : 'All Fields' },
    { value: 'technology', label: language === 'ar' ? 'تقنية' : 'Technology' },
    { value: 'design', label: language === 'ar' ? 'تصميم' : 'Design' },
    { value: 'accounting', label: language === 'ar' ? 'محاسبة' : 'Accounting' },
    { value: 'education', label: language === 'ar' ? 'تعليم' : 'Education' },
    { value: 'healthcare', label: language === 'ar' ? 'رعاية صحية' : 'Healthcare' }
  ];

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setLoading(false);
    }, 1000);
  }, [language]);

  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDisability !== 'all') {
      filtered = filtered.filter(job => 
        job.suitableFor.includes(selectedDisability) || job.suitableFor.includes('all')
      );
    }

    if (selectedLocation !== 'all') {
      if (selectedLocation === 'remote') {
        filtered = filtered.filter(job => job.remote);
      } else {
        filtered = filtered.filter(job => 
          job.location.toLowerCase().includes(selectedLocation)
        );
      }
    }

    if (selectedField !== 'all') {
      filtered = filtered.filter(job => 
        job.category.toLowerCase().includes(selectedField) ||
        job.title.toLowerCase().includes(selectedField)
      );
    }

    setFilteredJobs(filtered);
  }, [searchTerm, selectedDisability, selectedLocation, selectedField, jobs]);

  const jobStats = {
    total: jobs.length,
    thisWeek: jobs.filter(job => job.postedDate.includes('يوم') || job.postedDate.includes('day')).length,
    remote: jobs.filter(job => job.remote).length,
    urgent: jobs.filter(job => job.urgent).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
          {language === 'ar' ? 'استكشف الفرص الوظيفية' : 'Explore Job Opportunities'}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {language === 'ar' 
            ? 'اكتشف وظائف مصممة خصيصاً لذوي الاحتياجات الخاصة مع بيئة عمل داعمة ومتفهمة'
            : 'Discover jobs designed specifically for people with special needs with a supportive and understanding work environment'}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: Briefcase, label: language === 'ar' ? 'إجمالي الوظائف' : 'Total Jobs', value: jobStats.total, color: 'purple' },
          { icon: TrendingUp, label: language === 'ar' ? 'جديد هذا الأسبوع' : 'New This Week', value: jobStats.thisWeek, color: 'green' },
          { icon: Users, label: language === 'ar' ? 'عمل عن بُعد' : 'Remote Work', value: jobStats.remote, color: 'blue' },
          { icon: Clock, label: language === 'ar' ? 'وظائف عاجلة' : 'Urgent Jobs', value: jobStats.urgent, color: 'orange' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`border-${stat.color}-200 dark:border-${stat.color}-700`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-reverse space-x-3">
                  <div className={`p-2 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-lg`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Filters */}
      <Card className="border-purple-200 dark:border-purple-700">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === 'ar' ? 'ابحث عن الوظيفة المناسبة...' : 'Search for the right job...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-purple-200 focus:border-purple-400"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedDisability} onValueChange={setSelectedDisability}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'ar' ? 'نوع الإعاقة' : 'Disability Type'} />
                </SelectTrigger>
                <SelectContent>
                  {disabilityTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'ar' ? 'الموقع' : 'Location'} />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'ar' ? 'المجال' : 'Field'} />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((field) => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button className="bg-purple-600 hover:bg-purple-700">
                <Filter className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'تطبيق الفلاتر' : 'Apply Filters'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {language === 'ar' 
              ? `النتائج (${filteredJobs.length} وظيفة)` 
              : `Results (${filteredJobs.length} jobs)`}
          </h2>
          <Select defaultValue="recent">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">{language === 'ar' ? 'الأحدث' : 'Most Recent'}</SelectItem>
              <SelectItem value="relevant">{language === 'ar' ? 'الأكثر صلة' : 'Most Relevant'}</SelectItem>
              <SelectItem value="salary">{language === 'ar' ? 'حسب الراتب' : 'By Salary'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-400">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Job Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-reverse space-x-3">
                          <h3 className="text-xl font-semibold">{job.title}</h3>
                          {job.urgent && (
                            <Badge className="bg-orange-100 text-orange-800">
                              {language === 'ar' ? 'عاجل' : 'Urgent'}
                            </Badge>
                          )}
                          {job.remote && (
                            <Badge variant="outline" className="border-green-200 text-green-700">
                              {language === 'ar' ? 'عن بُعد' : 'Remote'}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-reverse space-x-4 text-muted-foreground">
                          <div className="flex items-center space-x-reverse space-x-1">
                            <Building className="w-4 h-4" />
                            <span>{job.company}</span>
                          </div>
                          <div className="flex items-center space-x-reverse space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-reverse space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{job.postedDate}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <div className="flex items-center space-x-reverse space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{job.rating}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {job.applicants} {language === 'ar' ? 'متقدم' : 'applicants'}
                        </div>
                      </div>
                    </div>

                    {/* Job Description */}
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Job Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2 text-purple-700">
                          {language === 'ar' ? 'المتطلبات:' : 'Requirements:'}
                        </h4>
                        <ul className="text-sm space-y-1">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="flex items-center space-x-reverse space-x-2">
                              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2 text-green-700">
                          {language === 'ar' ? 'التسهيلات المتوفرة:' : 'Available Accommodations:'}
                        </h4>
                        <ul className="text-sm space-y-1">
                          {job.accommodations.map((acc, index) => (
                            <li key={index} className="flex items-center space-x-reverse space-x-2">
                              <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                              <span>{acc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Job Footer */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-reverse space-x-4">
                        <div className="flex items-center space-x-reverse space-x-1">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-medium">{job.salary}</span>
                        </div>
                        <Badge variant="outline" className="border-purple-200 text-purple-700">
                          {job.type}
                        </Badge>
                        <Badge variant="outline" className="border-orange-200 text-orange-700">
                          {job.category}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-reverse space-x-2">
                        <Button variant="outline" size="sm">
                          <Heart className="w-4 h-4 mr-1" />
                          {language === 'ar' ? 'حفظ' : 'Save'}
                        </Button>
                        <Button className="bg-purple-600 hover:bg-purple-700">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          {language === 'ar' ? 'تقدم الآن' : 'Apply Now'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredJobs.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Briefcase className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {language === 'ar' ? 'لا توجد وظائف مطابقة' : 'No matching jobs found'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'جرب تعديل معايير البحث للعثور على وظائف أكثر'
                  : 'Try adjusting your search criteria to find more jobs'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}