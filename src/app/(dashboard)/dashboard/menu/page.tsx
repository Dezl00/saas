import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/dashboard/Header";
import { Plus, Trash2, ImageIcon } from "lucide-react";
import { toggleMenuItemStatus, deleteMenuItem } from "./actions";
import { MenuItemForm } from "@/components/dashboard/MenuItemForm";
import { MenuItemEditButton } from "@/components/dashboard/MenuItemEditButton";
import { AIMenuScanner } from "@/components/dashboard/AIMenuScanner";

export const metadata = {
  title: "إدارة المنيو | لوحة التحكم",
};

export const maxDuration = 60;

export default async function MenuPage() {
  const session = await auth();
  
  if (!session?.user?.storeId) {
    return null;
  }

  const [menuItems, categories] = await Promise.all([
    prisma.menuItem.findMany({
      where: { storeId: session.user.storeId },
      orderBy: [
        { category: { sortOrder: 'asc' } },
        { sortOrder: 'asc' }
      ],
      include: { category: true, sizes: true, addons: true }
    }),
    prisma.category.findMany({
      where: { storeId: session.user.storeId },
      orderBy: { sortOrder: 'asc' }
    })
  ]);

  return (
    <div className="animate-fade-in pb-10">
      <Header title="إدارة المنيو" />
      
      <div className="flex justify-end mt-4 px-1">
        <AIMenuScanner />
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        {/* نموذج إضافة صنف */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 sticky top-6">
            <h3 className="text-lg font-bold text-surface-950 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary-500" />
              إضافة صنف جديد
            </h3>
            
            {categories.length === 0 ? (
              <div className="p-4 bg-primary-50 text-primary-800 rounded-xl text-sm font-medium border border-primary-100">
                يجب إضافة "قسم" واحد على الأقل قبل إضافة الأصناف. يرجى الذهاب لصفحة الأقسام أولاً.
              </div>
            ) : (
              <MenuItemForm categories={categories.map(c => ({ id: c.id, name: c.name }))} />
            )}
          </div>
        </div>

        {/* قائمة الأصناف */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-start">
                <thead>
                  <tr className="bg-surface-50 border-b border-surface-200">
                    <th className="px-6 py-4 text-start text-sm font-bold text-surface-950 w-16">الصورة</th>
                    <th className="px-6 py-4 text-start text-sm font-bold text-surface-950">الصنف</th>
                    <th className="px-6 py-4 text-start text-sm font-bold text-surface-950">السعر</th>
                    <th className="px-6 py-4 text-start text-sm font-bold text-surface-950">الحالة</th>
                    <th className="px-6 py-4 text-end text-sm font-bold text-surface-950">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {menuItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-surface-500">
                        لم تقم بإضافة أي أصناف بعد.
                      </td>
                    </tr>
                  ) : (
                    menuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-surface-50/50 transition-colors">
                        <td className="px-6 py-4">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-surface-100" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-surface-100 flex items-center justify-center text-surface-400 border border-surface-200">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-surface-950">{item.name}</p>
                          <p className="text-xs text-primary-600 font-medium mb-1">{item.category.name}</p>
                          {item.description && (
                            <p className="text-xs text-surface-500 line-clamp-1">{item.description}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-surface-950">{Number(item.price).toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <form action={toggleMenuItemStatus.bind(null, item.id, item.isAvailable) as any}>
                            <button
                              type="submit"
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                item.isAvailable ? 'bg-success-500' : 'bg-surface-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  item.isAvailable ? '-translate-x-6' : '-translate-x-1'
                                }`}
                              />
                            </button>
                          </form>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <MenuItemEditButton 
                              item={{
                                ...item,
                                price: item.price.toString(),
                                sizes: item.sizes.map(s => ({ ...s, price: s.price.toString() })),
                                addons: item.addons.map(a => ({ ...a, price: a.price.toString() }))
                              }} 
                              categories={categories.map(c => ({ id: c.id, name: c.name }))} 
                            />
                            <form action={deleteMenuItem.bind(null, item.id) as any}>
                              <button
                                type="submit"
                                title="حذف"
                                className="p-2 text-error-500 hover:bg-error-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </form>
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
