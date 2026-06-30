"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader2, Save, X } from "lucide-react";
import toast from "react-hot-toast";
import { createBanner, updateBanner, deleteBanner, toggleBannerStatus } from "./actions";
import { StoreBanner } from "@prisma/client";

export function BannersClient({ initialBanners }: { initialBanners: StoreBanner[] }) {
  const [banners, setBanners] = useState<StoreBanner[]>(initialBanners);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<StoreBanner | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const openModal = (banner?: StoreBanner) => {
    if (banner) {
      setEditingBanner(banner);
      setPreviewImage(banner.image);
    } else {
      setEditingBanner(null);
      setPreviewImage(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
    setPreviewImage(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    if (editingBanner) {
      formData.append("id", editingBanner.id);
    }

    try {
      const result = editingBanner
        ? await updateBanner(formData)
        : await createBanner(formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success || "تم الحفظ بنجاح");
        closeModal();
        // Option 1: rely on server action revalidation (requires page reload to see changes if not using router.refresh)
        // Since we are not using router.refresh here, let's just reload the page for simplicity
        window.location.reload();
      }
    } catch (error) {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا البانر؟")) return;

    try {
      const result = await deleteBanner(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success || "تم الحذف بنجاح");
        setBanners(banners.filter(b => b.id !== id));
      }
    } catch (error) {
      toast.error("حدث خطأ غير متوقع");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const result = await toggleBannerStatus(id, !currentStatus);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success || "تم تحديث الحالة");
        setBanners(banners.map(b => b.id === id ? { ...b, isActive: !currentStatus } : b));
      }
    } catch (error) {
      toast.error("حدث خطأ غير متوقع");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-surface-950">العروض والبانرات</h2>
        <button
          onClick={() => openModal()}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة بانر</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white border border-surface-200 rounded-2xl overflow-hidden group">
            <div className="relative aspect-[2.2/1] w-full bg-surface-100">
              <Image
                src={banner.image}
                alt={banner.title || "بانر"}
                fill
                className={`object-cover ${!banner.isActive ? "grayscale opacity-60" : ""}`}
              />
              <div className="absolute top-3 end-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openModal(banner)}
                  className="w-8 h-8 bg-white text-primary-600 rounded-full flex items-center justify-center shadow-md hover:bg-primary-50 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="w-8 h-8 bg-white text-error-600 rounded-full flex items-center justify-center shadow-md hover:bg-error-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-surface-950 truncate max-w-[150px]">
                  {banner.title || "بدون عنوان"}
                </h3>
                {banner.link && (
                  <p className="text-xs text-surface-500 truncate max-w-[150px] mt-1" dir="ltr">
                    {banner.link}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleToggleStatus(banner.id, banner.isActive)}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                  banner.isActive
                    ? "bg-success-50 text-success-700 hover:bg-success-100"
                    : "bg-surface-100 text-surface-600 hover:bg-surface-200"
                }`}
              >
                {banner.isActive ? "مفعل" : "معطل"}
              </button>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center bg-surface-50 rounded-2xl border border-surface-200 border-dashed">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
              <ImageIcon className="w-8 h-8 text-surface-400" />
            </div>
            <p className="text-surface-600 font-medium mb-2">لا توجد عروض مضافة بعد</p>
            <p className="text-sm text-surface-400">أضف بانرات لعرضها في واجهة المتجر</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-surface-100 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold text-surface-950">
                {editingBanner ? "تعديل البانر" : "إضافة بانر جديد"}
              </h3>
              <button onClick={closeModal} className="text-surface-400 hover:text-surface-950 transition-colors bg-surface-50 p-2 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-surface-950 mb-2">
                  صورة البانر <span className="text-error-500">*</span>
                </label>
                <p className="text-xs text-surface-500 mb-3">
                  يفضل أن تكون الصورة بعرضية بنسبة 2.2:1 (مثال: 1100x500 بكسل)
                </p>
                <div className="relative border-2 border-dashed border-surface-300 rounded-2xl overflow-hidden group hover:border-primary-500 transition-colors bg-surface-50">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    required={!editingBanner}
                  />
                  {previewImage ? (
                    <div className="aspect-[2.2/1] w-full relative">
                      <Image src={previewImage} alt="Preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white font-bold flex items-center gap-2">
                          <Edit2 className="w-5 h-5" />
                          تغيير الصورة
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[2.2/1] w-full flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                        <ImageIcon className="w-6 h-6 text-surface-400 group-hover:text-primary-500" />
                      </div>
                      <p className="font-bold text-surface-700 mb-1">انقر لاختيار صورة</p>
                      <p className="text-xs text-surface-400">JPG, PNG, WEBP (Max. 5MB)</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-surface-950 mb-2">عنوان البانر (اختياري)</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingBanner?.title || ""}
                  placeholder="مثال: خصم 20% على الوجبات العائلية"
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-surface-950 mb-2">رابط التوجيه (اختياري)</label>
                <input
                  type="url"
                  name="link"
                  defaultValue={editingBanner?.link || ""}
                  placeholder="https://..."
                  dir="ltr"
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-left"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-surface-950 mb-2">الترتيب</label>
                <input
                  type="number"
                  name="sortOrder"
                  defaultValue={editingBanner?.sortOrder || 0}
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                />
              </div>

              <div className="pt-4 border-t border-surface-100 flex items-center gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 font-bold text-surface-600 bg-surface-100 hover:bg-surface-200 rounded-xl transition-colors"
                  disabled={isLoading}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>{editingBanner ? "حفظ التعديلات" : "إضافة البانر"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
