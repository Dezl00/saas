"use client";

import { useActionState, useState } from "react";
import { forgotPasswordAction, resetPasswordAction } from "../actions";
import Link from "next/link";
import { ArrowRight, Loader2, Mail, Lock, CheckCircle2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  // Phase 1: Send OTP
  const [forgotState, forgotAction, isForgotPending] = useActionState(forgotPasswordAction, null);
  
  // Phase 2: Verify OTP and Reset Password
  const [resetState, resetAction, isResetPending] = useActionState(resetPasswordAction, null);

  const [phase, setPhase] = useState<"EMAIL" | "OTP" | "SUCCESS">("EMAIL");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Switch to OTP phase if email was sent successfully
  if (forgotState?.success && phase === "EMAIL") {
    setEmail(forgotState.email);
    setPhase("OTP");
  }

  // Switch to SUCCESS phase if password was reset successfully
  if (resetState?.success && phase === "OTP") {
    setPhase("SUCCESS");
  }

  return (
    <div className="animate-fade-in">
      {phase === "EMAIL" && (
        <>
          <div className="mb-8 text-center">
            <div className="mx-auto w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4 text-primary-600">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-surface-950">استعادة كلمة المرور</h2>
            <p className="mt-2 text-sm text-surface-800/60">
              أدخل بريدك الإلكتروني وسنرسل لك كود للتحقق وإعادة التعيين.
            </p>
          </div>

          <form action={forgotAction} className="space-y-6">
            {forgotState?.error && (
              <div className="p-3 text-sm font-medium text-error-500 bg-error-500/10 rounded-xl border border-error-500/20 text-center animate-slide-up">
                {forgotState.error}
              </div>
            )}

            <div className="space-y-4">
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
                    required
                    className="block w-full ps-10 pe-3 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 placeholder-surface-800/40 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                    placeholder="اسم@example.com"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isForgotPending}
              className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isForgotPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "إرسال كود التحقق"
              )}
            </button>
          </form>
        </>
      )}

      {phase === "OTP" && (
        <>
          <div className="mb-8 text-center animate-slide-up">
            <h2 className="text-2xl font-bold text-surface-950">تعيين كلمة مرور جديدة</h2>
            <p className="mt-2 text-sm text-surface-800/60">
              أدخل الكود الذي أرسلناه إلى <span className="font-bold text-surface-900" dir="ltr">{email}</span>
            </p>
          </div>

          <form action={resetAction} className="space-y-6 animate-slide-up">
            <input type="hidden" name="email" value={email} />
            
            {resetState?.error && (
              <div className="p-3 text-sm font-medium text-error-500 bg-error-500/10 rounded-xl border border-error-500/20 text-center animate-slide-up">
                {resetState.error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-surface-950 mb-1">
                  كود التحقق (4 أرقام)
                </label>
                <input
                  name="otpCode"
                  type="text"
                  maxLength={4}
                  required
                  placeholder="••••"
                  className="block w-full text-center tracking-[1em] py-3 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 font-mono text-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-950 mb-1">
                  كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-surface-800/40">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
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
              disabled={isResetPending}
              className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isResetPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "حفظ وتسجيل الدخول"
              )}
            </button>
          </form>
        </>
      )}

      {phase === "SUCCESS" && (
        <div className="text-center py-8 animate-slide-up">
          <div className="mx-auto w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mb-6 text-success-500">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-surface-950 mb-2">تم التغيير بنجاح!</h2>
          <p className="text-surface-600 text-sm mb-8">
            تم إعادة تعيين كلمة المرور الخاصة بك بنجاح. يمكنك الآن تسجيل الدخول باستخدام الكلمة الجديدة.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-colors"
          >
            العودة لتسجيل الدخول
          </button>
        </div>
      )}

      {phase === "EMAIL" && (
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-bold text-surface-600 hover:text-surface-950 transition-colors"
          >
            <ArrowRight className="me-2 w-4 h-4 rtl:-scale-x-100" />
            العودة لتسجيل الدخول
          </Link>
        </div>
      )}
    </div>
  );
}
