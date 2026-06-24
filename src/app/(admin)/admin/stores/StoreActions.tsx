"use client";

import { useState, useTransition } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { toggleStoreStatus } from "./new/actions"; // We'll export it from new/actions.ts for now

interface StoreActionsProps {
  storeId: string;
  storeName: string;
  status: "ACTIVE" | "SUSPENDED" | "DELETED";
}

export function StoreActions({ storeId, storeName, status }: StoreActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const isActive = status === "ACTIVE";

  const handleToggle = () => {
    startTransition(async () => {
      const newStatus = isActive ? "suspend" : "activate";
      await toggleStoreStatus(storeId, newStatus);
    });
  };

  const handleDelete = () => {
    if (deleteConfirmText !== storeName) return;
    startTransition(async () => {
      await toggleStoreStatus(storeId, "delete");
      setShowDeleteModal(false);
    });
  };

  if (status === "DELETED") return null;

  return (
    <div className="flex items-center gap-4">
      {/* Toggle Switch */}
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 ${
          isActive ? "bg-green-500" : "bg-red-500"
        }`}
        dir="ltr"
        title={isActive ? "إيقاف المتجر" : "تفعيل المتجر"}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isActive ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>

      {/* Delete Button */}
      <button
        onClick={() => setShowDeleteModal(true)}
        disabled={isPending}
        className="p-2 rounded-xl hover:bg-red-50 text-surface-800/50 hover:text-red-500 transition-colors disabled:opacity-50"
        title="حذف"
      >
        {isPending && showDeleteModal ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
      </button>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-6 animate-fade-in">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-surface-950">حذف المتجر</h3>
                <p className="text-surface-600 mt-2">
                  هل أنت متأكد من حذف المتجر <span className="font-bold text-surface-900">{storeName}</span>؟ هذا الإجراء لا يمكن التراجع عنه بسهولة.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-surface-950 mb-2">
                اكتب <span className="text-red-600 select-all">{storeName}</span> للتأكيد:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full px-4 py-2 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                placeholder="اسم المتجر..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}
                disabled={isPending}
                className="flex-1 px-4 py-2 bg-surface-100 text-surface-700 font-bold rounded-xl hover:bg-surface-200 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteConfirmText !== storeName || isPending}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "حذف المتجر"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
