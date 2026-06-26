"use client";

import { useState } from "react";
import { addCustomDomain, verifyDomainStatus, removeCustomDomain } from "@/app/(dashboard)/dashboard/settings/domain-actions";
import { Globe, CheckCircle, Clock, AlertTriangle, RefreshCw, Trash2, Copy } from "lucide-react";

export function CustomDomainWizard({ initialDomain }: { initialDomain: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    const formData = new FormData(e.currentTarget);
    const res = await addCustomDomain(formData);
    
    if (res?.error) setError(res.error);
    if (res?.success) setSuccess(res.success);
    setIsSubmitting(false);
  };

  const handleVerify = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    const res = await verifyDomainStatus(initialDomain.id);
    if (res?.error) setError(res.error);
    if (res?.success) setSuccess(res.success);
    setIsSubmitting(false);
  };

  const handleRemove = async () => {
    if (!confirm("هل أنت متأكد من حذف الدومين؟ سيتوقف موقعك عن العمل بهذا الدومين فوراً.")) return;
    setIsSubmitting(true);
    const res = await removeCustomDomain(initialDomain.id);
    if (res?.error) setError(res.error);
    setIsSubmitting(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("تم النسخ!");
  };

  if (!initialDomain) {
    return (
      <form onSubmit={handleAdd} className="max-w-xl space-y-4">
        {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
        <div>
          <label htmlFor="domain" className="block text-sm font-medium text-surface-950 mb-1">
            الدومين الخاص
          </label>
          <div className="flex items-center" dir="ltr">
            <span className="px-4 py-2.5 bg-surface-100 border border-e-0 border-surface-200 rounded-s-xl text-surface-600 font-medium">
              https://
            </span>
            <input
              type="text"
              id="domain"
              name="domain"
              placeholder="restaurant.com أو menu.restaurant.com"
              className="w-full px-3 py-2.5 bg-white border border-surface-200 text-surface-950 rounded-e-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all"
        >
          {isSubmitting ? "جاري الإضافة..." : "إضافة الدومين"}
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
      {success && <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">{success}</div>}

      <div className="flex items-center justify-between p-4 bg-surface-50 border border-surface-200 rounded-xl">
        <div>
          <p className="text-sm text-surface-500 mb-1">الدومين الحالي</p>
          <p className="font-bold text-lg text-surface-950" dir="ltr">{initialDomain.name}</p>
        </div>
        <div className="flex items-center gap-2">
          {initialDomain.status === "CONNECTED" ? (
            <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" /> متصل
            </span>
          ) : (
            <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-sm font-medium">
              <Clock className="w-4 h-4" /> قيد المعالجة ({initialDomain.status})
            </span>
          )}
        </div>
      </div>

      {initialDomain.status !== "CONNECTED" && initialDomain.dnsRecords && (
        <div className="bg-white border border-surface-200 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-surface-200 bg-surface-50">
            <h4 className="font-bold text-surface-950">إعدادات DNS المطلوبة</h4>
            <p className="text-sm text-surface-500 mt-1">
              يرجى إضافة هذه السجلات في لوحة تحكم الدومين الخاص بك (مثال: Hostinger, GoDaddy).
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left" dir="ltr">
              <thead className="bg-surface-50 border-b border-surface-200 text-surface-500 text-sm">
                <tr>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Value</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {initialDomain.dnsRecords.a && (
                  <tr>
                    <td className="px-4 py-3 font-mono text-sm">A</td>
                    <td className="px-4 py-3 font-mono text-sm">@</td>
                    <td className="px-4 py-3 font-mono text-sm">{initialDomain.dnsRecords.a}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => copyToClipboard(initialDomain.dnsRecords.a)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">نسخ</button>
                    </td>
                  </tr>
                )}
                {initialDomain.dnsRecords.cname && (
                  <tr>
                    <td className="px-4 py-3 font-mono text-sm">CNAME</td>
                    <td className="px-4 py-3 font-mono text-sm">www</td>
                    <td className="px-4 py-3 font-mono text-sm">{initialDomain.dnsRecords.cname}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => copyToClipboard(initialDomain.dnsRecords.cname)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">نسخ</button>
                    </td>
                  </tr>
                )}
                {initialDomain.dnsRecords.intendedNameservers && initialDomain.dnsRecords.intendedNameservers.map((ns: string, i: number) => (
                  <tr key={i}>
                    <td className="px-4 py-3 font-mono text-sm">NS</td>
                    <td className="px-4 py-3 font-mono text-sm">@</td>
                    <td className="px-4 py-3 font-mono text-sm">{ns}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => copyToClipboard(ns)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">نسخ</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 pt-4 border-t border-surface-200">
        {initialDomain.status !== "CONNECTED" && (
          <button
            onClick={handleVerify}
            disabled={isSubmitting}
            className="flex items-center gap-2 py-2 px-4 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-medium transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
            تحقق الآن
          </button>
        )}
        <button
          onClick={handleRemove}
          disabled={isSubmitting}
          className="flex items-center gap-2 py-2 px-4 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          حذف الدومين
        </button>
      </div>
    </div>
  );
}
