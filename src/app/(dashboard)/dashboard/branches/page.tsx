import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Breadcrumb } from "@/components/dashboard/Breadcrumb";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { addBranch, deleteBranch, toggleBranch } from "./actions";
import { DeleteConfirmButton } from "@/components/dashboard/DeleteConfirmButton";

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
      <Breadcrumb title="فروع المتجر" />
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* إضافة فرع جديد */}
        <div className="bg-white rounded-2xl border border-surface-200 p-6 self-start sticky top-6 max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-hide">
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
                    <button type="submit" className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${branch.isActive ? 'bg-success-500' : 'bg-error-500'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${branch.isActive ? '-translate-x-6' : '-translate-x-1'}`} />
                    </button>
                  </form>
                  <DeleteConfirmButton action={deleteBranch.bind(null, branch.id) as any} />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

