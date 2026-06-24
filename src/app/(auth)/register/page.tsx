"use client";

import { useActionState, useState, startTransition } from "react";
import { registerAction, verifyOtpAction, loginAction } from "../actions";
import Link from "next/link";
import { ArrowRight, Loader2, Mail, Lock, User, KeyRound, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [registerState, registerFormAction, isRegisterPending] = useActionState(registerAction, null);
  
  // State to hold credentials for auto-login after OTP
  const [savedEmail, setSavedEmail] = useState("");
  const [savedPassword, setSavedPassword] = useState("");
  
  const [otpError, setOtpError] = useState("");
  const [isOtpPending, setIsOtpPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // When register succeeds, it returns requiresOtp
  const requiresOtp = registerState?.requiresOtp;

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOtpError("");
    setIsOtpPending(true);
    
    const formData = new FormData(e.currentTarget);
    const otp = formData.get("otp") as string;
    
    try {
      const result = await verifyOtpAction(savedEmail, otp);
      if (result?.error) {
        setOtpError(result.error);
        setIsOtpPending(false);
      } else if (result?.success) {
        // OTP verified successfully! Now auto-login.
        const loginData = new FormData();
        loginData.append("email", savedEmail);
        loginData.append("password", savedPassword);
        
        startTransition(() => {
          loginAction(null, loginData);
        });
      }
    } catch (error: any) {
      setOtpError("حدث خطأ غير متوقع");
      setIsOtpPending(false);
    }
  };

  if (requiresOtp) {
    return (
      <div className="animate-fade-in">
        <div className="mb-6 text-center">
          <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-surface-200">
            <KeyRound className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-surface-950">تأكيد البريد الإلكتروني</h2>
          <p className="mt-2 text-sm text-surface-800/60">
            أرسلنا كود تحقق مكون من 4 أرقام إلى<br/>
            <strong className="text-surface-950" dir="ltr">{savedEmail}</strong>
          </p>
        </div>

        <form onSubmit={handleOtpSubmit} className="space-y-4">
          {otpError && (
            <div className="p-3 text-sm font-medium text-error-500 bg-error-500/10 rounded-xl border border-error-500/20 text-center animate-slide-up">
              {otpError}
            </div>
          )}

          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-surface-950 mb-1 text-center">
              أدخل كود التحقق
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              required
              maxLength={4}
              className="block w-full px-3 py-3 text-center text-2xl tracking-[1em] bg-surface-50 border border-surface-200 rounded-xl text-surface-950 placeholder-surface-800/40 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
              placeholder="----"
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={isOtpPending}
            className="w-full flex justify-center items-center py-3.5 px-4 mt-6 rounded-xl text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isOtpPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>تأكيد الدخول</>
            )}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-surface-950">أنشئ متجرك الآن</h2>
        <p className="mt-2 text-sm text-surface-800/60">
          ابدأ مجاناً في أقل من دقيقة
        </p>
      </div>

      <form action={registerFormAction} className="space-y-4" onSubmit={(e) => {
        // Save credentials to state before form submission for auto-login later
        const formData = new FormData(e.currentTarget);
        setSavedEmail(formData.get("email") as string);
        setSavedPassword(formData.get("password") as string);
      }}>
        {registerState?.error && (
          <div className="p-3 text-sm font-medium text-error-500 bg-error-500/10 rounded-xl border border-error-500/20 text-center animate-slide-up">
            {registerState.error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-surface-950 mb-1">
              الاسم بالكامل
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-surface-800/40">
                <User className="h-5 w-5" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="block w-full ps-10 pe-3 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 placeholder-surface-800/40 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                placeholder="أحمد محمد"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-surface-950 mb-1">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-surface-800/40">
                <Mail className="h-5 w-5" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full ps-10 pe-3 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 placeholder-surface-800/40 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                placeholder="اسم@example.com"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-surface-950 mb-1">
              رقم الهاتف
            </label>
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="text"
                required
                className="block w-full px-3 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 placeholder-surface-800/40 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                placeholder="01xxxxxxxxx"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-surface-950 mb-1">
              كلمة المرور
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-surface-800/40">
                <Lock className="h-5 w-5" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="block w-full ps-10 pe-10 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 placeholder-surface-800/40 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                placeholder="••••••••"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 end-0 pe-3 flex items-center text-surface-800/40 hover:text-surface-950 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isRegisterPending}
          className="w-full flex justify-center items-center py-3.5 px-4 mt-6 rounded-xl text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isRegisterPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              إنشاء الحساب
              <ArrowRight className="ms-2 w-4 h-4 rtl:-scale-x-100" />
            </>
          )}
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm text-surface-800/60">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="font-bold text-surface-950 hover:text-surface-800 transition-colors underline decoration-surface-200 underline-offset-4">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
