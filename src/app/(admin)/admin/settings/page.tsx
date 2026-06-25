import { prisma } from "@/lib/prisma";
import { Settings, Save, Lock } from "lucide-react";
import { updatePlatformSettings, updateAdminPassword } from "./actions";
import { SubmitButton } from "@/components/dashboard/SubmitButton";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import Link from "next/link";

export const metadata = {
  title: "إعدادات المنصة | لوحة الأدمن",
};

export default async function AdminSettingsPage() {
  let settings = null;
  
  try {
    settings = await prisma.platformSetting.findUnique({
      where: { id: "1" },
    });
  } catch (e) {
    // Fallback if DB migration hasn't successfully applied
    console.warn("PlatformSetting table missing or DB unreachable", e);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-surface-500 font-medium">
          <Link href="/admin" className="hover:text-primary-600 transition-colors">الرئيسية</Link>
          <span>/</span>
          <span className="text-surface-900 font-bold">إعدادات المنصة</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* إعدادات المنصة الأساسية */}
        <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm">
          <h3 className="text-xl font-bold text-surface-950 mb-6 flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary-500" />
            الهوية البصرية للمنصة
          </h3>

          <form action={updatePlatformSettings as any} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-surface-950 mb-1">
                اسم المنصة *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={settings?.name || "منصتك"}
                required
                className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
              />
            </div>

            <div>
              <label htmlFor="supportWhatsapp" className="block text-sm font-medium text-surface-950 mb-1">
                رقم واتساب للدعم (يظهر للمستخدمين الموقوفين)
              </label>
              <input
                type="text"
                id="supportWhatsapp"
                name="supportWhatsapp"
                dir="ltr"
                defaultValue={settings?.supportWhatsapp || ""}
                placeholder="+201000000000"
                className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
              />
            </div>

            <div>
              <ImageUpload name="logo" label="الشعار (Logo)" defaultValue={settings?.logo} />
            </div>

            <SubmitButton
              className="mt-6 w-full py-3 px-8 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              حفظ بيانات المنصة
            </SubmitButton>
          </form>
        </div>

        {/* تغيير كلمة مرور الأدمن */}
        <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm self-start">
          <h3 className="text-xl font-bold text-surface-950 mb-6 flex items-center gap-2">
            <Lock className="w-6 h-6 text-surface-700" />
            تغيير كلمة المرور الخاصة بك
          </h3>

          <form action={updateAdminPassword as any} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-surface-950 mb-1">
                كلمة المرور الجديدة *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength={6}
                dir="ltr"
                className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
              />
            </div>

            <SubmitButton
              className="mt-6 w-full py-3 px-8 bg-surface-950 hover:bg-surface-800 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              تحديث كلمة المرور
            </SubmitButton>
          </form>
        </div>

      </div>
    </div>
  );
}
