"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-surface-950">استعادة كلمة المرور</h2>
        <p className="mt-2 text-sm text-surface-800/60">
          أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور
        </p>
      </div>

      <form className="space-y-6">
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
          type="button"
          onClick={() => alert("سيتم تفعيل هذه الميزة قريباً!")}
          className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition-colors"
        >
          إرسال رابط الاستعادة
        </button>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-bold text-surface-600 hover:text-surface-950 transition-colors"
          >
            <ArrowRight className="me-2 w-4 h-4 rtl:-scale-x-100" />
            العودة لتسجيل الدخول
          </Link>
        </div>
      </form>
    </div>
  );
}
