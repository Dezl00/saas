"use client";

import { useActionState } from "react";
import { registerAction } from "../actions";
import Link from "next/link";
import { ArrowRight, Loader2, Mail, Lock, User, Store } from "lucide-react";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <div className="animate-fade-in">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-surface-950">أنشئ متجرك الآن</h2>
        <p className="mt-2 text-sm text-surface-800/60">
          ابدأ مجاناً في أقل من دقيقة
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="p-3 text-sm font-medium text-error-500 bg-error-500/10 rounded-xl border border-error-500/20 text-center animate-slide-up">
            {state.error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-surface-950 mb-1"
            >
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
            <label
              htmlFor="password"
              className="block text-sm font-medium text-surface-950 mb-1"
            >
              كلمة المرور
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-surface-800/40">
                <Lock className="h-5 w-5" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full ps-10 pe-3 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 placeholder-surface-800/40 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-surface-200">
            <h3 className="text-sm font-bold text-surface-950 mb-3">
              بيانات المتجر
            </h3>
            
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="storeName"
                  className="block text-sm font-medium text-surface-950 mb-1"
                >
                  اسم المتجر
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-surface-800/40">
                    <Store className="h-5 w-5" />
                  </div>
                  <input
                    id="storeName"
                    name="storeName"
                    type="text"
                    required
                    className="block w-full ps-10 pe-3 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 placeholder-surface-800/40 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                    placeholder="اسم مطعمك أو محلك"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="storeType"
                  className="block text-sm font-medium text-surface-950 mb-1"
                >
                  نوع النشاط
                </label>
                <select
                  id="storeType"
                  name="storeType"
                  required
                  className="block w-full px-3 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                >
                  <option value="RESTAURANT">مطعم / كافيه</option>
                  <option value="MARKET">سوبر ماركت</option>
                  <option value="PHARMACY">صيدلية</option>
                  <option value="OTHER">أخرى</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center items-center py-3 px-4 mt-6 border border-transparent rounded-xl shadow-lg shadow-primary-500/25 text-sm font-bold text-white bg-gradient-to-l from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all btn-shine disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? (
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
            <Link
              href="/login"
              className="font-bold text-primary-600 hover:text-primary-500 transition-colors"
            >
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
