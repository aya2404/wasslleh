import React, { useState } from 'react';
import { MessageSquare, Plus, Heart, ThumbsUp, Reply, Volume2, Hand, Bot, Trophy, Star, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarContent, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function CommunityPage() {
  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'bot', message: 'مرحباً! أنا مساعد وصال الذكي. كيف يمكنني مساعدتك اليوم؟', timestamp: new Date() }
  ]);

  const communityPosts = [
    {
      id: 1,
      author: 'أحمد محمد',
      authorInitials: 'أم',
      category: 'استشارة',
      title: 'نصائح للحصول على وظيفة في مجال التكنولوجيا',
      content: 'أبحث عن نصائح للأشخاص ذوي الإعاقة البصرية للعمل في مجال البرمجة. ما هي الأدوات والموارد التي تنصحونني بها؟',
      likes: 15,
      replies: 8,
      timestamp: 'منذ 3 ساعات',
      hasAudio: true,
      hasSignLanguage: false,
      points: 25
    },
    {
      id: 2,
      author: 'فاطمة العلي',
      authorInitials: 'فع',
      category: 'تجربة',
      title: 'تجربتي في استخدام التطبيقات الصوتية',
      content: 'أشارك معكم تجربتي مع تطبيقات القراءة الصوتية وكيف ساعدتني في دراستي الجامعية. إليكم أفضل التطبيقات التي جربتها...',
      likes: 32,
      replies: 12,
      timestamp: 'منذ 5 ساعات',
      hasAudio: false,
      hasSignLanguage: true,
      points: 40
    },
    {
      id: 3,
      author: 'خالد السعد',
      authorInitials: 'خس',
      category: 'سؤال',
      title: 'أفضل المسارات للتنقل في الرياض؟',
      content: 'مرحباً، أنا جديد في الرياض وأستخدم كرسي متحرك. هل يمكنكم نصحي بأفضل المسارات والمواصلات المتاحة؟',
      likes: 18,
      replies: 15,
      timestamp: 'منذ يوم',
      hasAudio: true,
      hasSignLanguage: false,
      points: 30
    },
    {
      id: 4,
      author: 'نورا الحسن',
      authorInitials: 'نح',
      category: 'إنجاز',
      title: 'حصلت على شهادة في التصميم الجرافيكي!',
      content: 'سعيدة جداً لمشاركتكم هذا الإنجاز. بعد سنة من التعلم والممارسة، حصلت أخيراً على شهادة معتمدة في التصميم الجرافيكي رغم إعاقتي السمعية.',
      likes: 89,
      replies: 25,
      timestamp: 'منذ يومين',
      hasAudio: false,
      hasSignLanguage: true,
      points: 100
    }
  ];

  const topContributors = [
    { name: 'سارة أحمد', points: 1250, badge: 'خبير' },
    { name: 'محمد علي', points: 980, badge: 'مساعد' },
    { name: 'ليلى حسن', points: 745, badge: 'نشط' },
    { name: 'عبدالله خالد', points: 650, badge: 'مشارك' }
  ];

  const categories = [
    { value: 'all', label: 'جميع المنشورات' },
    { value: 'استشارة', label: 'استشارات' },
    { value: 'تجربة', label: 'تجارب شخصية' },
    { value: 'سؤال', label: 'أسئلة' },
    { value: 'إنجاز', label: 'إنجازات' }
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? communityPosts 
    : communityPosts.filter(post => post.category === selectedCategory);

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      // Add new post logic here
      setNewPost('');
      alert('تم نشر منشورك بنجاح!');
    }
  };

  const speakPost = (content: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.lang = 'ar';
      speechSynthesis.speak(utterance);
    }
  };

  const handleChatbotMessage = (message: string) => {
    const newMessage = {
      id: chatMessages.length + 1,
      sender: 'user',
      message,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, newMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: chatMessages.length + 2,
        sender: 'bot',
        message: generateBotResponse(message),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const generateBotResponse = (userMessage: string) => {
    const responses = {
      'وظيفة': 'يمكنك استكشاف الفرص الوظيفية في قسم "الفرص" في الموقع. نوفر وظائف مخصصة لذوي الاحتياجات الخاصة.',
      'تعليم': 'لدينا دورات تدريبية متنوعة في قسم التعليم، جميعها مصممة لتناسب احتياجاتك الخاصة.',
      'مواصلات': 'يمكنك استخدام قسم "المسارات الآمنة" للعثور على أفضل طرق التنقل المتاحة.',
      'مساعدة': 'أنا هنا لمساعدتك! يمكنني الإجابة على أسئلتك حول الوظائف، التعليم، المواصلات، أو أي موضوع آخر.',
      'default': 'شكراً لسؤالك. يمكنني مساعدتك في مواضيع مختلفة مثل الوظائف، التعليم، المواصلات، والخدمات المجتمعية. ما الذي تود معرفته؟'
    };

    for (const [keyword, response] of Object.entries(responses)) {
      if (userMessage.includes(keyword)) {
        return response;
      }
    }
    
    return responses.default;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
          مجتمع وصال
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          انضم إلى مجتمعنا الداعم وشارك تجاربك واحصل على المساعدة والإرشاد
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Create New Post */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-reverse space-x-2">
                <Plus className="w-5 h-5" />
                <span>شارك مع المجتمع</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="شارك تجربتك، اطرح سؤالاً، أو قدم نصيحة للمجتمع..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px]"
                aria-label="محتوى المنشور الجديد"
              />
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-reverse space-x-2">
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="اختر التصنيف" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="استشارة">استشارة</SelectItem>
                      <SelectItem value="تجربة">تجربة شخصية</SelectItem>
                      <SelectItem value="سؤال">سؤال</SelectItem>
                      <SelectItem value="إنجاز">إنجاز</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="sm">
                    <Volume2 className="w-4 h-4 ml-2" />
                    منشور صوتي
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Hand className="w-4 h-4 ml-2" />
                    لغة إشارة
                  </Button>
                </div>
                
                <Button onClick={handlePostSubmit} disabled={!newPost.trim()}>
                  <MessageSquare className="w-4 h-4 ml-2" />
                  نشر
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Filter Posts */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-reverse space-x-4">
                <span className="text-sm font-medium">تصفية المنشورات:</span>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Community Posts */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-reverse space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-blue-100 text-blue-800">
                        {post.authorInitials}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-reverse space-x-2">
                            <h3 className="font-semibold">{post.author}</h3>
                            <Badge variant="outline" className="text-xs">
                              {post.category}
                            </Badge>
                            {post.points >= 50 && (
                              <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                                <Star className="w-3 h-3 ml-1" />
                                {post.points}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                        </div>
                        
                        <div className="flex space-x-reverse space-x-2">
                          {post.hasAudio && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => speakPost(post.content)}
                              aria-label="استماع للمنشور"
                            >
                              <Volume2 className="w-4 h-4" />
                            </Button>
                          )}
                          {post.hasSignLanguage && (
                            <Button variant="ghost" size="sm" aria-label="عرض ترجمة لغة الإشارة">
                              <Hand className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">{post.title}</h4>
                        <p className="text-muted-foreground">{post.content}</p>
                      </div>
                      
                      <div className="flex items-center space-x-reverse space-x-6 pt-3 border-t">
                        <Button variant="ghost" size="sm" className="flex items-center space-x-reverse space-x-1">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center space-x-reverse space-x-1">
                          <Reply className="w-4 h-4" />
                          <span>{post.replies} رد</span>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Chatbot */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-reverse space-x-2">
                <Bot className="w-5 h-5" />
                <span>المساعد الذكي</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full mb-4" 
                onClick={() => setChatbotVisible(!chatbotVisible)}
              >
                {chatbotVisible ? 'إخفاء المحادثة' : 'ابدأ محادثة'}
              </Button>
              
              {chatbotVisible && (
                <div className="space-y-4">
                  <div className="h-64 border rounded-lg p-3 overflow-y-auto space-y-2">
                    {chatMessages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`p-2 rounded text-sm ${
                          msg.sender === 'bot' 
                            ? 'bg-blue-100 dark:bg-blue-900 text-right' 
                            : 'bg-gray-100 dark:bg-gray-800 text-left'
                        }`}
                      >
                        {msg.message}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-reverse space-x-2">
                    <Input 
                      placeholder="اكتب رسالتك..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const target = e.target as HTMLInputElement;
                          if (target.value.trim()) {
                            handleChatbotMessage(target.value);
                            target.value = '';
                          }
                        }
                      }}
                    />
                    <Button size="sm">
                      إرسال
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Contributors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-reverse space-x-2">
                <Trophy className="w-5 h-5" />
                <span>أفضل المساهمين</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topContributors.map((contributor, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center space-x-reverse space-x-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-300 text-gray-700' :
                      index === 2 ? 'bg-amber-600 text-amber-100' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{contributor.name}</p>
                      <p className="text-xs text-muted-foreground">{contributor.badge}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {contributor.points} نقطة
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Community Stats */}
          <Card>
            <CardHeader>
              <CardTitle>إحصائيات المجتمع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">1,250</div>
                  <div className="text-xs text-muted-foreground">عضو نشط</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">3,480</div>
                  <div className="text-xs text-muted-foreground">منشور</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">15,620</div>
                  <div className="text-xs text-muted-foreground">تفاعل</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">98%</div>
                  <div className="text-xs text-muted-foreground">رضا الأعضاء</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>قوانين المجتمع</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• احترم جميع الأعضاء وتجاربهم</li>
                <li>• شارك المحتوى المفيد والبناء</li>
                <li>• ساعد الآخرين بالنصح والإرشاد</li>
                <li>• تجنب المحتوى غير المناسب</li>
                <li>• استخدم لغة محترمة ومهذبة</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}