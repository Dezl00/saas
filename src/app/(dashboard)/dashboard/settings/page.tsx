import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/dashboard/Header";
import { Globe, Store, Save } from "lucide-react";
import { updateStoreSettings, updateSubdomain } from "./actions";

export const metadata = {
  title: "إعدادات المتجر | لوحة التحكم",
};

export default async function SettingsPage() {
  const session = await auth();
  
  if (!session?.user?.storeId) {
    return null;
  }

  const store = await prisma.store.findUnique({
    where: { id: session.user.storeId }
  });

  if (!store) return null;

  return (
    <div className="animate-fade-in pb-10">
      <Header title="إعدادات المتجر" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        
        {/* إعدادات الرابط (Subdomain) */}
        <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 lg:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 start-0 w-1 h-full bg-primary-500"></div>
          
          <h3 className="text-xl font-bold text-surface-950 mb-2 flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary-500" />
            رابط المتجر (Subdomain)
          </h3>
          <p className="text-surface-500 text-sm mb-6">
            اختر الرابط الخاص بمتجرك والذي ستقوم بمشاركته مع عملائك.
          </p>

          <form action={updateSubdomain as any} className="max-w-xl">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label htmlFor="subdomain" className="block text-sm font-medium text-surface-950 mb-1">
                  رابط المتجر
                </label>
                <div className="flex items-center" dir="ltr">
                  <span className="px-4 py-2.5 bg-surface-100 border border-e-0 border-surface-200 rounded-s-xl text-surface-600 font-medium">
                    https://
                  </span>
                  <input
                    type="text"
                    id="subdomain"
                    name="subdomain"
                    defaultValue={store.subdomain || ""}
                    placeholder="my-restaurant"
                    required
                    className="w-full px-3 py-2.5 bg-white border border-surface-200 text-surface-950 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                  />
                  <span className="px-4 py-2.5 bg-surface-100 border border-s-0 border-surface-200 rounded-e-xl text-surface-600 font-medium whitespace-nowrap">
                    .{process.env.NEXT_PUBLIC_ROOT_DOMAIN || "yourdomain.com"}
                  </span>
                </div>
              </div>
              <button
                type="submit"
                className="py-2.5 px-6 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20 whitespace-nowrap"
              >
                تحديث الرابط
              </button>
            </div>
            {store.subdomain && (
              <div className="mt-4 p-4 bg-success-50 text-success-800 rounded-xl border border-success-200 text-sm">
                متجرك متاح حالياً للعملاء عبر الرابط: <br/>
                <a href={`https://${store.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`} target="_blank" className="font-bold underline mt-1 inline-block" dir="ltr">
                  https://{store.subdomain}.{process.env.NEXT_PUBLIC_ROOT_DOMAIN || "yourdomain.com"}
                </a>
              </div>
            )}
          </form>
        </div>

        {/* الإعدادات الأساسية */}
        <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6">
          <h3 className="text-xl font-bold text-surface-950 mb-6 flex items-center gap-2">
            <Store className="w-6 h-6 text-surface-700" />
            البيانات الأساسية
          </h3>
          
          <form action={updateStoreSettings as any} className="space-y-4">
            <div>
              <label htmlFor="store_name" className="block text-sm font-medium text-surface-950 mb-1">
                اسم المتجر *
              </label>
              <input
                type="text"
                id="store_name"
                name="name"
                defaultValue={store.name}
                required
                className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-surface-950 mb-1">
                وصف المتجر
              </label>
              <textarea
                id="description"
                name="description"
                defaultValue={store.description || ""}
                rows={3}
                placeholder="نبذة مختصرة عن المتجر تظهر للعملاء..."
                className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-surface-950 mb-1">
                  رقم الهاتف
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  defaultValue={store.phone || ""}
                  dir="ltr"
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 text-end focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-surface-950 mb-1">
                  العملة
                </label>
                <select
                  id="currency"
                  name="currency"
                  defaultValue={store.currency}
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                >
                  <option value="EGP">جنيه مصري (EGP)</option>
                  <option value="SAR">ريال سعودي (SAR)</option>
                  <option value="USD">دولار أمريكي (USD)</option>
                  <option value="AED">درهم إماراتي (AED)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-surface-950 mb-1">
                العنوان التفصيلي
              </label>
              <input
                type="text"
                id="address"
                name="address"
                defaultValue={store.address || ""}
                className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-surface-950 hover:bg-surface-800 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              حفظ التغييرات
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
