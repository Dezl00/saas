"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";
import Link from "next/link";
import { ArrowRight, Loader2, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

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
                className="block w-full ps-10 pe-3 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 placeholder-surface-800/40 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
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
                className="text-xs font-medium text-primary-600 hover:text-primary-500 transition-colors"
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
                type="password"
                autoComplete="current-password"
                required
                className="block w-full ps-10 pe-3 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 placeholder-surface-800/40 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-primary-500/25 text-sm font-bold text-white bg-gradient-to-l from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all btn-shine disabled:opacity-70 disabled:cursor-not-allowed"
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
              className="font-bold text-primary-600 hover:text-primary-500 transition-colors"
            >
              أنشئ متجرك مجاناً
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
