import React, { useState } from 'react';
import { MessageSquare, Plus, Heart, ThumbsUp, Reply, Volume2, Hand, Bot, Trophy, Star, Users, Send, Lightbulb, Navigation, Edit3 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarContent, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { useTranslation } from './services/TranslationService';

export function CommunitySupport() {
  const { t } = useTranslation();
  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { 
      id: 1, 
      sender: 'bot', 
      message: 'مرحباً! أنا مساعد وصلة الذكي 🤖 يمكنني مساعدتك في:\n\n• 🌟 استكشاف ميزات الموقع\n• 🧭 التنقل والعثور على الخدمات\n• ✍️ كتابة المنشورات والأسئلة\n• 💼 البحث عن الفرص الوظيفية\n• 🗺️ استخدام المسارات الآمنة\n\nكيف يمكنني مساعدتك اليوم؟', 
      timestamp: new Date() 
    }
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

  const quickActions = [
    { icon: Lightbulb, label: 'اكتشف الميزات', action: 'features' },
    { icon: Navigation, label: 'ساعدني في التنقل', action: 'navigation' },
    { icon: Edit3, label: 'ساعدني في الكتابة', action: 'writing' },
    { icon: Heart, label: 'ابحث عن فرص', action: 'opportunities' }
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? communityPosts 
    : communityPosts.filter(post => post.category === selectedCategory);

  const handlePostSubmit = () => {
    if (newPost.trim()) {
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

  const handleQuickAction = (action: string) => {
    let message = '';
    switch (action) {
      case 'features':
        message = 'أخبرني عن ميزات الموقع';
        break;
      case 'navigation':
        message = 'كيف أستخدم الموقع؟';
        break;
      case 'writing':
        message = 'ساعدني في كتابة منشور';
        break;
      case 'opportunities':
        message = 'كيف أجد فرص وظيفية؟';
        break;
    }
    handleChatbotMessage(message);
  };

  const handleChatbotMessage = (message: string) => {
    const newMessage = {
      id: chatMessages.length + 1,
      sender: 'user' as const,
      message,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, newMessage]);

    setTimeout(() => {
      const botResponse = {
        id: chatMessages.length + 2,
        sender: 'bot' as const,
        message: generateEnhancedBotResponse(message),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const generateEnhancedBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Enhanced responses with website promotion
    if (message.includes('ميزات') || message.includes('خدمات')) {
      return `🌟 ميزات موقع وصلة الرائعة:\n\n💼 الفرص الوظيفية: وظائف مخصصة لذوي الاحتياجات الخاصة مع ربط ذكي بـ LinkedIn\n\n🗺️ المسارات الآمنة: خرائط تفاعلية مع Google Maps لأفضل طرق التنقل\n\n👥 المجتمع: منصة دعم وتبادل خبرات\n\n🛒 المتجر: أدوات مساعدة وإمكانية المساهمة\n\n🤖 لغة الإشارة: أفتار ثلاثي الأبعاد للترجمة\n\n🔊 القراءة الصوتية: بتقنية متقدمة باللهجة الأردنية\n\nأي من هذه الميزات تود معرفة المزيد عنها؟`;
    }
    
    if (message.includes('تنقل') || message.includes('استخدام') || message.includes('كيف')) {
      return `🧭 للتنقل في موقع وصلة:\n\n1️⃣ استخدم القائمة العلوية للانتقال بين الأقسام\n2️⃣ اضغط على زر الإعدادات ⚙️ لتخصيص تجربتك\n3️⃣ فعّل الوضع المناسب لنوع الإعاقة من الإعدادات\n4️⃣ استخدم أزرار القراءة الصوتية 🔊 في المحتوى\n5️⃣ فعّل لغة الإشارة 🤖 إذا كنت تحتاجها\n\n💡 نصيحة: يمكنك استخدام اختصارات لوحة المفاتيح للتنقل السريع!\n\nهل تحتاج مساعدة في قسم معين؟`;
    }
    
    if (message.includes('كتابة') || message.includes('منشور') || message.includes('أكتب')) {
      return `✍️ نصائح لكتابة منشور رائع:\n\n📝 عنوان واضح ومحدد\n📖 اشرح تجربتك أو سؤالك بالتفصيل\n🏷️ اختر التصنيف المناسب (استشارة، تجربة، سؤال، إنجاز)\n🎯 كن محدداً في طلب المساعدة\n❤️ شارك تجاربك الإيجابية لتحفيز الآخرين\n\n💭 أمثلة للمواضيع:\n• تجربتك مع أدوات مساعدة جديدة\n• نصائح للتوظيف في مجالك\n• تحديات واجهتها وكيف تغلبت عليها\n• أسئلة حول الخدمات أو المساعدة\n\nما الموضوع الذي تود الكتابة عنه؟`;
    }
    
    if (message.includes('وظيفة') || message.includes('عمل') || message.includes('فرص')) {
      return `💼 البحث عن الفرص الوظيفية في وصلة:\n\n🔍 اذهب لقسم "الفرص" من القائمة الرئيسية\n🎯 استخدم الفلاتر للبحث حسب:\n   • نوع الإعاقة\n   • المجال المهني\n   • الموقع الجغرافي\n   • مستوى الخبرة\n\n🌟 مميزات خاصة:\n• ربط ذكي مع LinkedIn\n• وظائف مخصصة لذوي الاحتياجات الخاصة\n• نصائح للمقابلات الشخصية\n• دعم في كتابة السيرة الذاتية\n\n📱 يمكنك أيضاً تفعيل الإشعارات للحصول على فرص جديدة فور نشرها!\n\nهل تبحث عن مجال معين؟`;
    }
    
    if (message.includes('خرائط') || message.includes('مسار') || message.includes('طريق')) {
      return `🗺️ استخدام المسارات الآمنة:\n\n📍 اذهب لقسم "المسارات الآمنة"\n🎯 أدخل موقعك الحالي والوجهة\n🚶‍♂️ اختر نوع التنقل (مشي، كرسي متحرك، مواصلات)\n\n✨ الميزات المتوفرة:\n• طرق خالية من العوائق\n• معلومات عن إمكانية الوصول\n• أماكن الراحة والخدمات\n• تقييمات من المستخدمين\n• تحديثات فورية عن حالة الطرق\n\n💡 نصيحة: احفظ مساراتك المفضلة للوصول السريع!\n\nإلى أين تود الذهاب؟`;
    }
    
    if (message.includes('مساعدة') || message.includes('مشكلة') || message.includes('صعوبة')) {
      return `🤝 أنا هنا لمساعدتك! يمكنني الإجابة على:\n\n🌟 أسئلة حول ميزات الموقع\n🧭 كيفية استخدام الخدمات المختلفة\n✍️ نصائح للكتابة والمشاركة\n💼 إرشادات البحث عن العمل\n🗺️ استخدام المسارات والخرائط\n🛒 التسوق والمساهمة في المتجر\n⚙️ تخصيص إعدادات الوصولية\n\n❓ لأي مساعدة أكثر تحديداً، يمكنك:\n• التواصل مع فريق الدعم\n• نشر سؤالك في المجتمع\n• استكشاف الأسئلة الشائعة\n\nما التحدي الذي تواجهه تحديداً؟`;
    }
    
    // Default enhanced response
    return `شكراً لتواصلك معي! 😊\n\n🎯 يمكنني مساعدتك في:\n• 🌟 اكتشاف ميزات الموقع الرائعة\n• 🧭 التنقل واستخدام الخدمات\n• ✍️ كتابة منشورات مميزة\n• 💼 البحث عن الفرص الوظيفية\n• 🗺️ استخدام المسارات الآمنة\n• 🛒 استكشاف المتجر والمساهمات\n\nاستخدم الأزرار السريعة أدناه أو اكتب ما تحتاج مساعدة فيه! 🚀`;
  };

  const sendMessage = () => {
    if (chatInput.trim()) {
      handleChatbotMessage(chatInput);
      setChatInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
          مجتمع وصلة
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          انضم إلى مجتمعنا الداعم وشارك تجاربك واحصل على المساعدة والإرشاد
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Create New Post */}
          <Card className="border-purple-200 dark:border-purple-700">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20">
              <CardTitle className="flex items-center space-x-reverse space-x-2">
                <Plus className="w-5 h-5 text-purple-600" />
                <span>شارك مع المجتمع</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="شارك تجربتك، اطرح سؤالاً، أو قدم نصيحة للمجتمع..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px] border-purple-200 focus:border-purple-400"
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
                  
                  <Button variant="outline" size="sm" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                    <Volume2 className="w-4 h-4 ml-2" />
                    منشور صوتي
                  </Button>
                  
                  <Button variant="outline" size="sm" className="border-green-200 text-green-600 hover:bg-green-50">
                    <Hand className="w-4 h-4 ml-2" />
                    لغة إشارة
                  </Button>
                </div>
                
                <Button 
                  onClick={handlePostSubmit} 
                  disabled={!newPost.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
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
              <Card key={post.id} className="hover:shadow-md transition-shadow border-l-4 border-l-purple-400">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-reverse space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-purple-100 text-purple-800">
                        {post.authorInitials}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-reverse space-x-2">
                            <h3 className="font-semibold">{post.author}</h3>
                            <Badge variant="outline" className="text-xs border-purple-200 text-purple-700">
                              {post.category}
                            </Badge>
                            {post.points >= 50 && (
                              <Badge variant="default" className="bg-orange-100 text-orange-800">
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
                              className="text-orange-600 hover:bg-orange-50"
                            >
                              <Volume2 className="w-4 h-4" />
                            </Button>
                          )}
                          {post.hasSignLanguage && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              aria-label="عرض ترجمة لغة الإشارة"
                              className="text-green-600 hover:bg-green-50"
                            >
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
                        <Button variant="ghost" size="sm" className="flex items-center space-x-reverse space-x-1 text-purple-600 hover:bg-purple-50">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center space-x-reverse space-x-1 text-green-600 hover:bg-green-50">
                          <Reply className="w-4 h-4" />
                          <span>{post.replies} رد</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-orange-600 hover:bg-orange-50">
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
          {/* Enhanced AI Chatbot */}
          <Card className="border-purple-200 dark:border-purple-700">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20">
              <CardTitle className="flex items-center space-x-reverse space-x-2">
                <Bot className="w-5 h-5 text-purple-600" />
                <span>المساعد الذكي</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full mb-4 bg-purple-600 hover:bg-purple-700" 
                onClick={() => setChatbotVisible(!chatbotVisible)}
              >
                {chatbotVisible ? 'إخفاء المحادثة' : 'ابدأ محادثة'}
              </Button>
              
              {chatbotVisible && (
                <div className="space-y-4">
                  {/* Quick Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAction(action.action)}
                          className="text-xs h-auto py-2 border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Icon className="w-3 h-3 mb-1" />
                          <span className="text-center">{action.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Separator />
                  
                  {/* Chat Messages */}
                  <div className="h-80 border rounded-lg p-3 overflow-y-auto space-y-3 bg-gradient-to-b from-purple-50/30 to-orange-50/30 dark:from-purple-900/10 dark:to-orange-900/10">
                    {chatMessages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`p-3 rounded-lg text-sm max-w-[85%] ${
                          msg.sender === 'bot' 
                            ? 'bg-white dark:bg-gray-800 text-right shadow-sm border border-purple-100' 
                            : 'bg-purple-100 dark:bg-purple-900 text-left ml-auto'
                        }`}
                      >
                        {msg.sender === 'bot' && (
                          <div className="flex items-center space-x-reverse space-x-2 mb-2">
                            <Bot className="w-4 h-4 text-purple-600" />
                            <span className="text-xs font-medium text-purple-600">مساعد وصلة</span>
                          </div>
                        )}
                        <div className="whitespace-pre-line">{msg.message}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Chat Input */}
                  <div className="flex space-x-reverse space-x-2">
                    <Input 
                      placeholder="اكتب رسالتك..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      className="border-purple-200 focus:border-purple-400"
                    />
                    <Button 
                      size="sm" 
                      onClick={sendMessage}
                      disabled={!chatInput.trim()}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Send className="w-4 h-4" />
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
                <Trophy className="w-5 h-5 text-orange-600" />
                <span>أفضل المساهمين</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topContributors.map((contributor, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded border-orange-100">
                  <div className="flex items-center space-x-reverse space-x-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-orange-400 text-orange-900' :
                      index === 1 ? 'bg-gray-300 text-gray-700' :
                      index === 2 ? 'bg-amber-600 text-amber-100' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{contributor.name}</p>
                      <p className="text-xs text-muted-foreground">{contributor.badge}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs border-orange-200 text-orange-700">
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
                  <div className="text-2xl font-bold text-purple-600">1,250</div>
                  <div className="text-xs text-muted-foreground">عضو نشط</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">3,480</div>
                  <div className="text-xs text-muted-foreground">منشور</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">15,620</div>
                  <div className="text-xs text-muted-foreground">تفاعل</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">98%</div>
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