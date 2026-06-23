import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/dashboard/Header";
import { Globe, Store, Save, Share2, MessageCircle } from "lucide-react";
import { updateStoreSettings, updateSubdomain, updateContactSettings } from "./actions";
import { SubmitButton } from "@/components/dashboard/SubmitButton";

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
                    .menura.site
                  </span>
                </div>
              </div>
              <SubmitButton
                className="py-2.5 px-6 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20 whitespace-nowrap"
              >
                تحديث الرابط
              </SubmitButton>
            </div>
            {store.subdomain && (
              <div className="mt-4 p-4 bg-success-50 text-success-800 rounded-xl border border-success-200 text-sm">
                متجرك متاح حالياً للعملاء عبر الرابط: <br/>
                <a href={`https://${store.subdomain}.menura.site`} target="_blank" className="font-bold underline mt-1 inline-block" dir="ltr">
                  https://{store.subdomain}.menura.site
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
              <div className="flex items-center gap-3">
                {store.logo && (
                  <div className="w-10 h-10 rounded-full border border-surface-200 overflow-hidden shrink-0">
                    <img src={store.logo} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                )}
                <input
                  type="url"
                  id="logo"
                  name="logo"
                  defaultValue={store.logo || ""}
                  placeholder="https://example.com/logo.png"
                  dir="ltr"
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 text-end focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="primaryColor" className="block text-sm font-medium text-surface-950 mb-1">اللون الرئيسي (للأزرار)</label>
                <div className="flex items-center gap-3 bg-surface-50 p-2 rounded-xl border border-surface-200">
                  <input
                    type="color"
                    id="primaryColor"
                    name="primaryColor"
                    defaultValue={store.primaryColor || "#000000"}
                    className="w-8 h-8 rounded cursor-pointer border-0 p-0 shrink-0"
                  />
                  <span className="text-sm font-medium text-surface-600" dir="ltr">{store.primaryColor || "#000000"}</span>
                </div>
              </div>
              <div>
                <label htmlFor="secondaryColor" className="block text-sm font-medium text-surface-950 mb-1">اللون الثانوي (للأيقونات)</label>
                <div className="flex items-center gap-3 bg-surface-50 p-2 rounded-xl border border-surface-200">
                  <input
                    type="color"
                    id="secondaryColor"
                    name="secondaryColor"
                    defaultValue={store.secondaryColor || "#666666"}
                    className="w-8 h-8 rounded cursor-pointer border-0 p-0 shrink-0"
                  />
                  <span className="text-sm font-medium text-surface-600" dir="ltr">{store.secondaryColor || "#666666"}</span>
                </div>
              </div>
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

            <SubmitButton
              className="w-full mt-2 py-2.5 px-4 bg-surface-950 hover:bg-surface-800 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              حفظ التغييرات
            </SubmitButton>
          </form>
        </div>

        {/* بيانات التواصل والسوشيال ميديا */}
        <div className="bg-white rounded-2xl border border-surface-200 p-6 lg:col-span-2">
          <h3 className="text-xl font-bold text-surface-950 mb-6 flex items-center gap-2">
            <Share2 className="w-6 h-6 text-surface-700" />
            بيانات التواصل والسوشيال ميديا
          </h3>

          <form action={updateContactSettings as any} className="space-y-6">
            
            <div className="bg-success-50/50 p-6 rounded-2xl border border-success-100">
              <h4 className="font-bold text-surface-950 mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-success-600" />
                استقبال الطلبات عبر واتساب
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="whatsappNumber" className="block text-sm font-medium text-surface-950 mb-1">
                    رقم الواتساب (متضمن كود الدولة)
                  </label>
                  <input
                    type="text"
                    id="whatsappNumber"
                    name="whatsappNumber"
                    placeholder="201012345678"
                    defaultValue={store.whatsappNumber || ""}
                    dir="ltr"
                    className="w-full px-3 py-2 bg-white border border-surface-200 rounded-xl text-surface-950 text-end focus:ring-2 focus:ring-success-500/20 focus:border-success-500 transition-colors"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="enableWhatsappOrders" 
                      value="on"
                      defaultChecked={store.enableWhatsappOrders}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full rtl:peer-checked:after:-translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success-500"></div>
                    <span className="ms-3 text-sm font-medium text-surface-700">تفعيل توجيه الزبون للواتساب بعد إتمام الطلب</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="facebookUrl" className="block text-sm font-medium text-surface-950 mb-1">
                  رابط فيسبوك
                </label>
                <input
                  type="url"
                  id="facebookUrl"
                  name="facebookUrl"
                  defaultValue={store.facebookUrl || ""}
                  dir="ltr"
                  placeholder="https://facebook.com/..."
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 text-end focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="instagramUrl" className="block text-sm font-medium text-surface-950 mb-1">
                  رابط انستجرام
                </label>
                <input
                  type="url"
                  id="instagramUrl"
                  name="instagramUrl"
                  defaultValue={store.instagramUrl || ""}
                  dir="ltr"
                  placeholder="https://instagram.com/..."
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 text-end focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="twitterUrl" className="block text-sm font-medium text-surface-950 mb-1">
                  رابط X (تويتر)
                </label>
                <input
                  type="url"
                  id="twitterUrl"
                  name="twitterUrl"
                  defaultValue={store.twitterUrl || ""}
                  dir="ltr"
                  placeholder="https://x.com/..."
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 text-end focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="tiktokUrl" className="block text-sm font-medium text-surface-950 mb-1">
                  رابط تيك توك
                </label>
                <input
                  type="url"
                  id="tiktokUrl"
                  name="tiktokUrl"
                  defaultValue={store.tiktokUrl || ""}
                  dir="ltr"
                  placeholder="https://tiktok.com/@..."
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 text-end focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="snapchatUrl" className="block text-sm font-medium text-surface-950 mb-1">
                  رابط سناب شات
                </label>
                <input
                  type="url"
                  id="snapchatUrl"
                  name="snapchatUrl"
                  defaultValue={store.snapchatUrl || ""}
                  dir="ltr"
                  placeholder="https://snapchat.com/add/..."
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 text-end focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            <SubmitButton
              className="mt-4 py-2.5 px-6 bg-surface-950 hover:bg-surface-800 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              حفظ بيانات التواصل
            </SubmitButton>
          </form>
        </div>

      </div>
    </div>
  );
}
