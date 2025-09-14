import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { MapPin, Clock, Building, ExternalLink, RefreshCw } from 'lucide-react';
import { useTranslation } from './TranslationService';

// Mock LinkedIn Jobs API Response Structure
interface LinkedInJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  postedTime: string;
  employmentType: string;
  experienceLevel: string;
  isAccessibilityFriendly: boolean;
  accommodations: string[];
  salaryRange?: string;
  remoteWorkAvailable: boolean;
  applicationUrl: string;
  industry: string;
  skills: string[];
}

interface LinkedInJobsServiceProps {
  location?: string;
  keywords?: string;
  disabilityType?: string;
  className?: string;
  maxJobs?: number;
}

export function LinkedInJobsService({ 
  location = 'Jordan', 
  keywords = '', 
  disabilityType = 'none',
  className = '',
  maxJobs = 10 
}: LinkedInJobsServiceProps) {
  const { t, language } = useTranslation();
  const [jobs, setJobs] = useState<LinkedInJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock جلب الوظائف من LinkedIn API
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // محاكاة استدعاء LinkedIn Jobs API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // وظائف وهمية مناسبة لذوي الاحتياجات الخاصة في الأردن
      const mockJobs: LinkedInJob[] = [
        {
          id: '1',
          title: language === 'ar' ? 'مطور ويب - عمل عن بُعد' : 'Remote Web Developer',
          company: 'Aramex Jordan',
          location: 'عمان، الأردن',
          description: language === 'ar' 
            ? 'فرصة مميزة للعمل كمطور ويب مع إمكانية العمل عن بُعد وبيئة عمل شاملة تدعم ذوي الاحتياجات الخاصة.'
            : 'Excellent opportunity to work as a web developer with remote work options and an inclusive work environment.',
          postedTime: '2024-01-15',
          employmentType: 'Full-time',
          experienceLevel: 'Mid-level',
          isAccessibilityFriendly: true,
          accommodations: ['Remote work', 'Flexible hours', 'Accessible office'],
          salaryRange: '800-1200 JOD',
          remoteWorkAvailable: true,
          applicationUrl: 'https://careers.aramex.com/job-123',
          industry: 'Technology',
          skills: ['React', 'JavaScript', 'Node.js']
        },
        {
          id: '2',
          title: language === 'ar' ? 'محاسب مالي - بيئة شاملة' : 'Financial Accountant - Inclusive Environment',
          company: 'Bank of Jordan',
          location: 'عمان، الأردن',
          description: language === 'ar' 
            ? 'البنك الأهلي الأردني يبحث عن محاسب مالي للانضمام لفريق العمل مع توفير بيئة عمل شاملة ومرافق متاحة.'
            : 'Bank of Jordan seeks a financial accountant with inclusive workplace and accessible facilities.',
          postedTime: '2024-01-14',
          employmentType: 'Full-time',
          experienceLevel: 'Entry-level',
          isAccessibilityFriendly: true,
          accommodations: ['Accessible building', 'Sign language interpreter', 'Assistive technology'],
          salaryRange: '600-900 JOD',
          remoteWorkAvailable: false,
          applicationUrl: 'https://boj.com.jo/careers/acc-456',
          industry: 'Banking',
          skills: ['Accounting', 'Excel', 'Financial Analysis']
        },
        {
          id: '3',
          title: language === 'ar' ? 'مصمم جرافيك - دوام مرن' : 'Graphic Designer - Flexible Schedule',
          company: 'Creative Agency Amman',
          location: 'عمان، الأردن',
          description: language === 'ar' 
            ? 'وكالة إبداعية تبحث عن مصمم جرافيك مبدع مع إمكانية العمل بدوام مرن وأدوات مساعدة متطورة.'
            : 'Creative agency looking for a talented graphic designer with flexible working hours and advanced assistive tools.',
          postedTime: '2024-01-13',
          employmentType: 'Part-time',
          experienceLevel: 'Mid-level',
          isAccessibilityFriendly: true,
          accommodations: ['Flexible schedule', 'Specialized software', 'Ergonomic workspace'],
          salaryRange: '400-700 JOD',
          remoteWorkAvailable: true,
          applicationUrl: 'https://creativeamman.com/jobs/designer-789',
          industry: 'Marketing & Advertising',
          skills: ['Photoshop', 'Illustrator', 'InDesign']
        },
        {
          id: '4',
          title: language === 'ar' ? 'أخصائي خدمة عملاء - لغة الإشارة' : 'Customer Service Specialist - Sign Language',
          company: 'Orange Jordan',
          location: 'إربد، الأردن',
          description: language === 'ar' 
            ? 'أورانج الأردن تبحث عن أخصائي خدمة عملاء يجيد لغة الإشارة لخدمة العملاء من ذوي الاحتياجات الخاصة.'
            : 'Orange Jordan seeks customer service specialist fluent in sign language to serve customers with special needs.',
          postedTime: '2024-01-12',
          employmentType: 'Full-time',
          experienceLevel: 'Entry-level',
          isAccessibilityFriendly: true,
          accommodations: ['Sign language support', 'Accessible workspace', 'Specialized training'],
          salaryRange: '500-750 JOD',
          remoteWorkAvailable: false,
          applicationUrl: 'https://orange.jo/careers/cs-101',
          industry: 'Telecommunications',
          skills: ['Sign Language', 'Customer Service', 'Communication']
        },
        {
          id: '5',
          title: language === 'ar' ? 'مدرس تعليم خاص - أونلاين' : 'Special Education Teacher - Online',
          company: 'Jordan Academy for Special Education',
          location: 'الزرقاء، الأردن',
          description: language === 'ar' 
            ? 'أكاديمية الأردن للتعليم الخاص تبحث عن مدرس متخصص في التعليم الخاص للتدريس أونلاين.'
            : 'Jordan Academy for Special Education seeks specialized teacher for online special education.',
          postedTime: '2024-01-11',
          employmentType: 'Contract',
          experienceLevel: 'Senior-level',
          isAccessibilityFriendly: true,
          accommodations: ['Online platform', 'Assistive teaching tools', 'Flexible hours'],
          salaryRange: '300-500 JOD',
          remoteWorkAvailable: true,
          applicationUrl: 'https://jase.edu.jo/teacher-opportunity',
          industry: 'Education',
          skills: ['Special Education', 'Online Teaching', 'Curriculum Development']
        }
      ];

      // تصفية الوظائف حسب نوع الإعاقة
      let filteredJobs = mockJobs;
      
      if (disabilityType !== 'none') {
        filteredJobs = mockJobs.filter(job => {
          switch (disabilityType) {
            case 'visualImpairment':
              return job.accommodations.some(acc => 
                acc.includes('Assistive technology') || 
                acc.includes('Specialized software') ||
                acc.includes('Remote work')
              );
            case 'hearingImpairment':
              return job.accommodations.some(acc => 
                acc.includes('Sign language') || 
                acc.includes('interpreter') ||
                acc.includes('Remote work')
              );
            case 'motorImpairment':
              return job.accommodations.some(acc => 
                acc.includes('Accessible') || 
                acc.includes('Remote work') ||
                acc.includes('Flexible')
              );
            case 'cognitiveImpairment':
              return job.accommodations.some(acc => 
                acc.includes('Flexible') || 
                acc.includes('Specialized training') ||
                acc.includes('Remote work')
              );
            default:
              return true;
          }
        });
      }

      setJobs(filteredJobs.slice(0, maxJobs));
    } catch (err) {
      setError(language === 'ar' ? 'خطأ في تحميل الوظائف' : 'Error loading jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [location, keywords, disabilityType, language]);

  const formatPostedTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (language === 'ar') {
      return diffDays === 1 ? 'منذ يوم واحد' : `منذ ${diffDays} أيام`;
    } else {
      return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="flex items-center space-x-reverse space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>{t('loading')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <Button onClick={fetchJobs} variant="outline">
          <RefreshCw className="w-4 h-4 ml-2" />
          {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
          {language === 'ar' ? 'فرص وظيفية من LinkedIn' : 'LinkedIn Job Opportunities'}
        </h3>
        <Button onClick={fetchJobs} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 ml-2" />
          {language === 'ar' ? 'تحديث' : 'Refresh'}
        </Button>
      </div>

      <div className="space-y-3">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{job.title}</CardTitle>
                  <div className="flex items-center space-x-reverse space-x-2 text-sm text-muted-foreground">
                    <Building className="w-4 h-4" />
                    <span>{job.company}</span>
                    <MapPin className="w-4 h-4 ml-2" />
                    <span>{job.location}</span>
                  </div>
                </div>
                {job.isAccessibilityFriendly && (
                  <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                    {language === 'ar' ? 'متاح' : 'Accessible'}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {job.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  {job.employmentType}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {job.experienceLevel}
                </Badge>
                {job.remoteWorkAvailable && (
                  <Badge variant="secondary" className="text-xs">
                    {language === 'ar' ? 'عمل عن بُعد' : 'Remote'}
                  </Badge>
                )}
                {job.salaryRange && (
                  <Badge variant="outline" className="text-xs">
                    {job.salaryRange}
                  </Badge>
                )}
              </div>

              {job.accommodations.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-green-700 dark:text-green-300">
                    {language === 'ar' ? 'التسهيلات المتاحة:' : 'Available Accommodations:'}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {job.accommodations.map((accommodation, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                        {accommodation}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-reverse space-x-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{formatPostedTime(job.postedTime)}</span>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => window.open(job.applicationUrl, '_blank')}
                  className="flex items-center space-x-reverse space-x-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>{language === 'ar' ? 'تقديم' : 'Apply'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && !loading && (
        <div className="text-center p-8">
          <p className="text-muted-foreground">
            {language === 'ar' 
              ? 'لا توجد وظائف متاحة حالياً تطابق معاييرك' 
              : 'No jobs currently available matching your criteria'
            }
          </p>
        </div>
      )}
    </div>
  );
}