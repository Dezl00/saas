"use client";

import { useState } from "react";
import { Upload, Download, Loader2, AlertTriangle, FileSpreadsheet, Check } from "lucide-react";
import toast from "react-hot-toast";

export function ImportExportClient({ storeId }: { storeId: string }) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/menu/export");
      if (!response.ok) throw new Error("فشل التصدير");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `menu_export_${new Date().getTime()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("تم تصدير المنيو بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء تصدير البيانات");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx')) {
      toast.error("يجب اختيار ملف Excel (.xlsx)");
      return;
    }

    setIsImporting(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/menu/import", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "فشل الاستيراد");
      }
      
      toast.success(`تم استيراد ${data.count} عنصر بنجاح`);
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء استيراد البيانات");
      console.error(error);
    } finally {
      setIsImporting(false);
      e.target.value = ''; // reset input
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
      {/* Export Section */}
      <div className="bg-white border border-surface-200 rounded-2xl p-6 shadow-sm">
        <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-4">
          <Download className="w-6 h-6 text-primary-600" />
        </div>
        <h2 className="text-xl font-bold text-surface-900 mb-2">تصدير الأصناف</h2>
        <p className="text-surface-500 text-sm mb-6">
          قم بتنزيل كافة منتجاتك، التصنيفات، والإضافات في ملف إكسل واحد مرتب ومنظم. يمكنك التعديل عليه ورفعه مجدداً.
        </p>
        
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-primary-600 text-primary-600 font-bold rounded-xl hover:bg-primary-50 transition-colors disabled:opacity-50"
        >
          {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileSpreadsheet className="w-5 h-5" />}
          تنزيل ملف الإكسل (Excel)
        </button>
      </div>

      {/* Import Section */}
      <div className="bg-white border border-surface-200 rounded-2xl p-6 shadow-sm">
        <div className="w-12 h-12 bg-success-50 rounded-full flex items-center justify-center mb-4">
          <Upload className="w-6 h-6 text-success-600" />
        </div>
        <h2 className="text-xl font-bold text-surface-900 mb-2">استيراد الأصناف</h2>
        <p className="text-surface-500 text-sm mb-6">
          ارفع ملف الإكسل الذي قمت بتعديله أو الذي يحتوي على منتجاتك الجديدة لإضافتها دفعة واحدة.
        </p>
        
        <div className="relative">
          <input
            type="file"
            accept=".xlsx"
            onChange={handleImport}
            disabled={isImporting}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors pointer-events-none opacity-100">
            {isImporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            {isImporting ? "جاري رفع البيانات..." : "اختر ملف Excel لرفعه"}
          </div>
        </div>

        <div className="mt-4 p-3 bg-warning-50 rounded-lg flex gap-3 text-warning-800 text-xs">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p>
            تأكد من أن الأعمدة مطابقة للملف المصدر. سيتم تحديث المنتجات الموجودة مسبقاً إذا كان معرف المنتج (ID) موجوداً، وإلا سيتم إضافة منتجات جديدة.
          </p>
        </div>
      </div>
    </div>
  );
}
