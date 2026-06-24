import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Breadcrumb } from "@/components/dashboard/Breadcrumb";
import { Plus, Ticket, Percent } from "lucide-react";
import { addCoupon, deleteCoupon, toggleCoupon } from "./actions";
import { DeleteConfirmButton } from "@/components/dashboard/DeleteConfirmButton";
import { formatPrice } from "@/lib/utils";

export const metadata = {
  title: "الكوبونات | لوحة التحكم",
};

export default async function CouponsPage() {
  const session = await auth();
  
  if (!session?.user?.storeId) {
    return null;
  }

  const store = await prisma.store.findUnique({
    where: { id: session.user.storeId },
    select: { currency: true }
  });

  const coupons = await prisma.coupon.findMany({
    where: { storeId: session.user.storeId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="animate-fade-in pb-10">
      <Breadcrumb title="كوبونات الخصم" />
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* إضافة كوبون جديد */}
        <div className="bg-white rounded-2xl border border-surface-200 p-6 self-start sticky top-6 max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-hide">
          <h3 className="text-xl font-bold text-surface-950 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary-600" />
            إضافة كوبون جديد
          </h3>
          <form action={addCoupon as any} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-surface-950 mb-1">كود الخصم *</label>
              <input type="text" name="code" id="code" required placeholder="مثال: SUMMER20" dir="ltr" className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none uppercase" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-surface-950 mb-1">نوع الخصم *</label>
                <select name="type" id="type" className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none">
                  <option value="PERCENTAGE">نسبة مئوية (%)</option>
                  <option value="FIXED">مبلغ ثابت</option>
                </select>
              </div>
              <div>
                <label htmlFor="value" className="block text-sm font-medium text-surface-950 mb-1">قيمة الخصم *</label>
                <input type="number" name="value" id="value" required min="1" step="0.1" placeholder="مثال: 20" dir="ltr" className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="minOrder" className="block text-sm font-medium text-surface-950 mb-1">الحد الأدنى للطلب (اختياري)</label>
                <input type="number" name="minOrder" id="minOrder" min="0" step="0.5" placeholder="مثال: 100" dir="ltr" className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label htmlFor="maxDiscount" className="block text-sm font-medium text-surface-950 mb-1">الحد الأقصى للخصم (اختياري)</label>
                <input type="number" name="maxDiscount" id="maxDiscount" min="0" step="0.5" placeholder="مثال: 50" dir="ltr" className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="usageLimit" className="block text-sm font-medium text-surface-950 mb-1">الحد الأقصى للاستخدام (اختياري)</label>
                <input type="number" name="usageLimit" id="usageLimit" min="1" placeholder="مثال: 100" dir="ltr" className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label htmlFor="expiresAt" className="block text-sm font-medium text-surface-950 mb-1">تاريخ الانتهاء (اختياري)</label>
                <input type="date" name="expiresAt" id="expiresAt" className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none" />
              </div>
            </div>

            <button type="submit" className="w-full mt-2 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2">
              <Ticket className="w-5 h-5" />
              إنشاء الكوبون
            </button>
          </form>
        </div>

        {/* قائمة الكوبونات */}
        <div className="lg:col-span-2 space-y-4">
          {coupons.length === 0 ? (
            <div className="text-center py-16 bg-white border border-surface-200 rounded-2xl">
              <Ticket className="w-12 h-12 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-500">لا توجد كوبونات مضافة حالياً.</p>
            </div>
          ) : (
            coupons.map(coupon => {
              const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
              const isFullyUsed = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;
              const isInvalid = isExpired || isFullyUsed;

              return (
                <div key={coupon.id} className={`bg-white border rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${isInvalid ? 'opacity-60 border-surface-200 bg-surface-50' : 'border-surface-200'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${coupon.type === 'PERCENTAGE' ? 'bg-primary-50 text-primary-600' : 'bg-accent-50 text-accent-600'}`}>
                      {coupon.type === 'PERCENTAGE' ? <Percent className="w-6 h-6" /> : <Ticket className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-lg text-surface-950 tracking-wider" dir="ltr">{coupon.code}</h4>
                        {isExpired && <span className="text-[10px] bg-error-100 text-error-700 px-2 py-0.5 rounded-full font-bold">منتهي الصلاحية</span>}
                        {isFullyUsed && <span className="text-[10px] bg-error-100 text-error-700 px-2 py-0.5 rounded-full font-bold">مستنفذ العدد</span>}
                      </div>
                      <p className="text-sm font-bold text-surface-600 mt-1">
                        خصم {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : formatPrice(Number(coupon.value), store?.currency)}
                        {coupon.maxDiscount && ` (بحد أقصى ${formatPrice(Number(coupon.maxDiscount), store?.currency)})`}
                      </p>
                      <div className="flex gap-3 text-xs text-surface-500 mt-2">
                        <span>الاستخدام: {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : 'مرة'}</span>
                        {coupon.minOrder && <span>الحد الأدنى للطلب: {formatPrice(Number(coupon.minOrder), store?.currency)}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <form action={toggleCoupon.bind(null, coupon.id) as any}>
                      <button type="submit" disabled={isInvalid as boolean} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${coupon.isActive && !isInvalid ? 'bg-success-500' : 'bg-error-500'} ${isInvalid ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${coupon.isActive && !isInvalid ? '-translate-x-6' : '-translate-x-1'}`} />
                      </button>
                    </form>
                    <DeleteConfirmButton action={deleteCoupon.bind(null, coupon.id) as any} />
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
