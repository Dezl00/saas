"use client";

import { useState } from "react";
import { X, Plus, Minus, ShoppingBag, Truck, Store as StoreIcon, Loader2, Check } from "lucide-react";
import { useCart } from "./CartProvider";
import { formatPrice, formatWhatsappNumber } from "@/lib/utils";
import { placeOrderAction } from "@/app/store/[subdomain]/actions";
import toast from "react-hot-toast";

type Branch = { id: string; name: string; address: string | null };
type DeliveryArea = { id: string; name: string; fee: number };
type StoreData = { id: string; name: string; whatsappNumber: string | null; enableWhatsappOrders: boolean; currency: string; primaryColor?: string | null; secondaryColor?: string | null };

export function CartSidebar({
  store,
  branches,
  deliveryAreas
}: {
  store?: StoreData;
  branches?: Branch[];
  deliveryAreas?: DeliveryArea[];
}) {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, total, clearCart } = useCart();
  
  const [isCheckout, setIsCheckout] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  if (!isCartOpen) return null;

  // Calculate final total
  const deliveryFee = deliveryType === "DELIVERY" && selectedArea 
    ? (deliveryAreas?.find(a => a.id === selectedArea)?.fee || 0) 
    : 0;
  
  const finalTotal = total + deliveryFee;

  const handleSubmitOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!store) return;

    if (deliveryType === "DELIVERY" && !selectedArea) {
      toast.error("يرجى اختيار منطقة التوصيل");
      return;
    }
    if (deliveryType === "PICKUP" && !selectedBranch) {
      toast.error("يرجى اختيار الفرع");
      return;
    }

    setIsSubmitting(true);
    setValidationErrors({});

    const formData = new FormData(e.currentTarget);
    const customerName = formData.get("customerName") as string;
    const customerPhone = formData.get("customerPhone") as string;
    const customerAddress = formData.get("customerAddress") as string;
    
    const newErrors: Record<string, string> = {};
    if (!customerName || customerName.trim() === "") newErrors.customerName = "يرجى إدخال الاسم كامل";
    if (!customerPhone || customerPhone.replace(/\D/g, "").length !== 11) newErrors.customerPhone = "رقم الهاتف يجب أن يتكون من 11 رقم بالضبط";
    if (deliveryType === "DELIVERY" && (!customerAddress || customerAddress.trim() === "")) newErrors.customerAddress = "يرجى إدخال العنوان التفصيلي";
    
    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    formData.append("deliveryType", deliveryType);
    formData.append("selectedArea", selectedArea);
    formData.append("selectedBranch", selectedBranch);
    formData.append("storeId", store.id);
    formData.append("cartItems", JSON.stringify(items));
    formData.append("subtotal", total.toString());
    formData.append("deliveryFee", deliveryFee.toString());
    formData.append("total", finalTotal.toString());

    try {
      const res = await placeOrderAction(formData);
      
      if (res.error) {
        toast.error(res.error);
        setIsSubmitting(false);
        return;
      }

      // Success
      clearCart();
      setIsCartOpen(false);
      setIsCheckout(false);

      if (store.enableWhatsappOrders && store.whatsappNumber) {
        // Redirect to WhatsApp
        const waNumber = formatWhatsappNumber(store.whatsappNumber);
        let msg = `*طلب جديد من ${store.name}*\n\n`;
        msg += `*الاسم:* ${formData.get("customerName")}\n`;
        msg += `*الهاتف:* ${formData.get("customerPhone")}\n`;
        if (deliveryType === "DELIVERY") {
          msg += `*التوصيل إلى:* ${deliveryAreas?.find(a=>a.id===selectedArea)?.name} - ${formData.get("customerAddress")}\n`;
        } else {
          msg += `*استلام من فرع:* ${branches?.find(b=>b.id===selectedBranch)?.name}\n`;
        }
        msg += `\n*الطلبات:*\n`;
        items.forEach(item => {
          msg += `- ${item.quantity}x ${item.name} (${formatPrice(item.price, store.currency)})\n`;
        });
        msg += `\n*الإجمالي المطلوب:* ${formatPrice(finalTotal, store.currency)}`;
        
        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
      } else {
        alert("تم إرسال طلبك بنجاح!");
      }

    } catch (err) {
      toast.error("حدث خطأ أثناء إرسال الطلب");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
        onClick={() => { setIsCartOpen(false); setIsCheckout(false); }}
      />

      {/* Sidebar */}
      <div className="fixed top-0 end-0 h-full w-full sm:w-[450px] bg-white z-50 flex flex-col animate-slide-in-right border-s border-surface-200">
        {/* Header */}
        <div className="p-4 border-b border-surface-200 flex items-center justify-between bg-surface-50">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-100 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-lg font-bold text-surface-950">
              {isCheckout ? "إتمام الطلب" : "سلة المشتريات"}
            </h2>
          </div>
          <button
            onClick={() => { setIsCartOpen(false); setIsCheckout(false); }}
            className="w-10 h-10 bg-white border border-surface-200 flex items-center justify-center hover:bg-surface-100 transition-colors"
          >
            <X className="w-5 h-5 text-surface-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-surface-500 space-y-4">
              <ShoppingBag className="w-16 h-16 opacity-20" />
              <p className="text-lg">سلة المشتريات فارغة</p>
            </div>
          ) : (
            !isCheckout ? (
              // Cart Items List
              items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-white border border-surface-200 p-3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover border border-surface-200"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-surface-100 flex items-center justify-center border border-surface-200">
                      <ShoppingBag className="w-8 h-8 text-surface-300" />
                    </div>
                  )}
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-surface-950 line-clamp-2 text-sm leading-tight">{item.name}</h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-surface-400 hover:text-error-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="font-black text-primary-600 text-sm">
                        {formatPrice(item.price, store?.currency)}
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 bg-surface-50 p-1 border border-surface-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center bg-white border border-surface-200 text-surface-600 hover:text-primary-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center bg-white border border-surface-200 text-surface-600 hover:text-primary-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Checkout Form
              <form id="checkout-form" onSubmit={handleSubmitOrder} noValidate className="space-y-6 animate-fade-in pb-10">

                {/* Toggle Delivery / Pickup */}
                <div className="flex bg-surface-100 p-1.5 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => { setDeliveryType("DELIVERY"); setValidationErrors({}); }}
                    className={`flex-1 flex justify-center items-center gap-2 py-3 text-sm font-bold transition-all rounded-xl ${
                      deliveryType === "DELIVERY" ? "bg-primary-500 text-white shadow-md shadow-primary-500/20" : "text-surface-500 hover:text-surface-950 hover:bg-surface-200/50"
                    }`}
                  >
                    <Truck className={`w-4 h-4 ${deliveryType === "DELIVERY" ? "text-white" : ""}`} />
                    توصيل للمنزل
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDeliveryType("PICKUP"); setValidationErrors({}); }}
                    className={`flex-1 flex justify-center items-center gap-2 py-3 text-sm font-bold transition-all rounded-xl ${
                      deliveryType === "PICKUP" ? "bg-primary-500 text-white shadow-md shadow-primary-500/20" : "text-surface-500 hover:text-surface-950 hover:bg-surface-200/50"
                    }`}
                  >
                    <StoreIcon className={`w-4 h-4 ${deliveryType === "PICKUP" ? "text-white" : ""}`} />
                    استلام من الفرع
                  </button>
                </div>

                {deliveryType === "DELIVERY" && deliveryAreas && deliveryAreas.length > 0 && (
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-surface-950">اختر منطقة التوصيل *</label>
                    <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="w-full p-3 bg-white border border-surface-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                      required
                    >
                      <option value="">-- اختر منطقتك --</option>
                      {deliveryAreas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.name} (+{formatPrice(area.fee, store?.currency)})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {deliveryType === "PICKUP" && branches && branches.length > 0 && (
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-surface-950">اختر الفرع للاستلام *</label>
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="w-full p-3 bg-white border border-surface-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                      required
                    >
                      <option value="">-- اختر الفرع الأقرب لك --</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name} {branch.address ? `(${branch.address})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-surface-950 mb-1 block">الاسم كامل *</label>
                    <input name="customerName" className={`w-full p-3 bg-white border rounded-xl outline-none transition-colors ${validationErrors.customerName ? 'border-error-500 focus:border-error-500 bg-error-50' : 'border-surface-200 focus:border-primary-500'}`} placeholder="اكتب اسمك كامل" />
                    {validationErrors.customerName && <p className="text-error-500 text-xs mt-1 font-bold">{validationErrors.customerName}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-bold text-surface-950 mb-1 block">رقم الهاتف *</label>
                    <input name="customerPhone" type="tel" dir="ltr" className={`w-full p-3 bg-white border rounded-xl outline-none text-end transition-colors ${validationErrors.customerPhone ? 'border-error-500 focus:border-error-500 bg-error-50' : 'border-surface-200 focus:border-primary-500'}`} placeholder="01xxxxxxxxx" />
                    {validationErrors.customerPhone && <p className="text-error-500 text-xs mt-1 font-bold">{validationErrors.customerPhone}</p>}
                  </div>
                  
                  {deliveryType === "DELIVERY" && (
                    <div>
                      <label className="text-sm font-bold text-surface-950 mb-1 block">العنوان التفصيلي *</label>
                      <textarea name="customerAddress" rows={2} className={`w-full p-3 bg-white border rounded-xl outline-none transition-colors ${validationErrors.customerAddress ? 'border-error-500 focus:border-error-500 bg-error-50' : 'border-surface-200 focus:border-primary-500'}`} placeholder="الشارع، العمارة، الدور، الشقة..." />
                      {validationErrors.customerAddress && <p className="text-error-500 text-xs mt-1 font-bold">{validationErrors.customerAddress}</p>}
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-bold text-surface-950 mb-1 block">ملاحظات إضافية (اختياري)</label>
                    <textarea name="notes" rows={2} className="w-full p-3 bg-white border border-surface-200 rounded-xl focus:border-primary-500 outline-none transition-colors" placeholder="أي تفاصيل إضافية للطلب..." />
                  </div>
                </div>

              </form>
            )
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 bg-surface-50 border-t border-surface-200 space-y-4">
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-surface-600">
                <span>المجموع</span>
                <span>{formatPrice(total, store?.currency)}</span>
              </div>
              {deliveryType === "DELIVERY" && selectedArea && (
                <div className="flex justify-between text-sm text-surface-600">
                  <span>رسوم التوصيل</span>
                  <span>{formatPrice(deliveryFee, store?.currency)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-lg text-surface-950 pt-2 border-t border-surface-200">
                <span>الإجمالي النهائي</span>
                <span className="text-primary-600">{formatPrice(finalTotal, store?.currency)}</span>
              </div>
            </div>

            {!isCheckout ? (
              <button 
                onClick={() => setIsCheckout(true)}
                className="w-full py-4 text-white font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600"
              >
                المتابعة لإتمام الطلب
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setIsCheckout(false)}
                  className="px-6 py-4 bg-surface-200 hover:bg-surface-300 text-surface-700 font-bold rounded-2xl transition-colors"
                >
                  رجوع
                </button>
                <button 
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  className="flex-1 py-4 text-white font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 bg-primary-500 hover:bg-primary-600"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                  {isSubmitting ? "جاري الإرسال..." : "تأكيد وإرسال الطلب"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
