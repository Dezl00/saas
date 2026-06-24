import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Breadcrumb } from "@/components/dashboard/Breadcrumb";
import { Plus, Trash2, Edit2, CheckCircle2, XCircle } from "lucide-react";
import { createCategory, toggleCategoryStatus, deleteCategory } from "./actions";
import { SubmitButton } from "@/components/dashboard/SubmitButton";
import { DeleteConfirmButton } from "@/components/dashboard/DeleteConfirmButton";

export const metadata = {
  title: "إدارة الأقسام | لوحة التحكم",
};

export default async function CategoriesPage() {
  const session = await auth();
  
  if (!session?.user?.storeId) {
    return null;
  }

  const categories = await prisma.category.findMany({
    where: { storeId: session.user.storeId },
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: { items: true }
      }
    }
  });

  return (
    <div className="animate-fade-in pb-10">
      <Breadcrumb title="إدارة الأقسام" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* نموذج إضافة قسم */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-surface-200 p-6 sticky top-6 max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-hide">
            <h3 className="text-lg font-bold text-surface-950 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary-500" />
              إضافة قسم جديد
            </h3>
            
            <form action={createCategory as any} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-surface-950 mb-1">
                  اسم القسم *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="مثال: مقبلات، مشويات"
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-surface-950 mb-1">
                  الوصف (اختياري)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={2}
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="sortOrder" className="block text-sm font-medium text-surface-950 mb-1">
                  الترتيب
                </label>
                <input
                  type="number"
                  id="sortOrder"
                  name="sortOrder"
                  defaultValue="0"
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-xl text-surface-950 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                />
              </div>

              <SubmitButton
                className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all"
              >
                حفظ القسم
              </SubmitButton>
            </form>
          </div>
        </div>

        {/* قائمة الأقسام */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-start">
                <thead>
                  <tr className="bg-surface-50 border-b border-surface-200">
                    <th className="px-6 py-4 text-start text-sm font-bold text-surface-950">اسم القسم</th>
                    <th className="px-6 py-4 text-start text-sm font-bold text-surface-950">عدد الأصناف</th>
                    <th className="px-6 py-4 text-start text-sm font-bold text-surface-950">الحالة</th>
                    <th className="px-6 py-4 text-end text-sm font-bold text-surface-950">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-surface-500">
                        لم تقم بإضافة أي أقسام بعد.
                      </td>
                    </tr>
                  ) : (
                    categories.map((category) => (
                      <tr key={category.id} className="hover:bg-surface-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-surface-950">{category.name}</p>
                          {category.description && (
                            <p className="text-xs text-surface-500 mt-1 line-clamp-1">{category.description}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-100 text-surface-800">
                            {category._count.items} أصناف
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <form action={toggleCategoryStatus.bind(null, category.id, category.isActive) as any}>
                              <button
                                type="submit"
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                  category.isActive ? 'bg-success-500' : 'bg-error-500'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    category.isActive ? '-translate-x-6' : '-translate-x-1'
                                  }`}
                                />
                              </button>
                          </form>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <DeleteConfirmButton action={deleteCategory.bind(null, category.id) as any} />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

