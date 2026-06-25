"use client";

import { useState } from "react";
import { ImageIcon, Trash2, CheckSquare, Square, Loader2 } from "lucide-react";
import { toggleMenuItemStatus, deleteMenuItem, bulkDeleteMenuItems } from "@/app/(dashboard)/dashboard/menu/actions";
import { MenuItemEditButton } from "@/components/dashboard/MenuItemEditButton";
import { DeleteConfirmButton } from "@/components/dashboard/DeleteConfirmButton";
import { GenerateImageButton } from "@/components/dashboard/GenerateImageButton";
import toast from "react-hot-toast";

type MenuItemType = {
  id: string;
  name: string;
  description: string | null;
  price: string | number | any;
  image: string | null;
  isAvailable: boolean;
  sortOrder: number;
  categoryId: string;
  category: { id: string; name: string };
  sizes: any[];
  addons: any[];
};

type CategoryType = {
  id: string;
  name: string;
};

export function MenuItemsTable({ 
  menuItems, 
  categories 
}: { 
  menuItems: MenuItemType[], 
  categories: CategoryType[] 
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);

  const toggleSelectAll = () => {
    if (selectedIds.size === menuItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(menuItems.map(item => item.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    if (!confirm(`هل أنت متأكد من حذف ${selectedIds.size} صنف؟`)) return;

    setIsDeletingBulk(true);
    const result = await bulkDeleteMenuItems(Array.from(selectedIds));
    
    if (result?.error) {
      toast.error(result.error);
    } else if (result?.success) {
      toast.success(result.success);
      setSelectedIds(new Set());
    }
    setIsDeletingBulk(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
      {selectedIds.size > 0 && (
        <div className="bg-primary-50 px-6 py-3 border-b border-surface-200 flex items-center justify-between animate-slide-down">
          <span className="font-bold text-primary-800">
            تم تحديد {selectedIds.size} صنف
          </span>
          <button
            onClick={handleBulkDelete}
            disabled={isDeletingBulk}
            className="flex items-center gap-2 px-3 py-1.5 bg-error-600 text-white rounded-lg text-sm font-bold hover:bg-error-700 transition-colors disabled:opacity-50"
          >
            {isDeletingBulk ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            حذف المحدد
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-start">
          <thead>
            <tr className="bg-surface-50 border-b border-surface-200">
              <th className="px-6 py-4 text-start w-12">
                <button onClick={toggleSelectAll} className="text-surface-400 hover:text-primary-600 transition-colors">
                  {selectedIds.size === menuItems.length && menuItems.length > 0 ? (
                    <CheckSquare className="w-5 h-5 text-primary-600" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
              </th>
              <th className="px-2 py-4 text-start text-sm font-bold text-surface-950 w-16">الصورة</th>
              <th className="px-6 py-4 text-start text-sm font-bold text-surface-950">الصنف</th>
              <th className="px-6 py-4 text-start text-sm font-bold text-surface-950">السعر</th>
              <th className="px-6 py-4 text-start text-sm font-bold text-surface-950">الحالة</th>
              <th className="px-6 py-4 text-end text-sm font-bold text-surface-950">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {menuItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-surface-500">
                  لم تقم بإضافة أي أصناف بعد.
                </td>
              </tr>
            ) : (
              menuItems.map((item) => {
                const isSelected = selectedIds.has(item.id);
                return (
                  <tr key={item.id} className={`transition-colors ${isSelected ? 'bg-primary-50/50' : 'hover:bg-surface-50/50'}`}>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleSelectRow(item.id)} className="text-surface-400 hover:text-primary-600 transition-colors">
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-primary-600" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-2 py-4">
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
                            item.isAvailable ? 'bg-success-500' : 'bg-error-500'
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
                        <GenerateImageButton itemId={item.id} hasImage={!!item.image} />
                        <MenuItemEditButton 
                          item={{
                            ...item,
                            price: item.price.toString(),
                            sizes: item.sizes.map(s => ({ ...s, price: s.price.toString() })),
                            addons: item.addons.map(a => ({ ...a, price: a.price.toString() }))
                          }} 
                          categories={categories.map(c => ({ id: c.id, name: c.name }))} 
                        />
                        <DeleteConfirmButton action={deleteMenuItem.bind(null, item.id) as any} />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
