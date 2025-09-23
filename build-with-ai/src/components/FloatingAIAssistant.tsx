import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { useTranslation } from './services/TranslationService';

interface Message {
  id: number;
  sender: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

interface FloatingAIAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function FloatingAIAssistant({ isOpen, onToggle }: FloatingAIAssistantProps) {
  const { t, language, isRTL } = useTranslation();
  const [chatInput, setChatInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { 
      id: 1, 
      sender: 'bot', 
      message: 'مرحباً! أنا مساعد وصلة الذكي 🤖\n\nيمكنني مساعدتك في:\n• 🌟 استكشاف ميزات الموقع\n• ✍️ كتابة المنشورات\n• 💼 البحث عن الفرص\n• 🗺️ استخدام المسارات\n\nكيف يمكنني مساعدتك اليوم؟', 
      timestamp: new Date() 
    }
  ]);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleChatbotMessage = (message: string) => {
    const newMessage: Message = {
      id: chatMessages.length + 1,
      sender: 'user',
      message,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, newMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: chatMessages.length + 2,
        sender: 'bot',
        message: generateBotResponse(message),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('ميزات') || message.includes('خدمات')) {
      return `🌟 ميزات موقع وصلة:\n\n💼 الفرص الوظيفية\n🗺️ المسارات الآمنة\n👥 المجتمع الداعم\n🛒 المتجر\n🔊 القراءة الصوتية\n\nأي ميزة تود معرفة المزيد عنها؟`;
    }
    
    if (message.includes('كتابة') || message.includes('منشور')) {
      return `✍️ نصائح لكتابة منشور رائع:\n\n📝 عنوان واضح\n📖 محتوى مفصل\n🏷️ تصنيف مناسب\n🎯 طلب محدد\n❤️ تجارب إيجابية\n\nما موضوع منشورك؟`;
    }
    
    if (message.includes('فرص') || message.includes('وظيفة')) {
      return `💼 البحث عن الفرص الوظيفية:\n\n🔍 استخدم فلتر البحث المتقدم\n📍 حدد موقعك الجغرافي\n🎯 اختر المجال المناسب\n📄 أضف سيرتك الذاتية\n🔔 فعل التنبيهات\n\nهل تريد مساعدة في مجال معين؟`;
    }
    
    if (message.includes('مسار') || message.includes('خريطة')) {
      return `🗺️ استخدام المسارات الآمنة:\n\n📍 حدد نقطة البداية والوجهة\n♿ اختر المسارات المناسبة للإعاقة\n🚗 تحقق من وسائل النقل\n⏰ راجع أوقات التشغيل\n📱 احفظ المسار للاستخدام لاحقاً\n\nأين تريد الذهاب؟`;
    }
    
    return `شكراً لتواصلك! 😊\n\nيمكنني مساعدتك في:\n• استكشاف الميزات\n• كتابة المنشورات\n• البحث عن الفرص\n• استخدام المسارات\n\nكيف يمكنني مساعدتك؟`;
  };

  const sendMessage = () => {
    if (chatInput.trim()) {
      handleChatbotMessage(chatInput);
      setChatInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center transition-all duration-300"
      style={{ 
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)'
      }}
      onClick={onToggle}
    >
      <div 
        className={`transition-all duration-300 ${
          isMinimized ? 'w-80' : 'w-96 max-w-[90vw]'
        }`}
        style={{ maxHeight: isMinimized ? '60px' : '600px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-purple-600/95 via-orange-500/95 to-green-500/95 backdrop-blur-lg text-white overflow-hidden animate-in rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 via-orange-500/80 to-green-500/80 rounded-2xl"></div>
          
          {/* تأثير الضوء الناعم */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-white/5 to-white/10 pointer-events-none"></div>
        
        {/* Header */}
        <CardHeader className="relative z-10 pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-reverse space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg">المساعد الذكي</h3>
                <p className="text-xs opacity-80">متصل الآن</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-reverse space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 p-1 h-8 w-8"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="text-white hover:bg-white/20 p-1 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="relative z-10 p-4 pt-0 space-y-4">
            {/* Messages Container */}
            <div 
              ref={chatContainerRef}
              className="h-64 overflow-y-auto space-y-3 bg-white/10 backdrop-blur-lg rounded-lg p-3"
              style={{ scrollbarWidth: 'thin' }}
            >
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.sender === 'user'
                        ? 'bg-white/20 text-white'
                        : 'bg-white/90 text-gray-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line leading-relaxed">
                      {msg.message}
                    </p>
                    <p className={`text-xs mt-1 opacity-70 ${
                      msg.sender === 'user' ? 'text-white' : 'text-gray-600'
                    }`}>
                      {msg.timestamp.toLocaleTimeString('ar-SA', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex items-center space-x-reverse space-x-2 bg-white/10 backdrop-blur-lg rounded-lg p-2">
              <Input
                placeholder="اكتب رسالتك هنا..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border-0 bg-transparent text-white placeholder-white/70 focus:ring-0 focus:outline-none"
              />
              <Button
                onClick={sendMessage}
                disabled={!chatInput.trim()}
                className="bg-white/20 hover:bg-white/30 text-white p-2 h-8 w-8 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'اكتشف الميزات', action: 'أخبرني عن ميزات الموقع' },
                { label: 'ساعدني في الكتابة', action: 'ساعدني في كتابة منشور' },
                { label: 'البحث عن فرص', action: 'كيف أجد فرص وظيفية؟' },
                { label: 'استخدام المسارات', action: 'كيف أستخدم المسارات؟' }
              ].map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleChatbotMessage(item.action)}
                  className="text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full px-3 py-1 h-auto transition-all"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </CardContent>
        )}
        </Card>
      </div>
    </div>
  );
}