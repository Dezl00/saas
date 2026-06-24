"use client";

import { useActionState } from "react";
import { createStoreFromAdminAction } from "./actions";
import Link from "next/link";
import { ArrowRight, Loader2, Store, Palette, MapPin, Phone, MessageCircle, Link as LinkIcon, Mail, Lock, Image as ImageIcon } from "lucide-react";

export default function NewStorePage() {
  const [state, formAction, isPending] = useActionState(createStoreFromAdminAction, null);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/stores"
          className="p-2 bg-white border border-surface-200 rounded-xl hover:bg-surface-50 transition-colors"
        >
          <ArrowRight className="w-5 h-5 rtl:-scale-x-100 text-surface-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-surface-950">إضافة متجر جديد</h1>
          <p className="text-surface-800/60 mt-1">أدخل بيانات المتجر وصاحب المتجر للإنشاء الفوري</p>
        </div>
      </div>

      <form action={formAction} className="space-y-8">
        {state?.error && (
          <div className="p-4 bg-error-50 text-error-600 font-bold rounded-xl border border-error-200 animate-slide-up">
            {state.error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Store Information Card */}
          <div className="bg-white rounded-2xl p-6 border border-surface-200 space-y-6">
            <h2 className="text-xl font-bold text-surface-950 mb-4 flex items-center gap-2">
              <Store className="w-5 h-5 text-primary-500" />
              بيانات المتجر
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-surface-950 mb-1">اسم المتجر</label>
                <div className="relative">
                  <Store className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                  <input
                    name="name"
                    type="text"
                    required
                    defaultValue={state?.data?.name as string || ""}
                    className={`w-full ps-10 pe-4 py-2.5 bg-surface-50 border rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${state?.fieldErrors?.name ? "border-error-500" : "border-surface-200"}`}
                    placeholder="مثال: مطعم البيك"
                  />
                </div>
                {state?.fieldErrors?.name && <p className="text-sm text-error-500 mt-1">{state.fieldErrors.name[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-surface-950 mb-1">رابط الشعار (Logo URL)</label>
                <div className="relative">
                  <ImageIcon className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                  <input
                    name="logo"
                    type="url"
                    defaultValue={state?.data?.logo as string || ""}
                    className={`w-full ps-10 pe-4 py-2.5 bg-surface-50 border rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${state?.fieldErrors?.logo ? "border-error-500" : "border-surface-200"}`}
                    placeholder="https://example.com/logo.png"
                    dir="ltr"
                  />
                </div>
                {state?.fieldErrors?.logo && <p className="text-sm text-error-500 mt-1">{state.fieldErrors.logo[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-surface-950 mb-1">اللون الأساسي</label>
                <div className="relative flex items-center gap-2">
                  <Palette className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                  <input
                    name="primaryColor"
                    type="text"
                    defaultValue={state?.data?.primaryColor as string || "#F97316"}
                    className="w-full ps-10 pe-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="#F97316"
                    dir="ltr"
                  />
                  <input
                    type="color"
                    defaultValue={state?.data?.primaryColor as string || "#F97316"}
                    className="w-12 h-11 p-1 bg-surface-50 border border-surface-200 rounded-xl cursor-pointer"
                    onChange={(e) => {
                      const textInput = e.target.previousElementSibling as HTMLInputElement;
                      if (textInput) textInput.value = e.target.value;
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-surface-950 mb-1">رابط المتجر (Subdomain)</label>
                <div className="relative flex items-center">
                  <LinkIcon className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 z-10" />
                  <input
                    name="subdomain"
                    type="text"
                    required
                    defaultValue={state?.data?.subdomain as string || ""}
                    className={`w-full ps-10 pe-24 py-2.5 bg-surface-50 border rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${state?.fieldErrors?.subdomain ? "border-error-500" : "border-surface-200"}`}
                    placeholder="my-store"
                    dir="ltr"
                  />
                  <span className="absolute end-4 text-surface-500 text-sm font-medium" dir="ltr">
                    .menura.site
                  </span>
                </div>
                {state?.fieldErrors?.subdomain && <p className="text-sm text-error-500 mt-1">{state.fieldErrors.subdomain[0]}</p>}
              </div>
            </div>
          </div>

          {/* Contact & Owner Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-surface-200 space-y-6">
              <h2 className="text-xl font-bold text-surface-950 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-accent-500" />
                معلومات التواصل
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-surface-950 mb-1">العنوان</label>
                  <div className="relative">
                    <MapPin className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                    <input
                      name="address"
                      type="text"
                      defaultValue={state?.data?.address as string || ""}
                      className={`w-full ps-10 pe-4 py-2.5 bg-surface-50 border rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${state?.fieldErrors?.address ? "border-error-500" : "border-surface-200"}`}
                      placeholder="عنوان المتجر"
                    />
                  </div>
                  {state?.fieldErrors?.address && <p className="text-sm text-error-500 mt-1">{state.fieldErrors.address[0]}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-surface-950 mb-1">رقم الهاتف</label>
                    <div className="relative">
                      <Phone className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                      <input
                        name="phone"
                        type="tel"
                        defaultValue={state?.data?.phone as string || ""}
                        className={`w-full ps-9 pe-3 py-2.5 bg-surface-50 border rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm ${state?.fieldErrors?.phone ? "border-error-500" : "border-surface-200"}`}
                        placeholder="01xxxxxxxxx"
                        dir="ltr"
                      />
                    </div>
                    {state?.fieldErrors?.phone && <p className="text-sm text-error-500 mt-1">{state.fieldErrors.phone[0]}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-surface-950 mb-1">رقم الواتساب</label>
                    <div className="relative">
                      <MessageCircle className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                      <input
                        name="whatsappNumber"
                        type="tel"
                        defaultValue={state?.data?.whatsappNumber as string || ""}
                        className={`w-full ps-9 pe-3 py-2.5 bg-surface-50 border rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm ${state?.fieldErrors?.whatsappNumber ? "border-error-500" : "border-surface-200"}`}
                        placeholder="01xxxxxxxxx"
                        dir="ltr"
                      />
                    </div>
                    {state?.fieldErrors?.whatsappNumber && <p className="text-sm text-error-500 mt-1">{state.fieldErrors.whatsappNumber[0]}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-surface-200 space-y-6">
              <h2 className="text-xl font-bold text-surface-950 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-warning-500" />
                حساب صاحب المتجر
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-surface-950 mb-1">البريد الإلكتروني</label>
                  <div className="relative">
                    <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                    <input
                      name="email"
                      type="email"
                      required
                      defaultValue={state?.data?.email as string || ""}
                      className={`w-full ps-10 pe-4 py-2.5 bg-surface-50 border rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${state?.fieldErrors?.email ? "border-error-500" : "border-surface-200"}`}
                      placeholder="owner@store.com"
                      dir="ltr"
                    />
                  </div>
                  {state?.fieldErrors?.email && <p className="text-sm text-error-500 mt-1">{state.fieldErrors.email[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-surface-950 mb-1">كلمة المرور</label>
                  <div className="relative">
                    <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                    <input
                      name="password"
                      type="password"
                      required
                      defaultValue={state?.data?.password as string || ""}
                      className={`w-full ps-10 pe-4 py-2.5 bg-surface-50 border rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${state?.fieldErrors?.password ? "border-error-500" : "border-surface-200"}`}
                      placeholder="••••••••"
                      dir="ltr"
                    />
                  </div>
                  {state?.fieldErrors?.password ? (
                    <p className="text-sm text-error-500 mt-1">{state.fieldErrors.password[0]}</p>
                  ) : (
                    <p className="text-xs text-surface-500 mt-1">يجب أن تكون 6 أحرف على الأقل</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-surface-200">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Store className="w-5 h-5" />
            )}
            حفظ وإنشاء المتجر
          </button>
        </div>
      </form>
    </div>
  );
}
