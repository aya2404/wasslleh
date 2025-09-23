import React, { useState, useRef } from 'react';
import { X, Camera, FileText, Volume2, Download, Share2, Eye, Languages, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { OCRService } from './services/OCRService';
import { QuickTTS } from './services/TTSService';
import { useTranslation } from './services/TranslationService';

interface CameraOCRPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CameraOCRPanel({ isOpen, onClose }: CameraOCRPanelProps) {
  const { t, language } = useTranslation();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert(language === 'ar' ? 'خطأ في الوصول للكاميرا' : 'Error accessing camera');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        stopCamera();
        processImage(imageData);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        processImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Simulate processing progress
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      // Mock OCR processing - in real implementation, use actual OCR service
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockText = language === 'ar' 
        ? 'هذا نص تجريبي تم استخراجه من الصورة باستخدام تقنية التعرف الضوئي على الحروف. يمكن للنظام قراءة النصوص العربية والإنجليزية بدقة عالية.'
        : 'This is sample text extracted from the image using Optical Character Recognition technology. The system can read Arabic and English texts with high accuracy.';
      
      setExtractedText(mockText);
      setProcessingProgress(100);
    } catch (error) {
      console.error('OCR processing error:', error);
      alert(language === 'ar' ? 'خطأ في معالجة الصورة' : 'Error processing image');
    } finally {
      setIsProcessing(false);
      clearInterval(progressInterval);
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setExtractedText('');
    setProcessingProgress(0);
    setIsProcessing(false);
  };

  const shareText = () => {
    if (navigator.share && extractedText) {
      navigator.share({
        title: language === 'ar' ? 'نص مستخرج' : 'Extracted Text',
        text: extractedText
      });
    } else {
      navigator.clipboard.writeText(extractedText);
      alert(language === 'ar' ? 'تم نسخ النص' : 'Text copied to clipboard');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto border-green-200 dark:border-green-700"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-reverse space-x-2">
              <Camera className="w-5 h-5 text-green-600" />
              <span>{language === 'ar' ? 'الكاميرا الذكية للقراءة' : 'Smart Reading Camera'}</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs defaultValue="camera" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="camera" className="flex items-center space-x-reverse space-x-2">
                <Camera className="w-4 h-4" />
                <span>{language === 'ar' ? 'الكاميرا' : 'Camera'}</span>
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center space-x-reverse space-x-2">
                <FileText className="w-4 h-4" />
                <span>{language === 'ar' ? 'النتائج' : 'Results'}</span>
                {extractedText && (
                  <Badge className="bg-green-500 text-white">
                    {language === 'ar' ? 'جاهز' : 'Ready'}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="camera" className="space-y-4 mt-6">
              {!capturedImage ? (
                <div className="space-y-4">
                  {/* Camera View */}
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    {cameraActive ? (
                      <>
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="border-2 border-white rounded-lg w-64 h-40 opacity-50"></div>
                        </div>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                          <Button 
                            onClick={captureImage}
                            size="lg"
                            className="rounded-full w-16 h-16 bg-green-600 hover:bg-green-700"
                          >
                            <Camera className="w-8 h-8" />
                          </Button>
                        </div>
                        <Button
                          onClick={stopCamera}
                          variant="outline"
                          size="sm"
                          className="absolute top-4 right-4"
                        >
                          {language === 'ar' ? 'إيقاف' : 'Stop'}
                        </Button>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <Camera className="w-16 h-16 mx-auto text-gray-400" />
                          <p className="text-gray-500">
                            {language === 'ar' ? 'اضغط لتشغيل الكاميرا' : 'Click to start camera'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Control Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      onClick={cameraActive ? stopCamera : startCamera}
                      className="bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      {cameraActive 
                        ? (language === 'ar' ? 'إيقاف الكاميرا' : 'Stop Camera')
                        : (language === 'ar' ? 'تشغيل الكاميرا' : 'Start Camera')
                      }
                    </Button>
                    
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      size="lg"
                      className="border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      {language === 'ar' ? 'رفع صورة' : 'Upload Image'}
                    </Button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {/* Features */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {[
                      { 
                        icon: Eye, 
                        title: language === 'ar' ? 'قراءة فورية' : 'Instant Reading',
                        desc: language === 'ar' ? 'استخراج النص من الصور فوراً' : 'Extract text from images instantly'
                      },
                      { 
                        icon: Languages, 
                        title: language === 'ar' ? 'متعدد اللغات' : 'Multi-language',
                        desc: language === 'ar' ? 'دعم العربية والإنجليزية' : 'Arabic and English support'
                      },
                      { 
                        icon: Volume2, 
                        title: language === 'ar' ? 'قراءة صوتية' : 'Audio Reading',
                        desc: language === 'ar' ? 'تحويل النص إلى كلام' : 'Text-to-speech conversion'
                      }
                    ].map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <Card key={index} className="p-4 border-green-200">
                          <div className="text-center space-y-2">
                            <Icon className="w-8 h-8 mx-auto text-green-600" />
                            <h4 className="font-medium">{feature.title}</h4>
                            <p className="text-sm text-muted-foreground">{feature.desc}</p>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Captured Image */}
                  <div className="relative">
                    <img 
                      src={capturedImage} 
                      alt="Captured" 
                      className="w-full rounded-lg max-h-64 object-contain bg-gray-100"
                    />
                    <Button
                      onClick={resetCapture}
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      <X className="w-4 h-4 mr-1" />
                      {language === 'ar' ? 'إعادة التقاط' : 'Retake'}
                    </Button>
                  </div>

                  {/* Processing Progress */}
                  {isProcessing && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-reverse space-x-2">
                        <Zap className="w-4 h-4 text-orange-500 animate-pulse" />
                        <span className="text-sm font-medium">
                          {language === 'ar' ? 'جاري معالجة الصورة...' : 'Processing image...'}
                        </span>
                      </div>
                      <Progress value={processingProgress} className="w-full" />
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="results" className="space-y-4 mt-6">
              {extractedText ? (
                <div className="space-y-4">
                  {/* Extracted Text */}
                  <Card className="border-green-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-reverse space-x-2">
                          <FileText className="w-5 h-5 text-green-600" />
                          <span>{language === 'ar' ? 'النص المستخرج' : 'Extracted Text'}</span>
                        </CardTitle>
                        <Badge className="bg-green-100 text-green-800">
                          {language === 'ar' ? 'دقة عالية' : 'High Accuracy'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                        <p className="text-lg leading-relaxed">{extractedText}</p>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        <QuickTTS 
                          text={extractedText}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          <Volume2 className="w-4 h-4 mr-2" />
                          {language === 'ar' ? 'استماع' : 'Listen'}
                        </QuickTTS>
                        
                        <Button 
                          onClick={shareText}
                          variant="outline"
                          className="border-green-200 text-green-700 hover:bg-green-50"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          {language === 'ar' ? 'مشاركة' : 'Share'}
                        </Button>
                        
                        <Button 
                          onClick={() => navigator.clipboard.writeText(extractedText)}
                          variant="outline"
                          className="border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {language === 'ar' ? 'نسخ' : 'Copy'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tips */}
                  <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">
                        {language === 'ar' ? 'نصائح للحصول على أفضل النتائج:' : 'Tips for best results:'}
                      </h4>
                      <ul className="text-sm space-y-1 text-blue-700 dark:text-blue-300">
                        <li>• {language === 'ar' ? 'تأكد من وضوح النص في الصورة' : 'Ensure text is clear in the image'}</li>
                        <li>• {language === 'ar' ? 'استخدم إضاءة جيدة' : 'Use good lighting'}</li>
                        <li>• {language === 'ar' ? 'اجعل الكاميرا مستقيمة' : 'Keep camera straight'}</li>
                        <li>• {language === 'ar' ? 'تجنب الظلال على النص' : 'Avoid shadows on text'}</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {language === 'ar' ? 'لا توجد نتائج بعد' : 'No results yet'}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === 'ar' 
                        ? 'التقط صورة أو ارفع ملف لبدء استخراج النص'
                        : 'Take a photo or upload a file to start text extraction'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>

        <canvas ref={canvasRef} className="hidden" />
      </Card>
    </div>
  );
}