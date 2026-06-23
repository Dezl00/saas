import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/dashboard/Header";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { addBranch, deleteBranch, toggleBranch } from "./actions";

export const metadata = {
  title: "الفروع | لوحة التحكم",
};

export default async function BranchesPage() {
  const session = await auth();
  
  if (!session?.user?.storeId) {
    return null;
  }

  const branches = await prisma.branch.findMany({
    where: { storeId: session.user.storeId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="animate-fade-in pb-10">
      <Header title="فروع المتجر" />
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* إضافة فرع جديد */}
        <div className="bg-white border border-surface-200 p-6 self-start">
          <h3 className="text-xl font-bold text-surface-950 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary-600" />
            إضافة فرع جديد
          </h3>
          <form action={addBranch as any} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-surface-950 mb-1">اسم الفرع *</label>
              <input type="text" name="name" id="name" required placeholder="مثال: فرع المهندسين" className="w-full px-3 py-2 bg-white border border-surface-200 text-surface-950 focus:border-primary-500 outline-none" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-surface-950 mb-1">هاتف الفرع</label>
              <input type="text" name="phone" id="phone" dir="ltr" placeholder="01xxxxxxxxx" className="w-full px-3 py-2 bg-white border border-surface-200 text-surface-950 focus:border-primary-500 outline-none text-end" />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-surface-950 mb-1">العنوان التفصيلي</label>
              <textarea name="address" id="address" rows={2} className="w-full px-3 py-2 bg-white border border-surface-200 text-surface-950 focus:border-primary-500 outline-none" />
            </div>
            <button type="submit" className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold transition-colors">
              حفظ الفرع
            </button>
          </form>
        </div>

        {/* قائمة الفروع */}
        <div className="lg:col-span-2 space-y-4">
          {branches.length === 0 ? (
            <div className="text-center py-16 bg-white border border-surface-200">
              <MapPin className="w-12 h-12 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-500">لا توجد فروع مضافة حالياً.</p>
            </div>
          ) : (
            branches.map(branch => (
              <div key={branch.id} className="bg-white border border-surface-200 p-5 flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-lg text-surface-950">{branch.name}</h4>
                  {branch.phone && <p className="text-sm text-surface-500 mt-1" dir="ltr">{branch.phone}</p>}
                  {branch.address && <p className="text-sm text-surface-500 mt-1">{branch.address}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <form action={toggleBranch as any}>
                    <input type="hidden" name="branchId" value={branch.id} />
                    <button type="submit" className={`text-xs font-bold px-3 py-1 border ${branch.isActive ? 'bg-success-50 text-success-700 border-success-200' : 'bg-surface-100 text-surface-600 border-surface-200'}`}>
                      {branch.isActive ? 'مفعل' : 'موقوف'}
                    </button>
                  </form>
                  <form action={deleteBranch as any}>
                    <input type="hidden" name="branchId" value={branch.id} />
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
