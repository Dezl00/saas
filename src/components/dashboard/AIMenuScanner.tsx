"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { scanMenuWithAI } from "@/app/(dashboard)/dashboard/menu/ai-actions";

export function AIMenuScanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [successResult, setSuccessResult] = useState<string | null>(null);
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

  const handleScan = async () => {
    if (!file) return;

    setIsScanning(true);
    setSuccessResult(null);

    const formData = new FormData();
    formData.append("image", file);

    const result = await scanMenuWithAI(formData);

    if (result?.error) {
      toast.error(result.error);
      setIsScanning(false);
    } else if (result?.success) {
      setSuccessResult(result.success);
      toast.success(result.success);
      setIsScanning(false);
      // اغلاق النافذة بعد ثانيتين
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
    setSuccessResult(null);
  };

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
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-zoom-in">
            <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between bg-surface-50/50">
              <h3 className="text-xl font-bold text-surface-950 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                المساعد الذكي للمنيو
              </h3>
              <button
                onClick={handleClose}
                disabled={isScanning}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-100 text-surface-500 hover:bg-surface-200 hover:text-surface-950 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
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
              ) : (
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
                      <div className="absolute inset-0 bg-purple-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                        <Loader2 className="w-10 h-10 animate-spin mb-3 text-purple-200" />
                        <p className="font-bold animate-pulse">جاري التحليل واستخراج البيانات...</p>
                        <p className="text-xs text-purple-200 mt-1">قد يستغرق الأمر بضع ثوانٍ</p>
                      </div>
                    )}

                    {successResult && (
                      <div className="absolute inset-0 bg-success-600/90 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center animate-fade-in">
                        <CheckCircle2 className="w-16 h-16 mb-3 text-white" />
                        <p className="font-bold text-lg">{successResult}</p>
                      </div>
                    )}
                  </div>

                  {!successResult && (
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
                  )}
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
          </div>
        </div>
      )}
    </>
  );
}
