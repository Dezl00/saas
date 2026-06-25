import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Breadcrumb } from "@/components/dashboard/Breadcrumb";
import { Plus, Trash2, ImageIcon } from "lucide-react";
import { toggleMenuItemStatus, deleteMenuItem } from "./actions";
import { MenuItemForm } from "@/components/dashboard/MenuItemForm";
import { DeleteConfirmButton } from "@/components/dashboard/DeleteConfirmButton";
import { MenuItemEditButton } from "@/components/dashboard/MenuItemEditButton";
import { AIMenuScanner } from "@/components/dashboard/AIMenuScanner";
import { MenuItemsTable } from "@/components/dashboard/MenuItemsTable";

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
        { sortOrder: 'asc' },
        { createdAt: 'asc' }
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
      <Breadcrumb title="إدارة المنيو" />
      
      <div className="flex justify-end mt-4 px-1">
        <AIMenuScanner />
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        {/* نموذج إضافة صنف */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-2xl border border-surface-200 p-6 sticky top-6 max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-hide">
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
          <MenuItemsTable menuItems={menuItems} categories={categories.map(c => ({ id: c.id, name: c.name }))} />
        </div>
      </div>
    </div>
  );
}

