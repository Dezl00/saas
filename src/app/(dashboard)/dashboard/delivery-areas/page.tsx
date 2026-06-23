import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/dashboard/Header";
import { Map, Plus, Trash2 } from "lucide-react";
import { addDeliveryArea, deleteDeliveryArea, toggleDeliveryArea } from "./actions";

export const metadata = {
  title: "مناطق التوصيل | لوحة التحكم",
};

export default async function DeliveryAreasPage() {
  const session = await auth();
  
  if (!session?.user?.storeId) {
    return null;
  }

  const areas = await prisma.deliveryArea.findMany({
    where: { storeId: session.user.storeId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="animate-fade-in pb-10">
      <Header title="مناطق التوصيل" />
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* إضافة منطقة جديد */}
        <div className="bg-white border border-surface-200 p-6 self-start">
          <h3 className="text-xl font-bold text-surface-950 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary-600" />
            إضافة منطقة توصيل
          </h3>
          <form action={addDeliveryArea as any} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-surface-950 mb-1">اسم المنطقة *</label>
              <input type="text" name="name" id="name" required placeholder="مثال: مدينة نصر" className="w-full px-3 py-2 bg-white border border-surface-200 text-surface-950 focus:border-primary-500 outline-none" />
            </div>
            <div>
              <label htmlFor="fee" className="block text-sm font-medium text-surface-950 mb-1">رسوم التوصيل *</label>
              <input type="number" step="0.01" min="0" name="fee" id="fee" required placeholder="0.00" className="w-full px-3 py-2 bg-white border border-surface-200 text-surface-950 focus:border-primary-500 outline-none text-end" dir="ltr" />
            </div>
            <button type="submit" className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold transition-colors">
              حفظ المنطقة
            </button>
          </form>
        </div>

        {/* قائمة المناطق */}
        <div className="lg:col-span-2 space-y-4">
          {areas.length === 0 ? (
            <div className="text-center py-16 bg-white border border-surface-200">
              <Map className="w-12 h-12 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-500">لا توجد مناطق توصيل مضافة حالياً.</p>
            </div>
          ) : (
            areas.map(area => (
              <div key={area.id} className="bg-white border border-surface-200 p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-lg text-surface-950">{area.name}</h4>
                  <p className="text-sm font-black text-primary-600 mt-1">رسوم التوصيل: {Number(area.deliveryFee)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <form action={toggleDeliveryArea as any}>
                    <input type="hidden" name="areaId" value={area.id} />
                    <button type="submit" className={`text-xs font-bold px-3 py-1 border ${area.isActive ? 'bg-success-50 text-success-700 border-success-200' : 'bg-surface-100 text-surface-600 border-surface-200'}`}>
                      {area.isActive ? 'مفعلة' : 'موقوفة'}
                    </button>
                  </form>
                  <form action={deleteDeliveryArea as any}>
                    <input type="hidden" name="areaId" value={area.id} />
                    <button type="submit" className="text-surface-400 hover:text-error-600 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
