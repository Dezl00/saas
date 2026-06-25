"use client";

import { useState } from "react";
import { ArrowRight, Truck, Store as StoreIcon, Loader2, Check } from "lucide-react";
import { useCart } from "@/components/store/CartProvider";
import { formatPrice, formatWhatsappNumber } from "@/lib/utils";
import { placeOrderAction } from "@/app/store/[subdomain]/actions";
import toast from "react-hot-toast";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type Branch = { id: string; name: string; address: string | null };
type DeliveryArea = { id: string; name: string; fee: number };
type StoreData = { id: string; name: string; whatsappNumber: string | null; enableWhatsappOrders: boolean; currency: string; primaryColor?: string | null };

export function StoreCheckoutView({
  store,
  branches,
  deliveryAreas
}: {
  store: StoreData;
  branches: Branch[];
  deliveryAreas: DeliveryArea[];
}) {
  const { items, total, clearCart } = useCart();
  const params = useParams();
  const router = useRouter();
  const subdomain = params?.subdomain as string;
  
  const [deliveryType, setDeliveryType] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  if (items.length === 0) {
    router.replace(`/store/${subdomain}/cart`);
    return null;
  }

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
        router.push(`/store/${subdomain}`);
      } else {
        toast.success("تم إرسال طلبك بنجاح!");
        router.push(`/store/${subdomain}`);
      }

    } catch (err) {
      toast.error("حدث خطأ أثناء إرسال الطلب");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6 px-2">
        <Link 
          href={`/store/${subdomain}/cart`}
          className="w-10 h-10 bg-white border border-surface-200 rounded-xl flex items-center justify-center text-surface-600 hover:bg-surface-100 transition-colors active:scale-95"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-black text-surface-950">إتمام الطلب</h1>
      </div>

      <form onSubmit={handleSubmitOrder} className="space-y-6">
        <div className="bg-white border border-surface-200 rounded-[2rem] p-4 sm:p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-2 gap-3 p-1 bg-surface-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setDeliveryType("DELIVERY")}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-colors ${
                deliveryType === "DELIVERY"
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-surface-600 hover:bg-surface-200"
              }`}
            >
              <Truck className="w-4 h-4" />
              توصيل
            </button>
            <button
              type="button"
              onClick={() => setDeliveryType("PICKUP")}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-colors ${
                deliveryType === "PICKUP"
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-surface-600 hover:bg-surface-200"
              }`}
            >
              <StoreIcon className="w-4 h-4" />
              استلام
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-surface-950 mb-2">الاسم كامل</label>
              <input
                type="text"
                name="customerName"
                className={`w-full px-4 py-3 bg-surface-50 border ${validationErrors.customerName ? 'border-error-500' : 'border-surface-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500`}
                placeholder="أحمد محمد"
              />
              {validationErrors.customerName && <p className="text-error-500 text-xs mt-1">{validationErrors.customerName}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-surface-950 mb-2">رقم الهاتف</label>
              <input
                type="tel"
                name="customerPhone"
                dir="ltr"
                className={`w-full px-4 py-3 bg-surface-50 border ${validationErrors.customerPhone ? 'border-error-500' : 'border-surface-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500`}
                placeholder="01012345678"
              />
              {validationErrors.customerPhone && <p className="text-error-500 text-xs mt-1">{validationErrors.customerPhone}</p>}
            </div>

            {deliveryType === "DELIVERY" && (
              <>
                <div>
                  <label className="block text-sm font-bold text-surface-950 mb-2">منطقة التوصيل</label>
                  <div className="grid grid-cols-2 gap-3">
                    {deliveryAreas?.map((area) => (
                      <button
                        key={area.id}
                        type="button"
                        onClick={() => setSelectedArea(area.id)}
                        className={`p-3 text-sm text-start rounded-xl border transition-colors ${
                          selectedArea === area.id
                            ? "bg-primary-50 border-primary-500 text-primary-700"
                            : "bg-surface-50 border-surface-200 text-surface-700 hover:bg-surface-100"
                        }`}
                      >
                        <div className="font-bold mb-1">{area.name}</div>
                        <div className="text-primary-600">{formatPrice(area.fee, store.currency)}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-surface-950 mb-2">العنوان التفصيلي</label>
                  <textarea
                    name="customerAddress"
                    rows={3}
                    className={`w-full px-4 py-3 bg-surface-50 border ${validationErrors.customerAddress ? 'border-error-500' : 'border-surface-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none`}
                    placeholder="الشارع، رقم العمارة، رقم الشقة..."
                  />
                  {validationErrors.customerAddress && <p className="text-error-500 text-xs mt-1">{validationErrors.customerAddress}</p>}
                </div>
              </>
            )}

            {deliveryType === "PICKUP" && (
              <div>
                <label className="block text-sm font-bold text-surface-950 mb-2">اختر الفرع للاستلام</label>
                <div className="space-y-3">
                  {branches?.map((branch) => (
                    <button
                      key={branch.id}
                      type="button"
                      onClick={() => setSelectedBranch(branch.id)}
                      className={`w-full p-4 text-start rounded-xl border transition-colors ${
                        selectedBranch === branch.id
                          ? "bg-primary-50 border-primary-500"
                          : "bg-surface-50 border-surface-200 hover:bg-surface-100"
                      }`}
                    >
                      <div className={`font-bold ${selectedBranch === branch.id ? 'text-primary-900' : 'text-surface-950'}`}>{branch.name}</div>
                      {branch.address && (
                        <div className={`text-sm mt-1 ${selectedBranch === branch.id ? 'text-primary-600' : 'text-surface-500'}`}>
                          {branch.address}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Total Summary */}
        <div className="bg-white border border-surface-200 rounded-[2rem] p-6 shadow-sm">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center text-surface-600">
              <span className="text-sm font-bold">الطلبات ({items.length})</span>
              <span className="font-bold">{formatPrice(total, store.currency)}</span>
            </div>
            {deliveryType === "DELIVERY" && (
              <div className="flex justify-between items-center text-surface-600">
                <span className="text-sm font-bold">رسوم التوصيل</span>
                <span className="font-bold">{formatPrice(deliveryFee, store.currency)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-surface-200 flex justify-between items-center">
              <span className="text-surface-500 font-medium text-lg">الإجمالي النهائي</span>
              <span className="text-2xl font-black text-surface-950">{formatPrice(finalTotal, store.currency)}</span>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-70 text-white font-bold text-lg rounded-2xl transition-transform active:scale-[0.98] shadow-lg shadow-primary-500/20"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>تأكيد وإرسال الطلب</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
