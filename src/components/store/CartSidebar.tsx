"use client";

import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/utils";

export function CartSidebar() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, total } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed top-0 end-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="p-4 border-b border-surface-100 flex items-center justify-between bg-surface-50">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-lg font-bold text-surface-950">سلة المشتريات</h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-200 transition-colors"
          >
            <X className="w-5 h-5 text-surface-500" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-surface-500 space-y-4">
              <ShoppingBag className="w-16 h-16 opacity-20" />
              <p className="text-lg">سلة المشتريات فارغة</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-white border border-surface-100 rounded-2xl p-3 shadow-sm">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-surface-100 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-surface-300" />
                  </div>
                )}
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-surface-950 line-clamp-2">{item.name}</h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-surface-400 hover:text-error-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="font-bold text-primary-600">
                      {formatPrice(item.price)}
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 bg-surface-50 rounded-lg p-1 border border-surface-100">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-white shadow-sm text-surface-600 hover:text-primary-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-white shadow-sm text-surface-600 hover:text-primary-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 bg-surface-50 border-t border-surface-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-surface-600 font-medium">الإجمالي</span>
              <span className="text-2xl font-black text-surface-950">
                {formatPrice(total)}
              </span>
            </div>
            <button className="w-full py-4 bg-gradient-to-l from-primary-500 to-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5 transition-all btn-shine">
              إتمام الطلب
            </button>
          </div>
        )}
      </div>
    </>
  );
}
