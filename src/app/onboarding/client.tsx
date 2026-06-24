"use client";

import { useState } from "react";
import { submitStep1, submitStep2, skipStep, finishOnboarding } from "./actions";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import { Loader2, ArrowLeft, CheckCircle2, Store, Phone, PartyPopper, Link as LinkIcon, ExternalLink } from "lucide-react";

export function OnboardingClient({ step, storeName, subdomain }: { step: number; storeName: string; subdomain: string }) {
  const [isPending, setIsPending] = useState(false);

  const steps = [
    { id: 1, title: "هوية المتجر", icon: Store },
    { id: 2, title: "بيانات التواصل", icon: Phone },
    { id: 3, title: "اكتمل", icon: CheckCircle2 }
  ];

  return (
    <div>
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-surface-100 -z-10 rounded-full" />
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = s.id === step;
            const isCompleted = s.id < step;
            return (
              <div key={s.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  isActive ? "bg-surface-950 text-white" :
                  isCompleted ? "bg-success-500 text-white" :
                  "bg-surface-100 text-surface-400"
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-xs mt-2 font-medium ${isActive ? "text-surface-950" : "text-surface-500"}`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: Store Identity */}
      {step === 1 && (
        <form action={(data) => { setIsPending(true); submitStep1(data).finally(() => setIsPending(false)); }} className="space-y-5 animate-slide-up">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-surface-950">مرحباً بك! لنبدأ بتهيئة متجرك</h2>
            <p className="text-surface-600 text-sm mt-2">اختر اسماً مميزاً وشعاراً يمثل هويتك التجارية.</p>
          </div>

          <div>
            <ImageUpload name="logo" label="شعار المتجر (اختياري)" />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-950 mb-1">اسم المتجر</label>
            <input type="text" name="name" defaultValue={storeName} required className="block w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-surface-900/20 focus:border-surface-900" />
            <p className="text-xs text-surface-500 mt-1">سيتم استخدام هذا الاسم لتوليد رابط متجرك تلقائياً.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-950 mb-1">اللون الأساسي (اختياري)</label>
            <div className="flex items-center gap-3">
              <input type="color" name="primaryColor" defaultValue="#f97316" className="w-12 h-12 rounded-lg cursor-pointer" />
              <span className="text-sm text-surface-600">اختر لوناً يعبر عن هويتك البصرية</span>
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            <button type="submit" disabled={isPending} className="flex-1 bg-surface-950 hover:bg-surface-900 text-white py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center">
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "التالي"}
            </button>
            <button type="button" onClick={() => skipStep(1)} className="px-6 bg-surface-100 hover:bg-surface-200 text-surface-700 py-3 rounded-xl font-bold transition-colors">
              تخطي
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Contact Info */}
      {step === 2 && (
        <form action={(data) => { setIsPending(true); submitStep2(data).finally(() => setIsPending(false)); }} className="space-y-5 animate-slide-up">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-surface-950">بيانات التواصل</h2>
            <p className="text-surface-600 text-sm mt-2">أضف أرقام التواصل ليتمكن عملائك من الوصول إليك بسهولة.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-950 mb-1">رقم الهاتف العام</label>
            <input type="text" name="phone" placeholder="مثال: 01xxxxxxxxx" className="block w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-surface-900/20 focus:border-surface-900" dir="ltr" />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-950 mb-1">رقم الواتساب (لاستقبال الطلبات)</label>
            <input type="text" name="whatsappNumber" placeholder="مع كود الدولة مثل +20" className="block w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-surface-900/20 focus:border-surface-900" dir="ltr" />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-950 mb-1">العنوان الرئيسي</label>
            <input type="text" name="address" placeholder="مثال: شارع النيل، القاهرة" className="block w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-surface-900/20 focus:border-surface-900" />
          </div>

          <div className="pt-6 flex gap-3">
            <button type="submit" disabled={isPending} className="flex-1 bg-surface-950 hover:bg-surface-900 text-white py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center">
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "التالي"}
            </button>
            <button type="button" onClick={() => skipStep(2)} className="px-6 bg-surface-100 hover:bg-surface-200 text-surface-700 py-3 rounded-xl font-bold transition-colors">
              تخطي
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <div className="text-center space-y-6 animate-slide-up py-4">
          <div className="w-24 h-24 bg-success-50 text-success-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <PartyPopper className="w-12 h-12" />
          </div>
          
          <h2 className="text-3xl font-bold text-surface-950">مبروك متجرك جاهز! 🎉</h2>
          <p className="text-surface-600">
            لقد تم إعداد متجرك بنجاح. يمكنك الآن مشاركة الرابط مع عملائك للبدء في استقبال الطلبات.
          </p>

          <div className="bg-surface-50 border border-surface-200 rounded-xl p-4 flex flex-col gap-2 mt-6">
            <span className="text-xs font-bold text-surface-500 uppercase tracking-widest text-start">رابط متجرك</span>
            <div className="flex items-center gap-3 text-surface-900 overflow-hidden">
              <LinkIcon className="w-5 h-5 flex-shrink-0 text-surface-400" />
              <span className="font-mono text-base sm:text-lg truncate" dir="ltr">
                {subdomain ? `${subdomain}.menura.com` : "your-store.menura.com"}
              </span>
            </div>
          </div>

          <div className="pt-8 flex flex-col gap-3">
            <a 
              href={`/store/${subdomain}`} 
              target="_blank" 
              className="w-full bg-surface-950 hover:bg-surface-900 text-white py-4 rounded-xl font-bold transition-colors flex items-center justify-center text-lg gap-2"
            >
              زيارة المتجر
              <ExternalLink className="w-5 h-5" />
            </a>
            <button 
              onClick={() => finishOnboarding()} 
              className="w-full bg-surface-100 hover:bg-surface-200 text-surface-900 py-3 rounded-xl font-bold transition-colors flex items-center justify-center text-sm gap-2"
            >
              الإنتقال للوحة التحكم
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
