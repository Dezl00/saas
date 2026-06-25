"use client";

import { useCart } from "@/components/store/CartProvider";
import { ShoppingBag, ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useParams } from "next/navigation";

export function StoreCartView({ store }: { store: { id: string; name: string; currency: string; primaryColor?: string | null } }) {
  const { items, updateQuantity, removeItem, total } = useCart();
  const params = useParams();
  const subdomain = params?.subdomain as string;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mb-6 text-surface-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-surface-950 mb-2">السلة فارغة</h2>
        <p className="text-surface-600 mb-8 max-w-sm mx-auto">لم تقم بإضافة أي طلبات إلى سلتك حتى الآن، تصفح المنيو وأضف ما تشتهيه!</p>
        <Link
          href={`/store/${subdomain}`}
          className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-primary-500/20"
        >
          تصفح المنيو
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6 px-2">
        <Link 
          href={`/store/${subdomain}`}
          className="w-10 h-10 bg-white border border-surface-200 rounded-xl flex items-center justify-center text-surface-600 hover:bg-surface-100 transition-colors active:scale-95"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-black text-surface-950">سلة المشتريات</h1>
      </div>

      <div className="bg-white border border-surface-200 rounded-[2rem] p-4 sm:p-6 shadow-sm mb-6">
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 items-start pb-6 border-b border-surface-100 last:border-0 last:pb-0">
              {item.image ? (
                <div className="w-20 h-20 shrink-0 bg-surface-100 rounded-2xl overflow-hidden border border-surface-200">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 shrink-0 bg-surface-100 rounded-2xl border border-surface-200 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-surface-300" />
                </div>
              )}
              
              <div className="flex-1 flex flex-col min-h-[5rem]">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h3 className="font-bold text-surface-950 leading-tight">{item.name}</h3>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-surface-400 hover:text-error-500 transition-colors bg-surface-50 hover:bg-error-50 rounded-lg active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="font-bold text-primary-600 text-sm mb-auto">
                  {formatPrice(item.price, store.currency)}
                </div>

                {/* Quantity Control - Soft Tinted Style */}
                <div className="flex items-center gap-3 mt-3 self-start">
                  <div className="flex items-center bg-primary-50 rounded-xl p-1 border border-primary-100/50">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-primary-600 hover:bg-primary-100 transition-colors active:scale-95"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-sm w-8 text-center text-primary-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-primary-600 hover:bg-primary-100 transition-colors active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-surface-200 rounded-[2rem] p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <span className="text-surface-500 font-medium text-lg">الإجمالي</span>
          <span className="text-2xl font-black text-surface-950">{formatPrice(total, store.currency)}</span>
        </div>
        
        <Link
          href={`/store/${subdomain}/checkout`}
          className="w-full flex items-center justify-center gap-2 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg rounded-2xl transition-transform active:scale-[0.98] shadow-lg shadow-primary-500/20"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>المتابعة لتأكيد الطلب</span>
        </Link>
      </div>
    </div>
  );
}
