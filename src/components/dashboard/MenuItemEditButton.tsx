"use client";

import { useState } from "react";
import { Edit2, X } from "lucide-react";
import { MenuItemForm, MenuItemData } from "./MenuItemForm";

type Category = { id: string; name: string };

export function MenuItemEditButton({ item, categories }: { item: MenuItemData, categories: Category[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        title="تعديل"
        className="p-2 text-surface-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
      >
        <Edit2 className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl shadow-xl flex flex-col relative animate-zoom-in">
            <div className="sticky top-0 bg-white border-b border-surface-200 p-4 flex items-center justify-between z-10">
              <h3 className="font-bold text-lg text-surface-950">تعديل {item.name}</h3>
              <button onClick={() => setIsOpen(false)} className="text-surface-400 hover:text-surface-950 bg-surface-100 p-2 rounded-full transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <MenuItemForm categories={categories} initialData={item} onSuccess={() => setIsOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
