"use client";

import { useActionState, useState } from "react";
import { loginAction } from "../actions";
import Link from "next/link";
import { ArrowRight, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-surface-950">تسجيل الدخول</h2>
        <p className="mt-2 text-sm text-surface-800/60">
          مرحباً بك مجدداً في لوحة التحكم
        </p>
      </div>

      <form action={formAction} className="space-y-6">
        {state?.error && (
          <div className="p-3 text-sm font-medium text-error-500 bg-error-500/10 rounded-xl border border-error-500/20 text-center animate-slide-up">
            {state.error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-surface-950 mb-1"
            >
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
                className="block w-full ps-10 pe-3 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 placeholder-surface-800/40 focus:ring-2 focus:ring-surface-900/20 focus:border-surface-900 transition-colors"
                placeholder="اسم@example.com"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-surface-950"
              >
                كلمة المرور
              </label>
              <Link
                href="#"
                className="text-xs font-medium text-surface-600 hover:text-surface-900 transition-colors"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-surface-800/40">
                <Lock className="h-5 w-5" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="block w-full ps-10 pe-10 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 placeholder-surface-800/40 focus:ring-2 focus:ring-surface-900/20 focus:border-surface-900 transition-colors"
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
          disabled={isPending}
          className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-surface-950 hover:bg-surface-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              تسجيل الدخول
              <ArrowRight className="ms-2 w-4 h-4 rtl:-scale-x-100" />
            </>
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-surface-800/60">
            ليس لديك حساب؟{" "}
            <Link
              href="/register"
              className="font-bold text-surface-950 hover:text-surface-800 transition-colors underline decoration-surface-200 underline-offset-4"
            >
              أنشئ متجرك مجاناً
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
