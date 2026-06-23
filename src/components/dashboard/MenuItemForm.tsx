"use client";

import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { createMenuItem, updateMenuItem } from "@/app/(dashboard)/dashboard/menu/actions";
import toast from "react-hot-toast";

type Category = { id: string; name: string };
export type MenuItemData = {
  id: string;
  name: string;
  description: string | null;
  price: string | number;
  image: string | null;
  categoryId: string;
  sizes: { id?: string; name: string; price: string | number }[];
  addons: { id?: string; name: string; price: string | number }[];
};

export function MenuItemForm({ categories, initialData, onSuccess }: { categories: Category[], initialData?: MenuItemData, onSuccess?: () => void }) {
  const [sizes, setSizes] = useState<{ name: string; price: string }[]>(
    initialData?.sizes ? initialData.sizes.map(s => ({ name: s.name, price: s.price.toString() })) : []
  );
  const [addons, setAddons] = useState<{ name: string; price: string }[]>(
    initialData?.addons ? initialData.addons.map(a => ({ name: a.name, price: a.price.toString() })) : []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addSize = () => setSizes([...sizes, { name: "", price: "" }]);
  const removeSize = (index: number) => setSizes(sizes.filter((_, i) => i !== index));
  const updateSize = (index: number, field: "name" | "price", value: string) => {
    const newSizes = [...sizes];
    newSizes[index][field] = value;
    setSizes(newSizes);
  };

  const addAddon = () => setAddons([...addons, { name: "", price: "" }]);
  const removeAddon = (index: number) => setAddons(addons.filter((_, i) => i !== index));
  const updateAddon = (index: number, field: "name" | "price", value: string) => {
    const newAddons = [...addons];
    newAddons[index][field] = value;
    setAddons(newAddons);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("sizes", JSON.stringify(sizes));
    formData.append("addons", JSON.stringify(addons));

    try {
      if (initialData) {
        await updateMenuItem(initialData.id, formData);
        toast.success("تم تحديث الصنف بنجاح");
      } else {
        await createMenuItem(formData);
        toast.success("تمت إضافة الصنف بنجاح");
      }
      
      // Reset form after successful submission
      if (!initialData) {
        (e.target as HTMLFormElement).reset();
        setSizes([]);
        setAddons([]);
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="categoryId" className="block text-sm font-bold text-surface-950 mb-1">القسم *</label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={initialData?.categoryId || ""}
            className="w-full px-3 py-2 bg-white border border-surface-200 text-surface-950 focus:border-primary-500 outline-none"
          >
            <option value="">اختر القسم...</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-bold text-surface-950 mb-1">اسم الصنف *</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={initialData?.name}
            placeholder="مثال: برجر لحم مشوي"
            className="w-full px-3 py-2 bg-white border border-surface-200 text-surface-950 focus:border-primary-500 outline-none"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-bold text-surface-950 mb-1">
            السعر الأساسي * <span className="text-xs font-normal text-surface-500">(سيتم استخدامه إذا لم يقم باختيار حجم)</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            required
            defaultValue={initialData?.price}
            placeholder="0.00"
            className="w-full px-3 py-2 bg-white border border-surface-200 text-surface-950 focus:border-primary-500 outline-none"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-bold text-surface-950 mb-1">الوصف (اختياري)</label>
          <textarea
            id="description"
            name="description"
            rows={2}
            defaultValue={initialData?.description || ""}
            className="w-full px-3 py-2 bg-white border border-surface-200 text-surface-950 focus:border-primary-500 outline-none"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-bold text-surface-950 mb-1">رابط الصورة (URL)</label>
          <input
            type="url"
            id="image"
            name="image"
            defaultValue={initialData?.image || ""}
            placeholder="https://..."
            dir="ltr"
            className="w-full px-3 py-2 bg-white border border-surface-200 text-surface-950 focus:border-primary-500 outline-none text-left"
          />
        </div>
      </div>

      {/* الأحجام */}
      <div className="border border-surface-200 p-4 bg-surface-50 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-surface-950">الأحجام (اختياري)</h4>
          <button type="button" onClick={addSize} className="text-xs font-bold bg-primary-100 text-primary-700 px-2 py-1 flex items-center gap-1 hover:bg-primary-200 transition-colors">
            <Plus className="w-3 h-3" /> إضافة حجم
          </button>
        </div>
        {sizes.map((size, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="اسم الحجم (مثال: كبير)"
              value={size.name}
              onChange={(e) => updateSize(index, "name", e.target.value)}
              className="flex-1 px-3 py-2 bg-white border border-surface-200 focus:border-primary-500 outline-none text-sm"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="السعر"
              value={size.price}
              onChange={(e) => updateSize(index, "price", e.target.value)}
              className="w-24 px-3 py-2 bg-white border border-surface-200 focus:border-primary-500 outline-none text-sm"
              required
            />
            <button type="button" onClick={() => removeSize(index)} className="p-2 text-error-500 hover:bg-error-50">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* الإضافات */}
      <div className="border border-surface-200 p-4 bg-surface-50 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-surface-950">الإضافات (اختياري)</h4>
          <button type="button" onClick={addAddon} className="text-xs font-bold bg-primary-100 text-primary-700 px-2 py-1 flex items-center gap-1 hover:bg-primary-200 transition-colors">
            <Plus className="w-3 h-3" /> إضافة
          </button>
        </div>
        {addons.map((addon, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="اسم الإضافة (مثال: جبنة زيادة)"
              value={addon.name}
              onChange={(e) => updateAddon(index, "name", e.target.value)}
              className="flex-1 px-3 py-2 bg-white border border-surface-200 focus:border-primary-500 outline-none text-sm"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="السعر"
              value={addon.price}
              onChange={(e) => updateAddon(index, "price", e.target.value)}
              className="w-24 px-3 py-2 bg-white border border-surface-200 focus:border-primary-500 outline-none text-sm"
              required
            />
            <button type="button" onClick={() => removeAddon(index)} className="p-2 text-error-500 hover:bg-error-50">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
      >
        {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
        {initialData ? "تحديث الصنف" : "حفظ الصنف"}
      </button>
    </form>
  );
}
