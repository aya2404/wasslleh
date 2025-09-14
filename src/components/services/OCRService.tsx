import React, { useState, useRef } from 'react';
import { Camera, Scan, FileText, Upload, X, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';

interface OCRServiceProps {
  onTextExtracted: (text: string, confidence: number) => void;
  onError?: (error: string) => void;
  language?: string;
  className?: string;
}

interface OCRResult {
  text: string;
  confidence: number;
  blocks: OCRBlock[];
  processingTime: number;
}

interface OCRBlock {
  text: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export function OCRService({
  onTextExtracted,
  onError,
  language = 'ara',
  className = ""
}: OCRServiceProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<OCRResult | null>(null);
  const [error, setError] = useState<string>('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // نتائج OCR وهمية للعرض التوضيحي
  const mockOCRResults = [
    {
      text: "مطعم الأصالة\nوجبات شهية بأسعار مناسبة\nساعات العمل: 9ص - 11م\nالعنوان: شارع الملك فهد، الرياض\nهاتف: 011-234-5678",
      confidence: 95,
      blocks: [
        { text: "مطعم الأصالة", confidence: 98, boundingBox: { x: 10, y: 10, width: 200, height: 40 } },
        { text: "وجبات شهية بأسعار مناسبة", confidence: 94, boundingBox: { x: 10, y: 60, width: 300, height: 30 } },
        { text: "ساعات العمل: 9ص - 11م", confidence: 92, boundingBox: { x: 10, y: 100, width: 250, height: 25 } }
      ],
      processingTime: 2.3
    },
    {
      text: "وظائف شاغرة\nشركة التكنولوجيا المتقدمة\nمطلوب مهندسين برمجيات\nالخبرة: 2-5 سنوات\nالراتب: 8000-12000 ريال\nللتقديم: jobs@techcompany.com",
      confidence: 89,
      blocks: [
        { text: "وظائف شاغرة", confidence: 96, boundingBox: { x: 15, y: 15, width: 180, height: 35 } },
        { text: "شركة التكنولوجيا المتقدمة", confidence: 91, boundingBox: { x: 15, y: 60, width: 280, height: 30 } },
        { text: "مطلوب مهندسين برمجيات", confidence: 88, boundingBox: { x: 15, y: 100, width: 260, height: 25 } }
      ],
      processingTime: 1.8
    },
    {
      text: "بنك الأهلي\nخدمات مصرفية شاملة\nفرع شارع الملك عبدالعزيز\nمواعيد العمل: 8ص - 2ظ\nخدمة العملاء: 8001234567",
      confidence: 93,
      blocks: [
        { text: "بنك الأهلي", confidence: 97, boundingBox: { x: 20, y: 20, width: 160, height: 40 } },
        { text: "خدمات مصرفية شاملة", confidence: 95, boundingBox: { x: 20, y: 70, width: 240, height: 30 } },
        { text: "فرع شارع الملك عبدالعزيز", confidence: 90, boundingBox: { x: 20, y: 110, width: 280, height: 25 } }
      ],
      processingTime: 2.1
    }
  ];

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
        await videoRef.current.play();
      }
      
      streamRef.current = stream;
      setCameraActive(true);
      setError('');
    } catch (err) {
      const errorMessage = 'لا يمكن الوصول إلى الكاميرا. تأكد من منح الإذن للتطبيق.';
      setError(errorMessage);
      if (onError) onError(errorMessage);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData);
      processImage(imageData);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      const errorMessage = 'يرجى اختيار ملف صورة صالح';
      setError(errorMessage);
      if (onError) onError(errorMessage);
      return;
    }

    // التحقق من حجم الملف (5MB كحد أقصى)
    if (file.size > 5 * 1024 * 1024) {
      const errorMessage = 'حجم الملف كبير جداً. الحد الأقصى 5MB';
      setError(errorMessage);
      if (onError) onError(errorMessage);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setCapturedImage(imageData);
      processImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    setProgress(0);
    setError('');
    setResult(null);

    try {
      // محاكاة معالجة OCR مع شريط التقدم
      const steps = [
        { message: 'تحليل الصورة...', progress: 20 },
        { message: 'استخراج النصوص...', progress: 50 },
        { message: 'تحسين النتائج...', progress: 80 },
        { message: 'اكتمل!', progress: 100 }
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(step.progress);
      }

      // اختيار نتيجة عشوائية من النتائج الوهمية
      const randomResult = mockOCRResults[Math.floor(Math.random() * mockOCRResults.length)];
      
      setResult(randomResult);
      onTextExtracted(randomResult.text, randomResult.confidence);

    } catch (err) {
      const errorMessage = 'فشل في استخراج النص من الصورة';
      setError(errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const resetOCR = () => {
    setResult(null);
    setCapturedImage(null);
    setError('');
    setProgress(0);
    stopCamera();
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) return 'ممتاز';
    if (confidence >= 70) return 'جيد';
    return 'منخفض';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-reverse space-x-2">
            <Scan className="w-5 h-5" />
            <span>استخراج النصوص من الصور</span>
          </div>
          {(result || capturedImage) && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetOCR}
              aria-label="إعادة تعيين"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="camera" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="camera" className="flex items-center space-x-reverse space-x-1">
              <Camera className="w-4 h-4" />
              <span>كاميرا</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center space-x-reverse space-x-1">
              <Upload className="w-4 h-4" />
              <span>رفع ملف</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="camera" className="space-y-4">
            {!cameraActive ? (
              <div className="text-center space-y-4">
                <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">اضغط لتشغيل الكاميرا</p>
                  </div>
                </div>
                <Button onClick={startCamera} className="w-full">
                  <Camera className="w-4 h-4 ml-2" />
                  تشغيل الكاميرا
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-64 object-cover"
                    playsInline
                    muted
                    aria-label="معاينة الكاميرا"
                  />
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-reverse space-x-4">
                    <Button
                      onClick={captureImage}
                      disabled={isProcessing}
                      size="lg"
                      className="bg-white text-black hover:bg-gray-100"
                    >
                      <Scan className="w-5 h-5 ml-2" />
                      التقط وحلل
                    </Button>
                    <Button
                      onClick={stopCamera}
                      variant="outline"
                      size="lg"
                      className="bg-white/90 text-black hover:bg-white"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="text-center space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div
                className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center">
                  <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">انقر لاختيار صورة</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    يدعم: JPG, PNG, GIF (حد أقصى 5MB)
                  </p>
                </div>
              </div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full"
              >
                <Upload className="w-4 h-4 ml-2" />
                اختيار ملف
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* عرض الصورة المُلتقطة */}
        {capturedImage && (
          <div className="space-y-3">
            <h4 className="font-medium">الصورة المُلتقطة:</h4>
            <div className="border rounded-lg overflow-hidden">
              <img 
                src={capturedImage} 
                alt="الصورة المُلتقطة للتحليل" 
                className="w-full h-40 object-cover"
              />
            </div>
          </div>
        )}

        {/* شريط التقدم */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>جاري استخراج النص...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* النتائج */}
        {result && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">النص المُستخرج:</h4>
              <div className="flex items-center space-x-reverse space-x-2">
                <Badge 
                  variant="outline"
                  className={getConfidenceColor(result.confidence)}
                >
                  دقة: {result.confidence}% ({getConfidenceBadge(result.confidence)})
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {result.processingTime}s
                </Badge>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {result.text}
              </pre>
            </div>

            {/* تفاصيل الكتل النصية */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium">تفاصيل النصوص المكتشفة:</h5>
              <div className="space-y-2">
                {result.blocks.map((block, index) => (
                  <div 
                    key={index}
                    className="text-xs p-2 bg-blue-50 dark:bg-blue-900/20 rounded border-r-2 border-blue-500"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-medium">{block.text}</span>
                      <Badge variant="outline" className={`text-xs ${getConfidenceColor(block.confidence)}`}>
                        {block.confidence}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* معلومات تقنية */}
            <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
              <p>• تم استخراج {result.blocks.length} كتلة نصية</p>
              <p>• وقت المعالجة: {result.processingTime} ثانية</p>
              <p>• اللغة المُكتشفة: العربية</p>
              <p>• جودة الصورة: عالية</p>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
}