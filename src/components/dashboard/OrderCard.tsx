"use client";

import { useOptimistic, useTransition } from "react";
import { Clock, Truck, Store as StoreIcon } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { updateOrderStatus } from "@/app/(dashboard)/dashboard/orders/actions";
import { Order, OrderItem, Branch, DeliveryArea } from "@prisma/client";

const statusMap: Record<string, { label: string, color: string }> = {
  PENDING: { label: "قيد الانتظار", color: "bg-yellow-100 text-yellow-800" },
  CONFIRMED: { label: "مؤكد", color: "bg-blue-100 text-blue-800" },
  PREPARING: { label: "جاري التجهيز", color: "bg-purple-100 text-purple-800" },
  READY: { label: "جاهز", color: "bg-indigo-100 text-indigo-800" },
  DELIVERED: { label: "مكتمل", color: "bg-success-100 text-success-800" },
  CANCELLED: { label: "ملغي", color: "bg-error-100 text-error-800" },
};

type OrderWithRelations = Order & {
  items: OrderItem[];
  branch: Branch | null;
  deliveryArea: DeliveryArea | null;
};

export function OrderCard({ order, currency }: { order: OrderWithRelations, currency?: string }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, addOptimisticStatus] = useOptimistic(
    order.status,
    (state, newStatus: string) => newStatus
  );

  async function handleStatusUpdate(formData: FormData) {
    const newStatus = formData.get("status") as string;
    if (newStatus === optimisticStatus) return;

    startTransition(async () => {
      addOptimisticStatus(newStatus);
      await updateOrderStatus(formData);
    });
  }

  return (
    <div className="bg-white border border-surface-200 p-6 flex flex-col md:flex-row gap-6 transition-opacity" style={{ opacity: isPending ? 0.7 : 1 }}>
      {/* Order Info */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between border-b border-surface-100 pb-4">
          <div>
            <h3 className="font-bold text-lg text-surface-950">طلب رقم #{order.orderNumber}</h3>
            <p className="text-sm text-surface-500 flex items-center gap-1 mt-1">
              <Clock className="w-4 h-4" />
              {new Date(order.createdAt).toLocaleString('ar-EG')}
            </p>
          </div>
          <span className={`px-3 py-1 font-bold text-sm ${statusMap[optimisticStatus]?.color || 'bg-surface-100'}`}>
            {statusMap[optimisticStatus]?.label || optimisticStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-surface-500">العميل</p>
            <p className="font-bold text-surface-950">{order.customerName}</p>
            <p className="text-sm text-surface-950" dir="ltr">{order.customerPhone}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-surface-500">نوع الطلب</p>
            {order.deliveryType === "DELIVERY" ? (
              <div>
                <p className="font-bold text-surface-950 flex items-center gap-1">
                  <Truck className="w-4 h-4" /> توصيل ({order.deliveryArea?.name})
                </p>
                <p className="text-sm text-surface-950">{order.customerAddress}</p>
              </div>
            ) : (
              <div>
                <p className="font-bold text-surface-950 flex items-center gap-1">
                  <StoreIcon className="w-4 h-4" /> استلام من الفرع
                </p>
                <p className="text-sm text-surface-950">{order.branch?.name}</p>
              </div>
            )}
          </div>
        </div>

        {order.notes && (
          <div className="bg-yellow-50 p-3 border border-yellow-200 text-yellow-800 text-sm">
            <strong>ملاحظات العميل:</strong> {order.notes}
          </div>
        )}
      </div>

      {/* Order Items & Actions */}
      <div className="w-full md:w-80 bg-surface-50 border border-surface-200 p-4 space-y-4">
        <h4 className="font-bold text-surface-950 border-b border-surface-200 pb-2">تفاصيل الفاتورة</h4>
        <ul className="space-y-2 text-sm">
          {order.items.map(item => (
            <li key={item.id} className="flex justify-between">
              <span>{item.quantity}x {item.name}</span>
              <span className="font-medium text-surface-950">{formatPrice(Number(item.price), currency)}</span>
            </li>
          ))}
        </ul>
        
        <div className="border-t border-surface-200 pt-2 space-y-1 text-sm">
          <div className="flex justify-between text-surface-600">
            <span>المجموع</span>
            <span>{formatPrice(Number(order.subtotal), currency)}</span>
          </div>
          {Number(order.deliveryFee) > 0 && (
            <div className="flex justify-between text-surface-600">
              <span>التوصيل</span>
              <span>{formatPrice(Number(order.deliveryFee), currency)}</span>
            </div>
          )}
          <div className="flex justify-between font-black text-lg text-primary-600 pt-2 border-t border-surface-200">
            <span>الإجمالي</span>
            <span>{formatPrice(Number(order.total), currency)}</span>
          </div>
        </div>

        <form action={handleStatusUpdate} className="pt-4 border-t border-surface-200">
          <input type="hidden" name="orderId" value={order.id} />
          <label className="block text-sm font-bold text-surface-950 mb-2">تحديث حالة الطلب</label>
          <div className="flex gap-2">
            <select name="status" defaultValue={optimisticStatus} className="flex-1 p-2 bg-white border border-surface-200 focus:border-primary-500 outline-none">
              <option value="PENDING">قيد الانتظار</option>
              <option value="CONFIRMED">مؤكد (جاري التحضير)</option>
              <option value="DELIVERED">مكتمل (تم التسليم)</option>
              <option value="CANCELLED">ملغي</option>
            </select>
            <button type="submit" disabled={isPending} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold transition-colors">
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
