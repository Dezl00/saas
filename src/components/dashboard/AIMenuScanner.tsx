"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X, Loader2, Sparkles, CheckCircle2, ListChecks, CheckSquare, Square } from "lucide-react";
import toast from "react-hot-toast";
import { importAIMenuItems } from "@/app/(dashboard)/dashboard/menu/ai-actions";

type ParsedCategory = {
  name: string;
  items: ParsedItem[];
};

type ParsedItem = {
  name: string;
  description: string;
  price: number;
  sizes?: { name: string; price: number }[];
  selected?: boolean; // added for UI
};

export function AIMenuScanner({ storeId }: { storeId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [successResult, setSuccessResult] = useState<string | null>(null);
  
  // Review state
  const [parsedData, setParsedData] = useState<{ categories: ParsedCategory[] } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          
          const MAX_DIM = 1000;
          if (width > height && width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            } else {
              resolve(file);
            }
          }, "image/jpeg", 0.6);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("يرجى اختيار صورة صحيحة");
        return;
      }
      
      setIsScanning(true); // Show loader while compressing
      const compressedFile = await compressImage(selectedFile);
      setFile(compressedFile);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setIsScanning(false);
      };
      reader.readAsDataURL(compressedFile);
    }
  };

  // Progress text effect
  const [progressStep, setProgressStep] = useState(0);
  
  const handleScan = async () => {
    if (!file) return;

    setIsScanning(true);
    setProgressStep(1); // 1: Uploading/Compressing
    setSuccessResult(null);

    // Simulate progress steps
    const stepInterval = setInterval(() => {
      setProgressStep((prev) => {
        if (prev < 4) return prev + 1;
        return prev;
      });
    }, 2500);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/menu/ai-scan", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      clearInterval(stepInterval);

      if (!response.ok || result?.error) {
        toast.error(result?.error || "حدث خطأ غير متوقع");
        setIsScanning(false);
        setProgressStep(0);
      } else if (result?.success && result.data) {
      // Mark all items as selected by default
      const processedData = {
        categories: result.data.categories.map((c: any) => ({
          ...c,
          items: c.items?.map((i: any) => ({ ...i, selected: true })) || []
        }))
      };
      setParsedData(processedData);
      setIsScanning(false);
      setProgressStep(0);
    }
    } catch (error) {
      clearInterval(stepInterval);
      toast.error("حدث خطأ في الاتصال بالسيرفر. يرجى المحاولة مرة أخرى.");
      setIsScanning(false);
      setProgressStep(0);
    }
  };

  const handleToggleItem = (catIndex: number, itemIndex: number) => {
    if (!parsedData) return;
    const newData = { ...parsedData };
    newData.categories[catIndex].items[itemIndex].selected = !newData.categories[catIndex].items[itemIndex].selected;
    setParsedData(newData);
  };

  const handleImport = async () => {
    if (!parsedData) return;
    setIsImporting(true);

    // Filter only selected items
    const filteredData = {
      categories: parsedData.categories.map(c => ({
        ...c,
        items: c.items.filter(i => i.selected)
      })).filter(c => c.items.length > 0) // Remove empty categories
    };

    const result = await importAIMenuItems(filteredData, storeId);

    if (result?.error) {
      toast.error(result.error);
      setIsImporting(false);
    } else if (result?.success) {
      setSuccessResult(result.success);
      toast.success(result.success);
      setIsImporting(false);
      setTimeout(() => {
        handleClose();
      }, 3000);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setImage(null);
    setFile(null);
    setIsScanning(false);
    setIsImporting(false);
    setSuccessResult(null);
    setParsedData(null);
    setProgressStep(0);
  };

  // Calculate totals
  const totalCategories = parsedData?.categories.length || 0;
  const totalItems = parsedData?.categories.reduce((acc, cat) => acc + cat.items.length, 0) || 0;
  const selectedItemsCount = parsedData?.categories.reduce((acc, cat) => acc + cat.items.filter(i => i.selected).length, 0) || 0;

  const progressMessages = [
    "",
    "جاري الاتصال بالذكاء الاصطناعي...",
    "جاري قراءة المنيو واستخراج البيانات...",
    "جاري تنسيق الأصناف والأسعار...",
    "على وشك الانتهاء..."
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all"
      >
        <Sparkles className="w-5 h-5" />
        مسح منيو بالذكاء الاصطناعي
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden animate-zoom-in">
            <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between bg-surface-50/50 shrink-0">
              <h3 className="text-xl font-bold text-surface-950 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                المساعد الذكي للمنيو
              </h3>
              <button
                onClick={handleClose}
                disabled={isScanning || isImporting}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-100 text-surface-500 hover:bg-surface-200 hover:text-surface-950 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {!image ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-purple-200 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors group"
                >
                  <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Camera className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-purple-900">اضغط لالتقاط أو رفع صورة المنيو</p>
                    <p className="text-xs text-purple-600/70 mt-1">يُفضل أن تكون الصورة واضحة وبإضاءة جيدة</p>
                  </div>
                </div>
              ) : !parsedData ? (
                <div className="space-y-4">
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-surface-200 shadow-inner">
                    <img src={image} alt="Menu preview" className="w-full h-full object-cover" />
                    {!isScanning && !successResult && (
                      <button 
                        onClick={() => { setImage(null); setFile(null); }}
                        className="absolute top-2 end-2 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    
                    {isScanning && (
                      <div className="absolute inset-0 bg-purple-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full border-4 border-purple-300/30 border-t-purple-400 animate-spin mb-4" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-purple-200 animate-pulse mb-4" />
                          </div>
                        </div>
                        <p className="font-bold text-lg animate-pulse">{progressMessages[progressStep] || progressMessages[progressMessages.length - 1]}</p>
                        
                        <div className="w-full max-w-xs bg-purple-900/50 rounded-full h-1.5 mt-4 overflow-hidden">
                          <div 
                            className="bg-purple-400 h-1.5 rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${Math.min((progressStep / 4) * 100, 95)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleScan}
                    disabled={isScanning}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>الذكاء الاصطناعي يعمل...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>استخراج الأصناف والأسعار الآن</span>
                      </>
                    )}
                  </button>
                </div>
              ) : successResult ? (
                <div className="flex flex-col items-center justify-center text-success-600 py-10 animate-fade-in">
                  <CheckCircle2 className="w-16 h-16 mb-4" />
                  <p className="font-bold text-xl text-surface-950">{successResult}</p>
                </div>
              ) : (
                <div className="space-y-6 animate-slide-up">
                  <div className="flex items-center justify-between bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-3">
                      <ListChecks className="w-6 h-6 text-purple-600" />
                      <div>
                        <p className="font-bold text-purple-900">مراجعة الأصناف المستخرجة</p>
                        <p className="text-xs text-purple-600 mt-0.5">الرجاء تحديد الأصناف التي تريد إضافتها</p>
                      </div>
                    </div>
                    <div className="text-end">
                      <p className="text-sm font-bold text-purple-900">{totalCategories} أقسام</p>
                      <p className="text-xs text-purple-700">{selectedItemsCount} من {totalItems} أصناف محددة</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {parsedData.categories.map((category, catIndex) => (
                      <div key={catIndex} className="bg-surface-50 border border-surface-200 rounded-2xl overflow-hidden">
                        <div className="px-4 py-3 bg-surface-100 border-b border-surface-200 font-bold text-surface-950">
                          {category.name}
                        </div>
                        <div className="divide-y divide-surface-100">
                          {category.items.map((item, itemIndex) => (
                            <div 
                              key={itemIndex} 
                              onClick={() => handleToggleItem(catIndex, itemIndex)}
                              className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-purple-50/50 transition-colors ${!item.selected ? 'opacity-50 bg-surface-50 grayscale' : ''}`}
                            >
                              <button type="button" className="mt-0.5 shrink-0 text-purple-600">
                                {item.selected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-surface-400" />}
                              </button>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <p className="font-bold text-surface-950 text-sm">{item.name}</p>
                                  <span className="font-bold text-purple-700 text-sm">{item.price}</span>
                                </div>
                                {item.description && (
                                  <p className="text-xs text-surface-500 mt-1">{item.description}</p>
                                )}
                                {item.sizes && item.sizes.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {item.sizes.map((size, sizeIndex) => (
                                      <div key={sizeIndex} className="bg-purple-50 border border-purple-100 rounded-lg px-2 py-1 flex items-center gap-2 text-xs">
                                        <span className="text-purple-700 font-medium">{size.name}</span>
                                        <span className="text-purple-900 font-bold">{size.price}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                capture="environment"
                className="hidden"
              />
            </div>
            
            {/* Footer actions for review step */}
            {parsedData && !successResult && (
              <div className="p-4 border-t border-surface-200 bg-surface-50 flex gap-3 shrink-0">
                <button
                  onClick={() => setParsedData(null)}
                  disabled={isImporting}
                  className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-surface-700 bg-white border border-surface-200 hover:bg-surface-50 transition-colors disabled:opacity-50"
                >
                  إلغاء وإعادة المحاولة
                </button>
                <button
                  onClick={handleImport}
                  disabled={isImporting || selectedItemsCount === 0}
                  className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isImporting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    `تأكيد وإضافة (${selectedItemsCount})`
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
