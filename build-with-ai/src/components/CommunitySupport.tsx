import React, { useState, useRef } from 'react';
import { MessageSquare, Plus, Heart, ThumbsUp, Reply, Volume2, Hand, Upload, Star, Filter, TrendingUp, Clock, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { useTranslation } from './services/TranslationService';

export function CommunitySupport() {
  const { t, isRTL } = useTranslation();
  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const communityPosts = [
    {
      id: 1,
      author: 'أحمد محمد',
      authorInitials: 'أم',
      category: 'استشارة',
      title: 'نصائح للحصول على وظيفة في مجال التكنولوجيا',
      content: 'أبحث عن نصائح للأشخاص ذوي الإعاقة البصرية للعمل في مجال البرمجة. ما هي الأدوات والموارد التي تنصحونني بها؟ شاركوا تجاربكم الشخصية إذا كانت لديكم خبرة في هذا المجال.',
      likes: 15,
      replies: 8,
      timestamp: 'منذ 3 ساعات',
      hasAudio: true,
      hasSignLanguage: false,
      points: 25,
      trending: true,
      images: []
    },
    {
      id: 2,
      author: 'فاطمة العلي',
      authorInitials: 'فع',
      category: 'تجربة',
      title: 'تجربتي في استخدام التطبيقات الصوتية',
      content: 'أشارك معكم تجربتي مع تطبيقات القراءة الصوتية وكيف ساعدتني في دراستي الجامعية. إليكم أفضل التطبيقات التي جربتها والنصائح المهمة للاستفادة القصوى منها.',
      likes: 32,
      replies: 12,
      timestamp: 'منذ 5 ساعات',
      hasAudio: false,
      hasSignLanguage: true,
      points: 40,
      trending: false,
      images: ['/api/placeholder/300/200', '/api/placeholder/300/200']
    },
    {
      id: 3,
      author: 'خالد السعد',
      authorInitials: 'خس',
      category: 'سؤال',
      title: 'أفضل المسارات للتنقل في الرياض؟',
      content: 'مرحباً، أنا جديد في الرياض وأستخدم كرسي متحرك. هل يمكنكم نصحي بأفضل المسارات والمواصلات المتاحة؟ أحتاج معلومات خاصة عن المترو ومدى توفر المصاعد.',
      likes: 18,
      replies: 15,
      timestamp: 'منذ يوم',
      hasAudio: true,
      hasSignLanguage: false,
      points: 30,
      trending: false,
      images: []
    },
    {
      id: 4,
      author: 'نورا الحسن',
      authorInitials: 'نح',
      category: 'إنجاز',
      title: 'حصلت على شهادة في التصميم الجرافيكي! 🎉',
      content: 'سعيدة جداً لمشاركتكم هذا الإنجاز. بعد سنة من التعلم والممارسة، حصلت أخيراً على شهادة معتمدة في التصميم الجرافيكي رغم إعاقتي السمعية. الحلم أصبح حقيقة!',
      likes: 89,
      replies: 25,
      timestamp: 'منذ يومين',
      hasAudio: false,
      hasSignLanguage: true,
      points: 100,
      trending: true,
      images: ['/api/placeholder/400/300']
    },
    {
      id: 5,
      author: 'سعد الأحمد',
      authorInitials: 'سأ',
      category: 'تجربة',
      title: 'رحلتي في تعلم البرمجة كشخص كفيف',
      content: 'أردت مشاركة تجربتي في تعلم البرمجة كشخص كفيف. البداية كانت صعبة لكن مع الأدوات المناسبة والصبر، تمكنت من إتقان عدة لغات برمجة. إليكم الأدوات التي ساعدتني.',
      likes: 45,
      replies: 18,
      timestamp: 'منذ 3 أيام',
      hasAudio: true,
      hasSignLanguage: false,
      points: 65,
      trending: false,
      images: []
    }
  ];

  const categories = [
    { value: 'all', label: 'جميع المنشورات', icon: MessageSquare, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { value: 'استشارة', label: 'استشارات', icon: MessageSquare, color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { value: 'تجربة', label: 'تجارب شخصية', icon: Star, color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
    { value: 'سؤال', label: 'أسئلة', icon: MessageSquare, color: 'bg-gradient-to-r from-orange-500 to-red-500' },
    { value: 'إنجاز', label: 'إنجازات', icon: Award, color: 'bg-gradient-to-r from-yellow-500 to-orange-500' }
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? communityPosts 
    : communityPosts.filter(post => post.category === selectedCategory);

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      setNewPost('');
      setSelectedImages([]);
      alert('تم نشر منشورك بنجاح!');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setSelectedImages(prev => [...prev, ...imageFiles].slice(0, 5));
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const speakPost = (content: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.lang = 'ar';
      speechSynthesis.speak(utterance);
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.value === category);
    return categoryData ? categoryData.icon : MessageSquare;
  };

  const getCategoryColor = (category: string) => {
    const categoryData = categories.find(c => c.value === category);
    return categoryData ? categoryData.color : 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-green-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-orange-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Main Content - Full Width */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Create New Post */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-purple-50/30 to-orange-50/30 dark:from-gray-800 dark:via-purple-900/10 dark:to-orange-900/10 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-[var(--color-pastel-purple)]/20 to-[var(--color-light-orange)]/20 rounded-t-lg">
              <CardTitle className="flex items-center space-x-reverse space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[var(--color-dark-purple)] to-[var(--color-vibrant-orange)] rounded-full flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">شارك مع المجتمع</span>
                  <p className="text-sm opacity-70 mt-1">اكتب منشوراً جديداً وشارك تجربتك</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <Textarea
                placeholder="شارك تجربتك، اطرح سؤالاً، أو قدم نصيحة للمجتمع... 📝"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[120px] border-2 border-[var(--color-pastel-purple)]/30 focus:border-[var(--color-dark-purple)] rounded-xl bg-white/80 dark:bg-gray-800/80 resize-none text-lg"
                aria-label="محتوى المنشور الجديد"
              />

              {/* Image Preview */}
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 rounded-xl border border-[var(--color-pastel-purple)]/30">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`الصورة ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-white shadow-lg transition-transform group-hover:scale-105"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-all shadow-lg transform hover:scale-110"
                        aria-label={`إزالة الصورة ${index + 1}`}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-reverse space-x-3 flex-wrap gap-3">
                  <Select>
                    <SelectTrigger className="w-48 border-2 border-[var(--color-pastel-purple)]/30 rounded-lg">
                      <SelectValue placeholder="اختر التصنيف" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="استشارة">💡 استشارة</SelectItem>
                      <SelectItem value="تجربة">⭐ تجربة شخصية</SelectItem>
                      <SelectItem value="سؤال">❓ سؤال</SelectItem>
                      <SelectItem value="إنجاز">🏆 إنجاز</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="sm" className="border-2 border-orange-200 text-orange-600 hover:bg-orange-100 hover:border-orange-300 rounded-lg px-4 py-2 transition-all">
                    <Volume2 className="w-4 h-4 ml-2" />
                    منشور صوتي
                  </Button>
                  
                  <Button variant="outline" size="sm" className="border-2 border-green-200 text-green-600 hover:bg-green-100 hover:border-green-300 rounded-lg px-4 py-2 transition-all">
                    <Hand className="w-4 h-4 ml-2" />
                    لغة إشارة
                  </Button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    aria-label="رفع الصور"
                  />
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300 rounded-lg px-4 py-2 transition-all"
                    disabled={selectedImages.length >= 5}
                  >
                    <Upload className="w-4 h-4 ml-2" />
                    رفع صور ({selectedImages.length}/5)
                  </Button>
                </div>
                
                <Button 
                  onClick={handlePostSubmit} 
                  disabled={!newPost.trim()}
                  className="bg-gradient-to-r from-[var(--color-dark-purple)] to-[var(--color-vibrant-orange)] hover:from-[var(--color-dark-purple)]/90 hover:to-[var(--color-vibrant-orange)]/90 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <MessageSquare className="w-4 h-4 ml-2" />
                  نشر
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Filter Posts */}
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-reverse space-x-4">
                  <Filter className="w-5 h-5 text-[var(--color-dark-purple)]" />
                  <span className="font-semibold text-lg">تصفية المنشورات:</span>
                </div>
                <div className="flex items-center space-x-reverse space-x-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-64 border-2 border-[var(--color-pastel-purple)]/30 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center space-x-reverse space-x-3">
                              <div className={`w-4 h-4 ${category.color} rounded-full flex items-center justify-center`}>
                                <Icon className="w-2 h-2 text-white" />
                              </div>
                              <span>{category.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredPosts.length} منشور
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Posts */}
          <div className="space-y-6">
            {filteredPosts.map((post) => {
              const CategoryIcon = getCategoryIcon(post.category);
              return (
                <Card key={post.id} className="group border-0 shadow-xl bg-gradient-to-br from-white via-gray-50/30 to-white dark:from-gray-800 dark:via-gray-700/30 dark:to-gray-800 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-reverse space-x-6">
                      <Avatar className="w-16 h-16 shadow-lg">
                        <AvatarFallback className="bg-gradient-to-br from-[var(--color-pastel-purple)] to-[var(--color-light-orange)] text-[var(--color-dark-purple)] text-lg font-bold">
                          {post.authorInitials}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-reverse space-x-3 flex-wrap gap-2">
                              <h3 className="font-bold text-lg">{post.author}</h3>
                              <div className={`px-3 py-1 ${getCategoryColor(post.category)} text-white text-xs font-medium rounded-full flex items-center space-x-reverse space-x-1 shadow-sm`}>
                                <CategoryIcon className="w-3 h-3" />
                                <span>{post.category}</span>
                              </div>
                              {post.points >= 50 && (
                                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-sm">
                                  <Star className="w-3 h-3 ml-1 fill-current" />
                                  {post.points}
                                </Badge>
                              )}
                              {post.trending && (
                                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-sm animate-pulse">
                                  <TrendingUp className="w-3 h-3 ml-1" />
                                  شائع
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-reverse space-x-2 text-sm text-gray-600 dark:text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>{post.timestamp}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-reverse space-x-2">
                            {post.hasAudio && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => speakPost(post.content)}
                                aria-label="استماع للمنشور"
                                className="text-orange-600 hover:bg-orange-100 hover:text-orange-700 rounded-full p-2 transition-all"
                              >
                                <Volume2 className="w-5 h-5" />
                              </Button>
                            )}
                            {post.hasSignLanguage && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                aria-label="عرض ترجمة لغة الإشارة"
                                className="text-green-600 hover:bg-green-100 hover:text-green-700 rounded-full p-2 transition-all"
                              >
                                <Hand className="w-5 h-5" />
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-[var(--color-dark-purple)] transition-colors">
                            {post.title}
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                            {post.content}
                          </p>
                          
                          {/* Images */}
                          {post.images && post.images.length > 0 && (
                            <div className={`grid gap-3 rounded-xl overflow-hidden ${
                              post.images.length === 1 ? 'grid-cols-1' : 
                              post.images.length === 2 ? 'grid-cols-2' : 
                              'grid-cols-3'
                            }`}>
                              {post.images.map((image, index) => (
                                <div key={index} className="relative overflow-hidden rounded-lg shadow-lg group">
                                  <img
                                    src={image}
                                    alt={`صورة ${index + 1}`}
                                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                                  />
                                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-reverse space-x-6">
                            <Button variant="ghost" size="sm" className="flex items-center space-x-reverse space-x-2 text-purple-600 hover:bg-purple-100 hover:text-purple-700 rounded-lg px-4 py-2 transition-all">
                              <ThumbsUp className="w-5 h-5" />
                              <span className="font-medium">{post.likes}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center space-x-reverse space-x-2 text-green-600 hover:bg-green-100 hover:text-green-700 rounded-lg px-4 py-2 transition-all">
                              <Reply className="w-5 h-5" />
                              <span className="font-medium">{post.replies} رد</span>
                            </Button>
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-100 hover:text-red-600 rounded-full p-2 transition-all">
                            <Heart className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}